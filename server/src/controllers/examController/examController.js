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
        // createdBy should be added from authenticated user's ID
        const examData = { ...req.body, createdBy: req.user.id };
        
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


/**
 * @description Get a list of registered students for an exam to enter/view results.
 * @route   GET /api/v1/semester-exam/:examId/results/entry
 * @access  UniversityExaminationBody
 */
export const getExamResultsForEntry = async (req, res) => {
    try {
        const { examId } = req.params; // This is the Exam document _id

        const exam = await Exam.findById(examId).lean();
        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        // Find all student academic records that have a registration for this exam's unique ID
        const registeredStudents = await StudentAcademics.find({
            'currentExamRegistrations.examId': exam.examId
        })
        .populate('studentId', 'name registrationNumber') // Populate student's name and reg no
        .select('studentId registrationNumber currentExamRegistrations')
        .lean();

        if (!registeredStudents) {
            return res.status(200).json({ success: true, students: [] });
        }
        
        // Prepare the data for the frontend
        const resultEntryList = registeredStudents.map(student => {
            // Find the specific registration for this exam
            const registration = student.currentExamRegistrations.find(reg => reg.examId === exam.examId);
            
            // Find the relevant course from the exam document to get the subjects
            const courseInExam = exam.courses.find(c => c.courseCode === student.courseId);
            const subjects = courseInExam ? courseInExam.timetable : [];

            return {
                studentAcademicId: student._id,
                studentId: student.studentId._id,
                name: student.studentId.name,
                registrationNumber: student.registrationNumber,
                subjects: subjects.map(sub => ({
                    subjectCode: sub.subjectCode,
                    subjectName: sub.subjectName,
                    internal: 0, // Default values for entry form
                    external: 0,
                    practical: 0,
                })),
                sgpa: 0,
                overallResult: 'PASS'
            };
        });

        res.status(200).json({ success: true, examDetails: { examName: exam.examName, examId: exam.examId }, students: resultEntryList });

    } catch (error) {
        console.error("Error fetching students for result entry:", error);
        res.status(500).json({ message: "Server error while fetching data for result entry.", error: error.message });
    }
};


/**
 * @description Add or update results for multiple students for a specific exam.
 * @route   POST /api/v1/semester-exam/:examId/results
 * @access  UniversityExaminationBody
 */
export const addOrUpdateResults = async (req, res) => {
    const { examId } = req.params; // Exam document _id
    const { results } = req.body; // Expects an array of student results

    if (!results || !Array.isArray(results) || results.length === 0) {
        return res.status(400).json({ message: "Results data must be a non-empty array." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const exam = await Exam.findById(examId).session(session);
        if (!exam) {
            throw new Error("Exam not found.");
        }

        for (const studentResult of results) {
            const { studentAcademicId, subjects, sgpa, overallResult } = studentResult;

            const studentAcademics = await StudentAcademics.findById(studentAcademicId).session(session);
            if (!studentAcademics) {
                console.warn(`Skipping result for non-existent academic record: ${studentAcademicId}`);
                continue; // Skip this student if their academic record isn't found
            }

            // Prepare the new result entry to be pushed into previousResults
            const newResultRecord = {
                examId: exam.examId,
                examName: exam.examName,
                collegeCode: studentAcademics.collegeCode,
                courseCode: studentAcademics.courseId,
                year: exam.year,
                semester: exam.semester,
                subjects: subjects.map(sub => ({
                    ...sub,
                    total: (sub.internal || 0) + (sub.external || 0) + (sub.practical || 0),
                    // Grade calculation logic would go here
                    grade: 'A', // Placeholder for grade calculation
                    status: ((sub.internal || 0) + (sub.external || 0) + (sub.practical || 0)) >= 40 ? "PASS" : "FAIL" // Placeholder
                })),
                sgpa,
                overallResult,
                publishedOn: new Date()
            };

            // Remove the current exam registration for this student
            studentAcademics.currentExamRegistrations = studentAcademics.currentExamRegistrations.filter(
                reg => reg.examId !== exam.examId
            );
            
            // Add the detailed result to their history
            studentAcademics.previousResults.push(newResultRecord);
            
            await studentAcademics.save({ session });
        }

        // Optionally, update the exam status to PUBLISHED
        exam.status = 'PUBLISHED';
        await exam.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "Results have been successfully added and published." });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error adding/updating results:", error);
        res.status(500).json({ message: "Server error while processing results.", error: error.message });
    }
};

/**
 * @description Get all exams that are processed and waiting for final approval.
 * @route   GET /api/v1/semester-exam/pending-approval
 * @access  UniversityExaminationBody
 */
export const getExamsForApproval = async (req, res) => {
    try {
        // Find all exams that have had their results processed but not yet published
        const exams = await Exam.find({ status: 'RESULT_PROCESSING' })
            .select('examName examId semester year') // Select only the necessary fields for the list
            .sort({ year: -1, createdAt: -1 })
            .lean();

        res.status(200).json({ success: true, exams });
    } catch (error) {
        console.error("Error fetching exams for approval:", error);
        res.status(500).json({ message: "Server error while fetching exams for approval.", error: error.message });
    }
};


/**
 * @description Publish the results for a specific exam.
 * @route   PUT /api/v1/semester-exam/:examId/publish
 * @access  UniversityExaminationBody
 */
export const publishResults = async (req, res) => {
    try {
        const { examId } = req.params; // This is the Exam document _id

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        // Check if the results are in the correct state to be published
        if (exam.status !== 'RESULT_PROCESSING') {
            return res.status(400).json({ message: `Cannot publish results. Exam status is currently "${exam.status}", not "Result Processing".` });
        }

        // Update the status to PUBLISHED
        exam.status = 'PUBLISHED';
        await exam.save();

        res.status(200).json({ 
            success: true, 
            message: `Results for "${exam.examName}" have been successfully published.` 
        });

    } catch (error) {
        console.error("Error publishing results:", error);
        res.status(500).json({ message: "Server error while publishing results.", error: error.message });
    }
};