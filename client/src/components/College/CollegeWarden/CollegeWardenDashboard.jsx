import React, { useState, useEffect } from 'react';
import { Building, Users, PieChart, AlertTriangle, ShieldCheck, Phone, CreditCard, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- SKELETON LOADER COMPONENT (No changes) ---
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="space-y-2 mb-8"><div className="h-8 bg-slate-200 rounded-lg w-1/2"></div><div className="h-4 bg-slate-200 rounded-lg w-1/3"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>)}</div>
        <div className="h-64 bg-slate-200 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><div className="h-48 bg-slate-200 rounded-xl"></div><div className="h-48 bg-slate-200 rounded-xl"></div><div className="h-48 bg-slate-200 rounded-xl"></div></div>
    </div>
);

// --- HELPER SUB-COMPONENTS (No changes) ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-lg hover:border-blue-400">
        <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">{title}</p><p className="text-3xl font-bold text-slate-800 mt-1">{value}</p></div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100`}><Icon className={`w-6 h-6 text-${color}-600`} /></div>
        </div>
    </div>
);

const ProgressBar = ({ value, color }) => (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600`} style={{ width: `${value}%` }}></div>
    </div>
);

// --- MAIN DASHBOARD COMPONENT ---
const CollegeWardenDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [wardenProfile, setWardenProfile] = useState(null);
    const [visitorPasses, setVisitorPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true); setError(null);
            try {
                const [dashboardRes, profileRes, visitorsRes] = await Promise.all([
                    fetch('https://sih-4ptm.onrender.com/api/v1/hostel/warden/dashboard-summary', { credentials: 'include' }),
                    fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', { credentials: 'include' }),
                    fetch('https://sih-4ptm.onrender.com/api/v1/hostel/warden/visitors', { credentials: 'include' })
                ]);

                if (!dashboardRes.ok) { const errData = await dashboardRes.json(); throw new Error(errData.message || "Failed to fetch dashboard data."); }
                const dashboardResult = await dashboardRes.json();
                setDashboardData(dashboardResult.data);

                if (!profileRes.ok) { const errData = await profileRes.json(); throw new Error(errData.message || "Failed to fetch warden profile."); }
                const profileResult = await profileRes.json();
                setWardenProfile(profileResult.user);

                if (visitorsRes.ok) { const visitorsData = await visitorsRes.json(); setVisitorPasses(visitorsData.data || []); }
                
            } catch (err) { setError(err.message); console.error("Dashboard Data Fetch Error:", err); } 
            finally { setLoading(false); }
        };
        fetchAllData();
    }, []);

    if (loading) return <DashboardSkeleton />;
    if (error) return ( <div className="text-center py-20 bg-red-50 rounded-xl"><AlertTriangle className="mx-auto h-12 w-12 text-red-500" /><h3 className="mt-4 text-lg font-medium text-red-800">Failed to load data</h3><p className="mt-1 text-sm text-red-600">{error}</p></div> );
    
    const { stats, hostelBreakdown, recentComplaints, hostelWardens } = dashboardData || {};

    return (
        <div className="space-y-8 font-sans">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Welcome, {wardenProfile?.name || 'Warden'}!</h1>
                <p className="mt-1 text-sm text-slate-600">Here's the real-time overview of hostel activities for College: <span className="font-semibold text-blue-600">{wardenProfile?.collegeCode || 'N/A'}</span></p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Hostels" value={stats?.totalHostels || 0} icon={Building} color="blue" />
                <StatCard title="Student Occupants" value={stats?.totalStudents || 0} icon={Users} color="purple" />
                <StatCard title="Total Dues" value={`₹${(stats?.totalDues || 0).toLocaleString('en-IN')}`} icon={CreditCard} color="red" />
                <StatCard title="Overall Occupancy" value={`${stats?.overallOccupancy || 0}%`} icon={PieChart} color="green" />
            </div>

            {/* --- NEW, IMPROVED LAYOUT STARTS HERE --- */}
            <div className="space-y-8">
                {/* Hostels Overview - Full Width */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Hostels Overview</h2>
                    <div className="space-y-5">
                        {hostelBreakdown?.length > 0 ? hostelBreakdown.map(hostel => {
                            const occupancy = hostel.totalBeds > 0 ? Math.round((hostel.allocatedBeds / hostel.totalBeds) * 100) : 0;
                            return ( <div key={hostel._id}><div className="flex justify-between items-center mb-2"><p className="font-medium text-slate-700">{hostel.name}</p><p className="text-sm font-semibold text-slate-600">{hostel.allocatedBeds} / {hostel.totalBeds} <span className="font-normal text-slate-500">({occupancy}%)</span></p></div><ProgressBar value={occupancy} color={occupancy > 90 ? 'red' : occupancy > 75 ? 'yellow' : 'blue'} /></div> );
                        }) : <p className="text-sm text-slate-500">No hostel data available.</p>}
                    </div>
                </div>

                {/* Grid for smaller cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">High-Priority Issues</h2>
                            <button onClick={() => navigate('/college-warden/handle-complaint')} className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            {recentComplaints?.length > 0 ? recentComplaints.slice(0, 3).map(complaint => (
                                <div key={complaint._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div><p className="font-medium text-slate-800">{complaint.title}</p><p className="text-xs text-slate-500">{complaint.hostelName}</p></div>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">{complaint.priority}</span>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-4">No high-priority complaints.</p>}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Assigned Wardens</h2>
                        <div className="space-y-4">
                            {hostelWardens?.length > 0 ? hostelWardens.map(warden => (
                                <div key={warden._id} className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-slate-500" /></div>
                                    <div><p className="font-semibold text-slate-800">{warden.name}</p><p className="text-xs text-slate-500">{warden.hostelName}</p></div>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-4">No wardens assigned.</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">Pending Visitor Passes</h2>
                             <button onClick={() => navigate('/college-warden/handle-complaint')} className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {visitorPasses?.length > 0 ? visitorPasses.slice(0, 3).map(pass => (
                                <div key={pass._id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><UserCheck className="w-5 h-5 text-blue-500" /></div>
                                    <div><p className="font-semibold text-sm text-slate-800">{pass.visitorName}</p><p className="text-xs text-slate-500">Visiting: {pass.studentRegNo}</p></div>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-4">No pending visitor passes.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeWardenDashboard;