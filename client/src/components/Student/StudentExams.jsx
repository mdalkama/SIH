import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, Calendar, BookOpen, Clock, X, Eye } from 'lucide-react';

// --- Helper Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

// --- Main Component ---
const StudentExam = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://sih-4ptm.onrender.com/api/v1/exams/my-exams', {
                    credentials: 'include'
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Failed to fetch exam schedules.');
                setExams(result.exams || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    // --- UPDATED getStatusInfo FUNCTION ---
    const getStatusInfo = (status) => {
        switch(status) {
            case 'OPEN_FOR_REGISTRATION':
                return { text: 'Registration Open', color: 'bg-green-100 text-green-800' };
            case 'CLOSED':
                return { text: 'Registration Closed', color: 'bg-red-100 text-red-800' };
            case 'RESULT_PROCESSING':
                return { text: 'Result Processing', color: 'bg-yellow-100 text-yellow-800' };
            case 'PUBLISHED':
                return { text: 'Result Published', color: 'bg-indigo-100 text-indigo-800' };
            default:
                return { text: status.replace(/_/g, ' '), color: 'bg-gray-100 text-gray-800' };
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
    if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;

    return (
        <div className="min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Examinations</h1>
                <p className="mt-1 text-slate-600">View your upcoming exam schedules and timetables.</p>
            </header>

            <div className="space-y-6">
                {exams.length > 0 ? (
                    exams.map(exam => {
                        const statusInfo = getStatusInfo(exam.status);
                        return (
                            <div key={exam._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                                        <h2 className="text-xl font-bold text-slate-800 mt-2">{exam.examName}</h2>
                                        <p className="text-sm text-slate-500">{exam.examType} • {exam.year}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedExam(exam)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                                    >
                                        <Eye size={16} /> View Timetable
                                    </button>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" />Start Date: <strong className="ml-1.5 text-slate-800">{new Date(exam.startDate).toLocaleDateString('en-GB')}</strong></span>
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" />End Date: <strong className="ml-1.5 text-slate-800">{new Date(exam.endDate).toLocaleDateString('en-GB')}</strong></span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                        <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-medium text-slate-800">No Upcoming Exams</h3>
                        <p className="mt-1 text-sm text-slate-500">There are currently no examination schedules available for your course and semester.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={!!selectedExam} onClose={() => setSelectedExam(null)} title={selectedExam?.examName}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3 text-left font-semibold text-slate-700">Date</th>
                                <th className="p-3 text-left font-semibold text-slate-700">Session</th>
                                <th className="p-3 text-left font-semibold text-slate-700">Subject</th>
                                <th className="p-3 text-left font-semibold text-slate-700">Code</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {selectedExam?.timetable.map(subject => (
                                <tr key={subject.subjectCode}>
                                    <td className="p-3 font-medium text-slate-800 whitespace-nowrap">{new Date(subject.examDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                    <td className="p-3 text-slate-600">{subject.session === 'FN' ? 'Forenoon' : 'Afternoon'}</td>
                                    <td className="p-3 text-slate-800">{subject.subjectName}</td>
                                    <td className="p-3 font-mono text-slate-500">{subject.subjectCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
};

export default StudentExam;