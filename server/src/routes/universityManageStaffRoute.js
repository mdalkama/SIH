import express from "express";
import { role } from "../middlewares/authMiddleware.js";
import {
    addStaffByRole,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff
} from "../controllers/addUniversityStaff/addUniversityStaff.js"
const router = express.Router();

// UniversityAdmin can add university staff roles
router.post("/add-governing-body", role(["UniversityAdmin"]), (req, res, next) => {
    req.body.role = "UniversityGoverningBody";
    next();
}, addStaffByRole);

router.post("/add-registrar", role(["UniversityAdmin"]), (req, res, next) => {
    req.body.role = "UniversityRegistrar";
    next();
}, addStaffByRole);

router.post("/add-exam-body", role(["UniversityAdmin"]), (req, res, next) => {
    req.body.role = "UniversityExaminationBody";
    next();
}, addStaffByRole);

router.post("/add-exam-cell-staff", role(["UniversityExamBody"]), (req, res, next) => {
    req.body.role = "UniversityExamCellStaff";
    next();
}, addStaffByRole);

// CollegeAdmin creation (only by UniversityAdmin)
router.post("/add-college-admin", role(["UniversityAdmin"]), (req, res, next) => {
    req.body.role = "CollegeAdmin";
    next();
}, addStaffByRole);

// Fetch staff (with optional query params: staffId, role, collegeId)
router.get("/", role(["UniversityAdmin"]), getStaff);

// CRUD routes for individual staff
router.get("/:id", role(["UniversityAdmin"]), getStaffById);
router.put("/:id", role(["UniversityAdmin"]), updateStaff);
router.delete("/:id", role(["UniversityAdmin"]), deleteStaff);

export default router;
