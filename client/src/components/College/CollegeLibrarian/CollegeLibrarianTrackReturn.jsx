import React, { useEffect, useState } from "react";
import { Search, Book, CheckCircle, AlertCircle, User, Eye, X, Loader2, BookOpen, History, GraduationCap, Hash } from "lucide-react";

// --- Configuration ---
const BASE = "https://sih-4ptm.onrender.com/api/v1";
const FINES_PREFIX = "/payment"; // Your route for StudentPayment
const LATE_RATE = 5; // ₹ per day

// --- Skeleton Components for New Design ---
const ProfileSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border animate-pulse flex flex-col md:flex-row items-center gap-6">
    <div className="w-24 h-24 rounded-full bg-slate-200"></div>
    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 w-full">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
          <div className="h-5 w-32 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const CollegeLibrarianTrackReturn = () => {
  const [searchRegNo, setSearchRegNo] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [profile, setProfile] = useState(null); // Librarian's profile

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [activeTab, setActiveTab] = useState("issuedBooks");

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [fineDetails, setFineDetails] = useState({ lateFine: 0, additionalFine: 0, notes: "" });
  const [applyFine, setApplyFine] = useState(false);
  const [returning, setReturning] = useState(false);
  const [returnComplete, setReturnComplete] = useState(false);
  const [notification, setNotification] = useState(null);

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  useEffect(() => {
    async function loadLibrarianProfile() {
      try {
        const res = await fetch(`${BASE}/my-profile`, { credentials: "include" });
        const data = await res.json();
        if (res.ok) setProfile(data.user);
        else showNotification(data.message || "Could not load profile.", "error");
      } catch (e) {
        showNotification("An error occurred while loading profile.", "error");
      }
    }
    loadLibrarianProfile();
  }, []);

  const handleSearchStudent = async (e) => {
    if (e) e.preventDefault();
    if (!searchRegNo.trim()) return;

    setLoadingSearch(true);
    setStudentData(null);
    setSearchError(null);
    setActiveTab("issuedBooks"); // Reset to first tab on new search

    try {
      // Using your POST endpoint: /student/issued-books
      const res = await fetch(`${BASE}/library/student/issued-books`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: searchRegNo.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setStudentData(data.data); // This will now work because backend sends a 'data' key
      } else {
        setSearchError(data.message || "An error occurred.");
      }
    } catch (err) {
      setSearchError("A network error occurred. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  function computeOverdueInfo(issuedAt) {
    const issued = new Date(issuedAt);
    const due = new Date(issued);
    due.setDate(due.getDate() + 14);
    const now = new Date();
    const isOverdue = now > due;
    const daysOverdue = isOverdue ? Math.floor((now - due) / (1000 * 60 * 60 * 24)) : 0;
    return { isOverdue, daysOverdue, dueDate: due };
  }

  function handleOpenReturnModal(issue) {
    setSelectedIssue(issue);
    const { isOverdue, daysOverdue } = computeOverdueInfo(issue.issuedAt);
    setFineDetails({
      lateFine: isOverdue ? daysOverdue * LATE_RATE : 0,
      additionalFine: 0,
      notes: "",
    });
    setApplyFine(isOverdue);
    setShowReturnModal(true);
  }

  async function addStudentFineIfNeeded(totalFine) {
    if (!selectedIssue || totalFine <= 0 || !studentData?.profile) return { ok: true };
    const regNo = studentData.profile.registrationNumber;
    const librarianId = profile?._id;
    const role = profile?.role || "librarian";
    const daysOverdue = computeOverdueInfo(selectedIssue.issuedAt).daysOverdue;
    let reason = fineDetails.notes || `Library fine for "${selectedIssue.title}"`;
    if (applyFine && fineDetails.lateFine > 0) {
      reason = `Late return (${daysOverdue} days) for "${selectedIssue.title}"`;
    }

    try {
      const res = await fetch(`${BASE}${FINES_PREFIX}/${encodeURIComponent(regNo)}/fines`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, finedBy: librarianId, role, amount: totalFine, studentId: studentData.profile._id, }),
      });
      const data = await res.json();
      return { ok: res.ok, message: data?.message || "Failed to record fine" };
    } catch (e) {
      return { ok: false, message: "Network error while recording fine" };
    }
  }

  async function handleReturnBook() {
    if (!selectedIssue) return;
    try {
      setReturning(true);
      const totalFine = (applyFine ? Number(fineDetails.lateFine || 0) : 0) + Number(fineDetails.additionalFine || 0);

      const returnRes = await fetch(`${BASE}/library/copies/return`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: selectedIssue.bookId, studentId: studentData.profile._id,
          copyId: selectedIssue.copyId, fine: totalFine, returnNotes: fineDetails.notes || undefined,
        }),
      });
      const returnData = await returnRes.json();
      if (!returnRes.ok) throw new Error(returnData.message || "Return failed");

      if (totalFine > 0) {
        const fineResult = await addStudentFineIfNeeded(totalFine);
        if (!fineResult.ok) { showNotification(`Book returned, but fine record failed: ${fineResult.message}`, "error"); }
      }

      setReturnComplete(true);
      setShowReturnModal(false);
      handleSearchStudent(); // Refresh data for current student
      setTimeout(() => setReturnComplete(false), 2500);
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setReturning(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {notification && (<div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}><CheckCircle size={20} /><span>{notification.message}</span></div>)}
      {returnComplete && (<div className="fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 bg-green-50 text-green-800"><CheckCircle size={20} /><span>Book returned successfully!</span></div>)}

      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Track Student Library Records</h1>
        <p className="text-slate-500 mb-4">Enter a student's registration number to view their issued books and activity.</p>
        <form onSubmit={handleSearchStudent} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchRegNo} onChange={(e) => setSearchRegNo(e.target.value)} placeholder="Enter Registration Number..." className="w-full pl-10 pr-4 py-2.5 text-base border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" disabled={loadingSearch} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2">
            {loadingSearch ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}<span>{loadingSearch ? "Searching..." : "Search"}</span>
          </button>
        </form>
      </div>

      {loadingSearch && <ProfileSkeleton />}
      {searchError && (<div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3"><AlertCircle />{searchError}</div>)}

      {studentData && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col md:flex-row items-center gap-6">
            <img src={studentData.profile.profileImage || `https://api.dicebear.com/6.x/initials/svg?seed=${studentData.profile.name}`} alt="Student" className="w-24 h-24 rounded-full border-4 border-slate-100" />
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 w-full text-left md:text-left">
              <div><div className="text-sm text-slate-500 flex items-center gap-1.5"><User size={14} /> Name</div><div className="font-semibold text-slate-800 text-lg">{studentData.profile.name}</div></div>
              <div><div className="text-sm text-slate-500 flex items-center gap-1.5"><Hash size={14} /> Reg. No.</div><div className="font-semibold text-slate-800 text-lg">{studentData.profile.registrationNumber}</div></div>
              <div><div className="text-sm text-slate-500 flex items-center gap-1.5"><GraduationCap size={14} /> Course</div><div className="font-semibold text-slate-800 text-lg">{studentData.profile.course} - {studentData.profile.branch}</div></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border">
            <div className="flex border-b">
              <button onClick={() => setActiveTab("issuedBooks")} className={`px-6 py-3 font-semibold flex items-center gap-2 ${activeTab === 'issuedBooks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}><BookOpen size={16} /> Issued Books ({studentData.issuedBooks.length})</button>
              <button onClick={() => setActiveTab("activity")} className={`px-6 py-3 font-semibold flex items-center gap-2 ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}><History size={16} /> Activity Log</button>
            </div>

            {activeTab === 'issuedBooks' && (
              <div className="overflow-x-auto">{studentData.issuedBooks.length === 0 ? (<p className="p-6 text-center text-slate-500">This student has no books currently issued.</p>) : (<table className="w-full text-sm">
                <thead className="bg-slate-50"><tr><th className="p-3 text-left">Book Title</th><th className="p-3 text-left">Copy ID</th><th className="p-3 text-left">Due Date</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr></thead>
                <tbody>{studentData.issuedBooks.map(issue => {
                  const { isOverdue, daysOverdue, dueDate } = computeOverdueInfo(issue.issuedAt); return (<tr key={issue.copyId} className="border-t">
                    <td className="p-3 font-medium">{issue.title}</td><td className="p-3 font-mono">{issue.copyId}</td><td className="p-3">{dueDate.toLocaleDateString("en-IN")}</td><td className="p-3">{isOverdue ? (<span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Overdue ({daysOverdue} days)</span>) : (<span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">On Time</span>)}</td>
                    <td className="p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => handleOpenReturnModal(issue)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">Return</button><button onClick={() => { setSelectedIssue(issue); setShowViewModal(true); }} className="p-1 rounded-md text-slate-500 hover:bg-slate-100"><Eye size={16} /></button></div></td>
                  </tr>)
                })}</tbody></table>)}</div>
            )}

            {activeTab === 'activity' && (
              <div className="overflow-x-auto">{!studentData.activity || studentData.activity.length === 0 ? (<p className="p-6 text-center text-slate-500">No library activity found.</p>) : (<table className="w-full text-sm">
                <thead className="bg-slate-50"><tr><th className="p-3 text-left">Date</th><th className="p-3 text-left">Activity</th><th className="p-3 text-left">Book Title</th><th className="p-3 text-left">Fine</th></tr></thead>
                <tbody>{studentData.activity.map((act, i) => (<tr key={i} className="border-t">
                  <td className="p-3">{new Date(act.issuedAt).toLocaleDateString("en-IN")}</td><td className="p-3"><span className={`font-semibold ${act.returnedAt ? 'text-green-600' : 'text-orange-600'}`}>{act.returnedAt ? "Returned" : "Issued"}</span></td>
                  <td className="p-3">{act.bookTitle}</td><td className="p-3">{act.fine > 0 ? `₹${act.fine}` : '-'}</td>
                </tr>))}</tbody></table>)}</div>
            )}
          </div>
        </div>
      )}

      {/* --- Modals --- */}
      {showReturnModal && selectedIssue && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-lg bg-white rounded-lg shadow-lg"><div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="text-lg font-semibold">Process Book Return</h3><button onClick={() => setShowReturnModal(false)} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button></div><div className="p-6 space-y-4"><p className="text-sm">You are returning <strong>{selectedIssue.title}</strong> for <strong>{studentData.profile.name}</strong>.</p><div className="bg-slate-50 p-4 rounded-md space-y-4"><div className="flex items-center justify-between"><div><div className="text-sm font-medium">Collect Late Fine</div><div className="text-xs text-slate-500">₹{LATE_RATE}/day after 14 days</div></div><button type="button" onClick={() => setApplyFine(v => !v)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${applyFine ? "bg-blue-600" : "bg-slate-300"}`}><span className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${applyFine ? "translate-x-6" : "translate-x-1"}`} /></button></div>{applyFine && (<div><label className="block text-sm font-medium">Late Fine</label><div className="font-bold text-lg">₹{fineDetails.lateFine}</div>{fineDetails.lateFine > 0 && (<p className="text-xs text-slate-500">{computeOverdueInfo(selectedIssue.issuedAt).daysOverdue} days overdue</p>)}</div>)}<div><label className="block text-sm font-medium">Additional Fine (optional)</label><input type="number" value={fineDetails.additionalFine} onChange={(e) => setFineDetails({ ...fineDetails, additionalFine: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="e.g., 50" /></div><div><label className="block text-sm font-medium">Return Notes</label><textarea value={fineDetails.notes} onChange={(e) => setFineDetails({ ...fineDetails, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Book cover is slightly torn." /></div><div className="border-t pt-3 mt-3"><p className="text-lg font-bold">Total Fine to Collect: ₹{(applyFine ? Number(fineDetails.lateFine || 0) : 0) + Number(fineDetails.additionalFine || 0)}</p></div></div></div><div className="px-6 py-4 border-t flex justify-end gap-2"><button onClick={() => setShowReturnModal(false)} className="px-4 py-2 rounded-md border">Cancel</button><button onClick={handleReturnBook} disabled={returning} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">{returning && <Loader2 size={16} className="animate-spin" />}{returning ? "Processing..." : "Confirm Return"}</button></div></div></div>)}
      {showViewModal && selectedIssue && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-lg bg-white rounded-lg shadow-lg"><div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="text-lg font-semibold">Issue Details</h3><button onClick={() => setShowViewModal(false)} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button></div><div className="p-6 space-y-4 text-sm"><div><strong className="text-slate-500 w-24 inline-block">Student:</strong> {studentData.profile.name} ({studentData.profile.registrationNumber})</div><div><strong className="text-slate-500 w-24 inline-block">Book:</strong> {selectedIssue.title}</div><div><strong className="text-slate-500 w-24 inline-block">Copy ID:</strong> {selectedIssue.copyId}</div><div><strong className="text-slate-500 w-24 inline-block">Issue Date:</strong> {new Date(selectedIssue.issuedAt).toLocaleDateString("en-IN")}</div><div><strong className="text-slate-500 w-24 inline-block">Due Date:</strong> {computeOverdueInfo(selectedIssue.issuedAt).dueDate.toLocaleDateString("en-IN")}</div></div></div></div>)}
    </div>
  );
};

export default CollegeLibrarianTrackReturn;