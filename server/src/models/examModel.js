import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    registrationNumber: { type: String, required: true }, // easy lookup for student

    marks: [
        {
            subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
            internal: { type: Number, default: 0 },
            external: { type: Number, default: 0 },
            practical: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            status: { type: String, enum: ["PASS", "FAIL"], default: "PASS" },
            grade: { type: String } // e.g. A, B, C, F
        }
    ],

    overallResult: { type: String, enum: ["PASS", "FAIL"], default: "PASS" },
    sgpa: { type: Number },

    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }

}, { timestamps: true }); // each result will also have createdAt, updatedAt

const examSchema = new mongoose.Schema({
    examId: { type: String, required: true, unique: true }, // e.g. ENDSEM2025-SEM1
    name: { type: String, required: true },                 // e.g. End Semester
    semester: { type: Number, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    startDate: { type: Date },
    endDate: { type: Date },

    results: [resultSchema] // store student-wise results here
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);