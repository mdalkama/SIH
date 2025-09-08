import StudentPayment from "../../models/studentPaymentModal.js";
import mongoose from "mongoose";
import Student from "../../models/studentModel.js";

// 🔹 Add Fine
export const addFine = async (req, res) => {
    try {
        const { regNo } = req.params;
        const { reason, finedBy, role, amount, studentId } = req.body;

        let payment = await StudentPayment.findOne({ registrationNumber: regNo });

        // Create new record if not exists
        if (!payment) {
            if (!studentId) return res.status(400).json({ message: "studentId required for new record" });

            payment = new StudentPayment({
                registrationNumber: regNo,
                student: studentId,
                fines: [],
                semesters: [],
                paymentHistory: [],
            });
        }

        payment.fines.push({
            reason,
            finedBy,
            role,
            amount,
            paidAmount: 0,
            status: "unpaid",
        });

        await payment.save();
        res.json({ message: "Fine added successfully", fines: payment.fines });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Pay Fee (Fine or Semester)
export const payFee = async (req, res) => {
    try {
        const { regNo } = req.params;
        const { type, id, amount, method, description, receiptNo } = req.body;

        // ✅ Check if amount is positive
        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than zero" });
        }

        const payment = await StudentPayment.findOne({ registrationNumber: regNo });
        if (!payment) return res.status(404).json({ message: "Student not found" });

        if (type === "fine") {
            const fine = payment.fines.id(id);
            if (!fine) return res.status(404).json({ message: "Fine not found" });

            // ✅ Check if payment exceeds remaining fine
            const remainingAmount = fine.amount - fine.paidAmount;
            if (amount > remainingAmount) {
                return res.status(400).json({ 
                    message: `Cannot pay more than remaining fine amount: ${remainingAmount}` 
                });
            }

            fine.paidAmount += amount;
            fine.status = fine.paidAmount >= fine.amount ? "paid" : "unpaid";

            payment.paymentHistory.push({
                date: new Date(),
                type: "Fine Payment",
                description: fine.reason,
                amount,
                method,
                receiptNo,
                status: "paid",
            });
        } else if (type === "semester") {
            const semester = payment.semesters.id(id);
            if (!semester) return res.status(404).json({ message: "Semester fee not found" });

            // ✅ Check if amount exceeds remaining semester fee
            const remainingAmount = semester.total - semester.paid;
            if (amount > remainingAmount) {
                return res.status(400).json({ 
                    message: `Cannot pay more than remaining semester fee: ${remainingAmount}` 
                });
            }

            semester.paid += amount;

            payment.paymentHistory.push({
                date: new Date(),
                type: "Semester Fee",
                description: semester.semester,
                amount,
                method,
                receiptNo,
                status: "paid",
            });
        } else {
            return res.status(400).json({ message: "Invalid payment type" });
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
