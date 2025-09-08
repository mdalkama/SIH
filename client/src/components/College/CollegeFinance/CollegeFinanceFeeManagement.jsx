import React, { useState } from "react";
import {
  Search,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Scale,
  GraduationCap,
  PlusCircle,
  BarChart3,
} from "lucide-react";

const PaymentSystem = () => {
  const [searchRegNo, setSearchRegNo] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    type: "",
    description: "",
    amount: "",
    method: "cash",
  });

  // 🔹 Dummy Payment Data (Detailed)
  const paymentsData = {
    REG001: {
      id: "P001",
      registrationNumber: "REG001",
      studentName: "Rahul Sharma",
      course: "B.Tech Computer Science",
      batch: "2022-2026",
      department: "CSE",
      fatherName: "Amit Sharma",
      phone: "+91-9876543210",
      email: "rahul.sharma@college.edu",
      address: "Sector 15, Noida, UP",

      // 🔸 Fines
      fine: [
        {
          id: 1,
          reason: "Late Library Book",
          finedBy: "Librarian",
          role: "Library Staff",
          status: "unpaid",
          amount: 500,
          paidAmount: 0,
        },
        {
          id: 2,
          reason: "Hostel Late Night Entry",
          finedBy: "Warden",
          role: "Hostel Staff",
          status: "paid",
          amount: 1000,
          paidAmount: 1000,
        },
        {
          id: 3,
          reason: "Parking Violation",
          finedBy: "Security Officer",
          role: "Admin Staff",
          status: "unpaid",
          amount: 300,
          paidAmount: 0,
        },
      ],

      // 🔸 Semester Fees
      semester: [
        {
          id: 6,
          semester: "6th Semester",
          tuitionFee: 50000,
          examFee: 1500,
          otherFee: 2000,
          paid: 20000,
        },
        {
          id: 5,
          semester: "5th Semester",
          tuitionFee: 48000,
          examFee: 1400,
          otherFee: 1800,
          paid: 51200, // Full Paid
        },
        {
          id: 4,
          semester: "4th Semester",
          tuitionFee: 47000,
          examFee: 1400,
          otherFee: 1500,
          paid: 47000, // Partial Paid
        },
        {
          id: 3,
          semester: "3rd Semester",
          tuitionFee: 46000,
          examFee: 1200,
          otherFee: 1500,
          paid: 48700, // Full Paid
        },
      ],

      // 🔸 Payment History
      paymentHistory: [
        {
          id: 1,
          date: "2025-01-15",
          type: "Semester Fee",
          description: "5th Semester Fees",
          amount: 51200,
          method: "online",
          receiptNo: "RCP1001",
          status: "paid",
        },
        {
          id: 2,
          date: "2025-02-01",
          type: "Fine Payment",
          description: "Hostel Late Night Entry",
          amount: 1000,
          method: "cash",
          receiptNo: "RCP1002",
          status: "paid",
        },
        {
          id: 3,
          date: "2024-09-10",
          type: "Semester Fee",
          description: "4th Semester Partial Payment",
          amount: 30000,
          method: "bank transfer",
          receiptNo: "RCP0987",
          status: "paid",
        },
        {
          id: 4,
          date: "2024-03-01",
          type: "Semester Fee",
          description: "3rd Semester Full Payment",
          amount: 48700,
          method: "online",
          receiptNo: "RCP0876",
          status: "paid",
        },
        {
          id: 5,
          date: "2023-11-15",
          type: "Fine Payment",
          description: "Library Late Fee",
          amount: 200,
          method: "cash",
          receiptNo: "RCP0765",
          status: "paid",
        },
      ],
    },
  };


  // 🔹 Search Student
  const handleSearch = () => {
    const payment = paymentsData[searchRegNo.toUpperCase()];
    if (payment) {
      setSelectedPayment({ ...payment }); // clone so we can update
    } else {
      alert("❌ Student not found!");
      setSelectedPayment(null);
    }
  };

  // 🔹 Open Payment Modal
  const openPaymentModal = (type, description, dueAmount) => {
    setPaymentDetails({
      type,
      description,
      amount: dueAmount,
      method: "cash",
    });
    setShowPaymentModal(true);
  };

  // 🔹 Receive Payment Action
  const handleReceivePayment = () => {
    const newPayment = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: paymentDetails.type,
      description: paymentDetails.description,
      amount: Number(paymentDetails.amount),
      method: paymentDetails.method,
      receiptNo: "RCP" + Math.floor(Math.random() * 10000),
      status: "paid",
    };

    setSelectedPayment((prev) => ({
      ...prev,
      paymentHistory: [...prev.paymentHistory, newPayment],
    }));

    setShowPaymentModal(false);
    alert("✅ Payment Received Successfully!");
  };

  // 🔹 Stats Calculation
  const getStats = () => {
    if (!selectedPayment) return null;

    const totalFine = selectedPayment.fine.reduce((sum, f) => sum + f.amount, 0);
    const fineCollected = selectedPayment.fine.reduce(
      (sum, f) => sum + f.paidAmount,
      0
    );

    const totalSemester = selectedPayment.semester.reduce(
      (sum, s) => sum + s.tuitionFee + s.examFee + s.otherFee,
      0
    );
    const semesterCollected = selectedPayment.semester.reduce(
      (sum, s) => sum + s.paid,
      0
    );

    return {
      totalFine,
      fineCollected,
      finePending: totalFine - fineCollected,
      totalSemester,
      semesterCollected,
      semesterPending: totalSemester - semesterCollected,
      overallCollected: fineCollected + semesterCollected,
      overallPending:
        totalFine +
        totalSemester -
        (fineCollected + semesterCollected),
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={searchRegNo}
                onChange={(e) => setSearchRegNo(e.target.value)}
                placeholder="Enter Reg. No (e.g. REG001)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500">Fine Collected</h3>
              <p className="text-xl font-bold text-green-600">₹{stats.fineCollected}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500">Fine Pending</h3>
              <p className="text-xl font-bold text-red-600">₹{stats.finePending}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500">Semester Collected</h3>
              <p className="text-xl font-bold text-green-600">₹{stats.semesterCollected}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500">Semester Pending</h3>
              <p className="text-xl font-bold text-red-600">₹{stats.semesterPending}</p>
            </div>
          </div>
        )}

        {/* Student Section */}
        {selectedPayment && (
          <div className="space-y-6">
            {/* Fines Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-red-600" /> Fines
              </h2>
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Reason</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-right">Paid</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPayment.fine.map((f) => (
                    <tr key={f.id} className="border-t">
                      <td className="px-4 py-2">{f.reason}</td>
                      <td className="px-4 py-2 text-right">₹{f.amount}</td>
                      <td className="px-4 py-2 text-right">₹{f.paidAmount}</td>
                      <td className="px-4 py-2 text-center">
                        {f.status === "unpaid" ? (
                          <button
                            onClick={() =>
                              openPaymentModal("Fine Payment", f.reason, f.amount - f.paidAmount)
                            }
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1"
                          >
                            <PlusCircle className="w-4 h-4" /> Receive
                          </button>
                        ) : (
                          <span className="text-green-600 font-semibold">Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Semester Fees Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Semester Fees
              </h2>
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Semester</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    <th className="px-4 py-2 text-right">Paid</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPayment.semester.map((s) => {
                    const total = s.tuitionFee + s.examFee + s.otherFee;
                    const due = total - s.paid;
                    return (
                      <tr key={s.id} className="border-t">
                        <td className="px-4 py-2">{s.semester}</td>
                        <td className="px-4 py-2 text-right">₹{total}</td>
                        <td className="px-4 py-2 text-right">₹{s.paid}</td>
                        <td className="px-4 py-2 text-right">
                          {due > 0 ? (
                            <button
                              onClick={() =>
                                openPaymentModal("Semester Fee", s.semester, due)
                              }
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1"
                            >
                              <PlusCircle className="w-4 h-4" /> Receive
                            </button>
                          ) : (
                            <span className="text-green-600 font-semibold">Cleared</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Payment History Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" /> Payment History
              </h2>
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-left">Method</th>
                    <th className="px-4 py-2 text-left">Receipt No</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPayment.paymentHistory.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">{p.date}</td>
                      <td className="px-4 py-2">{p.description}</td>
                      <td className="px-4 py-2 text-right">₹{p.amount}</td>
                      <td className="px-4 py-2">{p.method}</td>
                      <td className="px-4 py-2">{p.receiptNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Receive Payment</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Type</label>
                  <input
                    type="text"
                    value={paymentDetails.type}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <input
                    type="text"
                    value={paymentDetails.description}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    value={paymentDetails.amount}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Method</label>
                  <select
                    value={paymentDetails.method}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, method: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReceivePayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSystem;
