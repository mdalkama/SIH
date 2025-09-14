import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {
    createCollege,
    getAllColleges,
    updateCollege,
    deleteCollege,
    getMyCollege,
    updateMyCollege,
    getPublicColleges,
} from "../controllers/collegeController/collegeController.js";

const router = Router();


router.post("/", role(["UniversityAdmin"]), createCollege);
router.get("/", role(["UniversityAdmin"]), getAllColleges);
router.put("/:id", role(["UniversityAdmin"]), updateCollege);
router.delete("/:id", role(["UniversityAdmin"]), deleteCollege);


router.get("/my-details", role(["CollegeAdmin"]), getMyCollege);
router.put("/update/my-details", role(["CollegeAdmin"]), updateMyCollege);

router.get("/", getPublicColleges);

export default router;
