import React, { useContext } from "react";
import { Hash, FileText, Clock, CheckCircle, Award, User, Info, RefreshCw, AlertCircle, Download, Printer, Edit, Trash2, Eye, CreditCard, MapPin, Shield } from "lucide-react";
import { useApplicantData } from '../ApplicantDataContext.jsx';
import CountdownTimer from '../components/CountdownTimer.jsx';

const Overview = () => {
  const { 
    getPersonalInfo, 
    getExamResults, 
    getCounsellingStatus, 
    getNotifications, 
    getCurrentRound,
    markNotificationAsRead,
    deleteNotification,
    processFeePayment,
    processDocumentVerification,
    processReporting,
    loading,
    error 
  } = useApplicantData();

  const personalInfo = getPersonalInfo();
  const examResults = getExamResults();
  const counsellingStatus = getCounsellingStatus();
  const currentRound = getCurrentRound();

  // Action handlers
  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId);
  };

  const handlePayFee = () => {
    processFeePayment();
  };

  const handleVerifyDocuments = () => {
    processDocumentVerification();
  };

  const handleReportToCollege = () => {
    processReporting();
  };

  const handleDownloadAdmitCard = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `admit-card-${personalInfo.applicationId}.pdf`;
    link.click();
    
    alert('Admit Card downloaded successfully!');
  };

  const handlePrintAdmitCard = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading applicant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      title: "Merit Rank", 
      value: examResults.allIndiaRank?.toString() || "N/A", 
      icon: <Award className="text-gray-600" />,
      status: "confirmed"
    },
    { 
      title: "Allotment Round", 
      value: `Round ${counsellingStatus.currentRound || "N/A"}`, 
      icon: <RefreshCw className="text-gray-600" />,
      status: counsellingStatus.allotmentStatus === "Allotted" ? "completed" : "pending"
    },
    { 
      title: "Admit Card", 
      value: "Available", 
      icon: <FileText className={counsellingStatus.currentRound >= 1 ? "text-green-600" : "text-gray-400"} />,
      status: counsellingStatus.currentRound >= 1 ? "available" : "pending"
    },
    { 
      title: "Result Status", 
      value: counsellingStatus.allotmentStatus || "Pending", 
      icon: counsellingStatus.allotmentStatus === "Allotted" ? 
        <CheckCircle className="text-green-600" /> : 
        <Clock className="text-amber-500" />,
      status: counsellingStatus.allotmentStatus === "Allotted" ? "completed" : "pending"
    },
    { 
      title: "Next Step", 
      value: counsellingStatus.hasReported ? "Reported" : 
             counsellingStatus.feesPaid ? "Pay Fee" : 
             counsellingStatus.documentsVerified ? "Verify Documents" : "Update Options",
      icon: <CheckCircle className={counsellingStatus.hasReported ? "text-green-600" : "text-blue-600"} />,
      status: counsellingStatus.hasReported ? "completed" : "action-required"
    }
  ];

  const notifications = getNotifications().slice(0, 5); // Show only latest 5 notifications

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
      <div className="max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Candidate Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img 
                    src={personalInfo.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                    alt={personalInfo.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{personalInfo.name}</h3>
                  <p className="text-sm text-gray-600">Application ID: {personalInfo.applicationId}</p>
                  <p className="text-sm text-gray-600">Registration No: {personalInfo.registrationNo}</p>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {personalInfo.category}
                    </span>
                    {personalInfo.profileComplete && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Profile Complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${getStatusColor(stat.status)} bg-opacity-10`}>
                      {stat.icon}
                    </div>
                    <div className="ml-3">
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
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length} New
                </span>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-2.5 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-100' : 'bg-white'}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      <div className="flex-shrink-0 flex space-x-1">
                        {!notification.read && (
                          <button 
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Countdown Timers */}
              <div className="space-y-3">
               
                {counsellingStatus.reportingDate && !counsellingStatus.hasReported && (
                  <div className="relative">
                    <CountdownTimer
                      targetDate={counsellingStatus.reportingDate}
                      title="Reporting Deadline"
                      description="Report to the allotted college with required documents"
                      type="deadline"
                    />
                    <button
                      onClick={handleReportToCollege}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Report to College</span>
                    </button>
                  </div>
                )}
                
                {counsellingStatus.documentVerificationDate && !counsellingStatus.documentsVerified && (
                  <div className="relative">
                    <CountdownTimer
                      targetDate={counsellingStatus.documentVerificationDate}
                      title="Document Verification"
                      description="Get your documents verified at the college"
                      type="deadline"
                    />
                    <button
                      onClick={handleVerifyDocuments}
                      className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Verify Documents</span>
                    </button>
                  </div>
                )}
                
                {/* Admit Card Actions */}
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Admit Card</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownloadAdmitCard}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handlePrintAdmitCard}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
                
                {/* Next Round Timer */}
                {/* <CountdownTimer
                  targetDate="2025-03-30T23:59:59"
                  title="Next Round Starts"
                  description="Time left to freeze/float options for next counselling round"
                  type="deadline"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
