import React, { useState, useEffect } from 'react';
import { Building, Users, PieChart, AlertTriangle, ShieldCheck, Phone, CreditCard } from 'lucide-react';

// --- Helper Components ---

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-sm font-medium text-slate-500`}>{title}</p>
                <p className={`text-3xl font-bold text-slate-800 mt-1`}>{value}</p>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
        </div>
    </div>
);

const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="space-y-2 mb-8">
            <div className="h-8 bg-slate-200 rounded-lg w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="h-28 bg-slate-200 rounded-xl"></div>
            <div className="h-28 bg-slate-200 rounded-xl"></div>
            <div className="h-28 bg-slate-200 rounded-xl"></div>
            <div className="h-28 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-slate-200 rounded-xl"></div>
                <div className="h-48 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
    </div>
);

const ProgressBar = ({ value }) => (
    <div className="w-full bg-slate-200 rounded-full h-2">
        <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${value}%` }}
        ></div>
    </div>
);


const CollegeWardenDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [wardenProfile, setWardenProfile] = useState(null); // State for warden's own profile
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(wardenProfile)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel/warden/dashboard-summary', {
                    credentials: 'include'
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Failed to fetch dashboard data.");
                }
                const data = await res.json();
                if (data.success) {
                    setDashboardData(data.data);
                } else {
                    throw new Error(data.message || "An error occurred.");
                }
            } catch (err) {
                // If this fails, we can still try to load the profile
                setError(err.message);
                console.error("Dashboard Summary Error:", err);
            }
        };

        const fetchWardenProfile = async () => {
            try {
                const res = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', {
                    credentials: 'include'
                });
                 if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Failed to fetch warden profile.");
                }
                const data = await res.json();
                if (data.user) {
                    setWardenProfile(data.user);
                } else {
                    throw new Error(data.message || "An error occurred fetching profile.");
                }
            } catch (err) {
                 setError(err.message);
                 console.error("Warden Profile Error:", err);
            }
        };

        const loadAllData = async () => {
            setLoading(true);
            setError(null);
            
            // Call APIs sequentially, not with Promise.all
            await fetchDashboardData();
            await fetchWardenProfile();

            setLoading(false);
        };
        
        loadAllData();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error && !dashboardData && !wardenProfile) {
        return (
            <div className="text-center py-20 bg-red-50 rounded-xl">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-medium text-red-800">Failed to load data</h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
        );
    }
    
    // Use dashboardData, but it can be null if its specific fetch failed
    const { stats, hostelBreakdown, recentComplaints, hostelWardens } = dashboardData || {};

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Welcome, {wardenProfile?.name || 'Warden'}!</h1>
                <p className="mt-1 text-sm text-slate-600">
                    A high-level overview of all hostel activities for College Code: {wardenProfile?.collegeCode || 'N/A'}.
                </p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Hostels" value={stats?.totalHostels || 0} icon={Building} color="blue" />
                <StatCard title="Student Occupants" value={stats?.totalStudents || 0} icon={Users} color="purple" />
                <StatCard 
                    title="Total Dues" 
                    value={`₹${(stats?.totalDues || 0).toLocaleString('en-IN')}`} 
                    icon={CreditCard} 
                    color="red" 
                />
                <StatCard title="Overall Occupancy" value={`${stats?.overallOccupancy || 0}%`} icon={PieChart} color="green" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Hostel Overview */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Hostels Overview</h2>
                        <div className="space-y-4">
                            {hostelBreakdown?.length > 0 ? hostelBreakdown.map(hostel => {
                                const occupancy = hostel.totalBeds > 0 ? Math.round((hostel.allocatedBeds / hostel.totalBeds) * 100) : 0;
                                return (
                                    <div key={hostel._id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-medium text-slate-700">{hostel.name}</p>
                                            <p className="text-sm text-slate-500">{hostel.allocatedBeds} / {hostel.totalBeds} Students ({occupancy}%)</p>
                                        </div>
                                        <ProgressBar value={occupancy} />
                                    </div>
                                );
                            }) : <p className="text-sm text-slate-500">No hostel data available.</p>}
                        </div>
                    </div>

                    {/* Recent High-Priority Complaints */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent High-Priority Issues</h2>
                        <div className="space-y-3">
                            {recentComplaints?.length > 0 ? recentComplaints.slice(0,5).map(complaint => (
                                <div key={complaint._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-800">{complaint.title}</p>
                                        <p className="text-xs text-slate-500">{complaint.hostelName}</p>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">{complaint.priority}</span>
                                </div>
                            )) : <p className="text-sm text-slate-500">No high-priority complaints at the moment.</p>}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Managed Wardens</h2>
                        <div className="space-y-4">
                            {hostelWardens?.length > 0 ? hostelWardens.map(warden => (
                                <div key={warden._id} className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{warden.name}</p>
                                        <p className="text-xs text-slate-500">{warden.hostelName}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone size={12}/> {warden.contact}</p>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-slate-500">No wardens assigned.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeWardenDashboard;