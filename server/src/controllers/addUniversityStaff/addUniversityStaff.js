// controllers/staffController.js
import Staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const addStaffByRole = async (req, res) => {
    try {
        const Id = req.user.id;
        const admin = await Staff.findById(Id)
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const { name, email, password, staffId, gender, salary, phone } = req.body;
        if (!name || !email || !password || !staffId || !gender || !salary || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check duplicates
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) return res.status(400).json({ message: "Email, Phone or StaffId already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const role = req.role; // <-- dynamically set in route

        const newStaff = new Staff({
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role,
            salary,
            gender,
            createdBy: new mongoose.Types.ObjectId(Id),
            updatedBy: new mongoose.Types.ObjectId(Id)
        });

        await newStaff.save();

        const result = newStaff.toObject();
        delete result.password;

        res.status(201).json({
            message: `${role} added successfully`,
            staff: result
        });

    } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).json({ message: "Server error" });
    }
};
