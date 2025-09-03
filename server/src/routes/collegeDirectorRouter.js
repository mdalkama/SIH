// routes/adminRoutes.js
import express from "express";
import { role } from "../middlewares/roleMiddleware.js";
import { addStaffByRole } from "../controllers/staffController.js";

const router = express.Router();

// CollegeDirector can add these roles
router.post("/add-dean", role(["CollegeDirector"]), (req, res, next) => {
    req.role = "CollegeDean"; // set role dynamically
    next();
}, addStaffByRole);

router.post("/add-exam-controller", role(["CollegeDirector"]), (req, res, next) => {
    req.role = "CollegeExaminationBody";
    next();
}, addStaffByRole);

router.post("/add-librarian", role(["CollegeDirector"]), (req, res, next) => {
    req.role = "CollegeLibrarian";
    next();
}, addStaffByRole);

router.post("/add-warden", role(["CollegeDirector"]), (req, res, next) => {
    req.role = "CollegeHostelWarden";
    next();
}, addStaffByRole);

router.post("/add-finance-body", role(["CollegeDirector"]), (req, res, next) => {
    req.role = "CollegeFinanceBody";
    next();
}, addStaffByRole);

router.post("/add-admission-department", role(["CollegeDirector"]), (req, res, next) => {
    req.role = "CollegeAdmissionDepartment";
    next();
}, addStaffByRole);

export default router;
