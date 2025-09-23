import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {loginStaff, registerStaff, logoutStaff, getAllStaffForSelection, forgotPassword, resetPassword} from "../controllers/staffController/staffController.js";



const router = Router();


router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.post("/logout", logoutStaff)
router.get('/list', getAllStaffForSelection);

// --- ADD THESE NEW ROUTES ---
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);


export default router;