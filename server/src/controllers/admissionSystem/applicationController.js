import { Application, AdmissionSession } from '../../models/admissionModel.js';

/**
 * @desc    Naya student application submit karein
 * @route   POST /api/application/apply
 * @access  Student
 */
export const submitApplication = async (req, res) => {
    try {
        const studentId = req.user._id; // Auth middleware se
        const { sessionId, studentDetails, preferences } = req.body;

        // Check karein ki active session hai ya nahi
        const activeSession = await AdmissionSession.findById(sessionId);
        if (!activeSession || activeSession.status !== 'active') {
            return res.status(400).json({ message: "Koi active admission session nahi mila." });
        }

        // Check karein ki student ne is session ke liye pehle hi apply kar diya hai ya nahi
        const existingApplication = await Application.findOne({ 'studentDetails.applicantDetails.email': studentDetails.applicantDetails.email, sessionId });
        if (existingApplication) {
            return res.status(400).json({ message: "Aap is admission session ke liye pehle hi apply kar chuke hain." });
        }

        const application = new Application({
            sessionId,
            studentDetails,
            preferences,
            // Yahan user account se link karein agar User model hai
            // userId: studentId 
        });
        await application.save();

        res.status(201).json({ message: "Application safaltapoorvak submit ho gaya!", applicationId: application._id });
    } catch (error) {
        res.status(500).json({ message: "Application submit karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Logged-in student ka application status aur details prapt karein
 * @route   GET /api/application/status
 * @access  Student
 */
export const getApplicationStatus = async (req, res) => {
    try {
        // Maan rahe hain ki student ka application unke user ID ya email se pehchana jata hai
        const application = await Application.findOne({ 'studentDetails.applicantDetails.email': req.user.email })
            .populate('sessionId', 'name status')
            .populate('allocation.allocatedCollegeId', 'name')
            .populate('allocation.allocatedCourseId', 'name');
            
        if (!application) {
            return res.status(404).json({ message: "Application nahi mila." });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: "Application status fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Student ka admit card details prapt karein
 * @route   GET /api/application/admit-card
 * @access  Student
 */
export const getAdmitCard = async (req, res) => {
    try {
        const application = await Application.findOne({ 'studentDetails.applicantDetails.email': req.user.email }, 'admitCard studentDetails.applicantDetails');
        if (!application || !application.admitCard || !application.admitCard.number) {
            return res.status(404).json({ message: "Admit card abhi generate nahi hua hai ya application nahi mila." });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: "Admit card fetch karne mein error aaya", error: error.message });
    }
};


/**
 * @desc    Student ka exam rank aur marks prapt karein
 * @route   GET /api/application/ranks
 * @access  Student
 */
export const getRanks = async (req, res) => {
    try {
        const application = await Application.findOne({ 'studentDetails.applicantDetails.email': req.user.email }, 'exam rankings');
        if (!application || !application.exam || !application.exam.rank) {
            return res.status(404).json({ message: "Exam result abhi uplabdh nahi hai." });
        }
        res.status(200).json({ exam: application.exam, rankings: application.rankings });
    } catch (error) {
        res.status(500).json({ message: "Ranks fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Student ka seat allocation result prapt karein
 * @route   GET /api/application/allocation-result
 * @access  Student
 */
export const getAllocationResult = async (req, res) => {
    try {
        const application = await Application.findOne({ 'studentDetails.applicantDetails.email': req.user.email }, 'allocation')
            .populate('allocation.allocatedCollegeId', 'name address')
            .populate('allocation.allocatedCourseId', 'name durationYears');
            
        if (!application || !application.allocation || !application.allocation.allocatedCollegeId) {
            return res.status(404).json({ message: "Maujooda round mein koi seat allocate nahi hui hai." });
        }
        res.status(200).json(application.allocation);
    } catch (error) {
        res.status(500).json({ message: "Allocation result fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Allocate ki gayi seat ko confirm ya reject karein
 * @route   POST /api/application/confirm-seat
 * @access  Student
 */
export const confirmOrRejectSeat = async (req, res) => {
    try {
        const { choice } = req.body; // 'confirm' ya 'reject'
        const application = await Application.findOne({ 'studentDetails.applicantDetails.email': req.user.email });

        if (!application || application.allocation.status !== 'provisionallyAllocated') {
             return res.status(400).json({ message: "Confirm ya reject karne ke liye koi seat allocation nahi hai." });
        }

        if (choice === 'confirm') {
            application.allocation.status = 'confirmed';
            application.status = 'confirmed';
        } else { // 'reject'
            application.allocation.status = 'rejected';
            // Student agle round ke liye 'waiting' status mein wapas chala jayega
            application.status = 'waiting'; 
        }
        await application.save();

        res.status(200).json({ message: `Seat ko ${choice} karne ka aapka chayan record kar liya gaya hai.` });
    } catch (error) {
        res.status(500).json({ message: "Aapka chayan record karne mein error aaya", error: error.message });
    }
};

