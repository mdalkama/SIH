import express from "express";
import multer from "multer";
import { createPost } from "../controllers/postController/postController.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.array("media", 10), createPost);

export default router;
