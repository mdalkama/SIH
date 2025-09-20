import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Building2,
    Users,
    FileText,
    ArrowRight,
    Loader2,
    Megaphone,
    AlertTriangle,
    Calendar,
    Star
} from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/placements';

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-slate-100 rounded-xl"></div>
            <div className="h-64 bg-slate-100 rounded-xl"></div>
        </div>
    </div>
);

// --- HELPER SUB-COMPONENTS for the Dashboard ---
const StatCard = ({ icon: Icon, title, value, colorClass }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-sm font-medium text-slate-500">{title}</p>
            </div>
        </div>
    </div>
);

const QuickActionButton = ({ icon: Icon, title, description, onClick, color }) => (
    <button onClick={onClick} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left hover:border-${color}-500 hover:shadow-lg transition-all group`}>
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
const PlacementOfficerDashboard = () => {
    const [stats, setStats] = useState({});
    const [upcomingDrives, setUpcomingDrives] = useState([]);
    const [recentPlacements, setRecentPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all dashboard data in parallel
                const [statsRes, upcomingRes, recentRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/dashboard/stats`, { credentials: 'include' }),
                    fetch(`${API_BASE_URL}/dashboard/upcoming-drives`, { credentials: 'include' }),
                    fetch(`${API_BASE_URL}/dashboard/recent-placements`, { credentials: 'include' })
                ]);

                if (!statsRes.ok) throw new Error("Failed to load dashboard statistics.");
                const statsData = await statsRes.json();
                setStats(statsData.stats || {});
                
                if (!upcomingRes.ok) throw new Error("Failed to load upcoming drives.");
                const upcomingData = await upcomingRes.json();
                setUpcomingDrives(upcomingData.drives || []);

                if (!recentRes.ok) throw new Error("Failed to load recent placements.");
                const recentData = await recentRes.json();
                setRecentPlacements(recentData.placements || []);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleNavigate = (path) => navigate(path);

    if (loading) return <DashboardSkeleton />;
    
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
                <h1 className="text-3xl font-bold text-slate-900">Placement Officer Dashboard</h1>
                <p className="mt-1 text-slate-600">Welcome! Here is the summary of placement activities.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Briefcase} title="Open Drives" value={stats.openDrives ?? 0} colorClass="bg-blue-100 text-blue-600" />
                <StatCard icon={Building2} title="Companies Visited" value={stats.companiesVisited ?? 0} colorClass="bg-indigo-100 text-indigo-600" />
                <StatCard icon={Users} title="Students Placed" value={stats.placedStudents ?? 0} colorClass="bg-green-100 text-green-600" />
                <StatCard icon={FileText} title="Total Applications" value={stats.totalApplications ?? 0} colorClass="bg-amber-100 text-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <QuickActionButton icon={Megaphone} title="Manage Placement Drives" description="Create new drives, view applications, and manage statuses." onClick={() => handleNavigate('/college-placement-officer/manage-drives')} color="indigo" />
                <QuickActionButton icon={Users} title="Student Database" description="View and filter student profiles based on academic performance." onClick={() => handleNavigate('/college-placement-officer/student-database')} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-4 border-b flex items-center gap-2"><Calendar className="w-5 h-5 text-slate-500" /><h2 className="text-lg font-semibold text-slate-800">Upcoming Drives</h2></div>
                    <div className="divide-y divide-slate-200">
                        {upcomingDrives.length > 0 ? (
                            upcomingDrives.map(drive => (
                                <div key={drive._id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                    <div>
                                        <p className="font-semibold text-slate-800">{drive.companyName}</p>
                                        <p className="text-sm text-slate-500">{drive.jobTitle}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {new Date(drive.driveDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                            ))
                        ) : (<p className="p-8 text-center text-slate-500">No upcoming drives scheduled.</p>)}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                     <div className="p-4 border-b flex items-center gap-2"><Star className="w-5 h-5 text-slate-500" /><h2 className="text-lg font-semibold text-slate-800">Recent Placements</h2></div>
                    <div className="p-4 space-y-4">
                        {recentPlacements.length > 0 ? (
                            recentPlacements.map(placement => (
                                <div key={placement._id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                                        {placement.studentName.split(' ').map(n=>n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{placement.studentName}</p>
                                        <p className="text-xs text-slate-500">Placed at {placement.companyName}</p>
                                    </div>
                                    <p className="ml-auto font-semibold text-sm text-slate-600">{placement.package.toFixed(1)} LPA</p>
                                </div>
                            ))
                        ) : (<p className="p-8 text-center text-slate-500">No recent placements to show.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementOfficerDashboard;