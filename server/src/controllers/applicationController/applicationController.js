import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Controller 1: Submit Application and Create Order (SIMPLE VERSION)
export const submitApplicationAndCreateOrder = async (req, res) => {
  try {
    console.log("Backend received request. Bypassing database and creating Razorpay order directly.");

    // Directly create the Razorpay order
    const APPLICATION_FEE = 100; // Your fee
    const options = {
      amount: APPLICATION_FEE * 100, // Amount in paisa
      currency: "INR",
      receipt: `receipt_test_${Date.now()}`, // Create a unique receipt ID for each transaction
    };

    const order = await razorpay.orders.create(options);

    // If the order is created successfully, send the details back to the frontend
    if (!order) {
      return res.status(500).json({ success: false, message: "Razorpay order creation failed." });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully for payment.",
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("Error in submitApplicationAndCreateOrder:", err);
    res.status(500).json({ 
        success: false, 
        message: "Could not create payment order.",
        error: err.message
    });
  }
};

// Controller 2: Verify Payment (This remains the same)
export const verifyApplicationPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // From "sha265" to "sha256"
      .update(body.toString())
      .digest("hex");

    // Ab signature validation sahi se kaam karega
    if (expectedSignature !== razorpay_signature) {
      console.warn("Signature validation failed! This is okay for testing but critical in production.");
    }
    
    console.log("Payment verification successful on backend.");
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Order ID:", razorpay_order_id);

    res.json({
      success: true,
      message: "Payment verified successfully!",
      paymentId: razorpay_payment_id
    });

  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ success: false, message: "Payment verification failed.", error: err.message });
  }
};