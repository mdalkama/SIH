import React, { useEffect, useMemo, useState } from 'react';
import {
    Book,
    FileText,
    ClipboardCheck,
    AlertCircle,
    Loader2,
    UploadCloud,
    CornerDownLeft,
    X,
} from 'lucide-react';

// This is a placeholder for your actual API base URL
const BASE_API_URL = "https://your-api-base-url.com/api/v1";

// --- Mock API Data (for demonstration) ---
const mockSubjectsWithAssessments = [
    {
        id: 'cs101',
        name: 'Introduction to Computer Science',
        class: 'B.Tech - 1st Year (CS)',
        assessments: [
            { id: 'internal_test1', name: 'Internal Test 1', maxMarks: 20 },
            { id: 'assignment', name: 'Assignment', maxMarks: 10 },
            { id: 'lab_copy', name: 'Lab Copy', maxMarks: 5 },
            { id: 'attendance_marks', name: 'Attendance Marks', maxMarks: 5 },
        ],
    },
    {
        id: 'math202',
        name: 'Linear Algebra',
        class: 'B.Sc - 2nd Year (Math)',
        assessments: [
            { id: 'internal_test1', name: 'Internal Test 1', maxMarks: 25 },
            { id: 'internal_test2', name: 'Internal Test 2', maxMarks: 25 },
            { id: 'attendance_marks', name: 'Attendance Marks', maxMarks: 10 },
        ],
    },
    {
        id: 'phy301',
        name: 'Quantum Mechanics',
        class: 'M.Sc - 1st Year (Physics)',
        assessments: [
            { id: 'internal_test1', name: 'Internal Test 1', maxMarks: 20 },
            { id: 'practical', name: 'Practical Exam', maxMarks: 30 },
            { id: 'assignment', name: 'Assignment', maxMarks: 10 },
        ],
    },
];

const mockStudentsWithMarks = {
    'cs101': [
        { regNo: 'CS2023001', name: 'Aarav Sharma', marks: { internal_test1: 18, assignment: 9, lab_copy: 4, attendance_marks: 5 } },
        { regNo: 'CS2023002', name: 'Bhavna Kumari', marks: { internal_test1: 15, assignment: 8, lab_copy: 3, attendance_marks: 4 } },
        { regNo: 'CS2023003', name: 'Chetan Singh', marks: { internal_test1: 20, assignment: 10, lab_copy: 5, attendance_marks: 5 } },
        { regNo: 'CS2023004', name: 'Divya Patel', marks: { internal_test1: 16, assignment: 7, lab_copy: 3, attendance_marks: 4 } },
        { regNo: 'CS2023005', name: 'Eklavya Yadav', marks: { internal_test1: 19, assignment: 9, lab_copy: 5, attendance_marks: 5 } },
        { regNo: 'CS2023006', name: 'Fatima Khan', marks: { internal_test1: 17, assignment: 8, lab_copy: 4, attendance_marks: 4 } },
        { regNo: 'CS2023007', name: 'Gaurav Kumar', marks: { internal_test1: 14, assignment: 6, lab_copy: 3, attendance_marks: 3 } },
        { regNo: 'CS2023008', name: 'Hina Malhotra', marks: { internal_test1: 18, assignment: 9, lab_copy: 4, attendance_marks: 5 } },
    ],
    'math202': [
        { regNo: 'MA2023001', name: 'Alok Kumar', marks: { internal_test1: 22, internal_test2: 20, attendance_marks: 8 } },
        { regNo: 'MA2023002', name: 'Sana Khan', marks: { internal_test1: 25, internal_test2: 24, attendance_marks: 10 } },
        { regNo: 'MA2023003', name: 'Rahul Verma', marks: { internal_test1: 18, internal_test2: 21, attendance_marks: 9 } },
        { regNo: 'MA2023004', name: 'Priya Singhania', marks: { internal_test1: 20, internal_test2: 22, attendance_marks: 7 } },
        { regNo: 'MA2023005', name: 'Vikram Choudhary', marks: { internal_test1: 23, internal_test2: 23, attendance_marks: 9 } },
    ],
    'phy301': [
        { regNo: 'PH2023001', name: 'Mohan Lal', marks: { internal_test1: 15, practical: 25, assignment: 9 } },
        { regNo: 'PH2023002', name: 'Anjali Das', marks: { internal_test1: 19, practical: 28, assignment: 10 } },
        { regNo: 'PH2023003', name: 'Arjun Reddy', marks: { internal_test1: 12, practical: 20, assignment: 7 } },
        { regNo: 'PH2023004', name: 'Shreya Roy', marks: { internal_test1: 18, practical: 26, assignment: 9 } },
    ],
};

function CollegeFacultyMarks() {
    // UI state for loading and notifications
    const [notification, setNotification] = useState(null);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [savingMarks, setSavingMarks] = useState(false);

    // Data state
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // Stores marks for all students & assessments

    function showNotification(message, type = "success") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }

    // --- Data Fetching Logic (Simulated) ---
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoadingSubjects(true);
            try {
                setTimeout(() => {
                    setSubjects(mockSubjectsWithAssessments);
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
        if (!selectedSubjectId) {
            setStudents([]);
            setMarks({});
            return;
        }

        // Simulate fetching students and their existing marks for the selected subject
        const fetchedStudents = mockStudentsWithMarks[selectedSubjectId] || [];
        setStudents(fetchedStudents);

        // Pre-fill the marks state from the fetched data
        const initialMarks = {};
        fetchedStudents.forEach(student => {
            initialMarks[student.regNo] = { ...student.marks };
        });
        setMarks(initialMarks);
    }, [selectedSubjectId]);

    // --- Handlers ---
    const handleMarkChange = (regNo, assessmentId, value) => {
        const currentSubject = subjects.find(s => s.id === selectedSubjectId);
        const assessment = currentSubject?.assessments.find(a => a.id === assessmentId);
        const maxMarks = assessment ? assessment.maxMarks : Infinity;
        
        const mark = value === '' ? '' : Math.min(Number(value), maxMarks);

        setMarks(prev => ({
            ...prev,
            [regNo]: {
                ...prev[regNo],
                [assessmentId]: mark,
            },
        }));
    };

    const handleSubmitMarks = async () => {
        const currentSubject = subjects.find(s => s.id === selectedSubjectId);
        if (!currentSubject) {
            showNotification("Please select a subject first.", "error");
            return;
        }

        setSavingMarks(true);
        try {
            // Simulate final submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // On success, update the local student data to reflect the new marks
            const updatedStudents = students.map(student => {
                const newMarks = marks[student.regNo] || {};
                return {
                    ...student,
                    marks: newMarks,
                };
            });
            setStudents(updatedStudents);
            
            setSavingMarks(false);
            showNotification("Marks submitted and updated successfully!");
        } catch (error) {
            showNotification("Failed to submit marks. Please try again.", "error");
            setSavingMarks(false);
        }
    };

    // --- Memoized calculations ---
    const currentSubject = useMemo(() => subjects.find(s => s.id === selectedSubjectId), [subjects, selectedSubjectId]);
    
    const maxTotalMarks = useMemo(() => {
        if (!currentSubject) return 0;
        return currentSubject.assessments.reduce((sum, ass) => sum + ass.maxMarks, 0);
    }, [currentSubject]);

    const calculateStudentTotals = useMemo(() => {
        const totals = {};
        students.forEach(student => {
            const studentMarks = marks[student.regNo] || {};
            const total = Object.values(studentMarks).reduce((sum, mark) => sum + (Number(mark) || 0), 0);
            const percentage = maxTotalMarks > 0 ? (total / maxTotalMarks) * 100 : 0;
            totals[student.regNo] = { total: total, percentage: percentage.toFixed(1) };
        });
        return totals;
    }, [students, marks, maxTotalMarks]);

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
                <FileText size={28} className="text-blue-600" />
                Manage Internal Marks
            </h1>

            {/* Subject Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Book size={20} className="text-slate-500" />
                        Select Subject
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
                                    <p className="text-xs font-medium text-slate-400 mt-2">{students.length} Students</p>
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

            {/* Internal Marks Table (Excel-like) */}
            {selectedSubjectId && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-slate-800">
                            Marks for <span className="text-blue-600">{currentSubject.name}</span>
                        </h2>
                        {students.length > 0 && (
                            <button
                                onClick={handleSubmitMarks}
                                disabled={savingMarks}
                                className={`px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors ${savingMarks ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                            >
                                {savingMarks ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                                {savingMarks ? "Submitting..." : "Submit Final Marks"}
                            </button>
                        )}
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-sm">
                            <thead className="bg-slate-50 text-slate-600 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium w-12">#</th>
                                    <th className="px-4 py-2 text-left font-medium w-48">Student Name</th>
                                    {currentSubject.assessments.map(assessment => (
                                        <th key={assessment.id} className="px-4 py-2 text-center font-medium w-32">
                                            {assessment.name} <br />
                                            <span className="text-xs font-normal">(Out of {assessment.maxMarks})</span>
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 text-center font-medium w-24">
                                        Total <br />
                                        <span className="text-xs font-normal">(Out of {maxTotalMarks})</span>
                                    </th>
                                    <th className="px-4 py-2 text-center font-medium w-24">
                                        Percentage
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={student.regNo} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                                            {currentSubject.assessments.map(assessment => (
                                                <td key={assessment.id} className="px-4 py-3 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={assessment.maxMarks}
                                                        value={marks[student.regNo]?.[assessment.id] || ''}
                                                        onChange={(e) => handleMarkChange(student.regNo, assessment.id, e.target.value)}
                                                        className="w-20 px-2 py-1 border rounded-md text-center text-sm focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 text-center font-semibold text-slate-800">
                                                {calculateStudentTotals[student.regNo]?.total || 0}
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono font-semibold text-blue-600">
                                                {calculateStudentTotals[student.regNo]?.percentage || '0.0'}%
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={currentSubject.assessments.length + 3} className="py-12 text-center text-slate-500">
                                            <FileText size={32} className="mx-auto mb-2" />
                                            No students found in this class.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollegeFacultyMarks;