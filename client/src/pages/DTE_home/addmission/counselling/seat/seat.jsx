import React, { useState, useEffect } from "react";
import {
  MapPin,
  School,
  Clock,
  FileText,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  User,
  Award,
  Calendar,
  AlertCircle,
  Info,
  ChevronRight,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Shield,
  MapPin as MapPinIcon
} from "lucide-react";
import { useApplicantData } from '../ApplicantDataContext.jsx';
import FreezeCountdown from '../components/FreezeCountdown';

const AllotmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('allotment');
  
  const { 
    getPersonalInfo, 
    getExamResults, 
    getCounsellingStatus, 
    getCollegePreferences,
    getNotifications,
    getAllotmentStatus,
    markNotificationAsRead,
    deleteNotification,
    processFeePayment,
    processDocumentVerification,
    processReporting,
    updateCounsellingStatus,
    addNotification,
    loading,
    error 
  } = useApplicantData();

  const personalInfo = getPersonalInfo();
  const examResults = getExamResults();
  const counsellingStatus = getCounsellingStatus();
  const collegePreferences = getCollegePreferences();
  const allotmentStatus = getAllotmentStatus();

  // Action handlers
  const handleDownloadAllotmentLetter = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `allotment-letter-${personalInfo.applicationId}.pdf`;
    link.click();
    
    addNotification({
      message: 'Allotment letter downloaded successfully!',
      type: 'success'
    });
  };

  const handlePrintInstructions = () => {
    window.print();
    addNotification({
      message: 'Instructions sent to printer!',
      type: 'info'
    });
  };

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

  const handleViewDetailedHistory = () => {
    // Simulate opening detailed history
    alert('Detailed allotment history would open in a new modal/window');
    
    addNotification({
      message: 'Detailed history view opened!',
      type: 'info'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading allotment data...</p>
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

  const candidateInfo = {
    name: personalInfo.name,
    applicationId: personalInfo.applicationId,
    rank: examResults.allIndiaRank,
    category: personalInfo.category,
    round: `Round ${counsellingStatus.currentRound}`
  };

  const allotmentDetails = {
    institute: counsellingStatus.allottedCollege,
    program: counsellingStatus.allottedBranch,
    location: "Rajasthan",
    quota: counsellingStatus.seatType,
    reportingDate: counsellingStatus.reportingDate,
    status: counsellingStatus.allotmentStatus
  };

  const notifications = getNotifications().slice(0, 3); // Show only latest 3 notifications

  const roundHistory = collegePreferences
    .filter(pref => pref.allotmentRound !== null)
    .map(pref => ({
      round: pref.allotmentRound,
      institute: pref.college,
      program: pref.branch,
      action: pref.status,
      result: pref.status === "Allotted" ? "Accepted" : "Pending Decision",
      status: pref.allotmentRound === counsellingStatus.currentRound ? "current" : "completed"
    }));

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto py-1 px-0 sm:px-1">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Seat Allotment Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage your seat allotment details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Current Allotment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Current Allotment</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-gray-500">{candidateInfo.round}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span className="text-xs sm:text-sm text-green-600 font-medium">Active</span>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-blue-600 mr-2" />
                      <p className="text-sm font-medium text-gray-600">Candidate Details</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{candidateInfo.name}</p>
                    <p className="text-sm text-gray-600">App ID: {candidateInfo.applicationId}</p>
                    <p className="text-sm text-gray-600">Rank: {candidateInfo.rank} | Category: {candidateInfo.category}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <School className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-sm font-medium text-gray-600">Allotted Institute</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{allotmentDetails.institute}</p>
                    <p className="text-sm text-gray-600">{allotmentDetails.program}</p>
                  </div>
                </div>

                {/* Allotment Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg bg-gray-50">
                    <MapPin size={16} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{allotmentDetails.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg bg-gray-50">
                    <Award size={16} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Quota</p>
                      <p className="font-medium">{allotmentDetails.quota}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg bg-gray-50">
                    <Clock size={16} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Reporting By</p>
                      <p className="font-medium">{allotmentDetails.reportingDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded-lg bg-gray-50">
                    <CheckCircle size={16} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-medium text-green-600">{allotmentDetails.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Round History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Round History</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Track your allotment history across rounds</p>
                  </div>
                  <button 
                    onClick={handleViewDetailedHistory}
                    className="mt-2 sm:mt-0 flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                  >
                    <FileText size={16} />
                    View Detailed History
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Round</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Institute</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Program</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {roundHistory.map((round, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{round.round}</td>
                          <td className="px-4 py-3">{round.institute}</td>
                          <td className="px-4 py-3">{round.program}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {round.action}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {round.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Your choices and results will appear here for each counseling round
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-2 sm:space-y-2.5">
            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Timeline</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Live
                </span>
              </div>

              <FreezeCountdown targetDate={counsellingStatus.feePaymentDeadline} />

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <p className="font-medium">Important:</p>
                    <p>Report physically if you choose Freeze. Bring: Admit card, Merit proof, Photo ID.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleDownloadAllotmentLetter}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <span className="font-medium">Download Allotment Letter</span>
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                </button>
                <button 
                  onClick={handlePrintInstructions}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <span className="font-medium">Print Instructions</span>
                  <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length} New
                </span>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-100' : 'bg-white'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      <div className="flex-shrink-0 flex space-x-1 ml-2">
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
            </div>

            {/* Important Dates Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
              <h3 className="text-sm font-medium text-gray-900 mb-4 sm:mb-5">Important Dates & Actions</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Round {counsellingStatus.currentRound} Freeze</p>
                  <p className="text-sm font-medium text-gray-900">{counsellingStatus.feePaymentDeadline}</p>
                  {!counsellingStatus.feesPaid && (
                    <button
                      onClick={handlePayFee}
                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Fee Now</span>
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Document Verification</p>
                  <p className="text-sm font-medium text-gray-900">{counsellingStatus.documentVerificationDate}</p>
                  {!counsellingStatus.documentsVerified && (
                    <button
                      onClick={handleVerifyDocuments}
                      className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Verify Documents</span>
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reporting to College</p>
                  <p className="text-sm font-medium text-gray-900">{counsellingStatus.reportingDate}</p>
                  {!counsellingStatus.hasReported && counsellingStatus.feesPaid && (
                    <button
                      onClick={handleReportToCollege}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <MapPinIcon className="w-4 h-4" />
                      <span>Report to College</span>
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Round {counsellingStatus.currentRound + 1} Results</p>
                  <p className="text-sm font-medium text-gray-900">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllotmentDashboard;
