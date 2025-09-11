import bcrypt from "bcryptjs";
import Student from "../../models/studentModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";

// 1️⃣ Add Student + Academics
export const addStudent = async (req, res) => {
    try {
        if(req.user.collegeCode){
            res.status(400).json({ message: "collegeCode is required" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const student = await Student.create({
            ...req.body,
            password: hashedPassword,
            collegeCode: req.user.collegeCode
        });

        await StudentAcademics.create({
            studentId: student._id,
            registrationNumber: student.registrationNumber,
            collegeCode: req.user.collegeCode,
            courseCode: req.body.courseCode,
            previousResults: [],
            currentExamRegistrations: []
        });

        res.status(201).json({ message: "Student created successfully", student });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 2️⃣ Delete Student + Academics
export const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        const student = await Student.findByIdAndDelete(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        await StudentAcademics.deleteOne({ studentId });

        res.json({ message: "Student and academics deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3️⃣ Promote Student
export const promoteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // Increment semester
        student.semester = (student.semester || 1) + 1;

        // Optional: update yearOfPassing
        if (req.body.yearOfPassing) student.yearOfPassing = req.body.yearOfPassing;

        await student.save();

        res.json({ message: "Student promoted successfully", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
