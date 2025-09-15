import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertTriangle, Calendar, BookOpen, Clock, X, Eye, CheckCircle, Info, FileText, UserCheck } from 'lucide-react';

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

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex items-center justify-between"><h2 className="text-xl font-semibold text-gray-900">{title}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const ExamCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
                <div className="h-6 w-32 bg-slate-200 rounded-full mb-3"></div>
                <div className="h-7 w-56 bg-slate-200 rounded-md"></div>
                <div className="h-5 w-32 bg-slate-200 rounded-md mt-2"></div>
            </div>
            <div className="h-10 w-full sm:w-40 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2">
            <div className="h-5 w-40 bg-slate-200 rounded-md"></div>
            <div className="h-5 w-40 bg-slate-200 rounded-md"></div>
        </div>
    </div>
);

// --- Main Component ---
const StudentExam = () => {
    const [exams, setExams] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedExamTimetable, setSelectedExamTimetable] = useState(null);
    const [selectedExamResult, setSelectedExamResult] = useState(null);
    const [isResultLoading, setIsResultLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [examsRes, regsRes] = await Promise.all([
                fetch('https://sih-4ptm.onrender.com/api/v1/exams/my-exams', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/exams/my-registrations', { credentials: 'include' })
            ]);
            
            const examsResult = await examsRes.json();
            if (!examsRes.ok) throw new Error(examsResult.message || 'Failed to fetch exam schedules.');
            setExams(examsResult.exams || []);

            const regsResult = await regsRes.json();
            if (!regsRes.ok) throw new Error(regsResult.message || 'Failed to fetch registrations.');
            setRegistrations(regsResult.registrations || []);

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

    const handleRegister = async (examId, examName) => {
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/student-exams/${examId}/register`, {
                method: 'POST',
                credentials: 'include'
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Registration failed.');
            addToast('success', `Successfully registered for ${examName}.`);
            fetchData();
        } catch (err) {
            addToast('error', err.message);
        }
    };
    
    const handleViewResult = async (exam) => {
        setIsResultLoading(true);
        setSelectedExamResult({ examName: exam.examName, subjects: [] });
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/student-exams/result/${exam.examId}`, {
                credentials: 'include'
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to fetch result.');
            setSelectedExamResult(result.result);
        } catch (err) {
            addToast('error', err.message);
            setSelectedExamResult(null);
        } finally {
            setIsResultLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch(status) {
            case 'OPEN_FOR_REGISTRATION': return { text: 'Registration Open', color: 'bg-green-100 text-green-800' };
            case 'CLOSED': return { text: 'Registration Closed', color: 'bg-red-100 text-red-800' };
            case 'RESULT_PROCESSING': return { text: 'Result Processing', color: 'bg-yellow-100 text-yellow-800' };
            case 'PUBLISHED': return { text: 'Result Published', color: 'bg-indigo-100 text-indigo-800' };
            default: return { text: status.replace(/_/g, ' '), color: 'bg-gray-100 text-gray-800' };
        }
    };

    if (error && exams.length === 0) return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Examinations</h1>
                <p className="mt-1 text-slate-600">View your upcoming exam schedules and timetables.</p>
            </header>

            <div className="space-y-6">
                {loading ? (
                    [...Array(3)].map((_, i) => <ExamCardSkeleton key={i} />)
                ) : exams.length > 0 ? (
                    exams.map(exam => {
                        const statusInfo = getStatusInfo(exam.status);
                        const isRegistered = registrations.some(reg => reg.examId === exam.examId);
                        
                        return (
                            <div key={exam._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                                        <h2 className="text-xl font-bold text-slate-800 mt-2">{exam.examName}</h2>
                                        <p className="text-sm text-slate-500">{exam.examType} • {exam.year}</p>
                                    </div>
                                    <div className="w-full sm:w-auto flex-shrink-0 space-y-2">
                                        {exam.status === 'OPEN_FOR_REGISTRATION' && !isRegistered && (
                                            <button onClick={() => handleRegister(exam._id, exam.examName)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                                                <UserCheck size={16} /> Register Now
                                            </button>
                                        )}
                                        {isRegistered && (
                                            <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                                                <CheckCircle size={16} /> Registered
                                            </div>
                                        )}
                                        {exam.status === 'PUBLISHED' && (
                                             <button onClick={() => handleViewResult(exam)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors">
                                                <FileText size={16} /> View Result
                                            </button>
                                        )}
                                        <button onClick={() => setSelectedExamTimetable(exam)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors">
                                            <Eye size={16} /> View Timetable
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" />Start Date: <strong className="ml-1.5 text-slate-800">{new Date(exam.startDate).toLocaleDateString('en-GB')}</strong></span>
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" />End Date: <strong className="ml-1.5 text-slate-800">{new Date(exam.endDate).toLocaleDateString('en-GB')}</strong></span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                        <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-medium text-slate-800">No Upcoming Exams</h3>
                        <p className="mt-1 text-sm text-slate-500">There are currently no examination schedules available for your course and semester.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={!!selectedExamTimetable} onClose={() => setSelectedExamTimetable(null)} title={`Timetable for ${selectedExamTimetable?.examName}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3 text-left font-semibold text-slate-700">Date</th>
                                <th className="p-3 text-left font-semibold text-slate-700">Session</th>
                                <th className="p-3 text-left font-semibold text-slate-700">Subject</th>
                                <th className="p-3 text-left font-semibold text-slate-700">Code</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {selectedExamTimetable?.timetable.map(subject => (
                                <tr key={subject.subjectCode}>
                                    <td className="p-3 font-medium text-slate-800 whitespace-nowrap">{new Date(subject.examDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                    <td className="p-3 text-slate-600">{subject.session === 'FN' ? 'Forenoon' : 'Afternoon'}</td>
                                    <td className="p-3 text-slate-800">{subject.subjectName}</td>
                                    <td className="p-3 font-mono text-slate-500">{subject.subjectCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
            
            <Modal isOpen={!!selectedExamResult} onClose={() => setSelectedExamResult(null)} title={`Result for ${selectedExamResult?.examName}`}>
                {isResultLoading ? <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div> :
                 selectedExamResult && (
                    <div>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg mb-4">
                            <div className="text-center">
                                <p className="text-sm text-slate-500">SGPA</p>
                                <p className="text-2xl font-bold text-blue-600">{selectedExamResult.sgpa}</p>
                            </div>
                             <div className="text-center">
                                <p className="text-sm text-slate-500">Overall Result</p>
                                <p className={`text-2xl font-bold ${selectedExamResult.overallResult === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>{selectedExamResult.overallResult}</p>
                            </div>
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-2">Subject-wise Marks</h4>
                        <div className="overflow-x-auto">
                             <table className="w-full text-sm">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-3 text-left font-semibold text-slate-700">Subject</th>
                                        <th className="p-3 text-center font-semibold text-slate-700">Internal</th>
                                        <th className="p-3 text-center font-semibold text-slate-700">External</th>
                                        <th className="p-3 text-center font-semibold text-slate-700">Total</th>
                                        <th className="p-3 text-center font-semibold text-slate-700">Grade</th>
                                        <th className="p-3 text-right font-semibold text-slate-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {selectedExamResult.subjects?.map(subject => (
                                        <tr key={subject.subjectCode}>
                                            <td className="p-3"><p className="font-medium text-slate-800">{subject.subjectName}</p><p className="font-mono text-xs text-slate-500">{subject.subjectCode}</p></td>
                                            <td className="p-3 text-center">{subject.internal}</td>
                                            <td className="p-3 text-center">{subject.external}</td>
                                            <td className="p-3 text-center font-bold">{subject.total}</td>
                                            <td className="p-3 text-center font-bold text-blue-600">{subject.grade}</td>
                                            <td className="p-3 text-right"><span className={`font-semibold ${subject.status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>{subject.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 )
                }
            </Modal>
        </div>
    );
};

export default StudentExam;