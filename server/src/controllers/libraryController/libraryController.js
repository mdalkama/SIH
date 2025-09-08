import Library from "../../models/libraryModal.js";
import StudentLibrary from "../../models/studentLibraryModel.js";
import mongoose from "mongoose";
import Staff from "../../models/staffModel.js";
import Student from "../../models/studentModel.js";

// ---------- BOOK OPERATIONS ----------

// Add a new book
export const addBook = async (req, res) => {
  try {
    const librarianId = req.user.id;
    const collegeCode = await Staff.findById(librarianId).select("collegeCode");
    if (!collegeCode)
      return res.status(404).json({ message: "college Code not found" });

    const { title, author, isbn, category, totalCopies } = req.body;
    if (!title || !totalCopies) {
      return res
        .status(400)
        .json({ message: "title and totalCopies are required" });
    }

    let library = await Library.findOne({
      collegeCode: collegeCode.collegeCode,
    });
    if (!library)
      library = new Library({
        collegeCode: collegeCode.collegeCode,
        books: [],
      });

    if (isbn && library.books.some((b) => b.isbn === isbn)) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    const copies = Array.from({ length: totalCopies }, (_, i) => ({
      copyId: `C${i + 1}`,
    }));
    library.books.push({ title, author, isbn, category, totalCopies, copies });

    await library.save();
    res.status(201).json({ success: true, data: library });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const librarianId = req.user.id;
    const staff = await Staff.findById(librarianId).select("collegeCode");
    if (!staff?.collegeCode) {
      return res.status(404).json({ message: "college Code not found" });
    }

    const { bookId } = req.params;
    const library = await Library.findOne({ collegeCode: staff.collegeCode });
    if (!library) return res.status(404).json({ message: "Library not found" });

    const book = library.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    library.books.pull(book._id);
    await library.save();

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- COPY OPERATIONS ----------

// Add more copies to an existing book
export const addCopies = async (req, res) => {
  try {
    const librarianId = req.user.id;
    const collegeCode = await Staff.findById(librarianId).select("collegeCode");
    if (!collegeCode)
      return res.status(404).json({ message: "college Code not found" });
    const { bookId, newCopies } = req.body;
    if (!bookId || !newCopies) {
      return res
        .status(400)
        .json({ message: "bookId and newCopies are required" });
    }

    const library = await Library.findOne({
      collegeCode: collegeCode.collegeCode,
    });
    if (!library) return res.status(404).json({ message: "Library not found" });

    const book = library.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const currentCount = book.copies.length;
    const copies = Array.from({ length: newCopies }, (_, i) => ({
      copyId: `C${currentCount + i + 1}`,
    }));
    book.copies.push(...copies);
    book.totalCopies += newCopies;

    await library.save();
    res.json({ success: true, book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete specific copies
export const deleteCopies = async (req, res) => {
  try {
    const librarianId = req.user.id;
    const collegeCode = await Staff.findById(librarianId).select("collegeCode");
    if (!collegeCode)
      return res.status(404).json({ message: "college Code not found" });
    const { bookId, copyIds } = req.body; // copyIds = ["C1", "C2"]
    if (!bookId || !copyIds || !copyIds.length) {
      return res
        .status(400)
        .json({ message: "bookId and copyIds are required" });
    }

    const library = await Library.findOne({
      collegeCode: collegeCode.collegeCode,
    });
    if (!library) return res.status(404).json({ message: "Library not found" });

    const book = library.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.copies = book.copies.filter((c) => !copyIds.includes(c.copyId));
    book.totalCopies = book.copies.length;

    await library.save();
    res.json({ success: true, book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- ISSUE / RETURN ----------

// Issue a copy to a student
export const issueCopy = async (req, res) => {
  try {
    const librarianId = req.user?.id;
    if (!librarianId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const staff = await Staff.findById(librarianId).select("collegeCode");
    if (!staff?.collegeCode) {
      return res.status(404).json({ message: "college Code not found" });
    }

    const { bookId, copyId, studentId } = req.body;
    if (!bookId || !copyId || !studentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ----- Update Library -----
    const library = await Library.findOne({ collegeCode: staff.collegeCode });
    if (!library) return res.status(404).json({ message: "Library not found" });

    const book = library.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const copy = book.copies.find((c) => c.copyId === copyId);
    if (!copy) return res.status(404).json({ message: "Copy not found" });
    if (copy.occupiedBy) return res.status(400).json({ message: "Copy is already issued" });

    // Assign plain strings; Mongoose will cast to ObjectId on save
    copy.occupiedBy = studentId;
    copy.occupiedAt = new Date();
    copy.issuedBy = librarianId;
    await library.save();

    // ----- Ensure StudentLibrary exists (with registrationNumber) -----
    let studentLibrary = await StudentLibrary.findOne({ occupiedBy: studentId });

    if (!studentLibrary) {
      const studentDoc = await Student.findById(studentId).select("registrationNumber");
      if (!studentDoc?.registrationNumber) {
        return res.status(400).json({ message: "Student registrationNumber not found" });
      }
      studentLibrary = await StudentLibrary.create({
        registrationNumber: studentDoc.registrationNumber.trim().toUpperCase(),
        occupiedBy: studentId,
        issuedBooks: [],
        activity: [],
      });
    }

    // Optional: enforce capacity before pushing (schema also validates)
    if (studentLibrary.issuedBooks.length >= 5) {
      return res.status(400).json({ message: "A student can only issue up to 5 books" });
    }

    // Update StudentLibrary
    studentLibrary.issuedBooks.push({
      bookId,               // subdocument _id (embedded book), OK as per your schema
      copyId,
      issuedAt: new Date(),
      issuedBy: librarianId
    });

    studentLibrary.activity.push({
      bookName: book.title,
      copyId,
      issuedBy: librarianId,
      issuedAt: new Date()
    });

    await studentLibrary.save();

    return res.json({ success: true, copy, studentLibrary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Return a copy
export const returnCopy = async (req, res) => {
  try {
    const { collegeCode, bookId, copyId, studentId } = req.body;
    if (!collegeCode || !bookId || !copyId || !studentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ----- Update Library -----
    const library = await Library.findOne({ collegeCode });
    if (!library) return res.status(404).json({ message: "Library not found" });

    const book = library.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const copy = book.copies.find((c) => c.copyId === copyId);
    if (!copy) return res.status(404).json({ message: "Copy not found" });
    if (!copy.occupiedBy)
      return res.status(400).json({ message: "Copy is not issued" });

    copy.occupiedBy = null;
    copy.occupiedAt = null;
    copy.issuedBy = null;
    await library.save();

    // ----- Update StudentLibrary -----
    const studentLibrary = await StudentLibrary.findOne({
      occupiedBy: studentId,
    });
    if (!studentLibrary)
      return res
        .status(404)
        .json({ message: "Student library account not found" });

    // Remove from issuedBooks
    studentLibrary.issuedBooks = studentLibrary.issuedBooks.filter(
      (b) => !(b.bookId.toString() === bookId && b.copyId === copyId)
    );

    // Update activity log
    const activity = studentLibrary.activity.find(
      (a) => a.copyId === copyId && !a.returnedAt
    );
    if (activity) {
      activity.returnedAt = new Date();

      // Optional: fine calculation
      const dueDate = new Date(activity.issuedAt);
      dueDate.setDate(dueDate.getDate() + 14); // 14-day borrow limit
      if (new Date() > dueDate) {
        const lateDays = Math.floor(
          (new Date() - dueDate) / (1000 * 60 * 60 * 24)
        );
        activity.fine = lateDays * 10; // ₹10 per late day
      }
    }

    await studentLibrary.save();

    res.json({ success: true, copy, studentLibrary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- GET ROUTES ----------

// Get all books for a college
export const getBooks = async (req, res) => {
  try {
    const { collegeCode } = req.params;
    const library = await Library.findOne({ collegeCode });
    if (!library) return res.status(404).json({ message: "Library not found" });

    res.json({ success: true, books: library.books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all books issued to a student
export const getStudentBooks = async (req, res) => {
  try {
    const librarianId = req.user?.id;
    if (!librarianId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. req.body se registrationNumber lo
    const regRaw = req.body?.registrationNumber || "";
    const registrationNumber = regRaw.trim().toUpperCase();
    if (!registrationNumber) {
      return res.status(400).json({ message: "Registration number required" });
    }

    // 2. Librarian ka collegeCode nikaalo
    const staff = await Staff.findById(librarianId).select("collegeCode");
    if (!staff?.collegeCode) {
      return res.status(404).json({ message: "Librarian's college code not found" });
    }

    // 3. College ki library load karo
    const libraryDoc = await Library.findOne({ collegeCode: staff.collegeCode });
    if (!libraryDoc) {
      return res.status(404).json({ message: "Library not found" });
    }

    // 4. StudentLibrary find karo (ya create karo)
    let sl = await StudentLibrary.findOne({ registrationNumber })
      .populate("occupiedBy", "name email course branch year registrationNumber")
      .populate("issuedBooks.issuedBy", "name")
      .lean();

    if (!sl) {
      const student = await Student.findOne({ registrationNumber }).lean();
      if (!student) {
        return res.status(404).json({ message: "No library account found for this student" });
      }
      const created = await StudentLibrary.create({
        registrationNumber: student.registrationNumber.trim().toUpperCase(),
        occupiedBy: student._id,
      });
      sl = await StudentLibrary.findById(created._id)
        .populate("occupiedBy", "name email course branch year registrationNumber")
        .populate("issuedBooks.issuedBy", "name")
        .lean();
    }

    // 5. issuedBooks ko enrich karo (title/author add karo)
    const enrichedIssuedBooks = (sl.issuedBooks || []).map(ib => {
      const bookDetails = libraryDoc.books.id(ib.bookId);
      return {
        bookId: ib.bookId,
        copyId: ib.copyId,
        issuedAt: ib.issuedAt,
        issuedBy: ib.issuedBy,
        title: bookDetails?.title || "Unknown Book",
        author: bookDetails?.author || "N/A",
        isbn: bookDetails?.isbn || "N/A",
      };
    });

    // 6. Final response
    return res.json({
      success: true,
      student: sl.occupiedBy ? {
        _id: sl.occupiedBy._id,
        regNo: sl.registrationNumber,
        name: sl.occupiedBy.name,
        email: sl.occupiedBy.email,
        course: sl.occupiedBy.course,
      } : null,
      issuedBooks: enrichedIssuedBooks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getStudentByRegNo = async (req, res) => {
  try {
    const regNoRaw = req.params.regNo || "";
    const regNo = regNoRaw.trim().toUpperCase();

    if (!regNo) {
      return res.status(400).json({ message: "Registration number is required" });
    }

    // 1. Student collection me dhoondo
    const student = await Student.findOne({ registrationNumber: regNo })
      .select("_id name email course registrationNumber")
      .lean();

    // Agar student hi nahi hai, toh aage nahi badhna
    if (!student) {
      return res.status(404).json({ message: "Student with this registration number not found" });
    }

    // 2. Ab StudentLibrary find karo ya create karo
    let studentLibrary = await StudentLibrary.findOne({
      occupiedBy: student._id,
    });

    // Agar student ka library account nahi hai, toh abhi bana do
    if (!studentLibrary) {
      studentLibrary = await StudentLibrary.create({
        registrationNumber: student.registrationNumber, // Student model se
        occupiedBy: student._id,                         // Student model se
        activity: [],
        issuedBooks: [],
      });
    }

    // 3. Dono se data combine karke response bhejo
    return res.json({
      _id: student._id,
      regNo: student.registrationNumber,
      name: student.name,
      email: student.email,
      course: student.course,
      branch: student.branch,
      year: student.year,
      booksIssued: studentLibrary.issuedBooks.length,
      maxBooks: 5, // Aapka hardcoded limit
    });

  } catch (err) {
    console.error("Error fetching student by regNo:", err);
    res.status(500).json({ message: "Server error" });
  }
};
