import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import { addDean, addExamController, addLibrarian, addWarden, addFinanceBody, addAdmissionDepartment } from "../controllers/CollegeDirectorController/CollegeDirectorController.js";


const router = Router();

router.post("/add-dean", role(['CollegeDirector']), addDean);
router.post("/add-exam-controller", role(['CollegeDirector']), addExamController);
router.post("/add-librarian", role(['CollegeDirector']), addLibrarian);
router.post("/add-warden", role(['CollegeDirector']), addWarden);
router.post("/add-finance-body", role(['CollegeDirector']), addFinanceBody);
router.post("/add-admission-department", role(['CollegeDirector']), addAdmissionDepartment);


export default router;