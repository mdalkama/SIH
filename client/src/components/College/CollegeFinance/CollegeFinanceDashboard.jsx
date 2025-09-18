import React, { useState, useEffect } from 'react';
import {
    IndianRupee,
    TrendingUp,
    TrendingDown,
    Landmark,
    FileSearch,
    UserSearch,
    ArrowRight,
    Loader2
} from 'lucide-react';

// --- SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="mb-8">
            <div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-5 w-1/2 bg-slate-200 rounded-md"></div>
        </div>
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
        </div>
        {/* Main Action Skeleton */}
        <div className="h-40 bg-slate-100 rounded-xl mb-8"></div>
        {/* Side Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-slate-100 rounded-xl"></div>
            <div className="h-64 bg-slate-100 rounded-xl"></div>
        </div>
    </div>
);

// --- HELPER SUB-COMPONENTS for the Dashboard ---
const StatCard = ({ icon: Icon, title, value, colorClass, isCurrency = true }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">
                    {isCurrency ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value) : value}
                </p>
                <p className="text-sm font-medium text-slate-500">{title}</p>
            </div>
        </div>
    </div>
);

const QuickLink = ({ icon: Icon, title, path, color }) => (
    <a href={path} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 bg-${color}-100 text-${color}-600`}>
            <Icon className="w-4 h-4"/>
        </div>
        <span className="font-semibold text-sm text-slate-700">{title}</span>
        <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-1" />
    </a>
);

// --- MAIN DUMMY DASHBOARD COMPONENT ---
const CollegeFinanceDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDummyData = () => {
            setTimeout(() => {
                setStats({
                    collectedToday: 450000,
                    collectedMonth: 12500000,
                    overallPending: 8900000,
                    finesCollected: 78000
                });
                setRecentTransactions([
                    { id: 'REC-001', name: 'Anjali Sharma', regNo: '2022CSE001', amount: 85000, type: 'Semester Fee' },
                    { id: 'REC-002', name: 'Rohan Gupta', regNo: '2022CSE002', amount: 500, type: 'Library Fine' },
                    { id: 'REC-003', name: 'Priya Singh', regNo: '2021ECE034', amount: 85000, type: 'Semester Fee' },
                    { id: 'REC-004', name: 'Amit Kumar', regNo: '2023MECH101', amount: 2000, type: 'Exam Fee' },
                ]);
                setLoading(false);
            }, 1500); // 1.5 second delay
        };
        fetchDummyData();
    }, []);

    // In a real app, this would use react-router-dom's useNavigate
    const handleNavigate = (path) => {
        alert(`Navigating to: ${path}`);
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Finance Dashboard</h1>
                <p className="mt-1 text-slate-600">Overview of the college's financial activities and fee collections.</p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={TrendingUp} title="Collected Today" value={stats.collectedToday} colorClass="bg-green-100 text-green-600" />
                <StatCard icon={Landmark} title="Collected this Month" value={stats.collectedMonth} colorClass="bg-blue-100 text-blue-600" />
                <StatCard icon={TrendingDown} title="Overall Pending Fees" value={stats.overallPending} colorClass="bg-red-100 text-red-600" />
                <StatCard icon={IndianRupee} title="Fines Collected (Month)" value={stats.finesCollected} colorClass="bg-amber-100 text-amber-600" />
            </div>

            {/* Main Action: Fee Collection */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-xl shadow-lg mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <UserSearch className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Start Fee Collection</h2>
                            <p className="text-indigo-200 max-w-lg">Search for a student by their registration number to view their fee history and collect payments.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleNavigate('/college-finance/fee-managemanet')}
                        className="w-full md:w-auto bg-white text-indigo-700 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-50 transition-transform hover:scale-105"
                    >
                        Go to Fee Collection
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2></div>
                    <div className="divide-y divide-slate-200">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map(tx => (
                                <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                    <div>
                                        <p className="font-semibold text-slate-800">{tx.name}</p>
                                        <p className="text-sm text-slate-500">{tx.regNo} - <span className="text-slate-600">{tx.type}</span></p>
                                    </div>
                                    <p className="font-bold text-lg text-green-600">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-center text-slate-500">No recent transactions found.</p>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                     <div className="p-4 border-b"><h2 className="text-lg font-semibold text-slate-800">Quick Links</h2></div>
                    <div className="p-4 space-y-3">
                        <QuickLink icon={UserSearch} title="Fee Collection" path="/college-finance/fee-management" color="blue" />
                        <QuickLink icon={FileSearch} title="Generate Reports" path="/college-finance/reports" color="green" />
                        <QuickLink icon={IndianRupee} title="Manage Fee Structure" path="/college-finance/fee-structure" color="purple" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeFinanceDashboard;