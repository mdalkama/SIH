import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertTriangle, CheckCircle, Info, X, ShieldCheck, FileCheck, Calendar } from 'lucide-react';

// --- Helper Components ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => { onClose(); }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> };
    return (<div className={`fixed top-5 right-5 z-[100] flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg bg-white border-l-4 ${type === 'error' ? 'border-rose-500' : 'border-emerald-500'}`} role="alert"><div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">{icons[type]}</div><div className="ml-3 text-sm font-medium text-slate-800">{message}</div><button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8" onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button></div>);
};
const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => { setToasts(prev => prev.filter(t => t.id !== id)); };
    return (<div className="fixed top-6 right-6 z-[100] space-y-3">{toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))}</div>);
};
const Skeleton = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-7 w-56 bg-slate-200 rounded-md"></div>
                <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
        </div>
    </div>
);
const EmptyState = ({ icon: Icon, title, message }) => (
    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
        <Icon className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-medium text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
);
// --- End Helper Components ---


const ExamBodyResultApproval = () => {
    const [examsForApproval, setExamsForApproval] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [publishingId, setPublishingId] = useState(null); // Tracks which exam is being published
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/semester-exam/pending-approval', {
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to fetch exams for approval.');
            setExamsForApproval(result.exams || []);
        } catch (err) {
            setError(err.message);
            addToast('error', err.message);
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePublish = async (examId, examName) => {
        setPublishingId(examId);
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/semester-exam/${examId}/publish`, {
                method: 'PUT',
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to publish results.');
            
            addToast('success', `Results for ${examName} have been published successfully!`);
            
            // Remove the published exam from the list for an immediate UI update
            setExamsForApproval(prev => prev.filter(exam => exam._id !== examId));

        } catch (err) {
            addToast('error', err.message);
        } finally {
            setPublishingId(null);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Result Approval</h1>
                <p className="mt-1 text-slate-600">Review and publish results for examinations that are ready.</p>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Pending Approvals ({examsForApproval.length})</h2>
                </div>
                <div className="divide-y divide-slate-200">
                    {loading ? (
                        [...Array(3)].map((_, i) => <div key={i} className="p-4"><Skeleton /></div>)
                    ) : error ? (
                        <div className="p-10 text-center text-red-600">{error}</div>
                    ) : examsForApproval.length > 0 ? (
                        examsForApproval.map(exam => {
                            const isPublishingThis = publishingId === exam._id;
                            return (
                                <div key={exam._id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">{exam.examName}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5"/>{exam.examId}</span>
                                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5"/>Semester {exam.semester}, {exam.year}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handlePublish(exam._id, exam.examName)}
                                        disabled={isPublishingThis}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-sm disabled:bg-green-300 disabled:cursor-not-allowed"
                                    >
                                        {isPublishingThis ? (
                                            <><Loader2 className="w-4 h-4 animate-spin"/> Publishing...</>
                                        ) : (
                                            <><FileCheck size={16} /> Publish Results</>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyState 
                            icon={CheckCircle} 
                            title="All Clear!" 
                            message="There are no exam results currently pending for approval." 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamBodyResultApproval;