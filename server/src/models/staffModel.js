import mongoose from "mongoose";
const { Schema } = mongoose;

const staffSchema = new Schema(
    {
        staffId: { type: String, unique: true, trim: true, sparse: true }, // e.g. FAC-001, ADM-01
        name: { type: String, trim: true, required: true },
        email: { type: String, unique: true, lowercase: true, trim: true, required: true },
        phone: { type: String, unique: true, sparse: true },
        password: { type: String, required: true }, // hashed password
        profilePic: { type: String, default: "" },
        gender: { type: String, enum: ["male", "female", "other"], required: true },
        dob: { type: Date },
        nationality: { type: String },

        // 🔹 Address
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
            country: { type: String }
        },

        // 🔹 Employment Info
        collegeCode: { type: String }, // link to college
        collegeId: { type: Schema.Types.ObjectId, ref: "College" },

        department: { type: String }, // optional for non-faculty roles
        designation: { type: String }, // Professor, Dean, Warden, etc.
        joiningDate: { type: Date },
        employmentType: {
            type: String,
            enum: ["permanent", "contract", "visiting"],
            default: "permanent"
        },
        salary: { type: Number, default: 0 },
        experience: { type: Number, default: 0 }, // in years
        qualifications: { type: String },

        // 🔹 Role / Access Control
        role: {
            type: String,
            enum: [
                "UniversityAdmin",
                "UniversityGoverningBody",
                "UniversityRegistrar",
                "UniversityExaminationBody",
                "UniversityFinanceBody",
                "UniversityExamCellStaff",
                "CollegeAdmin",
                "CollegeDirector",
                "CollegeDean",
                "CollegeHOD",
                "CollegeFaculty",
                "CollegeExaminationBody",
                "CollegeHostelWarden",
                "CollegeAdmissionDepartment",
                "CollegeLibrarian",
                "CollegeFinanceBody"
            ],
            required: true
        },
        status: {
            type: String,
            enum: ["active", "inactive", "on leave", "retired"],
            default: "active"
        },
        isVerified: { type: Boolean, default: false },
        lastLogin: { type: Date },

        // 🔹 Teaching / Academic (only for faculty / HOD)
        subjects: [
            {
                code: { type: String },
                name: { type: String }
            }
        ],

        // 🔹 Documents & Identity
        employeeCode: { type: String, unique: true, sparse: true },
        aadhaarNo: { type: String, unique: true, sparse: true, select: false },
        panNo: { type: String, unique: true, sparse: true, select: false },

        // 🔹 Leaves / Attendance
        leaves: {
            total: { type: Number, default: 0 },
            taken: { type: Number, default: 0 }
        },

        // 🔹 System Info
        createdBy: { type: Schema.Types.ObjectId, ref: "Staff" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "Staff" }
    },
    { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
