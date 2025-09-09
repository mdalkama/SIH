import mongoose from "mongoose";
const { Schema } = mongoose;

//==============================================
// STUDENT ACADEMICS SCHEMA
// Sabse important schema, student ka poora academic record
//==============================================
const StudentAcademicsSchema = new Schema({
    registrationNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User model se link
    collegeCode: { type: String, required: true },
    courseCode: { type: String, required: true },
    session: { type: String, required: true }, // e.g., '2022-2026'
    currentYear: { type: Number, required: true, default: 1 },
    currentSemester: { type: Number, required: true, default: 1 },
    status: { type: String, enum: ['ACTIVE', 'GRADUATED', 'SUSPENDED'], default: 'ACTIVE' },
    
    // Student ki personal details
    personalDetails: {
        name: String,
        email: String,
        phone: String,
        dob: Date
    },

    // Puraane semesters ka result (immutable)
    previousSemesters: [{
        year: Number,
        semester: Number,
        examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
        subjects: [{
            subjectCode: String,
            internal: Number,
            external: Number,
            practical: Number,
            total: Number,
            grade: String,
            status: { type: String, enum: ['PASS', 'FAIL'] }
        }],
        sgpa: Number,
        overallResult: { type: String, enum: ['PASS', 'FAIL'] },
        publishedOn: { type: Date, default: Date.now }
    }],
    
    // Current semester, jiske marks abhi enter honge
    currentSemesterDetails: {
        year: Number,
        semester: Number,
        subjects: [{
            subjectCode: String,
            internal: { type: Number, default: null },
            external: { type: Number, default: null },
            practical: { type: Number, default: null }
        }]
    },
    
    // Exam ke liye registration details
    examRegistration: [{
        examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
        admitCardNumber: String,
        status: { type: String, enum: ['REGISTERED', 'CANCELLED'] }
    }],

    // Track promotions from one semester to another
    promotions: [{
        fromSemester: Number,
        toSemester: Number,
        promotedOn: { type: Date, default: Date.now },
        notes: String
    }]
}, { timestamps: true });


//==============================================
// EXAM SCHEMA
// Har semester ke exam ka blueprint
//==============================================
const ExamSchema = new Schema({
    name: { type: String, required: true }, // e.g., "B.Tech 3rd Semester Main Exam 2025"
    semester: { type: Number, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    published: { type: Boolean, default: false },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    publishedOn: { type: Date }
}, { timestamps: true });


const StudentAcademics = mongoose.model('StudentAcademics', StudentAcademicsSchema);
const Exam = mongoose.model('Exam', ExamSchema);

module.exports = { Subject, Course, StudentAcademics, Exam };

