import React, { useState, useMemo } from 'react';
import { Loader2, Search, X, IndianRupee, ArrowLeft, ShieldCheck, FileText, Banknote } from 'lucide-react';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse mt-8">
        <div className="bg-white rounded-xl border p-6">
            <div className="h-6 w-1/3 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
            <div className="mt-6 border-t pt-6 space-y-3">
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
    </div>
);


// --- REFUND MODAL COMPONENT ---
const RefundModal = ({ isOpen, onClose, onConfirm, transaction, processing }) => {
    const [amount, setAmount] = useState(transaction?.amount || '');
    const [reason, setReason] = useState('');
    const [method, setMethod] = useState('NEFT');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-800">Process Refund</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-slate-500">Original Transaction:</p>
                        <div className="p-3 bg-slate-50 rounded-md mt-1">
                            <p className="font-semibold text-slate-700">{transaction.description}</p>
                            <p className="text-xs text-slate-500">Paid: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(transaction.amount)} on {new Date(transaction.date).toLocaleDateString('en-GB')}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Refund Amount *</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Refund *</label>
                        <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Admission Cancelled" className="w-full p-2 border border-slate-300 rounded-lg"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Refund Method *</label>
                        <select value={method} onChange={e => setMethod(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                            <option>NEFT</option>
                            <option>Cheque</option>
                            <option>Cash</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-100 font-semibold">Cancel</button>
                    <button onClick={() => onConfirm({ amount, reason, method })} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
                        {processing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        Confirm Refund
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CollegeFinanceRefund = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [processingRefund, setProcessingRefund] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setLoading(true); setError(''); setStudentData(null);
        setTimeout(() => {
            if (searchTerm === '2022CSE001') {
                setStudentData({
                    name: 'Anjali Sharma',
                    regNo: '2022CSE001',
                    course: 'B.Tech CSE',
                    totalPaid: 172500,
                    transactions: [
                        { id: 'T1', date: '2022-08-01', description: 'Admission Fee', amount: 25000, receiptNo: 'R2208001' },
                        { id: 'T2', date: '2022-08-15', description: 'Semester 1 Tuition Fee', amount: 60000, receiptNo: 'R2208152' },
                        { id: 'T3', date: '2023-01-10', description: 'Semester 2 Tuition Fee', amount: 60000, receiptNo: 'R2301103' },
                        { id: 'T4', date: '2023-01-12', description: 'Exam Fee - Sem 2', amount: 2500, receiptNo: 'R2301124' },
                        { id: 'T5', date: '2023-04-05', description: 'Library Fine', amount: 500, receiptNo: 'R2304055' },
                    ]
                });
            } else {
                setError('No student found with that registration number.');
            }
            setLoading(false);
        }, 1500);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setStudentData(null);
        setError('');
    };

    const handleInitiateRefund = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };
    
    const handleConfirmRefund = (refundDetails) => {
        setProcessingRefund(true);
        console.log("Processing refund for transaction:", selectedTransaction.id, "Details:", refundDetails);
        setTimeout(() => {
            alert(`Refund of ₹${refundDetails.amount} processed successfully via ${refundDetails.method}.`);
            setProcessingRefund(false);
            setIsModalOpen(false);
            setSelectedTransaction(null);
        }, 2000);
    };

    return (
        <div className="font-sans">

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:flex-grow"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter Student Registration Number..." className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg" />{searchTerm && <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>}</div>
                    <button type="submit" disabled={loading} className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{loading ? <Loader2 size={18} className="animate-spin" /> : 'Search Student'}</button>
                </form>
                {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
            </div>

            {loading && <SkeletonLoader />}

            {studentData && !loading && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{studentData.name}</h2>
                            <p className="text-sm text-slate-500">{studentData.regNo} - {studentData.course}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-500">Total Fees Paid</p>
                            <p className="text-2xl font-bold text-green-600">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(studentData.totalPaid)}</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                                <tr><th className="px-4 py-2 font-semibold">Date</th><th className="px-4 py-2 font-semibold">Description</th><th className="px-4 py-2 font-semibold">Receipt No.</th><th className="px-4 py-2 font-semibold text-right">Amount Paid</th><th className="px-4 py-2 font-semibold text-center">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {studentData.transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td className="px-4 py-2 text-slate-600">{new Date(tx.date).toLocaleDateString('en-GB')}</td>
                                        <td className="px-4 py-2 font-semibold text-slate-700">{tx.description}</td>
                                        <td className="px-4 py-2 font-mono text-slate-500">{tx.receiptNo}</td>
                                        <td className="px-4 py-2 font-semibold text-slate-800 text-right">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button onClick={() => handleInitiateRefund(tx)} className="text-blue-600 hover:underline font-semibold text-xs">Refund</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <RefundModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmRefund}
                transaction={selectedTransaction}
                processing={processingRefund}
            />
        </div>
    );
};

export default CollegeFinanceRefund;