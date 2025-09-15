import { Router } from "express";
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    addOrUpdateResults,
    getExamResultsForEntry,
    getExamsForApproval,
    publishResults
} from "../controllers/examController/examController.js";

const router = Router();

router.post("/", createExam);
router.get("/", getAllExams);


router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

// --- NEW ROUTES FOR APPROVAL WORKFLOW ---
router.get("/pending-approval", getExamsForApproval);
router.put("/:examId/publish", publishResults);

// --- NEW ROUTES FOR RESULTS ---
router.get("/:examId/results/entry", getExamResultsForEntry);
router.post("/:examId/results", addOrUpdateResults);

export default router;
