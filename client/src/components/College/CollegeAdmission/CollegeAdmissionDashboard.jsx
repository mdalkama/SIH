import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Clock, ArrowRight, UserPlus, FileCheck, AlertTriangle } from 'lucide-react';

// --- SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="mb-8"><div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div><div className="h-5 w-1/2 bg-slate-200 rounded-md"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-xl"></div>)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"><div className="h-32 bg-slate-100 rounded-xl"></div><div className="h-32 bg-slate-100 rounded-xl"></div></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 h-80 bg-slate-100 rounded-xl"></div><div className="h-80 bg-slate-100 rounded-xl"></div></div>
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

const QuickActionButton = ({ icon: Icon, title, description, onClick, color }) => (
    <button onClick={onClick} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left hover:border-${color}-500 hover:shadow-lg transition-all group`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}-100 text-${color}-600`}><Icon className="w-6 h-6" /></div>
            <div><h3 className="text-lg font-bold text-slate-800">{title}</h3><p className="text-sm text-slate-500">{description}</p></div>
            <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-slate-800 transition-transform group-hover:translate-x-1" />
        </div>
    </button>
);

// --- MAIN DUMMY DASHBOARD COMPONENT ---
const CollegeAdmissionDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setStats({
                totalApplications: 842,
                approvedApplications: 680,
                pendingApplications: 120,
                courseBreakdown: [
                    { courseName: 'B.Tech Computer Science', count: 350 },
                    { courseName: 'B.Tech Electronics', count: 210 },
                    { courseName: 'B.Tech Mechanical', count: 152 },
                    { courseName: 'MBA', count: 130 },
                ]
            });
            setRecentApplications([
                { _id: '1', name: 'Priya Sharma', registrationNumber: '2024CSE058' },
                { _id: '2', name: 'Amit Verma', registrationNumber: '2024ECE023' },
                { _id: '3', name: 'Sunita Singh', registrationNumber: '2024MBA012' },
                { _id: '4', name: 'Rahul Kumar', registrationNumber: '2024CSE059' },
            ]);
            setLoading(false);
        }, 1500); // Simulate 1.5 second loading time

        return () => clearTimeout(timer);
    }, []);

    const handleNavigate = (path) => navigate(path);

    if (loading) return <DashboardSkeleton />;

    // Calculated stat for Rejected
    const rejectedApplications = (stats.totalApplications - stats.approvedApplications - stats.pendingApplications) || 0;

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Admissions Dashboard</h1>
                <p className="mt-1 text-slate-600">Live overview of the student admission process.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Applications" value={stats.totalApplications} icon={Users} color="blue" />
                <StatCard title="Approved Applications" value={stats.approvedApplications} icon={UserCheck} color="green" />
                <StatCard title="Pending Verification" value={stats.pendingApplications} icon={Clock} color="amber" />
                <StatCard title="Rejected Applications" value={rejectedApplications < 0 ? 0 : rejectedApplications} icon={UserX} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <QuickActionButton icon={UserPlus} title="Student Enrollment" description="Fill out the form to admit a new student to the college." onClick={() => handleNavigate('/college-admission/student-enrollment')} color="indigo" />
                <QuickActionButton icon={FileCheck} title="Document Verification" description="Verify documents of newly admitted students." onClick={() => handleNavigate('/college-admission/document-verification')} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Course-wise Application Funnel</h2></div>
                    <div className="p-6 space-y-4">
                        {stats.courseBreakdown?.length > 0 ? (
                            stats.courseBreakdown.map(course => (
                                <div key={course.courseName}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-medium text-slate-700">{course.courseName}</p>
                                        <p className="text-sm font-semibold text-slate-600">{course.count} Applications</p>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(course.count / stats.totalApplications) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (<p className="text-center text-slate-500 py-8">No application data to display.</p>)}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                     <div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Recent Applications</h2></div>
                    <div className="p-4 space-y-4">
                        {recentApplications.length > 0 ? (
                            recentApplications.map(student => (
                                <div key={student._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{student.name.split(' ').map(n=>n[0]).join('')}</div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{student.name}</p>
                                        <p className="text-xs text-slate-500">{student.registrationNumber}</p>
                                    </div>
                                </div>
                            ))
                        ) : (<p className="p-8 text-center text-slate-500">No recent applications.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeAdmissionDashboard;