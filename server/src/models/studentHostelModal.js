import mongoose from "mongoose";
import { type } from "os";
const { Schema } = mongoose;

const complaintSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    issue: { type: String }, // e.g. Electricity, Water, Cleanliness
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
    hostelDetail: {
        hostelName: String,
        floorNumber: Number,
        roomNumber: String,
        bedNumber: String
    },
    createdAt: { type: Date, default: Date.now }
});

const visitorSchema = new Schema({
    name: { type: String, required: true },
    relation: { type: String },
    date: { type: Date, default: Date.now },
    purpose: { type: String }
});

const roomChangeRequestSchema = new Schema({
    reason: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    from: {
        hostel: { type: Schema.Types.ObjectId, ref: "Hostel" },
        floor: { type: Schema.Types.ObjectId, ref: "Floor" },
        room: { type: Schema.Types.ObjectId, ref: "Room" },
        bed: { type: Schema.Types.ObjectId, ref: "Bed" },
    },
    to: {
        hostel: { type: Schema.Types.ObjectId, ref: "Hostel" },
        floor: { type: Schema.Types.ObjectId, ref: "Floor" },
        room: { type: Schema.Types.ObjectId, ref: "Room" },
        bed: { type: Schema.Types.ObjectId, ref: "Bed" },
    }
});

const feeSchema = new Schema({
    month: { type: String, required: true }, // e.g. "2025-09" or "September-2025"
    amount: { type: Number, required: true },
    roomDetail: {
        hostel: String,
        floor: Number,
        room: String,
        bed: String
    },
    status: { type: String, enum: ["Unpaid", "Paid", "Partial", "Cancelled"], default: "Unpaid" },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { 
        type: Number, 
        default: function () { return this.amount - this.paidAmount } 
    },
    paidAt: { type: Date }
});

const studentHostelSchema = new Schema({
    registrationNumber: { type: String, unique: true, required: true },
    collegeCode:{type: String, required: true},
    occupant: { type: Schema.Types.ObjectId, ref: "Student", required: true }, // link with student

    currentHostel: {
        hostel: { type: Schema.Types.ObjectId, ref: "Hostel" },
        floor: { type: Schema.Types.ObjectId, ref: "Floor" },
        room: { type: Schema.Types.ObjectId, ref: "Room" },
        bed: { type: Schema.Types.ObjectId, ref: "Bed" },
    },

    complaints: [complaintSchema],
    visitors: [visitorSchema],
    roomChangeRequests: [roomChangeRequestSchema],

    fees: [feeSchema], // 👈 monthly breakdown of hostel fee
}, { timestamps: true });

export default mongoose.model("StudentHostel", studentHostelSchema);
