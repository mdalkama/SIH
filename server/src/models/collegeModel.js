import mongoose from "mongoose";
const { Schema } = mongoose;

const collegeSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    website: { type: String, default: "" },
    establishedYear: { type: Number },
    accreditation: { type: String, default: "" },
    coursesOffered: [{
        code: { type: String, required: true },
        name: { type: String, required: true }
    }], // array of course codes and names
    staff: [{ type: Schema.Types.ObjectId, ref: "CollegeStaff" }],
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model("College", collegeSchema);