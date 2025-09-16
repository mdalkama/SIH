import Exam from "../../models/examModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";
import Student from "../../models/studentModel.js";
import mongoose from "mongoose";

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
    const { examId } = req.params;
    const studentId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
        return res.status(400).json({ message: "Invalid Exam ID format." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // --- FIX STARTS HERE: On-the-fly creation of Academic Record ---

        // Step 1: Try to find the student's academic record.
        let studentAcademics = await StudentAcademics.findOne({ studentId }).session(session);

        // Step 2: If the academic record is NOT found, create a new one.
        if (!studentAcademics) {
            // To create an academic record, we need info from the main Student model.
            const student = await Student.findById(studentId).select("registrationNumber collegeCode courseId").session(session);
            if (!student) {
                // This is a critical error, the main student record itself is missing.
                throw new Error("Student profile not found. Cannot create academic record.");
            }
            
            // Create a new instance of the StudentAcademics model.
            studentAcademics = new StudentAcademics({
                studentId: studentId,
                registrationNumber: student.registrationNumber,
                collegeCode: student.collegeCode,
                courseId: student.courseId,
                previousResults: [],
                currentExamRegistrations: []
            });
        }
        // --- FIX ENDS HERE ---


        // Now, we proceed with the rest of the logic, confident that studentAcademics exists.
        const exam = await Exam.findById(examId).session(session);
        if (!exam) {
            throw new Error("Exam not found.");
        }
        if (exam.status !== 'OPEN_FOR_REGISTRATION') {
            throw new Error(`Registration for "${exam.examName}" is currently closed.`);
        }

        const isAlreadyRegistered = studentAcademics.currentExamRegistrations.some(
            reg => reg.examId === exam.examId
        );
        if (isAlreadyRegistered) {
            throw new Error("You are already registered for this exam.");
        }

        // Create the new registration record
        const newRegistration = {
            examId: exam.examId,
            examName: exam.examName,
            semester: exam.semester,
            year: exam.year,
            courseCode: studentAcademics.courseId,
            collegeCode: studentAcademics.collegeCode,
            status: 'REGISTERED'
        };

        // Add the registration to the student's academic record
        studentAcademics.currentExamRegistrations.push(newRegistration);
        await studentAcademics.save({ session }); // This will save the document whether it was new or existing.

        await session.commitTransaction();
        
        res.status(201).json({ success: true, message: `Successfully registered for ${exam.examName}.` });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error registering for exam:", error);
        res.status(400).json({ message: error.message || "Server error during exam registration." });
    } finally {
        session.endSession();
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
