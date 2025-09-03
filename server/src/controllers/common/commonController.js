import { role } from "../../middlewares/authMiddleware.js";


export const getRole = async (req, res) => {
    try {
        res.status(200).json({ 
                    message: "Successfully fetched",
                    user: req.user // optional
                });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};