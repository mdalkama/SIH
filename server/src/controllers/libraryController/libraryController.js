
import Library from "../../models/libraryModal.js";
import mongoose from "mongoose";
import Staff from "../../models/staffModel.js"

// ---------- BOOK OPERATIONS ----------

// Add a new book
export const addBook = async (req, res) => {
    try {
        const librarianId = req.user.id;
        const collegeCode = await Staff.findById(librarianId).select('collegeCode');
        if (!collegeCode) return res.status(404).json({ message: "college Code not found" });
        const { title, author, isbn, category, totalCopies } = req.body;
        if (!title || !totalCopies) {
            return res.status(400).json({ message: "collegeCode, title, and totalCopies are required" });
        }

        let library = await Library.findOne({ collegeCode: collegeCode.collegeCode });
        if (!library) library = new Library({ collegeCode: collegeCode.collegeCode, books: [] });

        if (isbn && library.books.some(b => b.isbn === isbn)) {
            return res.status(400).json({ message: "Book with this ISBN already exists" });
        }

        const copies = Array.from({ length: totalCopies }, (_, i) => ({ copyId: `C${i + 1}` }));
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
        const { collegeCode, bookId } = req.params;
        const library = await Library.findOne({ collegeCode });
        if (!library) return res.status(404).json({ message: "Library not found" });

        const book = library.books.id(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        // Remove book from the books array
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
        const collegeCode = await Staff.findById(librarianId).select('collegeCode');
        if (!collegeCode) return res.status(404).json({ message: "college Code not found" });
        const { bookId, newCopies } = req.body;
        if (!bookId || !newCopies) {
            return res.status(400).json({ message: "bookId, and newCopies are required" });
        }

        const library = await Library.findOne({ collegeCode: collegeCode.collegeCode });
        if (!library) return res.status(404).json({ message: "Library not found" });

        const book = library.books.id(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        const currentCount = book.copies.length;
        const copies = Array.from({ length: newCopies }, (_, i) => ({ copyId: `C${currentCount + i + 1}` }));
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
        const collegeCode = await Staff.findById(librarianId).select('collegeCode');
        if (!collegeCode) return res.status(404).json({ message: "college Code not found" });
        const { bookId, copyIds } = req.body; // copyIds = ["C1", "C2"]
        if (!bookId || !copyIds || !copyIds.length) {
            return res.status(400).json({ message: "collegeCode, bookId, and copyIds are required" });
        }

        const library = await Library.findOne({ collegeCode: collegeCode.collegeCode });
        if (!library) return res.status(404).json({ message: "Library not found" });

        const book = library.books.id(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        book.copies = book.copies.filter(c => !copyIds.includes(c.copyId));
        book.totalCopies = book.copies.length;

        await library.save();
        res.json({ success: true, book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// Issue a copy to a student
export const issueCopy = async (req, res) => {
    try {
        const librarianId = req.user.id;
        const collegeCode = await Staff.findById(librarianId).select('collegeCode');
        if (!collegeCode) return res.status(404).json({ message: "college Code not found" });
        const {bookId, copyId, studentId, staffId } = req.body;
        if (!bookId || !copyId || !studentId || !staffId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const library = await Library.findOne({ collegeCode: collegeCode.collegeCode });
        if (!library) return res.status(404).json({ message: "Library not found" });

        const book = library.books.id(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        const copy = book.copies.find(c => c.copyId === copyId);
        if (!copy) return res.status(404).json({ message: "Copy not found" });
        if (copy.occupiedBy) return res.status(400).json({ message: "Copy is already issued" });

        copy.occupiedBy = mongoose.Types.ObjectId(studentId);
        copy.occupiedAt = new Date();
        copy.issuedBy = mongoose.Types.ObjectId(staffId);

        await library.save();
        res.json({ success: true, copy });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Return a copy
export const returnCopy = async (req, res) => {
    try {
        const { collegeCode, bookId, copyId } = req.body;
        if (!collegeCode || !bookId || !copyId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const library = await Library.findOne({ collegeCode });
        if (!library) return res.status(404).json({ message: "Library not found" });

        const book = library.books.id(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        const copy = book.copies.find(c => c.copyId === copyId);
        if (!copy) return res.status(404).json({ message: "Copy not found" });
        if (!copy.occupiedBy) return res.status(400).json({ message: "Copy is not issued" });

        copy.occupiedBy = null;
        copy.occupiedAt = null;
        copy.issuedBy = null;

        await library.save();
        res.json({ success: true, copy });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

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
        const { studentId } = req.params;

        const libraries = await Library.find({ "books.copies.occupiedBy": studentId });
        const studentBooks = [];

        libraries.forEach(library => {
            library.books.forEach(book => {
                const copies = book.copies.filter(c => c.occupiedBy && c.occupiedBy.toString() === studentId);
                if (copies.length) {
                    studentBooks.push({
                        collegeCode: library.collegeCode,
                        bookId: book._id,
                        title: book.title,
                        copies
                    });
                }
            });
        });

        res.json({ success: true, studentBooks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
