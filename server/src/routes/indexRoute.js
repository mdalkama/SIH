import { Router } from "express";
import { role } from "../middlewares/authMiddleware.js";
import studentRoutes from "./studentRoutes.js";
import staffRoute from "./staffRoute.js";

const router = Router();

router.get("/", (req, res) => { res.status(200).send("API is running"); });
router.use('/staff', staffRoute)
router.use("/student", studentRoutes);
export default router;
