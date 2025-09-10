import express from "express";
import {
  addBook,
  deleteBook,
  addCopies,
  deleteCopies,
  issueCopy,
  returnCopy,
  getBooks,
  getStudentBooks,
  getStudentByRegNo,
  getAllIssuedBooks,
  getMyLibraryProfile,
} from "../controllers/libraryController/libraryController.js";
import { role } from "../middlewares/authMiddleware.js"; // if you have role-based auth

const router = express.Router();

// ---------- BOOK ROUTES ----------

// Add a new book
router.post("/add", addBook);

// Delete a book
router.delete("/delete/:collegeCode/:bookId", deleteBook);

// Get all books for a college (by collegeCode)
router.get("/all/:collegeCode", getBooks);

// Get all books issued to a student
router.post("/student/issued-books", getStudentBooks);

// Get all issued books for a college
router.get("/issued-books/:collegeCode", getAllIssuedBooks);

// Get student by registration number
router.get("/student/search/:regNo", getStudentByRegNo);

// ---------- COPY ROUTES ----------

// Add more copies to an existing book
router.post("/copies/add", addCopies);

// Delete specific copies from a book
router.post("/copies/delete", deleteCopies);

// Issue a copy to a student
router.post("/copies/issue", issueCopy);

// Return a copy
router.post("/copies/return", returnCopy);


export default router;
