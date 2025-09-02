import mongoose from "mongoose";
const { Schema } = mongoose;

const staffSchema = new Schema({

    staffId: { type: String, unique: true, trim: true }, // e.g. FAC-001, ADM-01
    name: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    phone: { type: String, unique: true },
    password: { type: String,  },
    profilePic: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"],  },
    dob: { type: Date,  },
    nationality: { type: String, default: "" },

    // 🔹 Address
    address: {
        street: { type: String,  },
        city: { type: String,  },
        state: { type: String,  },
        zipCode: { type: String,  },
        country: { type: String,  }
    },

    // 🔹 Employment Info
    collegeId: { type: String,  }, // link to college
    department: { type: String }, // optional for non-faculty roles
    designation: { type: String,  }, // Professor, Dean, Warden, etc.
    joiningDate: { type: Date,  },
    employmentType: { 
        type: String, 
        enum: ["permanent", "contract", "visiting"], 
        default: "permanent" 
    },
    salary: { type: Number, default: 0 },
    experience: { type: Number, default: 0 }, // in years
    qualifications: { type: String, default: "" },

    // 🔹 Role / Access Control
    role: { 
        type: String, 
        enum: [
            'UniversityAdmin', 
            'UniversityGoverningBody', 
            'UniversityRegistrar', 
            'UniversityExaminationBody', 
            'UniversityFinanceBody',
            "CollegeAdmin", 
            "CollegeDirector", 
            "CollegeDean", 
            "CollegeHOD", 
            "CollegeFaculty", 
            "CollegeHostelWarden", 
            "CollegeLibrarian", 
            "CollegeFinanceBody"
        ], 
    },
    status: { type: String, enum: ["active", "inactive", "on leave", "retired"], default: "active" },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },

    // 🔹 Teaching / Academic (only for faculty / HOD)
    subjects: [{ 
        code: { type: String,  },
        name: { type: String,  }
    }],

    // 🔹 Documents & Identity
    employeeCode: { type: String, unique: true }, // payroll/HR code
    aadhaarNo: { type: String, unique: true, sparse: true }, // India specific
    panNo: { type: String, unique: true, sparse: true },

    // 🔹 Leaves / Attendance
    leaves: {
        total: { type: Number, default: 0 },
        taken: { type: Number, default: 0 }
    },

    // 🔹 System Info
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff" }, // record created by
    updatedBy: { type: Schema.Types.ObjectId, ref: "Staff" }, // last updated by

}, { timestamps: true });

export default mongoose.model("Staff", staffSchema);
