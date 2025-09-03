import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import {loginStudent, registerStudent, logoutStudent, getMyProfile} from "../controllers/studentController/studentController.js";


const router = Router();
router.post("/admitstudent", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent)
router.get("/me", role(['student']),  getMyProfile)
router.get("/protected", role(['student']),  (req, res) => {
    res.status(200).json({ message: "You have accessed a protected route" });
});


export default router;