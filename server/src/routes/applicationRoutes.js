import express from "express";
import { submitApplicationAndCreateOrder, verifyApplicationPayment } from "../controllers/applicationController/applicationController.js";


const router = express.Router();

// Public route to submit form data and create a payment order
router.post("/submit", submitApplicationAndCreateOrder);

// Public route to verify the payment after the user pays
router.post("/verify-payment", verifyApplicationPayment);

export default router;
