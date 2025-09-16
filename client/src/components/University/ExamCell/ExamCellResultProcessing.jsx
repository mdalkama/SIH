import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, AlertTriangle, CheckCircle, Info, X, BookOpen, Edit, Save } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

// --- Reusable Helper Components ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const timer = setTimeout(() => { onClose(); }, 4000); return () => clearTimeout(timer); }, [onClose]);
    const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> };
    return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4" style={{ borderColor: type === 'error' ? '#f43f5e' : type === 'info' ? '#0ea5e9' : '#10b981' }}><div className="flex-shrink-0">{icons[type]}</div><p className="flex-1 text-sm text-slate-700 font-medium">{message}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button></div>);
};
const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return (<div className="fixed top-6 right-6 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
};
const FullPageLoader = ({ message }) => (<div className="flex flex-col justify-center items-center h-full bg-white rounded-xl py-20"><Loader2 className="animate-spin text-indigo-600" size={48} /><p className="mt-4 text-slate-600">{message}</p></div>);
const EmptyState = ({ icon: Icon, title, message }) => (<div className="text-center py-20 px-6 bg-white rounded-xl border-2 border-dashed border-slate-200"><Icon className="mx-auto h-12 w-12 text-slate-300" /><h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3><p className="mt-1 text-sm text-slate-500">{message}</p></div>);

// --- MODAL FOR SUBJECT MARKS ---
const StudentMarksEntryModal = ({ isOpen, onClose, student, onSave }) => {
    const [subjectMarks, setSubjectMarks] = useState({});
    console.log(student)
    
    useEffect(() => {
        if (student && student.subjects) {
            const initialMarks = {};
            student.subjects.forEach(sub => {
                initialMarks[sub.subjectCode] = {
                    internal: student.initialMarks?.[sub.subjectCode]?.internal ?? '',
                    external: student.initialMarks?.[sub.subjectCode]?.external ?? '',
                    practical: student.initialMarks?.[sub.subjectCode]?.practical ?? ''
                };
            });
            setSubjectMarks(initialMarks);
        }
    }, [student]);

    const handleChange = (subjectCode, field, value) => {
        const numValue = value === '' ? '' : Math.max(0, parseInt(value, 10));
        setSubjectMarks(prev => ({ ...prev, [subjectCode]: { ...prev[subjectCode], [field]: numValue } }));
    };

    const handleSaveClick = () => { onSave(student.studentAcademicId, subjectMarks); onClose(); };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Enter Marks</h2>
                    <p className="text-sm text-slate-500">{student.name} ({student.registrationNumber})</p>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    {student.subjects.map(subject => (
                        <div key={subject.subjectCode} className="grid grid-cols-4 items-center gap-4 p-3 border rounded-lg bg-slate-50">
                            <div className="col-span-1">
                                <p className="font-semibold text-slate-700">{subject.subjectName}</p>
                                <p className="text-xs font-mono text-slate-500">{subject.subjectCode} ({subject.credits} Credits)</p>
                            </div>
                            <div className="text-center"><label className="text-xs font-medium text-slate-500">Internal</label><input type="number" value={subjectMarks[subject.subjectCode]?.internal ?? ''} onChange={e => handleChange(subject.subjectCode, 'internal', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-center" /></div>
                            <div className="text-center"><label className="text-xs font-medium text-slate-500">External</label><input type="number" value={subjectMarks[subject.subjectCode]?.external ?? ''} onChange={e => handleChange(subject.subjectCode, 'external', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-center" /></div>
                            <div className="text-center"><label className="text-xs font-medium text-slate-500">Practical</label><input type="number" value={subjectMarks[subject.subjectCode]?.practical ?? ''} onChange={e => handleChange(subject.subjectCode, 'practical', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-center" /></div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-100 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border rounded-lg text-slate-700 hover:bg-slate-200 font-semibold">Cancel</button>
                    <button onClick={handleSaveClick} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2"><Save size={18} /> Save Marks</button>
                </div>
            </div>
        </div>
    );
};

// --- Component to Select an Exam ---
const ExamSelectionList = ({ exams, onSelect }) => ( <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in"><div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Select Exam for Results Entry</h2></div><div className="divide-y divide-slate-200">{exams.length > 0 ? exams.map(exam => (<div key={exam._id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 transition-colors"><div><p className="font-semibold text-slate-800">{exam.examName}</p><p className="text-sm text-slate-500 font-mono mt-1">{exam.examId} | Semester {exam.semester}, {exam.year}</p></div><button onClick={() => onSelect(exam)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm transition-colors"><Edit size={16} /> Enter Marks</button></div>)) : (<EmptyState icon={BookOpen} title="No Exams Ready for Entry" message="There are currently no exams with the status 'CLOSED'." />)}</div></div>);

// --- Component to Show Student List ---
const ResultsEntryGrid = ({ exam, students, studentMarks, onEditStudent, onSubmit, onBack, isSubmitting, isLoading }) => {
    const areAllMarksEntered = (marks) => marks && Object.values(marks).every(m => m.internal !== '' && m.external !== '' && m.practical !== '');
    return (<div className="animate-fade-in"><div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4"><div><button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-medium mb-2 transition-colors"><ArrowLeft size={16} /> Back to Exam Selection</button><h2 className="text-2xl font-bold text-slate-800">Marks Entry: {exam?.examName}</h2></div>{students.length > 0 && (<button onClick={onSubmit} disabled={isSubmitting || isLoading} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg disabled:bg-emerald-300 flex items-center justify-center font-semibold hover:bg-emerald-700 transition-shadow shadow-sm hover:shadow-md">{isSubmitting ? <><Loader2 size={18} className="animate-spin mr-2" /> Submitting...</> : 'Submit All Results for Approval'}</button>)}</div>{isLoading ? <FullPageLoader message="Loading student list..." /> : <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">{students.length > 0 ? (<table className="w-full text-sm"><thead className="text-left text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-4 py-3 font-semibold">Student Name</th><th className="px-4 py-3 font-semibold">Registration Number</th><th className="px-4 py-3 font-semibold text-center">Marks Status</th><th className="px-4 py-3 font-semibold text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">{students.map(student => { const marks = studentMarks[student.studentAcademicId]; const entered = areAllMarksEntered(marks); return (<tr key={student.studentAcademicId} className="hover:bg-slate-50/50"><td className="px-4 py-3 font-semibold text-slate-800">{student.name}</td><td className="px-4 py-3 text-slate-500 font-mono">{student.registrationNumber}</td><td className="px-4 py-3 text-center">{entered ? (<span className="flex items-center justify-center gap-1.5 text-green-600 text-xs font-semibold"><CheckCircle size={14}/> Entered</span>) : (<span className="flex items-center justify-center gap-1.5 text-amber-600 text-xs font-semibold"><AlertTriangle size={14}/> Pending</span>)}</td><td className="px-4 py-3 text-center"><button onClick={() => onEditStudent(student)} className="flex items-center gap-2 mx-auto px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 font-semibold text-xs"><Edit size={14} /> {entered ? 'Edit Marks' : 'Add Marks'}</button></td></tr>); })}</tbody></table>) : ( <EmptyState icon={Edit} title="No Students Registered" message="There are no students registered for this examination." /> )}</div>}</div>);
};

// --- Main Parent Component ---
const ExamCellResultProcessing = () => {
    const [view, setView] = useState('list');
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentMarks, setStudentMarks] = useState({});
    const [editingStudent, setEditingStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((type, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, message }]); }, []);


    useEffect(() => {
        if (view === 'list') {
            const fetchClosedExams = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${API_BASE_URL}?status=CLOSED`, { credentials: 'include' });
                    if (!response.ok) throw new Error("Failed to fetch exams for results entry.");
                    const data = await response.json();
                    setExams(data.exams || []);
                } catch (err) { addToast('error', err.message); } 
                finally { setIsLoading(false); }
            };
            fetchClosedExams();
        }
    }, [view, addToast]);
    
    const handleSelectExam = async (exam) => {
        setIsLoading(true); setView('entry'); setSelectedExam(exam);
        try {
            const response = await fetch(`${API_BASE_URL}/${exam._id}/results/entry`, { credentials: 'include' });
            if (!response.ok) throw new Error("Could not fetch student list.");
            const data = await response.json();
            setStudents(data.students || []);
            setSelectedExam(prev => ({ ...prev, ...data.examDetails }));
            const initialResults = {};
            (data.students || []).forEach(student => {
                const subjectMarks = {};
                student.subjects.forEach(sub => { subjectMarks[sub.subjectCode] = { internal: '', external: '', practical: '' }; });
                initialResults[student.studentAcademicId] = subjectMarks;
            });
            setStudentMarks(initialResults);
        } catch (err) { addToast('error', err.message); setView('list'); } 
        finally { setIsLoading(false); }
    };

    const handleSaveStudentMarks = (studentAcademicId, updatedMarks) => {
        setStudentMarks(prev => ({ ...prev, [studentAcademicId]: updatedMarks }));
    };
    
    const handleSubmitResults = async () => {
        setIsSubmitting(true);
        const resultsPayload = students.map(student => {
            const marks = studentMarks[student.studentAcademicId];
            return {
                studentAcademicId: student.studentAcademicId,
                subjects: student.subjects.map(subject => ({
                    subjectCode: subject.subjectCode,
                    subjectName: subject.subjectName,
                    internal: parseInt(marks[subject.subjectCode]?.internal || 0),
                    external: parseInt(marks[subject.subjectCode]?.external || 0),
                    practical: parseInt(marks[subject.subjectCode]?.practical || 0)
                }))
            };
        });
        try {
            const response = await fetch(`${API_BASE_URL}/${selectedExam._id}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: resultsPayload }),
                credentials: 'include'
            });
            if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || "Failed to submit results."); }
            addToast('success', "Results have been successfully submitted for approval!");
            handleBack();
        } catch (err) { addToast('error', err.message); } 
        finally { setIsSubmitting(false); }
    };
    
    const handleBack = () => { setView('list'); setSelectedExam(null); setStudents([]); setStudentMarks({}); setEditingStudent(null); };

    return (
        <div className="font-sans bg-slate-50 min-h-screen p-4 md:p-8">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <header className="mb-8"><h1 className="text-3xl font-bold text-slate-900">Result Processing</h1><p className="mt-1 text-slate-600">Enter marks for students for closed examinations.</p></header>
            {view === 'list' ? (
                isLoading ? <FullPageLoader message="Loading exams ready for processing..." /> :
                <ExamSelectionList exams={exams} onSelect={handleSelectExam} />
            ) : (
                <ResultsEntryGrid
                    exam={selectedExam}
                    students={students}
                    studentMarks={studentMarks}
                    onEditStudent={(student) => setEditingStudent(student)}
                    onSubmit={handleSubmitResults}
                    onBack={handleBack}
                    isSubmitting={isSubmitting}
                    isLoading={isLoading}
                />
            )}
            <StudentMarksEntryModal
                isOpen={!!editingStudent}
                onClose={() => setEditingStudent(null)}
                student={editingStudent ? { ...editingStudent, initialMarks: studentMarks[editingStudent.studentAcademicId] } : null}
                onSave={handleSaveStudentMarks}
            />
        </div>
    );
};

export default ExamCellResultProcessing;