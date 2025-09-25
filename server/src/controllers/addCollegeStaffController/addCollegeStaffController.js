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
        if (!admin.collegeCode) {
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

        if (role === "CollegeHOD") {
            if (department) {
                staffData.department = department;
            } else {
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

export const getStaff = async (req, res) => {
    try {
        const { staffId, role, collegeCode } = req.query;

        // 1. Get logged in user from token (assume middleware ne set kiya h req.user)
        const loggedInUser = await Staff.findById(req.user.id).select("role collegeCode");

        if (!loggedInUser) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        let filter = {};

        // 2. StaffId filter
        if (staffId) filter.staffId = staffId;

        // 3. Role filter
        if (role) {
            filter.role = role;
        } else {
            // Allowed university roles only
            filter.role = {
                $in: [
                    "CollegeDirector",
                    "CollegeDean",
                    "CollegeHOD",
                    "CollegeFaculty",
                    "CollegeHostelWarden",
                    "CollegeLibrarian",
                    "CollegeAdmissionDepartment",
                    "CollegeFinanceBody",
                    "CollegeExaminationBody",
                    "CollegePlacementOfficer"
                ]
            };
        }

        // 4. CollegeCode filter – loggedInUser ke hisaab se
        if (loggedInUser.role.startsWith("College")) {
            // agar College-level banda hai toh sirf apne college ke staff dekh sakta hai
            filter.collegeCode = loggedInUser.collegeCode;
        } else if (collegeCode) {
            // agar university level hai toh query param se filter kar sakta hai
            filter.collegeCode = collegeCode;
        }

        // 5. Query DB with filter
        const staffList = await Staff.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: staffList.length,
            staff: staffList
        });
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