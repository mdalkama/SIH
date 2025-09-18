import Exam from "../../models/examModel.js";
import mongoose from "mongoose";
import Student from "../../models/studentModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";
import Subject from "../../models/subjectModel.js";

// Yeh function marks ke basis par Grade aur Grade Point nikalega.
// Aap isko apni university ke rules ke hisaab se badal sakte hain.
const getGradeDetails = (totalMarks, maxMarks = 100) => {
    const percentage = (totalMarks / maxMarks) * 100;

    if (percentage < 40) return { grade: 'F', gradePoint: 0, status: 'FAIL' };
    if (percentage >= 90) return { grade: 'O', gradePoint: 10, status: 'PASS' };
    if (percentage >= 80) return { grade: 'A+', gradePoint: 9, status: 'PASS' };
    if (percentage >= 70) return { grade: 'A', gradePoint: 8, status: 'PASS' };
    if (percentage >= 60) return { grade: 'B+', gradePoint: 7, status: 'PASS' };
    if (percentage >= 50) return { grade: 'B', gradePoint: 6, status: 'PASS' };
    if (percentage >= 40) return { grade: 'C', gradePoint: 5, status: 'PASS' };
    return { grade: 'F', gradePoint: 0, status: 'FAIL' }; // Fallback
};

// Yeh main function hai jo poora result calculate karega.
export const calculateResults = async (subjectsWithMarks) => { // Now it's an async function
    let totalCredits = 0;
    let weightedGradePoints = 0;
    let finalOverallResult = 'PASS';

    // Get all unique subject codes from the result entry
    const subjectCodes = subjectsWithMarks.map(sub => sub.subjectCode);
    
    // Fetch all subject details from the database in a single query
    const subjectDetails = await Subject.find({ code: { $in: subjectCodes } }).lean();

    const subjectsWithGrades = subjectsWithMarks.map(sub => {
        // Find the details for the current subject
        const details = subjectDetails.find(s => s.code === sub.subjectCode);
        if (!details) {
            throw new Error(`Details not found for subject ${sub.subjectCode} in the Subjects collection.`);
        }

        const credits = details.credits;
        // Calculate max marks from the Subject model
        const maxMarks = (details.maxMarks.internal || 0) + (details.maxMarks.external || 0) + (details.maxMarks.practical || 0);
        
        const totalMarks = (sub.internal || 0) + (sub.external || 0) + (sub.practical || 0);
        
        const { grade, gradePoint, status } = getGradeDetails(totalMarks, maxMarks);

        if (status === 'FAIL') {
            finalOverallResult = 'FAIL';
        }
        
        totalCredits += credits;
        weightedGradePoints += credits * gradePoint;

        return {
            ...sub,
            total: totalMarks,
            grade,
            status,
        };
    });

    const sgpa = totalCredits > 0 ? (weightedGradePoints / totalCredits) : 0;

    return {
        subjects: subjectsWithGrades,
        sgpa: parseFloat(sgpa.toFixed(2)),
        overallResult: finalOverallResult
    };
};

export const getDashboardStats = async (req, res) => {
    try {
        // Get the start of the current month
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Perform multiple count operations in parallel for efficiency
        const [
            openForRegistration,
            resultsPendingApproval,
            publishedThisMonth,
            totalStudents
        ] = await Promise.all([
            Exam.countDocuments({ status: 'OPEN_FOR_REGISTRATION' }),
            Exam.countDocuments({ status: 'RESULT_PROCESSING' }),
            Exam.countDocuments({ 
                status: 'PUBLISHED',
                updatedAt: { $gte: startOfMonth } // Checks for exams published in the current month
            }),
            Student.countDocuments() // Assuming you want a count of all students
        ]);

        res.status(200).json({
            success: true,
            stats: {
                openForRegistration,
                resultsPendingApproval,
                publishedThisMonth,
                totalStudents
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Server error fetching dashboard stats.", error: error.message });
    }
};

export const getExamCellDashboardStats = async (req, res) => {
    try {
        const readyForEntry = await Exam.countDocuments({ status: 'CLOSED' });

        const stats = {
            readyForEntry,
            processedThisWeek: 2,     // Mocked
            admitCardsPublished: 12,    // Mocked
            evaluatorsAssigned: 45      // Mocked
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        console.error("Error fetching Exam Cell dashboard stats:", error);
        res.status(500).json({ message: "Server error fetching dashboard stats.", error: error.message });
    }
};

export const createExam = async (req, res) => {
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication error: User not found." });
  }

  try {
    const examData = { ...req.body, createdBy: req.user.id };
    const newExam = new Exam(examData);
    await newExam.save();

    res.status(201).json({ message: "Exam created successfully.", exam: newExam });

  } catch (error) {
    console.error("Error creating exam:", error);

    // Handle Duplicate Key Error (for unique examId)
    if (error.code === 11000) {
      return res.status(409).json({
        message: `An exam with Exam ID '${error.keyValue.examId}' already exists. Please use a unique ID.`,
      });
    }

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: "Validation failed. Please check your input.",
        errors: messages
      });
    }

    // Generic Fallback
    res.status(500).json({
      message: "Server error during exam creation.",
      error: error.message,
    });
  }
};

export const getAllExams = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      examType = "all",
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};
    if (search) {
      query.examName = { $regex: search, $options: "i" };
    }
    if (status !== "all") {
      query.status = status;
    }
    if (examType !== "all") {
      query.examType = examType;
    }

    const exams = await Exam.find(query)
      .populate("createdBy", "name staffId")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ year: -1, createdAt: -1 });

    const count = await Exam.countDocuments(query);

    res.status(200).json({
      exams,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalDocs: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exams.", error: error.message });
  }
};

export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate("createdBy", "name email");
    console.log(exam);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    res.status(200).json(exam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exam details.", error: error.message });
  }
};

export const updateExam = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedExam = await Exam.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    res
      .status(200)
      .json({ message: "Exam updated successfully.", exam: updatedExam });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating exam.", error: error.message });
  }
};

export const deleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExam = await Exam.findByIdAndDelete(id);

    if (!deletedExam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Add cleanup logic here if needed (e.g., delete related registrations)

    res.status(200).json({ message: "Exam deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting exam.", error: error.message });
  }
};

export const getExamResultsForEntry = async (req, res) => {
    try {
        const { examId } = req.params;

        const exam = await Exam.findById(examId).lean();
        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        const registeredStudents = await StudentAcademics.find({
            'currentExamRegistrations.examId': exam.examId
        })
        .populate('studentId', 'name registrationNumber')
        .select('studentId registrationNumber courseId')
        .lean();

        if (!registeredStudents || registeredStudents.length === 0) {
            return res.status(200).json({ success: true, examDetails: exam, students: [] });
        }
        
        // --- THIS IS THE NEW LOGIC ---
        // 1. Get all unique subject codes from the exam's timetables
        const allSubjectCodes = new Set();
        exam.courses.forEach(course => {
            course.timetable.forEach(slot => {
                allSubjectCodes.add(slot.subjectCode);
            });
        });
        
        // 2. Fetch all subject details (including credits) in one go
        const subjectDetails = await Subject.find({ code: { $in: [...allSubjectCodes] } }).lean();
        const subjectDetailsMap = new Map(subjectDetails.map(sub => [sub.code, sub]));
        // -----------------------------

        const resultEntryList = registeredStudents.map(student => {
            const courseInExam = exam.courses.find(c => c.courseCode === student.courseId);
            const subjectsForStudent = courseInExam ? courseInExam.timetable : [];

            return {
                studentAcademicId: student._id,
                name: student.studentId.name,
                registrationNumber: student.registrationNumber,
                subjects: subjectsForStudent.map(sub => ({
                    subjectCode: sub.subjectCode,
                    subjectName: sub.subjectName,
                    credits: subjectDetailsMap.get(sub.subjectCode)?.credits || 0, // <-- CREDITS ADDED HERE
                })),
            };
        });

        res.status(200).json({ success: true, examDetails: exam, students: resultEntryList });

    } catch (error) {
        console.error("Error fetching students for result entry:", error);
        res.status(500).json({ message: "Server error while fetching data.", error: error.message });
    }
};

export const addOrUpdateResults = async (req, res) => {
    const { examId } = req.params;
    const { results } = req.body;

    if (!results || !Array.isArray(results) || results.length === 0) {
        return res.status(400).json({ message: "Results data must be a non-empty array." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const exam = await Exam.findById(examId).session(session);
        if (!exam) { throw new Error("Exam not found."); }

        for (const studentResult of results) {
            const { studentAcademicId, subjects: studentMarks } = studentResult;
            
            const studentAcademics = await StudentAcademics.findById(studentAcademicId).session(session);
            if (!studentAcademics) { continue; }

            // --- SGPA CALCULATION (now async) ---
            const { subjects, sgpa, overallResult } = await calculateResults(studentMarks);
            // ------------------------------------

            const newResultRecord = {
                examId: exam.examId,
                examName: exam.examName,
                collegeCode: studentAcademics.collegeCode,
                courseCode: studentAcademics.courseId,
                year: exam.year,
                semester: exam.semester,
                subjects,
                sgpa,
                overallResult,
                publishedOn: new Date()
            };

            studentAcademics.currentExamRegistrations = studentAcademics.currentExamRegistrations.filter(
                reg => reg.examId !== exam.examId
            );
            studentAcademics.previousResults.push(newResultRecord);
            await studentAcademics.save({ session });
        }

        exam.status = 'RESULT_PROCESSING';
        await exam.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "Results calculated and submitted for approval." });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error adding/updating results:", error);
        res.status(500).json({ message: "Server error while processing results.", error: error.message });
    }
};

export const getExamsForApproval = async (req, res) => {
  try {
    // Find all exams that have had their results processed but not yet published
    const exams = await Exam.find({ status: "RESULT_PROCESSING" })
      .select("examName examId semester year") // Select only the necessary fields for the list
      .sort({ year: -1, createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, exams });
  } catch (error) {
    console.error("Error fetching exams for approval:", error);
    res.status(500).json({
      message: "Server error while fetching exams for approval.",
      error: error.message,
    });
  }
};

export const getExamResults = async (req, res) => {
  try {
    const { examId } = req.params; // Yeh Exam document ka _id hai

    const exam = await Exam.findById(examId).lean();
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Un sabhi students ko dhundo jinke paas is exam ka result hai
    const results = await StudentAcademics.find({
      "previousResults.examId": exam.examId,
    })
      .populate("studentId", "name registrationNumber")
      .select("studentId registrationNumber previousResults.$") // Sirf relevant result laayega
      .lean();

    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        examDetails: exam,
        results: [],
      });
    }

    // Frontend ke liye results ko format karo
    const formattedResults = results.map((student) => ({
      studentAcademicId: student._id,
      studentName: student.studentId.name,
      registrationNumber: student.registrationNumber,
      ...student.previousResults[0], // Specific exam ka result object
    }));

    res
      .status(200)
      .json({ success: true, examDetails: exam, results: formattedResults });
  } catch (error) {
    console.error("Error fetching exam results:", error);
    res
      .status(500)
      .json({
        message: "Server error while fetching exam results.",
        error: error.message,
      });
  }
};

export const publishResults = async (req, res) => {
  try {
    const { examId } = req.params; // This is the Exam document _id

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Check if the results are in the correct state to be published
    if (exam.status !== "RESULT_PROCESSING") {
      return res.status(400).json({
        message: `Cannot publish results. Exam status is currently "${exam.status}", not "Result Processing".`,
      });
    }

    // Update the status to PUBLISHED
    exam.status = "PUBLISHED";
    await exam.save();

    res.status(200).json({
      success: true,
      message: `Results for "${exam.examName}" have been successfully published.`,
    });
  } catch (error) {
    console.error("Error publishing results:", error);
    res.status(500).json({
      message: "Server error while publishing results.",
      error: error.message,
    });
  }
};

export const updateStudentMarks = async (req, res) => {
  const { examId, studentAcademicId } = req.params; // examId is Exam _id, studentAcademicId is StudentAcademics _id
  const { subjects, sgpa, overallResult } = req.body; // Expects subjects array, sgpa, and overallResult

  if (!subjects || !Array.isArray(subjects)) {
    return res.status(400).json({ message: "Subjects data must be an array." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const exam = await Exam.findById(examId).session(session);
    if (!exam) {
      throw new Error("Exam not found.");
    }

    const studentAcademics = await StudentAcademics.findById(
      studentAcademicId
    ).session(session);
    if (!studentAcademics) {
      throw new Error("Student academic record not found.");
    }

    // Prepare the new/updated result record
    const updatedResultRecord = {
      examId: exam.examId,
      examName: exam.examName,
      collegeCode: studentAcademics.collegeCode,
      courseCode: studentAcademics.courseId,
      year: exam.year,
      semester: exam.semester,
      subjects: subjects.map((sub) => ({
        ...sub,
        total: (sub.internal || 0) + (sub.external || 0) + (sub.practical || 0),
        grade: "TBD", // Placeholder for grade calculation logic
        status:
          (sub.internal || 0) + (sub.external || 0) + (sub.practical || 0) >= 40
            ? "PASS"
            : "FAIL", // Placeholder
      })),
      sgpa: sgpa || 0,
      overallResult: overallResult || "PASS",
      publishedOn: new Date(),
    };

    // Find if a result for this exam already exists
    const existingResultIndex = studentAcademics.previousResults.findIndex(
      (result) => result.examId === exam.examId
    );

    if (existingResultIndex > -1) {
      // If it exists, update it
      studentAcademics.previousResults[existingResultIndex] =
        updatedResultRecord;
    } else {
      // If it doesn't exist, add it to the history
      studentAcademics.previousResults.push(updatedResultRecord);

      // Also ensure the student is no longer in "current registrations" for this exam
      studentAcademics.currentExamRegistrations =
        studentAcademics.currentExamRegistrations.filter(
          (reg) => reg.examId !== exam.examId
        );
    }

    await studentAcademics.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Marks for student ${studentAcademics.registrationNumber} in ${exam.examName} have been updated successfully.`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating student marks:", error);
    res.status(500).json({
      message: "Server error while updating student marks.",
      error: error.message,
    });
  }
};
