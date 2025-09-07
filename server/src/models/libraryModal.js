import mongoose from "mongoose";
const { Schema } = mongoose;

// Copy schema
const copySchema = new Schema({
    copyId: { type: String, required: true }, // unique per copy
    occupiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null }, // studentId
    occupiedAt: { type: Date },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null } // kisne issue kiya
}, { _id: false });

// Book schema
const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String },
    isbn: { type: String, unique: true, sparse: true },
    category: { type: String },
    totalCopies: { type: Number, required: true },
    copies: [copySchema]
}, { _id: true });

// Library schema
const librarySchema = new Schema({
    collegeCode: { type: String, required: true },
    books: [bookSchema]
}, { timestamps: true });

export default mongoose.model("Library", librarySchema);
