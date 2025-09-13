import StudentPayment from "../../models/studentPaymentModal.js";
import mongoose from "mongoose";
import Student from "../../models/studentModel.js";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
import crypto from 'crypto';
import html_to_pdf from 'html-pdf-node';

// Configure dotenv right at the top of this file
dotenv.config();


function getAmountInWords(num) {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    
    // Capitalize first letter and add "Only"
    return str.charAt(0).toUpperCase() + str.slice(1) + 'Only';
}


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const addFine = async (req, res) => {
    try {
        const { regNo } = req.params;
        const { reason, amount, studentId } = req.body;

        if (!req.user || !req.user.name || !req.user.role) {
            return res.status(401).json({ message: "Authentication error: User name and role not found in request." });
        }
        const { name: finedByName, role: finedByRole } = req.user;

        // Add an explicit check on the variable after destructuring
        if (typeof finedByName === 'undefined') {
            return res.status(500).json({ message: "Internal server error: Could not process user identity." });
        }

        let payment = await StudentPayment.findOne({ registrationNumber: regNo });

        if (!payment) {
            if (!studentId) {
                return res.status(400).json({ message: "studentId is required to create a new payment record." });
            }

            payment = new StudentPayment({
                registrationNumber: regNo,
                student: studentId,
                fines: [],
                semesters: [],
                paymentHistory: [],
            });
        }

        const newFine = {
            reason,
            amount,
            finedBy: finedByName,
            role: finedByRole,
            paidAmount: 0,
            status: "unpaid",
        };

        // Log 2: This is the most important log. It shows exactly what is being pushed to the array.
        console.log("Attempting to push the following fine object:", newFine);

        payment.fines.push(newFine);

        await payment.save();

        res.status(201).json({ message: "Fine added successfully", fines: payment.fines });

    } catch (err) {
        // Log 3: Log the full error object for better insight.
        console.error("Error occurred in addFine controller:", err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }

        res.status(500).json({ error: "An internal server error occurred." });
    }
};

// 🔹 Pay Fee (Fine or Semester)
const getSecureQuery = (req, regNo) => {
    if (!req.user || !req.user.collegeCode) {
        throw new Error("Authentication error: User college not found.");
    }
    return { registrationNumber: regNo, collegeCode: req.user.collegeCode };
};

// 1. CREATE RAZORPAY ORDER (For Online Payments)
export const createRazorpayOrder = async (req, res) => {
    try {
        const { regNo } = req.params;
        const { type, id, amount } = req.body;
        console.log("type", type, "id", id, "amount", amount);

        const paymentDoc = await StudentPayment.findOne(getSecureQuery(req, regNo));
        if (!paymentDoc) return res.status(404).json({ message: "Student payment record not found." });

        // Server-side validation of the amount to prevent tampering
        let validatedAmount = 0;
        if (type === 'fine') {
            const fine = paymentDoc.fines.id(id);
            if (!fine) return res.status(404).json({ message: "Fine not found." });
            validatedAmount = fine.amount - fine.paidAmount;
        } else if (type === 'semester') {
            const semester = paymentDoc.semesters.id(id);
            if (!semester) return res.status(404).json({ message: "Semester fee not found." });
            validatedAmount = (semester.tuitionFee + semester.examFee + semester.otherFee) - semester.paid;
        }
        console.log("amount", amount, "validatedAmount", validatedAmount);

        if (amount != validatedAmount) {
            return res.status(400).json({ message: "Amount mismatch. Please refresh and try again." });
        }
        
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${regNo}_${Date.now()}`,
            notes: {
                studentRegNo: regNo,
                paymentType: type,
                paymentDbId: id, 
                collegeCode: req.user.collegeCode
            }
        };

        const order = await razorpay.orders.create(options);
        
        res.json({ success: true, order, key_id: process.env.RAZORPAY_KEY_ID });

    } catch (err) {
        console.error("Error creating Razorpay order:", err);
        res.status(500).json({ success: false, message: "Could not create payment order." });
    }
};

// 2. VERIFY PAYMENT (Callback from Frontend)
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature." });
        }

        const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
        const { notes } = orderDetails;
        const { studentRegNo, paymentType, paymentDbId, collegeCode } = notes;
        const amountPaid = orderDetails.amount / 100;

        const payment = await StudentPayment.findOne({ registrationNumber: studentRegNo, collegeCode });
        if (!payment) return res.status(404).json({ message: "Student record not found post-payment." });

        if (paymentType === "fine") {
            const fine = payment.fines.id(paymentDbId);
            fine.paidAmount += amountPaid;
            fine.status = fine.paidAmount >= fine.amount ? "paid" : "unpaid";
            payment.paymentHistory.push({ type: "Fine Payment", description: fine.reason, amount: amountPaid, method: 'online', receiptNo: razorpay_payment_id, status: "paid" });
        } else if (paymentType === "semester") {
            const semester = payment.semesters.id(paymentDbId);
            semester.paid += amountPaid;
            payment.paymentHistory.push({ type: "Semester Fee", description: `Semester ${semester.semester} Fee`, amount: amountPaid, method: 'online', receiptNo: razorpay_payment_id, status: "paid" });
        }

        await payment.save();
        res.json({ success: true, message: "Payment verified and recorded successfully.", paymentId: razorpay_payment_id });

    } catch (err) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ success: false, message: "Internal server error during payment verification." });
    }
};

// 3. PAY FEE (For Cash/Cheque/Manual entry)
export const payFee = async (req, res) => {
    try {
        const { regNo } = req.params;
        const { type, id, amount, method, description, receiptNo } = req.body;

        if (method === 'online') {
            return res.status(400).json({ message: "Online payments must be processed via the order creation flow." });
        }

        const payment = await StudentPayment.findOne(getSecureQuery(req, regNo));
        if (!payment) return res.status(404).json({ message: "Student payment record not found" });

        if (type === "fine") {
            const fine = payment.fines.id(id);
            if (!fine) return res.status(404).json({ message: "Fine not found." });
            fine.paidAmount += amount;
            fine.status = fine.paidAmount >= fine.amount ? "paid" : "unpaid";
            payment.paymentHistory.push({ type: "Fine Payment", description: fine.reason, amount, method, receiptNo, status: "paid" });
        } else if (type === "semester") {
            const semester = payment.semesters.id(id);
            if (!semester) return res.status(404).json({ message: "Semester fee not found." });
            semester.paid += amount;
            payment.paymentHistory.push({ type: "Semester Fee", description: `Semester ${semester.semester} Fee`, amount, method, receiptNo, status: "paid" });
        }

        await payment.save();
        res.json({ message: "Payment recorded successfully", payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const downloadReceipt = async (req, res) => {
    try {
        const { regNo, receiptNo } = req.params;
        const { collegeCode } = req.user;

        const paymentDoc = await StudentPayment.findOne({ 
            registrationNumber: regNo, 
            collegeCode 
        }).populate('student', 'name course').populate('student.course', 'branch');

        if (!paymentDoc) return res.status(404).json({ message: "Payment record not found." });

        const transaction = paymentDoc.paymentHistory.find(p => p.receiptNo === receiptNo);
        if (!transaction) return res.status(404).json({ message: "Receipt not found." });

        // Use the helper function to get amount in words
        const amountInWords = getAmountInWords(transaction.amount);

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 0; }
                    .receipt-container { border: 2px solid #000; padding: 25px; margin: 20px; max-width: 800px; margin: auto; }
                    .header { display: flex; align-items: center; justify-content: center; text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 15px; }
                    .header img { width: 60px; height: 60px; margin-right: 20px; }
                    .header-text h2 { margin: 0; font-size: 18px; color: #d32f2f; }
                    .header-text h3 { margin: 5px 0 0 0; font-size: 16px; font-weight: normal; }
                    .receipt-title { text-align: center; margin: 20px 0; }
                    .receipt-title h1 { margin: 0; font-size: 24px; text-decoration: underline; }
                    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
                    .details-table th, .details-table td { border: 1px solid #ccc; padding: 8px; }
                    .details-table th { background-color: #f8f8f8; text-align: left; width: 25%; }
                    .particulars-table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 14px; }
                    .particulars-table th, .particulars-table td { border: 1px solid #ccc; padding: 10px; }
                    .particulars-table th { background-color: #f8f8f8; }
                    .text-right { text-align: right; }
                    .font-bold { font-weight: bold; }
                    .amount-words { margin-top: 20px; font-size: 14px; }
                    .signature-area { margin-top: 80px; text-align: right; }
                    .signature-area p { margin-top: 5px; font-size: 14px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; border-top: 1px solid #ccc; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="header">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" alt="Emblem">
                        <div class="header-text">
                            <h2>Government of Rajasthan</h2>
                            <h3>Department of College Education</h3>
                        </div>
                    </div>
                    <div class="receipt-title">
                        <h1>FEE RECEIPT</h1>
                    </div>
                    <table class="details-table">
                        <tr>
                            <th>Receipt No.</th>
                            <td>${transaction.receiptNo}</td>
                            <th>Payment Date</th>
                            <td>${new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                        </tr>
                        <tr>
                            <th>Student Name</th>
                            <td>${paymentDoc.student.name}</td>
                            <th>Registration No.</th>
                            <td>${paymentDoc.registrationNumber}</td>
                        </tr>
                         <tr>
                            <th>Course</th>
                            <td colspan="3">${paymentDoc.student.course?.branch || 'N/A'}</td>
                        </tr>
                    </table>
                    <table class="particulars-table">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Particulars</th>
                                <th class="text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="text-align: center;">1</td>
                                <td>
                                    <p class="font-bold">${transaction.type}</p>
                                    <p style="font-size: 12px; color: #555;">${transaction.description}</p>
                                </td>
                                <td class="text-right font-bold">₹ ${transaction.amount.toLocaleString('en-IN')}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" class="text-right font-bold">Total Amount Paid</td>
                                <td class="text-right font-bold">₹ ${transaction.amount.toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="amount-words">
                        <p><span class="font-bold">Amount in Words:</span> Rupees ${amountInWords}</p>
                    </div>
                    <div class="signature-area">
                        <p>_________________________</p>
                        <p>Authorised Signatory</p>
                    </div>
                    <div class="footer">
                        <p>This is a computer-generated receipt and does not require a physical signature.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const options = { format: 'A4' };
        const file = { content: htmlContent };

        const pdfBuffer = await html_to_pdf.generatePdf(file, options);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receipt-${receiptNo}.pdf`);
        res.send(pdfBuffer);

    } catch (err) {
        console.error("Error generating PDF receipt:", err);
        res.status(500).json({ message: "Failed to generate receipt." });
    }
};

// 🔹 Get all payment details
export const getPaymentDetails = async (req, res) => {
    try {
        const { regNo } = req.params;
        const payment = await StudentPayment.findOne({ registrationNumber: regNo }).populate("student");
        if (!payment) return res.status(404).json({ message: "Student not found" });

        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Get fines only
export const getFines = async (req, res) => {
    try {
        const { regNo } = req.params;
        const payment = await StudentPayment.findOne({ registrationNumber: regNo });
        if (!payment) return res.status(404).json({ message: "Student not found" });

        res.json(payment.fines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Get semester fees only
export const getSemesterFees = async (req, res) => {
    try {
        const { regNo } = req.params;
        const payment = await StudentPayment.findOne({ registrationNumber: regNo });
        if (!payment) return res.status(404).json({ message: "Student not found" });

        res.json(payment.semesters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Get pending payments
export const getPending = async (req, res) => {
    try {
        const { regNo } = req.params;
        const payment = await StudentPayment.findOne({ registrationNumber: regNo });
        if (!payment) return res.status(404).json({ message: "Student not found" });

        const pendingFines = payment.fines.filter(f => f.status === "unpaid");
        const pendingSemesters = payment.semesters.filter(s => s.paid < s.tuitionFee + s.examFee + s.otherFee);

        res.json({ fines: pendingFines, semesters: pendingSemesters });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Get paid payments
export const getPaid = async (req, res) => {
    try {
        const { regNo } = req.params;
        const payment = await StudentPayment.findOne({ registrationNumber: regNo });
        if (!payment) return res.status(404).json({ message: "Student not found" });

        const paidFines = payment.fines.filter(f => f.status === "paid");
        const paidSemesters = payment.semesters.filter(s => s.paid >= s.tuitionFee + s.examFee + s.otherFee);

        res.json({ fines: paidFines, semesters: paidSemesters });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Get payment history
export const getPaymentHistory = async (req, res) => {
    try {
        const { regNo } = req.params;
        const payment = await StudentPayment.findOne({ registrationNumber: regNo });
        if (!payment) return res.status(404).json({ message: "Student not found" });

        res.json(payment.paymentHistory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
