import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, ChevronRight, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

// --- Reusable Helper Components ---
// You can move these to a separate file later if you use them elsewhere

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

const FullPageLoader = ({ message = "Loading..." }) => (
    <div className="flex flex-col justify-center items-center h-full bg-white rounded-xl py-20">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="mt-4 text-slate-600">{message}</p>
    </div>
);

// --- Main Component for Results Processing ---
const ExamCellResultProcessing = () => {
    const [view, setView] = useState('list'); // 'list' (select an exam) or 'entry' (enter marks)
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
    }, []);

    // Effect to fetch exams ready for marks entry (status: CLOSED)
    useEffect(() => {
        if (view === 'list') {
            const fetchClosedExams = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${API_BASE_URL}?status=CLOSED`, { credentials: 'include' });
                    if (!response.ok) throw new Error("Failed to fetch exams for results entry.");
                    const data = await response.json();
                    setExams(data.exams || []);
                } catch (err) {
                    addToast('error', err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchClosedExams();
        }
    }, [view, addToast]);
    
    // Handler for selecting an exam from the list
    const handleSelectExam = async (exam) => {
        setIsLoading(true);
        setView('entry');
        setSelectedExam(exam);
        try {
            const response = await fetch(`${API_BASE_URL}/${exam._id}/results/entry`, { credentials: 'include' });
            if (!response.ok) throw new Error("Could not fetch the student list for this exam.");
            const data = await response.json();

            setStudents(data.students || []);
            setSelectedExam(prev => ({ ...prev, ...data.examDetails }));

            // Initialize marks state for the entry form
            const initialMarks = {};
            (data.students || []).forEach(student => {
                initialMarks[student.studentAcademicId] = {};
                student.subjects.forEach(subject => {
                    initialMarks[student.studentAcademicId][subject.subjectCode] = { internal: '', external: '', practical: '' };
                });
            });
            setMarks(initialMarks);

        } catch (err) {
            addToast('error', err.message);
            setView('list'); // Go back to list on error
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for updating marks in the state as staff types
    const handleMarkChange = (studentId, subjectCode, field, value) => {
        const numValue = value === '' ? '' : Math.max(0, parseInt(value, 10)); // Allow empty string, otherwise positive integer
        setMarks(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [subjectCode]: { ...prev[studentId][subjectCode], [field]: numValue } }
        }));
    };
    
    // Handler for submitting all marks for approval
    const handleSubmitResults = async () => {
        setIsSubmitting(true);
        // Format the data into the payload the backend expects
        const resultsPayload = students.map(student => {
            const studentMarks = marks[student.studentAcademicId] || {};
            return {
                studentAcademicId: student.studentAcademicId,
                subjects: student.subjects.map(subject => ({
                    subjectCode: subject.subjectCode,
                    subjectName: subject.subjectName,
                    internal: parseInt(studentMarks[subject.subjectCode]?.internal || 0),
                    external: parseInt(studentMarks[subject.subjectCode]?.external || 0),
                    practical: parseInt(studentMarks[subject.subjectCode]?.practical || 0)
                })),
                sgpa: 0, // Backend calculates this
                overallResult: 'PASS' // Backend determines this
            };
        });

        try {
            const response = await fetch(`${API_BASE_URL}/${selectedExam._id}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: resultsPayload }),
                credentials: 'include'
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to submit results.");
            }
            addToast('success', "Results have been successfully submitted for approval!");
            handleBack(); // Go back to the list view after success
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handler to go back to the exam selection list
    const handleBack = () => {
        setView('list');
        setSelectedExam(null);
        setStudents([]);
        setMarks({});
    };

    if (isLoading && view === 'list') {
        return <FullPageLoader message="Loading exams ready for processing..." />;
    }

    return (
        <div className="font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            {view === 'list' ? (
                <ExamSelectionList exams={exams} onSelect={handleSelectExam} />
            ) : (
                <ResultsEntryGrid
                    exam={selectedExam}
                    students={students}
                    marks={marks}
                    onMarkChange={handleMarkChange}
                    onSubmit={handleSubmitResults}
                    onBack={handleBack}
                    isSubmitting={isSubmitting}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};


// --- Sub-Component: Renders the list of exams to select from ---
const ExamSelectionList = ({ exams, onSelect }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in">
        <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-slate-800">Select Exam for Results Entry</h1>
            <p className="text-sm text-slate-500 mt-1">Choose an exam with a 'CLOSED' status to begin entering marks.</p>
        </div>
        <div className="divide-y divide-slate-200">
            {exams.length > 0 ? exams.map(exam => (
                <div key={exam._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div>
                        <p className="font-semibold text-slate-800">{exam.examName}</p>
                        <p className="text-sm text-slate-500 font-mono mt-1">{exam.examId} | Sem {exam.semester}, {exam.year}</p>
                    </div>
                    <button onClick={() => onSelect(exam)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm">
                        Enter Marks <ChevronRight size={16} />
                    </button>
                </div>
            )) : (
                <div className="p-16 text-center text-slate-500">
                    <h3 className="text-lg font-semibold">No Exams Ready for Entry</h3>
                    <p className="mt-1">There are currently no exams with the status 'CLOSED'.</p>
                </div>
            )}
        </div>
    </div>
);

// --- Sub-Component: Renders the marks entry table ---
const ResultsEntryGrid = ({ exam, students, marks, onMarkChange, onSubmit, onBack, isSubmitting, isLoading }) => {
    const subjects = students.length > 0 ? students[0].subjects : [];

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-medium">
                        <ArrowLeft size={16} /> Back to Exam List
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 mt-2">Results Entry: {exam?.examName}</h1>
                </div>
                {students.length > 0 && (
                    <button onClick={onSubmit} disabled={isSubmitting || isLoading} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg disabled:bg-emerald-300 flex items-center justify-center font-semibold hover:bg-emerald-700">
                        {isSubmitting ? <><Loader2 size={18} className="animate-spin mr-2" /> Submitting...</> : 'Submit for Approval'}
                    </button>
                )}
            </div>
            {isLoading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    {students.length > 0 ? (
                        <table className="w-full min-w-[1200px] text-sm">
                            <thead className="text-left text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 font-semibold sticky left-0 bg-slate-50 z-10 w-48">Student Name</th>
                                    <th className="px-4 py-3 font-semibold w-40">Registration Number</th>
                                    {subjects.map(sub => (<th key={sub.subjectCode} colSpan="3" className="px-4 py-3 font-semibold text-center border-l">{sub.subjectName} ({sub.subjectCode})</th>))}
                                </tr>
                                 <tr>
                                    <th className="px-4 py-2 font-semibold sticky left-0 bg-slate-100 z-10 border-t"></th>
                                    <th className="px-4 py-2 font-semibold bg-slate-100 border-t"></th>
                                    {subjects.map(sub => (<React.Fragment key={`${sub.subjectCode}-subhead`}>
                                            <th className="px-2 py-2 font-medium bg-slate-100 border-l w-24 text-center">Internal</th>
                                            <th className="px-2 py-2 font-medium bg-slate-100 w-24 text-center">External</th>
                                            <th className="px-2 py-2 font-medium bg-slate-100 w-24 text-center">Practical</th>
                                    </React.Fragment>))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {students.map(student => (
                                    <tr key={student.studentAcademicId}>
                                        <td className="px-4 py-2 font-semibold text-slate-800 sticky left-0 bg-white z-10">{student.name}</td>
                                        <td className="px-4 py-2 text-slate-500 font-mono">{student.registrationNumber}</td>
                                        {student.subjects.map(subject => (<React.Fragment key={`${student.studentAcademicId}-${subject.subjectCode}`}>
                                            <td className="px-2 py-1 border-l"><input type="number" placeholder="0" className="w-full p-2 border rounded-md text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none" value={marks[student.studentAcademicId]?.[subject.subjectCode]?.internal ?? ''} onChange={(e) => onMarkChange(student.studentAcademicId, subject.subjectCode, 'internal', e.target.value)} /></td>
                                            <td className="px-2 py-1"><input type="number" placeholder="0" className="w-full p-2 border rounded-md text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none" value={marks[student.studentAcademicId]?.[subject.subjectCode]?.external ?? ''} onChange={(e) => onMarkChange(student.studentAcademicId, subject.subjectCode, 'external', e.target.value)} /></td>
                                            <td className="px-2 py-1"><input type="number" placeholder="0" className="w-full p-2 border rounded-md text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none" value={marks[student.studentAcademicId]?.[subject.subjectCode]?.practical ?? ''} onChange={(e) => onMarkChange(student.studentAcademicId, subject.subjectCode, 'practical', e.target.value)} /></td>
                                        </React.Fragment>))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-16 text-center text-slate-500">No students are registered for this exam.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExamCellResultProcessing;