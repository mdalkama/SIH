import Staff from "../../models/staffModel.js";
import Student from "../../models/studentModel.js";
import College from "../../models/collegeModel.js";
import Complaint from "../../models/complaintModel.js";

// @desc    Get summary data for the College Admin dashboard
// @route   GET /api/v1/college-admin/dashboard-summary
// @access  CollegeAdmin
export const getAdminDashboardSummary = async (req, res) => {
    try {
        const { collegeCode } = req.user;
        if (!collegeCode) {
            return res.status(401).json({ message: "Admin is not associated with a college." });
        }

        // Find the college to get its ObjectId
        const college = await College.findOne({ code: collegeCode }).select('_id');
        if (!college) {
            return res.status(404).json({ message: "College not found." });
        }
        const collegeId = college._id;

        // Run all database queries in parallel for maximum efficiency
        const [
            studentCount,
            staffCount,
            courseCount,
            pendingComplaints,
            recentComplaints
        ] = await Promise.all([
            Student.countDocuments({ collegeCode }),
            Staff.countDocuments({ collegeCode }),
            College.findById(collegeId).select('courses').then(c => c.courses.length),
            Complaint.countDocuments({ college: collegeId, status: { $ne: "Resolved" } }),
            Complaint.find({ college: collegeId, status: { $ne: "Resolved" } })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('filedBy', 'name registrationNumber')
        ]);
        
        const summary = {
            stats: {
                totalStudents: studentCount,
                totalStaff: staffCount,
                totalCourses: courseCount,
                pendingComplaints: pendingComplaints,
            },
            recentComplaints: recentComplaints
        };

        res.status(200).json({ success: true, data: summary });

    } catch (err) {
        console.error("Error fetching admin dashboard summary:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};