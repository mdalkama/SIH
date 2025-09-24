import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
    // personal details
    name: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    guardianName: { type: String, default: "", trim: true },
    parentsNumber: { type: String, default: "" },
    dob: { type: Date },                          // map from formData.dateOfBirth
    gender: { type: String, enum: ["male", "female", "other"] },
    maritalStatus: { type: String, default: "" },  // NEW
    religion: { type: String, default: "" },
    category: { type: String, default: "" },
    aadharNumber: { type: String, unique: true, sparse: true },
    address: { type: String, default: "" },        // NEW
    rajasthanDomicile: { type: String, default: false }, // NEW
    familyIncome: { type: Number, default: 0 },    // NEW
    kashmiriMigrant: { type: String, default: false },   // NEW
    specialCategory: { type: String, default: "" },       // NEW
    identityProof: { type: String, default: "" },         // NEW
    identityProofNumber: { type: String, default: "" },   // NEW

    // contact details
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, unique: true },
    alternatePhone: { type: String, default: "" },

    // academic details
    tenthBoard: { type: String, default: "" },           // NEW
    tenthYear: { type: Number },
    tenthPercentage: { type: String, default: "" },
    twelfthBoard: { type: String, default: "" },
    twelfthYear: { type: Number },
    twelfthPercentage: { type: String, default: "" },
    registrationNumber: { type: String, unique: true, required: true },
    rollNumber: { type: String, unique: true, sparse: true },
    courseId: { type: String, default: "", required: true },
    semester: { type: Number, min: 1, max: 12, default: 1 },
    admissionDate: { type: Date },                       // NEW
    yearOfAdmission: { type: Number },
    yearOfPassing: { type: Number },
    collegeCode: { type: String, default: "", required: true },
    batch: { type: Number, required: true },

    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    // documents
    resumeLink: { type: String, default: "" },
    profilePictureLink: { type: String, default: "" },

    // status
    status: { type: String, enum: ["active", "inactive", "alumni"], default: "active" },
    role: { type: String, enum: ["student"], default: "student" }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
