import express from "express";

import { role } from "../middlewares/authMiddleware.js"; // Your auth middleware
import { raiseComplaint } from "../controllers/complaintController/complaintController.js";
import { getCollegeComplaints } from "../controllers/complaintController/complaintController.js";

const router = express.Router();

// A student can raise a complaint
router.post("/raise", role(['student']), raiseComplaint);

// A College Admin can view all complaints for their college
router.get("/college", role(['CollegeAdmin']), getCollegeComplaints);

export default router;