import React, { useState, useEffect } from 'react';
import { Loader2, Users, Star, IndianRupee, Briefcase, Percent, Download, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/placements';
// const API_BASE_URL = 'http://localhost:8000/api/v1/placements';

// --- SKELETON LOADER COMPONENT ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="mb-8">
            <div className="h-8 w-1/3 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-5 w-1/2 bg-slate-200 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-xl"></div>)}
        </div>
        <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b h-16 bg-slate-100"></div>
            <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>)}
            </div>
        </div>
    </div>
);

// --- HELPER SUB-COMPONENTS ---
const StatCard = ({ icon: Icon, title, value, colorClass, isCurrency = false, isPercent = false }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">
                    {isCurrency ? `${new Intl.NumberFormat('en-IN').format(value)} LPA` : value}
                    {isPercent && '%'}
                </p>
                <p className="text-sm font-medium text-slate-500">{title}</p>
            </div>
        </div>
    </div>
);

// --- MAIN FUNCTIONAL COMPONENT ---
const CollegePlacementStatus = () => {
    const [stats, setStats] = useState({});
    const [branchData, setBranchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchPlacementData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/stats/${selectedYear}`, { credentials: 'include' });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || `Failed to fetch stats for ${selectedYear}.`);
                }
                const data = await response.json();
                setStats(data.stats || {});
                setBranchData(data.branchData || []);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlacementData();
    }, [selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="mx-auto w-12 h-12 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3>
                <p className="text-red-600 mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="font-sans">
            <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Placement Status</h1>
                    <p className="mt-1 text-slate-600">Overall placement statistics for the academic year.</p>
                </div>
                <div className="flex items-center gap-4">
                    <select value={selectedYear} onChange={handleYearChange} className="px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold">
                        <option value="2024">2023-2024</option>
                        <option value="2023">2022-2023</option>
                        <option value="2022">2021-2022</option>
                    </select>
                     <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                        <Download size={16} /> Download Report
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Percent} title="Placement Percentage" value={stats.placementPercentage ?? 0} colorClass="bg-green-100 text-green-600" isPercent={true} />
                <StatCard icon={Users} title="Students Placed" value={`${stats.studentsPlaced ?? 0} / ${stats.totalStudents ?? 0}`} colorClass="bg-blue-100 text-blue-600" />
                <StatCard icon={Star} title="Highest Package" value={stats.highestPackage ?? 0} colorClass="bg-amber-100 text-amber-600" isCurrency={true} />
                <StatCard icon={IndianRupee} title="Average Package" value={stats.averagePackage ?? 0} colorClass="bg-indigo-100 text-indigo-600" isCurrency={true} />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">Branch-wise Breakdown ({selectedYear-1}-{selectedYear})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr><th className="p-3 font-semibold text-left">Branch</th><th className="p-3 font-semibold text-center">Total Students</th><th className="p-3 font-semibold text-center">Students Placed</th><th className="p-3 font-semibold text-center">Placement %</th><th className="p-3 font-semibold text-center">Avg. Package (LPA)</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {branchData.length > 0 ? (
                                branchData.map(branch => {
                                    const percentage = branch.total > 0 ? ((branch.placed / branch.total) * 100).toFixed(1) : 0;
                                    return (
                                        <tr key={branch.branch} className="hover:bg-slate-50">
                                            <td className="p-3 font-semibold text-slate-700">{branch.branch}</td>
                                            <td className="p-3 text-center text-slate-600">{branch.total}</td>
                                            <td className="p-3 text-center font-semibold text-green-600">{branch.placed}</td>
                                            <td className="p-3 text-center">
                                                <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div></div>
                                                <span className="text-xs font-semibold text-blue-600 mt-1 block">{percentage}%</span>
                                            </td>
                                            <td className="p-3 text-center font-mono font-semibold text-slate-700">{branch.avgPackage.toFixed(1)}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr><td colSpan="5" className="text-center p-8 text-slate-500">No placement data found for the selected year.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Top Recruiters</h3><div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg text-slate-500">Chart Placeholder (e.g., Bar Chart)</div></div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"><h3 className="text-lg font-semibold text-slate-800 mb-4">Placement Trend (Last 5 Years)</h3><div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg text-slate-500">Chart Placeholder (e.g., Line Chart)</div></div>
            </div>
        </div>
    );
};

export default CollegePlacementStatus;