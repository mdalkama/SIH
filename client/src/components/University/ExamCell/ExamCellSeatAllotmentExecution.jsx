import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, AlertTriangle, CheckCircle, Users, Building, Percent, FileDown, Eye, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

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
const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-sm font-medium text-slate-500">{title}</p>
            </div>
        </div>
    </div>
);

const ExamSelectionList = ({ exams, onSelect }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-slate-800">Select Exam for Seat Allotment</h2>
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
                            Allot Seats <ChevronRight size={16} />
                        </button>
                    </div>
                ))
            ) : (
                <p className="p-8 text-center text-slate-500">No exams are currently ready for seat allotment (Status: CLOSED).</p>
            )}
        </div>
    </div>
);

const AllotmentDetails = ({ exam, onBack }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [allotmentResult, setAllotmentResult] = useState(null);
    const [studentList, setStudentList] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoadingStudents(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${exam._id}/registered-students`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error("Failed to fetch registered student list.");
                }
                const data = await response.json();
                setStudentList(data.students || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoadingStudents(false);
            }
        };
        if (exam?._id) {
            fetchStudents();
        }
    }, [exam]);
    
    const dummyCenters = [
        { id: 1, name: 'Main Campus - Block A', capacity: 500 },
        { id: 2, name: 'Main Campus - Block B', capacity: 500 },
        { id: 3, name: 'City Campus - Hall 1', capacity: 300 },
    ];
    
    const totalCapacity = dummyCenters.reduce((acc, center) => acc + center.capacity, 0);
    const registeredStudentsCount = studentList.length;
    const capacityUtilization = totalCapacity > 0 ? ((registeredStudentsCount / totalCapacity) * 100).toFixed(1) : 0;

    const handleRunAllotment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setAllotmentResult({
                success: true,
                message: `Successfully allotted seats for all students across ${dummyCenters.length} centers.`,
            });
            setIsProcessing(false);
        }, 2500);
    };

    const handleReset = () => setAllotmentResult(null);
    const handleDownload = (fileType) => alert(`Downloading ${fileType} for ${exam.examName}...`);

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-medium mb-6"><ArrowLeft size={16} /> Back to Exam Selection</button>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{exam.examName}</h2>
                <p className="text-slate-500 font-mono">{exam.examId}</p>
            </div>
            
            {isLoadingStudents ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-pulse">
                    <div className="h-24 bg-slate-100 rounded-xl"></div>
                    <div className="h-24 bg-slate-100 rounded-xl"></div>
                    <div className="h-24 bg-slate-100 rounded-xl"></div>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg mb-6">{error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <StatCard icon={Users} title="Registered Students" value={registeredStudentsCount} color="bg-sky-100 text-sky-600" />
                        <StatCard icon={Building} title="Available Centers" value={dummyCenters.length} color="bg-indigo-100 text-indigo-600" />
                        <StatCard icon={Percent} title="Capacity Utilization" value={`${capacityUtilization}%`} color="bg-amber-100 text-amber-600" />
                    </div>
                    {allotmentResult ? (
                         <div className="bg-emerald-50 text-center p-8 rounded-xl border border-emerald-200">
                            <CheckCircle className="mx-auto w-16 h-16 text-emerald-500 mb-4" />
                            <h3 className="text-xl font-bold text-emerald-800">Seat Allotment Completed!</h3>
                            <p className="text-emerald-700 mt-2 max-w-2xl mx-auto">{allotmentResult.message}</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-4">
                                <button onClick={() => handleDownload('Seating Plan')} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 font-semibold"><FileDown size={16} /> Seating Plan (PDF)</button>
                                <button onClick={() => handleDownload('Attendance Sheets')} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 font-semibold"><FileDown size={16} /> Attendance Sheets</button>
                            </div>
                            <button onClick={handleReset} className="mt-4 text-sm text-slate-500 hover:underline">Run Allotment Again</button>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-8 rounded-xl border text-center">
                            <h3 className="text-xl font-semibold text-slate-800">Ready to Execute</h3>
                            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">Click the button below to automatically generate the seating plan for all registered students based on available exam centers and capacity.</p>
                            <button onClick={handleRunAllotment} disabled={isProcessing} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center justify-center font-semibold hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg w-full sm:w-auto mx-auto">
                                {isProcessing ? <><Loader2 size={20} className="animate-spin mr-2" /> Processing...</> : 'Run Allotment Algorithm'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


// --- MAIN PARENT COMPONENT ---
const ExamCellSeatAllotmentExecution = () => {
    const [view, setView] = useState('list');
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExamsForAllotment = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}?status=CLOSED`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error("Failed to fetch exams. Please try again later.");
                }
                const data = await response.json();
                setExams(data.exams || []);
            } catch (err) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExamsForAllotment();
    }, []);

    const handleSelectExam = (exam) => {
        setSelectedExam(exam);
        setView('allotment');
    };

    const handleBack = () => {
        setView('list');
        setSelectedExam(null);
    };

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

            {view === 'list' && <ExamSelectionList exams={exams} onSelect={handleSelectExam} />}
            {view === 'allotment' && <AllotmentDetails exam={selectedExam} onBack={handleBack} />}
        </div>
    );
};

export default ExamCellSeatAllotmentExecution;