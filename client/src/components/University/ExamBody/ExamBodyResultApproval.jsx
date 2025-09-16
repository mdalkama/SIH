import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle, AlertTriangle, Info, X, Eye, ShieldCheck } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

// --- Helper Components (Aap inko ek common file se bhi import kar sakte ho) ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => { onClose(); }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> };
    return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4" style={{ borderColor: type === 'error' ? '#f43f5e' : type === 'info' ? '#0ea5e9' : '#10b981' }}><div className="flex-shrink-0">{icons[type]}</div><p className="flex-1 text-sm text-slate-700 font-medium">{message}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button></div>);
};
const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return (<div className="fixed top-6 right-6 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
};
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor, processing }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600`}><AlertTriangle size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                            <p className="text-sm text-slate-500 mt-2">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 font-semibold">Cancel</button>
                    <button onClick={onConfirm} disabled={processing} className={`px-4 py-2 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center min-w-[120px] font-semibold`}>
                        {processing ? <Loader2 size={18} className="animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Approval Dashboard Component ---
const ExamApprovalDashboard = () => {
    const [pendingExams, setPendingExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExamResults, setSelectedExamResults] = useState(null);
    const [isViewingResults, setIsViewingResults] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
    }, []);

    // Pending exams (jinka status 'RESULT_PROCESSING' hai) ko fetch karega
    const fetchPendingExams = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/pending-approval`, { credentials: 'include' });
            if (!response.ok) throw new Error("Approval ke liye pending exams fetch nahi kar paaye.");
            const data = await response.json();
            setPendingExams(data.exams || []);
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchPendingExams();
    }, [fetchPendingExams]);

    // "Review Results" button pe click hone par yeh function call hoga
    const handleViewResults = async (examId) => {
        setIsViewingResults(true); // Loader dikhane ke liye
        try {
            // Naye route se results fetch karega
            const response = await fetch(`${API_BASE_URL}/${examId}/results`, { credentials: 'include' });
            if (!response.ok) throw new Error("Exam results fetch nahi kar paaye.");
            const data = await response.json();
            setSelectedExamResults(data); // State mein data set karega, jisse modal khulega
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsViewingResults(false);
        }
    };

    // Modal mein "Publish" button pe click hone par yeh function call hoga
    const handlePublish = async (examId, examName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${examId}/publish`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Results publish nahi ho paaye.');
            }
            addToast('success', `"${examName}" ke results successfully publish ho gaye hain!`);
            setSelectedExamResults(null); // Modal band ho jayega
            fetchPendingExams(); // List refresh ho jayegi
        } catch (err) {
            addToast('error', err.message);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    }

    return (
        <div className="font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-slate-800">Exams Pending Final Approval</h1>
                    <p className="text-sm text-slate-500 mt-1">Processed results ko review karke students ke liye publish karein.</p>
                </div>
                <div>
                    {pendingExams.length > 0 ? (
                        pendingExams.map(exam => (
                            <div key={exam._id} className="p-4 flex justify-between items-center border-b hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-800">{exam.examName}</p>
                                    <p className="text-sm text-slate-500 font-mono mt-1">{exam.examId} | Sem {exam.semester}, {exam.year}</p>
                                </div>
                                <button
                                    onClick={() => handleViewResults(exam._id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm"
                                >
                                    <Eye size={16} /> Review Results
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center text-slate-500">
                            <h3 className="text-lg font-semibold">No Exams Awaiting Approval</h3>
                            <p className="mt-1">Saare processed results publish ho chuke hain.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedExamResults && (
                <ResultsViewerModal
                    isOpen={!!selectedExamResults}
                    onClose={() => setSelectedExamResults(null)}
                    data={selectedExamResults}
                    onPublish={handlePublish}
                    isProcessing={isViewingResults}
                />
            )}
        </div>
    );
};


// Results dekhne ke liye modal
const ResultsViewerModal = ({ isOpen, onClose, data, onPublish, isProcessing }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    
    if (!isOpen) return null;

    const { examDetails, results } = data;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Review Results: {examDetails.examName}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {isProcessing ? <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div> :
                        results.length > 0 ? (
                        <table className="w-full text-sm text-left">
                           <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2">Student Name</th>
                                    <th className="px-4 py-2">Reg. Number</th>
                                    <th className="px-4 py-2 text-center">SGPA</th>
                                    <th className="px-4 py-2 text-center">Overall Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {results.map(r => (
                                    <tr key={r.studentAcademicId}>
                                        <td className="px-4 py-2 font-medium text-slate-700">{r.studentName}</td>
                                        <td className="px-4 py-2 font-mono text-slate-600">{r.registrationNumber}</td>
                                        <td className="px-4 py-2 text-center font-semibold">{r.sgpa.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${r.overallResult === 'PASS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {r.overallResult}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        ) : <p className="text-center text-slate-500 p-8">Is exam ke liye koi results nahi mile.</p>
                    }
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end">
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                    >
                        <ShieldCheck size={18} /> Publish Results
                    </button>
                </div>
            </div>
            <ConfirmationModal 
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                    onPublish(examDetails._id, examDetails.examName);
                    setShowConfirm(false);
                }}
                title="Confirm Publication"
                message={`Kya aap sach mein ${examDetails.examName} ke results publish karna chahte hain? Iske baad results students ko dikhne lagenge.`}
                confirmText="Yes, Publish"
            />
        </div>
    );
};

export default ExamApprovalDashboard;