// controllers/courseController.js
import Course from "../../models/courseModel.js";


// @desc    Create new course
// @route   POST /api/v1/courses
// @access  Admin/University Staff
export const createCourse = async (req, res) => {
    try {
        const { courseId, degree, branch, specialization, totalSemester, semesters } = req.body;

        if (!courseId || !degree || !totalSemester) {
            return res.status(400).json({ message: "courseId, degree and totalSemester are required" });
        }
        const existing = await Course.findOne({ courseId });
        if (existing) {
            return res.status(400).json({ message: "Course ID already exists" });
        }

        const course = new Course({
            courseId,
            degree,
            branch,
            specialization,
            totalSemester,
            semesters: semesters || []
        });

        await course.save();

        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Public
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("semesters.subjects") // populate subjects
            .sort({ createdAt: -1 });

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc    Get course by ID
// @route   GET /api/v1/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("semesters.subjects");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Admin/University Staff
export const updateCourse = async (req, res) => {
    try {
        const { courseId, degree, branch, specialization, totalSemester, semesters } = req.body;

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        console.log(course)

        course.courseId = courseId || course.courseId;
        course.degree = degree|| course.degree;
        course.branch = branch!=undefined ? branch : course.branch;
        course.specialization = specialization!=undefined ? specialization : course.specialization;
        course.totalSemester = totalSemester ?? course.totalSemester;
        course.semesters = semesters || course.semesters;

        await course.save();

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Admin/University Staff
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await course.deleteOne();
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
