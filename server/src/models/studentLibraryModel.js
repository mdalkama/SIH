import mongoose from "mongoose";
const { Schema } = mongoose;

// Activity history schema (logs every issue/return)
const activitySchema = new Schema({
  bookName: { type: String, required: true },
  copyId: { type: String, required: true },
  issuedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true }, // who issued it
  issuedAt: { type: Date, default: Date.now },
  returnedAt: { type: Date },
  fine: { type: Number, default: 0 }
}, { _id: false });

// Issued books schema (currently held by the student)
const issuedBookSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: "Library", required: true }, // reference to specific book
  copyId: { type: String, required: true }, // which copy
  issuedAt: { type: Date, default: Date.now },
  issuedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true } ,// librarian who issued
  renewals: { type: Number, default: 0 } 
}, { _id: false });

// Student library account schema
const studentLibrarySchema = new Schema({
  registrationNumber: { type: String, unique: true, required: true }, // unique per student
  occupiedBy: { type: Schema.Types.ObjectId, ref: "Student", required: true }, // which student
  collegeCode: { type: String, required: true },
  // Logs of all activities (issue/return/fine)
  activity: [activitySchema],

  // Books currently issued (max 5)
  issuedBooks: {
    type: [issuedBookSchema],
    validate: {
      validator: function (arr) {
        return arr.length <= 5; // capacity limit
      },
      message: "A student can only issue up to 5 books"
    }
  }
}, { timestamps: true });

export default mongoose.model("StudentLibrary", studentLibrarySchema);
