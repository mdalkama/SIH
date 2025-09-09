// routes/adminRoutes.js
import express from "express";
import { role } from "../middlewares/authMiddleware.js";
import { addStaffByRole, getStaff, getStaffById, updateStaff, deleteStaff } from "../controllers/addCollegeStaffController/addCollegeStaffController.js";

const router = express.Router();

// Existing routes
router.post("/add-college-director", role(["CollegeAdmin"]), (req, res, next) => {
    req.role = "CollegeDirector";
    next();
}, addStaffByRole);

router.post("/add-dean", role(["CollegeAdmin"]), (req, res, next) => {
    req.role = "CollegeDean";
    next();
}, addStaffByRole);

router.post("/add-exam-controller", role(["CollegeAdmin"]), (req, res, next) => {
    req.role = "CollegeExaminationBody";
    next();
}, addStaffByRole);

router.post("/add-librarian", role(["CollegeAdmin"]), (req, res, next) => {
    req.role = "CollegeLibrarian";
    next();
}, addStaffByRole);

router.post("/add-warden", role(["CollegeAdmin"]), (req, res, next) => {
    req.role = "CollegeHostelWarden";
    next();
}, addStaffByRole);

router.post("/add-finance-body", role(["CollegeAdmin"]), (req, res, next) => {
    req.role = "CollegeFinanceBody";
    next();
}, addStaffByRole);

router.post("/add-admission-department", role(["CollegeAdmin"]), (req, res, next) => {
    req.role = "CollegeAdmissionDepartment";
    next();
}, addStaffByRole);

// Add HOD (only CollegeDirector can add)
router.post("/add-hod", role(["CollegeAdmin", "CollegeDirector"]), (req, res, next) => {
    req.role = "CollegeHOD";
    next();
}, addStaffByRole);

// Add Faculty (CollegeDirector or HOD can add)
router.post("/add-faculty", role(["CollegeAdmin", "CollegeDirector", "CollegeHOD"]), (req, res, next) => {
    req.role = "CollegeFaculty";
    next();
}, addStaffByRole);

router.get("/", role(["CollegeAdmin"]), getStaff);

// CRUD routes for individual staff
router.get("/:id", role(["CollegeAdmin"]), getStaffById);
router.put("/:id", role(["CollegeAdmin"]), updateStaff);
router.delete("/:id", role(["CollegeAdmin"]), deleteStaff);

export default router;
