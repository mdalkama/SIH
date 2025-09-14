import express from "express";
import { getAdminDashboardSummary } from "../controllers/collegeAdminController/collegeAdminController.js";
import { role } from "../middlewares/authMiddleware.js";

const router = express.Router();

// This middleware protects all routes in this file
router.use(role(['CollegeAdmin']));

router.get("/dashboard-summary", getAdminDashboardSummary);

export default router;