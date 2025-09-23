import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CreditCard, Download, Calendar, IndianRupee, ReceiptIndianRupee, AlertCircle, CheckCircle, Clock, FileText, Smartphone, Loader2, X, Info, AlertTriangle, Banknote, Building, FileWarning, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';

// --- HELPER COMPONENTS ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const timer = setTimeout(() => { onClose(); }, 4000); return () => clearTimeout(timer); }, [onClose]);
    const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> };
    const borderColors = { success: 'border-emerald-500', error: 'border-rose-500', info: 'border-sky-500' };
    return (<div className={`bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4 ${borderColors[type]}`}><div className="flex-shrink-0 mt-0.5">{icons[type]}</div><p className="flex-1 text-sm text-slate-700 font-medium">{message}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button></div>);
};
const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => { setToasts(prev => prev.filter(t => t.id !== id)); };
    return (<div className="fixed top-6 right-6 z-[100] space-y-3">{toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))}</div>);
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

// --- Child Components ---
const TabButton = ({ label, icon: Icon, active, onClick }) => (
    <button onClick={onClick} className={`flex-shrink-0 flex items-center px-4 sm:px-6 py-3 font-medium text-sm transition-colors ${active ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'}`}>
        <Icon className="w-5 h-5 mr-2" />{label}
    </button>
);
const FeeTable = ({ type, data, onPay }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-slate-500 p-12"><p>No {type.toLowerCase()} records found.</p></div>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-slate-50"><tr><th className="p-3 text-left font-semibold text-slate-600">Details</th><th className="p-3 text-right font-semibold text-slate-600">Total</th><th className="p-3 text-right font-semibold text-slate-600">Paid</th><th className="p-3 text-right font-semibold text-slate-600">Pending</th><th className="p-3 text-center font-semibold text-slate-600">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-200">
                    {data.slice().reverse().map(item => {
                        const total = item.fees !== undefined ? item.fees : item.amount;
                        const paid = item.paid || item.paidAmount || 0;
                        const pending = total - paid;
                        const detail = item.semester ? `Semester ${item.semester}` : item.month || item.reason;
                        return (
                            <tr key={item._id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-800">{detail}</td>
                                <td className="p-4 text-right font-mono">₹{total.toLocaleString('en-IN')}</td>
                                <td className="p-4 text-right font-mono text-emerald-600">₹{paid.toLocaleString('en-IN')}</td>
                                <td className={`p-4 text-right font-mono font-semibold ${pending > 0 ? 'text-rose-600' : 'text-slate-500'}`}>₹{pending.toLocaleString('en-IN')}</td>
                                <td className="p-4 text-center">
                                    {pending > 0 ? <button onClick={() => onPay(item)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition-colors">Pay Now</button> : <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle size={14} /> Paid</span>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
const PaymentHistory = ({ data, onDownload }) => {
    if (!data || data.length === 0) {
        return (<div className="text-center p-12 text-slate-500"><ReceiptIndianRupee className="mx-auto w-16 h-16 text-slate-300" /><h4 className="mt-4 text-lg font-semibold text-slate-700">No Transactions Found</h4><p>Your payment history will appear here once you make a payment.</p></div>);
    }
    return (
        <div className="relative pl-6 py-4">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200" aria-hidden="true"></div>
            <div className="space-y-10">
                {data.slice().reverse().map((payment) => (
                    <div key={payment._id} className="relative">
                        <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white z-10"></div>
                        <div className="ml-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div><p className="font-semibold text-slate-900">{payment.type}</p><p className="text-sm text-slate-500">{payment.description}</p></div>
                                <div className="text-left sm:text-right mt-2 sm:mt-0"><p className="text-xl font-bold text-slate-900">₹{payment.amount.toLocaleString()}</p></div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2"><Calendar size={14} /><span>{new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
                                <div className="flex items-center gap-2">{getPaymentMethodIcon(payment.method)}<span className="capitalize">{payment.method}</span></div>
                                <div className="flex items-center gap-2"><FileText size={14} /><span>{payment.receiptNo}</span></div>
                            </div>
                            <div className="flex justify-end mt-3"><button onClick={() => onDownload(payment.receiptNo)} className="flex items-center px-3 py-1.5 text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-sm font-medium transition-colors"><Download className="w-4 h-4 mr-2" />Download Receipt</button></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- NEW SKELETON COMPONENTS ---
const StatCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
    </div>
);
const HeaderSkeleton = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
                <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
                <div className="h-5 bg-slate-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-56"></div>
            </div>
        </div>
    </div>
);
const TabsSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse">
        <div className="flex border-b border-slate-200 p-2">
            <div className="h-10 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-10 w-32 bg-slate-100 rounded-md ml-2"></div>
            <div className="h-10 w-24 bg-slate-100 rounded-md ml-2"></div>
            <div className="h-10 w-40 bg-slate-100 rounded-md ml-2"></div>
        </div>
        <div className="p-6">
            <div className="h-40 bg-slate-100 rounded-lg"></div>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const FeesDashboard = () => {
    const [activeTab, setActiveTab] = useState('semester');
    const [studentProfile, setStudentProfile] = useState(null);
    const [feeData, setFeeData] = useState({ semesters: [], hostelFees: [], fines: [] });
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const addToast = (type, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, message }]); };

    useEffect(() => {
        if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const profileRes = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', { credentials: 'include' });
            if (!profileRes.ok) throw new Error("Could not fetch profile.");
            const profileData = await profileRes.json();
            const registrationNumber = profileData.user?.registrationNumber;
            if (!registrationNumber) throw new Error("Registration number not found.");
            setStudentProfile(profileData.user);

            const [academicRes, hostelRes] = await Promise.all([
                fetch(`https://sih-4ptm.onrender.com/api/v1/payment/${registrationNumber}`, { credentials: 'include' }),
                fetch(`https://sih-4ptm.onrender.com/api/v1/student-hostel/fees`, { credentials: 'include' })
            ]);

            const academicData = academicRes.ok ? await academicRes.json() : { semesters: [], fines: [], paymentHistory: [] };
            const hostelData = hostelRes.ok ? await hostelRes.json() : { data: [] };
            
            setFeeData({
                semesters: academicData.semesters || [],
                fines: academicData.fines || [],
                hostelFees: hostelData.data.hostelFees || []
            });
            setPaymentHistory(academicData.paymentHistory || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            addToast('error', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllData(); }, [fetchAllData]);

    const handleOpenPaymentModal = (item) => {
        let feeDetails = {};
        if (item.semester) {
            const total = item.fees || 0;
            const paid = item.paid || 0;
            feeDetails = { _id: item._id, _type: 'semester', type: `Semester ${item.semester} Fee`, description: `Academic Fees for Semester ${item.semester}`, pendingAmount: total - paid };
        } else if (item.month) {
             feeDetails = { _id: item._id, _type: 'hostel', type: `Hostel Fee for ${item.month}`, description: `Hostel Fee for ${item.month}`, pendingAmount: item.amount - item.paidAmount };
        } else {
             feeDetails = { _id: item._id, _type: 'fine', type: 'Fine', description: item.reason, pendingAmount: item.amount - item.paidAmount };
        }
        setSelectedFee(feeDetails);
        setShowPaymentModal(true);
    };

    const handlePayment = async (fee) => {
        setPaymentProcessing(true);
        const regNo = studentProfile?.registrationNumber;
        if (!regNo) { addToast('error', 'Student registration number not found.'); setPaymentProcessing(false); return; }
        try {
            const orderRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/payment/${regNo}/create-order`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ type: fee._type, id: fee._id, amount: fee.pendingAmount })
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok || !orderData.order) throw new Error(orderData.message || 'Could not create payment order.');

            const options = {
                key: orderData.key_id, amount: orderData.order.amount,
                name: "Maulana Azad College of Engineering and Technology", currency: "INR", description: `Payment for ${fee.type}`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/payment/verify-payment`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                            body: JSON.stringify(response)
                        });
                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) throw new Error(verifyData.message || 'Payment verification failed.');
                        addToast('success', verifyData.message);
                        setShowPaymentModal(false);
                        fetchAllData();
                    } catch (verifyErr) { addToast('error', verifyErr.message); }
                },
                prefill: { name: studentProfile?.name, email: studentProfile?.email, contact: studentProfile?.phone },
                theme: { color: "#3B82F6" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
            rzp.on('payment.failed', function (response){ addToast('error', `Payment failed: ${response.error.description}`); });
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setPaymentProcessing(false);
        }
    };

    const downloadReceipt = (receiptNo) => {
        addToast('info', `Preparing receipt ${receiptNo}...`);
        const API_DOWNLOAD_URL = `https://sih-4ptm.onrender.com/api/v1/payment/${studentProfile.registrationNumber}/receipt/${receiptNo}`;
        const newTab = window.open('', '_blank');
        newTab.document.write('Generating your receipt, please wait...');
        fetch(API_DOWNLOAD_URL, { credentials: 'include' })
            .then(res => { if (!res.ok) { throw new Error('Receipt download failed.'); } return res.blob(); })
            .then(blob => { const url = window.URL.createObjectURL(blob); newTab.location.href = url; })
            .catch(err => { addToast('error', err.message); newTab.close(); });
    };

    const summaryStats = useMemo(() => {
        if (!feeData) return { totalPending: 0, totalCollected: 0, semesterPending: 0, otherPending: 0 };
        const semesterPending = (feeData.semesters || []).reduce((acc, s) => acc + (s.fees - (s.paid || 0)), 0);
        const semesterCollected = (feeData.semesters || []).reduce((acc, s) => acc + (s.paid || 0), 0);
        const hostelPending = (feeData.hostelFees || []).reduce((acc, h) => acc + (h.amount - (h.paidAmount || 0)), 0);
        const hostelCollected = (feeData.hostelFees || []).reduce((acc, h) => acc + (h.paidAmount || 0), 0);
        const finesPending = (feeData.fines || []).reduce((acc, f) => acc + (f.amount - (f.paidAmount || 0)), 0);
        const finesCollected = (feeData.fines || []).reduce((acc, f) => acc + (f.paidAmount || 0), 0);
        return { totalPending: semesterPending + hostelPending + finesPending, totalCollected: semesterCollected + hostelCollected + finesCollected, semesterPending, otherPending: hostelPending + finesPending };
    }, [feeData]);

    if (error) return <div className="max-w-6xl mx-auto p-4 bg-slate-50"><div className="text-center p-10 bg-white rounded-lg border border-red-200"><AlertCircle className="mx-auto w-12 h-12 text-red-500" /><h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3><p className="text-red-600 mt-1">{error}</p></div></div>;
    
    const renderContent = () => {
        switch (activeTab) {
            case 'semester': return <FeeTable type="Semester Fees" data={feeData.semesters} onPay={handleOpenPaymentModal} isLoading={loading} />;
            case 'hostel': return <FeeTable type="Hostel Fees" data={feeData.hostelFees} onPay={handleOpenPaymentModal} isLoading={loading} />;
            case 'fines': return <FeeTable type="Fines" data={feeData.fines} onPay={handleOpenPaymentModal} isLoading={loading} />;
            case 'history': return <PaymentHistory data={paymentHistory} onDownload={downloadReceipt} isLoading={loading} />;
            default: return null;
        }
    };
    
    return (
        <div className="min-h-screen">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="">
                {loading ? (
                    <div className="space-y-6">
                        <HeaderSkeleton />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </div>
                        <TabsSkeleton />
                    </div>
                ) : (
                    studentProfile && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{studentProfile.name}</h1>
                                    <p className="text-slate-500 mt-1">{studentProfile.registrationNumber}</p>
                                    <p className="text-sm text-slate-500 mt-1">{studentProfile.course?.branch} • Semester {studentProfile.semester}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-rose-50 p-6 rounded-lg border border-rose-200"><div><p className="text-rose-600 text-sm font-medium">Total Pending</p><p className="text-2xl font-bold text-rose-700">₹{summaryStats.totalPending.toLocaleString()}</p></div></div>
                            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200"><div><p className="text-emerald-600 text-sm font-medium">Total Collected</p><p className="text-2xl font-bold text-emerald-700">₹{summaryStats.totalCollected.toLocaleString()}</p></div></div>
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200"><div><p className="text-blue-600 text-sm font-medium">Semester Dues</p><p className="text-2xl font-bold text-blue-700">₹{summaryStats.semesterPending.toLocaleString()}</p></div></div>
                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200"><div><p className="text-yellow-600 text-sm font-medium">Other Dues (Hostel/Fines)</p><p className="text-2xl font-bold text-yellow-700">₹{summaryStats.otherPending.toLocaleString()}</p></div></div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                            <div className="flex border-b border-slate-200 overflow-x-auto">
                                <TabButton label="Semester Fees" icon={Banknote} active={activeTab === 'semester'} onClick={() => setActiveTab('semester')} />
                                <TabButton label="Hostel Fees" icon={Building} active={activeTab === 'hostel'} onClick={() => setActiveTab('hostel')} />
                                <TabButton label="Fines" icon={FileWarning} active={activeTab === 'fines'} onClick={() => setActiveTab('fines')} />
                                <TabButton label="Payment History" icon={ReceiptIndianRupee} active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                            </div>
                            <div className="p-2 sm:p-4">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                    )
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
                                    <p>You will be redirected to a secure checkout to complete this payment.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handlePayment(selectedFee)} disabled={paymentProcessing} className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium ${paymentProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{paymentProcessing ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Processing...</> : <><CreditCard className="w-4 h-4 mr-2" />Proceed to Pay</>}</button>
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