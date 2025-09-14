import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, BookOpen, AlertOctagon, ArrowRight, MessageSquare, Building, IndianRupee, Loader2, AlertTriangle } from 'lucide-react';

// --- Helper Components ---
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-6 rounded-xl border bg-gradient-to-br from-white via-white to-${color}-50 border-${color}-200 shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium text-${color}-600`}>{title}</p>
        <p className={`text-3xl font-bold text-${color}-800 mt-1`}>{value}</p>
      </div>
      <Icon className={`w-9 h-9 text-${color}-400`} />
    </div>
  </div>
);

const QuickLinkCard = ({ title, description, icon: Icon, path }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(path)} className="w-full text-left bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600">{title}</h4>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
};

const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-1/2 bg-slate-200 rounded-lg mb-2"></div>
    <div className="h-4 w-1/3 bg-slate-200 rounded-lg mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="h-28 bg-white rounded-xl border border-slate-200"></div>
      <div className="h-28 bg-white rounded-xl border border-slate-200"></div>
      <div className="h-28 bg-white rounded-xl border border-slate-200"></div>
      <div className="h-28 bg-white rounded-xl border border-slate-200"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
        <div className="h-6 w-1/3 bg-slate-200 rounded-md mb-6"></div>
        <div className="space-y-4">
            <div className="h-12 bg-slate-100 rounded-lg"></div>
            <div className="h-12 bg-slate-100 rounded-lg"></div>
            <div className="h-12 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
      <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200">
        <div className="h-6 w-1/2 bg-slate-200 rounded-md mb-6"></div>
        <div className="space-y-4">
            <div className="h-16 bg-slate-100 rounded-lg"></div>
            <div className="h-16 bg-slate-100 rounded-lg"></div>
            <div className="h-16 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const CollegeAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://sih-4ptm.onrender.com/api/v1/college-admin/dashboard-summary', {
          credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch dashboard data.');
        }
        setDashboardData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertTriangle className="mx-auto w-12 h-12 text-red-500" /><p className="mt-4 text-red-600">{error}</p></div>;
  }

  const { stats, recentComplaints } = dashboardData || {};

  return (
    <div className="min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">College Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">A high-level overview of all college activities.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} color="blue" />
        <StatCard title="Total Staff" value={stats?.totalStaff || 0} icon={UserCheck} color="yellow" />
        <StatCard title="Total Courses" value={stats?.totalCourses || 0} icon={BookOpen} color="green" />
        <StatCard title="Pending Complaints" value={stats?.pendingComplaints || 0} icon={AlertOctagon} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Complaints */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-800">Recent Pending Complaints</h3>
          <div className="space-y-4">
            {recentComplaints && recentComplaints.length > 0 ? (
              recentComplaints.map(complaint => (
                <div key={complaint._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800">{complaint.title}</p>
                    <p className="text-xs text-slate-500">By: {complaint.filedBy?.name || 'N/A'} ({complaint.category})</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{complaint.status}</span>
                    <button 
                        onClick={() => navigate('/college-admin/manage-complaints')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No pending complaints. All clear!</p>
            )}
          </div>
        </div>

        {/* Right Column: Quick Links */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-800">Quick Links</h3>
          <div className="space-y-3">
            <QuickLinkCard title="Manage Employees" description="Add new staff and manage roles & profiles." icon={UserCheck} path="/college-admin/manage-employees" />
            <QuickLinkCard title="Manage Courses" description="Define courses, semesters, and subjects." icon={BookOpen} path="/college-admin/manage-courses" />
            <QuickLinkCard title="Manage College" description="Update official college details and profile." icon={Building} path="/college-admin/manage-college" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;