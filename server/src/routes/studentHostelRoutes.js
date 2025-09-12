import express from "express";
import { getMyAllocation, raiseComplaint, getMyComplaints, requestRoomChange, addVisitor, getMyRoomChangeRequests, getMyVisitors } from "../controllers/studentHostelController/studentHostelController.js";

const router = express.Router();

router.get('/my-allocation', getMyAllocation);
router.get('/complaints', getMyComplaints);
router.post('/complaints/raise', raiseComplaint);
router.post('/room-change-request', requestRoomChange);
router.post('/visitor-pass', addVisitor);
router.get('/room-change-requests', getMyRoomChangeRequests);
router.get('/visitors', getMyVisitors);

export default router;