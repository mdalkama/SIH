import Staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🟢 Register Staff
export const registerStaff = async (req, res) => {
    try {
        const { name, email, phone, password, role, staffId, gender } = req.body;

        if (!name || !email || !phone || !password || !role || !staffId || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await Staff.findOne({ $or: [{ email }, { phone }, { staffId }] });
        if (existing) {
            return res.status(400).json({ message: "Email, Phone, or Staff ID already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const staff = await Staff.create({
            ...req.body,
            password: hashedPassword
        });

        res.status(201).json({ message: "Staff registered successfully", staff });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🟢 Login Staff
export const loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email & password required" });

        const staff = await Staff.findOne({ email });
        if (!staff) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (staff.status !== "active") return res.status(403).json({ message: "Account not active" });

        // JWT
        const token = jwt.sign(
            {id: staff._id,name: staff.name, collegeCode: staff.collegeCode, role: staff.role , staffId: staff.staffId},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        );

        // Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        staff.lastLogin = new Date();
        await staff.save();

        res.status(200).json({
            message: "Login successful",
            user: { id: staff._id, name: staff.name, collegeCode: staff.collegeCode, role: staff.role, staffId: staff.staffId }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🟢 Logout Staff
export const logoutStaff = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
};


export const getStaffProfile = async (req, res) => {
    try {
        const staff = await Staff.findById(req.user.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });
        res.status(200).json({ message: "Profile retrieved successfully", user: staff });
    } catch (err) {
        console.error("Profile Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateStaffProfile = async (req, res) => {
    try {
        const staffId = req.user.id;

        if (req.body.phone) {
            const existingStaffWithPhone = await Staff.findOne({ 
                phone: req.body.phone,
                _id: { $ne: staffId } // $ne means "not equal to"
            });

            if (existingStaffWithPhone) {
                return res.status(409).json({ // 409 Conflict is a good status code for this
                    success: false,
                    message: "This phone number is already registered to another staff member."
                });
            }
        }

        // Fields that a staff member is allowed to edit
        const editableFields = {
            topLevel: ['phone', 'alternatePhone', 'profilePic'],
            personalDetails: ['fatherName', 'motherName', 'nationality', 'maritalStatus'],
            address: ['street', 'city', 'state', 'zipCode', 'country'],
            emergencyContact: ['name', 'phone', 'relation'],
            bankDetails: ['accountNumber', 'ifscCode', 'bankName', 'branch']
        };

        const updateData = {};

        // (The logic to build updateData remains the same as before)
        editableFields.topLevel.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        for (const nestedKey in editableFields) {
            if (nestedKey !== 'topLevel' && req.body[nestedKey] && typeof req.body[nestedKey] === 'object') {
                editableFields[nestedKey].forEach(field => {
                    if (req.body[nestedKey][field] !== undefined) {
                        updateData[`${nestedKey}.${field}`] = req.body[nestedKey][field];
                    }
                });
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "No valid fields provided for update." });
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            staffId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedStaff) {
            return res.status(404).json({ success: false, message: "Update failed, staff member not found." });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedStaff,
        });

    } catch (error) {
        console.error("Error updating staff profile:", error);
        res.status(500).json({ success: false, message: "Server error while updating profile." });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const staffMember = await Staff.findOne({ email });

        if (!staffMember) {
            return res.status(404).json({ message: "No staff member found with that email address." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        staffMember.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        
        staffMember.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await staffMember.save({ validateBeforeSave: false });

        // IMPORTANT: The URL should point to a staff-specific reset page if you want different UIs
        const resetURL = `${req.protocol}://${req.get('host')}/reset-password-staff/${resetToken}`;

        const transporter = nodemailer.createTransport({ /* ... your nodemailer config ... */ });
        const mailOptions = {
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: staffMember.email,
            subject: "Staff Account Password Reset Request",
            html: `<p>Click the link to reset your staff account password: <a href="${resetURL}">Reset Password</a></p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Password reset token sent to staff email." });

    } catch (err) {
         if (staffMember) {
            staffMember.passwordResetToken = undefined;
            staffMember.passwordResetExpires = undefined;
            await staffMember.save({ validateBeforeSave: false });
        }
        console.error("STAFF FORGOT PASSWORD ERROR:", err);
        res.status(500).json({ message: "An error occurred while sending the email. Please try again later." });
    }
};

// @desc    Handle the actual password reset for Staff
// @route   PATCH /api/v1/staff/reset-password/:token
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const staffMember = await Staff.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!staffMember) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        staffMember.password = await bcrypt.hash(password, 10);
        staffMember.passwordResetToken = undefined;
        staffMember.passwordResetExpires = undefined;

        await staffMember.save();

        res.status(200).json({ success: true, message: "Staff password has been reset successfully." });

    } catch (err) {
        console.error("STAFF RESET PASSWORD ERROR:", err);
        res.status(500).json({ message: "An error occurred while resetting the password." });
    }
};