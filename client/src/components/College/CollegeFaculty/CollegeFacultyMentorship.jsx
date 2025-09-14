import React, { useEffect, useMemo, useState } from 'react';
import {
    Book,
    Briefcase,
    User,
    MessageSquare,
    ClipboardList,
    Clock,
    Download,
    Eye,
    Loader2,
    CornerDownLeft,
    X,
    ClipboardCheck,
    AlertCircle,
    FlaskConical,
    Video // New icon for video calls
} from 'lucide-react';

// This is a placeholder for your actual API base URL
const BASE_API_URL = "https://your-api-base-url.com/api/v1";

// --- Mock API Data (for demonstration) ---
const mockMentees = [
    { id: 'S1', name: 'Aarav Sharma', regNo: 'CS2023001', class: 'B.Tech - 1st Year (CS)' },
    { id: 'S2', name: 'Bhavna Kumari', regNo: 'CS2023002', class: 'B.Tech - 1st Year (CS)' },
    { id: 'S6', name: 'Vikram Singh', regNo: 'CS2023006', class: 'B.Tech - 1st Year (CS)' },
    { id: 'S3', name: 'Alok Kumar', regNo: 'MA2023001', class: 'B.Sc - 2nd Year (Math)' },
    { id: 'S5', name: 'Priya Singhania', regNo: 'MA2023004', class: 'B.Sc - 2nd Year (Math)' },
    { id: 'S7', name: 'Sneha Jain', regNo: 'MA2023007', class: 'B.Sc - 2nd Year (Math)' },
    { id: 'S4', name: 'Mohan Lal', regNo: 'PH2023001', class: 'M.Sc - 1st Year (Physics)' },
    { id: 'S8', name: 'Gaurav Kumar', regNo: 'PH2023008', class: 'M.Sc - 1st Year (Physics)' },
];

const mockStudentPerformance = {
    'S1': { attendance: 78, internalMarks: { total: 45, max: 50, percentage: 90 } },
    'S2': { attendance: 55, internalMarks: { total: 30, max: 50, percentage: 60 } },
    'S3': { attendance: 85, internalMarks: { total: 50, max: 60, percentage: 83.3 } },
    'S4': { attendance: 62, internalMarks: { total: 40, max: 60, percentage: 66.6 } },
    'S5': { attendance: 91, internalMarks: { total: 55, max: 60, percentage: 91.6 } },
    'S6': { attendance: 80, internalMarks: { total: 48, max: 50, percentage: 96 } },
    'S7': { attendance: 68, internalMarks: { total: 52, max: 60, percentage: 86.6 } },
    'S8': { attendance: 75, internalMarks: { total: 45, max: 60, percentage: 75 } },
};

function CollegeFacultyMentorship() {
    const [notification, setNotification] = useState(null);
    const [loadingMentees, setLoadingMentees] = useState(false);
    const [mentees, setMentees] = useState([]);
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [menteeNotes, setMenteeNotes] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    function showNotification(message, type = "success") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }

    // --- Data Fetching Logic (Simulated) ---
    useEffect(() => {
        const fetchMentees = async () => {
            setLoadingMentees(true);
            try {
                setTimeout(() => {
                    setMentees(mockMentees);
                    setLoadingMentees(false);
                }, 1000);
            } catch (error) {
                setLoadingMentees(false);
                showNotification("Failed to load mentees. Please refresh.", "error");
            }
        };
        fetchMentees();
    }, []);

    const handleSelectMentee = (mentee) => {
        setSelectedMentee(mentee);
        setMenteeNotes(`Notes for ${mentee.name}:
- Initial meeting on 2025-08-25. Discussed academic goals.
- Needs to improve attendance in core subjects.
- Showed interest in project-based learning.
        `);
    };

    const handleSaveNotes = async () => {
        setSavingNote(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification("Notes saved successfully!", "success");
        } catch (error) {
            showNotification("Failed to save notes.", "error");
        } finally {
            setSavingNote(false);
        }
    };

    const getPerformance = (menteeId) => {
        return mockStudentPerformance[menteeId] || {};
    };
    
    const handleScheduleMeeting = () => {
        showNotification(`Online meeting scheduled with ${selectedMentee.name}. A calendar invite has been sent.`, "success");
    };

    // Group mentees by class/batch
    const menteesByClass = useMemo(() => {
        const grouped = {};
        mentees.forEach(mentee => {
            if (!grouped[mentee.class]) {
                grouped[mentee.class] = [];
            }
            grouped[mentee.class].push(mentee);
        });
        return grouped;
    }, [mentees]);

    return (
        <div className="min-h-screen font-sans">
            {notification && (
                <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {notification.type === "success" ? <ClipboardCheck size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/10"><X size={16} /></button>
                </div>
            )}

            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <User size={28} className="text-blue-600" />
                Student Mentorship
            </h1>

            {/* Mentee Selection & List */}
            {!selectedMentee ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Briefcase size={20} className="text-slate-500" />
                            My Mentees
                        </h2>
                    </div>
                    <div className="p-6 w-full overflow-x-auto">
                        {loadingMentees ? (
                            <div className="flex items-center gap-2 text-slate-500">
                                <Loader2 size={16} className="animate-spin" /> Loading mentees...
                            </div>
                        ) : Object.keys(menteesByClass).length > 0 ? (
                            Object.entries(menteesByClass).map(([className, classMentees]) => (
                                <div key={className} className="mb-6">
                                    <h3 className="text-lg font-semibold text-slate-700 mb-3">{className}</h3>
                                    <table className="min-w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                                        <thead className="bg-slate-50 text-slate-600">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Student Name</th>
                                                <th className="px-4 py-2 font-medium">Reg No.</th>
                                                <th className="px-4 py-2 text-center font-medium">Attendance</th>
                                                <th className="px-4 py-2 text-center font-medium">Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {classMentees.map(mentee => {
                                                const performance = getPerformance(mentee.id);
                                                return (
                                                    <tr 
                                                        key={mentee.id} 
                                                        onClick={() => handleSelectMentee(mentee)}
                                                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                                                    >
                                                        <td className="px-4 py-3 font-semibold text-slate-800">{mentee.name}</td>
                                                        <td className="px-4 py-3 text-slate-600">{mentee.regNo}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${performance.attendance > 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {performance.attendance}%
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="text-sm font-semibold text-slate-700">
                                                                {performance.internalMarks.percentage}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <User size={32} className="mx-auto mb-2" />
                                No students assigned for mentorship.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Mentorship Details & Actions */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <button onClick={() => setSelectedMentee(null)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100"><CornerDownLeft size={20} /></button>
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <User size={20} className="text-slate-500" />
                            Mentoring {selectedMentee.name}
                        </h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Student Performance Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="bg-blue-50 p-4 rounded-md">
                                <h4 className="font-semibold text-blue-700">Student Info</h4>
                                <p className="text-sm text-blue-900 mt-1">Reg No: {selectedMentee.regNo}</p>
                                <p className="text-sm text-blue-900">Class: {selectedMentee.class}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-md">
                                <h4 className="font-semibold text-blue-700">Current Standing</h4>
                                <p className="text-sm text-blue-900 mt-1">Attendance: {getPerformance(selectedMentee.id).attendance}%</p>
                                <p className="text-sm text-blue-900">Internal Marks: {getPerformance(selectedMentee.id).internalMarks.percentage}%</p>
                            </div>
                        </div>

                        {/* Mentorship Notes */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <ClipboardList size={20} className="text-slate-500" />
                                Mentorship Notes
                            </h3>
                            <textarea
                                value={menteeNotes}
                                onChange={(e) => setMenteeNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                rows="8"
                                placeholder="Write your private mentorship notes here..."
                            ></textarea>
                            <button
                                onClick={handleSaveNotes}
                                disabled={savingNote}
                                className={`mt-4 px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors ${savingNote ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                            >
                                {savingNote ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />}
                                {savingNote ? "Saving..." : "Save Notes"}
                            </button>
                        </div>

                        {/* Communication Action */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <MessageSquare size={20} className="text-slate-500" />
                                Communication
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => showNotification(`Simulated message sent to ${selectedMentee.name}.`, "success")}
                                    className="px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors bg-green-600 text-white hover:bg-green-700"
                                >
                                    <MessageSquare size={16} /> Send a Quick Message
                                </button>
                                <button
                                    onClick={handleScheduleMeeting}
                                    className="px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <Video size={16} /> Schedule Online Meeting
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollegeFacultyMentorship;