import { Router } from "express";

const router = Router();

router.get("/", (req, res) => { res.status(200).send("API is running"); });
router.get("/order", (req, res) => { res.status(200).send("API is running in v1"); });

export default router;
