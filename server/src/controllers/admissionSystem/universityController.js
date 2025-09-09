import { AdmissionSession, Course, College, Application } from '../../models/admissionModel.js'; // Maan kar chal rahe hain ki models ek file mein hain

// --- Admission Session Management ---

/**
 * @desc    Naya admission session banayein
 * @route   POST /api/university/sessions
 * @access  University Admin
 */
export const createSession = async (req, res) => {
    try {
        const { name, year, startDate, endDate, status } = req.body;
        const session = new AdmissionSession({ name, year, startDate, endDate, status });
        await session.save();
        res.status(201).json({ message: "Admission session safaltapoorvak banaya gaya", session });
    } catch (error) {
        res.status(500).json({ message: "Session banane mein error aaya", error: error.message });
    }
};

/**
 * @desc    Sabhi admission sessions prapt karein
 * @route   GET /api/university/sessions
 * @access  University Admin
 */
export const getSessions = async (req, res) => {
    try {
        const sessions = await AdmissionSession.find().sort({ year: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Sessions fetch karne mein error aaya", error: error.message });
    }
};

// --- Course & College Management ---

/**
 * @desc    Naya course jodein
 * @route   POST /api/university/courses
 * @access  University Admin
 */
export const addCourse = async (req, res) => {
    try {
        const { name, code, durationYears } = req.body;
        const course = new Course({ name, code, durationYears });
        await course.save();
        res.status(201).json({ message: "Course safaltapoorvak joda gaya", course });
    } catch (error) {
        res.status(500).json({ message: "Course jodne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Course seat matrix ke saath naya college jodein
 * @route   POST /api/university/colleges
 * @access  University Admin
 */
export const addCollege = async (req, res) => {
    try {
        const { name, address, affiliatedUniversity, courses } = req.body;
        const college = new College({ name, address, affiliatedUniversity, courses });
        await college.save();
        res.status(201).json({ message: "College safaltapoorvak joda gaya", college });
    } catch (error) {
        res.status(500).json({ message: "College jodne mein error aaya", error: error.message });
    }
};


// --- Application Management ---

/**
 * @desc    Optional filters ke saath sabhi applications prapt karein
 * @route   GET /api/university/applications
 * @access  University Admin
 */
export const getAllApplications = async (req, res) => {
    try {
        const { sessionId, status, collegeId, courseId } = req.query;
        const filter = {};
        if (sessionId) filter.sessionId = sessionId;
        if (status) filter.status = status;
        if (collegeId) filter['preferences.collegeId'] = collegeId;
        if (courseId) filter['preferences.courseId'] = courseId;
        
        const applications = await Application.find(filter)
            .populate('sessionId', 'name year')
            .populate('studentDetails.applicantDetails.applicantName')
            .sort({ createdAt: -1 });
            
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Applications fetch karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Ek application ko verify ya reject karein
 * @route   PUT /api/university/applications/:id/verify
 * @access  University Admin
 */
export const verifyApplication = async (req, res) => {
    try {
        const { status, remarks } = req.body; // status 'verified' ya 'rejected' hona chahiye
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application nahi mila" });
        }

        application.status = status;
        application.verification = {
            verifiedBy: req.user._id, // Auth middleware se user ID milna chahiye
            date: new Date(),
            remarks: remarks,
        };
        await application.save();

        res.status(200).json({ message: `Application ${status} ho gaya`, application });
    } catch (error) {
        res.status(500).json({ message: "Application status update karne mein error aaya", error: error.message });
    }
};


// --- Merit List & Allocation ---

/**
 * @desc    Merit list generate karein aur dekhein
 * @route   GET /api/university/merit-list
 * @access  University Admin
 */
export const generateMeritList = async (req, res) => {
    try {
        const { sessionId } = req.query;
        if (!sessionId) {
            return res.status(400).json({ message: "Session ID anivarya hai" });
        }
        
        // Exam mein shamil hue verified applicants ko rank ke anusaar sort karke fetch karein
        const meritList = await Application.find({ 
            sessionId, 
            status: 'verified', 
            'exam.appeared': true 
        })
        .sort({ 'exam.rank': 1 })
        .populate('studentDetails.applicantDetails', 'applicantName email');

        res.status(200).json(meritList);
    } catch (error) {
        res.status(500).json({ message: "Merit list generate karne mein error aaya", error: error.message });
    }
};

/**
 * @desc    Naya seat allocation round shuru karein
 * @route   POST /api/university/allocation/start-round
 * @access  University Admin
 */
export const startAllocationRound = async (req, res) => {
    try {
        const { sessionId, round } = req.body;
        
        // Yeh ek jatil prakriya hai. Neeche diya gaya logic ek saral pratinidhitv hai.
        
        // 1. Un students ki merit list prapt karein jo abhi bhi 'waiting' ya 'verified' hain
        const studentsToProcess = await Application.find({
            sessionId,
            status: { $in: ['verified', 'waiting'] },
            'exam.appeared': true
        }).sort({ 'exam.rank': 1 });

        // 2. Sabhi colleges aur unki seat capacities fetch karein
        const colleges = await College.find();
        
        // Seat availability ka in-memory representation (alag collection behtar hoga)
        let seatMatrix = {}; 
        colleges.forEach(college => {
            college.courses.forEach(course => {
                const key = `${college._id}_${course.courseId}`;
                seatMatrix[key] = course.reservedSeats;
            });
        });

        for (const student of studentsToProcess) {
            // 3. Student ke preferences par iterate karein
            for (const preference of student.preferences.sort((a,b) => a.preferenceOrder - b.preferenceOrder)) {
                const { collegeId, courseId } = preference;
                const studentCategory = student.studentDetails.applicantDetails.reservationCategory.toLowerCase();

                // 4. Seat matrix mein us preference aur category ke liye seat availability check karein
                const seatKey = `${collegeId}_${courseId}`;
                if (seatMatrix[seatKey] && seatMatrix[seatKey][studentCategory] > 0) {
                    
                    // 5. Seat allocate karein
                    student.allocation = {
                        round,
                        allocatedCollegeId: collegeId,
                        allocatedCourseId: courseId,
                        status: 'provisionallyAllocated'
                    };
                    student.status = 'provisionallyAllocated';
                    await student.save();
                    
                    // 6. Matrix mein seat count kam karein aur agle student par jayein
                    seatMatrix[seatKey][studentCategory]--;
                    break; 
                }
            }
        }
        
        res.status(200).json({ message: `Allocation Round ${round} safaltapoorvak poora hua.` });
    } catch (error) {
        res.status(500).json({ message: "Allocation round ke dauran error aaya", error: error.message });
    }
};

