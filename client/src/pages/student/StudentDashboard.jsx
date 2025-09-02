import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  BookOpen, 
  DollarSign, 
  Building, 
  FileText, 
  Calendar,
  Bell,
  Download
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchStudentData();
    fetchNotifications();
  }, []);

  const fetchStudentData = async () => {
    // Mock data - replace with actual API call
    setStudentData({
      name: user?.name || 'Student Name',
      registrationNumber: 'REG2024001',
      rollNumber: 'CS001',
      course: 'B.Tech Computer Science',
      semester: 6,
      cgpa: 8.5,
      attendance: 85,
      feesStatus: 'Paid',
      hostelRoom: 'A-101',
      libraryBooks: 3
    });
  };

  const fetchNotifications = async () => {
    // Mock notifications
    setNotifications([
      { id: 1, message: 'Semester exam schedule released', type: 'exam', date: '2024-01-20' },
      { id: 2, message: 'Fee payment due date approaching', type: 'fee', date: '2024-01-18' },
      { id: 3, message: 'New library books available', type: 'library', date: '2024-01-15' }
    ]);
  };

  const InfoCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
              <p className="text-sm text-gray-600">Department of Technical Education, Rajasthan</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{studentData?.name}</p>
                <p className="text-xs text-gray-500">{studentData?.registrationNumber}</p>
              </div>
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-2">Welcome back, {studentData?.name}!</h2>
          <p className="text-blue-100">
            {studentData?.course} - Semester {studentData?.semester}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard
            icon={BookOpen}
            title="CGPA"
            value={studentData?.cgpa}
            subtitle="Current Semester"
            color="green"
          />
          <InfoCard
            icon={Calendar}
            title="Attendance"
            value={`${studentData?.attendance}%`}
            subtitle="This Semester"
            color="blue"
          />
          <InfoCard
            icon={DollarSign}
            title="Fee Status"
            value={studentData?.feesStatus}
            subtitle="Current Semester"
            color="green"
          />
          <InfoCard
            icon={Building}
            title="Hostel Room"
            value={studentData?.hostelRoom}
            subtitle="Current Allocation"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-6 text-gray-900">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">View Results</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Pay Fees</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center">
                  <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Hostel Info</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-center">
                  <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Library</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center">
                  <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Exam Schedule</span>
                </button>
                
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-center">
                  <Download className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Downloads</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border-l-4 border-blue-400 pl-4 py-2">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Registration Number</p>
              <p className="text-lg font-semibold text-gray-900">{studentData?.registrationNumber}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Roll Number</p>
              <p className="text-lg font-semibold text-gray-900">{studentData?.rollNumber}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Current Semester</p>
              <p className="text-lg font-semibold text-gray-900">{studentData?.semester}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Library Books</p>
              <p className="text-lg font-semibold text-gray-900">{studentData?.libraryBooks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
