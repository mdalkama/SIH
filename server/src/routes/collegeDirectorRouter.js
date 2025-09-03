import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import { addDean } from "../controllers/CollegeDirectorController/CollegeDirectorController.js";


const router = Router();

router.post("/add-dean", role(['CollegeDirector']), addDean);

export default router;