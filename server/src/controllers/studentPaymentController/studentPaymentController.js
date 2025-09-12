import StudentPayment from "../../models/studentPaymentModal.js";
import mongoose from "mongoose";
import Student from "../../models/studentModel.js";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
import crypto from 'crypto';

// Configure dotenv right at the top of this file
dotenv.config();


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
                paymentDbId: id, // The MongoDB _id of the fine/semester
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
