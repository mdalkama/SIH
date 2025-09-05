import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import studentRoutes from "./studentRoutes.js";
import staffRoute from "./staffRoute.js";
import { getRole } from "../controllers/common/commonController.js";
import { staffRoles } from "../roles/roles.js";
import collegeManageStaffRoute from "../routes/collegeManageStaffRoute.js";
import courseRoute from "../routes/courseRoute.js";
import subjectRoute from "../routes/subjectRoute.js";
import universityManageStaffRoute from "../routes/universityManageStaffRoute.js";
import {getMyProfile} from "../controllers/studentController/studentController.js";
import {getStaffProfile} from "../controllers/staffController/staffController.js";







const router = Router();


router.get("/", (req, res) => { res.status(200).send("API is running"); });
router.get("/me", role(['student', ...staffRoles]), getRole);
router.use('/staff', staffRoute)
router.use("/student", studentRoutes);
router.use("/add-college-staff", collegeManageStaffRoute);
router.use("/course",role(['UniversityAdmin']), courseRoute)
router.use("/subject", role(['UniversityAdmin']), subjectRoute)
router.use("/add-university-Staff", universityManageStaffRoute)
router.get("/my-profile", role(['student', ...staffRoles]), (req, res) => {
    try {
        if(req.user.role === 'student'){
            // student profile controller
            return getMyProfile(req, res);
        } else {
            // staff profile controller
            return getStaffProfile(req, res);
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/logout",role(['student', ...staffRoles]), (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.json({ message: "Logged out successfully" });
});




export default router;
