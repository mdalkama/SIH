import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  Book,
  CheckCircle,
  AlertCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

// --- Configuration ---
const BASE = "https://sih-4ptm.onrender.com/api/v1";

// --- Consistent UI Tokens ---
const ui = {
  card: "bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm",
  input: "w-full px-4 py-2.5 text-base rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
  button: "px-5 py-2.5 text-white font-semibold rounded-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400",
  head: "bg-slate-50/80 text-slate-600",
  row: "border-t border-slate-100",
  footer: "px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100",
};

function CollegeLibrarianIssueBook() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [librarianProfile, setLibrarianProfile] = useState({ name: "", role: "", collegeCode: "" });
  const [books, setBooks] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [booksLoading, setBooksLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [issueComplete, setIssueComplete] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [notification, setNotification] = useState(null);

  function showNotification(message, type = "error") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setBooksLoading(true);
        const profileRes = await fetch(`${BASE}/my-profile`, { credentials: "include" });
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.user) {
          const user = profileData.user;
          setLibrarianProfile({
            name: user.name || "",
            role: user.role,
            collegeCode: user.collegeCode,
            id: user.id || user._id,
          });
          if (user.collegeCode) {
            await loadAllBooks(user.collegeCode);
          }
        }
      } catch (e) {
        console.error("Error loading initial data:", e);
        showNotification("Failed to load initial data.", "error");
      } finally {
        setBooksLoading(false);
      }
    }
    loadInitialData();
  }, []);

  async function loadAllBooks(code) {
    const booksRes = await fetch(`${BASE}/library/all/${encodeURIComponent(code)}`, { credentials: "include" });
    const booksData = await booksRes.json();
    if (booksRes.ok) setBooks(Array.isArray(booksData.books) ? booksData.books : []);
  }

  async function handleStudentSearch(e) {
    if (e) e.preventDefault();
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

  function handleBookSelect(book) {
    if (getAvailableCopies(book).length === 0) return;
    setSelectedBook(book);
    setSelectedCopy(null);
    setShowCopyModal(true);
  }

  function handleCopySelect(copy) {
    setSelectedCopy(copy);
    setShowCopyModal(false);
  }

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
        if (librarianProfile.collegeCode) loadAllBooks(librarianProfile.collegeCode);
      }, 3000);
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setIssuing(false);
    }
  }

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`${ui.card} max-w-md w-full p-8 text-center`}>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Book Issued Successfully!</h2>
          <div className="text-left bg-slate-50 p-4 rounded-lg space-y-2 text-sm text-slate-700 ring-1 ring-slate-200/60">
            <p><strong>Student:</strong> {student?.name}</p><p><strong>Book:</strong> {selectedBook?.title}</p><p><strong>Copy ID:</strong> {selectedCopy?.copyId}</p>
          </div>
          <p className="text-xs text-slate-500 mt-4">This screen will reset in a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (<div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 bg-red-50 text-red-800`}><AlertCircle size={20} /><span>{notification.message}</span></div>)}
      <div className={ui.card}>
        <div className="p-5 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-800 flex items-center gap-3"><User size={20} className="text-blue-600" />Find Student</h2></div>
        <div className="p-5">
          <form onSubmit={handleStudentSearch} className="flex flex-col sm:flex-row gap-3">
            <input type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="Enter student's registration number..." className={`${ui.input} flex-1`} />
            <button type="submit" disabled={studentLoading} className={ui.button}>{studentLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}<span>{studentLoading ? "Searching..." : "Search"}</span></button>
          </form>
          {studentError && <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5"><AlertCircle size={14} /> {studentError}</p>}
          {student && (
            <div className="mt-4 bg-green-50 ring-1 ring-green-200 text-green-800 rounded-lg p-4 space-y-1.5 text-sm">
              <div className="font-bold flex items-center gap-2"><UserCheck size={16} /> Student Found</div>
              <p><strong>Name:</strong> {student.name}</p><p><strong>Course:</strong> {student.course || "—"}</p><p><strong>Books Issued:</strong> {student.booksIssued} / {student.maxBooks}</p>
              {student.booksIssued >= student.maxBooks && (<p className="font-bold text-red-600 flex items-center gap-1.5"><AlertCircle size={14} /> Book limit reached.</p>)}
            </div>
          )}
        </div>
      </div>

      {student && (
        <div className={ui.card}>
          <div className="p-5 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-800 flex items-center gap-3"><Book size={20} className="text-blue-600" />Select a Book</h2></div>
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books..." className="w-full sm:w-64 pl-9 pr-10 py-2 text-sm border rounded-md" />
              {searchQuery && (<button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>)}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-2 text-sm border rounded-md bg-white">
              <option value="newest">Sort by: Newest</option><option value="oldest">Sort by: Oldest</option><option value="title-asc">Sort by: A-Z</option><option value="title-desc">Sort by: Z-A</option>
            </select>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className={ui.head}><tr><th className="p-3 text-left font-medium">Title</th><th className="p-3 text-left font-medium">Author</th><th className="p-3 text-center font-medium w-32">Available</th></tr></thead>
              <tbody>
                {/* === START OF CHANGED BLOCK === */}
                {booksLoading ? (
                  <tr><td colSpan={3} className="text-center p-8"><Loader2 className="animate-spin inline-block" /></td></tr>
                ) : paginatedBooks.length > 0 ? (
                  paginatedBooks.map(book => {
                    const available = getAvailableCopies(book).length;
                    return (
                      <tr key={book._id} onClick={() => available > 0 && handleBookSelect(book)} className={`transition-colors ${available === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'} ${selectedBook?._id === book._id ? "bg-blue-50 font-semibold" : ""}`}>
                        <td className="p-3">{book.title}</td>
                        <td className="p-3 text-slate-600">{book.author || "—"}</td>
                        <td className={`p-3 text-center font-medium ${available > 0 ? 'text-green-600' : 'text-slate-400'}`}>{available}</td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-8 text-slate-500">
                      {searchQuery ? `No books found for "${searchQuery}"` : "No books in the library."}
                    </td>
                  </tr>
                )}
                {/* === END OF CHANGED BLOCK === */}
              </tbody>
            </table>
          </div>
          {totalPages > 0 && (
            <div className={ui.footer}>
              <div className="flex items-center gap-3 text-sm"><select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border rounded-md"><option value={5}>5 / page</option><option value={10}>10 / page</option><option value={50}>50 / page</option></select><span className="text-slate-500">Showing {processedBooks.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, processedBooks.length)} of {processedBooks.length}</span></div>
              <div className="flex gap-2"><button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1.5 rounded-md border text-sm flex items-center gap-1.5 disabled:opacity-50 hover:bg-slate-50"><ChevronLeft size={14} /> Prev</button><button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="px-3 py-1.5 rounded-md border text-sm flex items-center gap-1.5 disabled:opacity-50 hover:bg-slate-50">Next <ChevronRight size={14} /></button></div>
            </div>
          )}
        </div>
      )}

      {student && selectedBook && selectedCopy && (
        <div className={ui.card}>
          <div className="p-5 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-800 flex items-center gap-3"><CheckCircle size={20} className="text-blue-600" />Confirm and Issue</h2></div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div><p className="text-slate-500">Student</p><p className="font-semibold text-slate-800">{student.name} ({registrationNumber})</p></div>
              <div><p className="text-slate-500">Book</p><p className="font-semibold text-slate-800">{selectedBook.title}</p></div>
              <div><p className="text-slate-500">Copy ID</p><p className="font-mono bg-slate-100 inline-block px-2 py-0.5 rounded text-slate-800">{selectedCopy.copyId}</p></div>
              <div><p className="text-slate-500">Due Date</p><p className="font-semibold text-slate-800">{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
            </div>
            <button onClick={handleIssueBook} disabled={issuing || (student && student.booksIssued >= student.maxBooks)} className={`${ui.button} w-full mt-6 py-3`}>{issuing && <Loader2 size={18} className="animate-spin" />} {issuing ? "Issuing Book..." : "Confirm & Issue Book"}</button>
          </div>
        </div>
      )}

      {showCopyModal && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`${ui.card} w-full max-w-lg flex flex-col`}>
            <div className="p-5 border-b border-slate-100 flex justify-between items-center"><h3 className="font-semibold text-lg text-slate-800">Select an Available Copy</h3><button onClick={() => setShowCopyModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800"><X size={18} /></button></div>
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <p className="text-sm mb-4">Available copies for <strong>{selectedBook.title}</strong>:</p>
              {getAvailableCopies(selectedBook).length === 0 ? (<p className="text-sm text-slate-500">No copies available.</p>) : (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">{getAvailableCopies(selectedBook).map(copy => (<button key={copy.copyId} onClick={() => handleCopySelect(copy)} className="px-4 py-2 rounded-lg border-2 border-transparent font-mono text-center bg-slate-50 hover:border-blue-500 focus:ring-2 focus:ring-blue-500">{copy.copyId}</button>))}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeLibrarianIssueBook;