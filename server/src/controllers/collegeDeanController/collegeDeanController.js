import Staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";


export const addDean = async (req, res) => {
    try {
        const directorId = req.user.id;
        const director = await Staff.findById(directorId).select('collegeId');
        if (!director) {
            return res.status(404).json({ message: "Director not found" });
        }
        const { name, email, password, staffId, gender, salary, phone } = req.body;
        if (!name || !email || !password || !staffId || !gender || !salary || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        // Check if the user already exists
        const existingUser = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email, Phone or StaffId already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        // Create a new user
        const newDean = new Staff({
            name,
            email,
            password: hashedPassword,
            role: "CollegeDean",
            collegeId: director.collegeId,
            staffId,
            gender,
            salary,
            phone,
            createdBy: new mongoose.Types.ObjectId(directorId),
            updatedBy: new mongoose.Types.ObjectId(directorId)
        });

        await newDean.save();
        const result = newDean.toObject();
        delete result.password;


        res.status(201).json({ message: "Dean added successfully", dean: newDean });
    } catch (error) {
        console.error("Error adding dean:", error);
        res.status(500).json({ message: "Server error" });
    }
};