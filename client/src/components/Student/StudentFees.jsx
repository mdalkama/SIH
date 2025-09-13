import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CreditCard, Download, Calendar, IndianRupee, ReceiptIndianRupee, AlertCircle, CheckCircle, Clock, FileText, Wallet, Smartphone, Loader2, X, Info, AlertTriangle, Banknote } from 'lucide-react';

// --- Helper Components ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => { onClose(); }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> };
    const borderColors = { success: 'border-emerald-500', error: 'border-rose-500', info: 'border-sky-500' };
    return (
        <div className={`bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4 ${borderColors[type]}`}>
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            <p className="flex-1 text-sm text-slate-700 font-medium">{message}</p>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
    );
};

const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => { setToasts(prev => prev.filter(t => t.id !== id)); };
    return (<div className="fixed top-6 right-6 z-[100] space-y-3">{toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))}</div>);
};

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
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getPaymentMethodIcon = (method) => {
    const methodLower = (method || '').toLowerCase();
    if (methodLower.includes('card')) return <CreditCard size={14} />;
    if (methodLower.includes('upi')) return <Smartphone size={14} />;
    if (methodLower.includes('net') || methodLower.includes('bank')) return <Banknote size={14} />;
    if (methodLower.includes('cash')) return <Wallet size={14} />;
    if (methodLower.includes('cheque')) return <FileText size={14} />;
    return <IndianRupee size={14} />;
};


// --- MAIN COMPONENT ---
const FeesDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
    };

    useEffect(() => {
        if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const fetchProfileAndPayments = useCallback(async () => {
        if (!paymentData) setLoading(true);
        try {
            const profileResponse = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', { credentials: 'include' });
            if (!profileResponse.ok) throw new Error("Could not fetch your profile. Please log in again.");
            const profileData = await profileResponse.json();
            const registrationNumber = profileData.user?.registrationNumber;
            if (!registrationNumber) throw new Error("Registration number not found in your profile.");

            const API_BASE_URL = `https://sih-4ptm.onrender.com/api/v1/payment/${registrationNumber}`;
            const paymentResponse = await fetch(API_BASE_URL, { credentials: 'include' });
            if (!paymentResponse.ok) {
                const errData = await paymentResponse.json();
                if (paymentResponse.status === 404) {
                    setPaymentData({ student: profileData.user, registrationNumber, fines: [], semesters: [], paymentHistory: [], stats: {} });
                    setError(null);
                    return;
                }
                throw new Error(errData.message || "Failed to fetch payment details.");
            }
            const paymentResult = await paymentResponse.json();
            setPaymentData(paymentResult);
            setError(null);
        } catch (err) {
            setError(err.message);
            addToast('error', err.message);
        } finally {
            setLoading(false);
        }
    }, [paymentData]);

    useEffect(() => {
        fetchProfileAndPayments();
    }, [fetchProfileAndPayments]);

    const pendingFees = useMemo(() => {
        if (!paymentData) return [];
        const pendingSemesters = (paymentData.semesters || []).filter(s => s.paid < (s.tuitionFee + s.examFee + s.otherFee)).map(s => ({ _id: s._id, _type: 'semester', type: `Semester ${s.semester} Fee`, description: `Academic Fees for Semester ${s.semester}`, pendingAmount: (s.tuitionFee + s.examFee + s.otherFee) - s.paid, dueDate: new Date(new Date(s.createdAt).setMonth(new Date(s.createdAt).getMonth() + 2)).toISOString().split('T')[0] }));
        const pendingFines = (paymentData.fines || []).filter(f => f.status === 'unpaid').map(f => ({ _id: f._id, _type: 'fine', type: 'Fine', description: f.reason, pendingAmount: f.amount - f.paidAmount, dueDate: new Date(new Date(f.createdAt).setDate(new Date(f.createdAt).getDate() + 15)).toISOString().split('T')[0] }));
        return [...pendingSemesters, ...pendingFines].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }, [paymentData]);

    const handlePayment = async (fee) => {
        setPaymentProcessing(true);
        const regNo = paymentData?.registrationNumber;
        if (!regNo) {
            addToast('error', 'Student registration number not found.');
            setPaymentProcessing(false);
            return;
        }

        try {
            const orderRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/payment/${regNo}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type: fee._type, id: fee._id, amount: fee.pendingAmount })
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok || !orderData.order) throw new Error(orderData.message || 'Could not create payment order.');

            const options = {
                key: orderData.key_id,
                amount: orderData.order.amount,
                name: "Your College Name",
                description: `Payment for ${fee.type}`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/payment/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify(response)
                        });
                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) throw new Error(verifyData.message || 'Payment verification failed.');
                        
                        addToast('success', verifyData.message);
                        setShowPaymentModal(false);
                        fetchProfileAndPayments();
                    } catch (verifyErr) {
                        addToast('error', verifyErr.message);
                    }
                },
                prefill: {
                    name: paymentData.student?.name,
                    email: paymentData.student?.email,
                    contact: paymentData.student?.phone
                },
                theme: { color: "#3B82F6" }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.open();
            rzp.on('payment.failed', function (response){
                addToast('error', `Payment failed: ${response.error.description}`);
            });
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setPaymentProcessing(false);
        }
    };

    const downloadReceipt = async (receiptNo) => {
        addToast('info', `Preparing receipt ${receiptNo}...`);
        try {
            const API_DOWNLOAD_URL = `https://sih-4ptm.onrender.com/api/v1/payment/${paymentData.registrationNumber}/receipt/${receiptNo}`;
            const response = await fetch(API_DOWNLOAD_URL, { credentials: 'include' });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Could not download receipt.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `receipt-${receiptNo}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            addToast('error', err.message);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
    if (error && !paymentData) return <div className="max-w-6xl mx-auto p-4"><div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertCircle className="mx-auto w-12 h-12 text-red-500" /><h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3><p className="text-red-600 mt-1">{error}</p></div></div>;

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
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-6 text-slate-800">Transaction History</h3>
            <div className="relative pl-6">
                {/* Vertical Timeline Bar */}
                <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200" aria-hidden="true"></div>

                <div className="space-y-10">
                    {paymentData?.paymentHistory && paymentData.paymentHistory.length > 0 ?
                        paymentData.paymentHistory.slice().reverse().map((payment) => (
                            <div key={payment._id} className="relative">
                                {/* Timeline Node */}
                                <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white z-10"></div>
                                
                                <div className="ml-4">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                        <div>
                                            <p className="font-semibold text-slate-900">{payment.type}</p>
                                            <p className="text-sm text-slate-500">{payment.description}</p>
                                        </div>
                                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                                            <p className="text-xl font-bold text-slate-900">₹{payment.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2"><Calendar size={14} /><span>{new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
                                        <div className="flex items-center gap-2">{getPaymentMethodIcon(payment.method)}<span className="capitalize">{payment.method}</span></div>
                                        <div className="flex items-center gap-2"><FileText size={14} /><span>{payment.receiptNo}</span></div>
                                    </div>
                                    <div className="flex justify-end mt-3">
                                        <button onClick={() => downloadReceipt(payment.receiptNo)} className="flex items-center px-3 py-1.5 text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors">
                                            <Download className="w-4 h-4 mr-2" />Download Receipt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : 
                    <div className="text-center p-12 text-slate-500">
                        <ReceiptIndianRupee className="mx-auto w-16 h-16 text-slate-300" />
                        <h4 className="mt-4 text-lg font-semibold text-slate-700">No Transactions Found</h4>
                        <p>Your payment history will appear here once you make a payment.</p>
                    </div>}
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="">
                {paymentData && (
                    <>
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Fees Management</h1>
                                    <p className="text-gray-600 font-semibold">{paymentData.student?.name} • {paymentData.registrationNumber}</p>
                                    <p className="text-sm text-gray-500">{paymentData.student?.course?.branch} • Semester {paymentData.student?.semester}</p>
                                </div>
                                <div className="text-center hidden sm:block"><IndianRupee className="w-12 h-12 text-green-600 mx-auto" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200"><div className="flex border-b border-gray-200"><button onClick={() => setActiveTab('overview')} className={`flex items-center px-6 py-3 font-medium text-sm ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><IndianRupee className="w-4 h-4 mr-2" />Overview</button><button onClick={() => setActiveTab('history')} className={`flex items-center px-6 py-3 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><ReceiptIndianRupee className="w-4 h-4 mr-2" />Payment History</button></div></div>
                        <div>
                            {activeTab === 'overview' && renderOverview()}
                            {activeTab === 'history' && renderPaymentHistory()}
                        </div>
                    </>
                )}
                {showPaymentModal && selectedFee && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Online Payment</h3>
                            <div className="mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900">{selectedFee.type}</h4>
                                    <p className="text-sm text-gray-600">{selectedFee.description}</p>
                                    <div className="mt-2"><p className="text-lg font-bold text-gray-900 mt-1">Total to Pay: ₹{selectedFee.pendingAmount.toLocaleString()}</p></div>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start gap-3">
                                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>You will be redirected to Razorpay's secure checkout to complete this payment.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handlePayment(selectedFee)}
                                    disabled={paymentProcessing}
                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium ${paymentProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {paymentProcessing ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Processing...</> : <><CreditCard className="w-4 h-4 mr-2" />Proceed to Pay ₹{selectedFee.pendingAmount.toLocaleString()}</>}
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