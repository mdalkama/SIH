import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentAcademicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAcademics",
      required: true,
    },
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    appliedOn: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "APPLIED",
        "SHORTLISTED",
        "REJECTED",
        "OFFER_ACCEPTED",
        "OFFER_DECLINED",
      ],
      default: "APPLIED",
    },

    resumeUrl: { type: String, required: true }, 
  },
  { _id: false }
);
const placementDriveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    packageLPA: { type: Number, required: true }, // in Lakhs Per Annum

    eligibleCourses: [{ type: String, required: true }],
    minCGPA: { type: Number, default: 6.0 },

    applicationDeadline: { type: Date, required: true },
    driveDate: { type: Date },

    status: {
      type: String,
      enum: ["UPCOMING", "OPEN", "CLOSED", "COMPLETED"],
      default: "UPCOMING",
    },

    applications: [applicationSchema],

    collegeCode: { type: String, required: true }, // To which college this drive belongs
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // The Placement Officer
  },
  { timestamps: true }
);

export default mongoose.model("PlacementDrive", placementDriveSchema);
