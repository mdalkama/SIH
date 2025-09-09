import express from 'express';
const router = express.Router();
import {
    getCollegeDashboardStats, getCollegeApplications, 
    getCollegeMeritList, getCollegeAllocations, getAdmittedStudents
} from '../../controllers/admissionSystem/collegeController.js';

// Middleware placeholders
const authMiddleware = (req, res, next) => { /* ... authentication logic ... */ next(); };
const isCollegeAdmin = (req, res, next) => { /* ... role check logic ... */ next(); };

// Yeh sabhi routes protected hain aur inke liye College Admin role anivarya hai
router.use(authMiddleware, isCollegeAdmin);

router.route('/dashboard').get(getCollegeDashboardStats);
router.route('/applications').get(getCollegeApplications);
router.route('/merit-list').get(getCollegeMeritList);
router.route('/allocations').get(getCollegeAllocations);
router.route('/admitted-students').get(getAdmittedStudents);

export default router;

