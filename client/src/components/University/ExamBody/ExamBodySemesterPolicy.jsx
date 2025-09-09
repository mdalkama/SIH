import React, { useEffect, useMemo, useState } from 'react';
import {
    Book,
    Briefcase,
    ClipboardCheck,
    AlertCircle,
    Loader2,
    Calendar,
    ChevronRight,
    CornerDownLeft,
    Plus,
    Clock,
    Search,
    Download,
    X,
    Clipboard,
    Check
} from 'lucide-react';

// This is a placeholder for your actual API base URL
const BASE_API_URL = "https://your-api-base-url.com/api/v1";

// --- Mock API Data (for demonstration) ---
const mockCourses = [
    { id: 'btech', name: 'B.Tech.', departments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology', 'Automobile', 'Electrical'], batches: ['2023', '2024', '2025'] },
    { id: 'mtech', name: 'M.Tech.', departments: ['Computer Science', 'Electronics'], batches: ['2024', '2025'] },
    { id: 'bba', name: 'B.B.A.', departments: ['Commerce', 'Management'], batches: ['2023', '2024'] },
    { id: 'mca', name: 'M.C.A.', departments: ['Computer Applications'], batches: ['2024', '2025'] },
    { id: 'bca', name: 'B.C.A.', departments: ['Computer Applications'], batches: ['2023', '2024', '2025'] },
    { id: 'bcom', name: 'B.Com.', departments: ['Commerce'], batches: ['2023', '2024', '2025'] },
    { id: 'bsc', name: 'B.Sc.', departments: ['Physics', 'Chemistry', 'Mathematics'], batches: ['2023', '2024', '2025'] },
    { id: 'msc', name: 'M.Sc.', departments: ['Physics', 'Chemistry', 'Mathematics'], batches: ['2024', '2025'] },
    { id: 'phd', name: 'Ph.D.', departments: ['Physics'], batches: ['2023'] },
    { id: 'ba', name: 'B.A.', departments: ['English', 'History'], batches: ['2023', '2024'] },
    { id: 'ma', name: 'M.A.', departments: ['History'], batches: ['2024', '2025'] },
    { id: 'mba', name: 'M.B.A.', departments: ['Management'], batches: ['2024', '2025'] },
];

const mockSubjectsByBranch = {
    'btech-Computer Science': ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Management'],
    'btech-Electronics': ['Digital Electronics', 'Analog Circuits', 'Microprocessors'],
    'btech-Mechanical': ['Thermodynamics', 'Fluid Mechanics', 'Engineering Mechanics'],
    'btech-Civil': ['Structural Analysis', 'Geotechnical Engineering'],
    'btech-Information Technology': ['Computer Networks', 'Cyber Security'],
    'btech-Automobile': ['Vehicle Dynamics', 'Engine Technology'],
    'btech-Electrical': ['Power Systems', 'Control Systems'],
    'mtech-Computer Science': ['Advanced Algorithms', 'Machine Learning'],
    'mtech-Electronics': ['VLSI Design', 'Communication Systems'],
    'bba-Commerce': ['Financial Accounting', 'Business Law'],
    'bba-Management': ['Principles of Management', 'Organizational Behavior'],
    'mca-Computer Applications': ['Software Engineering', 'Web Technologies'],
    'bca-Computer Applications': ['Programming in C', 'Data Structures', 'Networking'],
    'bcom-Commerce': ['Accounting for Managers', 'Corporate Finance'],
    'bsc-Physics': ['Classical Mechanics', 'Electromagnetism'],
    'msc-Physics': ['Quantum Mechanics', 'Statistical Mechanics'],
    'bsc-Chemistry': ['Organic Chemistry', 'Inorganic Chemistry'],
    'msc-Chemistry': ['Physical Chemistry', 'Analytical Chemistry'],
    'bsc-Mathematics': ['Abstract Algebra', 'Real Analysis'],
    'msc-Mathematics': ['Complex Analysis', 'Topology'],
    'phd-Physics': ['Research Methodology', 'Quantum Field Theory'],
    'ba-English': ['Literary Theory', 'British Literature'],
    'ba-History': ['Ancient Indian History', 'Modern World History'],
    'ma-History': ['Historical Methods', 'Post-Colonial Studies'],
    'mba-Management': ['Strategic Management', 'Marketing Management'],
};

const mockStudentCounts = {
    'btech-2023': { 'Computer Science': 65, 'Electronics': 60, 'Mechanical': 70, 'Civil': 68, 'Information Technology': 62, 'Automobile': 50, 'Electrical': 65 },
    'btech-2024': { 'Computer Science': 70, 'Electronics': 62, 'Mechanical': 75, 'Civil': 70, 'Information Technology': 65, 'Automobile': 55, 'Electrical': 68 },
    'btech-2025': { 'Computer Science': 72, 'Electronics': 64, 'Civil': 75 },
    'mtech-2024': { 'Computer Science': 20, 'Electronics': 18 },
    'mtech-2025': { 'Computer Science': 22, 'Electronics': 20 },
    'bba-2023': { 'Commerce': 55, 'Management': 45 },
    'bba-2024': { 'Commerce': 58, 'Management': 48 },
    'mca-2024': { 'Computer Applications': 30 },
    'mca-2025': { 'Computer Applications': 35 },
    'bca-2023': { 'Computer Applications': 80 },
    'bca-2024': { 'Computer Applications': 85 },
    'bca-2025': { 'Computer Applications': 90 },
    'bcom-2023': { 'Commerce': 90 },
    'bcom-2024': { 'Commerce': 95 },
    'bcom-2025': { 'Commerce': 100 },
    'bsc-2023': { 'Physics': 40, 'Chemistry': 35, 'Mathematics': 45 },
    'bsc-2024': { 'Physics': 42, 'Chemistry': 38, 'Mathematics': 48 },
    'bsc-2025': { 'Physics': 45, 'Chemistry': 40, 'Mathematics': 50 },
    'msc-2024': { 'Physics': 28, 'Chemistry': 25, 'Mathematics': 35 },
    'msc-2025': { 'Physics': 30, 'Chemistry': 28, 'Mathematics': 38 },
    'phd-2023': { 'Physics': 15 },
    'ba-2023': { 'English': 50, 'History': 55 },
    'ba-2024': { 'English': 52, 'History': 58 },
    'ma-2024': { 'History': 30 },
    'ma-2025': { 'History': 32 },
    'mba-2024': { 'Management': 40 },
    'mba-2025': { 'Management': 45 },
};

function ExamBodySemesterPolicy() {
    const [notification, setNotification] = useState(null);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [conductingExam, setConductingExam] = useState(false);

    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [examDetails, setExamDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, itemsPerPage: 10 });
    const [step, setStep] = useState(1);
    const [masterExamDetails, setMasterExamDetails] = useState({
        startDate: '',
        endDate: '',
    });

    function showNotification(message, type = "success") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }

    // --- Data Fetching Logic (Simulated) ---
    useEffect(() => {
        const fetchCourses = async () => {
            setLoadingCourses(true);
            try {
                setTimeout(() => {
                    setCourses(mockCourses);
                    setLoadingCourses(false);
                }, 1000);
            } catch (error) {
                setLoadingCourses(false);
                showNotification("Courses load karne mein nakam rahe. Kripaya dobara koshish karein.", "error");
            }
        };
        fetchCourses();
    }, []);

    const handleBatchToggle = (batch) => {
        setSelectedBatches(prev =>
            prev.includes(batch) ? prev.filter(b => b !== batch) : [...prev, batch]
        );
    };

    const handleBranchToggle = (branch) => {
        setSelectedBranches(prev =>
            prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
        );
    };

    const handleProceedToStep2 = () => {
        if (!selectedCourseId || selectedBatches.length === 0 || selectedBranches.length === 0) {
            showNotification("Kripaya ek course, ek batch aur ek branch chunein.", "error");
            return;
        }
        setStep(2);
    };

    const handleApplyDetailsToAll = () => {
        if (!masterExamDetails.startDate || !masterExamDetails.endDate) {
            showNotification("Kripaya pariksha ki shuru aur aakhri tarikh bharein.", "error");
            return;
        }

        const selectedCourse = courses.find(c => c.id === selectedCourseId);
        
        const newExams = selectedBatches.flatMap(batch => {
            return selectedBranches.flatMap(branch => {
                const subjects = mockSubjectsByBranch[`${selectedCourseId}-${branch}`] || [];
                const studentCount = mockStudentCounts[`${selectedCourseId}-${batch}`]?.[branch] || 0;
                
                return subjects.map(subject => ({
                    id: `${selectedCourseId}-${batch}-${branch}-${subject}-${Date.now() + Math.random()}`,
                    course: selectedCourse.name,
                    batch: batch,
                    branch: branch,
                    students: studentCount,
                    subject: subject,
                    date: `${masterExamDetails.startDate} to ${masterExamDetails.endDate}`,
                }));
            });
        });

        setExamDetails(prev => [...prev, ...newExams]);
        setStep(3);
        setMasterExamDetails({ startDate: '', endDate: '' });
    };

    const handleFinalizeAllExams = async () => {
        if (examDetails.length === 0) {
            showNotification("Pariksha roster khali hai. Pehle exams add karein.", "error");
            return;
        }

        const hasEmptyFields = examDetails.some(exam => !exam.subject || !exam.date);
        if (hasEmptyFields) {
            showNotification("Kripaya sabhi subject aur tarikh ke field ko bharein.", "error");
            return;
        }
        
        setConductingExam(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            showNotification(`Sare exam safaltapoorvak schedule ho gaye hain.`, "success");
            setConductingExam(false);
            setExamDetails([]);
            setStep(1);
        } catch (error) {
            showNotification("Exams schedule karne mein asafal rahe. Dobara koshish karein.", "error");
            setConductingExam(false);
        }
    };

    const selectedCourse = useMemo(() => courses.find(c => c.id === selectedCourseId), [courses, selectedCourseId]);

    const filteredExams = useMemo(() => {
        if (!searchTerm) return examDetails;
        const query = searchTerm.toLowerCase();
        return examDetails.filter(exam =>
            exam.course.toLowerCase().includes(query) ||
            exam.batch.toLowerCase().includes(query) ||
            exam.branch.toLowerCase().includes(query) ||
            exam.subject.toLowerCase().includes(query)
        );
    }, [examDetails, searchTerm]);

    const totalPages = Math.ceil(filteredExams.length / pagination.itemsPerPage);
    const paginatedExams = filteredExams.slice(
        (pagination.page - 1) * pagination.itemsPerPage,
        pagination.page * pagination.itemsPerPage
    );
    
    // Step indicator
    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</div>
                <span className="font-semibold text-sm hidden sm:block">Choose Course, Batch & Branch</span>
            </div>
            <div className={`w-12 h-1 bg-slate-200 mx-2 ${step > 1 ? 'bg-blue-600' : ''}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</div>
                <span className="font-semibold text-sm hidden sm:block">Enter Exam Details</span>
            </div>
            <div className={`w-12 h-1 bg-slate-200 mx-2 ${step > 2 ? 'bg-blue-600' : ''}`}></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</div>
                <span className="font-semibold text-sm hidden sm:block">Review & Finalize</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-6 bg-slate-50 font-sans">
            {notification && (
                <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {notification.type === "success" ? <ClipboardCheck size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/10"><X size={16} /></button>
                </div>
            )}

          
            
            {renderStepIndicator()}

            {/* Step 1: Course, Batch & Branch Selection */}
            {step === 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Book size={20} className="text-slate-500" />
                            Step 1: Choose Course, Batch & Branch
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Course Selection */}
                        <div>
                            <h3 className="text-md font-semibold text-slate-700 mb-3">Course</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {loadingCourses ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Loader2 size={16} className="animate-spin" /> Loading courses...
                                    </div>
                                ) : courses.map(course => (
                                    <button
                                        key={course.id}
                                        onClick={() => { setSelectedCourseId(course.id); setSelectedBatches([]); setSelectedBranches([]); }}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${selectedCourseId === course.id ? "bg-blue-50 border-blue-600 ring-4 ring-blue-100" : "bg-white border-slate-200 hover:border-blue-300"}`}
                                    >
                                        <h4 className={`font-semibold text-base mb-1 ${selectedCourseId === course.id ? "text-blue-800" : "text-slate-700"}`}>{course.name}</h4>
                                        <p className="text-sm text-slate-500">{course.departments.join(', ')}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Batch Selection */}
                        {selectedCourseId && (
                            <div>
                                <h3 className="text-md font-semibold text-slate-700 mb-3">Choose Batches</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedCourse.batches.map(batch => (
                                        <button
                                            key={batch}
                                            onClick={() => handleBatchToggle(batch)}
                                            className={`px-4 py-2 rounded-md border-2 transition-all ${selectedBatches.includes(batch) ? "bg-green-50 border-green-600 ring-4 ring-green-100 text-green-800" : "bg-white border-slate-200 hover:border-green-300 text-slate-700"}`}
                                        >
                                            {batch}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Branch Selection */}
                        {selectedCourseId && selectedBatches.length > 0 && (
                            <div>
                                <h3 className="text-md font-semibold text-slate-700 mb-3">Choose Branches</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedCourse.departments.map(branch => (
                                        <button
                                            key={branch}
                                            onClick={() => handleBranchToggle(branch)}
                                            className={`px-4 py-2 rounded-md border-2 transition-all ${selectedBranches.includes(branch) ? "bg-green-50 border-green-600 ring-4 ring-green-100 text-green-800" : "bg-white border-slate-200 hover:border-green-300 text-slate-700"}`}
                                        >
                                            {branch}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Action Button */}
                        {selectedCourseId && selectedBatches.length > 0 && selectedBranches.length > 0 && (
                            <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
                                <button
                                    onClick={handleProceedToStep2}
                                    className="px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Set Exam Details <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Step 2: Set Exam Details */}
            {step === 2 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <button onClick={() => setStep(1)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100"><CornerDownLeft size={20} /></button>
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Briefcase size={20} className="text-slate-500" />
                            Step 2: Enter Exam Details
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-bold text-blue-800">Selected Course: <span className="font-normal">{selectedCourse.name}</span></h3>
                            <h3 className="font-bold text-blue-800">Selected Batches: <span className="font-normal">{selectedBatches.join(', ')}</span></h3>
                            <h3 className="font-bold text-blue-800">Selected Branches: <span className="font-normal">{selectedBranches.join(', ')}</span></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-dashed border-slate-300 rounded-lg p-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={masterExamDetails.startDate}
                                    onChange={(e) => setMasterExamDetails(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={masterExamDetails.endDate}
                                    onChange={(e) => setMasterExamDetails(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                             <button
                                onClick={handleApplyDetailsToAll}
                                className="px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors bg-blue-600 text-white hover:bg-blue-700"
                                disabled={!masterExamDetails.startDate || !masterExamDetails.endDate}
                            >
                                Add to Roster <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Review & Finalize */}
            {step === 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                         <div className="flex items-center gap-2">
                            <button onClick={() => setStep(2)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100"><CornerDownLeft size={20} /></button>
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Clipboard size={20} className="text-slate-500" />
                                Step 3: Review & Finalize
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {setSearchTerm(e.target.value); setPagination(prev => ({...prev, page: 1}))}}
                                    placeholder="Search roster..."
                                    className="w-full sm:w-48 pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md"
                                />
                            </div>
                            <button
                                onClick={handleFinalizeAllExams}
                                disabled={conductingExam || examDetails.length === 0}
                                className={`px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors ${conductingExam ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                            >
                                {conductingExam ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />}
                                {conductingExam ? "Finalizing..." : "Finalize All Exams"}
                            </button>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 font-medium w-12">#</th>
                                    <th className="px-4 py-2 font-medium w-48">Course</th>
                                    <th className="px-4 py-2 font-medium w-24">Batch</th>
                                    <th className="px-4 py-2 font-medium w-32">Branch</th>
                                    <th className="px-4 py-2 font-medium">Subject</th>
                                    <th className="px-4 py-2 font-medium w-32">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedExams.length > 0 ? paginatedExams.map((exam, index) => (
                                    <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-slate-500 text-xs">{(pagination.page - 1) * pagination.itemsPerPage + index + 1}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">{exam.course}</td>
                                        <td className="px-4 py-3 text-slate-600">{exam.batch}</td>
                                        <td className="px-4 py-3 text-slate-600">{exam.branch}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-800">{exam.subject}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-800">{exam.date}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-500">
                                            No exams in the roster. Add some above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">Show:</span>
                            <select value={pagination.itemsPerPage} onChange={(e) => setPagination({ page: 1, itemsPerPage: Number(e.target.value) })} className="px-2 py-1 text-sm border border-slate-300 rounded-md bg-white">
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={30}>30 per page</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600">
                                Page {pagination.page} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => setPagination(prev => ({...prev, page: prev.page - 1}))} disabled={pagination.page === 1} className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm flex items-center gap-1.5 disabled:opacity-50 hover:bg-slate-50">
                                    Previous
                                </button>
                                <button onClick={() => setPagination(prev => ({...prev, page: prev.page + 1}))} disabled={pagination.page === totalPages} className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm flex items-center gap-1.5 disabled:opacity-50 hover:bg-slate-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExamBodySemesterPolicy;