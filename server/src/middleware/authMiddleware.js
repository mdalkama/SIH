export const role = (allowedRoles) => {
    return (req, res, next) => {
        try {
            req.user = { id: 1, name: "Alkama", role: "user" };
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You don't have permission",
                });
            }
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    };
};
