import { Router } from "express";
const router = Router();

import {submitApplication, getApplicationStatus, getAdmitCard, getRanks, getAllocationResult, confirmOrRejectSeat} from '../../controllers/admissionSystem/applicationController.js'

router.post("/apply", submitApplication);
router.get("/status", getApplicationStatus);
router.get("/admit-card", getAdmitCard);
router.get("/ranks", getRanks);
router.get("/allocation-result", getAllocationResult);
router.post("/confirm-seat", confirmOrRejectSeat);

export default router;
