// models/Course.js
import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
    semesterNumber: { type: Number, required: true },  // e.g. 1,2,...8
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
}, { _id: false });

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true },   // e.g. BTCSE2025
    degree: { type: String, required: true },                   // e.g. B.Tech
    branch: { type: String },                                   // optional
    specialization: { type: String },  
    totalSemester: { type: Number, required: true },           // e.g. 8
    semesters: [semesterSchema]
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);