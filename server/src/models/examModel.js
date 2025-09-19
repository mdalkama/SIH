import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    examId: { type: String, required: true, unique: true },
    // e.g. ENDSEM2025-SEM5

    examName: { type: String, required: true },
    // e.g. End Semester Exam 2025

    examType: {
      type: String,
      enum: ["MIDSEM", "ENDSEM", "INTERNAL", "PRACTICAL", "SUPPLEMENTARY"],
      required: true,
    },

    semester: { type: Number, required: true },
    year: { type: Number, required: true },

    // ✅ Kis-kis course ke liye exam applicable hai
    courses: [
      {
        courseCode: { type: String, required: true }, // e.g. CSE101

        // 🔥 Course-specific timetable
        timetable: [
          {
            subjectCode: { type: String, required: true },
            subjectName: { type: String, required: true },
            examDate: { type: Date },
            session: { type: String, enum: ["FN", "AN"], required: true }, // Forenoon/Afternoon
          },
        ],
      },
    ],

    // ✅ Overall scheduling info
    startDate: { type: Date },
    endDate: { type: Date },

    status: {
      type: String,
      enum: [
        "CREATED",
        "OPEN_FOR_REGISTRATION",
        "CLOSED",
        "RESULT_PROCESSING",
        "SEAT_ALLOTMENT_DONE",
        "SEAT_ALLOTMENT_APPROVED",
        "PUBLISHED",
      ],
      default: "CREATED",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // exam board staff
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
