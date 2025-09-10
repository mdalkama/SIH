import express from "express";
import { getBooksForStudent, getMyLibraryProfile } from "../controllers/studentLibraryController/studentLibraryController.js";
import { role } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Yeh route sirf 'student' role waale users ke liye hai
router.get("/my-profile", role(["student"]), getMyLibraryProfile);
router.get('/student-catalog', getBooksForStudent);

export default router;
