import React, { useState, useEffect, useMemo } from 'react';
import {
    Building, BookOpen, Users, UserCog, Loader2, AlertTriangle, IndianRupee, TrendingUp
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';

const API_BASE_URL = "https://sih-4ptm.onrender.com/api/v1/university-admin";

// --- NEW SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <header className="mb-8">
            <div className="h-8 w-1/3 bg-slate-200 rounded-lg mb-2"></div>
            <div className="h-5 w-1/2 bg-slate-200 rounded-md"></div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="h-80 bg-slate-200 rounded-xl"></div>
                <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="space-y-8">
                <div className="h-64 bg-slate-200 rounded-xl"></div>
                <div className="h-48 bg-slate-200 rounded-xl"></div>
            </div>
        </div>
    </div>
);

// --- Helper Components (No changes from your original code) ---
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
        <div className="p-4 border-b border-gray-200"><h2 className="text-lg font-bold text-gray-800">{title}</h2></div>
        <div className="p-6">{children}</div>
    </div>
);

const StatCard = ({ icon, title, value, color }) => {
    const colors = { blue: 'bg-blue-50 text-blue-600', orange: 'bg-orange-50 text-orange-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600' };
    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[color]}`}>{React.cloneElement(icon, { size: 24 })}</div>
            <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-3xl font-bold text-gray-800">{value}</p></div>
        </div>
    );
};

const FinancialsCard = ({ data, formatCurrency }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-green-50/50 border-l-4 border-green-500 rounded"><IndianRupee className="text-green-600" size={24} /><div><p className="text-sm text-gray-500">Total Revenue (YTD)</p><p className="text-xl font-bold text-gray-800">{formatCurrency(data.totalRevenueYTD)}</p></div></div>
        <div className="flex items-center gap-4 p-3 bg-orange-50/50 border-l-4 border-orange-500 rounded"><IndianRupee className="text-orange-600" size={24} /><div><p className="text-sm text-gray-500">Pending Fees</p><p className="text-xl font-bold text-gray-800">{formatCurrency(data.pendingFees)}</p></div></div>
        <div className="flex items-center gap-4 p-3 bg-red-50/50 border-l-4 border-red-500 rounded"><IndianRupee className="text-red-600" size={24} /><div><p className="text-sm text-gray-500">Operational Expenses</p><p className="text-xl font-bold text-gray-800">{formatCurrency(data.operationalExpenses)}</p></div></div>
    </div>
);

const EnrollmentChart = ({ data }) => {
    const [activePoint, setActivePoint] = useState(null);
    const dimensions = React.useMemo(() => ({ width: 500, height: 300, padding: { top: 20, right: 20, bottom: 40, left: 50 } }), []);
    const chartWidth = dimensions.width - dimensions.padding.left - dimensions.padding.right;
    const chartHeight = dimensions.height - dimensions.padding.top - dimensions.padding.bottom;
    const chartData = useMemo(() => { if (!data || data.length < 2) return null; const minCount = Math.min(...data.map(d => d.count)); const maxCount = Math.max(...data.map(d => d.count)); const yBuffer = (maxCount - minCount) * 0.1; const yMin = Math.max(0, minCount - yBuffer); const yMax = maxCount + yBuffer; const points = data.map((d, i) => { const x = dimensions.padding.left + (i / (data.length - 1)) * chartWidth; const yRange = yMax - yMin; const y = dimensions.padding.top + chartHeight - (yRange > 0 ? ((d.count - yMin) / yRange) * chartHeight : chartHeight / 2); return { ...d, x, y }; }); const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' '); const areaPath = `${linePath} V ${dimensions.height - dimensions.padding.bottom} H ${dimensions.padding.left} Z`; const yAxisLabels = Array.from({ length: 5 }, (_, i) => { const value = yMin + (i / 4) * (yMax - yMin); const y = dimensions.padding.top + chartHeight - (i / 4) * chartHeight; const label = Math.abs(value) > 1 ? Math.round(value) : value.toFixed(1); return { label, y }; }); return { points, linePath, areaPath, yAxisLabels }; }, [data, dimensions, chartWidth, chartHeight]);
    const handleMouseMove = (e) => { const svg = e.currentTarget; const svgPoint = svg.createSVGPoint(); svgPoint.x = e.clientX; svgPoint.y = e.clientY; const { x: cursorX } = svgPoint.matrixTransform(svg.getScreenCTM().inverse()); const closestPoint = chartData?.points.reduce((prev, curr) => Math.abs(curr.x - cursorX) < Math.abs(prev.x - cursorX) ? curr : prev); setActivePoint(closestPoint); };
    const handleMouseLeave = () => { setActivePoint(null); };
    if (!chartData) { return ( <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg border text-gray-500">Not enough data for chart.</div>); }
    const { points, linePath, areaPath, yAxisLabels } = chartData;
    return ( <div className="w-full font-sans"><svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}><defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs>{yAxisLabels.map(({ label, y }) => (<g key={y} className="text-xs text-gray-400"><line x1={dimensions.padding.left} y1={y} x2={dimensions.width - dimensions.padding.right} y2={y} stroke="currentColor" strokeDasharray="2,4" strokeOpacity="0.5" /><text x={dimensions.padding.left - 8} y={y} textAnchor="end" alignmentBaseline="middle" fill="currentColor">{label}</text></g>))}{points.map(({ year, x }) => (<text key={year} x={x} y={dimensions.height - dimensions.padding.bottom + 16} textAnchor="middle" fill="currentColor" className="text-xs text-gray-500 font-medium">{year}</text>))}<path d={areaPath} fill="url(#areaGradient)" /><path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />{activePoint && (<g><line x1={activePoint.x} y1={dimensions.padding.top} x2={activePoint.x} y2={dimensions.height - dimensions.padding.bottom} stroke="#3b82f6" strokeDasharray="3,3" strokeOpacity="0.8" /><circle cx={activePoint.x} cy={activePoint.y} r="5" fill="white" stroke="#3b82f6" strokeWidth="2" /><g transform={`translate(${activePoint.x}, ${activePoint.y - 12})`}><rect x="-40" y="-30" width="80" height="28" rx="4" fill="rgba(17, 24, 39, 0.8)" /><text x="0" y="-16" textAnchor="middle" fill="white" className="text-sm font-bold">{activePoint.count}</text></g></g>)}</svg></div>);
};

const AffiliationsTable = ({ data }) => ( <div className="w-full overflow-x-auto"><table className="w-full min-w-[600px]"><thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider"><tr><th className="p-3 font-semibold">College Name</th><th className="p-3 font-semibold">Affiliation Date</th><th className="p-3 font-semibold text-center">Status</th></tr></thead><tbody className="divide-y divide-gray-200 text-sm">{data.map(item => (<tr key={item.id}> <td className="p-3"><div className="font-medium text-gray-800">{item.name}</div><div className="text-gray-500 font-mono text-xs">{item.code}</div></td> <td className="p-3 text-gray-600">{new Date(item.affiliationDate).toLocaleDateString('en-GB')}</td> <td className="p-3 text-center"><StatusBadge status={item.status} /></td> </tr>))}</tbody></table></div>);
const StatusBadge = ({ status }) => { const statusStyles = { 'Active': 'bg-green-100 text-green-800', 'Upcoming': 'bg-blue-100 text-blue-800', 'Approved': 'bg-green-100 text-green-800', 'Pending Review': 'bg-yellow-100 text-yellow-800', 'Rejected': 'bg-red-100 text-red-800', }; return ( <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100'}`}>{status}</span>); };

// --- MAIN DASHBOARD COMPONENT ---
const UniversityDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        if (userLoading) return;

        const loadDashboard = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard-stats`, { credentials: 'include' });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || "Failed to fetch dashboard data.");
                }
                const result = await response.json();
                setDashboardData(result.data);
            } catch (err) {
                setError(err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [userLoading]);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

    // --- THIS IS THE ONLY CHANGE ---
    // Show the new SkeletonLoader when loading, instead of the simple spinner
    if (loading || userLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!dashboardData) {
        return <ErrorDisplay message="No dashboard data could be loaded." />;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<Building />} title="Affiliated Colleges" value={dashboardData.stats.totalColleges} color="blue" />
                    <StatCard icon={<BookOpen />} title="Total Courses" value={dashboardData.stats.totalCourses} color="orange" />
                    <StatCard icon={<Users />} title="Enrolled Students" value={dashboardData.stats.totalStudents.toLocaleString('en-IN')} color="green" />
                    <StatCard icon={<UserCog />} title="Total Staff" value={dashboardData.stats.totalStaff.toLocaleString('en-IN')} color="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <DashboardSection title="Student Enrollment Trends (Last 5 Years)">
                            <EnrollmentChart data={dashboardData.enrollmentTrends} />
                        </DashboardSection>
                        <DashboardSection title="Recent College Affiliations">
                            <AffiliationsTable data={dashboardData.recentAffiliations} />
                        </DashboardSection>
                    </div>

                    <div className="space-y-8">
                        <DashboardSection title="Financial Overview (YTD)">
                            <FinancialsCard data={dashboardData.financials} formatCurrency={formatCurrency} />
                        </DashboardSection>
                        <DashboardSection title="Admission Sessions">
                            <div className="space-y-4">
                                {dashboardData.activeSessions.map(session => (
                                    <div key={session.id} className="p-3 bg-gray-50 rounded-lg border border-slate-300">
                                        <p className="font-semibold text-gray-800">{session.name}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <StatusBadge status={session.status} />
                                            <p className="text-xs text-gray-500">{session.status === 'Active' ? `Ends: ${new Date(session.endDate).toLocaleDateString('en-GB')}` : `Starts: ${new Date(session.startDate).toLocaleDateString('en-GB')}`}</p>
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

export default UniversityDashboard;