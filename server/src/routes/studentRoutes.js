import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {loginStudent, registerStudent, logoutStudent, getSerial, getMyProfile, updateProfile} from "../controllers/studentController/studentController.js";


const router = Router();


router.post("/admitstudent", role(['UniversityAdmin']), registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent)
router.get("/getSerial/:batch/:courseId", role(['CollegeAdmissionDepartment']), getSerial)


export default router;