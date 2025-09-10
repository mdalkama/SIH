import React, { useState, useEffect } from 'react';
import { Building, BookOpen, Users, UserCog, Calendar, Activity, PlusCircle, TrendingUp, DollarSign, University, Loader2, AlertTriangle } from 'lucide-react';

const fetchDashboardDataFromAPI = async () => {



    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockApiResponse = {
        universityName: "Aryabhatta Knowledge University",
        stats: {
            totalColleges: 15,
            totalCourses: 58,
            totalStudents: 25680,
            totalStaff: 1240,
        },
        financials: {
            totalRevenueYTD: 52450000,
            pendingFees: 8975000,
            operationalExpenses: 12320000,
        },
        enrollmentTrends: [
            { year: '2021', count: 21500 },
            { year: '2022', count: 22800 },
            { year: '2023', count: 23900 },
            { year: '2024', count: 25100 },
            { year: '2025', count: 25680 },
        ],
        activeSessions: [
            { id: 'sess_003', name: 'Spring 2026 Admissions', status: 'Active', endDate: '2026-02-20' },
            { id: 'sess_004', name: 'Fall 2026 B.Tech Admissions', status: 'Upcoming', startDate: '2026-08-01' },
        ],
        recentAffiliations: [
            { id: 'col_005', name: 'Patna Institute of Technology', code: 'PIT', status: 'Approved', affiliationDate: '2025-09-01' },
            { id: 'col_006', name: 'Nalanda College of Commerce', code: 'NCC', status: 'Pending Review', affiliationDate: '2025-08-15' },
            { id: 'col_007', name: 'Gaya School of Law', code: 'GSL', status: 'Approved', affiliationDate: '2025-07-20' },
            { id: 'col_008', name: 'Bihar Medical College', code: 'BMC', status: 'Rejected', affiliationDate: '2025-06-10' },
            { id: 'col_001', name: 'College of Engineering & Technology', code: 'COET', status: 'Approved', affiliationDate: '2010-05-26' },
        ],
    };

    // Simulate a potential error
    // if (Math.random() > 0.8) {
    //     throw new Error("Failed to connect to the server. Please try again.");
    // }

    return mockApiResponse;
};


// --- Main Dashboard Component ---
const UniversityDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const adminName = "University Admin"; // This would come from auth context

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await fetchDashboardDataFromAPI();
                setDashboardData(data);
            } catch (err) {
                setError(err.message || "An unknown error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!dashboardData) {
        return null; // Or some fallback UI
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">University Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {adminName}. Here's what's happening at {dashboardData.universityName}.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<Building />} title="Affiliated Colleges" value={dashboardData.stats.totalColleges} color="blue" />
                    <StatCard icon={<BookOpen />} title="Total Courses" value={dashboardData.stats.totalCourses} color="orange" />
                    <StatCard icon={<Users />} title="Enrolled Students" value={dashboardData.stats.totalStudents.toLocaleString('en-IN')} color="green" />
                    <StatCard icon={<UserCog />} title="Total Staff" value={dashboardData.stats.totalStaff.toLocaleString('en-IN')} color="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <DashboardSection title="Student Enrollment Trends (Last 5 Years)">
                            <EnrollmentChart data={dashboardData.enrollmentTrends} />
                        </DashboardSection>

                        <DashboardSection title="Recent College Affiliations">
                            <AffiliationsTable data={dashboardData.recentAffiliations} />
                        </DashboardSection>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8">
                        <DashboardSection title="Financial Overview (YTD)">
                            <FinancialsCard data={dashboardData.financials} formatCurrency={formatCurrency} />
                        </DashboardSection>

                        <DashboardSection title="Quick Actions">
                            <div className="grid grid-cols-2 gap-4">
                                <QuickActionButton icon={<Building />} label="Manage Colleges" />
                                <QuickActionButton icon={<BookOpen />} label="Manage Courses" />
                                <QuickActionButton icon={<UserCog />} label="Manage Staff" />
                                <QuickActionButton icon={<Calendar />} label="Manage Sessions" />
                                <QuickActionButton icon={<University />} label="University Profile" />
                                <QuickActionButton icon={<PlusCircle />} label="Add New" />
                            </div>
                        </DashboardSection>

                        <DashboardSection title="Admission Sessions">
                            <div className="space-y-4">
                                {dashboardData.activeSessions.map(session => (
                                    <div key={session.id} className="p-3 bg-gray-50 rounded-lg border">
                                        <p className="font-semibold text-gray-800">{session.name}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <StatusBadge status={session.status} />
                                            <p className="text-xs text-gray-500">
                                                {session.status === 'Active' ? `Ends: ${new Date(session.endDate).toLocaleDateString('en-GB')}` : `Starts: ${new Date(session.startDate).toLocaleDateString('en-GB')}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardSection>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Child Components ---

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg text-gray-600">Loading Dashboard...</p>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">Failed to Load Data</p>
        <p className="mt-1 text-gray-600">{message}</p>
    </div>
);


const DashboardSection = ({ title, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const StatCard = ({ icon, title, value, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        orange: 'bg-orange-50 text-orange-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };
    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[color]}`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

const QuickActionButton = ({ icon, label }) => (
    <button className="flex items-center justify-start text-left gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all text-gray-600">
        {React.cloneElement(icon, { size: 20 })}
        <span className="text-sm font-semibold">{label}</span>
    </button>
);

const FinancialsCard = ({ data, formatCurrency }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-green-50/50 border-l-4 border-green-500 rounded">
            <DollarSign className="text-green-600" size={24} />
            <div>
                <p className="text-sm text-gray-500">Total Revenue (YTD)</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(data.totalRevenueYTD)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-orange-50/50 border-l-4 border-orange-500 rounded">
            <DollarSign className="text-orange-600" size={24} />
            <div>
                <p className="text-sm text-gray-500">Pending Fees</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(data.pendingFees)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-red-50/50 border-l-4 border-red-500 rounded">
            <DollarSign className="text-red-600" size={24} />
            <div>
                <p className="text-sm text-gray-500">Operational Expenses</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(data.operationalExpenses)}</p>
            </div>
        </div>
    </div>
);

const EnrollmentChart = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    const minCount = Math.min(...data.map(d => d.count));

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((maxCount - minCount > 0) ? ((d.count - minCount) / (maxCount - minCount)) * 100 : 0);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="h-64 w-full">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - ((maxCount - minCount > 0) ? ((d.count - minCount) / (maxCount - minCount)) * 100 : 0);
                    return <circle key={i} cx={x} cy={y} r="2" fill="#3b82f6" />;
                })}
            </svg>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                {data.map(d => <span key={d.year}>{d.year}</span>)}
            </div>
        </div>
    );
};

const AffiliationsTable = ({ data }) => (
    <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                    <th className="p-3 font-semibold">College Name</th>
                    <th className="p-3 font-semibold">Affiliation Date</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
                {data.map(item => (
                    <tr key={item.id}>
                        <td className="p-3">
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="text-gray-500 font-mono text-xs">{item.code}</div>
                        </td>
                        <td className="p-3 text-gray-600">{new Date(item.affiliationDate).toLocaleDateString('en-GB')}</td>
                        <td className="p-3 text-center"><StatusBadge status={item.status} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const StatusBadge = ({ status }) => {
    const statusStyles = {
        'Active': 'bg-green-100 text-green-800',
        'Upcoming': 'bg-blue-100 text-blue-800',
        'Approved': 'bg-green-100 text-green-800',
        'Pending Review': 'bg-yellow-100 text-yellow-800',
        'Rejected': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
};

export default UniversityDashboard;

