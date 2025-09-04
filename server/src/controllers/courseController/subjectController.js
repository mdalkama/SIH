// controllers/subjectController.js
import Subject from "../../models/subjectModel.js";


// @desc    Create a new subject
// @route   POST /api/v1/subjects
// @access  Admin / University Staff
export const createSubject = async (req, res) => {
    try {
        const { name, code, credits, type, maxMarks } = req.body;

        if (!name || !code) {
            return res.status(400).json({ message: "Name and code are required" });
        }

        const existing = await Subject.findOne({ code });
        if (existing) {
            return res.status(400).json({ message: "Subject with this code already exists" });
        }

        const subject = new Subject({
            name,
            code,
            credits: credits || 0,
            type: type || "CORE",
            maxMarks: maxMarks || { internal: 30, external: 70, practical: 0 }
        });

        await subject.save();
        res.status(201).json({ message: "Subject created successfully", subject });
    } catch (error) {
        console.error("Error creating subject:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Get all subjects
// @route   GET /api/v1/subjects
// @access  Public
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Get single subject by ID
// @route   GET /api/v1/subjects/:id
// @access  Public
export const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Update a subject
// @route   PUT /api/v1/subjects/:id
// @access  Admin / University Staff
export const updateSubject = async (req, res) => {
    try {
        const { name, code, credits, type, maxMarks } = req.body;

        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        subject.name = name || subject.name;
        subject.code = code || subject.code;
        subject.credits = credits ?? subject.credits;
        subject.type = type || subject.type;
        subject.maxMarks = maxMarks || subject.maxMarks;

        await subject.save();
        res.status(200).json({ message: "Subject updated successfully", subject });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Delete a subject
// @route   DELETE /api/v1/subjects/:id
// @access  Admin / University Staff
export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        await subject.deleteOne();
        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
