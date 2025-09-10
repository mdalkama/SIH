import React, { useState, useEffect, useMemo } from 'react';
import {
    Calendar,
    PlusCircle,
    Book,
    Loader2,
    ArrowLeft,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ClipboardCheck,
    Clock,
    FlaskConical,
    Save,
    X
} from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

// --- Mock Data ---
// In a real application, this would be fetched from the backend
const mockCourses = [
    { id: 'btech', name: 'B.Tech.', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'mtech', name: 'M.Tech.', semesters: [1, 2, 3, 4] },
    { id: 'mba', name: 'M.B.A.', semesters: [1, 2, 3, 4] },
    { id: 'polytechnic', name: 'Polytechnic', semesters: [1, 2, 3, 4, 5, 6] },
    { id: 'bca', name: 'B.C.A.', semesters: [1, 2, 3, 4, 5, 6] },
];

const mockSubjectsByCourseAndSemester = {
    'btech': {
        '1': [
            { id: 'MA101', name: 'Engineering Mathematics-I' },
            { id: 'CH101', name: 'Engineering Chemistry' },
            { id: 'PH101', name: 'Engineering Physics-I' },
            { id: 'CS101', name: 'Introduction to Computer Science' },
            { id: 'EE101', name: 'Basic Electrical Engineering' },
        ],
        '2': [
            { id: 'MA201', name: 'Engineering Mathematics-II' },
            { id: 'PH201', name: 'Engineering Physics-II' },
            { id: 'ME201', name: 'Basic Mechanical Engineering' },
            { id: 'CS201', name: 'Data Structures and Algorithms' },
            { id: 'EC201', name: 'Basic Electronics' },
        ],
        '3': [
            { id: 'CS301', name: 'Data Structures' },
            { id: 'CS302', name: 'Database Management Systems' },
            { id: 'CS303', name: 'Operating Systems' },
            { id: 'CS304', name: 'Computer Networks' },
            { id: 'CS305', name: 'Digital Logic Design' },
            { id: 'CS306', name: 'Discrete Mathematics' },
            { id: 'CS307', name: 'Environmental Studies' },
        ],
        '4': [
            { id: 'CS401', name: 'Software Engineering' },
            { id: 'CS402', name: 'Theory of Computation' },
            { id: 'CS403', name: 'Artificial Intelligence' },
            { id: 'CS404', name: 'Web Technologies' },
            { id: 'CS405', name: 'Design and Analysis of Algorithms' },
        ]
    },
    'mtech': {
        '1': [
            { id: 'ML101', name: 'Machine Learning' },
            { id: 'DBA102', name: 'Advanced Database Systems' },
            { id: 'CC103', name: 'Cloud Computing' },
        ],
        // Add more mock data for other semesters
    },
    'mba': {
        '1': [
            { id: 'ME101', name: 'Managerial Economics' },
            { id: 'OB102', name: 'Organizational Behavior' },
            { id: 'MM103', name: 'Marketing Management' },
        ],
        // Add more mock data for other semesters
    },
    'polytechnic': {
        '2': [
            { id: 'PT201', name: 'Engineering Drawing' },
            { id: 'PT202', name: 'Applied Physics' },
            { id: 'PT203', name: 'Basic Electrical Engineering' },
            { id: 'PT204', name: 'Workshop Technology' },
            { id: 'PT205', name: 'Computer Hardware' },
        ]
    },
    'bca': {
        '1': [
            { id: 'C101', name: 'Programming in C' },
            { id: 'DE102', name: 'Digital Electronics' },
            { id: 'CO103', name: 'Computer Organization' },
        ]
    }
};

const mockSavedTimetables = [
    {
        id: 'tt-1',
        courseId: 'btech',
        semester: 3,
        timetable: [
            { subjectId: 'CS301', subjectName: 'Data Structures', examType: 'Internal', date: '2025-10-10', time: '10:00' },
            { subjectId: 'CS302', subjectName: 'Database Management Systems', examType: 'Internal', date: '2025-10-12', time: '10:00' },
            { subjectId: 'CS303', subjectName: 'Operating Systems', examType: 'Practical', date: '2025-10-15', time: '14:00' },
        ]
    },
    {
        id: 'tt-2',
        courseId: 'mtech',
        semester: 1,
        timetable: [
            { subjectId: 'ML101', subjectName: 'Machine Learning', examType: 'Internal', date: '2025-11-05', time: '10:00' },
            { subjectId: 'DBA102', subjectName: 'Advanced Database Systems', examType: 'Internal', date: '2025-11-07', time: '14:00' },
        ]
    }
];

const CollegeExamSchedule = () => {
    const [view, setView] = useState('selection'); // 'selection' | 'scheduler' | 'saved'
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [timetable, setTimetable] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [savedTimetables, setSavedTimetables] = useState(mockSavedTimetables);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // Simulate fetching subjects when course and semester are selected
    useEffect(() => {
        if (selectedCourseId && selectedSemester) {
            setIsLoading(true);
            setTimeout(() => {
                const subjects = mockSubjectsByCourseAndSemester[selectedCourseId]?.[selectedSemester] || [];
                const initialTimetable = subjects.map(subject => ({
                    subjectId: subject.id,
                    subjectName: subject.name,
                    examType: 'Internal', // Default to Internal
                    date: '',
                    time: '',
                }));
                setTimetable(initialTimetable);
                setIsLoading(false);
                if (subjects.length === 0) {
                    addToast('info', `No subjects found for this selection.`);
                }
            }, 800);
        }
    }, [selectedCourseId, selectedSemester]);

    const handleTimetableChange = (index, field, value) => {
        const updatedTimetable = [...timetable];
        updatedTimetable[index][field] = value;
        setTimetable(updatedTimetable);
    };

    const handleSaveTimetable = () => {
        // Validate if all fields are filled
        const isComplete = timetable.every(item => item.date && item.time);
        if (!isComplete) {
            addToast('error', 'Please fill in the date and time for all subjects.');
            return;
        }

        setIsSaving(true);
        addToast('info', 'Saving timetable...');

        // Simulate API call to save the timetable
        setTimeout(() => {
            // In a real app, this would be a POST request to your backend
            const newTimetable = {
                id: `tt-${Date.now()}`,
                courseId: selectedCourseId,
                semester: selectedSemester,
                timetable: timetable
            };
            setSavedTimetables(prev => [...prev, newTimetable]);
            addToast('success', 'Timetable saved successfully!');
            setIsSaving(false);
            setView('saved');
        }, 2000);
    };

    const renderSelectionView = () => (
        <div className="bg-white rounded-lg border shadow-sm p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Schedule Exam Timetable</h2>
                <button
                    onClick={() => setView('saved')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <ClipboardCheck size={18} /> View Saved Timetables
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCourses.map(course => (
                    <div key={course.id} className="bg-gray-50 p-4 rounded-lg border shadow-sm">
                        <h3 className="font-bold text-lg text-blue-600">{course.name}</h3>
                        <div className="mt-4 space-y-2">
                            {course.semesters.map(semester => (
                                <button
                                    key={`${course.id}-${semester}`}
                                    onClick={() => {
                                        setSelectedCourseId(course.id);
                                        setSelectedSemester(semester);
                                        setView('scheduler');
                                    }}
                                    className="w-full text-left px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Semester {semester}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSchedulerView = () => {
        const courseName = mockCourses.find(c => c.id === selectedCourseId)?.name;
        
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => {
                        setView('selection');
                        setSelectedCourseId(null);
                        setSelectedSemester(null);
                        setTimetable([]);
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Selection
                </button>
                <div className="bg-white rounded-lg border shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Timetable for {courseName} - Semester {selectedSemester}
                    </h2>
                    
                    {isLoading ? (
                        <div className="p-10 text-center">
                            <Loader2 className="animate-spin text-blue-600" size={48} />
                        </div>
                    ) : timetable.length > 0 ? (
                        <>
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="min-w-full text-sm text-gray-700">
                                    <thead className="bg-gray-50 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Subject</th>
                                            <th className="px-6 py-3 text-left">Exam Type</th>
                                            <th className="px-6 py-3 text-left">Date</th>
                                            <th className="px-6 py-3 text-left">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {timetable.map((item, index) => (
                                            <tr key={item.subjectId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-800">{item.subjectName}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{item.subjectId}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={item.examType}
                                                            onChange={e => handleTimetableChange(index, 'examType', e.target.value)}
                                                            className="p-2 border rounded-lg bg-white w-32"
                                                        >
                                                            <option>Internal</option>
                                                            <option>Practical</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="date"
                                                        value={item.date}
                                                        onChange={e => handleTimetableChange(index, 'date', e.target.value)}
                                                        className="p-2 border rounded-lg"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="time"
                                                        value={item.time}
                                                        onChange={e => handleTimetableChange(index, 'time', e.target.value)}
                                                        className="p-2 border rounded-lg"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleSaveTimetable}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {isSaving ? 'Saving...' : 'Save Timetable'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-10 text-gray-500">
                            No subjects found for this semester.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderSavedTimetablesView = () => (
        <div className="animate-fade-in">
            <button
                onClick={() => setView('selection')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Selection
            </button>
            <div className="bg-white rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Saved Timetables</h2>
                {savedTimetables.length > 0 ? (
                    <div className="space-y-4">
                        {savedTimetables.map(saved => (
                            <div key={saved.id} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg text-blue-600">{mockCourses.find(c => c.id === saved.courseId)?.name} - Semester {saved.semester}</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-gray-700">
                                        <thead className="text-left text-xs text-gray-500 uppercase">
                                            <tr>
                                                <th className="px-4 py-2">Subject</th>
                                                <th className="px-4 py-2">Type</th>
                                                <th className="px-4 py-2">Date</th>
                                                <th className="px-4 py-2">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {saved.timetable.map(item => (
                                                <tr key={item.subjectId}>
                                                    <td className="px-4 py-2">{item.subjectName}</td>
                                                    <td className="px-4 py-2">{item.examType}</td>
                                                    <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2">{item.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10 text-gray-500">
                        No saved timetables found.
                    </div>
                )}
            </div>
        </div>
    );

    const Toast = ({ message, type, onClose }) => {
        const icons = { success: <CheckCircle className="text-green-500" />, error: <XCircle className="text-red-500" />, info: <AlertTriangle className="text-blue-500" /> };
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
                {view === 'selection' ? renderSelectionView() : view === 'scheduler' ? renderSchedulerView() : renderSavedTimetablesView()}
            </div>
        </div>
    );
};

export default CollegeExamSchedule;