import Staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";

export const addDean = async (req, res) => {
    try {
        const { name, email, password, department, collegeId ,staffId, gender} = req.body;
        // Check if the user already exists
        const existingUser = await Staff.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        

        // Create a new user
        const newDean = new Staff({
            name,
            email,
            password: hashedPassword,
            role: "CollegeDean",
            department,
            collegeId,
            staffId,
            gender
        });

        await newDean.save();

        res.status(201).json({ message: "Dean added successfully", dean: newDean });
    } catch (error) {
        console.error("Error adding dean:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const addExaminationBody = async (req, res) => {
    try {
        const { name, email, password, department, collegeId } = req.body;

        // Check if the user already exists
        const existingUser = await Staff.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        const newExaminationBody = new Staff({
            name,
            email,
            password,
            role: "ExaminationBody",
            department,
            collegeId
        });

        await newExaminationBody.save();

        res.status(201).json({ message: "Examination Body added successfully", examinationBody: newExaminationBody });
    } catch (error) {
        console.error("Error adding examination body:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const addFinanceBody  = async (req, res) => {
    try {
        const { name, email, password, department, collegeId } = req.body;

        // Check if the user already exists
        const existingUser = await Staff.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        const newFinanceBody = new Staff({
            name,
            email,
            password,
            role: "FinanceBody",
            department,
            collegeId
        });

        await newFinanceBody.save();

        res.status(201).json({ message: "Finance Body added successfully", financeBody: newFinanceBody });
    } catch (error) {
        console.error("Error adding finance body:", error);
        res.status(500).json({ message: "Server error" });
    }
};