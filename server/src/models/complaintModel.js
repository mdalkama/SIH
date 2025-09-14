import mongoose from "mongoose";
const { Schema } = mongoose;

const complaintSchema = new Schema({
    filedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Student', // A direct link to the student who complained
        required: true
    },
    
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College', // A direct link to the college
        required: true,
        index: true // Index for fast queries by college
    },
    
    // --- Complaint Details ---
    title: {
        type: String,
        required: [true, 'Title is required.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    category: {
        type: String,
        required: [true, 'Category is required.'], // e.g., 'Academic', 'Hostel', 'Infrastructure'
    },
    status: {
        type: String,
        enum: ["Submitted", "Under Review", "Resolved", "Rejected"],
        default: "Submitted"
    },
    
    assignedTo: { // Which staff member is handling it
        type: Schema.Types.ObjectId, 
        ref: 'Staff' 
    },
    resolutionDetails: { // Notes on how it was resolved
        type: String 
    }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);