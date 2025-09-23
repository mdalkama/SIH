import Application from "../../models/applicationModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
// You might need to import Student and StudentAcademics here later
// import Student from '../models/studentModel.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Controller 1: Submit Application and Create Order
export const submitApplicationAndCreateOrder = async (req, res) => {
  try {
    const applicationData = req.body; // Contains formData and uploadedFiles

    // Save the initial application with a 'PENDING_PAYMENT' status
    const newApplication = new Application(applicationData);
    await newApplication.save();

    // Create Razorpay order
    const APPLICATION_FEE = 100; // Your fixed fee
    const options = {
      amount: APPLICATION_FEE * 100,
      currency: "INR",
      receipt: `receipt_appl_${newApplication._id}`,
      notes: {
        applicationId: newApplication._id.toString(), // Pass the new application's ID
      },
    };

    const order = await razorpay.orders.create(options);

    // Update application with order ID
    newApplication.razorpayOrderId = order.id;
    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application saved, proceed to payment.",
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
      applicationId: newApplication._id,
    });
  } catch (err) {
    console.error("Error submitting application:", err);
    res
      .status(500)
      .json({ success: false, message: "Could not submit application." });
  }
};

// Controller 2: Verify Payment
export const verifyApplicationPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature." });
    }

    // Find the application using the order ID
    const application = await Application.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found for this order." });
    }

    // Update the application status
    application.razorpayPaymentId = razorpay_payment_id;
    application.status = "PAYMENT_SUCCESSFUL";
    await application.save();

    // --- CRITICAL STEP ---
    // Here, you would now create the permanent Student and StudentAcademics records
    // using the data from the 'application' document.
    // This is where you would also generate their registration number.
    // For example:
    // const newStudent = await Student.create({ name: application.applicantName, ... });
    // After creating the student, you could mark the application as 'COMPLETED'.
    application.status = "COMPLETED";
    await application.save();

    res.json({
      success: true,
      message: "Payment verified and application processed successfully!",
    });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed." });
  }
};
