import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {loginStaff, registerStaff, logoutStaff} from "../controllers/staffController/staffController.js";


const router = Router();


router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.post("/logout", logoutStaff)


export default router;