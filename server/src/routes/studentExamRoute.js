// routes/examRoute.js
import express from "express";
import { getExamResult, getMyRegistrations, getStudentExams, registerForExam } from "../controllers/studentExamController/studentExamController.js";


const router = express.Router();

router.get("/my-exams", getStudentExams);
// Register for an exam
router.post("/:examId/register", registerForExam); 

// Get a list of exams the student is already registered for
router.get("/my-registrations", getMyRegistrations);

// Get the result of a specific past exam
router.get("/result/:examId", getExamResult); 


export default router;
