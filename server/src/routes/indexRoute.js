import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import studentRoutes from "./studentRoutes.js";
import staffRoute from "./staffRoute.js";
import { getRole } from "../controllers/common/commonController.js";
import { staffRoles } from "../roles/roles.js";
import collegeDirectorRouter from "../routes/collegeDirectorRouter.js";
import courseRoute from "../routes/courseRoute.js";
import subjectRoute from "../routes/subjectRoute.js";




const router = Router();


router.get("/", (req, res) => { res.status(200).send("API is running"); });
router.get("/me", role(['student', ...staffRoles]), getRole);
router.use('/staff', staffRoute)
router.use("/student", studentRoutes);
router.use("/director", collegeDirectorRouter);
router.use("/course",role(['UniversityGoverningBody']), courseRoute)
router.use("/subject", role(['UniversityGoverningBody']), subjectRoute)




export default router;
