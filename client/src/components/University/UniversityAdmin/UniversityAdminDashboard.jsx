import React, { useState, useEffect, useMemo } from 'react';
import { Building, BookOpen, Users, UserCog, Calendar, Activity, PlusCircle, TrendingUp, IndianRupee, University, Loader2, AlertTriangle } from 'lucide-react';

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
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">


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
            <IndianRupee className="text-green-600" size={24} />
            <div>
                <p className="text-sm text-gray-500">Total Revenue (YTD)</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(data.totalRevenueYTD)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-orange-50/50 border-l-4 border-orange-500 rounded">
            <IndianRupee className="text-orange-600" size={24} />
            <div>
                <p className="text-sm text-gray-500">Pending Fees</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(data.pendingFees)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-red-50/50 border-l-4 border-red-500 rounded">
            <IndianRupee className="text-red-600" size={24} />
            <div>
                <p className="text-sm text-gray-500">Operational Expenses</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(data.operationalExpenses)}</p>
            </div>
        </div>
    </div>
);

const EnrollmentChart = ({ data }) => {
    // --- State for Interactivity ---
    // Stores the currently hovered data point to show tooltips and highlight the point.
    const [activePoint, setActivePoint] = useState(null);

    // --- Chart Configuration ---
    // Using an object for dimensions makes it easy to adjust padding and sizes.
    const dimensions = React.useMemo(() => ({
        width: 500,  // ViewBox width, for a consistent coordinate system
        height: 300, // ViewBox height
        padding: { top: 20, right: 20, bottom: 40, left: 50 },
    }), []);
    const chartWidth = dimensions.width - dimensions.padding.left - dimensions.padding.right;
    const chartHeight = dimensions.height - dimensions.padding.top - dimensions.padding.bottom;

    // --- Memoized Calculations ---
    // useMemo prevents expensive calculations from running on every render.
    // These calculations transform the raw data into SVG coordinates and paths.
    const chartData = useMemo(() => {
        if (!data || data.length < 2) return null;

        // Find the min and max counts to scale the Y-axis. Adding a buffer for visual appeal.
        const minCount = Math.min(...data.map(d => d.count));
        const maxCount = Math.max(...data.map(d => d.count));
        const yBuffer = (maxCount - minCount) * 0.1; // 10% buffer
        const yMin = Math.max(0, minCount - yBuffer);
        const yMax = maxCount + yBuffer;

        // Create an array of points with their calculated SVG coordinates.
        const points = data.map((d, i) => {
            const x = dimensions.padding.left + (i / (data.length - 1)) * chartWidth;
            const yRange = yMax - yMin;
            const y = dimensions.padding.top + chartHeight - (yRange > 0 ? ((d.count - yMin) / yRange) * chartHeight : chartHeight / 2);
            return { ...d, x, y };
        });

        // Create the SVG path 'd' attribute for the line.
        const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

        // Create the path for the area under the line to apply a gradient.
        const areaPath = `${linePath} V ${dimensions.height - dimensions.padding.bottom} H ${dimensions.padding.left} Z`;

        // Generate labels for the Y-axis.
        const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
            const value = yMin + (i / 4) * (yMax - yMin);
            const y = dimensions.padding.top + chartHeight - (i / 4) * chartHeight;
            // Format to integer or one decimal place if needed
            const label = Math.abs(value) > 1 ? Math.round(value) : value.toFixed(1);
            return { label, y };
        });

        return { points, linePath, areaPath, yAxisLabels };
    }, [data, dimensions, chartWidth, chartHeight]);

    // --- Event Handlers for Interactivity ---
    const handleMouseMove = (e) => {
        const svg = e.currentTarget;
        const svgPoint = svg.createSVGPoint();
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;

        // Transform cursor coordinates to SVG viewBox coordinates
        const { x: cursorX } = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

        // Find the closest data point to the cursor's x-position.
        const closestPoint = chartData?.points.reduce((prev, curr) =>
            Math.abs(curr.x - cursorX) < Math.abs(prev.x - cursorX) ? curr : prev
        );
        setActivePoint(closestPoint);
    };

    const handleMouseLeave = () => {
        setActivePoint(null);
    };

    // --- Render Logic ---
    // Show a message if there isn't enough data to draw a meaningful chart.
    if (!chartData) {
        return (
            <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg border text-gray-500">
                Not enough data to display the chart. (Requires at least 2 data points)
            </div>
        );
    }

    const { points, linePath, areaPath, yAxisLabels } = chartData;

    return (
        <div className="w-full font-sans">
            <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines & Labels */}
                {yAxisLabels.map(({ label, y }) => (
                    <g key={y} className="text-xs text-gray-400">
                        <line x1={dimensions.padding.left} y1={y} x2={dimensions.width - dimensions.padding.right} y2={y} stroke="currentColor" strokeDasharray="2,4" strokeOpacity="0.5" />
                        <text x={dimensions.padding.left - 8} y={y} textAnchor="end" alignmentBaseline="middle" fill="currentColor">{label}</text>
                    </g>
                ))}

                {/* X-Axis Labels */}
                {points.map(({ year, x }) => (
                    <text key={year} x={x} y={dimensions.height - dimensions.padding.bottom + 16} textAnchor="middle" fill="currentColor" className="text-xs text-gray-500 font-medium">
                        {year}
                    </text>
                ))}

                {/* Chart Paths */}
                <path d={areaPath} fill="url(#areaGradient)" />
                <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Interactive Tooltip Section (only shown on hover) */}
                {activePoint && (
                    <g>
                        {/* Tracker line */}
                        <line x1={activePoint.x} y1={dimensions.padding.top} x2={activePoint.x} y2={dimensions.height - dimensions.padding.bottom} stroke="#3b82f6" strokeDasharray="3,3" strokeOpacity="0.8" />

                        {/* Highlighted circle on the point */}
                        <circle cx={activePoint.x} cy={activePoint.y} r="5" fill="white" stroke="#3b82f6" strokeWidth="2" />

                        {/* Tooltip */}
                        <g transform={`translate(${activePoint.x}, ${activePoint.y - 12})`}>
                            <rect x="-40" y="-30" width="80" height="28" rx="4" fill="rgba(17, 24, 39, 0.8)" />
                            <text x="0" y="-16" textAnchor="middle" fill="white" className="text-sm font-bold">
                                {activePoint.count}
                            </text>
                        </g>
                    </g>
                )}
            </svg>
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

