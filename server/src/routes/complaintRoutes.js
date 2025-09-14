import express from "express";

import { role } from "../middlewares/authMiddleware.js"; // Your auth middleware
import { getCollegeComplaints, getMyComplaints, raiseComplaint } from "../controllers/complaintController/complaintController.js";
import { updateComplaintStatus } from "../controllers/complaintController/complaintController.js";

const router = express.Router();

// A student can raise a complaint
router.post("/raise", role(['student']), raiseComplaint);
// ... (keep existing routes)
router.get("/my-complaints", role(['student']), getMyComplaints);

// A College Admin can view all complaints for their college
router.get("/college", role(['CollegeAdmin']), getCollegeComplaints);

router.put("/college/:complaintId", role(['CollegeAdmin']), updateComplaintStatus);

export default router;