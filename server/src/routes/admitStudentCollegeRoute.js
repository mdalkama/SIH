import express from "express";
import { addStudent, deleteStudent, promoteStudent } from "../controllers/admitStudentCollegeController/admitStudentCollegeController.js";

const router = express.Router();

// Add new student
router.post("/", addStudent);

// Delete student by ID
router.delete("/:id", deleteStudent);

// Promote student by ID
router.put("/:id/promote", promoteStudent);

export default router;
