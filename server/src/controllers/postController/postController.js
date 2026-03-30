import postModel from "../../models/postModel.js";
import { uploadFile } from "../../services/uploadFile.js";

const ALLOWED_MEDIA_TYPES = ["image", "video"];

export async function createPost(req, res) {
    try {
        const author = req.user.id;
        const { caption } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one media file is required" });
        }

        // Filter to only supported media types before uploading
        const supportedFiles = files.filter(file => {
            const mediaType = file.mimetype.split("/")[0];
            return ALLOWED_MEDIA_TYPES.includes(mediaType);
        });

        if (supportedFiles.length === 0) {
            return res.status(400).json({ success: false, message: "No supported media files provided. Only images and videos are allowed." });
        }

        const media = await Promise.all(supportedFiles.map(async file => {
            const result = await uploadFile({ buffer: file.buffer, fileName: file.originalname });
            return {
                url: result.url,
                media_type: file.mimetype.split("/")[0]
            };
        }));

        const post = await postModel.create({
            caption,
            author,
            media
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });
    } catch (err) {
        console.error("Error creating post:", err);
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
}
