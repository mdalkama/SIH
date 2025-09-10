import College from '../../models/collegeModel.js';
import University from '../../models/universityModel.js';
import Staff from '../../models/staffModel.js'; 
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- UNIVERSITY ADMIN CONTROLLERS ---

export const createCollege = async (req, res) => {
    const { collegeData, adminData, universityId } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validation: Ensure all necessary data is present
        if (!collegeData || !adminData || !universityId) {
            return res.status(400).json({ message: "College data, admin data, and university ID are required." });
        }

        const university = await University.findById(universityId).session(session);
        if (!university) {
            return res.status(404).json({ message: "University not found." });
        }
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        // 1. Create College Admin
        const newAdmin = new Staff({ ...adminData, role: 'CollegeAdmin',collegeCode: collegeData.code,password:hashedPassword, university: universityId });
        const savedAdmin = await newAdmin.save({ session });

        // 2. Create College and link the admin
        const newCollege = new College({ ...collegeData, university: universityId, admin: savedAdmin._id });
        const savedCollege = await newCollege.save({ session });

        // 3. Update the admin's record with the new college ID
        savedAdmin.college = savedCollege?._id;
        await savedAdmin.save({ session });

        // 4. Add the new college to the university's list
        university.affiliatedColleges.push(savedCollege?._id);
        await university.save({ session });

        await session.commitTransaction();
        res.status(201).json({ message: "College and admin created successfully.", college: savedCollege });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in createCollege:", error);
        res.status(500).json({ message: "Server error during college creation.", error: error.message });
    } finally {
        session.endSession();
    }
};


export const getAllColleges = async (req, res) => {
    try {
        const { search = '', status = 'all', page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }
        if (status !== 'all') {
            // Adjust for frontend values like 'Pending Approval'
            query.status = status.charAt(0).toUpperCase() + status.slice(1);
        }

        const colleges = await College.find(query)
            .populate('admin', 'name staffId')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await College.countDocuments(query);

        res.status(200).json({
            colleges,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching colleges.", error: error.message });
    }
};

export const updateCollege = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedCollege = await College.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedCollege) {
            return res.status(404).json({ message: "College not found." });
        }
        res.status(200).json({ message: "College updated successfully.", college: updatedCollege });
    } catch (error) {
        res.status(500).json({ message: "Error updating college.", error: error.message });
    }
};

export const deleteCollege = async (req, res) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const college = await College.findById(id).session(session);
        if (!college) {
            return res.status(404).json({ message: "College not found." });
        }

        // 1. Remove college from university's list
        await University.findByIdAndUpdate(college.university, {
            $pull: { affiliatedColleges: id }
        }).session(session);

        // 2. Delete the associated admin
        if (college.admin) {
            await Staff.findByIdAndDelete(college.admin).session(session);
        }

        // 3. Delete the college itself
        await College.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        res.status(200).json({ message: "College deleted successfully." });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error deleting college.", error: error.message });
    } finally {
        session.endSession();
    }
};


// --- COLLEGE ADMIN CONTROLLERS ---

export const getMyCollege = async (req, res) => {
    // Assumes middleware has added user to req, and user has a 'college' field with the ID
    const collegeId = req.user.college;
    
    try {
        const college = await College.findById(collegeId).populate('courses', 'name code');
        if (!college) {
            return res.status(404).json({ message: "Your assigned college could not be found." });
        }
        res.status(200).json(college);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your college details.", error: error.message });
    }
};

/**
 * @description Update details of the college the logged-in admin belongs to.
 * @route PUT /api/v1/college/my-details
 * @access College Admin
 */
export const updateMyCollege = async (req, res) => {
    const collegeId = req.user.college;
    const { name, location, contact, website, capacity } = req.body;

    // College Admins can only update certain fields
    const allowedUpdates = { name, location, contact, website, capacity };

    try {
        const updatedCollege = await College.findByIdAndUpdate(collegeId, allowedUpdates, { new: true });
        if (!updatedCollege) {
            return res.status(404).json({ message: "Your assigned college could not be found." });
        }
        res.status(200).json({ message: "Your college details have been updated.", college: updatedCollege });
    } catch (error) {
        res.status(500).json({ message: "Error updating your college details.", error: error.message });
    }
};


// --- PUBLIC CONTROLLERS ---


export const getPublicColleges = async (req, res) => {
    try {
        const colleges = await College.find({ status: 'Active' })
            .select('name code type location.city location.state'); // Only send necessary public info
            
        res.status(200).json(colleges);
    } catch (error) {
        res.status(500).json({ message: "Error fetching colleges.", error: error.message });
    }
};




export const getCourseByCollegeCode = async (req, res) => {
    const { collegeCode } = req.params;
    try {
        const college = await College.findOne({ code: collegeCode }).populate('courses');
        console.log(college)
    }catch(error){
        console.log(error)
    }
    }