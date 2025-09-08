import React, { useEffect, useState } from "react";
import { Search, User, Book, Calendar, Clock, CheckCircle, AlertCircle, UserCheck } from "lucide-react";

const BASE = "https://sih-4ptm.onrender.com/api/v1";

function CollegeLibrarianIssueBook() {
  // Inputs / selections
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  // Librarian/profile
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [collegeCode, setCollegeCode] = useState("");

  // Books
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // Selection
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  console.log("selectedBook",selectedBook?._id);
  console.log("selectedCopy",selectedCopy?.copyId)
  console.log("student",student?._id)


  // Issue
  const [issuing, setIssuing] = useState(false);
  const [issueComplete, setIssueComplete] = useState(false);

  // Load profile -> books
  useEffect(() => {
    async function loadProfileAndBooks() {
      try {
        setBooksLoading(true);

        // Profile
        const r1 = await fetch(`${BASE}/my-profile`, {
          method: "GET",
          credentials: "include",
        });
        const d1 = await r1.json();
        if (!r1.ok) {
          console.error(d1?.message || "Failed to fetch profile");
          return;
        }
        const user = d1?.user || {};
        const name =
          user.name ||
          user.fullName ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
          "";

        setStaffName(name);
        setStaffRole(user.role || "");
        setCollegeCode(user.collegeCode || "");

        // Books
        if (user.collegeCode) {
          const r2 = await fetch(`${BASE}/library/all/${encodeURIComponent(user.collegeCode)}`, {
            method: "GET",
            credentials: "include",
          });
          const d2 = await r2.json();
          if (!r2.ok) {
            console.error(d2?.message || "Failed to fetch books");
            setBooks([]);
          } else {
            setBooks(Array.isArray(d2?.books) ? d2.books : []);
          }
        }
      } catch (e) {
        console.error(e);
        setBooks([]);
      } finally {
        setBooksLoading(false);
      }
    }
    loadProfileAndBooks();
  }, []);

  // Search student by registration number
  async function handleStudentSearch() {
    const regNo = registrationNumber.trim();
    if (!regNo) {
      setStudent(null);
      setStudentError("Enter a registration number");
      return;
    }
    try {
      setStudentLoading(true);
      setStudentError("");
      setStudent(null);

      const res = await fetch(`${BASE}/library/student/search/${regNo}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setStudentError(data?.message || "Student not found");
        setStudent(null);
        return;
      }
      // data: { _id, regNo, name, email, course, branch, year, booksIssued, maxBooks }
      setStudent(data);
    } catch (e) {
      console.error(e);
      setStudentError(e.message || "Failed to search student");
      setStudent(null);
    } finally {
      setStudentLoading(false);
    }
  }

  // Filter books (show all if search empty)
  const booksToShow = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) => {
      const t = (b.title || "").toLowerCase();
      const a = (b.author || "").toLowerCase();
      const c = (b.category || "").toLowerCase();
      const i = (b.isbn || "").toLowerCase();
      return t.includes(q) || a.includes(q) || c.includes(q) || i.includes(q);
    });
  })();

  // Helpers
  function getAvailableCopies(book) {
    const copies = Array.isArray(book.copies) ? book.copies : [];
    return copies.filter((c) => !c.occupiedBy);
  }
  function getAvailableCount(book) {
    return getAvailableCopies(book).length;
  }

  const currentDateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN");




  // Issue (real API call) — do NOT send staffId; backend uses req.user.id
  async function handleIssueBook() {
    if (!student || !selectedBook || !selectedCopy) return;
    console.log()
    try {
      setIssuing(true);
      const res = await fetch(`${BASE}/library/copies/issue`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: selectedBook?._id,
          copyId: selectedCopy?.copyId,
          studentId: student?._id, // from student search
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to issue");
        return;
      }

      // Success UI
      setIssueComplete(true);

      // Refresh books (so availability updates)
      if (collegeCode) {
        try {
          const r = await fetch(`${BASE}/library/all/${encodeURIComponent(collegeCode)}`, {
            method: "GET",
            credentials: "include",
          });
          const d = await r.json();
          if (r.ok) setBooks(Array.isArray(d?.books) ? d.books : []);
        } catch {}
      }

      // Auto reset after a few seconds
      setTimeout(() => {
        setIssueComplete(false);
        setStudent(null);
        setSelectedBook(null);
        setSelectedCopy(null);
        setRegistrationNumber("");
        setSearchQuery("");
      }, 3000);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to issue");
    } finally {
      setIssuing(false);
    }
  }

  if (issueComplete) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Issued Successfully!</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Librarian:</strong> {staffName || "—"} {staffRole ? `(${staffRole})` : ""}
              </p>
              <p>
                <strong>Student:</strong> {student?.name} ({student?.regNo})
              </p>
              <p>
                <strong>Book:</strong> {selectedBook?.title}
              </p>
              <p>
                <strong>Copy ID:</strong> {selectedCopy?.copyId}
              </p>
              <p>
                <strong>Issue Date:</strong> {currentDateTime}
              </p>
              <p>
                <strong>Due Date:</strong> {dueDate}
              </p>
            </div>
            <div className="mt-6 text-sm text-gray-500">Redirecting to main form in a few seconds...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Search */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Student Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStudentSearch()}
                    placeholder="Enter registration number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleStudentSearch}
                    disabled={studentLoading}
                    className={`px-4 py-2 text-white rounded-lg flex items-center ${
                      studentLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {studentLoading && <div className="text-sm text-slate-500 mt-1">Searching...</div>}
              </div>

              {student && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Student Found</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {student.name}</div>
                    <div><strong>Course:</strong> {student.course || "—"}</div>
                    <div><strong>Email:</strong> {student.email || "—"}</div>
                    <div><strong>Books Issued:</strong> {student.booksIssued}/{student.maxBooks}</div>
                  </div>
                  {student.booksIssued >= student.maxBooks && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Maximum book limit reached</span>
                    </div>
                  )}
                </div>
              )}

              {!student && studentError && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{studentError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Book Search + List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Select Book</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Books</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, category, or ISBN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {booksLoading ? (
                  <div className="text-sm text-slate-500 px-1">Loading books...</div>
                ) : booksToShow.length === 0 ? (
                  <div className="text-sm text-slate-500 px-1">No books found.</div>
                ) : (
                  booksToShow.map((book) => (
                    <div
                      key={book._id}
                      onClick={() => {
                        setSelectedBook(book);
                        setSelectedCopy(null);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedBook?._id === book._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="font-medium text-gray-800">{book.title}</div>
                      <div className="text-sm text-gray-600">{book.author || "-"}</div>
                      <div className="text-sm text-gray-500">
                        Available: {getAvailableCount(book)} of {book.totalCopies || 0}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Copy Selection */}
            {selectedBook && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Select Copy</h3>
                {getAvailableCopies(selectedBook).length === 0 ? (
                  <div className="text-sm text-slate-500">All copies are currently issued.</div>
                ) : (
                  <div className="space-y-2">
                    {getAvailableCopies(selectedBook).map((copy) => (
                      <div
                        key={copy.copyId}
                        onClick={() => setSelectedCopy(copy)}
                        className={`p-2 rounded border cursor-pointer transition-colors ${
                          selectedCopy?.copyId === copy.copyId ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{copy.copyId}</span>
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Available</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Issue Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Issue Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Issue Date & Time</span>
                </div>
                <div className="text-sm font-medium text-gray-800">{currentDateTime}</div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Issuing Librarian</div>
                  <div className="font-medium text-gray-800">{staffName || "—"}</div>
                  <div className="text-sm text-gray-500">{staffRole || "—"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Student</div>
                  <div className="font-medium text-gray-800">{student ? student.name : "Not selected"}</div>
                  {student && <div className="text-sm text-gray-500">{student.regNo}</div>}
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Book</div>
                  <div className="font-medium text-gray-800">{selectedBook ? selectedBook.title : "Not selected"}</div>
                  {selectedBook && <div className="text-sm text-gray-500">by {selectedBook.author || "-"}</div>}
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Copy ID</div>
                  <div className="font-medium text-gray-800">{selectedCopy ? selectedCopy.copyId : "Not selected"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Due Date</div>
                  <div className="font-medium text-gray-800">{dueDate}</div>
                  <div className="text-xs text-gray-500">14 days from issue date</div>
                </div>
              </div>

              <button
                onClick={handleIssueBook}
                disabled={
                  issuing ||
                  !student ||
                  !selectedBook ||
                  !selectedCopy ||
                  student.booksIssued >= student.maxBooks
                }
                className={`w-full py-3 text-white rounded-lg font-medium transition-colors ${
                  issuing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {issuing ? "Issuing..." : "Issue Book"}
              </button>

              {student && student.booksIssued >= student.maxBooks && (
                <div className="text-red-600 text-sm text-center">Cannot issue: Maximum book limit reached</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeLibrarianIssueBook;