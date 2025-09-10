import University from '../../models/universityModel.js';


export const getUniversityProfile = async (req, res) => {
    try {
        const university = await University.findOne();
        if (!university) {
            return res.status(404).json({ message: "University profile not found. Please create one." });
        }
        res.status(200).json(university);
    } catch (error) {
        res.status(500).json({ message: "Error fetching university profile", error: error.message });
    }
};

export const createUniversityProfile = async (req, res) => {
    try {
        const existingUniversity = await University.findOne();
        if (existingUniversity) {
            return res.status(409).json({ message: "A university profile already exists. You can update it instead." });
        }

        const { name, universityId, contact } = req.body;
        if (!name || !universityId || !contact?.email || !contact?.phone) {
            return res.status(400).json({ message: "Required fields are missing: name, universityId, email, phone." });
        }

        const newUniversity = await University.create(req.body);
        res.status(201).json({ message: "University profile created successfully.", university: newUniversity });
    } catch (error) {
        res.status(500).json({ message: "Error creating university profile", error: error.message });
    }
};

export const updateUniversityProfile = async (req, res) => {
    try {
        const updateData = req.body;
        const university = await University.findOne();

        if (!university) {
            return res.status(404).json({ message: "University profile not found. Please create one first." });
        }

        const updatedUniversity = await University.findByIdAndUpdate(
            university._id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUniversity) {
            return res.status(500).json({ message: "Something went wrong while updating the profile." });
        }

        res.status(200).json({ message: "University profile updated successfully.", university: updatedUniversity });
    } catch (error) {
        res.status(500).json({ message: "Error updating university profile", error: error.message });
    }
};
