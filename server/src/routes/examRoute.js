// routes/examRoute.js
import express from "express";
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    addOrUpdateResult,
    getStudentResult
} from "../controllers/examController/examController.js";

const router = express.Router();

// Exam CRUD
router.post("/", createExam);              // Create exam
router.get("/", getAllExams);              // Get all exams
router.get("/:id", getExamById);           // Get exam by ID
router.put("/:id", updateExam);            // Update exam
router.delete("/:id", deleteExam);         // Delete exam

// Results
router.post("/:id/result", addResult);                     // Add student result
router.put("/:id/result/:studentId", updateResult);        // Update student result
router.get("/:id/result/:studentId", getStudentResult); // Get specific student result

export default router;
