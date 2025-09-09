import express from 'express';
const router = express.Router();
import {
    submitApplication, getApplicationStatus, getAdmitCard,
    getRanks, getAllocationResult, confirmOrRejectSeat
} from '../controllers/applicationController.js';

// Middleware placeholders
const authMiddleware = (req, res, next) => { /* ... authentication logic ... */ next(); };
const isStudent = (req, res, next) => { /* ... role check logic ... */ next(); };

// Yeh sabhi routes protected hain aur inke liye Student role anivarya hai
router.use(authMiddleware, isStudent);

router.route('/apply').post(submitApplication);
router.route('/status').get(getApplicationStatus);
router.route('/admit-card').get(getAdmitCard);
router.route('/ranks').get(getRanks);
router.route('/allocation-result').get(getAllocationResult);
router.route('/confirm-seat').post(confirmOrRejectSeat);

export default router;

