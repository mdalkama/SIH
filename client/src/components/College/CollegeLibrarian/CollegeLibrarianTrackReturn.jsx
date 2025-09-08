import React, { useEffect, useState } from "react";
import {
  Search,
  Book,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  AlertTriangle,
  FileText,
  Eye,
} from "lucide-react";

const BASE = "https://sih-4ptm.onrender.com/api/v1";

const CollegeLibrarianTrackReturn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnCondition, setReturnCondition] = useState("good");
  const [returnNotes, setReturnNotes] = useState("");
  const [fine, setFine] = useState(0);
  const [returning, setReturning] = useState(false);
  const [returnComplete, setReturnComplete] = useState(false);

  // Mock data for stats (as requested)
  const mockIssuedBooks = [
    {
      issueId: 'ISS001',
      student: { name: 'Rahul Kumar', regNo: 'REG001' },
      book: { title: 'Data Structures and Algorithms', copyId: 'DSA001' },
      issueDate: new Date('2024-08-15'),
      dueDate: new Date('2024-08-29'),
      issuedBy: 'Smt. Kavita Gupta',
      isOverdue: true,
      daysOverdue: 9,
    },
    {
      issueId: 'ISS002',
      student: { name: 'Priya Sharma', regNo: 'REG002' },
      book: { title: 'Digital Signal Processing', copyId: 'DSP001' },
      issueDate: new Date('2024-08-25'),
      dueDate: new Date('2024-09-08'),
      issuedBy: 'Smt. Kavita Gupta',
      isOverdue: false,
      daysOverdue: 0,
    },
  ];

  // Load profile to get collegeCode
  useEffect(() => {
    (async () => {
      try {
        const r1 = await fetch(`${BASE}/my-profile`, { credentials: "include" });
        const d1 = await r1.json();
        if (r1.ok) {
          setCollegeCode(d1?.user?.collegeCode || "");
        }

        if (d1?.user?.collegeCode) {
          const r2 = await fetch(`${BASE}/library/all/${encodeURIComponent(d1.user.collegeCode)}`, { credentials: "include" });
          const d2 = await r2.json();
          if (r2.ok) setBooksCatalog(Array.isArray(d2?.books) ? d2.books : []);
        }
      } catch (e) {
        console.error("Failed to load profile/catalog", e);
      }
    })();
  }, []);

  function computeOverdueInfo(issuedAt) {
    const issued = new Date(issuedAt);
    const due = new Date(issued);
    due.setDate(due.getDate() + 14);
    const now = new Date();
    const isOverdue = now > due;
    const daysOverdue = isOverdue ? Math.floor((now - due) / (1000 * 60 * 60 * 24)) : 0;
    return { isOverdue, daysOverdue, dueDate: due };
  }
  function calculateFine(daysOverdue) {
    return daysOverdue * 2;
  }

  async function handleSearch() {
    setSearchError("");
    setSearchResults([]);
    setSelectedIssue(null);
    setShowReturnForm(false);

    const reg = searchQuery.trim().toUpperCase();
    if (!reg) {
      setSearchError("Enter a registration number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE}/library/student/issued-books`, {
        method: "POST", // as per your route `router.post(...)`
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: reg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Student not found");

      const student = data.student;
      const issued = Array.isArray(data.issuedBooks) ? data.issuedBooks : [];

      const issues = issued.map((ib, idx) => {
        const { isOverdue, daysOverdue, dueDate } = computeOverdueInfo(ib.issuedAt || Date.now());
        return {
          issueId: `ISS-${(idx + 1).toString().padStart(3, "0")}`,
          student: {
            id: student?._id,
            name: student?.name || "—",
            regNo: student?.regNo || "—",
            course: student?.course || "—",
            email: student?.email || "—",
          },
          book: {
            title: ib.title || "Unknown Book",
            author: ib.author || "N/A",
            isbn: ib.isbn || "N/A",
            copyId: ib.copyId,
            bookId: ib.bookId,
          },
          issueDate: new Date(ib.issuedAt),
          dueDate,
          issuedBy: ib.issuedBy?.name || "—",
          status: "issued",
          isOverdue,
          daysOverdue,
        };
      });

      setSearchResults(issues);
    } catch (e) {
      console.error(e);
      setSearchError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleReturnProcess(issue) {
    setSelectedIssue(issue);
    setShowReturnForm(true);
    setFine(issue.isOverdue ? calculateFine(issue.daysOverdue) : 0);
  }

  async function handleReturnBook() {
    if (!selectedIssue) return;
    try {
      setReturning(true);
      const payload = {
        collegeCode,
        bookId: selectedIssue.book.bookId,
        copyId: selectedIssue.book.copyId,
        studentId: selectedIssue.student.id,
      };

      const res = await fetch(`${BASE}/library/copies/return`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to process return");
        setReturning(false);
        return;
      }

      setReturnComplete(true);
      setSearchResults(prev => prev.filter(i => i.issueId !== selectedIssue.issueId));
      
      setTimeout(() => {
        setReturnComplete(false);
        setShowReturnForm(false);
        setSelectedIssue(null);
      }, 2500);

    } catch (e) {
      console.error(e);
      alert(e.message || "Return failed");
    } finally {
      setReturning(false);
    }
  }

  const currentDateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  if (returnComplete) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Returned Successfully!</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Student:</strong> {selectedIssue?.student?.name}</p>
              <p><strong>Book:</strong> {selectedIssue?.book?.title}</p>
              <p><strong>Copy ID:</strong> {selectedIssue?.book?.copyId}</p>
              <p><strong>Return Date:</strong> {currentDateTime}</p>
              {fine > 0 && <p><strong>Fine Collected:</strong> ₹{fine}</p>}
            </div>
            <div className="mt-6 text-sm text-gray-500">Redirecting to main form…</div>
          </div>
        </div>
      </div>
    );
  }

  if (showReturnForm && selectedIssue) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={() => setShowReturnForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Return Book</h1>
                  <p className="text-sm text-gray-600">Process book return</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Issue Details</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Student Information</div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-800">{selectedIssue.student.name}</div>
                    <div className="text-sm text-gray-600">{selectedIssue.student.regNo}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Book Information</div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-800">{selectedIssue.book.title}</div>
                    <div className="text-sm text-gray-600">Copy ID: {selectedIssue.book.copyId}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Return Processing</h2>
              <div className="space-y-4">
                {fine > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-yellow-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Fine Applicable</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-800">Total Fine: ₹{fine}</div>
                  </div>
                )}
                <button onClick={handleReturnBook} disabled={returning} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400">
                  {returning ? "Processing..." : "Process Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Search Issued Books</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter student registration number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleSearch} disabled={loading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {searchError && <div className="text-sm text-red-600">{searchError}</div>}

          {searchResults.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-3">
                {searchResults.map((issue) => (
                  <div key={issue.issueId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Student</div>
                        <div className="font-medium text-gray-800">{issue.student.name}</div>
                        <div className="text-sm text-gray-600">{issue.student.regNo}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Book</div>
                        <div className="font-medium text-gray-800">{issue.book.title}</div>
                        <div className="text-sm text-gray-600">Copy: {issue.book.copyId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        <div className="flex items-center space-x-2">
                          {issue.isOverdue ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Overdue</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">On Time</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Due: {issue.dueDate.toLocaleDateString("en-IN")}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleReturnProcess(issue)} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Return</span>
                        </button>
                        <button onClick={() => setSelectedIssue(issue)} className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats (kept as dummy) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{mockIssuedBooks.length}</div>
                <div className="text-sm text-gray-600">Total Issued Books</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{mockIssuedBooks.filter(b => b.isOverdue).length}</div>
                <div className="text-sm text-gray-600">Overdue Books</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  ₹{mockIssuedBooks.filter(b => b.isOverdue).reduce((sum, b) => sum + calculateFine(b.daysOverdue), 0)}
                </div>
                <div className="text-sm text-gray-600">Pending Fines</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CollegeLibrarianTrackReturn;