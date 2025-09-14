import jwt from "jsonwebtoken";

export const role = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                // User not logged in
                req.user = null; 
                return res.status(401).json({ 
                    message: "Not logged in", 
                    user: null // frontend me easily check ho jaye
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
console.log(allowedRoles)
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    message: "Access denied: You don't have permission",
                    user: req.user // optional
                });
            }

            next();
        } catch (err) {
            console.error(err);
            // Agar token invalid ho ya expire ho gaya ho
            req.user = null;
            return res.status(401).json({ 
                message: "Invalid or expired token", 
                user: null 
            });
        }
    };
};
