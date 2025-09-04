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






const router = Router();


router.get("/", (req, res) => { res.status(200).send("API is running"); });
router.get("/me", role(['student', ...staffRoles]), getRole);
router.use('/staff', staffRoute)
router.use("/student", studentRoutes);
router.use("/add-college-staff", collegeManageStaffRoute);
router.use("/course",role(['UniversityGoverningBody']), courseRoute)
router.use("/subject", role(['UniversityGoverningBody']), subjectRoute)
router.use("/add-university-Staff", universityManageStaffRoute)




export default router;
