import express from 'express';
import {
    createPlacementDrive,
    getAllDrivesForOfficer,
    getDriveWithApplications,
    getAvailableDrivesForStudent,
    applyForDrive
} from '../controllers/placementController/placementController.js';
import { role } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- Routes for College Placement Officer ---
// (Requires user to be logged in and have the role 'CollegePlacementOfficer')
router.route('/drives')
    .post( role('CollegePlacementOfficer'), createPlacementDrive)
    .get( role('CollegePlacementOfficer'), getAllDrivesForOfficer);

router.get('/drives/:driveId', role('CollegePlacementOfficer'), getDriveWithApplications);


// --- Routes for Students ---
// (Requires user to be logged in and have the role 'Student')
router.get('/student/drives', role('student'), getAvailableDrivesForStudent);
router.post('/drives/:driveId/apply', role('student'), applyForDrive);


export default router;