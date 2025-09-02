import staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🟢 Register Staff
export const registerStaff = async (req, res) => {
    try {
        const { name, email, phone, password, role, staffId } = req.body;

        if (!name || !email || !phone || !password || !role || !staffId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await staff.findOne({ $or: [{ email }, { phone }, { staffId }] });
        if (existing) return res.status(400).json({ message: "Email, Phone or Staff ID already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const staff = await staff.create({
            ...req.body,
            password: hashedPassword
        });

        res.status(201).json({ message: "Staff registered successfully", staff });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🟢 Login Staff
export const loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email & password required" });

        const staff = await staff.findOne({ email });
        if (!staff) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (staff.status !== "active") return res.status(403).json({ message: "Account not active" });

        // JWT
        const token = jwt.sign(
            { id: staff._id, role: staff.role, staffId: staff.staffId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        staff.lastLogin = new Date();
        await staff.save();

        res.json({
            message: "Login successful",
            staff: { id: staff._id, name: staff.name, role: staff.role, staffId: staff.staffId }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🟢 Logout Staff
export const logoutStaff = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });
    res.json({ message: "Logged out successfully" });
};
