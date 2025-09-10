import express from "express";
import { getMyAllocation, raiseComplaint, getMyComplaints } from "../controllers/studentHostelController/studentHostelController.js";

const router = express.Router();

router.get('/my-allocation', getMyAllocation);
router.get('/complaints', getMyComplaints);
router.post('/complaints/raise', raiseComplaint);

export default router;