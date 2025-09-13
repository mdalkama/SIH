import React, { useState, useEffect, useMemo } from 'react';
import { Search, IndianRupee, BookOpen, Users, ChevronsRight, Loader2, AlertTriangle, PlusCircle, X, Send } from 'lucide-react';

// --- HELPER & CHILD COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-sm font-medium text-slate-500`}>{title}</p>
                <p className={`text-3xl font-bold text-slate-800 mt-1`}>{value}</p>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color.bg}`}>
                <Icon className={`w-6 h-6 ${color.text}`} />
            </div>
        </div>
    </div>
);

const TabButton = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}>
        {label}
    </button>
);

// --- MAIN COMPONENT ---
const FinanceFeeCollection = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [view, setView] = useState('dashboard'); // 'dashboard', 'course_details'
    
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showFeeModal, setShowFeeModal] = useState(false);

    // Fetch initial data (all students and all courses)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [studentsRes, coursesRes] = await Promise.all([
                    fetch('https://sih-4ptm.onrender.com/api/v1/payment/all-students', { credentials: 'include' }),
                    fetch('https://sih-4ptm.onrender.com/api/v1/course', { credentials: 'include' })
                ]);

                if (!studentsRes.ok) throw new Error('Failed to fetch students.');
                if (!coursesRes.ok) throw new Error('Failed to fetch courses.');

                const studentsData = await studentsRes.json();
                const coursesData = await coursesRes.json();
                
                setStudents(studentsData);
                setCourses(coursesData);
                setError('');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const dashboardStats = useMemo(() => {
        const totalStudents = students.length;
        const totalCourses = courses.length;
        const totalPending = students.reduce((acc, student) => acc + (student.stats?.overallPending || 0), 0);
        const studentsWithDues = students.filter(s => s.stats?.overallPending > 0).length;
        return { totalStudents, totalCourses, totalPending, studentsWithDues };
    }, [students, courses]);

    if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-indigo-600" /></div>;
    if (error) return <div className="text-center p-10"><AlertTriangle className="mx-auto w-12 h-12 text-red-500" /><p className="mt-4 text-red-600">{error}</p></div>;

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setView('course_details');
    };
    
    return (
        <div className="min-h-screen bg-slate-50 p-8">
             <SendFeeModal isOpen={showFeeModal} onClose={() => setShowFeeModal(false)} courses={courses} />
            
            {view === 'dashboard' && (
                <>
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Fee Management Dashboard</h1>
                            <p className="mt-1 text-slate-600">Overview of all student financial records.</p>
                        </div>
                        <button onClick={() => setShowFeeModal(true)} className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-sm">
                            <Send size={16} /> Send Semester Fee Request
                        </button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Students" value={dashboardStats.totalStudents} icon={Users} color={{bg: 'bg-blue-100', text: 'text-blue-600'}} />
                        <StatCard title="Total Courses" value={dashboardStats.totalCourses} icon={BookOpen} color={{bg: 'bg-purple-100', text: 'text-purple-600'}} />
                        <StatCard title="Students with Dues" value={dashboardStats.studentsWithDues} icon={AlertTriangle} color={{bg: 'bg-yellow-100', text: 'text-yellow-600'}} />
                        <StatCard title="Total Pending Amount" value={`₹${(dashboardStats.totalPending / 100000).toFixed(2)} L`} icon={IndianRupee} color={{bg: 'bg-rose-100', text: 'text-rose-600'}} />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <TabButton label="All Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                            <TabButton label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                        </div>
                        
                        {activeTab === 'students' && <AllStudentsTable students={students} />}
                        {activeTab === 'courses' && <CoursesTable courses={courses} onCourseClick={handleCourseClick} />}
                    </div>
                </>
            )}

            {view === 'course_details' && selectedCourse && (
                <CourseDetailView course={selectedCourse} students={students} onBack={() => setView('dashboard')} />
            )}
        </div>
    );
};

// --- TABLE & VIEW COMPONENTS ---

const AllStudentsTable = ({ students }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredStudents = useMemo(() => students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ), [students, searchTerm]);

    return (
        <div>
            <div className="mb-4 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by student name or registration no..." className="w-full max-w-md pl-10 pr-4 py-2 border border-slate-300 rounded-lg"/>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="p-4">Student Name</th><th className="p-4">Course</th><th className="p-4">Current Sem</th><th className="p-4 text-right">Pending Dues</th></tr></thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredStudents.map(s => (
                            <tr key={s._id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-800">{s.name}<p className="font-normal text-slate-500">{s.registrationNumber}</p></td>
                                <td className="p-4 text-slate-600">{s.course.branch}</td>
                                <td className="p-4 text-slate-600">{s.currentSemester}</td>
                                <td className="p-4 text-right font-semibold text-rose-600">{`₹${(s.stats.overallPending || 0).toLocaleString('en-IN')}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CoursesTable = ({ courses, onCourseClick }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
            <div key={course._id} onClick={() => onCourseClick(course)} className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-colors">
                <h3 className="font-bold text-slate-800">{course.branch || course.degree}</h3>
                <p className="text-sm text-slate-500">{course.degree} ({course.totalSemester} Semesters)</p>
            </div>
        ))}
    </div>
);

const CourseDetailView = ({ course, students, onBack }) => {
    const [selectedSem, setSelectedSem] = useState(null);

    const studentsInCourse = useMemo(() => students.filter(s => s.course._id === course._id), [students, course]);
    const studentsInSemester = useMemo(() => selectedSem ? studentsInCourse.filter(s => s.currentSemester === selectedSem) : [], [studentsInCourse, selectedSem]);

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-6 font-medium">
                <ChevronsRight className="rotate-180" size={16} /> Back to Dashboard
            </button>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">{course.branch}</h1>
                <p className="mt-1 text-slate-600">{course.degree} - {course.totalSemester} Semesters</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-slate-800 mb-3">Semesters</h3>
                    <div className="space-y-2">
                        {course.semesters.map(sem => (
                            <div key={sem.semesterNumber} onClick={() => setSelectedSem(sem.semesterNumber)} className={`p-3 rounded-lg border cursor-pointer ${selectedSem === sem.semesterNumber ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                Semester {sem.semesterNumber}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-3">{selectedSem ? `Students in Semester ${selectedSem}` : 'Select a semester to view students'}</h3>
                    {selectedSem && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="p-3">Student Name</th><th className="p-3 text-right">Pending Dues</th></tr></thead>
                                <tbody className="divide-y divide-slate-200">
                                    {studentsInSemester.map(s => (
                                        <tr key={s._id}>
                                            <td className="p-3">{s.name}</td>
                                            <td className="p-3 text-right font-semibold text-rose-600">{`₹${(s.stats.overallPending || 0).toLocaleString('en-IN')}`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {studentsInSemester.length === 0 && <p className="text-center text-slate-500 p-8">No students found in this semester.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- SEND FEE MODAL ---
const SendFeeModal = ({ isOpen, onClose, courses }) => {
    const [formData, setFormData] = useState({ courseId: '', semester: '', tuitionFee: '', examFee: '', otherFee: '' });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    
    const selectedCourse = courses.find(c => c._id === formData.courseId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.courseId || !formData.semester || !formData.tuitionFee || !formData.examFee) {
            setError('Please fill all required fields.');
            return;
        }
        setProcessing(true);
        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/payment/send-semester-fee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    tuitionFee: Number(formData.tuitionFee),
                    examFee: Number(formData.examFee),
                    otherFee: Number(formData.otherFee) || 0,
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to send fee request.');
            alert(result.message); // Using alert for simplicity, could be replaced with a toast
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Send New Semester Fee Request</h2>
                    <button onClick={onClose} disabled={processing} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Course *</label>
                            <select value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value, semester: ''})} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                <option value="">Select a course</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.branch}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Semester *</label>
                            <select value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" disabled={!selectedCourse}>
                                <option value="">Select a semester</option>
                                {selectedCourse && selectedCourse.semesters.map(s => <option key={s.semesterNumber} value={s.semesterNumber}>{s.semesterNumber}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tuition Fee (₹) *</label>
                            <input type="number" value={formData.tuitionFee} onChange={e => setFormData({...formData, tuitionFee: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Exam Fee (₹) *</label>
                            <input type="number" value={formData.examFee} onChange={e => setFormData({...formData, examFee: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Other Fee (₹)</label>
                            <input type="number" value={formData.otherFee} onChange={e => setFormData({...formData, otherFee: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100">Cancel</button>
                    <button onClick={handleSubmit} disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center font-semibold">
                        {processing ? <Loader2 size={16} className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
                        {processing ? 'Sending...' : 'Send Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinanceFeeCollection;