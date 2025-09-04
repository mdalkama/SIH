// controllers/staffController.js
import Staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const addStaffByRole = async (req, res) => {
    try {
        const Id = req.user.id;
        const admin = await Staff.findById(Id).select("collegeCode");
        if (!admin) return res.status(404).json({ message: "User not found" });

        const { name, email, password, staffId, gender, salary, phone, department = "", subjects = [] } = req.body;
        if (!name || !email || !password || !staffId || !gender || !salary || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        if(!admin.collegeCode){
            res.status(400).json({ message: "collegeCode is required" });
        }

        // Check duplicates
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) return res.status(400).json({ message: "Email, Phone or StaffId already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const role = req.role; // <-- dynamically set in route

        const staffData = {
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role,
            collegeCode: admin.collegeCode,
            salary,
            gender,
            createdBy: new mongoose.Types.ObjectId(admin),
            updatedBy: new mongoose.Types.ObjectId(admin),
        };

        if (role === "CollegeHOD"){
            if(department){
            staffData.department = department;
        }else{
            res.status(400).json({ message: "Department is required for HOD" });
        }
        }
        // Only faculty / HOD get subjects
        if (role === "CollegeFaculty" || role === "CollegeHOD") {
            staffData.subjects = subjects;
        }

        const newStaff = new Staff(staffData);
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
