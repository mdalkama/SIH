import PlacementDrive from "../../models/placementModel.js";
import Student from "../../models/studentModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";

// --- For CollegePlacementOfficer ---

export const getPlacementDashboardStats = async (req, res) => {
    try {
        const collegeCode = req.user.collegeCode;
        const [drives, placedStudents, companiesVisited] = await Promise.all([
            PlacementDrive.find({ collegeCode }),
            // This is a simplified count. A real-world scenario might be more complex.
            StudentAcademics.countDocuments({ 'placements.status': 'PLACED', collegeCode }),
            PlacementDrive.distinct('companyName', { collegeCode })
        ]);

        const openDrives = drives.filter(d => d.status === 'OPEN').length;
        const totalApplications = drives.reduce((acc, drive) => acc + (drive.applications?.length || 0), 0);

        res.status(200).json({
            success: true,
            stats: {
                openDrives,
                placedStudents,
                companiesVisited: companiesVisited.length,
                totalApplications
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

/**
 * @description Create a new placement drive
 * @route   POST /api/v1/placements/drives
 * @access  CollegePlacementOfficer
 */
export const createPlacementDrive = async (req, res) => {
    try {
        const officer = req.user;
        const driveData = { 
            ...req.body, 
            postedBy: officer.id,
            collegeCode: officer.collegeCode // Automatically assign officer's college code
        };

        const newDrive = new PlacementDrive(driveData);
        await newDrive.save();
        res.status(201).json({ success: true, message: "Placement drive created successfully.", drive: newDrive });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

/**
 * @description Get all placement drives for the officer's college
 * @route   GET /api/v1/placements/drives
 * @access  CollegePlacementOfficer
 */
export const getAllDrivesForOfficer = async (req, res) => {
    try {
        const drives = await PlacementDrive.find({ collegeCode: req.user.collegeCode })
            .populate('postedBy', 'name')
            .sort({ driveDate: -1 });
        res.status(200).json({ success: true, drives });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

/**
 * @description Get a single drive with all student applications
 * @route   GET /api/v1/placements/drives/:driveId
 * @access  CollegePlacementOfficer
 */
export const getDriveWithApplications = async (req, res) => {
    try {
        const drive = await PlacementDrive.findById(req.params.driveId);
        if (!drive || drive.collegeCode !== req.user.collegeCode) {
            return res.status(404).json({ message: "Drive not found or not accessible." });
        }
        res.status(200).json({ success: true, drive });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// --- For Students ---

export const getAvailableDrivesForStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('collegeCode');
        if (!student) {
            return res.status(404).json({ message: "Student profile not found." });
        }
        
        const allOpenDrives = await PlacementDrive.find({
            collegeCode: student.collegeCode,
            status: 'OPEN',
        }).lean();
        
        // Add 'hasApplied' and 'applicationStatus' to each drive
        const drivesWithStatus = allOpenDrives.map(drive => {
            const studentApplication = drive.applications.find(app => app.studentId.toString() === req.user.id);
            
            const hasApplied = !!studentApplication;
            const applicationStatus = studentApplication ? studentApplication.status : null;

            const { applications, ...driveWithoutApps } = drive; // Remove sensitive applications array
            return {
                ...driveWithoutApps,
                hasApplied,
                applicationStatus // <-- YEH NAYA FIELD HAI
            };
        });

        res.status(200).json({ success: true, drives: drivesWithStatus });

    } catch (error) {
        console.error("Error fetching available drives for student:", error);
        res.status(500).json({ message: "Server error while fetching placement drives.", error: error.message });
    }
};

/**
 * @description Apply for a placement drive
 * @route   POST /api/v1/placements/drives/:driveId/apply
 * @access  Student
 */
export const applyForDrive = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { driveId } = req.params;
        const { resumeUrl } = req.body; 

        // Basic validation for the resume URL
        if (!resumeUrl || !resumeUrl.startsWith('http')) {
            return res.status(400).json({ message: "A valid resume link (starting with http) is required." });
        }
        
        const drive = await PlacementDrive.findById(driveId);

        if (!drive || drive.status !== 'OPEN') {
            return res.status(400).json({ message: "This drive is not open for applications." });
        }
        
        if (drive.applications.some(app => app.studentId.toString() === studentId)) {
            return res.status(409).json({ message: "You have already applied for this drive." });
        }

        const student = await Student.findById(studentId).select('name registrationNumber');
        const studentAcademics = await StudentAcademics.findOne({ studentId }).select('_id');
        if(!student || !studentAcademics) {
            return res.status(404).json({ message: "Student record not found." });
        }

        const newApplication = {
            studentId,
            studentAcademicId: studentAcademics._id,
            name: student.name,
            registrationNumber: student.registrationNumber,
            resumeUrl: resumeUrl // <-- 2. NAYI APPLICATION MEIN SAVE KARO
        };

        drive.applications.push(newApplication);
        await drive.save();

        res.status(200).json({ success: true, message: `Successfully applied to ${drive.companyName}.` });

    } catch (error) {
        console.error("Error applying for drive:", error);
        res.status(500).json({ message: "Server error applying for drive.", error: error.message });
    }
};

export const deletePlacementDrive = async (req, res) => {
    try {
        const drive = await PlacementDrive.findOne({
            _id: req.params.driveId,
            collegeCode: req.user.collegeCode // Security check
        });

        if (!drive) {
            return res.status(404).json({ message: "Drive not found or you are not authorized to delete it." });
        }

        await drive.deleteOne(); // Use deleteOne on the found document

        res.status(200).json({ success: true, message: "Placement drive deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting drive.", error: error.message });
    }
};

export const updatePlacementDrive = async (req, res) => {
    try {
        const updatedDrive = await PlacementDrive.findByIdAndUpdate(
            req.params.driveId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDrive) return res.status(404).json({ message: "Drive not found." });
        res.status(200).json({ success: true, message: "Drive updated successfully.", drive: updatedDrive });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { driveId, studentId } = req.params;
        const { status } = req.body; // Expecting status like "SHORTLISTED" or "REJECTED"

        if (!status) {
            return res.status(400).json({ message: "New status is required." });
        }

        const drive = await PlacementDrive.findOneAndUpdate(
            {
                _id: driveId,
                collegeCode: req.user.collegeCode, // Security check
                "applications.studentId": studentId
            },
            {
                $set: { "applications.$.status": status } // Update the status of the matched application
            },
            { new: true } // Return the updated document
        );

        if (!drive) {
            return res.status(404).json({ message: "Drive or student application not found." });
        }

        res.status(200).json({ success: true, message: "Application status updated successfully.", drive });
    } catch (error) {
        res.status(500).json({ message: "Server error updating status.", error: error.message });
    }
};

export const getUpcomingDrives = async (req, res) => {
    try {
        const upcomingDrives = await PlacementDrive.find({
            collegeCode: req.user.collegeCode,
            status: 'UPCOMING', 
            driveDate: { $gte: new Date() } // Only show drives from today onwards
        })
        .sort({ driveDate: 1 }) // Show the nearest drive first
        .limit(5) // Limit to the next 5 drives
        .select('companyName jobTitle driveDate');

        res.status(200).json({ success: true, drives: upcomingDrives });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const getRecentPlacements = async (req, res) => {
    try {
        // This is a complex query that finds the latest accepted offers
        const recentPlacements = await PlacementDrive.aggregate([
            // Filter for drives in the officer's college
            { $match: { collegeCode: req.user.collegeCode } },
            // Unwind the applications array
            { $unwind: "$applications" },
            // Filter for applications with 'OFFER_ACCEPTED' status
            { $match: { "applications.status": "OFFER_ACCEPTED" } },
            // Sort by the application date descending to get the most recent
            { $sort: { "applications.appliedOn": -1 } },
            // Limit to the top 5
            { $limit: 5 },
            // Project the fields we need
            {
                $project: {
                    _id: "$applications._id",
                    studentName: "$applications.name",
                    companyName: "$companyName",
                    package: "$packageLPA"
                }
            }
        ]);

        res.status(200).json({ success: true, placements: recentPlacements });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const studentUpdateApplicationStatus = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { driveId } = req.params;
        const { status } = req.body; // Expecting 'OFFER_ACCEPTED' or 'OFFER_DECLINED'

        if (!['OFFER_ACCEPTED', 'OFFER_DECLINED'].includes(status)) {
            return res.status(400).json({ message: "Invalid status update." });
        }

        const drive = await PlacementDrive.findOneAndUpdate(
            {
                _id: driveId,
                "applications.studentId": studentId,
                "applications.status": "SHORTLISTED" // Can only accept/decline if shortlisted
            },
            {
                $set: { "applications.$.status": status }
            },
            { new: true }
        );

        if (!drive) {
            return res.status(404).json({ message: "Application not found or you are not shortlisted for this drive." });
        }

        res.status(200).json({ success: true, message: `Offer status updated to ${status}.` });
    } catch (error) {
        res.status(500).json({ message: "Server error updating status.", error: error.message });
    }
};