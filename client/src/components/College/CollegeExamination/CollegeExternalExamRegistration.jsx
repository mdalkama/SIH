import React, { useState, useEffect } from 'react';
import {
    PlusCircle,
    User,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X,
    Loader2,
    Search,
    ArrowLeft,
    CreditCard,
    ClipboardCheck
} from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

// --- Mock Data ---
const mockStudentData = {
    '20230101': {
        regNo: '20230101',
        name: 'Aarav Kumar',
        course: 'B.Tech.',
        branch: 'Computer Science',
        attendance: 85,
        collegeFeesPaid: { '1': true, '2': false, '3': false, '4': false, '5': false, '6': false }
    },
    '20230102': {
        regNo: '20230102',
        name: 'Priya Sharma',
        course: 'B.Tech.',
        branch: 'Electronics',
        attendance: 78,
        collegeFeesPaid: { '1': true, '2': true, '3': true, '4': false, '5': false, '6': false }
    },
    '20240201': {
        regNo: '20240201',
        name: 'Rahul Yadav',
        course: 'M.Tech.',
        branch: 'Computer Science',
        attendance: 92,
        collegeFeesPaid: { '1': true, '2': true }
    }
};

const mockRegistrationStats = {
    'B.Tech.': {
        '2023': [
            { regNo: '20230101', name: 'Aarav Kumar', branch: 'Computer Science', collegeFeesPaid: { '1': true, '2': false } },
            { regNo: '20230102', name: 'Priya Sharma', branch: 'Electronics', collegeFeesPaid: { '1': true, '2': true } },
            { regNo: '20230103', name: 'Amit Singh', branch: 'Computer Science', collegeFeesPaid: { '1': true, '2': false } },
        ],
        '2024': [
            { regNo: '20240101', name: 'Sneha Gupta', branch: 'Electronics', collegeFeesPaid: { '1': true } },
            { regNo: '20240102', name: 'Vivek Kumar', branch: 'Mechanical', collegeFeesPaid: { '1': false } },
        ]
    },
    'M.Tech.': {
        '2024': [
            { regNo: '20240201', name: 'Rahul Yadav', branch: 'Computer Science', collegeFeesPaid: { '1': true, '2': true } }
        ],
        '2025': []
    }
};

const CollegeExternalExamRegistration = () => {
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'student-lookup' | 'register-form' | 'registered-students'
    const [searchTerm, setSearchTerm] = useState('');
    const [foundStudent, setFoundStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationFormData, setRegistrationFormData] = useState({
        regNo: '',
        semester: '',
        examFeePaid: false
    });
    const [stats, setStats] = useState({});
    const [selectedStats, setSelectedStats] = useState({ course: null, batch: null });

    // --- Toast & Notification State
    const [toasts, setToasts] = useState([]);
    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // --- Mock API call for stats
    useEffect(() => {
        const fetchStats = () => {
            setIsLoading(true);
            setTimeout(() => {
                setStats(mockRegistrationStats);
                setIsLoading(false);
            }, 500);
        };
        fetchStats();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFoundStudent(null);
        
        const student = mockStudentData[searchTerm];
        setTimeout(() => {
            if (student) {
                setFoundStudent(student);
                addToast('success', `Student found: ${student.name}`);
            } else {
                addToast('error', `Student with registration number "${searchTerm}" not found.`);
                setFoundStudent(null);
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleRegistration = (e) => {
        e.preventDefault();
        setIsRegistering(true);
        addToast('info', 'Processing registration...');

        setTimeout(() => {
            if (foundStudent) {
                const semesterFeesPaid = foundStudent?.collegeFeesPaid?.[registrationFormData.semester];
                const examFeesPaid = registrationFormData.examFeePaid;
                
                if (semesterFeesPaid && examFeesPaid) {
                    addToast('success', `Registration for ${foundStudent.name} successful for Semester ${registrationFormData.semester}.`);
                    
                    setRegistrationFormData({ regNo: '', semester: '', examFeePaid: false });
                    setFoundStudent(null);
                    setSearchTerm('');
                    setView('dashboard');
                } else if (!semesterFeesPaid) {
                    addToast('error', `Student has unpaid college fees for semester ${registrationFormData.semester}. Cannot register.`);
                } else {
                    addToast('error', 'Exam fees have not been paid. Cannot confirm registration.');
                }
            }
            setIsRegistering(false);
        }, 2000);
    };

    const handleExamFeePayment = () => {
        addToast('info', 'Simulating exam fee payment...');
        setTimeout(() => {
            setRegistrationFormData(prev => ({ ...prev, examFeePaid: true }));
            addToast('success', `Exam fee paid successfully for ${foundStudent.name}.`);
        }, 1500);
    };
    
    const handleViewRegisteredStudents = (course, batch) => {
        setSelectedStats({ course, batch });
        setView('registered-students');
    };

    const renderDashboard = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Registration Stats</h2>
                <button
                    onClick={() => setView('student-lookup')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={18} /> New Registration
                </button>
            </div>
            
            {isLoading ? (
                <div className="p-10 text-center"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(stats).length > 0 ? (
                        Object.entries(stats).map(([course, batches]) => (
                            <div key={course} className="bg-white rounded-lg border shadow-sm p-5">
                                <h3 className="font-bold text-lg text-blue-600">{course}</h3>
                                <div className="mt-4 space-y-2">
                                    {Object.entries(batches).map(([batch, students]) => (
                                        <div key={`${course}-${batch}`} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                                            <span className="text-sm text-gray-600">Batch {batch}</span>
                                            <button onClick={() => handleViewRegisteredStudents(course, batch)} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                                {students.length} Registered
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-3 text-center p-16 text-gray-500">No registration stats available.</div>
                    )}
                </div>
            )}
        </>
    );
    
    const renderRegisteredStudentsView = () => {
        const { course, batch } = selectedStats;
        const students = mockRegistrationStats[course][batch];

        return (
            <>
                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors"><ArrowLeft size={16} /> Back to Dashboard</button>
                <div className="bg-white rounded-lg border shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Registered Students for {course} - Batch {batch}</h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="bg-gray-50 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3 text-left">Reg No</th>
                                    <th className="px-6 py-3 text-left">Student Name</th>
                                    <th className="px-6 py-3 text-left">Branch</th>
                                    <th className="px-6 py-3 text-center">College Fees (Sem 1)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={student.regNo} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                {String(index + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {student.regNo}
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.branch}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {student.collegeFeesPaid['1'] ? (
                                                    <span className="text-green-600 flex justify-center"><CheckCircle size={18} /></span>
                                                ) : (
                                                    <span className="text-red-600 flex justify-center"><XCircle size={18} /></span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-500">
                                            No students found for this batch.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    const renderStudentLookup = () => (
        <>
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors"><ArrowLeft size={16} /> Back to Dashboard</button>
            <div className="bg-white rounded-lg border shadow-sm p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Find Student for Registration</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-grow">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Enter Registration Number"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
                    </button>
                </form>

                {foundStudent && (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50 animate-fade-in">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <User size={20} className="text-blue-600"/> {foundStudent.name}
                        </h3>
                        <div className="mt-3 text-sm grid grid-cols-2 md:grid-cols-3 gap-2">
                            <p><strong>Reg No:</strong> {foundStudent.regNo}</p>
                            <p><strong>Course:</strong> {foundStudent.course}</p>
                            <p><strong>Branch:</strong> {foundStudent.branch}</p>
                            <p><strong>Attendance:</strong> {foundStudent.attendance}%</p>
                            <div className="md:col-span-2">
                                <strong>College Fees:</strong>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {Object.entries(foundStudent.collegeFeesPaid).map(([sem, paid]) => (
                                        <span key={sem} className={`px-2 py-1 text-xs font-semibold rounded-full ${paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            Sem {sem}: {paid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setView('register-form');
                                    setRegistrationFormData(prev => ({ ...prev, regNo: foundStudent.regNo }));
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <PlusCircle size={18} /> Proceed to Register
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    const renderRegistrationForm = () => {
        const semesterFeesPaid = foundStudent?.collegeFeesPaid?.[registrationFormData.semester];
        const isReadyToRegister = registrationFormData.semester && semesterFeesPaid && registrationFormData.examFeePaid;

        return (
            <>
                <button onClick={() => setView('student-lookup')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors"><ArrowLeft size={16} /> Back</button>
                <div className="bg-white rounded-lg border shadow-sm p-6 max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Register for Exam</h2>
                    <div className="p-4 border rounded-lg bg-gray-50 mb-6">
                        <h3 className="font-bold text-lg text-gray-800">{foundStudent.name}</h3>
                        <p className="text-sm text-gray-500">{foundStudent.regNo} | {foundStudent.course}, {foundStudent.branch}</p>
                    </div>
                    <form onSubmit={handleRegistration}>
                        <div className="mb-4">
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Select Semester</label>
                            <select
                                id="semester"
                                name="semester"
                                value={registrationFormData.semester}
                                onChange={e => setRegistrationFormData(prev => ({...prev, semester: e.target.value, examFeePaid: false}))}
                                className="mt-1 block w-full p-2 border rounded-lg bg-white"
                                required
                            >
                                <option value="">-- Select Semester --</option>
                                <option value="1">1st Semester</option>
                                <option value="2">2nd Semester</option>
                                <option value="3">3rd Semester</option>
                                <option value="4">4th Semester</option>
                                <option value="5">5th Semester</option>
                                <option value="6">6th Semester</option>
                            </select>
                            {registrationFormData.semester && (
                                <p className={`mt-2 text-sm font-semibold ${semesterFeesPaid ? 'text-green-600' : 'text-red-600'}`}>
                                    {semesterFeesPaid ? '✅ College fees paid for this semester.' : '❌ College fees for this semester are unpaid. Cannot proceed.'}
                                </p>
                            )}
                        </div>

                        {semesterFeesPaid && (
                            <div className="mb-6 p-4 border rounded-lg bg-gray-50 animate-fade-in">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">External Exam Fee</label>
                                    {registrationFormData.examFeePaid ? (
                                        <span className="text-sm font-semibold text-green-600 flex items-center gap-1"><CheckCircle size={16} /> Paid</span>
                                    ) : (
                                        <button type="button" onClick={handleExamFeePayment} disabled={isRegistering} className="text-sm text-blue-600 hover:underline disabled:text-gray-400">Pay Now</button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
                                    <CreditCard size={20} className="text-blue-600 flex-shrink-0"/>
                                    <span className="text-sm font-medium text-gray-800">Total Fee: ₹1000</span>
                                </div>
                            </div>
                        )}
                        

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setView('student-lookup')} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button
                                type="submit"
                                disabled={isRegistering || !isReadyToRegister}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-green-300 flex items-center gap-2"
                            >
                                {isRegistering ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />}
                                {isRegistering ? 'Registering...' : 'Confirm Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </>
        );
    };

    const Toast = ({ message, type, onClose }) => {
        const icons = { success: <CheckCircle className="text-green-500" />, error: <XCircle className="text-red-500" />, info: <Info className="text-blue-500" /> };
        const styles = { success: "bg-green-50 border-green-200", error: "bg-red-50 border-red-200", info: "bg-blue-50 border-blue-200" };
        return (<div className={`flex items-center gap-3 p-4 rounded-lg border shadow-md ${styles[type]}`}> <div className="flex-shrink-0">{icons[type]}</div> <div className="flex-1 text-sm text-gray-800">{message}</div> <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-gray-600" /></button> </div>);
    };

    const ToastContainer = ({ toasts, setToasts }) => {
        const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
        return (<div className="fixed top-5 right-5 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
    };

    return (
        <div className="min-h-screen p-6 font-sans bg-gray-100">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="max-w-7xl mx-auto">
                {view === 'dashboard' ? renderDashboard() : view === 'student-lookup' ? renderStudentLookup() : view === 'registered-students' ? renderRegisteredStudentsView() : renderRegistrationForm()}
            </div>
        </div>
    );
};

export default CollegeExternalExamRegistration;