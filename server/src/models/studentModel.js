import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
    // personal details
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    guardianName: { type: String, default: "", trim: true },
    parentsNumber: { type: String, default: "" },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    aadharNumber: { type: String, required: true, unique: true },
    abcNumber: { type: String, unique: true },
    caste: { type: String, default: "" },
    religion: { type: String, default: "" },
    category: { type: String, default: "" },

    // contact details
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    alternatePhone: { type: String, default: "" },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },

    // academic details
    registrationNumber: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true },
    college: { type: String, required: true },
    degree: { type: String, required: true },
    branch: { type: String, default: "" },
    specialization: { type: String, default: "" },
    semester: { type: Number, required: true, min: 1, max: 12 },
    yearOfAdmission: { type: Number, required: true },
    yearOfPassing: { type: Number},

    // documents
    resumeLink: { type: String, default: "" },
    profilePictureLink: { type: String, default: "" },

    // status
    status: { type: String, enum: ['active', 'inactive', 'alumni'], default: 'active' },
    role: { type: String, enum: ['student'], default: 'student' }
}, { timestamps: true });
export default mongoose.model("Student", studentSchema);