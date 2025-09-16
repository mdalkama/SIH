import Exam from "../../models/examModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";
import Student from "../../models/studentModel.js";

/**
 * @description Get all available and relevant exams for the logged-in student.
 * @route   GET /api/v1/student-exams/my-exams
 * @access  Student
 */
export const getStudentExams = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).select(
      "courseId semester"
    );
    if (!student || !student.courseId || !student.semester) {
      return res
        .status(404)
        .json({
          message:
            "Student academic details (courseId, semester) are incomplete.",
        });
    }

    const studentCourseId = student.courseId;
    const studentSemester = student.semester;
    console.log(studentCourseId);

    // 2. Find all exams that are for the student's semester AND contain their courseId in the courses array
    const relevantExams = await Exam.find({
      semester: studentSemester,
      "courses.courseCode": studentCourseId,
      status: {
        $in: [
          "OPEN_FOR_REGISTRATION",
          "CLOSED",
          "RESULT_PROCESSING",
          "PUBLISHED",
        ],
      },
    }).sort({ startDate: 1 });

    // 3. For each found exam, filter its 'courses' array to only return the timetable relevant to the student
    const personalizedExams = relevantExams.map((exam) => {
      const studentCourseData = exam.courses.find(
        (c) => c.courseCode === studentCourseId
      );

      return {
        _id: exam._id,
        examId: exam.examId,
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
    res
      .status(500)
      .json({ message: "Server error fetching exams.", error: error.message });
  }
};

/**
 * @description Register the logged-in student for a specific exam.
 * @route   POST /api/v1/student-exams/:examId/register
 * @access  Student
 */
export const registerForExam = async (req, res) => {
    try {
        const { examId } = req.params; // This is the Exam document's _id
        const studentId = req.user.id;

        // 1. Find the student's academic record
        const studentAcademics = await StudentAcademics.findOne({ studentId });
        if (!studentAcademics) {
            return res.status(404).json({ message: "Student academic record not found." });
        }

        // 2. Find the exam to ensure it exists and is open
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }
        if (exam.status !== 'OPEN_FOR_REGISTRATION') {
            return res.status(400).json({ message: `Registration for "${exam.examName}" is currently closed.` });
        }

        // 3. Check for existing registration
        const isAlreadyRegistered = studentAcademics.currentExamRegistrations.some(
            reg => reg.examId === exam.examId
        );
        if (isAlreadyRegistered) {
            return res.status(409).json({ message: "You are already registered for this exam." });
        }

        // 4. Create the new registration record
        const newRegistration = {
            examId: exam.examId,
            examName: exam.examName,
            // --- THIS IS THE FIX ---
            // Get the semester directly from the exam document itself.
            semester: exam.semester, 
            year: exam.year,
            courseCode: studentAcademics.courseId,
            collegeCode: studentAcademics.collegeCode,
            status: 'REGISTERED'
        };

        // 5. Add the registration to the student's academic record
        studentAcademics.currentExamRegistrations.push(newRegistration);
        await studentAcademics.save();
        
        res.status(201).json({ success: true, message: `Successfully registered for ${exam.examName}.` });

    } catch (error) {
        console.error("Error registering for exam:", error);
        res.status(500).json({ message: "Server error during exam registration.", error: error.message });
    }
};

/**
 * @description Get all current exam registrations for the logged-in student.
 * @route   GET /api/v1/student-exams/my-registrations
 * @access  Student
 */
export const getMyRegistrations = async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentAcademics = await StudentAcademics.findOne({ studentId })
      .select("currentExamRegistrations")
      .lean();

    if (!studentAcademics) {
      return res.status(200).json({ success: true, registrations: [] });
    }

    res
      .status(200)
      .json({
        success: true,
        registrations: studentAcademics.currentExamRegistrations,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error fetching registrations.",
        error: error.message,
      });
  }
};

/**
 * @description Get the result for a specific exam for the logged-in student.
 * @route   GET /api/v1/student-exams/result/:examId
 * @access  Student
 */
export const getExamResult = async (req, res) => {
  try {
    const { examId } = req.params; 
    const studentId = req.user.id;

    const studentAcademics = await StudentAcademics.findOne({
      studentId: studentId,
      "previousResults.examId": examId,
    })
      .select("previousResults.$")
      .lean();

    if (
      !studentAcademics ||
      !studentAcademics.previousResults ||
      studentAcademics.previousResults.length === 0
    ) {
      const currentReg = await StudentAcademics.findOne({
        studentId: studentId,
        "currentExamRegistrations.examId": examId,
      })
        .select("currentExamRegistrations.$")
        .lean();

      if (currentReg) {
        return res
          .status(202)
          .json({
            message: "Result for this exam has not been published yet.",
          }); // Use 202 Accepted
      }
      return res
        .status(404)
        .json({ message: "No result found for this exam." });
    }

    const result = studentAcademics.previousResults[0];

    res.status(200).json({ success: true, result });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error fetching exam result.",
        error: error.message,
      });
  }
};
