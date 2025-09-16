import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {loginStudent, registerStudent, logoutStudent, getSerial, getMyProfile, updateProfile, forgotPassword, resetPassword, getMyAcademics} from "../controllers/studentController/studentController.js";


const router = Router();


router.post("/admitstudent", role(['UniversityAdmin']), registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent)

router.get("/my-academics",role(['student']), getMyAcademics);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.get("/getSerial/:batch/:courseId", role(['CollegeAdmissionDepartment']), getSerial)


export default router;