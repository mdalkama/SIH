import express from "express";
import { role } from "../middlewares/authMiddleware.js";
import { addStaffByRole } from "../controllers/addUniversityStaff/addUniversityStaff.js";

const router = express.Router();

// UniversityAdmin can add these roles
router.post("/add-governing-body", role(["UniversityAdmin"]), (req, res, next) => {
    req.role = "UniversityGoverningBody";
    next();
}, addStaffByRole);

router.post("/add-registrar", role(["UniversityAdmin"]), (req, res, next) => {
    req.role = "UniversityRegistrar";
    next();
}, addStaffByRole);

router.post("/add-exam-body", role(["UniversityAdmin"]), (req, res, next) => {
    req.role = "UniversityExaminationBody";
    next();
}, addStaffByRole);

router.post("/university-exam-cell-staff", role(["UniversityExaminationBody"]), (req, res, next) => {
    req.role = "UniversityExamCellStaff";
    next();
}, addStaffByRole);


export default router;
