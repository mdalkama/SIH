import express from 'express';
import {
    createPlacementDrive,
    getAllDrivesForOfficer,
    getDriveWithApplications,
    getAvailableDrivesForStudent,
    applyForDrive,
    getPlacementDashboardStats,
    updatePlacementDrive,
    deletePlacementDrive,
    updateApplicationStatus
} from '../controllers/placementController/placementController.js';
import { role } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- Routes for College Placement Officer ---
// (Requires user to be logged in and have the role 'CollegePlacementOfficer')
router.route('/drives')
    .post( role('CollegePlacementOfficer'), createPlacementDrive)
    .get( role('CollegePlacementOfficer'), getAllDrivesForOfficer)
    .delete(role('CollegePlacementOfficer'), deletePlacementDrive);

router.get('/drives/:driveId', role('CollegePlacementOfficer'), getDriveWithApplications);
router.put('/drives/:driveId', role('CollegePlacementOfficer'), updatePlacementDrive);
router.get('/dashboard/stats', role('CollegePlacementOfficer'), getPlacementDashboardStats);

router.put('/drives/:driveId/applications/:studentId', role('CollegePlacementOfficer'), updateApplicationStatus);

// --- Routes for Students ---
// (Requires user to be logged in and have the role 'Student')
router.get('/student/drives', role('student'), getAvailableDrivesForStudent);
router.post('/drives/:driveId/apply', role('student'), applyForDrive);


export default router;