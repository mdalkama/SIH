import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle, XCircle, Clock, Info, User, Hash, IndianRupee } from 'lucide-react';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="mb-8"><div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div><div className="h-5 w-1/2 bg-slate-200 rounded-md"></div></div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b h-16 bg-slate-100"></div>
            <div className="p-4 space-y-3">
                <div className="h-14 bg-slate-100 rounded-lg"></div>
                <div className="h-14 bg-slate-100 rounded-lg"></div>
                <div className="h-14 bg-slate-100 rounded-lg"></div>
                <div className="h-14 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
    </div>
);

// --- HELPER COMPONENTS ---
const StatusBadge = ({ status }) => {
    const styles = {
        'Pending': 'bg-amber-100 text-amber-800',
        'Approved': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800',
    };
    const Icon = {
        'Pending': Clock,
        'Approved': CheckCircle,
        'Rejected': XCircle,
    };
    const CurrentIcon = Icon[status] || Info;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
            <CurrentIcon size={14} />
            {status}
        </span>
    );
};


// --- MAIN COMPONENT ---
const CollegeFinanceVerifyPayment = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Dummy Data Fetch
    useEffect(() => {
        const dummyData = [
            { id: 1, transactionId: 'PAY_Nf8Kj9Lp2mZcQv', studentName: 'Anjali Sharma', regNo: '2022CSE001', amount: 85000, date: new Date('2024-11-15T10:30:00Z'), status: 'Pending', gateway: 'Razorpay' },
            { id: 2, transactionId: 'PAY_Nf8Lm4Np9kZcRw', studentName: 'Rohan Gupta', regNo: '2022CSE002', amount: 500, date: new Date('2024-11-15T11:05:00Z'), status: 'Pending', gateway: 'PayU' },
            { id: 3, transactionId: 'PAY_Nf7Xy1Op5hZbTy', studentName: 'Priya Singh', regNo: '2021ECE034', amount: 85000, date: new Date('2024-11-14T15:00:00Z'), status: 'Approved', gateway: 'Razorpay' },
            { id: 4, transactionId: 'PAY_Nf6Ab3Qq8rZaUx', studentName: 'Amit Kumar', regNo: '2023MECH101', amount: 2000, date: new Date('2024-11-14T09:45:00Z'), status: 'Approved', gateway: 'Stripe' },
            { id: 5, transactionId: 'PAY_Nf5Wz0Rs2tZbVw', studentName: 'Sunita Devi', regNo: '2022BBA015', amount: 75000, date: new Date('2024-11-13T18:20:00Z'), status: 'Rejected', gateway: 'PayU' },
        ];
        setTimeout(() => {
            setPayments(dummyData);
            setLoading(false);
        }, 1500);
    }, []);

    const handleAction = (id, newStatus) => {
        setActionLoading(true);
        setTimeout(() => {
            setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
            setSelectedPayment(null);
            setActionLoading(false);
        }, 1000);
    };

    const filteredPayments = payments.filter(p =>
        (p.status === statusFilter) &&
        (
            p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Verify Online Payments</h1>
                <p className="mt-1 text-slate-600">Review and reconcile online payments received through payment gateways.</p>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-auto">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Txn ID, Name, Reg No..."
                            className="pl-10 pr-4 py-2 w-full md:w-80 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                        {['Pending', 'Approved', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md ${statusFilter === status ? 'bg-white shadow' : 'text-slate-600'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* List of Payments */}
                    <div className="lg:col-span-1 lg:border-r border-slate-200 max-h-[60vh] overflow-y-auto">
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map(payment => (
                                <div
                                    key={payment.id}
                                    onClick={() => setSelectedPayment(payment)}
                                    className={`p-4 border-b border-slate-200 cursor-pointer ${selectedPayment?.id === payment.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">{payment.studentName}</p>
                                            <p className="text-xs text-slate-500 font-mono">{payment.transactionId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payment.amount)}</p>
                                            <p className="text-xs text-slate-500">{new Date(payment.date).toLocaleDateString('en-GB')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-center text-slate-500">No payments found for this filter.</p>
                        )}
                    </div>

                    {/* Details and Actions */}
                    <div className="lg:col-span-2 p-6">
                        {selectedPayment ? (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-2xl font-bold text-slate-800">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(selectedPayment.amount)}</h3>
                                        <StatusBadge status={selectedPayment.status} />
                                    </div>
                                    <p className="text-sm text-slate-500">Transaction ID: <span className="font-mono">{selectedPayment.transactionId}</span></p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm border-t border-b py-4">
                                    <div className="flex items-center gap-2"><User size={14} className="text-slate-400" /><strong className="text-slate-500">Student:</strong><span className="text-slate-800 font-semibold">{selectedPayment.studentName}</span></div>
                                    <div className="flex items-center gap-2"><Hash size={14} className="text-slate-400" /><strong className="text-slate-500">Reg. No:</strong><span className="text-slate-800 font-semibold">{selectedPayment.regNo}</span></div>
                                    <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /><strong className="text-slate-500">Date:</strong><span className="text-slate-800 font-semibold">{new Date(selectedPayment.date).toLocaleString('en-GB')}</span></div>
                                    <div className="flex items-center gap-2"><IndianRupee size={14} className="text-slate-400" /><strong className="text-slate-500">Gateway:</strong><span className="text-slate-800 font-semibold">{selectedPayment.gateway}</span></div>
                                </div>
                                {selectedPayment.status === 'Pending' && (
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-3">Actions</h4>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => handleAction(selectedPayment.id, 'Approved')}
                                                disabled={actionLoading}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:bg-green-300">
                                                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(selectedPayment.id, 'Rejected')}
                                                disabled={actionLoading}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:bg-red-300">
                                                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 py-20">
                                <Info size={40} className="mx-auto text-slate-300" />
                                <p className="mt-4 font-semibold">Select a payment from the list to view details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeFinanceVerifyPayment;