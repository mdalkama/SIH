// controllers/examController.js
import Exam from "../../models/Exam.js";

// @desc    Create Exam
// @route   POST /api/v1/exams
// @access  Admin / Staff
export const createExam = async (req, res) => {
    try {
        const { examId, name, semester, courses, startDate, endDate } = req.body;

        if (!examId || !name || !semester) {
            return res.status(400).json({ message: "examId, name and semester are required" });
        }

        const existing = await Exam.findOne({ examId });
        if (existing) return res.status(400).json({ message: "Exam already exists with this ID" });

        const exam = new Exam({
            examId,
            name,
            semester,
            courses,
            startDate,
            endDate
        });

        await exam.save();
        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Get all Exams
// @route   GET /api/v1/exams
// @access  Public
export const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate("courses", "courseId degree branch specialization");
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Get single exam by ID
// @route   GET /api/v1/exams/:id
// @access  Public
export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate("courses", "courseId degree")
            .populate("results.studentId", "name rollNo")
            .populate("results.marks.subject", "name code");

        if (!exam) return res.status(404).json({ message: "Exam not found" });

        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Update Exam details
// @route   PUT /api/v1/exams/:id
// @access  Admin / Staff
export const updateExam = async (req, res) => {
    try {
        const { name, semester, courses, startDate, endDate } = req.body;

        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        exam.name = name || exam.name;
        exam.semester = semester ?? exam.semester;
        exam.courses = courses || exam.courses;
        exam.startDate = startDate || exam.startDate;
        exam.endDate = endDate || exam.endDate;

        await exam.save();
        res.status(200).json({ message: "Exam updated successfully", exam });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Delete Exam
// @route   DELETE /api/v1/exams/:id
// @access  Admin / Staff
export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        await exam.deleteOne();
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Add Student Result (new entry)
// @route   POST /api/v1/exams/:id/result
// @access  Admin / Staff
export const addResult = async (req, res) => {
    try {
        const { studentId, marks, overallResult, sgpa } = req.body;

        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        // Check if already exists
        const existingResult = exam.results.find(r => r.studentId.toString() === studentId);
        if (existingResult) {
            return res.status(400).json({ message: "Result already exists for this student. Use update API." });
        }

        exam.results.push({ studentId, marks, overallResult, sgpa });
        await exam.save();

        res.status(201).json({ message: "Result added successfully", exam });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Update Student Result (existing entry)
// @route   PUT /api/v1/exams/:id/result/:studentId
// @access  Admin / Staff
export const updateResult = async (req, res) => {
    try {
        const { marks, overallResult, sgpa } = req.body;

        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const studentResult = exam.results.find(r => r.studentId.toString() === req.params.studentId);
        if (!studentResult) return res.status(404).json({ message: "Result not found for this student" });

        // Update fields
        studentResult.marks = marks || studentResult.marks;
        studentResult.overallResult = overallResult || studentResult.overallResult;
        studentResult.sgpa = sgpa ?? studentResult.sgpa;

        await exam.save();
        res.status(200).json({ message: "Result updated successfully", exam });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// @desc    Get Result of a Student in a Specific Exam
// @route   GET /api/v1/exams/:id/result/:studentId
// @access  Student
export const getStudentResult = async (req, res) => {
    try {
        const { id, studentId } = req.params;

        const exam = await Exam.findById(id)
            .populate("results.marks.subject", "name code credits")
            .populate("results.studentId", "name rollNo");

        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const studentResult = exam.results.find(r => r.studentId._id.toString() === studentId);
        if (!studentResult) return res.status(404).json({ message: "Result not found for this student" });

        res.status(200).json(studentResult);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
