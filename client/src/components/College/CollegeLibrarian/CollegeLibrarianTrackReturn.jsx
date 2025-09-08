import React, { useEffect, useMemo, useState } from "react";
import { Search, Book, CheckCircle, AlertCircle, AlertTriangle, FileText, Eye, X, Loader2, BookOpen } from "lucide-react";

const BASE = "https://sih-4ptm.onrender.com/api/v1";
const LATE_RATE = 5; // ₹ per day (aligned with backend)

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1,2,3].map(i => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-7 bg-slate-200 rounded w-20 mb-2" />
          <div className="h-4 bg-slate-200 rounded w-32" />
        </div>
      </div>
    ))}
  </div>
);

const RowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
    <td className="px-4 py-3"><div className="h-4 w-48 bg-slate-200 rounded" /></td>
    <td className="px-4 py-3"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
    <td className="px-4 py-3"><div className="h-6 w-28 bg-slate-200 rounded-full" /></td>
    <td className="px-4 py-3"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
    <td className="px-4 py-3"><div className="h-8 w-28 bg-slate-200 rounded" /></td>
  </tr>
);

const CollegeLibrarianTrackReturn = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [collegeCode, setCollegeCode] = useState("");
  const [loading, setLoading] = useState(true); // for skeletons
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [fineDetails, setFineDetails] = useState({ lateFine: 0, additionalFine: 0, notes: "" });
  const [applyFine, setApplyFine] = useState(false); // librarian can choose to waive fine
  const [returning, setReturning] = useState(false);
  const [returnComplete, setReturnComplete] = useState(false);
  const [notification, setNotification] = useState(null);

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const r1 = await fetch(`${BASE}/my-profile`, { credentials: "include" });
        const d1 = await r1.json();
        if (r1.ok && d1.user?.collegeCode) {
          const code = d1.user.collegeCode;
          setCollegeCode(code);
          await loadAllIssuedBooks(code);
        } else {
          showNotification(d1.message || "Could not load librarian profile.", "error");
        }
      } catch (e) {
        showNotification("An error occurred while loading data.", "error");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  async function loadAllIssuedBooks(code) {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/library/issued-books/${encodeURIComponent(code)}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setIssuedBooks(Array.isArray(data.issuedBooks) ? data.issuedBooks : []);
      } else {
        showNotification(data.message || "Failed to load issued books.", "error");
      }
    } catch (e) {
      showNotification("An error occurred.", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

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
    return daysOverdue * LATE_RATE;
  }

  const filteredIssuedBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return issuedBooks;
    return issuedBooks.filter(issue =>
      (issue.student?.name || "").toLowerCase().includes(q) ||
      (issue.student?.regNo || "").toLowerCase().includes(q) ||
      (issue.title || "").toLowerCase().includes(q) ||
      (issue.copyId || "").toLowerCase().includes(q)
    );
  }, [issuedBooks, searchQuery]);

  function handleOpenReturnModal(issue) {
    setSelectedIssue(issue);
    const { isOverdue, daysOverdue } = computeOverdueInfo(issue.issuedAt);
    setFineDetails({
      lateFine: isOverdue ? calculateFine(daysOverdue) : 0,
      additionalFine: 0,
      notes: ""
    });
    setApplyFine(isOverdue); // default: only apply if overdue; librarian can toggle
    setShowReturnModal(true);
  }

  async function handleReturnBook() {
    if (!selectedIssue) return;
    try {
      setReturning(true);

      // Prepare payload — fine is optional
      const totalFine =
        (applyFine ? Number(fineDetails.lateFine || 0) : 0) +
        Number(fineDetails.additionalFine || 0);

      const payload = {
        bookId: selectedIssue.bookId,
        copyId: selectedIssue.copyId,
        studentId: selectedIssue.student.id,
        returnNotes: fineDetails.notes || undefined,
      };
      if (totalFine > 0) payload.fine = totalFine; // send only if applicable

      const res = await fetch(`${BASE}/library/copies/return`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Return failed");

      setReturnComplete(true);
      setShowReturnModal(false);
      await loadAllIssuedBooks(collegeCode);
      setTimeout(() => {
        setReturnComplete(false);
        setSelectedIssue(null);
      }, 2200);
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setReturning(false);
    }
  }

  const totals = useMemo(() => {
    const overdue = issuedBooks.filter(b => computeOverdueInfo(b.issuedAt).isOverdue).length;
    const fines = issuedBooks
      .filter(b => computeOverdueInfo(b.issuedAt).isOverdue)
      .reduce((sum, b) => sum + calculateFine(computeOverdueInfo(b.issuedAt).daysOverdue), 0);
    return { issued: issuedBooks.length, overdue, fines };
  }, [issuedBooks]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {notification && (
        <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {notification.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
      {returnComplete && (
        <div className="fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 bg-green-50 text-green-800">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">Book returned successfully!</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <BookOpen className="text-blue-600" />
          Track & Return Books
        </h1>
        <p className="text-slate-500 mt-1">View all issued books and process returns.</p>
      </div>

      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Book className="w-6 h-6 text-blue-600" /></div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{totals.issued}</div>
              <div className="text-sm text-slate-500">Total Issued Books</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{totals.overdue}</div>
              <div className="text-sm text-slate-500">Overdue Books</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <div className="text-3xl font-bold text-slate-800">₹{totals.fines}</div>
              <div className="text-sm text-slate-500">Potential Late Fines</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Issued Books History</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Student, Book, or Copy ID..."
              className="w-full sm:w-72 pl-9 pr-8 py-2 text-sm border rounded-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Student</th>
                <th className="px-4 py-2 text-left font-medium">Book Title</th>
                <th className="px-4 py-2 text-left font-medium">Copy ID</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Due Date</th>
                <th className="px-4 py-2 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <>
                  <RowSkeleton /><RowSkeleton /><RowSkeleton /><RowSkeleton /><RowSkeleton />
                </>
              ) : filteredIssuedBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-10">
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <BookOpen className="w-8 h-8" />
                      <div>No issued books found.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIssuedBooks.map((issue) => {
                  const { isOverdue, daysOverdue, dueDate } = computeOverdueInfo(issue.issuedAt);
                  return (
                    <tr key={`${issue.bookId}-${issue.copyId}`} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{issue.student.name}</div>
                        <div className="text-slate-500">{issue.student.regNo}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{issue.title}</td>
                      <td className="px-4 py-3 font-mono text-slate-700">{issue.copyId}</td>
                      <td className="px-4 py-3">
                        {isOverdue ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Overdue ({daysOverdue} days)
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">On Time</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {dueDate.toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleOpenReturnModal(issue)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs flex items-center gap-1.5 hover:bg-blue-700"
                          >
                            <CheckCircle size={14} /> Return
                          </button>
                          <button
                            onClick={() => { setSelectedIssue(issue); setShowViewModal(true); }}
                            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Process Book Return</h3>
              <button onClick={() => setShowReturnModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm">
                You are returning <strong>{selectedIssue.title}</strong> for{" "}
                <strong>{selectedIssue.student.name}</strong>.
              </p>

              <div className="bg-slate-50 p-4 rounded-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-1">Collect Late Fine</div>
                    <div className="text-xs text-slate-500">
                      ₹{LATE_RATE}/day after 14 days
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApplyFine((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      applyFine ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
                        applyFine ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {applyFine && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Late Fine</label>
                    <div className="font-bold text-lg">₹{fineDetails.lateFine}</div>
                    {fineDetails.lateFine > 0 && (
                      <p className="text-xs text-slate-500">
                        {computeOverdueInfo(selectedIssue.issuedAt).daysOverdue} days overdue
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Fine (optional)
                  </label>
                  <input
                    type="number"
                    value={fineDetails.additionalFine}
                    onChange={(e) => setFineDetails({ ...fineDetails, additionalFine: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Return Notes</label>
                  <textarea
                    value={fineDetails.notes}
                    onChange={(e) => setFineDetails({ ...fineDetails, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Book cover is slightly torn."
                  />
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-lg font-bold">
                    Total Fine to Collect: ₹
                    {(applyFine ? Number(fineDetails.lateFine || 0) : 0) + Number(fineDetails.additionalFine || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 rounded-md border">
                Cancel
              </button>
              <button
                onClick={handleReturnBook}
                disabled={returning}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
              >
                {returning && <Loader2 size={16} className="animate-spin" />}
                {returning ? "Processing..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Issue Details</h3>
              <button onClick={() => setShowViewModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div><strong className="text-slate-500 w-24 inline-block">Student:</strong> {selectedIssue.student.name} ({selectedIssue.student.regNo})</div>
              <div><strong className="text-slate-500 w-24 inline-block">Book:</strong> {selectedIssue.title}</div>
              <div><strong className="text-slate-500 w-24 inline-block">Copy ID:</strong> {selectedIssue.copyId}</div>
              <div><strong className="text-slate-500 w-24 inline-block">Issue Date:</strong> {new Date(selectedIssue.issuedAt).toLocaleDateString("en-IN")}</div>
              <div><strong className="text-slate-500 w-24 inline-block">Due Date:</strong> {computeOverdueInfo(selectedIssue.issuedAt).dueDate.toLocaleDateString("en-IN")}</div>
              <div><strong className="text-slate-500 w-24 inline-block">Issued By:</strong> {selectedIssue.librarian.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeLibrarianTrackReturn;