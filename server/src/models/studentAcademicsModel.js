import mongoose from "mongoose";

const subjectResultSchema = new mongoose.Schema({
    subjectCode: { type: String, required: true },   // e.g. CS501
    subjectName: { type: String, required: true },   // e.g. Data Structures
    internal: { type: Number, default: 0 },
    external: { type: Number, default: 0 },
    practical: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    grade: { type: String },
    status: { type: String, enum: ["PASS", "FAIL"], default: "PASS" }
}, { _id: false });

const previousResultSchema = new mongoose.Schema({
    examId: { type: String, required: true },          // ENDSEM2024-SEM4
    examName: { type: String },                        // End Semester Exam
    collegeCode: { type: String, required: true },
    courseCode: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },

    subjects: [subjectResultSchema],                   // all subject results
    sgpa: { type: Number },
    overallResult: { type: String, enum: ["PASS", "FAIL"], default: "PASS" },
    publishedOn: { type: Date }
}, { _id: false });

const currentExamRegistrationSchema = new mongoose.Schema({
    examId: { type: String, required: true },          // e.g. ENDSEM2025-SEM5
    examName: { type: String, required: true },
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
    courseCode: { type: String, required: true },
    collegeCode: { type: String, required: true },

    registrationDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["REGISTERED", "CANCELLED", "BLOCKED"],
        default: "REGISTERED"
    },

    // admit card info
    admitCardNumber: { type: String },
    admitCardIssuedOn: { type: Date },
    examCenter: { type: String },
    seatNumber: { type: String },
    instructions: { type: String },

    // attendance
    attendance: {
        present: { type: Boolean, default: false },
        markedOn: { type: Date }
    },

    // result (hidden until publish)
    result: {
        sgpa: { type: Number },
        overallResult: { type: String, enum: ["PASS", "FAIL"] },
        published: { type: Boolean, default: false }
    }
}, { _id: false });

const studentAcademicsSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    registrationNumber: { type: String, required: true },
    collegeCode: { type: String, required: true },
    courseCode: { type: String, required: true },

    // ✅ Past completed semesters
    previousResults: [previousResultSchema],

    // ✅ Current live exam registrations
    currentExamRegistrations: [currentExamRegistrationSchema]

}, { timestamps: true });

export default mongoose.model("StudentAcademics", studentAcademicsSchema);
