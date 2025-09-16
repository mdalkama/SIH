import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle, AlertTriangle, Info, X, Eye, ShieldCheck, Edit, Save } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

// --- Helper Components (All defined in this one file) ---
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', processing }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600"><ShieldCheck size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                            <p className="text-sm text-slate-500 mt-2">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 font-semibold">Cancel</button>
                    <button onClick={onConfirm} disabled={processing} className="px-4 py-2 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center min-w-[120px] font-semibold">
                        {processing ? <Loader2 size={18} className="animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Marks Correction Modal (Now inside the same file) ---
const MarksCorrectionModal = ({ isOpen, onClose, studentData, examId, onSuccess }) => {
    const [marks, setMarks] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null); // Local toast for this modal

    useEffect(() => {
        if (studentData && studentData.subjects) {
            const initialMarks = {};
            studentData.subjects.forEach(sub => {
                initialMarks[sub.subjectCode] = {
                    internal: sub.internal || 0,
                    external: sub.external || 0,
                    practical: sub.practical || 0
                };
            });
            setMarks(initialMarks);
        }
    }, [studentData]);

    const handleMarkChange = (subjectCode, field, value) => {
        const numValue = value === '' ? 0 : Math.max(0, parseInt(value, 10));
        setMarks(prev => ({
            ...prev,
            [subjectCode]: { ...prev[subjectCode], [field]: numValue }
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setToast(null);

        const updatedSubjects = studentData.subjects.map(sub => ({
            subjectCode: sub.subjectCode,
            subjectName: sub.subjectName,
            ...marks[sub.subjectCode]
        }));
        
        const payload = {
            subjects: updatedSubjects,
            sgpa: studentData.sgpa,
            overallResult: studentData.overallResult
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${examId}/student/${studentData.studentAcademicId}/marks`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update marks.");
            onSuccess(); // Call parent's success handler
        } catch (error) {
            // Use a local toast inside the modal for immediate feedback
            setToast({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Correct Marks</h2>
                        <p className="text-sm text-slate-500">{studentData.studentName} ({studentData.registrationNumber})</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-4 overflow-y-auto space-y-4">
                    {toast && <div className='mb-2'><Toast {...toast} onClose={() => setToast(null)} /></div>}
                    {studentData.subjects.map(subject => (
                        <div key={subject.subjectCode} className="grid grid-cols-4 items-center gap-4 p-3 border rounded-lg bg-slate-50">
                            <div className="col-span-1">
                                <p className="font-semibold text-slate-700">{subject.subjectName}</p>
                                <p className="text-xs font-mono text-slate-500">{subject.subjectCode}</p>
                            </div>
                            <div className="text-center">
                                <label className="text-xs font-medium text-slate-500">Internal</label>
                                <input type="number" value={marks[subject.subjectCode]?.internal ?? ''} onChange={(e) => handleMarkChange(subject.subjectCode, 'internal', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-center" />
                            </div>
                             <div className="text-center">
                                <label className="text-xs font-medium text-slate-500">External</label>
                                <input type="number" value={marks[subject.subjectCode]?.external ?? ''} onChange={(e) => handleMarkChange(subject.subjectCode, 'external', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-center" />
                            </div>
                             <div className="text-center">
                                <label className="text-xs font-medium text-slate-500">Practical</label>
                                <input type="number" value={marks[subject.subjectCode]?.practical ?? ''} onChange={(e) => handleMarkChange(subject.subjectCode, 'practical', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-center" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-slate-100 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border rounded-lg text-slate-700 hover:bg-slate-200 font-semibold">Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2 disabled:bg-indigo-300">
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ResultsViewerModal with Edit button ---
const ResultsViewerModal = ({ isOpen, onClose, data, onPublish, isProcessing, isPublishing, onEditStudent }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    if (!isOpen) return null;
    const { examDetails, results } = data;
    const handleConfirmPublish = () => { onPublish(examDetails._id, examDetails.examName); setShowConfirm(false); };
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">Review Results: {examDetails.examName}</h2><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button></div>
                <div className="p-4 overflow-y-auto">{isProcessing ? <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" size={32}/></div> : results.length > 0 ? (<table className="w-full text-sm text-left"><thead className="text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-4 py-2 font-semibold">Student Name</th><th className="px-4 py-2 font-semibold">Registration No.</th><th className="px-4 py-2 font-semibold text-center">SGPA</th><th className="px-4 py-2 font-semibold text-center">Overall Result</th><th className="px-4 py-2 font-semibold text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">{results.map(r => (<tr key={r.studentAcademicId}><td className="px-4 py-2 font-medium text-slate-700">{r.studentName}</td><td className="px-4 py-2 font-mono text-slate-600">{r.registrationNumber}</td><td className="px-4 py-2 text-center font-semibold">{r.sgpa.toFixed(2)}</td><td className="px-4 py-2 text-center"><span className={`px-2 py-1 text-xs font-bold rounded-full ${r.overallResult === 'PASS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{r.overallResult}</span></td><td className="px-4 py-2 text-center"><button onClick={() => onEditStudent(r)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Correct Marks"><Edit size={16} /></button></td></tr>))}</tbody></table>) : <p className="text-center text-slate-500 p-8">No results were found for this examination.</p>}</div>
                <div className="p-4 bg-slate-50 border-t flex justify-end"><button onClick={() => setShowConfirm(true)} disabled={isPublishing} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold disabled:bg-emerald-300"><ShieldCheck size={18} /> Publish Results</button></div>
            </div>
            <ConfirmationModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleConfirmPublish} title="Confirm Publication" message={`Are you sure you want to publish the results for ${examDetails.examName}? This action is final and will make the results visible to all registered students.`} confirmText="Yes, Publish" processing={isPublishing} />
        </div>
    );
};


// --- Main Approval Dashboard Component ---
const ExamApprovalDashboard = () => {
    const [pendingExams, setPendingExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExamResults, setSelectedExamResults] = useState(null);
    const [isViewingResults, setIsViewingResults] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, message }]); }, []);

    const fetchPendingExams = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/pending-approval`, { credentials: 'include' });
            if (!response.ok) throw new Error("Failed to fetch exams pending approval.");
            const data = await response.json();
            setPendingExams(data.exams || []);
        } catch (err) { addToast('error', err.message); } finally { setIsLoading(false); }
    }, [addToast]);

    useEffect(() => { fetchPendingExams(); }, [fetchPendingExams]);

    const handleViewResults = async (examId) => {
        setIsViewingResults(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${examId}/results`, { credentials: 'include' });
            if (!response.ok) throw new Error("Failed to fetch exam results.");
            const data = await response.json();
            setSelectedExamResults(data);
        } catch (err) { addToast('error', err.message); } finally { setIsViewingResults(false); }
    };

    const handlePublish = async (examId, examName) => {
        setIsPublishing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${examId}/publish`, { method: 'PUT', credentials: 'include' });
            if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || 'Failed to publish results.'); }
            addToast('success', `Results for "${examName}" have been published!`);
            setSelectedExamResults(null);
            fetchPendingExams();
        } catch (err) { addToast('error', err.message); } finally { setIsPublishing(false); }
    };

    const handleCorrectionSuccess = async () => {
        const currentlyOpenExamId = selectedExamResults.examDetails._id;
        setEditingStudent(null);
        addToast('success', 'Marks have been updated successfully!');
        setIsViewingResults(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${currentlyOpenExamId}/results`, { credentials: 'include' });
            const data = await response.json();
            setSelectedExamResults(data);
        } catch (err) { addToast('error', "Could not refresh the results list."); } finally { setIsViewingResults(false); }
    };

    if (isLoading) { return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>; }

    return (
        <div className="font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b"><h1 className="text-xl font-bold text-slate-800">Exams Pending Final Approval</h1><p className="text-sm text-slate-500 mt-1">Review the processed results and publish them for students.</p></div>
                <div className="divide-y divide-slate-200">{pendingExams.length > 0 ? (pendingExams.map(exam => (<div key={exam._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors"><div><p className="font-semibold text-slate-800">{exam.examName}</p><p className="text-sm text-slate-500 font-mono mt-1">{exam.examId} | Sem {exam.semester}, {exam.year}</p></div><button onClick={() => handleViewResults(exam._id)} disabled={isViewingResults} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm disabled:bg-indigo-300">{isViewingResults ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />} Review Results</button></div>))) : (<div className="p-16 text-center text-slate-500"><h3 className="text-lg font-semibold">No Exams Awaiting Approval</h3><p className="mt-1">All processed results have been published.</p></div>)}</div>
            </div>

            {selectedExamResults && (<ResultsViewerModal isOpen={!!selectedExamResults} onClose={() => setSelectedExamResults(null)} data={selectedExamResults} onPublish={handlePublish} isProcessing={isViewingResults} isPublishing={isPublishing} onEditStudent={(student) => setEditingStudent(student)} />)}
            {editingStudent && (<MarksCorrectionModal isOpen={!!editingStudent} onClose={() => setEditingStudent(null)} studentData={editingStudent} examId={selectedExamResults.examDetails._id} onSuccess={handleCorrectionSuccess} />)}
        </div>
    );
};

export default ExamApprovalDashboard;