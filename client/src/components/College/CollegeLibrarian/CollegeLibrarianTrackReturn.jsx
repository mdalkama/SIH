import React, { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle, AlertCircle, Eye, X, Loader2 } from "lucide-react";

// --- Configuration ---
const BASE = "https://sih-4ptm.onrender.com/api/v1";
const FINES_PREFIX = "/payment";
const LATE_RATE = 5;

// Helper: currency
const inr = (n = 0) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

// Soft UI tokens
const ui = {
  card: "bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm",
  kpi: "bg-white p-5 rounded-2xl ring-1 ring-slate-200/60",
  tabsBox: "bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden",
  input:
    "w-full pl-10 pr-12 py-3 text-base rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
  head: "bg-slate-50/80 text-slate-600",
  row: "border-t border-slate-100",
  footer:
    "px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100",
  chipOk: "px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full",
  chipWarn: "px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full",
};

// Skeleton
const ProfileSkeleton = () => (
  <div className={`${ui.card} p-6 animate-pulse`}>
    <div className="h-6 w-64 bg-slate-200/70 rounded mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`${ui.kpi} p-5`}>
          <div className="h-4 w-24 bg-slate-200/70 rounded mb-2" />
          <div className="h-6 w-20 bg-slate-200/70 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const CollegeLibrarianTrackReturn = () => {
  const [searchRegNo, setSearchRegNo] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);
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

  // Table controls
  const [filterText, setFilterText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

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
      } catch {
        showNotification("An error occurred while loading profile.", "error");
      }
    }
    loadLibrarianProfile();
  }, []);

  const handleSearchStudent = async (e) => {
    if (e) e.preventDefault();
    if (!searchRegNo.trim()) return;

    setLoadingSearch(true);
    setLoadingStudent(true);
    setStudentData(null);
    setSearchError(null);
    setActiveTab("issuedBooks");
    setFilterText("");
    setSortOrder("newest");
    setPage(1);

    try {
      const res = await fetch(`${BASE}/library/student/issued-books`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: searchRegNo.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStudentData(data.data);
      } else {
        setSearchError(data.message || "An error occurred.");
      }
    } catch {
      setSearchError("A network error occurred. Please try again.");
    } finally {
      setLoadingSearch(false);
      setLoadingStudent(false);
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
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          finedBy: librarianId,
          role,
          amount: totalFine,
          studentId: studentData.profile._id,
        }),
      });
      const data = await res.json();
      return { ok: res.ok, message: data?.message || "Failed to record fine" };
    } catch {
      return { ok: false, message: "Network error while recording fine" };
    }
  }

  async function handleReturnBook() {
    if (!selectedIssue) return;
    try {
      setReturning(true);
      const totalFine =
        (applyFine ? Number(fineDetails.lateFine || 0) : 0) + Number(fineDetails.additionalFine || 0);

      const returnRes = await fetch(`${BASE}/library/copies/return`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: selectedIssue.bookId,
          studentId: studentData.profile._id,
          copyId: selectedIssue.copyId,
          fine: totalFine,
          returnNotes: fineDetails.notes || undefined,
        }),
      });
      const returnData = await returnRes.json();
      if (!returnRes.ok) throw new Error(returnData.message || "Return failed");

      if (totalFine > 0) {
        const fineResult = await addStudentFineIfNeeded(totalFine);
        if (!fineResult.ok) {
          showNotification(`Book returned, but fine record failed: ${fineResult.message}`, "error");
        }
      }

      setReturnComplete(true);
      setShowReturnModal(false);
      handleSearchStudent();
      setTimeout(() => setReturnComplete(false), 2500);
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setReturning(false);
    }
  }

  // KPIs
  const kpis = useMemo(() => {
    const issued = studentData?.issuedBooks || [];
    const activity = studentData?.activity || [];
    const activeIssues = issued.length;
    const overdueCount = issued.filter((ib) => computeOverdueInfo(ib.issuedAt).isOverdue).length;
    const totalIssuedAllTime = activity.filter((a) => a.issuedAt).length;
    const totalFines = activity.reduce((t, a) => t + Number(a.fine || 0), 0);
    return { totalIssuedAllTime, activeIssues, overdueCount, totalFines };
  }, [studentData]);

  // Issued table data
  const issuedRows = useMemo(() => {
    let rows = [...(studentData?.issuedBooks || [])];
    const q = filterText.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) => {
        const t = String(r.title || "").toLowerCase();
        const c = String(r.copyId || "").toLowerCase();
        return t.includes(q) || c.includes(q);
      });
    }
    rows.sort((a, b) => {
      const da = new Date(a.issuedAt).getTime();
      const db = new Date(b.issuedAt).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
    return rows;
  }, [studentData, filterText, sortOrder]);

  // Activity table data
  const activityRows = useMemo(() => {
    let rows = [...(studentData?.activity || [])];
    const q = filterText.trim().toLowerCase();
    if (q) {
      rows = rows.filter((a) => {
        const title = String(a.bookTitle || a.title || "").toLowerCase();
        const id = String(a.bookId || "").toLowerCase();
        const by = String(a?.issuedBy?.name || "").toLowerCase();
        return title.includes(q) || id.includes(q) || by.includes(q);
      });
    }
    rows.sort((a, b) => {
      const da = new Date(a.returnedAt || a.issuedAt || a.createdAt || 0).getTime();
      const db = new Date(b.returnedAt || b.issuedAt || b.createdAt || 0).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
    return rows;
  }, [studentData, filterText, sortOrder]);

  // Pagination logic
  const rows = activeTab === "issuedBooks" ? issuedRows : activityRows;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = rows.slice(start, end);

  return (
    <div className="space-y-6">
      {/* Toasts */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <CheckCircle size={20} />
          <span>{notification.message}</span>
        </div>
      )}
      {returnComplete && (
        <div className="fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 bg-green-50 text-green-800">
          <CheckCircle size={20} />
          <span>Book returned successfully!</span>
        </div>
      )}

      {/* Search */}
      <div className={`${ui.card} p-4 sm:p-5`}>
        <form onSubmit={handleSearchStudent} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchRegNo}
              onChange={(e) => setSearchRegNo(e.target.value)}
              placeholder="Enter Registration Number"
              className={ui.input}
            />
            {searchRegNo && (
              <button
                type="button"
                onClick={() => setSearchRegNo("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loadingSearch}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
          >
            {loadingSearch ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            <span>{loadingSearch ? "Searching..." : "Search"}</span>
          </button>
        </form>
        {searchError && (
          <div className="mt-3 text-red-600 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {searchError}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loadingStudent && <ProfileSkeleton />}

      {/* Student + KPIs */}
      {studentData && !loadingStudent && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className={`${ui.kpi}`}>
            <div className="text-slate-800 font-semibold text-lg">{studentData.profile?.name}</div>
            <div className="text-slate-500 text-sm mt-1">
              Reg No: {studentData.profile?.registrationNumber}
            </div>
            {studentData.profile?._id && (
              <div className="text-slate-400 text-xs mt-1 break-all">{studentData.profile?._id}</div>
            )}
          </div>
          <div className={`${ui.kpi}`}>
            <div className="text-slate-500 text-sm">Total Issued</div>
            <div className="text-green-600 font-semibold text-xl mt-1">{kpis.totalIssuedAllTime}</div>
          </div>
          <div className={`${ui.kpi}`}>
            <div className="text-slate-500 text-sm">Active Issues</div>
            <div className="text-blue-600 font-semibold text-xl mt-1">{kpis.activeIssues}</div>
          </div>
          <div className={`${ui.kpi}`}>
            <div className="text-slate-500 text-sm">Overdue</div>
            <div className="text-red-600 font-semibold text-xl mt-1">{kpis.overdueCount}</div>
          </div>
          <div className={`${ui.kpi}`}>
            <div className="text-slate-500 text-sm">Total Fines</div>
            <div className="text-orange-500 font-semibold text-xl mt-1">{inr(kpis.totalFines)}</div>
          </div>
        </div>
      )}

      {/* Tabs + Table */}
      {studentData && !loadingStudent && (
        <div className={ui.tabsBox}>
          {/* Tabs */}
          <div className="flex items-center gap-2 px-4 sm:px-6 pt-4">
            {[
              { key: "issuedBooks", label: "Issued Books" },
              { key: "activity", label: "Activity Log" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setFilterText("");
                  setPage(1);
                }}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab.key ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="px-4 sm:px-6 pb-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "issuedBooks" ? "Search title, copy ID..." : "Search title, book ID, issued by..."
                  }
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-500">Sort by:</div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="text-sm border border-slate-200 rounded-md px-3 py-2"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table key={`tab-${activeTab}`} className="w-full text-sm">
              <thead className={ui.head}>
                {activeTab === "issuedBooks" ? (
                  <tr>
                    <th className="p-3 text-left w-16">#</th>
                    <th className="p-3 text-left">Book Title</th>
                    <th className="p-3 text-left">Copy ID</th>
                    <th className="p-3 text-left">Issued On</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-3 text-left w-16">#</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Activity</th>
                    <th className="p-3 text-left">Book Title</th>
                    <th className="p-3 text-left">Issued By</th>
                    <th className="p-3 text-left">Fine</th>
                  </tr>
                )}
              </thead>

              <tbody key={`body-${activeTab}`}>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "issuedBooks" ? 7 : 6} className="p-6 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : activeTab === "issuedBooks" ? (
                  pageRows.map((issue, idx) => {
                    const absoluteIndex = start + idx + 1;
                    const { isOverdue, daysOverdue, dueDate } = computeOverdueInfo(issue.issuedAt);
                    const rowKey =
                      issue._id || issue.copyId || `${issue.bookId}-${issue.issuedAt}`;
                    return (
                      <tr key={rowKey} className={ui.row}>
                        <td className="p-3 text-slate-500">{String(absoluteIndex).padStart(2, "0")}</td>
                        <td className="p-3 font-medium">{issue.title}</td>
                        <td className="p-3 font-mono">{issue.copyId}</td>
                        <td className="p-3">
                          {new Date(issue.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="p-3">
                          {new Date(dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="p-3">
                          {isOverdue ? <span className={ui.chipWarn}>Overdue ({daysOverdue} days)</span> : <span className={ui.chipOk}>On Time</span>}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenReturnModal(issue)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">Return</button>
                            <button onClick={() => { setSelectedIssue(issue); setShowViewModal(true); }} className="p-1 rounded-md text-slate-500 hover:bg-slate-100" title="View details"><Eye size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  pageRows.map((act, idx) => {
                    const absoluteIndex = start + idx + 1;
                    const stamp = act.returnedAt || act.issuedAt || act.createdAt;
                    const kind = act.returnedAt ? "Returned" : "Issued";
                    const dateStr = stamp ? new Date(stamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";
                    const title = act.bookName ||  "Unknown Book";
                    const rowKey = act._id || `${act.bookId}-${stamp}`;

                    return (
                      <tr key={rowKey} className={ui.row}>
                        <td className="p-3 text-slate-500">{String(absoluteIndex).padStart(2, "0")}</td>
                        <td className="p-3">{dateStr}</td>
                        <td className="p-3"><span className={`font-semibold ${kind === "Returned" ? "text-green-600" : "text-orange-600"}`}>{kind}</span></td>
                        <td className="p-3">{title}</td>
                        <td className="p-3">{act?.issuedBy?.name || "-"}</td>
                        <td className="p-3">{Number(act.fine) > 0 ? inr(act.fine) : "0"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with Pagination */}
          <div className={ui.footer}>
            <div className="flex items-center gap-2 text-sm">
              <span>Show:</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border border-slate-200 rounded-md px-2 py-1">
                {[5, 10, 20].map((n) => (<option key={n} value={n}>{n}</option>))}
              </select>
              <span className="text-slate-500">
                Showing {rows.length === 0 ? 0 : start + 1}-{Math.min(end, rows.length)} of {rows.length} records
              </span>
            </div>

            {rows.length > pageSize && (
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages} className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showReturnModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg ring-1 ring-slate-200/60">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Process Book Return</h3>
              <button onClick={() => setShowReturnModal(false)} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm">You are returning <strong>{selectedIssue.title}</strong> for <strong>{studentData.profile.name}</strong>.</p>
              <div className="bg-slate-50 p-4 rounded-md space-y-4 ring-1 ring-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Collect Late Fine</div>
                    <div className="text-xs text-slate-500">₹{LATE_RATE}/day after 14 days</div>
                  </div>
                  <button type="button" onClick={() => setApplyFine(v => !v)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${applyFine ? "bg-blue-600" : "bg-slate-300"}`}><span className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${applyFine ? "translate-x-6" : "translate-x-1"}`} /></button>
                </div>
                {applyFine && (
                  <div>
                    <label className="block text-sm font-medium">Late Fine</label>
                    <div className="font-bold text-lg">₹{fineDetails.lateFine}</div>
                    {fineDetails.lateFine > 0 && (<p className="text-xs text-slate-500">{computeOverdueInfo(selectedIssue.issuedAt).daysOverdue} days overdue</p>)}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium">Additional Fine (optional)</label>
                  <input type="number" value={fineDetails.additionalFine} onChange={(e) => setFineDetails({ ...fineDetails, additionalFine: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., 50"/>
                </div>
                <div>
                  <label className="block text-sm font-medium">Return Notes</label>
                  <textarea value={fineDetails.notes} onChange={(e) => setFineDetails({ ...fineDetails, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g., Book cover is slightly torn."/>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <p className="text-lg font-bold">Total Fine to Collect: ₹{(applyFine ? Number(fineDetails.lateFine || 0) : 0) + Number(fineDetails.additionalFine || 0)}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 rounded-md border border-slate-200">Cancel</button>
              <button onClick={handleReturnBook} disabled={returning} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">
                {returning && <Loader2 size={16} className="animate-spin" />}
                {returning ? "Processing..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg ring-1 ring-slate-200/60">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Issue Details</h3>
              <button onClick={() => setShowViewModal(false)} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div><strong className="text-slate-500 w-24 inline-block">Student:</strong> {studentData.profile.name} ({studentData.profile.registrationNumber})</div>
              <div><strong className="text-slate-500 w-24 inline-block">Book:</strong> {selectedIssue.title}</div>
              <div><strong className="text-slate-500 w-24 inline-block">Copy ID:</strong> {selectedIssue.copyId}</div>
              <div><strong className="text-slate-500 w-24 inline-block">Issue Date:</strong> {new Date(selectedIssue.issuedAt).toLocaleDateString("en-IN")}</div>
              <div><strong className="text-slate-500 w-24 inline-block">Due Date:</strong> {computeOverdueInfo(selectedIssue.issuedAt).dueDate.toLocaleDateString("en-IN")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeLibrarianTrackReturn;