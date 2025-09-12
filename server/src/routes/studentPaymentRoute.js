import express from "express";
import {
    addFine,
    payFee,
    getPaymentDetails,
    getFines,
    getSemesterFees,
    getPending,
    getPaid,
    getPaymentHistory,
    createRazorpayOrder,
    verifyPayment
} from "../controllers/studentPaymentController/studentPaymentController.js";


const router = express.Router();

router.post("/:regNo/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);

// ✅ Add fine to student
router.post("/:regNo/fines", addFine);

// ✅ Pay fee (fine or semester)
router.post("/:regNo/pay", payFee);

// ✅ Get all payment details of a student
router.get("/:regNo", getPaymentDetails);

// ✅ Get only fines
router.get("/:regNo/fines", getFines);

// ✅ Get only semester fees
router.get("/:regNo/semesters", getSemesterFees);

// ✅ Get pending payments
router.get("/:regNo/pending", getPending);

// ✅ Get paid payments
router.get("/:regNo/paid", getPaid);

// ✅ Get payment history
router.get("/:regNo/history", getPaymentHistory);

export default router;
