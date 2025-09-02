import { Router } from "express";
import { role } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", role(['admin', 'user']), (req, res) => { res.status(200).send("API is running"); });
export default router;
