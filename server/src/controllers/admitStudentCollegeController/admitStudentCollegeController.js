import bcrypt from "bcryptjs";
import Student from "../../models/studentModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";
import StudentHostel from "../../models/studentHostelModal.js";
import StudentLibrary from "../../models/studentLibraryModel.js";
import StudentPayment from "../../models/studentPaymentModal.js";
import College from "../../models/collegeModel.js";

// 1️⃣ Add Student + Academics
export const addStudent = async (req, res) => {
    try {
        if (!req.user.collegeCode) {
            return res.status(400).json({ message: "Admin's collegeCode is required." });
        }

        const { password, courseId } = req.body; // courseId is the ObjectId of the course

        const college = await College.findOne({ code: req.user.collegeCode })
            .populate("courses.courseId", "courseId degree branch specialization totalSemester semesters");
        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }

        const courseDetails = college.courses.map(c => {
            const courseInfo = c.courseId;
            return {
                _id: courseInfo._id,
                courseId: courseInfo.courseId,
                fees: c.fees
            };
        });

        // ✅ Correct way to get courseId = "105" and its 1st semester fee
        const course = courseDetails.find(c => c.courseId === "105");
        let sem1 = null;
        if (course) {
            sem1 = course.fees.find(f => f.semester === 1);
        }




        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            ...req.body,
            password: hashedPassword,
            collegeCode: req.user.collegeCode
        });

        // Create associated records in other collections
        await StudentAcademics.create({
            studentId: student._id,
            registrationNumber: student.registrationNumber,
            collegeCode: req.user.collegeCode,
            courseId: courseId, // Use the ID from the created student
        });

        await StudentHostel.create({
            occupant: student._id,
            registrationNumber: student.registrationNumber,
            collegeCode: req.user.collegeCode,
        });

        await StudentLibrary.create({
            occupiedBy: student._id,
            registrationNumber: student.registrationNumber,
            collegeCode: req.user.collegeCode,
        });

        await StudentPayment.create({
            student: student._id,
            registrationNumber: student.registrationNumber,
            collegeCode: req.user.collegeCode,
            fines: [],
            semesters: [{semester:1, fees:sem1.fees}], // ✅ Use the prepared semester data here
            paymentHistory: []
        });

        res.status(201).json({ message: "Student created successfully", student });

    } catch (err) {
        console.error("Error in addStudent controller:", err);
        if (err.code === 11000) {
             return res.status(400).json({ error: "A student with this registration number or email already exists." });
        }
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
