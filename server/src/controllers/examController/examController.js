import Exam from "../../models/examModel.js";
import mongoose from "mongoose";
import Student from "../../models/studentModel.js";
import StudentAcademics from "../../models/studentAcademicsModel.js";

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


export const createExam = async (req, res) => {
  try {
    // createdBy should be added from authenticated user's ID
    const examData = { ...req.body, createdBy: req.user.id };

    const newExam = new Exam(examData);
    await newExam.save();

    res
      .status(201)
      .json({ message: "Exam created successfully.", exam: newExam });
  } catch (error) {
    console.error("Error creating exam:", error);
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
    const { examId } = req.params; // This is the Exam document _id

    const exam = await Exam.findById(examId).lean();
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Find all student academic records that have a registration for this exam's unique ID
    const registeredStudents = await StudentAcademics.find({
      "currentExamRegistrations.examId": exam.examId,
    })
      .populate("studentId", "name registrationNumber") // Populate student's name and reg no
      .select("studentId registrationNumber currentExamRegistrations courseId")
      .lean();

    if (!registeredStudents) {
      return res.status(200).json({ success: true, students: [] });
    }

    const resultEntryList = registeredStudents.map((student) => {
      // Now, student.courseId will have the correct value (e.g., "105")
      const courseInExam = exam.courses.find(
        (c) => c.courseCode === student.courseId
      );

      // If a matching course is found in the exam doc, use its timetable. Otherwise, empty array.
      const subjects = courseInExam ? courseInExam.timetable : [];

      return {
        studentAcademicId: student._id,
        studentId: student.studentId._id,
        name: student.studentId.name,
        registrationNumber: student.registrationNumber,
        // The subjects array will now be correctly populated
        subjects: subjects.map((sub) => ({
          subjectCode: sub.subjectCode,
          subjectName: sub.subjectName,
          internal: 0, // Default values for entry form
          external: 0,
          practical: 0,
        })),
        sgpa: 0,
        overallResult: "PASS",
      };
    });

    res.status(200).json({
      success: true,
      examDetails: { examName: exam.examName, examId: exam.examId },
      students: resultEntryList,
    });
  } catch (error) {
    console.error("Error fetching students for result entry:", error);
    res
      .status(500)
      .json({
        message: "Server error while fetching data for result entry.",
        error: error.message,
      });
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
