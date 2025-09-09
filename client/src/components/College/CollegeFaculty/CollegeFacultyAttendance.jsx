import React, { useEffect, useMemo, useState } from 'react';
import {
    Book,
    User,
    Calendar,
    Check,
    X,
    ClipboardCheck,
    AlertCircle,
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';

// This is a placeholder for your actual API base URL
const BASE_API_URL = "https://your-api-base-url.com/api/v1";

// --- Mock API Data (for demonstration) ---
// This would be fetched from your backend in a real application
const mockSubjects = [
    { id: 'cs101', name: 'Introduction to Computer Science', class: 'B.Tech - 1st Year (CS)', students: 65 },
    { id: 'math202', name: 'Linear Algebra', class: 'B.Sc - 2nd Year (Math)', students: 42 },
    { id: 'phy301', name: 'Quantum Mechanics', class: 'M.Sc - 1st Year (Physics)', students: 28 },
];

const mockStudents = {
    'cs101': [
        { regNo: 'CS2023001', name: 'Aarav Sharma', attendance: { attended: 45, total: 60, percentage: 75 } },
        { regNo: 'CS2023002', name: 'Bhavna Kumari', attendance: { attended: 30, total: 60, percentage: 50 } },
        { regNo: 'CS2023003', name: 'Chetan Singh', attendance: { attended: 58, total: 60, percentage: 96.67 } },
        { regNo: 'CS2023004', name: 'Divya Patel', attendance: { attended: 40, total: 60, percentage: 66.67 } },
        { regNo: 'CS2023005', name: 'Eklavya Yadav', attendance: { attended: 52, total: 60, percentage: 86.67 } },
        { regNo: 'CS2023006', name: 'Fatima Khan', attendance: { attended: 55, total: 60, percentage: 91.67 } },
        { regNo: 'CS2023007', name: 'Gaurav Kumar', attendance: { attended: 48, total: 60, percentage: 80 } },
        { regNo: 'CS2023008', name: 'Hina Malhotra', attendance: { attended: 35, total: 60, percentage: 58.33 } },
        { regNo: 'CS2023009', name: 'Ishan Gupta', attendance: { attended: 50, total: 60, percentage: 83.33 } },
        { regNo: 'CS2023010', name: 'Jasmine Kaur', attendance: { attended: 49, total: 60, percentage: 81.67 } },
        { regNo: 'CS2023011', name: 'Karan Sharma', attendance: { attended: 25, total: 60, percentage: 41.67 } },
        { regNo: 'CS2023012', name: 'Lata Singh', attendance: { attended: 59, total: 60, percentage: 98.33 } },
        { regNo: 'CS2023013', name: 'Mohit Kumar', attendance: { attended: 50, total: 60, percentage: 83.33 } },
        { regNo: 'CS2023014', name: 'Nisha Gupta', attendance: { attended: 38, total: 60, percentage: 63.33 } },
        { regNo: 'CS2023015', name: 'Pranav Joshi', attendance: { attended: 42, total: 60, percentage: 70 } },
        { regNo: 'CS2023016', name: 'Riya Malhotra', attendance: { attended: 55, total: 60, percentage: 91.67 } },
        { regNo: 'CS2023017', name: 'Sarthak Singh', attendance: { attended: 58, total: 60, percentage: 96.67 } },
        { regNo: 'CS2023018', name: 'Tanya Yadav', attendance: { attended: 45, total: 60, percentage: 75 } },
        { regNo: 'CS2023019', name: 'Uday Sharma', attendance: { attended: 30, total: 60, percentage: 50 } },
        { regNo: 'CS2023020', name: 'Vandana Kumari', attendance: { attended: 22, total: 60, percentage: 36.67 } },
    ],
    'math202': [
        { regNo: 'MA2023001', name: 'Alok Kumar', attendance: { attended: 35, total: 50, percentage: 70 } },
        { regNo: 'MA2023002', name: 'Sana Khan', attendance: { attended: 48, total: 50, percentage: 96 } },
        { regNo: 'MA2023003', name: 'Rahul Verma', attendance: { attended: 40, total: 50, percentage: 80 } },
        { regNo: 'MA2023004', name: 'Priya Singhania', attendance: { attended: 25, total: 50, percentage: 50 } },
        { regNo: 'MA2023005', name: 'Vikram Choudhary', attendance: { attended: 38, total: 50, percentage: 76 } },
        { regNo: 'MA2023006', name: 'Sneha Rao', attendance: { attended: 45, total: 50, percentage: 90 } },
    ],
    'phy301': [
        { regNo: 'PH2023001', name: 'Mohan Lal', attendance: { attended: 20, total: 30, percentage: 66.67 } },
        { regNo: 'PH2023002', name: 'Anjali Das', attendance: { attended: 28, total: 30, percentage: 93.33 } },
        { regNo: 'PH2023003', name: 'Arjun Reddy', attendance: { attended: 15, total: 30, percentage: 50 } },
        { regNo: 'PH2023004', name: 'Shreya Roy', attendance: { attended: 25, total: 30, percentage: 83.33 } },
        { regNo: 'PH2023005', name: 'Vivek Sharma', attendance: { attended: 18, total: 30, percentage: 60 } },
    ]
};

// Mock detailed attendance history for a single student
const mockStudentHistory = {
    'CS2023001': [
        { date: '2025-08-20', status: 'Present' },
        { date: '2025-08-21', status: 'Present' },
        { date: '2025-08-22', status: 'Absent' },
        { date: '2025-08-23', status: 'Present' },
        { date: '2025-08-24', status: 'Present' },
        { date: '2025-08-25', status: 'Absent' },
        { date: '2025-08-26', status: 'Present' },
        { date: '2025-08-27', status: 'Present' },
        { date: '2025-08-28', status: 'Leave' },
        { date: '2025-08-29', status: 'Present' },
    ],
    'MA2023001': [
        { date: '2025-08-20', status: 'Present' },
        { date: '2025-08-21', status: 'Present' },
        { date: '2025-08-22', status: 'Present' },
        { date: '2025-08-23', status: 'Absent' },
        { date: '2025-08-24', status: 'Present' },
        { date: '2025-08-25', status: 'Absent' },
    ],
    'PH2023003': [
        { date: '2025-08-20', status: 'Present' },
        { date: '2025-08-21', status: 'Present' },
        { date: '2025-08-22', status: 'Absent' },
    ],
};

// Helper function to determine attendance status color and text
function getAttendanceStatus(percentage) {
    if (percentage > 75) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 60) return { text: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Low', color: 'bg-red-100 text-red-800' };
}

function AttendanceStatusBadge({ status }) {
    let color = 'bg-gray-200 text-gray-800';
    let text = 'N/A';
    if (status === 'Present') {
        color = 'bg-green-100 text-green-800';
        text = 'Present';
    } else if (status === 'Absent') {
        color = 'bg-red-100 text-red-800';
        text = 'Absent';
    } else if (status === 'Leave') {
        color = 'bg-yellow-100 text-yellow-800';
        text = 'Leave';
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{text}</span>;
}

function CollegeFacultyAttendance() {
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const [attendance, setAttendance] = useState({});
    const [savingAttendance, setSavingAttendance] = useState(false);

    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State for the date-wise attendance modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentHistory, setStudentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    function showNotification(message, type = "success") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }

    // --- Data Fetching Logic (simulated) ---
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoadingSubjects(true);
            try {
                setTimeout(() => {
                    setSubjects(mockSubjects);
                    setLoadingSubjects(false);
                }, 1000);
            } catch (error) {
                setLoadingSubjects(false);
                showNotification("Failed to load subjects. Please refresh.", "error");
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedSubjectId) {
                setStudents([]);
                return;
            }
            setLoadingStudents(true);
            setAttendance({}); // Clear attendance on subject change
            try {
                setTimeout(() => {
                    const fetchedStudents = mockStudents[selectedSubjectId] || [];
                    setStudents(fetchedStudents);
                    // Initialize attendance state to 'Present' for all students
                    const initialAttendance = fetchedStudents.reduce((acc, student) => {
                        acc[student.regNo] = 'P';
                        return acc;
                    }, {});
                    setAttendance(initialAttendance);
                    setLoadingStudents(false);
                }, 800);
            } catch (error) {
                setLoadingStudents(false);
                showNotification("Failed to load students. Try again.", "error");
            }
        };
        fetchStudents();
    }, [selectedSubjectId]);

    // --- Handlers ---
    const handleAttendanceChange = (regNo, status) => {
        setAttendance(prev => ({
            ...prev,
            [regNo]: status,
        }));
    };

    const handleSubmitAttendance = async () => {
        setSavingAttendance(true);
        try {
            // Simulate API call to save attendance
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // On success, update the students' attendance stats
            const updatedStudents = students.map(student => {
                const dailyStatus = attendance[student.regNo];
                if (dailyStatus === 'P') {
                    const newAttended = student.attendance.attended + 1;
                    const newTotal = student.attendance.total + 1;
                    const newPercentage = (newAttended / newTotal) * 100;
                    return {
                        ...student,
                        attendance: {
                            attended: newAttended,
                            total: newTotal,
                            percentage: newPercentage
                        }
                    };
                } else {
                    const newTotal = student.attendance.total + 1;
                    const newPercentage = (student.attendance.attended / newTotal) * 100;
                    return {
                        ...student,
                        attendance: {
                            ...student.attendance,
                            total: newTotal,
                            percentage: newPercentage
                        }
                    };
                }
            });
            setStudents(updatedStudents);
            setSavingAttendance(false);
            showNotification("Attendance submitted successfully!");
        } catch (error) {
            showNotification("Failed to submit attendance. Please try again.", "error");
            setSavingAttendance(false);
        }
    };

    const handleStudentClick = async (student) => {
        setSelectedStudent(student);
        setShowHistoryModal(true);
        setLoadingHistory(true);
        try {
            // Simulate API call to fetch date-wise history
            await new Promise(resolve => setTimeout(resolve, 1000));
            const history = mockStudentHistory[student.regNo] || [];
            setStudentHistory(history);
        } catch (error) {
            showNotification("Failed to load history.", "error");
            setStudentHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    // --- Data Filtering and Memoization ---
    const filteredStudents = useMemo(() => {
        const query = searchTerm.toLowerCase();
        return students.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.regNo.toLowerCase().includes(query)
        );
    }, [students, searchTerm]);

    const currentSubject = subjects.find(s => s.id === selectedSubjectId);

    return (
        <div className="min-h-screen p-6 bg-slate-50 font-sans">
            {notification && (
                <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {notification.type === "success" ? <ClipboardCheck size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/10"><X size={16} /></button>
                </div>
            )}

            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Calendar size={28} className="text-blue-600" />
                Mark Today's Attendance
            </h1>

            {/* Subject Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Book size={20} className="text-slate-500" />
                        Select Subject & Class
                    </h2>
                </div>
                <div className="p-6">
                    {loadingSubjects ? (
                        <div className="flex items-center gap-2 text-slate-500">
                            <Loader2 size={16} className="animate-spin" /> Loading subjects...
                        </div>
                    ) : subjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subjects.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => setSelectedSubjectId(subject.id)}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${selectedSubjectId === subject.id ? "bg-blue-50 border-blue-600 ring-4 ring-blue-100" : "bg-white border-slate-200 hover:border-blue-300"}`}
                                >
                                    <h3 className={`font-semibold text-base mb-1 ${selectedSubjectId === subject.id ? "text-blue-800" : "text-slate-700"}`}>{subject.name}</h3>
                                    <p className="text-sm text-slate-500">{subject.class}</p>
                                    <p className="text-xs font-medium text-slate-400 mt-2">{subject.students} Students</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <Book size={32} className="mx-auto mb-2" />
                            No subjects assigned to you.
                        </div>
                    )}
                </div>
            </div>

            {/* Attendance Table */}
            {selectedSubjectId && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-slate-800">{currentSubject?.name}</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search student..."
                                    className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[800px] text-sm">
                            <thead className="bg-slate-50 text-slate-600 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium w-12">#</th>
                                    <th className="px-4 py-2 text-left font-medium">Student Name</th>
                                    <th className="px-4 py-2 text-left font-medium">Registration No.</th>
                                    <th className="px-4 py-2 text-center font-medium">Semester Attendance</th>
                                    <th className="px-4 py-2 text-center font-medium w-48">Mark Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingStudents ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500">
                                            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                                            Loading student list...
                                        </td>
                                    </tr>
                                ) : filteredStudents.length > 0 ? (
                                    filteredStudents.map((student, index) => (
                                        <tr 
                                            key={student.regNo} 
                                            className="hover:bg-slate-50 cursor-pointer" 
                                            onClick={() => handleStudentClick(student)}
                                        >
                                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                                            <td className="px-4 py-3 text-slate-600">{student.regNo}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-semibold text-slate-800">
                                                        {student.attendance.attended} / {student.attendance.total}
                                                    </span>
                                                    <span className={`px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${getAttendanceStatus(student.attendance.percentage).color}`}>
                                                        {student.attendance.percentage.toFixed(1)}% ({getAttendanceStatus(student.attendance.percentage).text})
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleAttendanceChange(student.regNo, 'P')}
                                                        className={`p-2 rounded-md transition-colors ${attendance[student.regNo] === 'P' ? 'bg-green-100 text-green-800 ring-2 ring-green-300' : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-700'}`}
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAttendanceChange(student.regNo, 'A')}
                                                        className={`p-2 rounded-md transition-colors ${attendance[student.regNo] === 'A' ? 'bg-red-100 text-red-800 ring-2 ring-red-300' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'}`}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500">
                                            <User size={32} className="mx-auto mb-2" />
                                            {searchTerm ? `No student found for "${searchTerm}"` : "No students in this class yet."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between">
                        <div>
                            <span className="text-sm font-medium text-slate-600">Total Students: {students.length}</span>
                        </div>
                        <button
                            onClick={handleSubmitAttendance}
                            disabled={savingAttendance || filteredStudents.length === 0}
                            className={`px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors ${savingAttendance ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        >
                            {savingAttendance ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />}
                            {savingAttendance ? "Submitting..." : "Submit Attendance"}
                        </button>
                    </div>
                </div>
            )}

            {/* Student Attendance History Modal */}
            {showHistoryModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg bg-white rounded-lg flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Attendance History — {selectedStudent?.name}</h3>
                            <button onClick={() => setShowHistoryModal(false)} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button>
                        </div>
                        <div className="px-6 py-4 overflow-y-auto grow">
                            {loadingHistory ? (
                                <div className="py-12 text-center text-slate-500">
                                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                                    Loading history...
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {studentHistory.length > 0 ? studentHistory.map((record, index) => (
                                        <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
                                            <span className="text-sm font-medium text-slate-700">{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            <AttendanceStatusBadge status={record.status} />
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <Calendar size={32} className="mx-auto mb-2" />
                                            No attendance records found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end gap-2">
                            <button onClick={() => setShowHistoryModal(false)} className="px-4 py-2 rounded-md border">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollegeFacultyAttendance;