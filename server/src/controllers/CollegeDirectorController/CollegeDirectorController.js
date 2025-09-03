import Staff from "../../models/staffModel.js";
import bcrypt, { genSalt } from "bcryptjs";
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

export const addExamController = async (req, res) => {
    try {
        const directorId = req.user.id;
        const director = await Staff.findById(directorId).select("collegeId");
        if (!director) {
            return res.status(404).json({ message: "Director not found" });
        }

        const { name, email, password, salary, gender, staffId, phone } = req.body;
        if (!name || !email || !password || salary == null || !gender || !staffId || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check duplicates (email, phone, staffId)
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) {
            return res.status(400).json({ message: "Email, Phone or StaffId already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newExamController = new Staff({
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role: "CollegeExaminationBody",
            collegeId: director.collegeId,
            salary,
            gender,
            createdBy: new mongoose.Types.ObjectId(directorId),
            updatedBy: new mongoose.Types.ObjectId(directorId)
        });

        await newExamController.save();

        const result = newExamController.toObject();
        delete result.password; // remove password from response

        res.status(201).json({
            message: "Examination Body added successfully",
            examController: result
        });
    } catch (error) {
        console.error("Error adding examination controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const addLibrarian = async (req, res) => {
    try {
        const directorId = req.user.id;
        const director = await Staff.findById(directorId).select("collegeId");
        if (!director) {
            return res.status(404).json({ message: "Director not found" });
        }

        const { name, email, password, salary, gender, staffId, phone } = req.body;
        if (!name || !email || !password || salary == null || !gender || !staffId || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check duplicates (email, phone, staffId)
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) {
            return res.status(400).json({ message: "Email, Phone or StaffId already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newLibrarian = new Staff({
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role: "CollegeLibrarian",
            collegeId: director.collegeId,
            salary,
            gender,
            createdBy: new mongoose.Types.ObjectId(directorId),
            updatedBy: new mongoose.Types.ObjectId(directorId)
        });

        await newLibrarian.save();

        const result = newLibrarian.toObject()
        delete result.password;
        res.status(201).json({
            message: "Librarian added successfully",
            librarian: result
        })

    } catch (error) {
        console.error("Error adding librarian:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const addWarden = async (req, res) => {
    try {
        const directorId = req.user.id;
        const director = await Staff.findById(directorId).select("collegeId");
        if (!director) {
            return res.status(404).json({ message: "Director not found" });
        }


        const { name, email, password, salary, gender, staffId, phone } = req.body;
        if (!name || !email || !password || salary == null || !gender || !staffId || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        // Check duplicates (email, phone, staffId)
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) {
            return res.status(400).json({ message: "Email, Phone or StaffId already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newWarden = new Staff({
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role: "CollegeHostelWarden",
            collegeId: director.collegeId,
            salary,
            gender,
        });
        await newWarden.save();

        const result = newWarden.toObject();
        delete result.password;
        res.status(201).json({
            message: "Warden added successfully",
            warden: result
        });
    } catch (error) {
        console.error("Error adding warden:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const addFinanceBody = async (req, res) => {
    try {
        const directorId = req.user.id;
        const director = await Staff.findById(directorId).select("collegeId");
        if (!director) {
            return res.status(404).json({ message: "Director not found" });
        }

        const { name, email, password, salary, gender, staffId, phone } = req.body;
        if (!name || !email || !password || salary == null || !gender || !staffId || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }


        // Check duplicates (email, phone, staffId)
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) {
            return res.status(400).json({ message: "Email, Phone or StaffId already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newFinanceBody = new Staff({
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role: "CollegeFinanceBody",
            collegeId: director.collegeId,
            salary,
            gender,
        });
        await newFinanceBody.save();

        const result = newFinanceBody.toObject();
        delete result.password;
        res.status(201).json({
                message: "Finance Body added successfully",
                financeBody: result
            })
            } catch (error) {
        console.error("Error adding finance body:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const addAdmissionDepartment = async (req, res) => {
    try {
        const directorId = req.user.id;
        const director = await Staff.findById(directorId).select("collegeId");
        if (!director) {
            return res.status(404).json({ message: "Director not found" });
        }
        const { name, email, password, salary, gender, staffId, phone } = req.body;
        if (!name || !email || !password || salary == null || !gender || !staffId || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        // Check duplicates (email, phone, staffId)
        const existingStaff = await Staff.findOne({
            $or: [{ email }, { phone }, { staffId }]
        });
        if (existingStaff) {
            return res.status(400).json({ message: "Email, Phone or StaffId already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmissionDepartment = new Staff({
            name,
            email,
            staffId,
            phone,
            password: hashedPassword,
            role: "CollegeAdmissionDepartment",
            collegeId: director.collegeId,
            salary,
            gender,
        });
        await newAdmissionDepartment.save();

        const result = newAdmissionDepartment.toObject();
        delete result.password;
        res.status(201).json({
                message: "Admission Department added successfully",
                admissionDepartment: result
        })
        } catch (error) {
        console.error("Error adding admission department:", error);
        res.status(500).json({ message: "Server error" });
    }

}


