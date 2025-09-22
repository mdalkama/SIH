import Student from "../../models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from '../../models/staffModel.js'
import Course from '../../models/courseModel.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import StudentAcademics from "../../models/studentAcademicsModel.js";

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

export const getMyAcademics = async (req, res) => {
    try {
        if(!req.user) return res.status(401).json({ message: "Unauthorized" });

        const studentAcademics = await StudentAcademics.findOne({ studentId: req.user.id });
        if (!studentAcademics) {
            return res.status(404).json({ message: "Academic record not found." });
        }
        res.status(200).json({ success: true, academics: studentAcademics });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ message: "No student found with that email address." });
        }

        // 1. Generate a secure, random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // 2. Hash the token and set it in the database
        student.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        
        // 3. Set an expiry time (e.g., 10 minutes from now)
        student.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await student.save({ validateBeforeSave: false }); // Save the token fields

        // 4. Create the reset URL for the email
        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        // 5. Send the email using nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"sih" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: "Password Reset Request",
            html: `
                <p>You requested a password reset for your account.</p>
                <p>Please click the link below to set a new password. This link is valid for 10 minutes.</p>
                <a href="${resetURL}" target="_blank">Reset Your Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Password reset token sent to email." });

    } catch (err) {
        // Clear token fields if something goes wrong
        if (req.body.email) {
            const student = await Student.findOne({ email: req.body.email });
            if (student) {
                student.passwordResetToken = undefined;
                student.passwordResetExpires = undefined;
                await student.save({ validateBeforeSave: false });
            }
        }
        console.error("FORGOT PASSWORD ERROR:", err);
        res.status(500).json({ message: "An error occurred while sending the email." });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        // 1. Hash the incoming token to find the matching user in the DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 2. Find the user by the hashed token and check if it's not expired
        const student = await Student.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!student) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        // 3. Set the new password
        student.password = await bcrypt.hash(password, 10);
        
        // 4. Clear the reset token fields
        student.passwordResetToken = undefined;
        student.passwordResetExpires = undefined;

        await student.save();

        res.status(200).json({ success: true, message: "Password has been reset successfully." });

    } catch (err) {
        console.error("RESET PASSWORD ERROR:", err);
        res.status(500).json({ message: "An error occurred while resetting the password." });
    }
};

export const getAllStudentsForPlacement = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', courseId = 'all', minCgpa = 0 } = req.query;
        const collegeCode = req.user.collegeCode;

        // Base query for students in the officer's college
        let matchQuery = { collegeCode };

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            matchQuery.$or = [
                { name: searchRegex },
                { registrationNumber: searchRegex }
            ];
        }

        if (courseId !== 'all') {
            matchQuery.courseId = courseId;
        }

        const aggregationPipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: "studentacademics",
                    localField: "_id",
                    foreignField: "studentId",
                    as: "academics"
                }
            },
            { $unwind: { path: "$academics", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "courseId",
                    as: "courseInfo"
                }
            },
             { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    // This is a simplified CGPA calculation (latest SGPA)
                    cgpa: { $ifNull: [{ $arrayElemAt: ["$academics.previousResults.sgpa", -1] }, 0] }
                }
            },
            { $match: { cgpa: { $gte: parseFloat(minCgpa) } } },
            {
                $project: {
                    name: 1,
                    registrationNumber: 1,
                    courseId: 1,
                    branch: "$courseInfo.branch",
                    cgpa: 1,
                    // You can add placement status here later
                }
            }
        ];

        // Get total count for pagination
        const countPipeline = [...aggregationPipeline, { $count: 'total' }];
        const totalDocsArr = await Student.aggregate(countPipeline);
        const totalDocs = totalDocsArr[0]?.total || 0;

        // Get paginated data
        const students = await Student.aggregate([
            ...aggregationPipeline,
            { $sort: { name: 1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        ]);
        
        res.status(200).json({
            success: true,
            students,
            totalPages: Math.ceil(totalDocs / limit),
            currentPage: parseInt(page),
            totalDocs
        });
    } catch (error) {
        console.error("Error fetching students for placement:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};