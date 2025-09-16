import Exam from "../../models/examModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";
import Student from "../../models/studentModel.js";

export const getStudentExams = async (req, res) => {
    try {
        const studentId = req.user.id;
        const student = await Student.findById(studentId).select("courseId semester");

        if (!student || !student.courseId || !student.semester) {
            return res.status(404).json({ message: "Student academic details are incomplete." });
        }

        const { courseId: studentCourseId, semester: studentSemester } = student;

        const relevantExams = await Exam.find({
            semester: studentSemester,
            "courses.courseCode": studentCourseId,
            status: { $in: ["OPEN_FOR_REGISTRATION", "CLOSED", "RESULT_PROCESSING", "PUBLISHED"] },
        }).sort({ startDate: -1 });

        const personalizedExams = relevantExams.map((exam) => {
            const studentCourseData = exam.courses.find(c => c.courseCode === studentCourseId);
            return {
                _id: exam._id,
                examId: exam.examId, // Important for the result API call
                examName: exam.examName,
                examType: exam.examType,
                semester: exam.semester,
                year: exam.year,
                startDate: exam.startDate,
                endDate: exam.endDate,
                status: exam.status,
                timetable: studentCourseData ? studentCourseData.timetable : [],
            };
        });

        res.status(200).json({ success: true, exams: personalizedExams });
    } catch (error) {
        console.error("Error fetching student exams:", error);
        res.status(500).json({ message: "Server error fetching exams.", error: error.message });
    }
};


export const registerForExam = async (req, res) => {
    try {
        const { examId } = req.params; // This is the Exam document's _id
        const studentId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: "Invalid Exam ID format." });
        }

        const studentAcademics = await StudentAcademics.findOne({ studentId });
        if (!studentAcademics) {
            return res.status(404).json({ message: "Student academic record not found." });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        if (exam.status !== 'OPEN_FOR_REGISTRATION') {
            return res.status(400).json({ message: `Registration for "${exam.examName}" is currently closed.` });
        }

        const isAlreadyRegistered = studentAcademics.currentExamRegistrations.some(reg => reg.examId === exam.examId);
        if (isAlreadyRegistered) {
            return res.status(409).json({ message: "You are already registered for this exam." });
        }

        const newRegistration = {
            examId: exam.examId,
            examName: exam.examName,
            semester: exam.semester,
            year: exam.year,
            courseCode: studentAcademics.courseId,
            collegeCode: studentAcademics.collegeCode,
            status: 'REGISTERED'
        };

        studentAcademics.currentExamRegistrations.push(newRegistration);
        await studentAcademics.save();
        
        res.status(201).json({ success: true, message: `Successfully registered for ${exam.examName}.` });
    } catch (error) {
        console.error("Error registering for exam:", error);
        res.status(500).json({ message: "Server error during exam registration.", error: error.message });
    }
};


export const getMyRegistrations = async (req, res) => {
    try {
        const studentId = req.user.id;
        const studentAcademics = await StudentAcademics.findOne({ studentId })
            .select("currentExamRegistrations")
            .lean();

        if (!studentAcademics) {
            return res.status(200).json({ success: true, registrations: [] });
        }

        res.status(200).json({ success: true, registrations: studentAcademics.currentExamRegistrations });
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ message: "Server error fetching registrations.", error: error.message });
    }
};


export const getExamResult = async (req, res) => {
    try {
        const { examId } = req.params; // This is the unique examId STRING, e.g., "ENDSEM2024-SEM4"
        const studentId = req.user.id; // This comes from the 'protect' middleware

        // Find the student's academic document that contains the specific exam result
        const studentAcademics = await StudentAcademics.findOne(
            {
                studentId: studentId, // Match the logged-in student
                "previousResults.examId": examId // Match the specific exam inside the array
            },
            {
                "previousResults.$": 1 // Project ONLY the first matching element from the array
            }
        ).lean();

        // SCENARIO 1: Result is found and published
        if (studentAcademics && studentAcademics.previousResults && studentAcademics.previousResults.length > 0) {
            const result = studentAcademics.previousResults[0];
            return res.status(200).json({ success: true, result });
        }

        // SCENARIO 2: Result is NOT found in 'previousResults'. Check if it's still being processed.
        const currentRegistration = await StudentAcademics.findOne({
            studentId: studentId,
            "currentExamRegistrations.examId": examId
        });

        if (currentRegistration) {
            // The student is registered, but the result isn't published yet.
            return res.status(202).json({
                message: "Result for this exam has not been published yet."
            });
        }
        
        // SCENARIO 3: No record found anywhere. The student never registered or the examId is wrong.
        return res.status(404).json({ message: "No result found for this exam. Please check the Exam ID or your registration status." });

    } catch (error) {
        console.error("Server error fetching exam result:", error);
        res.status(500).json({
            message: "Server error fetching exam result.",
            error: error.message
        });
    }
};