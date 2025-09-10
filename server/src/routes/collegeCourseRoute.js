import express from "express";
import { getCoursesWithFees, updateCourseFees } from "../controllers/manageCollegeCourseController/manageCollegeCourseController.js";

const router = express.Router();

// 1. Get all courses with semester details + fees for a college
router.get("/:collegeCode/courses", getCoursesWithFees);

// 2. Update fees for a specific course in a college
router.put("/:collegeCode/courses/:courseId/fees", updateCourseFees);

export default router;
