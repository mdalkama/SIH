import Student from "../../models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🟢 Register
export const registerStudent = async (req, res) => {
    try {
        const Id = req.user.id;
        const admin = await Staff.findById(Id).select("collegeCode");
        if (!admin) return res.status(404).json({ message: "User not found" });
        const { name, email, phone, password, role, registrationNumber } = req.body;
        if (!name || !email || !phone || !password || !role || !registrationNumber)
            return res.status(400).json({ message: "All fields are required" });

        if (!admin.collegeCode) {
            res.status(400).json({ message: "collegeCode is required" });
        }

        const existing = await Student.findOne({ $or: [{ email }, { registrationNumber }] });
        if (existing) return res.status(400).json({ message: "Email or registration number already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name, email, phone, password: hashedPassword, role, registrationNumber, collegeCode: req.user.collegeCode
        });

        res.status(201).json({ message: "Student registered", student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🟢 Login
export const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email & password required" });

        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (student.status !== "active") return res.status(403).json({ message: "Account inactive" });

        // JWT
        const token = jwt.sign(
            { id: student._id, role: student.role, registrationNumber: student.registrationNumber },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        res.status(200).json({
            message: "Login successful",
            user: { id: student._id, role: student.role, registrationNumber: student.registrationNumber }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🟢 Logout
export const logoutStudent = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.json({ message: "Logged out successfully" });
};

export const getMyProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};