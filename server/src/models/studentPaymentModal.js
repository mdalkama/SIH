import mongoose from "mongoose";
const { Schema } = mongoose;

// Fine schema
const fineSchema = new Schema({
    reason: { type: String, required: true },
    finedBy: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
}, { timestamps: true });

// Semester schema
const semesterSchema = new Schema({
    semester: { type: String, required: true },
    fees: { type: Number, required: true },
    paid: { type: Number, default: 0 },
}, { timestamps: true });

// Payment history schema
const historySchema = new Schema({
    date: { type: Date, default: Date.now },
    type: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "online", "cheque"], required: true },
    receiptNo: { type: String, required: true },
    status: { type: String, enum: ["paid", "failed", "pending"], default: "paid" },
}, { timestamps: true });

// Stats schema (auto-calculated)
const statsSchema = new Schema({
    totalFine: { type: Number, default: 0 },
    fineCollected: { type: Number, default: 0 },
    finePending: { type: Number, default: 0 },
    totalSemester: { type: Number, default: 0 },
    semesterCollected: { type: Number, default: 0 },
    semesterPending: { type: Number, default: 0 },
    overallCollected: { type: Number, default: 0 },
    overallPending: { type: Number, default: 0 },
});

// Main StudentPayment schema
const studentPaymentSchema = new Schema({
    registrationNumber: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    collegeCode: { type: String, required: true },
    fines: [fineSchema],
    semesters: [semesterSchema],
    paymentHistory: [historySchema],
    stats: statsSchema,
}, { timestamps: true });


// 🔹 Pre-save hook to auto-calc stats
studentPaymentSchema.pre("save", function (next) {
    const doc = this;

    // Fine calculations
    const totalFine = doc.fines.reduce((sum, f) => sum + f.amount, 0);
    const fineCollected = doc.fines.reduce((sum, f) => sum + f.paidAmount, 0);

    // Semester calculations
    const totalSemester = doc.semesters.reduce((sum, s) => sum + s.tuitionFee + s.examFee + s.otherFee, 0);
    const semesterCollected = doc.semesters.reduce((sum, s) => sum + s.paid, 0);

    // Update stats
    doc.stats = {
        totalFine,
        fineCollected,
        finePending: totalFine - fineCollected,
        totalSemester,
        semesterCollected,
        semesterPending: totalSemester - semesterCollected,
        overallCollected: fineCollected + semesterCollected,
        overallPending: (totalFine + totalSemester) - (fineCollected + semesterCollected),
    };

    next();
});

export default mongoose.model("StudentPayment", studentPaymentSchema);
