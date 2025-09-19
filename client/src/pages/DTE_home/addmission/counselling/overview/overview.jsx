import React from "react";
import { Hash, FileText, Clock, CheckCircle, Award, User, Info, RefreshCw } from "lucide-react";

const Overview = () => {
  const candidateInfo = {
    name: "Aditi Sharma",
    applicationId: "APP-78QK9",
    registrationNo: "REG2025-06421",
    category: "General (UR)",
    profileComplete: true,
    stats: [
      { 
        title: "Merit Rank", 
        value: "154", 
        icon: <Award className="text-gray-600" />,
        status: "confirmed"
      },
      { 
        title: "Allotment Round", 
        value: "Round 1", 
        icon: <RefreshCw className="text-gray-600" />,
        status: "completed"
      },
      { 
        title: "Admit Card", 
        value: "Available", 
        icon: <FileText className="text-green-600" />,
        status: "available"
      },
      { 
        title: "Result Status", 
        value: "Pending", 
        icon: <Clock className="text-amber-500" />,
        status: "pending"
      },
      { 
        title: "Next Step", 
        value: "Update Options", 
        icon: <CheckCircle className="text-blue-600" />,
        status: "action-required"
      }
    ]
  };

  const notifications = [
    {
      id: 1,
      message: "Round 1 Allotment results published.",
      time: "10:24",
      read: false
    },
    {
      id: 2,
      message: "Verify your merit details before next round.",
      time: "09:10",
      read: false
    },
    {
      id: 3,
      message: "Payment window closes in 22 hours.",
      time: "08:55",
      read: false
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'text-green-600';
      case 'pending': return 'text-amber-500';
      case 'completed': return 'text-blue-600';
      case 'action-required': return 'text-purple-600';
      case 'confirmed': return 'text-gray-800';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {candidateInfo.name}</h1>
          <p className="text-gray-600">Here's your admission status at a glance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{candidateInfo.name}</h2>
                      <p className="text-sm text-gray-600">Application ID: {candidateInfo.applicationId}</p>
                      <p className="text-sm text-gray-600">Registration: {candidateInfo.registrationNo}</p>
                      <p className="text-sm text-gray-600">Category: {candidateInfo.category}</p>
                    </div>
                    <span className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Profile Complete
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidateInfo.stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${getStatusColor(stat.status)} bg-opacity-10`}>
                      {stat.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                      <p className={`text-xl font-semibold ${getStatusColor(stat.status)}`}>
                        {stat.value}
                      </p>
                      {stat.status === 'action-required' && (
                        <span className="inline-flex items-center text-xs text-purple-600 mt-1">
                          <Info className="w-3 h-3 mr-1" /> Action required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length} New
                </span>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-100' : 'bg-white'}`}>
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Left */}
              <div className="mt-6 p-4 bg-gray-900 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Time left to freeze/float</p>
                    <p className="text-xs text-blue-300 mt-1">Next round starts in</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono font-bold">22:15:43</p>
                    <p className="text-xs text-blue-300">Auto-reminder enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
