import Student from "../../models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from '../../models/staffModel.js'
import Course from '../../models/courseModel.js'

// 🟢 Register
export const registerStudent = async (req, res) => {
    try {
        const Id = req.user?.id;
        const admin = await Staff.findById(Id).select("collegeCode");
        if (!admin) return res.status(404).json({ message: "User not found" });
        const { name, email, phone, password, role, registrationNumber, course } = req.body;
        if (!name || !email || !phone || !password || !role || !registrationNumber || !course)
            return res.status(400).json({ message: "All fields are required" });

        if (!admin.collegeCode) {
            res.status(400).json({ message: "collegeCode is required" });
        }

        const existing = await Student.findOne({ $or: [{ email }, { registrationNumber }] });
        if (existing) return res.status(400).json({ message: "Email or registration number already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name, email, phone, password: hashedPassword, role, course, registrationNumber, collegeCode: req.user.collegeCode
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
            { id: student._id, name: student.name, collegeCode: student.collegeCode, role: student.role, registrationNumber: student.registrationNumber },
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
            user: { id: student._id, name: student.name, collegeCode: student.collegeCode, role: student.role, registrationNumber: student.registrationNumber }
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

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const course = await Course.findOne({ courseId: student.courseId })
            .select("courseId degree branch specialization totalSemester semesters")
            .populate({
                path: "semesters.subjects",
                model: "Subject",
                select: "name code credits type maxMarks"
            });

        res.status(200).json({
            message: "Profile retrieved successfully",
            user: student,
            course: course
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 2. Find the student in the database
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // 3. Define which fields are editable by the student
    const editableFields = [
      'phone',
      'alternatePhone',
      'resumeLink',
      'profilePictureLink',
    ];

    const editableAddressFields = [
        'street',
        'city',
        'state',
        'zipCode',
        'country'
    ];
    
    const editablePersonalFields = [
        'fatherName',
        'motherName',
        'guardianName',
        'parentsNumber',
    ];

    const editableEmergencyContactFields = [
        'name',
        'phone',
        'relation'
    ];
    
    // Update top-level fields
    editableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });
    
    // Update nested address fields
    if (req.body.address) {
      editableAddressFields.forEach(field => {
        if (req.body.address[field] !== undefined) {
          student.address[field] = req.body.address[field];
        }
      });
    }

    // Update nested personal details
    if (req.body.personalDetails) {
        editablePersonalFields.forEach(field => {
            if (req.body.personalDetails[field] !== undefined) {
                student.personalDetails[field] = req.body.personalDetails[field];
            }
        });
    }
    
    // Update nested emergency contact
    if (req.body.emergencyContact) {
        editableEmergencyContactFields.forEach(field => {
            if (req.body.emergencyContact[field] !== undefined) {
                student.emergencyContact[field] = req.body.emergencyContact[field];
            }
        });
    }

    // 5. Save the updated student document
    const updatedStudent = await student.save();

    // 6. Send a success response with the updated student data
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedStudent, 
    });

  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getSerial = async(req,res)=>{
    const {batch, courseId} = req.params;
    if(!batch || !courseId){
        res.status(400).json({ message: "All fields are required" });
    }
    try {
        const student = await Student.countDocuments({collegeCode:req.user.collegeCode, batch, courseId});
        res.status(200).json({student});
    }
    catch (error) {
    }    
    
}