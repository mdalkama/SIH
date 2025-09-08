import React, { useState, useMemo } from 'react';
import { Search, IndianRupee, Landmark, X, Download, Loader2, Book, ChevronLeft, ChevronRight, Edit } from 'lucide-react';

// --- Mock Data based on your Mongoose Schema ---
const mockStudentPaymentData = {
  _id: "60c72b2f9b1d8c001f8e4c6a",
  registrationNumber: "STU2024001",
  student: {
    _id: "60c72b2f9b1d8c001f8e4c6b",
    name: "Aisha Sharma",
    course: "B.Tech Computer Science",
    currentSemester: "Semester 4",
  },
  fines: [
    { _id: "fine01", reason: "Late library book return", finedBy: "Library Dept", role: "Librarian", status: "unpaid", amount: 250, paidAmount: 0, createdAt: "2024-04-15T10:00:00Z" },
    { _id: "fine02", reason: "Lab equipment damage", finedBy: "CSE Dept", role: "HOD", status: "paid", amount: 1500, paidAmount: 1500, createdAt: "2024-02-20T09:00:00Z" },
    { _id: "fine03", reason: "ID Card Lost", finedBy: "Admin Office", role: "Clerk", status: "unpaid", amount: 500, paidAmount: 0, createdAt: "2024-08-01T11:00:00Z" },
    { _id: "fine04", reason: "Disciplinary Action", finedBy: "Proctor Office", role: "Proctor", status: "paid", amount: 2000, paidAmount: 2000, createdAt: "2023-11-25T15:00:00Z" },
    { _id: "fine05", reason: "Sports Equipment Damage", finedBy: "Sports Dept", role: "Coach", status: "unpaid", amount: 750, paidAmount: 250, createdAt: "2024-09-05T16:00:00Z" },
    { _id: "fine06", reason: "Hostel Rule Violation", finedBy: "Hostel Warden", role: "Warden", status: "unpaid", amount: 1000, paidAmount: 0, createdAt: "2024-09-10T12:00:00Z" },
    { _id: "fine07", reason: "Parking Violation", finedBy: "Security Office", role: "Security", status: "paid", amount: 300, paidAmount: 300, createdAt: "2024-07-20T18:00:00Z" },
  ],
  semesters: [
    { _id: "sem01", semester: "Semester 1", tuitionFee: 60000, examFee: 2000, otherFee: 1500, paid: 63500 },
    { _id: "sem02", semester: "Semester 2", tuitionFee: 60000, examFee: 2000, otherFee: 1500, paid: 63500 },
    { _id: "sem03", semester: "Semester 3", tuitionFee: 65000, examFee: 2500, otherFee: 2000, paid: 50000 },
    { _id: "sem04", semester: "Semester 4", tuitionFee: 65000, examFee: 2500, otherFee: 2000, paid: 0 },
    { _id: "sem05", semester: "Semester 5", tuitionFee: 70000, examFee: 3000, otherFee: 2500, paid: 0 },
    { _id: "sem06", semester: "Semester 6", tuitionFee: 70000, examFee: 3000, otherFee: 2500, paid: 0 },
    { _id: "sem07", semester: "Semester 7", tuitionFee: 75000, examFee: 3500, otherFee: 3000, paid: 0 },
    { _id: "sem08", semester: "Semester 8", tuitionFee: 75000, examFee: 3500, otherFee: 3000, paid: 0 },
  ],
  paymentHistory: [
    { _id: "hist20", date: new Date("2024-09-10T12:05:00Z"), type: "Fine", description: "Parking Violation", amount: 300, method: "online", receiptNo: "RCPT2024F7", status: "paid" },
    { _id: "hist19", date: new Date("2024-09-06T10:00:00Z"), type: "Fine", description: "Partial payment for Sports Equipment Damage", amount: 250, method: "cash", receiptNo: "RCPT2024F5P1", status: "paid" },
    { _id: "hist18", date: new Date("2024-08-10T10:00:00Z"), type: "Semester Fee", description: "Partial payment for Semester 3", amount: 50000, method: "online", receiptNo: "RCPT2024S3P1", status: "paid" },
    { _id: "hist17", date: new Date("2024-02-20T09:00:00Z"), type: "Fine", description: "Lab equipment damage", amount: 1500, method: "online", receiptNo: "RCPT2024F2", status: "paid" },
    { _id: "hist16", date: new Date("2024-01-15T11:30:00Z"), type: "Semester Fee", description: "Full payment for Semester 2", amount: 63500, method: "cheque", receiptNo: "RCPT2024S2F", status: "paid" },
    { _id: "hist15", date: new Date("2023-11-25T15:10:00Z"), type: "Fine", description: "Disciplinary Action", amount: 2000, method: "online", receiptNo: "RCPT2023F4", status: "paid" },
    { _id: "hist14", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F", status: "paid" },
    { _id: "hist13", date: new Date("2023-02-10T10:00:00Z"), type: "Semester Fee", description: "Partial payment for Semester 2", amount: 30000, method: "online", receiptNo: "RCPT2023S2P2", status: "failed" },
    { _id: "hist12", date: new Date("2023-01-20T11:00:00Z"), type: "Semester Fee", description: "Partial payment for Semester 2", amount: 33500, method: "cash", receiptNo: "RCPT2023S2P1", status: "paid" },
    { _id: "hist11", date: new Date("2022-09-01T15:00:00Z"), type: "Fine", description: "Late submission of documents", amount: 100, method: "cash", receiptNo: "RCPT2022F1", status: "paid" },
    { _id: "hist10", date: new Date("2022-08-15T12:30:00Z"), type: "Semester Fee", description: "Partial payment for Semester 1", amount: 40000, method: "online", receiptNo: "RCPT2022S1P2", status: "paid" },
    { _id: "hist09", date: new Date("2022-08-01T09:00:00Z"), type: "Semester Fee", description: "Admission Fee (Part of Sem 1)", amount: 23500, method: "online", receiptNo: "RCPT2022S1P1", status: "paid" },
    { _id: "hist08", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP1", status: "paid" },
    { _id: "hist07", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP2", status: "paid" },
    { _id: "hist06", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP3", status: "paid" },
    { _id: "hist05", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP4", status: "paid" },
    { _id: "hist04", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP5", status: "paid" },
    { _id: "hist03", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP6", status: "paid" },
    { _id: "hist02", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP7", status: "paid" },
    { _id: "hist01", date: new Date("2023-08-05T14:00:00Z"), type: "Semester Fee", description: "Full payment for Semester 1", amount: 63500, method: "cash", receiptNo: "RCPT2023S1F-DUP8", status: "paid" },
  ],
  stats: {
    totalFine: 6300, fineCollected: 4050, finePending: 2250, totalSemester: 580000,
    semesterCollected: 177000, semesterPending: 403000, overallCollected: 181050, overallPending: 405250,
  }
};

const FinanceFeeCollection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('semesters');

  // Table specific states
  const [tableFilter, setTableFilter] = useState('');
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processingPayment, setProcessingPayment] = useState(false);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    setError('');
    setStudentData(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (searchTerm.toLowerCase() === 'stu2024001') {
      setStudentData(mockStudentPaymentData);
    } else {
      setError('No student found with that registration number.');
    }
    setLoading(false);
  };

  const clearStudentSearch = () => {
    setSearchTerm('');
    setStudentData(null);
    setError('');
  };

  const openPaymentModal = (type, data) => {
    setPaymentTarget({ type, data });
    const pendingAmount = type === 'semester'
      ? (data.tuitionFee + data.examFee + data.otherFee) - data.paid
      : data.amount - data.paidAmount;
    setPaymentAmount(pendingAmount);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    if (processingPayment) return;
    setShowPaymentModal(false);
    setPaymentTarget(null);
    setPaymentAmount('');
    setPaymentMethod('online');
  };

  const handleProcessPayment = async () => {
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    setProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Payment processed successfully (mock).");
    setProcessingPayment(false);
    closePaymentModal();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSortBy('default');
    setTableFilter('');
    setCurrentPage(1);
    setRowsPerPage(10);
  };

  // --- Data Processing Logic (Filtering, Sorting, Pagination) ---
  const processedData = useMemo(() => {
    if (!studentData) return { pagedData: [], totalCount: 0, sortedData: [] };

    let sourceData = [];
    if (activeTab === 'semesters') sourceData = studentData.semesters;
    if (activeTab === 'fines') sourceData = studentData.fines;
    if (activeTab === 'history') sourceData = studentData.paymentHistory;

    // 1. Filtering
    const filtered = sourceData.filter(item => {
      const query = tableFilter.toLowerCase();
      if (!query) return true;
      if (activeTab === 'semesters') return item.semester.toLowerCase().includes(query);
      if (activeTab === 'fines') return item.reason.toLowerCase().includes(query);
      if (activeTab === 'history') return item.description.toLowerCase().includes(query) || item.receiptNo.toLowerCase().includes(query) || item.method.toLowerCase().includes(query);
      return true;
    });

    // 2. Sorting
    const sorted = [...filtered].sort((a, b) => {
      if (activeTab === 'semesters') {
        const getPending = s => (s.tuitionFee + s.examFee + s.otherFee) - s.paid;
        if (sortBy === 'pending-desc') return getPending(b) - getPending(a);
        if (sortBy === 'pending-asc') return getPending(a) - getPending(b);
        return (a.semester || "").localeCompare(b.semester || "");
      }
      if (activeTab === 'fines') {
        if (sortBy === 'amount-desc') return (b.amount || 0) - (a.amount || 0);
        if (sortBy === 'amount-asc') return (a.amount || 0) - (b.amount || 0);
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (activeTab === 'history') {
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return (b.amount || 0) - (a.amount || 0);
        if (sortBy === 'amount-asc') return (a.amount || 0) - (b.amount || 0);
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

    // 3. Pagination
    const pagedData = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return { pagedData, totalCount: filtered.length, sortedData: sorted };
  }, [studentData, activeTab, tableFilter, sortBy, currentPage, rowsPerPage]);

  const { pagedData, totalCount, sortedData } = processedData;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Student Registration Number..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && <button type="button" onClick={clearStudentSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
            </div>
            <button type="submit" disabled={loading} className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
              {loading && !studentData ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
            </button>
          </form>
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>

        {loading && !studentData && <div className="text-center py-12 text-gray-600">Loading student data...</div>}

        {studentData && (
          <div>
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">{studentData.student.name}</h2>
                <p className="text-sm text-gray-500">Reg No: {studentData.registrationNumber}</p>
                <p className="text-sm text-gray-500">{studentData.student.course}</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Overall Collected" amount={studentData.stats.overallCollected} color="text-green-600" />
                <StatCard title="Overall Pending" amount={studentData.stats.overallPending} color="text-red-600" />
                <StatCard title="Semester Pending" amount={studentData.stats.semesterPending} color="text-yellow-600" />
                <StatCard title="Fines Pending" amount={studentData.stats.finePending} color="text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <TabButton label="Semester Fees" active={activeTab === 'semesters'} onClick={() => handleTabChange('semesters')} />
                  <TabButton label="Fines" active={activeTab === 'fines'} onClick={() => handleTabChange('fines')} />
                  <TabButton label="Payment History" active={activeTab === 'history'} onClick={() => handleTabChange('history')} />
                </div>
              </div>

              <TableView
                filterValue={tableFilter}
                onFilterChange={setTableFilter}
                filterPlaceholder={
                  activeTab === 'fines' ? 'Search by reason...' :
                    activeTab === 'history' ? 'Search description, receipt...' : 'Search...'
                }
              >
                {activeTab === 'semesters' && <SemesterFeeTable semesters={pagedData} onPay={openPaymentModal} formatCurrency={formatCurrency} currentPage={currentPage} rowsPerPage={rowsPerPage} />}
                {activeTab === 'fines' && <FinesTable fines={pagedData} onPay={openPaymentModal} formatCurrency={formatCurrency} formatDate={formatDate} currentPage={currentPage} rowsPerPage={rowsPerPage} />}
                {activeTab === 'history' && <PaymentHistoryTable history={pagedData} formatCurrency={formatCurrency} formatDate={formatDate} currentPage={currentPage} rowsPerPage={rowsPerPage} />}

                {pagedData.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <p>No records found.</p>
                    {tableFilter && <p className="text-sm">Try adjusting your filter.</p>}
                  </div>
                )}
              </TableView>

              <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setRowsPerPage(size); setCurrentPage(1); }}
                sortedData={sortedData}
                activeTab={activeTab}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && <PaymentModal target={paymentTarget} amount={paymentAmount} method={paymentMethod} onAmountChange={setPaymentAmount} onMethodChange={setPaymentMethod} onClose={closePaymentModal} onConfirm={handleProcessPayment} processing={processingPayment} formatCurrency={formatCurrency} />}
    </div>
  );
};

// --- Child Components ---

const StatCard = ({ title, amount, color }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount)}</p>
  </div>
);

const TabButton = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
    {label}
  </button>
);

const TableView = ({ filterValue, onFilterChange, filterPlaceholder, children }) => (
  <div>
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="relative w-full sm:w-auto sm:flex-grow max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder={filterPlaceholder}
          className="w-full pl-9 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {filterValue && <button onClick={() => onFilterChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
      </div>
    </div>
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">{children}</div>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange, sortedData, activeTab, formatCurrency }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalCount);

  const summaryStats = useMemo(() => {
    if (!sortedData || sortedData.length === 0) return null;
    if (activeTab === 'semesters') {
      const totalPending = sortedData.reduce((sum, s) => sum + ((s.tuitionFee + s.examFee + s.otherFee) - s.paid), 0);
      return { label: 'Total Pending:', value: formatCurrency(totalPending) };
    }
    if (activeTab === 'fines') {
      const totalAmount = sortedData.reduce((sum, f) => sum + f.amount, 0);
      return { label: 'Total Fine Amount:', value: formatCurrency(totalAmount) };
    }
    if (activeTab === 'history') {
      const totalPaid = sortedData.reduce((sum, h) => sum + h.amount, 0);
      return { label: 'Total Paid in History:', value: formatCurrency(totalPaid) };
    }
    return null;
  }, [sortedData, activeTab, formatCurrency]);


  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-md bg-white">
            {[5, 10, 20].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
        {totalCount > 0 && <span>Showing {startItem}-{endItem} of {totalCount} records</span>}
      </div>

      <div className="flex items-center gap-6">
        {summaryStats && (
          <div className="font-semibold">
            <span>{summaryStats.label} </span>
            <span className="text-gray-800">{summaryStats.value}</span>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


const SemesterFeeTable = ({ semesters, onPay, formatCurrency, currentPage, rowsPerPage }) => (
  <table className="w-full min-w-[700px]">
    <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase tracking-wider">
      <tr>
        <th className="p-3 font-semibold w-12 text-center">#</th>
        <th className="p-3 font-semibold">Semester</th>
        <th className="p-3 font-semibold text-right">Total Fee</th>
        <th className="p-3 font-semibold text-right">Amount Paid</th>
        <th className="p-3 font-semibold text-right">Pending</th>
        <th className="p-3 font-semibold text-center">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 text-sm">
      {semesters.map((s, index) => {
        const totalFee = s.tuitionFee + s.examFee + s.otherFee;
        const pending = totalFee - s.paid;
        const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
        return (
          <tr key={s._id} className="hover:bg-gray-50">
            <td className="p-3 text-center text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
            <td className="p-3 text-gray-800 font-medium">{s.semester}</td>
            <td className="p-3 text-right text-gray-600 font-mono">{formatCurrency(totalFee)}</td>
            <td className="p-3 text-right text-green-600 font-semibold font-mono">{formatCurrency(s.paid)}</td>
            <td className="p-3 text-right text-red-600 font-semibold font-mono">{formatCurrency(pending)}</td>
            <td className="p-3 text-center">
              {pending > 0 ? (
                <button onClick={() => onPay('semester', s)} className="text-blue-600 hover:text-blue-800 font-semibold text-xs">Collect Fee</button>
              ) : (
                <span className="text-gray-500 text-xs font-bold">Cleared</span>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const FinesTable = ({ fines, onPay, formatCurrency, formatDate, currentPage, rowsPerPage }) => (
  <table className="w-full min-w-[700px]">
    <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase tracking-wider">
      <tr>
        <th className="p-3 font-semibold w-12 text-center">#</th>
        <th className="p-3 font-semibold">Date</th>
        <th className="p-3 font-semibold">Reason</th>
        <th className="p-3 font-semibold text-right">Amount</th>
        <th className="p-3 font-semibold text-center">Status</th>
        <th className="p-3 font-semibold text-center">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 text-sm">
      {fines.map((f, index) => {
        const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
        return (
          <tr key={f._id} className="hover:bg-gray-50">
            <td className="p-3 text-center text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
            <td className="p-3 text-gray-600">{formatDate(f.createdAt)}</td>
            <td className="p-3 text-gray-800 font-medium">{f.reason}</td>
            <td className="p-3 text-right text-gray-800 font-semibold font-mono">{formatCurrency(f.amount)}</td>
            <td className="p-3 text-center">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${f.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{f.status}</span>
            </td>
            <td className="p-3 text-center">
              {f.status !== 'paid' ? (
                <button onClick={() => onPay('fine', f)} className="text-blue-600 hover:text-blue-800 font-semibold text-xs">Collect Fee</button>
              ) : '--'}
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
);

const PaymentHistoryTable = ({ history, formatCurrency, formatDate, currentPage, rowsPerPage }) => (
  <table className="w-full min-w-[800px]">
    <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase tracking-wider">
      <tr>
        <th className="p-3 font-semibold w-12 text-center">#</th>
        <th className="p-3 font-semibold">Date</th>
        <th className="p-3 font-semibold">Description</th>
        <th className="p-3 font-semibold">Method</th>
        <th className="p-3 font-semibold">Receipt No.</th>
        <th className="p-3 font-semibold text-right">Amount</th>
        <th className="p-3 font-semibold text-center">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 text-sm">
      {history.map((h, index) => {
        const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
        return (
          <tr key={h._id} className="hover:bg-gray-50">
            <td className="p-3 text-center text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
            <td className="p-3 text-gray-600 whitespace-nowrap">{formatDate(h.date)}</td>
            <td className="p-3 text-gray-800 font-medium">{h.description}</td>
            <td className="p-3 text-center">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${h.method === 'online' ? 'bg-blue-100 text-blue-800' :
                  h.method === 'cash' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>{h.method}</span>
            </td>
            <td className="p-3 text-gray-600 font-mono">{h.receiptNo}</td>
            <td className="p-3 text-right text-gray-800 font-semibold font-mono">{formatCurrency(h.amount)}</td>
            <td className="p-3 text-center">
              <button onClick={() => alert(`Downloading receipt ${h.receiptNo}...`)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full" title="Download Receipt">
                <Download size={16} />
              </button>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
);

const PaymentModal = ({ target, amount, method, onAmountChange, onMethodChange, onClose, onConfirm, processing, formatCurrency }) => {
  if (!target) return null;
  const pendingAmount = target.type === 'semester'
    ? (target.data.tuitionFee + target.data.examFee + target.data.otherFee) - target.data.paid
    : target.data.amount - target.data.paidAmount;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Collect Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600">For: <span className="font-semibold text-gray-800">{target.data.semester || target.data.reason}</span></p>
            <p className="text-sm text-gray-600">Pending: <span className="font-semibold text-red-600">{formatCurrency(pendingAmount)}</span></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Method *</label>
            <select value={method} onChange={(e) => onMethodChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={onConfirm} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
            {processing ? <Loader2 size={16} className="animate-spin mr-2" /> : <Landmark size={16} className="mr-2" />}
            {processing ? 'Processing...' : 'Process Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceFeeCollection;

