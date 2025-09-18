import React, { useState, useMemo } from 'react';
import { Search, IndianRupee, Landmark, X, Download, Loader2, Book, ChevronLeft, ChevronRight, Edit, PlusCircle } from 'lucide-react';
import { useUser } from '../../../context/UserContext'
import Loading from '../../Loading';

const FinanceFeeCollection = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('semesters');
  console.log(studentData)

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

  // Add Fine Modal State
  const [showAddFineModal, setShowAddFineModal] = useState(false);
  const [processingAddFine, setProcessingAddFine] = useState(false);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setStudentData(null);

    try {
      const response = await fetch(
        `https://sih-4ptm.onrender.com/api/v1/payment/${searchTerm}`,
        {
          method: "GET",
          credentials: "include",  // ✅ send cookies/session
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`, // (agar JWT use ho raha hai to yeh add karo)
          },
        }
      );

      if (response.status === 404) {
        setError('No student found with that registration number.');
        return;
      }

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: 'An error occurred while fetching the data.' }));
        throw new Error(errorResult.message || 'An error occurred while fetching the data.');
      }

      const data = await response.json();
      setStudentData(data);
      console.log("Fetched student data:", data);

    } catch (error) {
      console.error("Failed to fetch payment details:", error);
      setError(error.message || 'Failed to fetch payment details. Please check the network and try again.');
    } finally {
      setLoading(false);
    }
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
    if (!paymentTarget || !studentData) {
      alert("Cannot process payment. Target or student data is missing.");
      return;
    }

    setProcessingPayment(true);

    try {
      const payload = {
        type: paymentTarget.type, // 'fine' or 'semester'
        id: paymentTarget.data._id,
        amount: Number(paymentAmount),
        method: paymentMethod,
        receiptNo: `REC-${Date.now()}`, // Generate a simple unique receipt number
        description: `Payment for ${paymentTarget.data.reason || paymentTarget.data.semester}`
      };

      const response = await fetch(
        `https://sih-4ptm.onrender.com/api/v1/payment/${studentData.registrationNumber}/pay`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: 'An unknown error occurred while processing payment.' }));
        throw new Error(errorResult.message || 'Failed to process payment.');
      }

      // After a successful payment, re-fetch the student data to ensure UI consistency
      const refetchResponse = await fetch(
        `https://sih-4ptm.onrender.com/api/v1/payment/${studentData.registrationNumber}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!refetchResponse.ok) {
        throw new Error("Payment was successful, but failed to refresh student data.");
      }
      const refreshedData = await refetchResponse.json();
      setStudentData(refreshedData);

      alert("Payment processed successfully!");
      closePaymentModal();

    } catch (error) {
      console.error("Error processing payment:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handlers for Add Fine Modal
  const openAddFineModal = () => setShowAddFineModal(true);
  const closeAddFineModal = () => {
    if (processingAddFine) return;
    setShowAddFineModal(false);
  };
  const handleAddFine = async (newFineData) => { // newFineData contains { reason, amount }
    if (!studentData) {
      alert("No student selected.");
      return;
    }

    setProcessingAddFine(true);

    try {
      const currentUserInfo = {
        finedBy: user?.name,
        role: user?.role
      };

      const payload = {
        ...newFineData,
        ...currentUserInfo,
        studentId: studentData?._id,
      };

      const response = await fetch(
        `https://sih-4ptm.onrender.com/api/v1/payment/${studentData.registrationNumber}/fines`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorResult.message || 'Failed to add the fine.');
      }

      // After adding a fine, re-fetch the student data to get the updated list and stats
      const refetchResponse = await fetch(
        `https://sih-4ptm.onrender.com/api/v1/payment/${studentData.registrationNumber}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!refetchResponse.ok) {
        throw new Error("Fine was added, but failed to refresh student data.");
      }
      const refreshedData = await refetchResponse.json();
      setStudentData(refreshedData);

      closeAddFineModal();
    } catch (error) {
      console.error("Error adding fine:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessingAddFine(false);
    }
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
    if (activeTab === 'semesters') sourceData = studentData?.semesters;
    if (activeTab === 'fines') sourceData = studentData?.fines;
    if (activeTab === 'history') sourceData = studentData?.paymentHistory;

    // 1. Filtering
    const filtered = sourceData?.filter(item => {
      const query = tableFilter?.toLowerCase();
      if (!query) return true;
      if (activeTab === 'semesters') return item.semester.toLowerCase().includes(query);
      if (activeTab === 'fines') return item.reason.toLowerCase().includes(query) || item.finedBy.toLowerCase().includes(query);
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
        const getPending = f => f.amount - f.paidAmount;
        if (sortBy === 'pending-desc') return getPending(b) - getPending(a);
        if (sortBy === 'pending-asc') return getPending(a) - getPending(b);
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

  if (loading) return <Loading />;



  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-8">
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
                <h2 className="text-xl font-bold text-gray-800">{studentData?.student?.name || 'Student Details'}</h2>
                <p className="text-sm text-gray-500">Reg No: {studentData?.registrationNumber}</p>
                <p className="text-sm text-gray-500">{studentData?.student?.courseId || 'Course info not available'}</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Overall Collected" amount={studentData?.stats?.overallCollected || 0} color="text-green-600" />
                <StatCard title="Overall Pending" amount={studentData?.stats?.overallPending || 0} color="text-red-600" />
                <StatCard title="Semester Pending" amount={studentData?.stats?.semesterPending || 0} color="text-yellow-600" />
                <StatCard title="Fines Pending" amount={studentData?.stats?.finePending || 0} color="text-orange-600" />
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
                  activeTab === 'fines' ? 'Search by reason, department...' :
                    activeTab === 'history' ? 'Search description, receipt...' : 'Search...'
                }
                activeTab={activeTab}
                onAddFineClick={openAddFineModal}
                sortBy={sortBy}
                onSortChange={setSortBy}
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
      {showAddFineModal && <AddFineModal isOpen={showAddFineModal} onClose={closeAddFineModal} onConfirm={handleAddFine} processing={processingAddFine} />}
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

const sortOptions = {
  semesters: [
    { value: 'default', label: 'Default' },
    { value: 'pending-desc', label: 'Pending (High to Low)' },
    { value: 'pending-asc', label: 'Pending (Low to High)' },
  ],
  fines: [
    { value: 'default', label: 'Newest First' },
    { value: 'pending-desc', label: 'Pending (High to Low)' },
    { value: 'pending-asc', label: 'Pending (Low to High)' },
    { value: 'amount-desc', label: 'Amount (High to Low)' },
    { value: 'amount-asc', label: 'Amount (Low to High)' },
  ],
  history: [
    { value: 'default', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Amount (High to Low)' },
    { value: 'amount-asc', label: 'Amount (Low to High)' },
  ]
};

const TableView = ({ filterValue, onFilterChange, filterPlaceholder, children, activeTab, onAddFineClick, sortBy, onSortChange }) => (
  <div>
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-grow">
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
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm font-medium text-gray-600">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {sortOptions[activeTab].map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      {activeTab === 'fines' && (
        <button
          onClick={onAddFineClick}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <PlusCircle size={16} />
          Add Fine
        </button>
      )}
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
      const totalPending = sortedData.reduce((sum, s) => sum + ((s.fees) - s.paid), 0);
      return { label: 'Total Pending:', value: formatCurrency(totalPending) };
    }
    if (activeTab === 'fines') {
      const totalPending = sortedData.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
      return { label: 'Total Pending Fines:', value: formatCurrency(totalPending) };
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
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight size={16} />
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
        const totalFee = s.fees;
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
                <span className="text-green-700 text-xs font-bold">Cleared</span>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const FinesTable = ({ fines, onPay, formatCurrency, formatDate, currentPage, rowsPerPage }) => (
  <table className="w-full min-w-[800px]">
    <thead className="bg-gray-100 text-left text-xs text-gray-500 uppercase tracking-wider">
      <tr>
        <th className="p-3 font-semibold w-12 text-center">#</th>
        <th className="p-3 font-semibold">Date</th>
        <th className="p-3 font-semibold">Reason</th>
        <th className="p-3 font-semibold">Fined By</th>
        <th className="p-3 font-semibold text-right">Total Amount</th>
        <th className="p-3 font-semibold text-right">Paid Amount</th>
        <th className="p-3 font-semibold text-right">Pending</th>
        <th className="p-3 font-semibold text-center">Status</th>
        <th className="p-3 font-semibold text-center">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 text-sm">
      {fines.map((f, index) => {
        const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
        const pending = f.amount - f.paidAmount;
        let statusLabel = 'Unpaid';
        let statusColor = 'bg-red-100 text-red-800';
        if (pending <= 0) {
          statusLabel = 'Paid';
          statusColor = 'bg-green-100 text-green-800';
        } else if (f.paidAmount > 0) {
          statusLabel = 'Partially Paid';
          statusColor = 'bg-yellow-100 text-yellow-800';
        }
        return (
          <tr key={f._id} className="hover:bg-gray-50">
            <td className="p-3 text-center text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
            <td className="p-3 text-gray-600">{formatDate(f.createdAt)}</td>
            <td className="p-3 text-gray-800 font-medium">{f.reason}</td>
            <td className="p-3 text-gray-600">{f.finedBy}</td>
            <td className="p-3 text-right text-gray-800 font-semibold font-mono">{formatCurrency(f.amount)}</td>
            <td className="p-3 text-right text-green-600 font-mono">{formatCurrency(f.paidAmount)}</td>
            <td className="p-3 text-right text-red-600 font-semibold font-mono">{formatCurrency(pending)}</td>
            <td className="p-3 text-center">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColor}`}>{statusLabel}</span>
            </td>
            <td className="p-3 text-center">
              {pending > 0 ? (
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

const AddFineModal = ({ isOpen, onClose, onConfirm, processing }) => {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    if (!reason || !amount || isNaN(amount) || Number(amount) <= 0) {
      setFormError('Please fill all fields with valid data.');
      return;
    }
    setFormError('');
    onConfirm({ reason, amount: Number(amount) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Add New Fine</h2>
          <button onClick={onClose} disabled={processing} className="text-gray-400 hover:text-gray-600 disabled:opacity-50"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Late submission of assignment" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 500" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancel</button>
          <button onClick={handleSubmit} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
            {processing ? <Loader2 size={16} className="animate-spin mr-2" /> : <PlusCircle size={16} className="mr-2" />}
            {processing ? 'Adding...' : 'Add Fine'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default FinanceFeeCollection;
