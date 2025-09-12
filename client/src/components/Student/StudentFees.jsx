import React, { useState, useEffect, useMemo } from 'react';
import { CreditCard, Download, Calendar, IndianRupee, ReceiptIndianRupee, AlertCircle, CheckCircle, Clock, FileText, Wallet, Smartphone, Loader2 } from 'lucide-react';

// --- CONFIGURATION ---
// In a real application, you would get this from user context, props, or the URL.
const STUDENT_REG_NO = "23140101001"; // << --- HARDCODED FOR DEMONSTRATION
const API_BASE_URL = `https://sih-4ptm.onrender.com/api/v1/payment/${STUDENT_REG_NO}`;


const FeesDashboard = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('overview');
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // --- DATA FETCHING ---
    const fetchPaymentData = async () => {
        if (!paymentData) setLoading(true); 
        try {
            const response = await fetch(API_BASE_URL, { credentials: 'include' });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to fetch payment details.");
            }
            const data = await response.json();
            setPaymentData(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentData();
    }, []);

    // --- DERIVED STATE & HELPERS ---
    const pendingFees = useMemo(() => {
        if (!paymentData) return [];
        
        const pendingSemesters = (paymentData.semesters || [])
            .filter(s => {
                const totalFee = s.tuitionFee + s.examFee + s.otherFee;
                return s.paid < totalFee;
            })
            .map(s => ({
                _id: s._id,
                _type: 'semester', // Helper to identify the type for payment API
                type: `Semester ${s.semester} Fee`,
                description: `Academic Fees for Semester ${s.semester}`,
                pendingAmount: (s.tuitionFee + s.examFee + s.otherFee) - s.paid,
                // Creating a mock due date for display. For real logic, add a dueDate to your schema.
                dueDate: new Date(new Date(s.createdAt).setMonth(new Date(s.createdAt).getMonth() + 2)).toISOString().split('T')[0],
            }));

        const pendingFines = (paymentData.fines || [])
            .filter(f => f.status === 'unpaid')
            .map(f => ({
                _id: f._id,
                _type: 'fine',
                type: 'Fine',
                description: f.reason,
                pendingAmount: f.amount - f.paidAmount,
                dueDate: new Date(new Date(f.createdAt).setDate(new Date(f.createdAt).getDate() + 15)).toISOString().split('T')[0],
            }));

        return [...pendingSemesters, ...pendingFines];
    }, [paymentData]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'completed': case 'paid': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'completed': case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };
    
    const getDaysRemaining = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        // Reset time part to compare dates only
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // --- ACTION HANDLERS ---
    const handlePayment = async (fee) => {
        setPaymentProcessing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type: fee._type, // 'fine' or 'semester'
                    id: fee._id,
                    amount: fee.pendingAmount,
                    method: paymentMethod,
                    receiptNo: `RCPT-${Date.now()}`,
                    description: fee.description
                })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Payment failed. Please try again.');
            }

            alert(`Payment of ₹${fee.pendingAmount.toLocaleString()} successful!`);
            setShowPaymentModal(false);
            setSelectedFee(null);
            fetchPaymentData(); // Refresh all data to show changes
        } catch (err) {
            alert(`Error: ${err.message}`);
            console.error(err);
        } finally {
            setPaymentProcessing(false);
        }
    };
    
    const downloadReceipt = (receiptNo) => {
        alert(`Downloading receipt ${receiptNo}`);
        // In a real application, you would trigger a file download here.
    };
    
    // --- RENDER STATES ---
    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
    }

    if (error) {
        return <div className="max-w-6xl mx-auto p-4"><div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertCircle className="mx-auto w-12 h-12 text-red-500" /><h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3><p className="text-red-600 mt-1">{error}</p></div></div>;
    }
    
    // --- RENDER FUNCTIONS ---
    const renderOverview = () => {
        const stats = paymentData?.stats || {};
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200"><div><p className="text-red-600 text-sm font-medium">Pending Dues</p><p className="text-2xl font-bold text-red-700">₹{stats.overallPending?.toLocaleString() || 0}</p></div></div>
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200"><div><p className="text-green-600 text-sm font-medium">Total Paid</p><p className="text-2xl font-bold text-green-700">₹{stats.overallCollected?.toLocaleString() || 0}</p></div></div>
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200"><div><p className="text-yellow-600 text-sm font-medium">Pending Fines</p><p className="text-2xl font-bold text-yellow-700">₹{stats.finePending?.toLocaleString() || 0}</p></div></div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200"><div><p className="text-blue-600 text-sm font-medium">Total Sem Fees</p><p className="text-2xl font-bold text-blue-700">₹{stats.totalSemester?.toLocaleString() || 0}</p></div></div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Pending Payments</h3>
                    <div className="space-y-4">
                        {pendingFees.length > 0 ? pendingFees.map((fee) => {
                            const daysRemaining = getDaysRemaining(fee.dueDate);
                            const isOverdue = daysRemaining < 0;
                            const status = isOverdue ? 'overdue' : 'pending';
                            return (
                                <div key={fee._id} className={`border rounded-lg p-4 ${getStatusColor(status)}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">{getStatusIcon(status)}<div className="ml-3"><h4 className="font-semibold text-gray-900">{fee.type}</h4><p className="text-sm text-gray-600">{fee.description}</p></div></div>
                                        <div className="text-right"><p className="text-xl font-bold text-gray-900">₹{fee.pendingAmount.toLocaleString()}</p></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div><p className="text-sm text-gray-600">Due Date: {new Date(fee.dueDate).toLocaleDateString('en-GB')}</p>{isOverdue ? <p className="text-sm text-red-600">{Math.abs(daysRemaining)} days overdue</p> : <p className="text-sm text-blue-600">{daysRemaining} days remaining</p>}</div>
                                        <button onClick={() => { setSelectedFee(fee); setShowPaymentModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Pay Now</button>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-center text-gray-500 py-8">No pending payments. All cleared!</p>}
                    </div>
                </div>
            </div>
        );
    };

    const renderPaymentHistory = () => (
        <div className="space-y-4">
            {paymentData?.paymentHistory && paymentData.paymentHistory.length > 0 ? 
                paymentData.paymentHistory.slice().reverse().map((payment) => (
                <div key={payment._id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start mb-4">
                        <div><h4 className="font-semibold text-gray-900">{payment.type}</h4><p className="text-sm text-gray-600">{payment.description}</p><p className="text-sm text-gray-500">Receipt No: {payment.receiptNo}</p></div>
                        <div className="text-right"><p className="text-xl font-bold text-gray-900">₹{payment.amount.toLocaleString()}</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>{payment.status}</span></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div><p className="text-sm text-gray-600">Payment Date</p><p className="font-medium">{new Date(payment.date).toLocaleDateString('en-GB')}</p></div>
                        <div><p className="text-sm text-gray-600">Payment Method</p><p className="font-medium capitalize">{payment.method}</p></div>
                        <div><p className="text-sm text-gray-600">Status</p><p className="font-medium capitalize">{payment.status}</p></div>
                    </div>
                    <div className="flex justify-end"><button onClick={() => downloadReceipt(payment.receiptNo)} className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"><Download className="w-4 h-4 mr-2" />Download Receipt</button></div>
                </div>
            )) : <p className="text-center text-gray-500 bg-white p-12 rounded-lg border">No payment history found.</p>}
        </div>
    );
    
    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto p-4">
                {paymentData && (
                    <>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Management</h1>
                                    <p className="text-gray-600 font-semibold">{paymentData.student?.name} • {paymentData.registrationNumber}</p>
                                    <p className="text-sm text-gray-500">{paymentData.student?.course?.branch} • Semester {paymentData.student?.currentSemester}</p>
                                </div>
                                <div className="text-center"><IndianRupee className="w-12 h-12 text-green-600 mx-auto mb-2" /><p className="text-sm text-gray-600">Student Portal</p></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm mb-6"><div className="flex border-b border-gray-200"><button onClick={() => setActiveTab('overview')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><IndianRupee className="w-4 h-4 mr-2" />Overview</button><button onClick={() => setActiveTab('history')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><ReceiptIndianRupee className="w-4 h-4 mr-2" />Payment History</button></div></div>
                        
                        <div>
                            {activeTab === 'overview' && renderOverview()}
                            {activeTab === 'history' && renderPaymentHistory()}
                        </div>
                    </>
                )}

                {showPaymentModal && selectedFee && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Payment</h3>
                            <div className="mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <h4 className="font-medium text-gray-900">{selectedFee.type}</h4><p className="text-sm text-gray-600">{selectedFee.description}</p>
                                    <div className="mt-2"><p className="text-lg font-bold text-gray-900 mt-1">Total to Pay: ₹{selectedFee.pendingAmount.toLocaleString()}</p></div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center"><input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /><CreditCard className="w-4 h-4 mr-2" />Online (Card, UPI, NetBanking)</label>
                                        <label className="flex items-center"><input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /><Wallet className="w-4 h-4 mr-2" />Cash</label>
                                        <label className="flex items-center"><input type="radio" name="paymentMethod" value="cheque" checked={paymentMethod === 'cheque'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /><FileText className="w-4 h-4 mr-2" />Cheque</label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handlePayment(selectedFee)} disabled={paymentProcessing} className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium ${paymentProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {paymentProcessing ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Processing...</> : <><CreditCard className="w-4 h-4 mr-2" />Pay ₹{selectedFee.pendingAmount.toLocaleString()}</>}
                                </button>
                                <button onClick={() => { setShowPaymentModal(false); setSelectedFee(null); }} disabled={paymentProcessing} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeesDashboard;