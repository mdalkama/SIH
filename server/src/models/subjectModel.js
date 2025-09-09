// models/Subject.js
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, default: 0 },
    type: { type: String, enum: ["CORE", "ELECTIVE", "LAB"], default: "CORE" },

    maxMarks: {
        internal: { type: Number, default: 30 },   // e.g. 30 marks internal
        external: { type: Number, default: 70 },   // e.g. 70 marks external
        practical: { type: Number, default: 0 }    // e.g. 0 if theory subject
    }
}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);