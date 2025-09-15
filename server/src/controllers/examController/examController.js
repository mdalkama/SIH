import Exam from '../../models/examModel.js';
import mongoose from 'mongoose';
import Student from '../../models/studentModel.js';

/**
 * @description Create a new examination schedule.
 * @route POST /api/v1/exams
 * @access Examination Body
 */
export const createExam = async (req, res) => {
    try {
        console.log(req.user)
        // createdBy should be added from authenticated user's ID
        const examData = { ...req.body, createdBy: req.user._id };
        
        const newExam = new Exam(examData);
        await newExam.save();
        
        res.status(201).json({ message: "Exam created successfully.", exam: newExam });
    } catch (error) {
        console.error("Error creating exam:", error);
        res.status(500).json({ message: "Server error during exam creation.", error: error.message });
    }
};

/**
 * @description Get a list of all exams with filtering, search, and pagination.
 * @route GET /api/v1/exams
 * @access Examination Body / Admins
 */
export const getAllExams = async (req, res) => {
    try {
        const { search = '', status = 'all', examType = 'all', page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (search) {
            query.examName = { $regex: search, $options: 'i' };
        }
        if (status !== 'all') {
            query.status = status;
        }
        if (examType !== 'all') {
            query.examType = examType;
        }

        const exams = await Exam.find(query)
            .populate('createdBy', 'name staffId')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ year: -1, createdAt: -1 });

        const count = await Exam.countDocuments(query);

        res.status(200).json({
            exams,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalDocs: count
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching exams.", error: error.message });
    }
};

export const getStudentExams = async (req, res) => {
    try {
        const studentId = req.user.id;

        const student = await Student.findById(studentId).select('courseId semester');
        if (!student || !student.courseId || !student.semester) {
            return res.status(404).json({ message: "Student academic details (courseId, semester) are incomplete." });
        }
        
        const studentCourseId = student.courseId; 
        const studentSemester = student.semester;
        console.log(studentCourseId)

        // 2. Find all exams that are for the student's semester AND contain their courseId in the courses array
        const relevantExams = await Exam.find({
            semester: studentSemester,
            'courses.courseCode': studentCourseId, 
            status: { $in: ["OPEN_FOR_REGISTRATION", "CLOSED","RESULT_PROCESSING", "PUBLISHED"] } 
        }).sort({ startDate: 1 });

        // 3. For each found exam, filter its 'courses' array to only return the timetable relevant to the student
        const personalizedExams = relevantExams.map(exam => {
            const studentCourseData = exam.courses.find(c => c.courseCode === studentCourseId);
            
            return {
                _id: exam._id,
                examName: exam.examName,
                examType: exam.examType,
                semester: exam.semester,
                year: exam.year,
                startDate: exam.startDate,
                endDate: exam.endDate,
                status: exam.status,
                timetable: studentCourseData ? studentCourseData.timetable : [] 
            };
        });

        res.status(200).json({ success: true, exams: personalizedExams });

    } catch (error) {
        console.error("Error fetching student exams:", error);
        res.status(500).json({ message: "Server error fetching exams.", error: error.message });
    }
};

/**
 * @description Get detailed information of a single exam by its ID.
 * @route GET /api/v1/exams/:id
 * @access Examination Body / Admins
 */
export const getExamById = async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await Exam.findById(id).populate('createdBy', 'name email');
        
        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exam details.", error: error.message });
    }
};

/**
 * @description Update an existing exam schedule by its ID.
 * @route PUT /api/v1/exams/:id
 * @access Examination Body
 */
export const updateExam = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedExam = await Exam.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        
        if (!updatedExam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        res.status(200).json({ message: "Exam updated successfully.", exam: updatedExam });
    } catch (error) {
        res.status(500).json({ message: "Error updating exam.", error: error.message });
    }
};

/**
 * @description Delete an exam by its ID.
 * @route DELETE /api/v1/exams/:id
 * @access Examination Body
 */
export const deleteExam = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExam = await Exam.findByIdAndDelete(id);
        
        if (!deletedExam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        // Add cleanup logic here if needed (e.g., delete related registrations)

        res.status(200).json({ message: "Exam deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting exam.", error: error.message });
    }
};
