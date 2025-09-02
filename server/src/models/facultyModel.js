import mongoose from "mongoose";
const { Schema } = mongoose;

const facultySchema = new Schema({
    staffId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    collegeId: {
        type: Number,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    subjects: { type: [String], default: [] }
}, { timestamps: true });
export default mongoose.model("Faculty", facultySchema);