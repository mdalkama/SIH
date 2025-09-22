import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, ArrowLeft, Users, CheckCircle, FileText, Download, Eye, ChevronRight, Search, ChevronLeft, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

// --- SKELETON LOADER & HELPER COMPONENTS ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
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

const ExamSelectionList = ({ exams, onSelect }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-slate-800">Select Exam to Manage Admit Cards</h2>
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
                            <FileText size={16} /> Manage Admit Cards
                        </button>
                    </div>
                ))
            ) : (
                <p className="p-8 text-center text-slate-500">No exams are currently ready for admit card generation.</p>
            )}
        </div>
    </div>
);

const AdmitCardGrid = ({ exam, onBack }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${exam._id}/registered-students`, { credentials: 'include' });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || "Failed to fetch student list.");
                }
                const data = await response.json();
                // Add dummy status to each real student
                const studentsWithDummyStatus = (data.students || []).map((student, i) => ({
                    ...student,
                    status: i % 3 === 0 ? 'Published' : i % 2 === 0 ? 'Generated' : 'Not Generated',
                    admitCardUrl: i % 3 === 0 ? `/dummy-url.pdf` : null
                }));
                setStudents(studentsWithDummyStatus);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (exam?._id) {
            fetchStudents();
        }
    }, [exam]);

    const filteredStudents = useMemo(() => students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ), [students, searchTerm]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredStudents.slice(startIndex, startIndex + pageSize);
    }, [filteredStudents, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredStudents.length / pageSize);

    const handleAction = (action) => alert(`${action} for ${exam.examName}`);
    const handleStudentAction = (student, action) => alert(`${action} for ${student.name}`);
    
    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-medium mb-6"><ArrowLeft size={16} /> Back to Exam Selection</button>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Admit Cards for {exam.examName}</h2>
                        <p className="text-sm text-slate-500">{students.length} Students Registered</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleAction('Generate All')} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-semibold">Generate for All</button>
                        <button onClick={() => handleAction('Publish All')} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg font-semibold">Publish All</button>
                    </div>
                </div>
                <div className="p-4 border-b">
                    <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search student by name or registration number..." className="w-full md:w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-lg" /></div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" size={32}/></div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600">{error}</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase"><tr><th className="px-4 py-2 font-semibold">Student Name</th><th className="px-4 py-2 font-semibold">Registration No.</th><th className="px-4 py-2 font-semibold text-center">Status</th><th className="px-4 py-2 font-semibold text-center">Actions</th></tr></thead>
                            <tbody className="divide-y divide-slate-200">
                                {paginatedStudents.map(student => (
                                    <tr key={student.studentAcademicId}>
                                        <td className="px-4 py-2 font-semibold text-slate-700">{student.name}</td>
                                        <td className="px-4 py-2 font-mono text-slate-600">{student.registrationNumber}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'Published' ? 'bg-green-100 text-green-800' : student.status === 'Generated' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{student.status}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex justify-center gap-2">
                                                {student.admitCardUrl ? <button onClick={()=>handleStudentAction(student, 'Viewing Admit Card')} className="p-1.5 hover:bg-slate-200 rounded-md" title="View"><Eye size={16}/></button> : <button onClick={()=>handleStudentAction(student, 'Generating Admit Card')} className="p-1.5 hover:bg-slate-200 rounded-md" title="Generate"><FileText size={16}/></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {totalPages > 1 && <div className="p-4 flex justify-end items-center gap-2 text-sm text-slate-600 border-t"><p className="font-medium">Page {currentPage} of {totalPages}</p><div className="flex gap-1"><button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button><button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={16} /></button></div></div>}
            </div>
        </div>
    );
};

// --- MAIN PARENT COMPONENT ---
const ExamCellPublishAdmitCard = () => {
    const [view, setView] = useState('list');
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- FETCHING REAL EXAMS ---
                // Fetch exams with CLOSED status, as they are ready for next steps
                const response = await fetch(`${API_BASE_URL}?status=CLOSED`, { credentials: 'include' });
                if (!response.ok) throw new Error("Failed to fetch exams.");
                const data = await response.json();
                setExams(data.exams || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const handleSelectExam = (exam) => { setSelectedExam(exam); setView('grid'); };
    const handleBack = () => { setView('list'); setSelectedExam(null); };

    if (loading) return <SkeletonLoader />;
    if (error) return (<div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertTriangle className="mx-auto w-12 h-12 text-red-500" /><h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3><p className="text-red-600 mt-1">{error}</p></div>);

    return (
        <div className="font-sans">
            
            {view === 'list' && <ExamSelectionList exams={exams} onSelect={handleSelectExam} />}
            {view === 'grid' && <AdmitCardGrid exam={selectedExam} onBack={handleBack} />}
        </div>
    );
};

export default ExamCellPublishAdmitCard;