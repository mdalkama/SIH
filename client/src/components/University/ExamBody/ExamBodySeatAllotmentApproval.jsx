import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight, ShieldCheck, XCircle, FileText, Check, X, Building, Users } from 'lucide-react';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="mb-8"><div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div><div className="h-5 w-1/2 bg-slate-200 rounded-md"></div></div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b h-16 bg-slate-100"></div>
            <div className="p-4 space-y-4">
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
    </div>
);

// --- MODAL FOR REJECTION REASON ---
const RejectionModal = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800">Reason for Rejection</h3>
                    <p className="text-sm text-slate-500 mt-2">Please provide a brief reason for rejecting this allotment plan. This will be sent to the Exam Cell.</p>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="3" className="w-full mt-4 p-2 border border-slate-300 rounded-md" placeholder="e.g., Center capacity is not optimized..."></textarea>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold">Cancel</button>
                    <button onClick={() => onSubmit(reason)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Submit Rejection</button>
                </div>
            </div>
        </div>
    );
};


// --- MODAL FOR REVIEWING ALLOTMENT PLAN ---
const ReviewModal = ({ isOpen, onClose, onApprove, onReject, allotment }) => {
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    if (!isOpen) return null;

    const handleSubmitRejection = (reason) => {
        onReject(allotment._id, reason);
        setShowRejectionModal(false);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">Review Seat Allotment Plan</h2><button onClick={onClose}><X size={20} /></button></div>
                    <div className="p-6 overflow-y-auto">
                        <div className="mb-6"><h3 className="font-semibold text-slate-800">{allotment.examName}</h3><p className="text-sm text-slate-500 font-mono">{allotment.examId}</p></div>
                        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200"><p className="text-sm font-medium text-blue-800">Total Students</p><p className="text-2xl font-bold text-blue-600">{allotment.registeredStudents}</p></div>
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200"><p className="text-sm font-medium text-indigo-800">Total Centers</p><p className="text-2xl font-bold text-indigo-600">{allotment.allotmentDetails.length}</p></div>
                        </div>
                        <h4 className="font-semibold text-slate-700 mb-3">Center-wise Breakdown</h4>
                        <div className="space-y-3">
                            {allotment.allotmentDetails.map(detail => (
                                <div key={detail.centerId} className="p-3 border rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-3"><Building size={16} className="text-slate-500" /><div><p className="font-medium text-slate-800">{detail.centerName}</p><p className="text-xs text-slate-500">Capacity: {detail.capacity}</p></div></div>
                                    <div className="flex items-center gap-2 font-semibold text-slate-700"><Users size={14} />{detail.allottedCount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-lg">
                        <button onClick={() => setShowRejectionModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"><XCircle size={16} /> Reject</button>
                        <button onClick={() => onApprove(allotment._id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"><ShieldCheck size={16} /> Approve</button>
                    </div>
                </div>
            </div>
            <RejectionModal isOpen={showRejectionModal} onClose={() => setShowRejectionModal(false)} onSubmit={handleSubmitRejection} />
        </>
    );
};


// --- MAIN PARENT COMPONENT ---
const ExamBodySeatAllotmentApproval = () => {
    const [pendingAllotments, setPendingAllotments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAllotment, setSelectedAllotment] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setPendingAllotments([
                { _id: '1', examName: 'B.Tech 4th Sem Regular Exam 2024', examId: 'ENDSEM2024-SEM4', registeredStudents: 1250, submittedBy: 'Exam Cell Dept', submittedOn: new Date(), allotmentDetails: [{centerId: 'C1', centerName: 'Main Campus - Block A', capacity: 500, allottedCount: 500}, {centerId: 'C2', centerName: 'Main Campus - Block B', capacity: 500, allottedCount: 500}, {centerId: 'C3', centerName: 'City Campus - Hall 1', capacity: 300, allottedCount: 250}] },
                { _id: '2', examName: 'MBA 2nd Sem Supplementary 2024', examId: 'SUPP2024-SEM2', registeredStudents: 78, submittedBy: 'Exam Cell Dept', submittedOn: new Date(), allotmentDetails: [{centerId: 'C3', centerName: 'City Campus - Hall 1', capacity: 300, allottedCount: 78}] },
            ]);
            setLoading(false);
        }, 1500);
    }, []);

    const handleApprove = (id) => {
        alert(`Approving allotment plan with ID: ${id}`);
        // In a real app, you would make an API call and then update the list
        setPendingAllotments(prev => prev.filter(p => p._id !== id));
        setSelectedAllotment(null);
    };

    const handleReject = (id, reason) => {
        alert(`Rejecting allotment plan ID: ${id} for reason: "${reason}"`);
        // In a real app, you would make an API call and then update the list
        setPendingAllotments(prev => prev.filter(p => p._id !== id));
        setSelectedAllotment(null);
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="font-sans">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">Pending Approval Queue ({pendingAllotments.length})</h2>
                </div>
                <div className="divide-y divide-slate-200">
                    {pendingAllotments.length > 0 ? (
                        pendingAllotments.map(allotment => (
                            <div key={allotment._id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-800">{allotment.examName}</p>
                                    <p className="text-sm text-slate-500 font-mono mt-1">{allotment.examId} • {allotment.registeredStudents} students</p>
                                </div>
                                <button onClick={() => setSelectedAllotment(allotment)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm">
                                    <FileText size={16} /> Review Plan
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="p-12 text-center text-slate-500">The approval queue is empty. All plans have been processed.</p>
                    )}
                </div>
            </div>
            
            <ReviewModal 
                isOpen={!!selectedAllotment}
                onClose={() => setSelectedAllotment(null)}
                allotment={selectedAllotment}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

export default ExamBodySeatAllotmentApproval;