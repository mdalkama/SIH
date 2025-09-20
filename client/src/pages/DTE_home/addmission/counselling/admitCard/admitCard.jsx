import React from "react";
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  FileText, 
  Download, 
  Printer, 
  Building,
  Hash,
  Phone,
  Mail,
  AlertCircle,
  Shield,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useApplicantData } from '../ApplicantDataContext.jsx';

const AdmitCard = () => {
  const { 
    getPersonalInfo, 
    getExamResults, 
    getCounsellingStatus, 
    getNotifications,
    getAllotmentStatus,
    updatePersonalInfo,
    updateExamResults,
    updateCounsellingStatus,
    updateCollegePreferences,
    markNotificationAsRead,
    deleteNotification,
    processFeePayment,
    processDocumentVerification,
    processReporting,
    addNotification,
    downloadAdmitCard,
    printAdmitCard,
    verifyAdmitCard,
    loading,
    error 
  } = useApplicantData();

  const personalInfo = getPersonalInfo();
  const examResults = getExamResults();
  const counsellingStatus = getCounsellingStatus();
  const notifications = getNotifications();
  const allotmentStatus = getAllotmentStatus();

  // Action handlers
  const handleDownloadAdmitCard = () => {
    downloadAdmitCard({
      applicationId: personalInfo.applicationId,
      candidateData: candidateData,
      timestamp: new Date().toISOString()
    });
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Admit card downloaded successfully',
      time: new Date().toLocaleTimeString(),
      read: false
    });
  };

  const handlePrintAdmitCard = () => {
    printAdmitCard({
      applicationId: personalInfo.applicationId,
      candidateData: candidateData,
      timestamp: new Date().toISOString()
    });
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Admit card print job sent',
      time: new Date().toLocaleTimeString(),
      read: false
    });
  };

  const handleVerifyAdmitCard = () => {
    verifyAdmitCard({
      applicationId: personalInfo.applicationId,
      verificationCode: candidateData.verificationCode,
      timestamp: new Date().toISOString()
    });
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Admit card verification initiated',
      time: new Date().toLocaleTimeString(),
      read: false
    });
    
    alert('Admit card verification initiated. You will receive confirmation shortly.');
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId);
  };

  const candidateData = {
    name: personalInfo.name,
    applicationId: personalInfo.applicationId,
    examCenter: counsellingStatus.examCenter || "Delhi • Center 12",
    reportingTime: counsellingStatus.reportingTime || "10:00 AM - 12:00 PM",
    examDate: counsellingStatus.examDate || "22 Aug 2025",
    gate: counsellingStatus.gate || "B",
    seatNo: counsellingStatus.seatNo || "D12-47",
    verificationCode: counsellingStatus.verificationCode || "8QZ-19K-7F",
    examTitle: "Counselling Entrance 2025",
    roundInfo: `Seat Test • Round ${counsellingStatus.currentRound}`
  };

  const instructions = [
    {
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      text: "Carry a valid photo ID with this admit card."
    },
    {
      icon: <Clock className="w-5 h-5 text-green-600" />,
      text: "Reach the center at least 30 minutes before reporting time."
    },
    {
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      text: "Electronic devices are not allowed in exam hall."
    },
    {
      icon: <MapPin className="w-5 h-5 text-purple-600" />,
      text: "Follow seating as per Seat No. on the card."
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log("Downloading PDF...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admit card data...</p>
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

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto py-1 px-0 sm:px-1">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admit Card</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Download and print your admit card</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          
          {/* Left Column - Admit Card */}
          <div className="lg:col-span-2 space-y-4">
            {/* Admit Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Admit Card</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-gray-500">{candidateData.roundInfo}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs sm:text-sm text-blue-600 font-medium">Ready</span>
                  </div>
                </div>

                {/* Candidate & Exam Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <User className="w-6 h-6 text-blue-600 mr-3" />
                      <p className="text-base font-medium text-gray-600">Candidate Details</p>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">{candidateData.name}</p>
                    <p className="text-base text-gray-600">App ID: {candidateData.applicationId}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-6 h-6 text-green-600 mr-3" />
                      <p className="text-base font-medium text-gray-600">Exam Details</p>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">{candidateData.examTitle}</p>
                    <p className="text-base text-gray-600">{candidateData.examDate}</p>
                  </div>
                </div>

                {/* Exam Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-4 text-base text-gray-700 p-4 rounded-lg bg-gray-50">
                    <Building className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Center</p>
                      <p className="font-semibold">{candidateData.examCenter}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-base text-gray-700 p-4 rounded-lg bg-gray-50">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Time</p>
                      <p className="font-semibold">{candidateData.reportingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-base text-gray-700 p-4 rounded-lg bg-gray-50">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gate</p>
                      <p className="font-semibold text-blue-600 text-lg">{candidateData.gate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-base text-gray-700 p-4 rounded-lg bg-gray-50">
                    <Hash className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Seat No.</p>
                      <p className="font-semibold text-green-600 text-lg">{candidateData.seatNo}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePrintAdmitCard}
                    className="flex items-center justify-center gap-3 px-6 py-3 text-base text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Printer className="w-5 h-5" />
                    Print Admit Card
                  </button>
                  
                  <button
                    onClick={handleDownloadAdmitCard}
                    className="flex items-center justify-center gap-3 px-6 py-3 text-base text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  
                  <button
                    onClick={handleVerifyAdmitCard}
                    className="flex items-center justify-center gap-3 px-6 py-3 text-base text-green-600 border border-green-200 rounded-lg hover:bg-green-50"
                  >
                    <Shield className="w-5 h-5" />
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Instructions & Contact Support */}
          <div className="space-y-2 sm:space-y-2.5">
            
            {/* Instructions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Instructions</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Important
                </span>
              </div>
              
              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {instruction.icon}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{instruction.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Contact Support</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Help
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@counselling.gov</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">1800-000-123</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Support Hours</p>
                    <p className="text-sm text-blue-700">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
       
      </div>
    </div>
  );
};

export default AdmitCard;