import jwt from "jsonwebtoken";

export const role = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) return res.status(401).json({ message: "Access Denied" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log(req.user);


            if (!allowedRoles.includes(req.user.role))
                return res.status(403).json({ message: "Access denied: You don't have permission" });

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };
};
