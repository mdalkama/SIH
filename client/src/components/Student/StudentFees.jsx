import React, { useState } from 'react';
import { CreditCard, Download, Calendar, IndianRupee, ReceiptIndianRupee, AlertCircle, CheckCircle, Clock, FileText, Wallet, Smartphone } from 'lucide-react';

const FeesDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // Mock student data
    const studentData = {
        name: "Rahul Kumar",
        rollNumber: "2021CS001",
        course: "B.Tech Computer Science (AI)",
        semester: "5th Semester",
        academicYear: "2024-25",
        admissionNumber: "ADM2021001"
    };

    // Mock fee structure
    const feeStructure = {
        tuitionFee: 75000,
        developmentFee: 15000,
        libraryFee: 5000,
        laboratoryFee: 8000,
        examFee: 3000,
        hostelFee: 45000,
        messFee: 25000,
        transportFee: 12000,
        miscellaneous: 7000,
        total: 195000
    };

    // Mock current semester fees
    const [currentSemesterFees, setCurrentSemesterFees] = useState([
        {
            id: "SF2024-01",
            type: "Tuition Fee",
            amount: 37500,
            dueDate: "2024-09-15",
            status: "pending",
            description: "Semester 5 Tuition Fee",
            installment: "1st Installment",
            lateFee: 0
        },
        {
            id: "SF2024-02",
            type: "Hostel Fee",
            amount: 22500,
            dueDate: "2024-09-10",
            status: "overdue",
            description: "Semester 5 Hostel Fee",
            installment: "1st Installment",
            lateFee: 500
        },
        {
            id: "SF2024-03",
            type: "Mess Fee",
            amount: 12500,
            dueDate: "2024-09-20",
            status: "pending",
            description: "Semester 5 Mess Fee",
            installment: "1st Installment",
            lateFee: 0
        },
        {
            id: "SF2024-04",
            type: "Development Fee",
            amount: 7500,
            dueDate: "2024-10-01",
            status: "upcoming",
            description: "Semester 5 Development Fee",
            installment: "1st Installment",
            lateFee: 0
        },
        {
            id: "SF2024-05",
            type: "Laboratory Fee",
            amount: 4000,
            dueDate: "2024-10-15",
            status: "upcoming",
            description: "Semester 5 Laboratory Fee",
            installment: "1st Installment",
            lateFee: 0
        }
    ]);

    // Mock payment history
    const paymentHistory = [
        {
            id: "PAY2024-001",
            type: "Tuition Fee",
            amount: 37500,
            paidDate: "2024-08-15",
            method: "Online Banking",
            transactionId: "TXN123456789",
            status: "completed",
            receiptNo: "RCP2024001",
            semester: "4th Semester"
        },
        {
            id: "PAY2024-002",
            type: "Hostel Fee",
            amount: 22500,
            paidDate: "2024-08-12",
            method: "Credit Card",
            transactionId: "TXN123456788",
            status: "completed",
            receiptNo: "RCP2024002",
            semester: "4th Semester"
        },
        {
            id: "PAY2024-003",
            type: "Mess Fee",
            amount: 12500,
            paidDate: "2024-08-10",
            method: "UPI",
            transactionId: "TXN123456787",
            status: "completed",
            receiptNo: "RCP2024003",
            semester: "4th Semester"
        },
        {
            id: "PAY2024-004",
            type: "Development Fee",
            amount: 7500,
            paidDate: "2024-07-20",
            method: "Net Banking",
            transactionId: "TXN123456786",
            status: "completed",
            receiptNo: "RCP2024004",
            semester: "4th Semester"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'completed': return 'text-green-600 bg-green-50 border-green-200';
            case 'paid': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'upcoming': return <Calendar className="w-4 h-4 text-blue-500" />;
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getDaysRemaining = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateTotalPending = () => {
        return currentSemesterFees
            .filter(fee => fee.status === 'pending' || fee.status === 'overdue')
            .reduce((total, fee) => total + fee.amount + fee.lateFee, 0);
    };

    const calculateTotalOverdue = () => {
        return currentSemesterFees
            .filter(fee => fee.status === 'overdue')
            .reduce((total, fee) => total + fee.amount + fee.lateFee, 0);
    };

    const handlePayment = async (fee) => {
        setPaymentProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setCurrentSemesterFees(prevFees =>
                prevFees.map(f =>
                    f.id === fee.id ? { ...f, status: 'paid' } : f
                )
            );

            setPaymentProcessing(false);
            setShowPaymentModal(false);
            setSelectedFee(null);
            alert(`Payment of ₹${fee.amount + fee.lateFee} successful! Transaction ID: TXN${Date.now()}`);
        }, 3000);
    };

    const downloadReceipt = (paymentId, receiptNo) => {
        alert(`Downloading receipt ${receiptNo} for payment ${paymentId}`);
    };

    const renderOverview = () => {
        const totalPending = calculateTotalPending();
        const totalOverdue = calculateTotalOverdue();
        const paidThisSemester = currentSemesterFees
            .filter(fee => fee.status === 'paid')
            .reduce((total, fee) => total + fee.amount, 0);

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-600 text-sm font-medium">Total Overdue</p>
                                <p className="text-2xl font-bold text-red-700">₹{totalOverdue.toLocaleString()}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Total Pending</p>
                                <p className="text-2xl font-bold text-yellow-700">₹{totalPending.toLocaleString()}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Paid This Semester</p>
                                <p className="text-2xl font-bold text-green-700">₹{paidThisSemester.toLocaleString()}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Annual Fee Structure</p>
                                <p className="text-2xl font-bold text-blue-700">₹{feeStructure.total.toLocaleString()}</p>
                            </div>
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Current Semester Fees */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Current Semester Fees ({studentData.semester})</h3>
                    <div className="space-y-4">
                        {currentSemesterFees.map((fee) => {
                            const daysRemaining = getDaysRemaining(fee.dueDate);
                            const totalAmount = fee.amount + fee.lateFee;

                            return (
                                <div key={fee.id} className={`border rounded-lg p-4 ${getStatusColor(fee.status)}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">
                                            {getStatusIcon(fee.status)}
                                            <div className="ml-3">
                                                <h4 className="font-semibold text-gray-900">{fee.type}</h4>
                                                <p className="text-sm text-gray-600">{fee.description} • {fee.installment}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
                                            {fee.lateFee > 0 && (
                                                <p className="text-sm text-red-600">+ ₹{fee.lateFee} late fee</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">Due Date: {fee.dueDate}</p>
                                            {fee.status === 'pending' && (
                                                <p className="text-sm text-blue-600">
                                                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`}
                                                </p>
                                            )}
                                            {fee.status === 'overdue' && (
                                                <p className="text-sm text-red-600">
                                                    {Math.abs(daysRemaining)} days overdue
                                                </p>
                                            )}
                                        </div>

                                        {(fee.status === 'pending' || fee.status === 'overdue') && (
                                            <button
                                                onClick={() => {
                                                    setSelectedFee(fee);
                                                    setShowPaymentModal(true);
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Pay Now
                                            </button>
                                        )}

                                        {fee.status === 'paid' && (
                                            <div className="flex space-x-2">
                                                <span className="text-green-600 font-medium">Paid</span>
                                                <button
                                                    onClick={() => downloadReceipt(fee.id, `RCP${fee.id.slice(-3)}`)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Fee Structure */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Annual Fee Structure ({studentData.academicYear})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(feeStructure).map(([key, value]) => {
                            if (key === 'total') return null;
                            const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                            return (
                                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">{displayName}</span>
                                    <span className="font-semibold text-gray-900">₹{value.toLocaleString()}</span>
                                </div>
                            );
                        })}
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200 md:col-span-2">
                            <span className="font-semibold text-blue-900">Total Annual Fee</span>
                            <span className="text-xl font-bold text-blue-900">₹{feeStructure.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPaymentHistory = () => (
        <div className="space-y-4">
            {paymentHistory.map((payment) => (
                <div key={payment.id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-semibold text-gray-900">{payment.type}</h4>
                            <p className="text-sm text-gray-600">{payment.semester}</p>
                            <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">₹{payment.amount.toLocaleString()}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {payment.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Payment Date</p>
                            <p className="font-medium">{payment.paidDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Payment Method</p>
                            <p className="font-medium">{payment.method}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Receipt No.</p>
                            <p className="font-medium">{payment.receiptNo}</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => downloadReceipt(payment.id, payment.receiptNo)}
                            className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Receipt
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Management</h1>
                            <p className="text-gray-600">
                                {studentData.name} • {studentData.rollNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                                {studentData.course} • {studentData.semester} • {studentData.academicYear}
                            </p>
                        </div>
                        <div className="text-center">
                            <IndianRupee className="w-12 h-12 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Fee Management</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'overview'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <IndianRupee className="w-4 h-4 mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'history'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ReceiptIndianRupee className="w-4 h-4 mr-2" />
                            Payment History
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'history' && renderPaymentHistory()}
                </div>

                {/* Payment Modal */}
                {showPaymentModal && selectedFee && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Payment</h3>

                            <div className="mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <h4 className="font-medium text-gray-900">{selectedFee.type}</h4>
                                    <p className="text-sm text-gray-600">{selectedFee.description}</p>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Amount: ₹{selectedFee.amount.toLocaleString()}</p>
                                        {selectedFee.lateFee > 0 && (
                                            <p className="text-sm text-red-600">Late Fee: ₹{selectedFee.lateFee.toLocaleString()}</p>
                                        )}
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            Total: ₹{(selectedFee.amount + selectedFee.lateFee).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Method
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="card"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                Credit/Debit Card
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="netbanking"
                                                    checked={paymentMethod === 'netbanking'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <Bank className="w-4 h-4 mr-2" />
                                                Net Banking
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="upi"
                                                    checked={paymentMethod === 'upi'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <Smartphone className="w-4 h-4 mr-2" />
                                                UPI
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="wallet"
                                                    checked={paymentMethod === 'wallet'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <Wallet className="w-4 h-4 mr-2" />
                                                Digital Wallet
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handlePayment(selectedFee)}
                                    disabled={paymentProcessing}
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium ${paymentProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {paymentProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Pay ₹{(selectedFee.amount + selectedFee.lateFee).toLocaleString()}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedFee(null);
                                    }}
                                    disabled={paymentProcessing}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeesDashboard;