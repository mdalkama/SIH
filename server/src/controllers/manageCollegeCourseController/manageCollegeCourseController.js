import College from "../../models/collegeModel.js";
import Staff from "../../models/staffModel.js";

export const getCoursesWithFees = async (req, res) => {
    try {
        const admin = await Staff.findById(req.user.id).select("collegeCode");
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const college = await College.findOne({ code: admin.collegeCode })
            .populate("courses.courseId", "courseId degree branch specialization totalSemester semesters");
        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }
        const courseDetails = college.courses.map(c => {
            const courseInfo = c.courseId;
            return {
                _id: courseInfo._id,
                courseId: courseInfo.courseId,
                degree: courseInfo.degree,
                branch: courseInfo.branch,
                specialization: courseInfo.specialization,
                totalSemester: courseInfo.totalSemester,
                semesters: courseInfo.semesters,
                fees: c.fees
            };
        });

        res.status(200).json({
            college: {
                name: college.name,
                code: college.code,
                courses: courseDetails
            }
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateCourseFees = async (req, res) => {
    const { collegeCode, courseId } = req.params;
    const { semester, fees } = req.body;

    try {
        const admin = await Staff.findById(req.user.id).select("collegeCode");
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        if (admin.collegeCode !== collegeCode) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const college = await College.findOne({ code: collegeCode });
        if (!college) return res.status(404).json({ message: "College not found" });

        const course = college.courses.find(c => c.courseId.toString() === courseId);
        if (!course) return res.status(404).json({ message: "Course not found in this college" });

        // update or add fees
        const feeObj = course.fees.find(f => f.semester === semester);
        if (feeObj) {
            feeObj.fees = fees;
        } else {
            course.fees.push({ semester, fees });
        }

        await college.save();

        res.status(200).json({ message: "Fees updated successfully", course });
    } catch (error) {
        console.error("Error updating course fees:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
