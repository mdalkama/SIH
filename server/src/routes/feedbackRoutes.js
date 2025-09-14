import express from "express";
import { submitFeedback, getCollegeFeedback, getMyFeedback } from "../controllers/feedbackController/feedbackController.js";
import { role } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for any logged-in user (student or staff) to submit feedback
router.post("/submit", role(['student']), submitFeedback); // Assuming 'Staff' is a valid role
// ... (keep existing routes)
router.get("/my-feedback", role(['student']), getMyFeedback);

// Route for College Admin to view all feedback
router.get("/college", role(['CollegeAdmin']), getCollegeFeedback);

export default router;