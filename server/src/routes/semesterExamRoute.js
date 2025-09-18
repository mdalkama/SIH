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
    publishResults,
    updateStudentMarks,
    getExamResults,
    getDashboardStats
} from "../controllers/examController/examController.js";
import { role } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", role(['UniversityExaminationBody']),  createExam);
router.put("/:id",role(['UniversityExaminationBody']),  updateExam);
router.delete("/:id",role(['UniversityExaminationBody']),  deleteExam);
router.put("/:examId/publish",role(['UniversityExaminationBody']),  publishResults);

router.get("/pending-approval",role(['UniversityExaminationBody', 'UniversityExamCellStaff']),  getExamsForApproval);
router.get("/dashboard/stats", role('UniversityExaminationBody'), getDashboardStats);

router.get("/",role(['UniversityExaminationBody', 'UniversityExamCellStaff']),  getAllExams);
router.get("/:id",role(['UniversityExaminationBody', 'UniversityExamCellStaff']),  getExamById);

// --- NEW ROUTES FOR RESULTS ---
router.get("/:examId/results/entry", role(['UniversityExamCellStaff']), getExamResultsForEntry);
router.post("/:examId/results", role(['UniversityExamCellStaff']), addOrUpdateResults);

router.get("/:examId/results", role(['UniversityExaminationBody', 'UniversityExamCellStaff']), getExamResults);

// --- DEDICATED ROUTE FOR ASSIGNING MARKS TO A SINGLE STUDENT ---
router.put("/:examId/student/:studentAcademicId/marks",role(['UniversityExamCellStaff']),  updateStudentMarks);

export default router;
