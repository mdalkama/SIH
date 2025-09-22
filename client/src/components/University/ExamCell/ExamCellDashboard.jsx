import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Edit,
    FileText,
    Users,
    ClipboardList,
    TrendingUp,
    BarChart2,
    Clock,
    ArrowRight,
    AlertTriangle,
    Loader2
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
        <div className="h-40 bg-slate-100 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-slate-100 rounded-xl"></div>
            <div className="h-64 bg-slate-100 rounded-xl"></div>
        </div>
    </div>
);


// --- HELPER SUB-COMPONENTS for the Dashboard ---
const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-sm font-medium text-slate-500">{title}</p>
            </div>
        </div>
    </div>
);

const QuickLink = ({ icon: Icon, title, path, color, onClick }) => (
    <button onClick={() => onClick(path)} className="w-full flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 ${color}`}>
            <Icon className="w-4 h-4"/>
        </div>
        <span className="font-semibold text-sm text-slate-700">{title}</span>
        <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-1" />
    </button>
);


// --- MAIN FUNCTIONAL DASHBOARD COMPONENT ---
const ExamCellDashboard = () => {
    const [stats, setStats] = useState({});
    const [deadlines, setDeadlines] = useState([]); // This remains dummy data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch real stats from the backend
                const response = await fetch(`${API_BASE_URL}/dashboard/exam-cell-stats`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error("Failed to load dashboard data. Please try again later.");
                }
                const data = await response.json();
                setStats(data.stats || {});

                // Deadlines are kept as dummy data
                setDeadlines([
                    { id: 1, task: 'Last day for internal marks submission', date: '2024-11-25' },
                    { id: 2, task: 'Admit card generation for ENDSEM-DEC-24', date: '2024-11-28' },
                    { id: 3, task: 'Practical exam schedule finalization', date: '2024-11-30' },
                ]);

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
        navigate(path);
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
                <h1 className="text-3xl font-bold text-slate-900">Exam Cell Dashboard</h1>
                <p className="mt-1 text-slate-600">Manage day-to-day examination operations and processing.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Edit} title="Exams Ready for Entry" value={stats.readyForEntry ?? 0} color="bg-amber-100 text-amber-600" />
                <StatCard icon={TrendingUp} title="Results Processed (Week)" value={stats.processedThisWeek ?? 0} color="bg-emerald-100 text-emerald-600" />
                <StatCard icon={FileText} title="Admit Cards Published" value={3} color="bg-sky-100 text-sky-600" />
                <StatCard icon={Users} title="Evaluators Assigned" value={5} color="bg-indigo-100 text-indigo-600" />
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"><BarChart2 className="w-8 h-8" /></div>
                        <div>
                            <h2 className="text-2xl font-bold">Start Result Processing</h2>
                            <p className="text-blue-200 max-w-lg">There are <span className="font-bold text-white">{stats.readyForEntry ?? 0}</span> exams that are closed and ready for marks entry.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleNavigate('/university-exam-cell/result-processing')}
                        className="w-full md:w-auto bg-white text-indigo-700 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-50 transition-transform hover:scale-105"
                    >
                        Enter Marks Now
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-4 border-b flex items-center gap-2"><Clock className="w-5 h-5 text-slate-500" /><h2 className="text-lg font-semibold text-slate-800">Upcoming Deadlines</h2></div>
                    <div className="divide-y divide-slate-200">
                        {deadlines.length > 0 ? (
                            deadlines.map(item => (
                                <div key={item.id} className="p-4 flex justify-between items-center">
                                    <p className="font-medium text-slate-700">{item.task}</p>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full"><AlertTriangle className="w-4 h-4" /><span>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></div>
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-center text-slate-500">No immediate deadlines.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                     <div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Quick Links</h2></div>
                    <div className="p-4 space-y-3">
                        <QuickLink icon={ClipboardList} title="Result Processing" path="/university-exam-cell/result-processing" color="bg-green-100 text-green-600" onClick={handleNavigate} />
                        <QuickLink icon={Users} title="Assign Evaluators" path="/university-exam-cell/assign-evaluators" color="bg-indigo-100 text-indigo-600" onClick={handleNavigate} />
                        <QuickLink icon={FileText} title="Publish Admit Cards" path="/university-exam-cell/publish-admit-card" color="bg-sky-100 text-sky-600" onClick={handleNavigate} />
                        <QuickLink icon={Users} title="Seat Allotment" path="/university-exam-cell/seat-allotment-execution" color="bg-purple-100 text-purple-600" onClick={handleNavigate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamCellDashboard;