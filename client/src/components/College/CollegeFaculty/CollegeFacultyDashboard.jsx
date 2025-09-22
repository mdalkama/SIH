import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Users, Calendar, ClipboardCheck, ArrowRight, User, Clock, FileText, MessageSquare, Loader2, CheckCircle } from 'lucide-react';

// --- SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="mb-8"><div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div><div className="h-5 w-1/2 bg-slate-200 rounded-md"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-xl"></div>)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-80 bg-slate-100 rounded-xl"></div>
            <div className="h-80 bg-slate-100 rounded-xl"></div>
        </div>
    </div>
);

// --- HELPER SUB-COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">{title}</p><p className={`text-3xl font-bold text-slate-800 mt-1`}>{value}</p></div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100`}><Icon className={`w-6 h-6 text-${color}-600`} /></div>
        </div>
    </div>
);

const QuickLinkCard = ({ icon: Icon, title, description, onClick, color }) => (
    <button onClick={onClick} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left hover:border-${color}-500 hover:shadow-lg transition-all group`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}-100 text-${color}-600`}><Icon className="w-6 h-6" /></div>
            <div><h3 className="text-lg font-bold text-slate-800">{title}</h3><p className="text-sm text-slate-500">{description}</p></div>
            <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-slate-800 transition-transform group-hover:translate-x-1" />
        </div>
    </button>
);

// --- MAIN DUMMY DASHBOARD COMPONENT ---
const CollegeFacultyDashboard = () => {
    const [stats, setStats] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching all dashboard data
        setTimeout(() => {
            setStats({
                totalStudents: 135,
                subjectsAssigned: 4,
                classesToday: 3,
                pendingAssignments: 2
            });
            setSchedule([
                { id: 1, time: '10:00 AM - 11:00 AM', subject: 'Data Structures', class: 'B.Tech CSE - 3rd Sem', venue: 'Room 301' },
                { id: 2, time: '11:00 AM - 12:00 PM', subject: 'Web Development', class: 'B.Tech IT - 5th Sem', venue: 'Lab 102' },
                { id: 3, time: '02:00 PM - 03:00 PM', subject: 'Linear Algebra', class: 'B.Sc Math - 1st Sem', venue: 'Room 205' },
            ]);
            setRecentActivity([
                { id: 1, type: 'assignment', text: 'New submission for "OOPs Concepts" by Aarav Sharma.' },
                { id: 2, type: 'mentorship', text: 'Mentorship meeting scheduled with Priya Singh.' },
                { id: 3, type: 'attendance', text: 'Attendance for Data Structures marked (92% present).' },
            ]);
            setLoading(false);
        }, 1500);
    }, []);

    const handleNavigate = (path) => navigate(path);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Faculty Dashboard</h1>
                <p className="mt-1 text-slate-600">Welcome! Here's a summary of your academic activities for today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="blue" />
                <StatCard title="Subjects Assigned" value={stats.subjectsAssigned} icon={Book} color="indigo" />
                <StatCard title="Classes Today" value={stats.classesToday} icon={Calendar} color="green" />
                <StatCard title="Pending Assignments" value={stats.pendingAssignments} icon={ClipboardCheck} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <QuickLinkCard icon={Book} title="Manage Courses" description="View syllabus, schedule, and course details." onClick={() => handleNavigate('/college-faculty/courses')} color="blue" />
                <QuickLinkCard icon={FileText} title="Assignments & Marks" description="Upload assignments and manage internal marks." onClick={() => handleNavigate('/college-faculty/assignments')} color="purple" />
                <QuickLinkCard icon={Calendar} title="Mark Attendance" description="Mark daily attendance for your classes." onClick={() => handleNavigate('/college-faculty/attendance')} color="green" />
                <QuickLinkCard icon={User} title="Student Mentorship" description="Access mentee profiles and track their progress." onClick={() => handleNavigate('/college-faculty/mentorship')} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-4 border-b flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <h2 className="text-lg font-semibold text-slate-800">Today's Schedule</h2>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {schedule.length > 0 ? (
                            schedule.map(item => (
                                <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                    <div>
                                        <p className="font-semibold text-slate-800">{item.subject}</p>
                                        <p className="text-sm text-slate-500">{item.class} • {item.venue}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                        {item.time}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-center text-slate-500">No classes scheduled for today.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                     <div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2></div>
                    <div className="p-4 space-y-4">
                        {recentActivity.map(activity => (
                            <div key={activity.id} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                                    {activity.type === 'assignment' && <FileText className="w-4 h-4 text-slate-500" />}
                                    {activity.type === 'mentorship' && <User className="w-4 h-4 text-slate-500" />}
                                    {activity.type === 'attendance' && <CheckCircle className="w-4 h-4 text-slate-500" />}
                                </div>
                                <p className="text-sm text-slate-600">{activity.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeFacultyDashboard;