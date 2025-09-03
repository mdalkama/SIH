import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {loginStaff, registerStaff, logoutStaff, getMyProfile} from "../controllers/staffController/staffController.js";
import collegeDirectorRouter from "../routes/collegeDirectorRouter.js";
const router = Router();
router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.post("/logout", logoutStaff)
router.get("/me", role(['UniversityAdmin', 'UniversityGoverningBody', 'UniversityRegistrar', 'UniversityExaminationBody', 'CollegeAdmin', 'CollegeDirector', 'CollegeDean', 'ColleegHOD', 'CollegeFaculty', 'CollegeWarden', 'CollegeLibrarian', 'CollegeFinanceBody', 'CollegeExaminationBody']),  getMyProfile)
router.use("/director", role(['CollegeDirector']), collegeDirectorRouter);
router.get("/protected", role(['UniversityAdmin', 'UniversityGoverningBody', 'UniversityRegistrar', 'UniversityExaminationBody', 'CollegeAdmin', 'CollegeDirector', 'CollegeDean', 'ColleegHOD', 'CollegeFaculty', 'CollegeWarden', 'CollegeLibrarian', 'CollegeFinanceBody', 'CollegeExaminationBody']),  (req, res) => {
    res.status(200).json({ message: "You have accessed a protected route" });
});
export default router;