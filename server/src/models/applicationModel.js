import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    // Your entire schema definition remains exactly the same
    applicantName: { type: String, required: true },
    fatherName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    // ... all other fields

    uploadedFiles: { type: Object },
    status: {
        type: String,
        enum: ['PENDING_PAYMENT', 'PAYMENT_SUCCESSFUL', 'COMPLETED'],
        default: 'PENDING_PAYMENT'
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    
}, { timestamps: true });


// --- THIS IS THE FIX ---

// Check if the 'Application' model already exists in Mongoose's registry.
// If it does, use it. If not, create a new one.
const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;
