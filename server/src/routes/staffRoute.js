import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {loginStaff, registerStaff, logoutStaff} from "../controllers/studentController/staffControler.js";
const router = Router();
router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.post("/logout", logoutStaff)
router.get("/protected", role(['UniversityAdmin', 'UniversityGoverningBody', 'UniversityRegistrar', 'UniversityExaminationBody', 'CollegeAdmin', 'CollegeDirector', 'CollegeDean', 'ColleegHOD', 'CollegeFaculty', 'CollegeWarden', 'CollegeLibrarian', 'CollegeFinanceBody']),  (req, res) => {
    res.status(200).json({ message: "You have accessed a protected route" });
});
export default router;