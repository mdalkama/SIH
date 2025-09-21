import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, ArrowLeft, Users, CheckCircle, Save, BookOpen, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

// --- SKELETON LOADER COMPONENT ---
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

// --- HELPER SUB-COMPONENTS ---
const ExamSelectionList = ({ exams, onSelect }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-slate-800">Select Exam to Assign Evaluators</h2>
        </div>
        <div className="divide-y divide-slate-200">
            {exams.length > 0 ? (
                exams.map(exam => (
                    <div key={exam._id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                        <div>
                            <p className="font-semibold text-slate-800">{exam.examName}</p>
                            <p className="text-sm text-slate-500 font-mono mt-1">{exam.examId}</p>
                        </div>
                        <button onClick={() => onSelect(exam)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm">
                            <Users size={16} /> Assign Evaluators
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center p-12 text-slate-500">
                    <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold">No Exams Ready</h3>
                    <p className="mt-1 text-sm">There are no exams currently ready for evaluator assignment.</p>
                </div>
            )}
        </div>
    </div>
);

const AssignmentGrid = ({ exam, onBack, availableEvaluators }) => {
    const [assignments, setAssignments] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    const allSubjects = useMemo(() => {
        return exam.courses.flatMap(course => 
            course.timetable.map(subject => ({ ...subject, courseCode: course.courseCode }))
        );
    }, [exam]);

    useEffect(() => {
        const initialAssignments = {};
        allSubjects.forEach(subject => {
            initialAssignments[subject.subjectCode] = subject.evaluator || '';
        });
        setAssignments(initialAssignments);
        setHasChanges(false);
    }, [allSubjects]);

    const handleAssignmentChange = (subjectCode, evaluatorId) => {
        setAssignments(prev => ({ ...prev, [subjectCode]: evaluatorId }));
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const updatedExamData = { ...exam, courses: exam.courses.map(course => ({
                ...course,
                timetable: course.timetable.map(subject => ({
                    ...subject,
                    evaluator: assignments[subject.subjectCode] || null
                }))
            }))};
            
            const response = await fetch(`${API_BASE_URL}/semester-exam/${exam._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedExamData)
            });
            if (!response.ok) throw new Error("Failed to save assignments.");
            
            alert("Evaluators assigned successfully!");
            setHasChanges(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-medium mb-6">
                <ArrowLeft size={16} /> Back to Exam Selection
            </button>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800">Assign Evaluators for {exam.examName}</h2>
                    {hasChanges && (
                        <button onClick={handleSaveChanges} disabled={isSaving} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center justify-center font-semibold hover:bg-blue-700">
                            {isSaving ? <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</> : <><Save size={18} className="mr-2" /> Save Changes</>}
                        </button>
                    )}
                </div>
                <div className="p-4 space-y-3">
                    {allSubjects.map(subject => (
                        <div key={`${subject.courseCode}-${subject.subjectCode}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-200 rounded-lg items-center">
                            <div>
                                <p className="font-semibold text-slate-800">{subject.subjectName}</p>
                                <p className="text-xs text-slate-500 font-mono">{subject.subjectCode} ({subject.courseCode})</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <select value={assignments[subject.subjectCode] || ''} onChange={(e) => handleAssignmentChange(subject.subjectCode, e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                                    <option value="">-- Unassigned --</option>
                                    {availableEvaluators.map(evaluator => (<option key={evaluator._id} value={evaluator._id}>{evaluator.name} ({evaluator.staffId})</option>))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- MAIN PARENT COMPONENT ---
const ExamCellAssignEvaluators = () => {
    const [view, setView] = useState('list');
    const [exams, setExams] = useState([]);
    const [availableEvaluators, setAvailableEvaluators] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch exams ready for assignment (e.g., SEAT_ALLOTMENT_APPROVED or CLOSED)
                const [examsRes, evaluatorsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/semester-exam?status=SEAT_ALLOTMENT_APPROVED`, { credentials: 'include' }),
                    fetch(`${API_BASE_URL}/staff/list`, { credentials: 'include' })
                ]);

                if (!examsRes.ok) throw new Error("Failed to fetch exams.");
                const examsData = await examsRes.json();
                setExams(examsData.exams || []);

                if (!evaluatorsRes.ok) throw new Error("Failed to fetch evaluators list.");
                const evaluatorsData = await evaluatorsRes.json();
                setAvailableEvaluators(evaluatorsData.staff || []);

            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSelectExam = (exam) => { setSelectedExam(exam); setView('assignment'); };
    const handleBack = () => { setView('list'); setSelectedExam(null); };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="mx-auto w-12 h-12 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3>
                <p className="text-red-600 mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Assign Evaluators</h1>
                <p className="mt-1 text-slate-600">Assign faculty members to subjects for paper evaluation.</p>
            </header>
            
            {view === 'list' && <ExamSelectionList exams={exams} onSelect={handleSelectExam} />}
            {view === 'assignment' && <AssignmentGrid exam={selectedExam} onBack={handleBack} availableEvaluators={availableEvaluators} />}
        </div>
    );
};

export default ExamCellAssignEvaluators;