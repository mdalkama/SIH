import express from "express";
import multer from "multer";
import { submitApplicationAndCreateOrder, verifyApplicationPayment } from "../controllers/applicationController/applicationController.js";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the fields you expect files for. 
// This should match the keys in your `uploadedFiles` state in React.
const fileUploadFields = [
    { name: 'studentPhoto', maxCount: 1 },
    { name: 'studentSign', maxCount: 1 },
    { name: 'aadharCard', maxCount: 1 },
    { name: 'tenthMarksheet', maxCount: 1 },
    // Add other optional file fields here
    { name: 'preferentialCertificate', maxCount: 1 },
    { name: 'affidavitCertificate', maxCount: 1 },
    { name: 'tfwsCertificate', maxCount: 1 },
    { name: 'twelfthMarksheet', maxCount: 1 },
    { name: 'graduationMarksheet', maxCount: 1 },
    { name: 'mastersMarksheet', maxCount: 1 },
];

// Apply the middleware to the specific route
router.post('/submit', upload.fields(fileUploadFields), submitApplicationAndCreateOrder);
router.post('/verify-payment', verifyApplicationPayment);

export default router;