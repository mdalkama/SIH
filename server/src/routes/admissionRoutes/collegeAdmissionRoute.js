import {Router} from 'express';
const router = Router();

import {
  getCollegeDashboardStats,
  getCollegeApplications,
  getCollegeMeritList,
  getCollegeAllocations,
  getAdmittedStudents
} from '../../controllers/admissionSystem/collegeController.js';


// ✅ Simple route definitions
router.get('/dashboard', getCollegeDashboardStats);
router.get('/applications', getCollegeApplications);
router.get('/merit-list', getCollegeMeritList);
router.get('/allocations', getCollegeAllocations);
router.get('/admitted-students', getAdmittedStudents);

export default router;
