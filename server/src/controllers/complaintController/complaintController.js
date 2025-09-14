import Complaint from "../../models/complaintModel.js";
import Student from "../../models/studentModel.js";
import Staff from "../../models/staffModel.js";
import College from "../../models/collegeModel.js";
import mongoose from "mongoose";

// @desc    A logged-in student raises a new complaint
// @route   POST /api/v1/complaints/raise
// @access  Student
export const raiseComplaint = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: "Title, description, and category are required." });
        }
        

        // 2. Find the student to get their collegeCode
        const student = await Student.findById(studentId).select('collegeCode');
        if (!student || !student.collegeCode) {
            return res.status(404).json({ message: "Student profile is incomplete or not associated with a college." });
        }

        // 3. Find the College document using the student's collegeCode
        const college = await College.findOne({ code: student.collegeCode }).select('_id');
        if (!college) {
            return res.status(404).json({ message: `College with code ${student.collegeCode} not found.` });
        }

        // 4. Create the complaint using the found college's ObjectId
        const newComplaint = await Complaint.create({
            filedBy: studentId,
            college: college._id, // ✅ Use the ObjectId of the college
            title,
            description,
            category
        });

        res.status(201).json({ success: true, message: "Complaint submitted successfully.", complaint: newComplaint });

    } catch (err) {
        console.error("Error raising complaint:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const getMyComplaints = async (req, res) => {
    try {
        const studentId = req.user.id;
        const complaints = await Complaint.find({ filedBy: studentId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, complaints });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

// @desc    A logged-in College Admin gets all complaints for their college
// @route   GET /api/v1/complaints/college
// @access  CollegeAdmin

export const getCollegeComplaints = async (req, res) => {
    try {
        const staffId = req.user.id;

        const admin = await Staff.findById(staffId).select('collegeCode');
        if (!admin || !admin.collegeCode) {
            return res.status(404).json({ message: "Admin is not associated with a college." });
        }

        const college = await College.findOne({ code: admin.collegeCode }).select('_id');
        if (!college) {
            return res.status(404).json({ message: `College with code ${admin.collegeCode} not found.` });
        }

        const complaints = await Complaint.find({ college: college._id })
            .populate('filedBy', 'name registrationNumber') // Get student's name and reg number
            .sort({ createdAt: -1 }); // Show newest first

        res.status(200).json({ success: true, complaints });

    } catch (err) {
        console.error("Error getting college complaints:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const updateComplaintStatus = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { status } = req.body;
        const staffId = req.user.id;

        // 1. Find the admin to get their collegeCode
        const admin = await Staff.findById(staffId).select('collegeCode');
        if (!admin || !admin.collegeCode) {
            return res.status(404).json({ message: "Admin is not associated with a college." });
        }
        
        // 2. Find the College document using the admin's collegeCode to get its ObjectId
        const college = await College.findOne({ code: admin.collegeCode }).select('_id');
        if (!college) {
            return res.status(404).json({ message: `College with code ${admin.collegeCode} not found.` });
        }

        // 3. Validate the incoming status
        const validStatuses = ["Submitted", "Under Review", "Resolved", "Rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status provided." });
        }
        
        if (!mongoose.Types.ObjectId.isValid(complaintId)) {
            return res.status(400).json({ message: "Invalid Complaint ID." });
        }

        // 4. Find the complaint by its ID AND ensure it belongs to the admin's college ObjectId
        const complaint = await Complaint.findOne({ _id: complaintId, college: college._id });

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found or you do not have permission to modify it." });
        }

        // 5. Update and save
        complaint.status = status;
        await complaint.save();

        res.status(200).json({ success: true, message: `Complaint status updated to "${status}".`, complaint });

    } catch (err) {
        console.error("Error updating complaint status:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

