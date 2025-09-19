import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ShieldCheck, XCircle, FileText, X, Building, Users, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <header className="mb-8">
            <div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-5 w-1/2 bg-slate-200 rounded-md"></div>
        </header>
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
const RejectionModal = ({ isOpen, onClose, onSubmit, processing }) => {
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
                    <button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold">Cancel</button>
                    <button onClick={() => onSubmit(reason)} disabled={processing} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center min-w-[150px]">
                        {processing ? <Loader2 className="animate-spin" size={18} /> : 'Submit Rejection'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MODAL FOR REVIEWING ALLOTMENT PLAN ---
const ReviewModal = ({ isOpen, onClose, onApprove, onReject, allotmentPlan }) => {
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    if (!isOpen) return null;
    const { examDetails, allotmentDetails, registeredStudents } = allotmentPlan;

    const handleApproveClick = async () => {
        setIsActionLoading(true);
        await onApprove(examDetails._id);
        setIsActionLoading(false);
    };

    const handleSubmitRejection = async (reason) => {
        setIsActionLoading(true);
        await onReject(examDetails._id, reason);
        // No need to set loading to false here as the parent component will handle closing the modal
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">Review Seat Allotment Plan</h2><button onClick={onClose}><X size={20} /></button></div>
                    <div className="p-6 overflow-y-auto">
                        <div className="mb-6"><h3 className="font-semibold text-slate-800">{examDetails.examName}</h3><p className="text-sm text-slate-500 font-mono">{examDetails.examId}</p></div>
                        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200"><p className="text-sm font-medium text-blue-800">Total Students</p><p className="text-2xl font-bold text-blue-600">{registeredStudents}</p></div>
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200"><p className="text-sm font-medium text-indigo-800">Total Centers Used</p><p className="text-2xl font-bold text-indigo-600">{allotmentDetails.length}</p></div>
                        </div>
                        <h4 className="font-semibold text-slate-700 mb-3">Center-wise Breakdown</h4>
                        <div className="space-y-3">
                            {allotmentDetails.map(detail => (
                                <div key={detail.centerId} className="p-3 border rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-3"><Building size={16} className="text-slate-500" /><div><p className="font-medium text-slate-800">{detail.centerName}</p><p className="text-xs text-slate-500">Capacity: {detail.capacity}</p></div></div>
                                    <div className="flex items-center gap-2 font-semibold text-slate-700"><Users size={14} />{detail.allottedCount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-lg">
                        <button onClick={() => setShowRejectionModal(true)} disabled={isActionLoading} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:bg-red-300"><XCircle size={16} /> Reject</button>
                        <button onClick={handleApproveClick} disabled={isActionLoading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:bg-green-300">{isActionLoading ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16} />} Approve</button>
                    </div>
                </div>
            </div>
            <RejectionModal isOpen={showRejectionModal} onClose={() => setShowRejectionModal(false)} onSubmit={handleSubmitRejection} processing={isActionLoading}/>
        </>
    );
};


// --- MAIN PARENT COMPONENT ---
const ExamBodySeatAllotmentApproval = () => {
    const [pendingAllotments, setPendingAllotments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAllotmentPlan, setSelectedAllotmentPlan] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const fetchPendingData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/pending-seat-allotment`, { credentials: 'include' });
            if (!response.ok) {
                throw new Error("Failed to fetch pending seat allotment plans.");
            }
            const data = await response.json();
            setPendingAllotments(data.allotments || []);
        } catch (err) {
            setError(err.message);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPendingData(); }, [fetchPendingData]);

    const handleReviewClick = async (exam) => {
        setIsModalLoading(true);
        setSelectedAllotmentPlan({ examDetails: exam, allotmentDetails: [], registeredStudents: exam.registeredStudents });
        
        try {
            // SIMULATE fetching detailed allotment plan
            // REAL API CALL: const response = await fetch(`${API_BASE_URL}/${exam._id}/allotment-details`, {credentials: 'include'});
            // const data = await response.json();
            // setSelectedAllotmentPlan(data.plan);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const detailedPlan = {
                allotmentDetails: [
                    { centerId: 'C1', centerName: 'Main Campus - Block A', capacity: 500, allottedCount: 500 },
                    { centerId: 'C2', centerName: 'Main Campus - Block B', capacity: 500, allottedCount: 500 },
                    { centerId: 'C3', centerName: 'City Campus - Hall 1', capacity: 300, allottedCount: Math.min(250, exam.registeredStudents - 1000) },
                ].filter(d => d.allottedCount > 0)
            };
            
            setSelectedAllotmentPlan(prev => ({ ...prev, ...detailedPlan }));
        } catch (err) {
            alert("Failed to fetch allotment details.");
            setSelectedAllotmentPlan(null);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleApprove = async (examId) => {
        alert(`(Simulated) Approving allotment plan with ID: ${examId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        setPendingAllotments(prev => prev.filter(p => p._id !== examId));
        setSelectedAllotmentPlan(null);
    };

    const handleReject = async (examId, reason) => {
        alert(`(Simulated) Rejecting allotment plan ID: ${examId} for reason: "${reason}"`);
        await new Promise(resolve => setTimeout(resolve, 500));
        setPendingAllotments(prev => prev.filter(p => p._id !== examId));
        setSelectedAllotmentPlan(null);
    };

    if (loading) { return <SkeletonLoader />; }
    
    if (error) { return (<div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertTriangle className="mx-auto w-12 h-12 text-red-500" /><h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3><p className="text-red-600 mt-1">{error}</p></div>); }

    return (
        <div className="font-sans">
            <header className="mb-8"><h1 className="text-3xl font-bold text-slate-900">Seat Allotment Approval</h1><p className="mt-1 text-slate-600">Review and finalize the seating plans submitted by the Examination Cell.</p></header>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Pending Approval Queue ({pendingAllotments.length})</h2></div>
                <div className="divide-y divide-slate-200">
                    {pendingAllotments.length > 0 ? (
                        pendingAllotments.map(allotment => (
                            <div key={allotment._id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                <div><p className="font-semibold text-slate-800">{allotment.examName}</p><p className="text-sm text-slate-500 font-mono mt-1">{allotment.examId} • {allotment.registeredStudents} students</p></div>
                                <button onClick={() => handleReviewClick(allotment)} disabled={isModalLoading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm disabled:bg-indigo-300">
                                    {isModalLoading && selectedAllotmentPlan?.examDetails?._id === allotment._id ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />} 
                                    Review Plan
                                </button>
                            </div>
                        ))
                    ) : (<p className="p-12 text-center text-slate-500">The approval queue is empty. All plans have been processed.</p>)}
                </div>
            </div>
            
            <ReviewModal isOpen={!!selectedAllotmentPlan} onClose={() => setSelectedAllotmentPlan(null)} allotmentPlan={selectedAllotmentPlan} onApprove={handleApprove} onReject={handleReject} />
        </div>
    );
};

export default ExamBodySeatAllotmentApproval;