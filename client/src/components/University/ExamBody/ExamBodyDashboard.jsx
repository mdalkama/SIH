import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    FilePlus,
    ShieldCheck,
    CalendarCheck,
    Loader2,
    ArrowRight,
    Users,
    AlertTriangle
} from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';

// --- SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="mb-8">
            <div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-5 w-1/2 bg-slate-200 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="h-32 bg-slate-100 rounded-xl"></div>
            <div className="h-32 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b"><div className="h-6 w-1/4 bg-slate-200 rounded-md"></div></div>
            <div className="p-4 space-y-4">
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
    </div>
);

// --- HELPER SUB-COMPONENTS for the Dashboard ---
const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-500">{title}</p>
        </div>
    </div>
);

const QuickActionButton = ({ icon: Icon, title, description, onClick, color }) => (
    <button
        onClick={onClick}
        className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left hover:border-${color}-500 hover:shadow-lg transition-all duration-300 group`}
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}-100 text-${color}-600`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-slate-800 transition-transform group-hover:translate-x-1" />
        </div>
    </button>
);


// --- MAIN FUNCTIONAL DASHBOARD COMPONENT ---
const UniversityExamBodyDashboard = () => {
    const [stats, setStats]  = useState({});
    const [pendingExams, setPendingExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [statsRes, pendingExamsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/dashboard/stats`, { credentials: 'include' }),
                    fetch(`${API_BASE_URL}/pending-approval`, { credentials: 'include' })
                ]);

                if (!statsRes.ok) throw new Error("Failed to load dashboard statistics.");
                const statsData = await statsRes.json();
                setStats(statsData.stats || {});

                if (!pendingExamsRes.ok) throw new Error("Failed to load pending exams.");
                const pendingData = await pendingExamsRes.json();
                setPendingExams(pendingData.exams || []);

            } catch (err) {
                setError(err.message);
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleNavigate = (path) => {
        navigate(path); // Use the navigate function for routing
    };

    if (loading) {
        return <DashboardSkeleton />;
    }
    
    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="mx-auto w-12 h-12 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold text-red-800">Failed to Load Dashboard</h3>
                <p className="text-red-600 mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Examination Body Dashboard</h1>
                <p className="mt-1 text-slate-600">Welcome! Here's a summary of the current examination activities.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Activity} title="Open for Registration" value={stats.openForRegistration ?? 0} color="bg-sky-100 text-sky-600" />
                <StatCard icon={ShieldCheck} title="Results Pending Approval" value={stats.resultsPendingApproval ?? 0} color="bg-amber-100 text-amber-600" />
                <StatCard icon={CalendarCheck} title="Published this Month" value={stats.publishedThisMonth ?? 0} color="bg-emerald-100 text-emerald-600" />
                <StatCard icon={Users} title="Total Active Students" value={(stats.totalStudents ?? 0).toLocaleString('en-IN')} color="bg-indigo-100 text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <QuickActionButton 
                    icon={FilePlus} 
                    title="Create New Exam" 
                    description="Schedule a new semester, supplementary, or internal exam."
                    onClick={() => handleNavigate('/university-exam-body/semester-policy')}
                    color="indigo"
                />
                <QuickActionButton 
                    icon={ShieldCheck} 
                    title="Approve Results" 
                    description="Review and publish the results submitted by the exam cell."
                    onClick={() => handleNavigate('/university-exam-body/result-approval')}
                    color="emerald"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-semibold text-slate-800">Pending Approval Queue</h2>
                </div>
                <div>
                    {pendingExams.length > 0 ? (
                        pendingExams.map(exam => (
                            <div key={exam._id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b last:border-b-0 hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-800">{exam.examName}</p>
                                    <p className="text-sm text-slate-500 font-mono mt-1">{exam.examId} • Sem {exam.semester}, {exam.year}</p>
                                </div>
                                <button onClick={() => handleNavigate(`/university-exam-body/result-approval`)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 font-semibold text-sm transition-colors">
                                    Review Results
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="p-8 text-center text-slate-500">The approval queue is empty. Great job!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversityExamBodyDashboard;