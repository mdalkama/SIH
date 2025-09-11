
import { Application, AdmissionCollege } from '../../models/admissionModel.js';

/**
 * @desc    Ek specific college ke liye dashboard stats prapt karein
 * @route   GET /api/college/dashboard
 * @access  College Admin
 */
export const getCollegeDashboardStats = async (req, res) => {
    try {
        const collegeId = req.user.collegeId; // Auth middleware se
        
        const totalApplications = await Application.countDocuments({ 'preferences.collegeId': collegeId });
        const confirmedAdmissions = await Application.countDocuments({ 
            'allocation.allocatedCollegeId': collegeId,
            'allocation.status': 'confirmed' 
        });

        const collegeData = await College.findById(collegeId).populate('courses.courseId');
        let totalSeats = 0;
        collegeData.courses.forEach(c => {
            totalSeats += c.seatCapacity;
        });

        res.status(200).json({ 
            totalApplications, 
            confirmedAdmissions,
            vacantSeats: totalSeats - confirmedAdmissions
        });

    } catch (error) {
        res.status(500).json({ message: "College dashboard stats fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Is college mein submit kiye gaye sabhi applications prapt karein
 * @route   GET /api/college/applications
 * @access  College Admin
 */
export const getCollegeApplications = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        const applications = await Application.find({ 'preferences.collegeId': collegeId })
            .populate('studentDetails.applicantDetails', 'applicantName email mobile')
            .sort({ 'exam.rank': 1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "College applications fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Is college se sambandhit merit list prapt karein
 * @route   GET /api/college/merit-list
 * @access  College Admin
 */
export const getCollegeMeritList = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        // Un students ko fetch karein jinhone rank prapt ki hai aur is college ko preference list mein rakha hai
        const meritList = await Application.find({
            'preferences.collegeId': collegeId,
            'exam.rank': { $exists: true, $ne: null }
        })
        .sort({ 'exam.rank': 1 })
        .select('studentDetails.applicantDetails.applicantName exam.rank preferences');
        
        res.status(200).json(meritList);
    } catch (error) {
        res.status(500).json({ message: "College merit list fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Ek specific round mein is college ko allocate kiye gaye sabhi students prapt karein
 * @route   GET /api/college/allocations
 * @access  College Admin
 */
export const getCollegeAllocations = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        const { round } = req.query;
        const filter = { 'allocation.allocatedCollegeId': collegeId };
        if (round) filter['allocation.round'] = round;

        const allocations = await Application.find(filter)
            .populate('studentDetails.applicantDetails', 'applicantName')
            .populate('allocation.allocatedCourseId', 'name');
            
        res.status(200).json(allocations);
    } catch (error) {
        res.status(500).json({ message: "College allocations fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Admitted students ki antim list prapt karein
 * @route   GET /api/college/admitted-students
 * @access  College Admin
 */
export const getAdmittedStudents = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        const admittedStudents = await Application.find({
            'allocation.allocatedCollegeId': collegeId,
            'allocation.status': 'confirmed'
        })
        .populate('studentDetails.applicantDetails')
        .populate('allocation.allocatedCourseId', 'name code');

        res.status(200).json(admittedStudents);
    } catch (error) {
        res.status(500).json({ message: "Admitted students fetch karne mein error aaya", error: error.message });
    }
};

