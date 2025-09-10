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

export const issueBookByStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { bookId, copyId } = req.body;

    if (!bookId || !copyId) {
      return res
        .status(400)
        .json({ message: "Book ID and Copy ID are required." });
    }

    const student = await Student.findById(studentId)
      .select("collegeCode")
      .lean();
    const library = await Library.findOne({ collegeCode: student.collegeCode });
    if (!library)
      return res.status(404).json({ message: "Library not found." });

    const book = library.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    const copy = book.copies.find((c) => c.copyId === copyId);
    if (!copy || copy.occupiedBy)
      return res.status(400).json({ message: "This copy is not available." });

    let studentLibrary = await StudentLibrary.findOne({
      occupiedBy: studentId,
    });
    if (!studentLibrary) {
      studentLibrary = await StudentLibrary.create({
        registrationNumber: student.registrationNumber,
        occupiedBy: studentId,
      });
    }
    if (studentLibrary.issuedBooks.length >= 5) {
      return res
        .status(400)
        .json({ message: "You have reached your borrowing limit of 5 books." });
    }

    // Library me copy ko update karo
    copy.occupiedBy = studentId;
    copy.occupiedAt = new Date();
    copy.issuedBy = studentId; // Student khud issue kar raha hai

    // StudentLibrary me book add karo
    studentLibrary.issuedBooks.push({
      bookId,
      copyId,
      issuedAt: new Date(),
      issuedBy: studentId,
    });
    studentLibrary.activity.push({
      bookName: book.title,
      copyId,
      issuedBy: studentId,
    });

    await library.save();
    await studentLibrary.save();

    res.json({
      success: true,
      message: `Book "${book.title}" issued successfully!`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student ke liye book renew karna
export const renewBookByStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { bookId, copyId } = req.body;
    const MAX_RENEWALS = 3; // Aap ise config se bhi laa sakte hain

    const studentLibrary = await StudentLibrary.findOne({
      occupiedBy: studentId,
    });
    if (!studentLibrary)
      return res.status(404).json({ message: "Library account not found." });

    const bookToRenew = studentLibrary.issuedBooks.find(
      (b) => b.bookId.equals(bookId) && b.copyId === copyId
    );
    if (!bookToRenew)
      return res
        .status(404)
        .json({ message: "This book is not issued to you." });

    if (bookToRenew.renewals >= MAX_RENEWALS) {
      return res
        .status(400)
        .json({ message: "Maximum renewal limit reached for this book." });
    }

    // Due date check (optional)
    const dueDate = new Date(
      new Date(bookToRenew.issuedAt).setDate(
        new Date(bookToRenew.issuedAt).getDate() +
          15 * (bookToRenew.renewals + 1)
      )
    );
    if (new Date() > dueDate) {
      return res.status(400).json({ message: "Cannot renew an overdue book." });
    }

    bookToRenew.renewals += 1;

    const mainLibrary = await Library.findOne({ "books._id": bookId }).lean();
    const bookDetails = mainLibrary.books.find((b) => b._id.equals(bookId));

    studentLibrary.activity.push({
      bookName: `${bookDetails.title} (Renewed)`,
      copyId: bookToRenew.copyId,
      issuedBy: studentId,
    });

    await studentLibrary.save();
    res.json({ success: true, message: "Book renewed successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
