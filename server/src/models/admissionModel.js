import mongoose from "mongoose";
const { Schema } = mongoose;

// 🎓 Admission Session
const AdmissionSessionSchema = new Schema({
    name: { type: String, required: true}, // e.g., "2025-26 UG Admission"
    year: { type: Number, required: true },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ["upcoming", "active", "closed"], default: "upcoming" },
}, { timestamps: true });

// 📘 Course
const CourseSchema = new Schema({
    name: { type: String, required: true }, // e.g., B.Sc Computer Science
    code: { type: String, unique: true },
    durationYears: Number
}, { timestamps: true });

// 🏫 College
const CollegeSchema = new Schema({
    name: { type: String, required: true },
    address: String,
    affiliatedUniversity: { type: String },
    courses: [
        {
            courseId: { type: Schema.Types.ObjectId, ref: "AdmissionCourse" },
            seatCapacity: { type: Number, required: true },
            reservedSeats: {
                general: { type: Number, default: 0 },
                obc: { type: Number, default: 0 },
                sc: { type: Number, default: 0 },
                st: { type: Number, default: 0 },
                ews: { type: Number, default: 0 }
            }
        }
    ]
}, { timestamps: true });

// 👨‍🎓 Student Application Details (Embedded)
const StudentDetailsSchema = new Schema({
    applicantDetails: {
        applicantName: String,
        applicantNameHindi: String,
        fatherName: String,
        fatherNameHindi: String,
        motherName: String,
        motherNameHindi: String,
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        dateOfBirth: Date,
        email: String,
        mobile: String,
        maritalStatus: String,
        religion: String,
        nationality: { type: String, default: "Indian" },
        preferentialCategory: String,
        kashmiriMigrant: { type: String, enum: ["Yes", "No"], default: "No" },
        reservationCategory: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS"] },
        identityProof: String,
        identityNumber: String
    },

    addressDetails: {
        permanent: {
            addressLine1: String,
            addressLine2: String,
            state: String,
            district: String,
            cityVillage: String,
            pincode: Number
        },
        correspondence: {
            addressLine1: String,
            addressLine2: String,
            state: String,
            district: String,
            cityVillage: String,
            pincode: Number
        }
    },

    otherDetails: {
        parentIncome: String,
        parentIncomeAmount: Number,
        tfwsApplication: { type: String, enum: ["Yes", "No"], default: "No" }
    },

    qualificationDetails: {
        tenth: {
            board: String,
            year: Number,
            rollNo: String,
            marksType: { type: String, enum: ["Marks", "CGPA"] },
            maxMarks: Number,
            obtainedMarks: Number,
            percentage: Number
        },
        twelfth: {
            board: String,
            year: Number,
            rollNo: String,
            stream: String,
            percentage: Number
        },
        graduation: {
            degree: String,
            branch: String,
            university: String,
            year: Number,
            percentage: Number
        },
        masters: {
            degree: String,
            branch: String,
            university: String,
            year: Number,
            percentage: Number
        }
    },

    documents: {
        studentPhoto: String,
        studentSign: String,
        aadharCard: String,
        tenthMarksheet: String
    }
});

// 📋 Application (Main)
const ApplicationSchema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: "AdmissionSession", required: true },
    studentDetails: { type: StudentDetailsSchema, required: true },

    preferences: [
        {
            collegeId: { type: Schema.Types.ObjectId, ref: "AdmissionCollege" },
            courseId: { type: Schema.Types.ObjectId, ref: "AdmissionCourse" },
            preferenceOrder: Number
        }
    ],

    status: {
        type: String,
        enum: ["pending", "verified", "rejected", "waiting", "provisionallyAllocated", "confirmed"],
        default: "pending"
    },

    verification: {
        verifiedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
        date: Date,
        remarks: String
    },

    admitCard: {
        number: String,
        issuedOn: Date,
        examCenter: String
    },

    exam: {
        appeared: { type: Boolean, default: false },
        marks: {
            obtained: Number,
            total: Number,
            grade: String
        },
        rank: Number
    },

    rankings: [
        {
            collegeId: { type: Schema.Types.ObjectId, ref: "AdmissionCollege" },
            courseId: { type: Schema.Types.ObjectId, ref: "AdmissionCourse" },
            rank: Number
        }
    ],

    allocation: {
        round: Number,
        allocatedCollegeId: { type: Schema.Types.ObjectId, ref: "AdmissionCollege" },
        allocatedCourseId: { type: Schema.Types.ObjectId, ref: "AdmissionCourse" },
        status: {
            type: String,
            enum: ["waiting", "provisionallyAllocated", "confirmed", "rejected"],
            default: "waiting"
        }
    }
}, { timestamps: true });

export const AdmissionSession = mongoose.model("AdmissionSession", AdmissionSessionSchema);
export const Course = mongoose.model("AdmissionCourse", CourseSchema);
export const College = mongoose.model("AdmissionCollege", CollegeSchema);
export const Application = mongoose.model("Application", ApplicationSchema);
