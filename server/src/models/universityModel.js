import mongoose from "mongoose";
const { Schema } = mongoose;

const universitySchema = new Schema({
    // --- Basic Information ---
    name: { 
        type: String, 
        required: [true, 'University name is required.'], 
        unique: true,
        trim: true 
    },
    universityId: { 
        type: String, 
        required: [true, 'A unique University ID is required.'], 
        unique: true, 
        uppercase: true,
        trim: true
    },
    logoUrl: { 
        type: String,
        trim: true 
    },
    establishmentDate: { 
        type: Date 
    },

    // --- Leadership Information ---
    chancellorAndVC: {
        chancellorName: { type: String, trim: true },
        viceChancellorName: { type: String, trim: true },
        registrarName: { type: String, trim: true }, // Top-level registrar name
    },

    // --- Contact & Location ---
    contact: {
        email: { 
            type: String, 
            required: [true, 'Contact email is required.'],
            trim: true
        },
        phone: { 
            type: String, 
            required: [true, 'Contact phone number is required.'],
            trim: true
        },
        website: { 
            type: String,
            trim: true
        }
    },
    location: {
        address: { type: String, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, default: 'India' },
        pincode: { type: String, trim: true }
    },

    // --- Financial & Legal Information ---
    financials: {
        bankName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        ifscCode: { type: String, trim: true },
        panNumber: { type: String, trim: true },
        gstin: { type: String, trim: true },
    },

    // --- Accreditations & Recognitions (Array to support multiple) ---
    accreditations: [{
        body: { type: String, required: true, trim: true }, // e.g., 'NAAC', 'NBA'
        grade: { type: String, trim: true }, // e.g., 'A++', 'B+'
        validFrom: { type: Date },
        validTill: { type: Date }
    }],

    // --- Relationships to other collections ---

    // References to staff members. 
    // This assumes a unified 'Staff' or 'User' model where roles are defined.
    governingBodyMembers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Staff' 
    }],
    registrars: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Staff' 
    }],
    examinationBodyMembers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Staff' 
    }],

    // Reference to all colleges affiliated with this university.
    affiliatedColleges: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'College' 
    }],

    // Reference to all courses offered under this university.
    coursesOffered: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }],
    
    // Reference to admission sessions managed by the university.
    admissionSessions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AdmissionSession' 
    }],
    
    // --- System Settings ---
    settings: {
        defaultCurrency: { type: String, default: 'INR' },
        timezone: { type: String, default: 'Asia/Kolkata' },
    }

}, { 
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true 
});

export default mongoose.model("University", universitySchema);

