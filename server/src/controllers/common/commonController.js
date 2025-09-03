import { role } from "../../middlewares/authMiddleware.js";


export const getRole = async (req, res) => {
    try {
        res.status(200).json({ 
                    message: "Access denied: You don't have permission",
                    user: req.user // optional
                });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};