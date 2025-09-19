import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, Users, FileText, ArrowRight, Loader2, Megaphone, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/placements';

const StatCard = ({ icon: Icon, title, value, colorClass }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}><Icon className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{value}</p><p className="text-sm font-medium text-slate-500">{title}</p></div>
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

const PlacementOfficerDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/stats`, { credentials: 'include' });
                if (!response.ok) throw new Error("Failed to load dashboard statistics.");
                const data = await response.json();
                setStats(data.stats || {});
            } catch (err) { setError(err.message); } 
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    const handleNavigate = (path) => navigate(path);

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    if (error) return <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg"><AlertTriangle className="mx-auto" />{error}</div>;

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Placement Officer Dashboard</h1>
                <p className="mt-1 text-slate-600">Welcome! Here is the summary of placement activities.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Briefcase} title="Open Drives" value={stats.openDrives ?? 0} colorClass="bg-blue-100 text-blue-600" />
                <StatCard icon={Building2} title="Companies Visited" value={stats.companiesVisited ?? 0} colorClass="bg-indigo-100 text-indigo-600" />
                <StatCard icon={Users} title="Students Placed" value={stats.placedStudents ?? 0} colorClass="bg-green-100 text-green-600" />
                <StatCard icon={FileText} title="Total Applications" value={stats.totalApplications ?? 0} colorClass="bg-amber-100 text-amber-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickActionButton icon={Megaphone} title="Manage Placement Drives" description="Create new drives, view applications, and manage statuses." onClick={() => handleNavigate('/college-placement/manage-placements')} color="indigo" />
                <QuickActionButton icon={Users} title="Student Database" description="View and filter student profiles based on academic performance." onClick={() => handleNavigate('/college-placement/student-database')} color="emerald" />
            </div>
        </div>
    );
};

export default PlacementOfficerDashboard;