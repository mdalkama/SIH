import { role } from "../../middlewares/authMiddleware.js";


export const getRole = async (req, res) => {
    try {
        res.status(200).json({ role: req.user.role , id: req.user.id});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};