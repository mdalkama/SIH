import Feedback from "../../models/feedbackModel.js";
import Student from "../../models/studentModel.js";
import Staff from "../../models/staffModel.js";
import College from "../../models/collegeModel.js";

export const submitFeedback = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { subject, message, category, isAnonymous } = req.body;

        if (!subject || !message || !category) {
            return res.status(400).json({ message: "Subject, message, and category are required." });
        }
        
        // Find the student to get their collegeCode
        const student = await Student.findById(studentId).select('collegeCode');
        if (!student || !student.collegeCode) {
            return res.status(404).json({ message: "Student or associated college not found." });
        }

        // Find the college ObjectId from the collegeCode
        const college = await College.findOne({ code: student.collegeCode }).select('_id');
        if (!college) {
            return res.status(404).json({ message: `College with code ${student.collegeCode} not found.` });
        }

        const newFeedback = await Feedback.create({
            submittedBy: studentId, // Always the logged-in student
            college: college._id,
            subject,
            message,
            category,
            isAnonymous
        });

        res.status(201).json({ success: true, message: "Thank you! Your feedback has been submitted successfully.", feedback: newFeedback });

    } catch (err) {
        console.error("Error submitting feedback:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

// @desc    College Admin gets all feedback for their college
// @route   GET /api/v1/feedback/college
// @access  CollegeAdmin
export const getCollegeFeedback = async (req, res) => {
    try {
        const staffId = req.user.id;

        // Find the admin to get their collegeCode
        const admin = await Staff.findById(staffId).select('collegeCode');
        if (!admin || !admin.collegeCode) {
            return res.status(404).json({ message: "Admin is not associated with a college." });
        }

        // Find the College document's ObjectId using the admin's collegeCode
        const college = await College.findOne({ code: admin.collegeCode }).select('_id');
        if (!college) {
            return res.status(404).json({ message: `College with code ${admin.collegeCode} not found.` });
        }

        // Find all feedback that matches the college's ObjectId
        const feedback = await Feedback.find({ college: college._id })
            .populate('submittedBy', 'name registrationNumber') // Populate the student's name
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, feedback });

    } catch (err) {
        console.error("Error getting college feedback:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};