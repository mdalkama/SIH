// controllers/staffController.js
import Staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Create/Add Staff
export const addStaffByRole = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await Staff.findById(adminId);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        // Destructuring collegeCode instead of collegeId for clarity
        const { name, email, password, staffId, gender, salary, phone, role, collegeCode } = req.body;

        // collegeCode is mandatory only if the role is CollegeAdmin.
        if (role === "CollegeAdmin" && !collegeCode) {
            return res.status(400).json({ message: "collegeCode is required for CollegeAdmin role" });
        }

        if (!name || !email || !password || !staffId || !gender || !salary || !phone || !role) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check for duplicates
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) return res.status(400).json({ message: "Email, Phone or StaffId already exists" });

        // Only add collegeCode to the data if the role is CollegeAdmin.
        if (role === "CollegeAdmin") {
            // Check if a CollegeAdmin with this collegeCode already exists.
            const existingCollegeAdmin = await Staff.findOne({ collegeCode, role: "CollegeAdmin" });
            if (existingCollegeAdmin) {
                return res.status(400).json({ message: `A CollegeAdmin for college code ${collegeCode} already exists.` });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaffData = {
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role,
            salary,
            gender,
            createdBy: new mongoose.Types.ObjectId(adminId),
            updatedBy: new mongoose.Types.ObjectId(adminId)
        };
        
        if (role === "CollegeAdmin") {
            newStaffData.collegeCode = collegeCode;
        }

        const newStaff = new Staff(newStaffData);
        await newStaff.save();

        const result = newStaff.toObject();
        delete result.password;

        res.status(201).json({ message: `${role} added successfully`, staff: result });

    } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all University-level Staff or College-level staff filtered by collegeId
export const getStaff = async (req, res) => {
    try {
        const { staffId, role, collegeCode } = req.query;

        let filter = {};

        if (role) filter.role = role;

        // Only allowed university roles
        const universityRoles = [
            'UniversityGoverningBody',
            'UniversityRegistrar',
            'UniversityExaminationBody',
            'UniversityExamCellStaff',
            'CollegeAdmin'
        ];

        // This filter will apply only if no specific role is requested in the query
        if (!role) {
            filter.role = { $in: universityRoles };
        }

        if (staffId) filter.staffId = staffId;
        if (collegeCode) filter.collegeCode = collegeCode;

        const staffList = await Staff.find(filter).select("-password").sort({ createdAt: -1 });

        res.json({ success: true, count: staffList.length, staff: staffList });
    } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Staff by ID
export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid staff ID" });

        const staff = await Staff.findById(id).select("-password");
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        res.json({ success: true, staff });
    } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update Staff
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid staff ID" });

        const updateData = { ...req.body, updatedBy: new mongoose.Types.ObjectId(adminId) };

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });

        res.json({ success: true, message: "Staff updated successfully", staff: updatedStaff });
    } catch (error) {
        console.error("Error updating staff:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Staff
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid staff ID" });

        const staff = await Staff.findByIdAndDelete(id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        res.json({ success: true, message: "Staff deleted successfully" });
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).json({ message: "Server error" });
    }
};

