import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  Book,
  Calendar,
  CheckCircle,
  AlertCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

const BASE = "https://sih-4ptm.onrender.com/api/v1";


function CollegeLibrarianIssueBook() {
  // Inputs and Selections
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCopy, setSelectedCopy] = useState(null);

  // Data from Backend
  const [librarianProfile, setLibrarianProfile] = useState({ name: "", role: "", collegeCode: "" });
  const [books, setBooks] = useState([]);
  
  // UI States
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [booksLoading, setBooksLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [issueComplete, setIssueComplete] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Book Table States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Load profile and all books on component mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setBooksLoading(true);
        const profileRes = await fetch(`${BASE}/my-profile`, { credentials: "include" });
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.user) {
          const user = profileData.user;
          const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "";
          setLibrarianProfile({ name, role: user.role, collegeCode: user.collegeCode, id: user.id || user._id });
          
          if (user.collegeCode) {
            const booksRes = await fetch(`${BASE}/library/all/${encodeURIComponent(user.collegeCode)}`, { credentials: "include" });
            const booksData = await booksRes.json();
            if (booksRes.ok) {
              setBooks(Array.isArray(booksData.books) ? booksData.books : []);
            }
          }
        }
      } catch (e) {
        console.error("Error loading initial data:", e);
      } finally {
        setBooksLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Search for a student by registration number
  async function handleStudentSearch() {
    const regNo = registrationNumber.trim().toUpperCase();
    if (!regNo) {
      setStudentError("Please enter a registration number.");
      return;
    }
    try {
      setStudentLoading(true);
      setStudentError("");
      setStudent(null);
      setSelectedBook(null);
      setSelectedCopy(null);

      const res = await fetch(`${BASE}/library/student/search/${encodeURIComponent(regNo)}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Student not found");
      setStudent(data);
    } catch (e) {
      setStudentError(e.message);
    } finally {
      setStudentLoading(false);
    }
  }

  // When a book row is clicked, open the copy selection modal
  function handleBookSelect(book) {
    setSelectedBook(book);
    setSelectedCopy(null); // Reset previous copy selection
    setShowCopyModal(true);
  }

  // When a copy is selected from the modal
  function handleCopySelect(copy) {
    setSelectedCopy(copy);
    setShowCopyModal(false); // Close the modal
  }

  // Issue the book to the student
  async function handleIssueBook() {
    if (!student || !selectedBook || !selectedCopy) return;
    try {
      setIssuing(true);
      const res = await fetch(`${BASE}/library/copies/issue`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: selectedBook._id,
          copyId: selectedCopy.copyId,
          studentId: student._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to issue book");
      
      setIssueComplete(true);
      setTimeout(() => {
        setIssueComplete(false);
        setStudent(null);
        setSelectedBook(null);
        setSelectedCopy(null);
        setRegistrationNumber("");
        setSearchQuery("");
        if (librarianProfile.collegeCode) {
          loadAllBooks(librarianProfile.collegeCode);
        }
      }, 3000);
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setIssuing(false);
    }
  }
  
  async function loadAllBooks(code) {
      const booksRes = await fetch(`${BASE}/library/all/${encodeURIComponent(code)}`, { credentials: "include" });
      const booksData = await booksRes.json();
      if (booksRes.ok) setBooks(Array.isArray(booksData.books) ? booksData.books : []);
  }

  // Client-side filtering, sorting, and pagination
  const processedBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q ? books.filter(b => (b.title || "").toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q)) : books;
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      return 0;
    });
    return sorted;
  }, [books, searchQuery, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, sortBy, itemsPerPage]);

  const totalPages = Math.ceil(processedBooks.length / itemsPerPage);
  const paginatedBooks = processedBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const getAvailableCopies = (book) => Array.isArray(book?.copies) ? book.copies.filter(c => !c.occupiedBy) : [];

  if (issueComplete) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in-up">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Book Issued Successfully!</h2>
          <div className="text-left bg-slate-50 p-4 rounded-lg space-y-2 text-sm text-slate-700">
            <p><strong>Student:</strong> {student?.name}</p>
            <p><strong>Book:</strong> {selectedBook?.title}</p>
            <p><strong>Copy ID:</strong> {selectedCopy?.copyId}</p>
          </div>
          <p className="text-xs text-slate-500 mt-4">This screen will reset in a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  space-y-6">
      {/* Step 1: Student Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Find Student by registration number
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStudentSearch()}
              placeholder="Enter student's registration number..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleStudentSearch} disabled={studentLoading} className="px-5 py-2 text-white rounded-md flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400">
              <Search size={16} />
              {studentLoading ? "Searching..." : "Search"}
            </button>
          </div>
          {studentError && <p className="text-sm text-red-600 mt-2">{studentError}</p>}
          {student && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 space-y-2 text-sm">
              <div className="font-bold flex items-center gap-2"><UserCheck size={16} /> Student Found</div>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Course:</strong> {student.course || "—"}</p>
              <p><strong>Books Issued:</strong> {student.booksIssued} / {student.maxBooks}</p>
              {student.booksIssued >= student.maxBooks && (
                <p className="font-bold text-red-600 flex items-center gap-1"><AlertCircle size={14} /> Book limit reached.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Select Book (only appears after student is found) */}
      {student && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Book size={20} className="text-blue-600" />
              Step 2: Select a Book from the Collection
            </h2>
          </div>
          <div className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books by title or author..." className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border rounded-md" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-2 text-sm border rounded-md">
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="title-asc">Sort by: A-Z</option>
              <option value="title-desc">Sort by: Z-A</option>
            </select>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Title</th>
                  <th className="px-4 py-2 text-left font-medium">Author</th>
                  <th className="px-4 py-2 text-center font-medium w-32">Available Copies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {booksLoading ? <tr><td colSpan={3} className="text-center p-8">Loading...</td></tr> : 
                 paginatedBooks.map(book => (
                  <tr key={book._id} onClick={() => handleBookSelect(book)} className={`cursor-pointer ${selectedBook?._id === book._id ? "bg-blue-100 font-semibold" : "hover:bg-slate-50"}`}>
                    <td className="px-4 py-3">{book.title}</td>
                    <td className="px-4 py-3 text-slate-600">{book.author || "—"}</td>
                    <td className="px-4 py-3 text-center font-medium text-green-600">{getAvailableCopies(book).length}</td>
                  </tr>
                 ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-2 py-1 text-sm border rounded-md">
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1.5 rounded-md border text-sm flex items-center gap-1.5 disabled:opacity-50">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-md border text-sm flex items-center gap-1.5 disabled:opacity-50">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Issue Summary */}
      {student && selectedBook && selectedCopy && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Step 3: Confirm and Issue
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium text-slate-500 mb-1">Student</p>
                <p className="font-semibold text-slate-800">{student.name} ({student.regNo})</p>
              </div>
              <div>
                <p className="font-medium text-slate-500 mb-1">Book</p>
                <p className="font-semibold text-slate-800">{selectedBook.title}</p>
              </div>
              <div>
                <p className="font-medium text-slate-500 mb-1">Copy ID</p>
                <p className="font-mono bg-slate-100 inline-block px-2 py-0.5 rounded text-slate-800">{selectedCopy.copyId}</p>
              </div>
              <div>
                <p className="font-medium text-slate-500 mb-1">Due Date</p>
                <p className="font-semibold text-slate-800">{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <button
              onClick={handleIssueBook}
              disabled={issuing || (student && student.booksIssued >= student.maxBooks)}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {issuing && <Loader2 size={18} className="animate-spin" />}
              {issuing ? "Issuing Book..." : "Confirm & Issue Book"}
            </button>
          </div>
        </div>
      )}

      {/* Copy Selection Modal (Updated with scroll and bigger size) */}
      {showCopyModal && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg flex flex-col animate-fade-in-up">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg text-slate-800">Select an Available Copy</h3>
              <button onClick={() => setShowCopyModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm mb-4">
                Available copies for <strong>{selectedBook.title}</strong>:
              </p>
              {getAvailableCopies(selectedBook).length === 0 ? (
                <p className="text-sm text-slate-500">No copies available for this book.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {getAvailableCopies(selectedBook).map(copy => (
                    <button
                      key={copy.copyId}
                      onClick={() => handleCopySelect(copy)}
                      className="px-4 py-2 rounded-md border font-mono text-center bg-white hover:bg-blue-50 hover:border-blue-400 focus:ring-2 focus:ring-blue-500"
                    >
                      {copy.copyId}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeLibrarianIssueBook;