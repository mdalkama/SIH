import mongoose from "mongoose";
const { Schema } = mongoose;

const feedbackSchema = new Schema({
    // Who submitted the feedback
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Student', 
        required: true
    },
    
    // College association
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College',
        required: true,
        index: true
    },
    
    // Feedback Details
    subject: {
        type: String,
        required: [true, 'A subject for the feedback is required.'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'A feedback message is required.']
    },
    category: {
        type: String,
        required: true,
        enum: ['Suggestion', 'Appreciation', 'General Feedback', 'Other']
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);