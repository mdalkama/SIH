import express from 'express';
const router = express.Router();
import { 
    createSession, 
    getSessions, 
    addCourse, 
    addCollege, 
    getAllApplications, 
    verifyApplication, 
    generateMeritList, 
    startAllocationRound 
} from '../controllers/admissionSystem/universityController.js';

// --- Admission Session Routes ---
router.post('/sessions', createSession);
router.get('/sessions', getSessions);

// --- Course & College Management Routes ---
router.post('/courses', addCourse);
router.post('/colleges', addCollege);

// --- Application Management Routes ---
router.get('/applications', getAllApplications);
router.put('/applications/:id/verify', verifyApplication);

// --- Merit List & Allocation Routes ---
router.get('/merit-list', generateMeritList);
router.post('/allocation/start-round', startAllocationRound);

export default router;

