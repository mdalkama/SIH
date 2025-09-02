import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
    // personal details
    name: { type: String,  trim: true },
    fatherName: { type: String,  trim: true },
    motherName: { type: String,  trim: true },
    guardianName: { type: String, default: "", trim: true },
    parentsNumber: { type: String, default: "" },
    dob: { type: Date,  },
    gender: { type: String, enum: ["male", "female", "other"],  },
    aadharNumber: { type: String,  unique: true },
    abcNumber: { type: String, unique: true },
    caste: { type: String, default: "" },
    religion: { type: String, default: "" },
    category: { type: String, default: "" },

    // contact details
    email: { type: String,  unique: true, lowercase: true, trim: true },
    password: { type: String,  },
    phone: { type: String,  unique: true },
    alternatePhone: { type: String, default: "" },
    address: {
        street: { type: String,  },
        city: { type: String,  },
        state: { type: String,  },
        zipCode: { type: String,  },
        country: { type: String,  }
    },

    // academic details
    registrationNumber: { type: String,  unique: true },
    rollNumber: { type: String,  unique: true },
    college: { type: String, },
    degree: { type: String,  },
    branch: { type: String, default: "" },
    specialization: { type: String, default: "" },
    semester: { type: Number, min: 1, max: 12 },
    yearOfAdmission: { type: Number},
    yearOfPassing: { type: Number},

    // documents
    resumeLink: { type: String, default: "" },
    profilePictureLink: { type: String, default: "" },

    // status
    status: { type: String, enum: ['active', 'inactive', 'alumni'], default: 'active' },
    role: { type: String, enum: ['student'], default: 'student' }
}, { timestamps: true });
export default mongoose.model("Student", studentSchema);






