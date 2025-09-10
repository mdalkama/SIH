import { Router } from "express";
import { 
    getUniversityProfile, 
    createUniversityProfile, 
    updateUniversityProfile 
} from "../controllers/universityController/universityController.js";

const router = Router();

// GET -> fetch university profile
router.get("/main", getUniversityProfile);

// POST -> create university profile (sirf ek baar)
router.post("/", createUniversityProfile);

// PUT -> update university profile
router.put("/main", updateUniversityProfile);

export default router;
