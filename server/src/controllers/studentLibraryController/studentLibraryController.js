import Library from "../../models/libraryModal.js";
import StudentLibrary from "../../models/studentLibraryModel.js";
import Student from "../../models/studentModel.js";
export const getMyLibraryProfile = async (req, res) => {
  try {
    // req.user.id aapke authentication middleware se aayega
    const studentId = req.user?.id;
    if (!studentId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Student not logged in" });
    }

    // Student ka collegeCode nikaalo taaki sahi library me search ho sake
    const student = await Student.findById(studentId)
      .select("collegeCode")
      .lean();
    if (!student || !student.collegeCode) {
      return res
        .status(404)
        .json({ message: "Student or college code not found." });
    }

    // Student ka library account dhoondho
    const studentLibrary = await StudentLibrary.findOne({
      occupiedBy: studentId,
    })
      .populate(
        "occupiedBy",
        "name email course registrationNumber createdAt collegeCode"
      )
      .populate("issuedBooks.issuedBy", "name")
      .populate("activity.issuedBy", "name")
      .lean();

    if (!studentLibrary) {
      const studentProfile = await Student.findById(studentId)
        .select("name email course registrationNumber createdAt collegeCode")
        .lean();
      return res.json({
        success: true,
        data: {
          profile: studentProfile,
          issuedBooks: [],
          activity: [],
        },
      });
    }

    // College ki poori library fetch karo taaki book titles mil sakein
    const mainLibrary = await Library.findOne({
      collegeCode: student.collegeCode,
    }).lean();
    if (!mainLibrary) {
      // Agar library hi nahi hai, to bhi student ka data bhejo
      return res.json({
        success: true,
        data: {
          profile: studentLibrary.occupiedBy,
          issuedBooks: [], // Books ki jaankari nahi mil sakti
          activity: studentLibrary.activity,
        },
      });
    }

    // Issued books ko book details (title, author) ke saath "enrich" karo
    const enrichedIssuedBooks = (studentLibrary.issuedBooks || []).map(
      (book) => {
        const bookDetails = mainLibrary.books.find((b) =>
          b._id.equals(book.bookId)
        );
        return {
          ...book,
          title: bookDetails?.title || "Unknown Book",
          author: bookDetails?.author || "N/A",
        };
      }
    );

    const sortedActivity = (studentLibrary.activity || []).sort(
      (a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)
    );

    // Final, complete data bhejo
    return res.json({
      success: true,
      data: {
        profile: studentLibrary.occupiedBy,
        issuedBooks: enrichedIssuedBooks,
        activity: sortedActivity,
      },
    });
  } catch (err) {
    console.error("Error in getMyLibraryProfile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBooksForStudent = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    // Student ke document se collegeCode nikaalo
    const student = await Student.findById(studentId)
      .select("collegeCode")
      .lean();
    if (!student || !student.collegeCode) {
      return res
        .status(404)
        .json({ message: "College code for your profile not found." });
    }

    const library = await Library.findOne({
      collegeCode: student.collegeCode,
    }).lean();
    if (!library) {
      return res
        .status(404)
        .json({ message: "Library not found for your college." });
    }

    res.json({ success: true, books: library.books || [] });
  } catch (err) {
    console.error("Error in getBooksForStudent:", err);
    res.status(500).json({ message: "Server error" });
  }
};
