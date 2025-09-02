import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  DollarSign, 
  Building, 
  FileText, 
  BarChart3, 
  Settings,
  Bell,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
  }, []);

  const fetchDashboardData = async () => {
    // Mock data - replace with actual API call
    setDashboardData({
      totalStudents: 1250,
      pendingAdmissions: 45,
      totalRevenue: 2500000,
      hostelOccupancy: 85,
      upcomingExams: 12,
      pendingFees: 180000,
      staffCount: 85,
      activeComplaints: 8
    });
  };

  const fetchRecentActivities = async () => {
    setRecentActivities([
      { id: 1, type: 'admission', message: 'New admission application received', time: '2 hours ago' },
      { id: 2, type: 'payment', message: 'Fee payment processed for John Doe', time: '3 hours ago' },
      { id: 3, type: 'hostel', message: 'Room allocated to Jane Smith', time: '5 hours ago' },
      { id: 4, type: 'exam', message: 'Exam schedule updated for Semester 6', time: '1 day ago' }
    ]);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4 inline mr-1" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
              <p className="text-sm text-gray-600">Department of Technical Education, Rajasthan</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-2">Welcome, {user?.name}</h2>
          <p className="text-blue-100">Staff ID: {user?.staffId} | Role: {user?.role}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={dashboardData?.totalStudents?.toLocaleString()}
            subtitle={`${dashboardData?.pendingAdmissions} pending admissions`}
            color="blue"
            trend={5}
          />
          
          <StatCard
            icon={DollarSign}
            title="Revenue Collected"
            value={`₹${(dashboardData?.totalRevenue / 100000)?.toFixed(1)}L`}
            subtitle={`₹${(dashboardData?.pendingFees / 1000)?.toFixed(0)}K pending`}
            color="green"
            trend={12}
          />
          
          <StatCard
            icon={Building}
            title="Hostel Occupancy"
            value={`${dashboardData?.hostelOccupancy}%`}
            subtitle="850/1000 rooms occupied"
            color="purple"
            trend={-2}
          />
          
          <StatCard
            icon={AlertCircle}
            title="Pending Actions"
            value={dashboardData?.activeComplaints}
            subtitle="Require attention"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Management Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-900">Management Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Manage Students</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Fee Collection</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center">
                  <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Hostel Management</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-center">
                  <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Examinations</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center">
                  <BarChart3 className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Reports</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-center">
                  <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border-l-4 border-blue-400 pl-4 py-2">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all activities →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
