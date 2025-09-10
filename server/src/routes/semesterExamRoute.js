import { Router } from "express";
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam
} from "../controllers/examController/examController.js";

const router = Router();

router.post("/", createExam);
router.get("/", getAllExams);
router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;
