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
    if (copy.occupiedBy)
      return res.status(400).json({ message: "Copy is already issued" });

    // Assign plain strings; Mongoose will cast to ObjectId on save
    copy.occupiedBy = studentId;
    copy.occupiedAt = new Date();
    copy.issuedBy = librarianId;
    await library.save();

    // ----- Ensure StudentLibrary exists (with registrationNumber) -----
    let studentLibrary = await StudentLibrary.findOne({
      occupiedBy: studentId,
    });

    if (!studentLibrary) {
      const studentDoc = await Student.findById(studentId).select(
        "registrationNumber"
      );
      if (!studentDoc?.registrationNumber) {
        return res
          .status(400)
          .json({ message: "Student registrationNumber not found" });
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
      return res
        .status(400)
        .json({ message: "A student can only issue up to 5 books" });
    }

    // Update StudentLibrary
    studentLibrary.issuedBooks.push({
      bookId, // subdocument _id (embedded book), OK as per your schema
      copyId,
      issuedAt: new Date(),
      issuedBy: librarianId,
    });

    studentLibrary.activity.push({
      bookName: book.title,
      copyId,
      issuedBy: librarianId,
      issuedAt: new Date(),
    });

    await studentLibrary.save();

    return res.json({ success: true, copy, studentLibrary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

//return a copy
export const returnCopy = async (req, res) => {
  try {
    const librarianId = req.user?.id;
    if (!librarianId) return res.status(401).json({ message: "Unauthorized" });

    const staff = await Staff.findById(librarianId).select("collegeCode");
    if (!staff?.collegeCode) return res.status(404).json({ message: "college Code not found" });

    const { bookId, copyId, studentId, fine, returnNotes } = req.body || {};
    const missing = [];
    if (!bookId) missing.push("bookId");
    if (!copyId) missing.push("copyId");
    if (!studentId) missing.push("studentId");
    if (missing.length) {
      return res.status(400).json({ message: "Missing required fields", missing, received: req.body });
    }

    // Update Library
    const library = await Library.findOne({ collegeCode: staff.collegeCode });
    if (!library) return res.status(404).json({ message: "Library not found" });

    const book = library.books.id(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const copy = book.copies.find((c) => c.copyId === copyId);
    if (!copy) return res.status(404).json({ message: "Copy not found" });
    if (!copy.occupiedBy) return res.status(400).json({ message: "Copy is not issued" });
    if (String(copy.occupiedBy) !== String(studentId)) {
      return res.status(400).json({ message: "Copy is issued to a different student" });
    }

    // Clear occupancy
    copy.occupiedBy = null;
    copy.occupiedAt = null;
    copy.issuedBy = null;
    await library.save();

    // Update StudentLibrary
    // NOTE: adjust this query to your schema (e.g., { studentId }) if needed
    const studentLibrary = await StudentLibrary.findOne({ occupiedBy: studentId });
    if (!studentLibrary) return res.status(404).json({ message: "Student library account not found" });

    // Remove from issuedBooks
    studentLibrary.issuedBooks = studentLibrary.issuedBooks.filter(
      (b) => !(String(b.bookId) === String(bookId) && b.copyId === copyId)
    );

    // Update activity: mark returnedAt and set fine (optional)
    const activity = studentLibrary.activity.find((a) => a.copyId === copyId && !a.returnedAt);
    if (activity) {
      activity.returnedAt = new Date();

      // Default fine (if overdue)
      const LATE_RATE = 5; // ₹5/day
      const dueDate = new Date(activity.issuedAt);
      dueDate.setDate(dueDate.getDate() + 14);

      let computed = 0;
      if (new Date() > dueDate) {
        const lateDays = Math.floor((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        computed = lateDays * LATE_RATE;
      }

      // If 'fine' provided, use it. Otherwise use computed default.
      if (typeof fine === "number") {
        activity.fine = fine;
      } else {
        activity.fine = computed;
      }

      if (returnNotes) {
        activity.returnNotes = returnNotes;
      }
    }

    await studentLibrary.save();

    return res.json({ success: true, copy, studentLibrary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
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
      return res
        .status(404)
        .json({ message: "Librarian's college code not found" });
    }

    // 3. College ki library load karo
    const libraryDoc = await Library.findOne({
      collegeCode: staff.collegeCode,
    });
    if (!libraryDoc) {
      return res.status(404).json({ message: "Library not found" });
    }

    // 4. StudentLibrary find karo (ya create karo)
    let sl = await StudentLibrary.findOne({ registrationNumber })
      .populate(
        "occupiedBy",
        "name email course branch year registrationNumber"
      )
      .populate("issuedBooks.issuedBy", "name")
      .lean();

    if (!sl) {
      const student = await Student.findOne({ registrationNumber }).lean();
      if (!student) {
        return res
          .status(404)
          .json({ message: "No library account found for this student" });
      }
      const created = await StudentLibrary.create({
        registrationNumber: student.registrationNumber.trim().toUpperCase(),
        occupiedBy: student._id,
      });
      sl = await StudentLibrary.findById(created._id)
        .populate(
          "occupiedBy",
          "name email course branch year registrationNumber"
        )
        .populate("issuedBooks.issuedBy", "name")
        .lean();
    }

    // 5. issuedBooks ko enrich karo (title/author add karo)
    const enrichedIssuedBooks = (sl.issuedBooks || []).map((ib) => {
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
      student: sl.occupiedBy
        ? {
            _id: sl.occupiedBy._id,
            regNo: sl.registrationNumber,
            name: sl.occupiedBy.name,
            email: sl.occupiedBy.email,
            course: sl.occupiedBy.course,
          }
        : null,
      issuedBooks: enrichedIssuedBooks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllIssuedBooks = async (req, res) => {
  try {
    const { collegeCode } = req.params;
    const library = await Library.findOne({ collegeCode }).lean();
    if (!library || !library.books) return res.json({ issuedBooks: [] });

    const issuedCopies = [];
    library.books.forEach((book) => {
      book.copies?.forEach((copy) => {
        if (copy.occupiedBy) {
          issuedCopies.push({
            bookId: book._id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            copyId: copy.copyId,
            occupiedBy: copy.occupiedBy,
            issuedAt: copy.occupiedAt,
            issuedBy: copy.issuedBy,
          });
        }
      });
    });

    if (issuedCopies.length === 0) return res.json({ issuedBooks: [] });

    const studentIds = issuedCopies.map((c) => c.occupiedBy);
    const staffIds = issuedCopies.map((c) => c.issuedBy);

    const students = await Student.find({ _id: { $in: studentIds } })
      .select("_id name registrationNumber course")
      .lean();
    const staff = await Staff.find({ _id: { $in: staffIds } })
      .select("_id name")
      .lean();

    const studentMap = new Map(students.map((s) => [s._id.toString(), s]));
    const staffMap = new Map(staff.map((s) => [s._id.toString(), s]));

    const finalData = issuedCopies.map((copy) => {
      const student = studentMap.get(copy.occupiedBy.toString());
      const librarian = staffMap.get(copy.issuedBy.toString());
      return {
        ...copy,
        student: {
          id: student?._id,
          name: student?.name,
          regNo: student?.registrationNumber,
          course: student?.course,
        },
        librarian: { name: librarian?.name || "N/A" },
      };
    });

    res.json({ success: true, issuedBooks: finalData });
  } catch (err) {
    console.error("Error fetching all issued books:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentByRegNo = async (req, res) => {
  try {
    const regNoRaw = req.params.regNo || "";
    const regNo = regNoRaw.trim().toUpperCase();

    if (!regNo) {
      return res
        .status(400)
        .json({ message: "Registration number is required" });
    }

    // 1. Student collection me dhoondo
    const student = await Student.findOne({ registrationNumber: regNo })
      .select("_id name email course registrationNumber")
      .lean();

    // Agar student hi nahi hai, toh aage nahi badhna
    if (!student) {
      return res
        .status(404)
        .json({ message: "Student with this registration number not found" });
    }

    // 2. Ab StudentLibrary find karo ya create karo
    let studentLibrary = await StudentLibrary.findOne({
      occupiedBy: student._id,
    });

    // Agar student ka library account nahi hai, toh abhi bana do
    if (!studentLibrary) {
      studentLibrary = await StudentLibrary.create({
        registrationNumber: student.registrationNumber, // Student model se
        occupiedBy: student._id, // Student model se
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
