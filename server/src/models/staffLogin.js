import mongoose from "mongoose";
const { Schema } = mongoose;

const staffLoginSchema = new Schema({
    staffId: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['UniversityAdmin', 'UniversityGoverningBody', 'UniversityRegistrar', 'UniversityExaminationBody', 'CollegeAdmin', 'CollegeDirector', 'CollegeDean', 'ColleegHOD', 'CollegeFaculty', 'CollegeWarden', 'CollegeLibrarian', 'CollegeFinanceBody' ], default: 'staff' }
}, { timestamps: true });

export default mongoose.model("StaffLogin", staffLoginSchema);