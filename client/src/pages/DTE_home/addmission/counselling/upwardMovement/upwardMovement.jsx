import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Phone, 
  Mail, 
  HelpCircle,
  Lock,
  Edit3,
  Calendar,
  User,
  GraduationCap,
  TrendingUp,
  Shield,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { useApplicantData } from '../ApplicantDataContext.jsx';

const UpwardMovement = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const { 
    getPersonalInfo, 
    getExamResults, 
    getCounsellingStatus, 
    getCollegePreferences,
    getNotifications,
    getAllotmentStatus,
    updatePersonalInfo,
    updateExamResults,
    updateCounsellingStatus,
    updateCollegePreferences,
    submitUpwardMovement,
    markNotificationAsRead,
    deleteNotification,
    processFeePayment,
    processDocumentVerification,
    processReporting,
    addNotification,
    loading,
    error 
  } = useApplicantData();

  const personalInfo = getPersonalInfo();
  const examResults = getExamResults();
  const counsellingStatus = getCounsellingStatus();
  const collegePreferences = getCollegePreferences();
  const notifications = getNotifications();
  const allotmentStatus = getAllotmentStatus();

  // Action handlers
  const handleViewFullPolicy = () => {
    // Simulate viewing full policy
    const content = `Upward Movement Policy\n\n1. Eligibility: Only candidates with current allotment can apply\n2. Preferences: Only higher-ranked preferences will be considered\n3. Process: Automatic consideration in subsequent rounds\n4. Upgrade: Once upgraded, previous allotment cannot be reclaimed\n5. Fee: No additional fee required for upward movement\n\nPlease read the complete policy document for detailed rules.`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<pre>${content}</pre>`);
    printWindow.document.close();
    printWindow.print();
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Upward movement policy document viewed',
      time: new Date().toLocaleTimeString(),
      read: false
    });
  };

  const handleContinueToPreferenceReview = () => {
    // Scroll to preference review section
    document.getElementById('preference-review').scrollIntoView({ behavior: 'smooth' });
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Navigated to preference review section',
      time: new Date().toLocaleTimeString(),
      read: false
    });
  };

  const handleEditPreferences = () => {
    // Simulate editing preferences
    alert('Redirecting to Update Options section to edit preferences...');
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Preference edit requested',
      time: new Date().toLocaleTimeString(),
      read: false
    });
  };

  const handleSubmitUpwardMovement = () => {
    if (isConfirmed) {
      // Submit upward movement using CRUD function
      submitUpwardMovement({
        round: 1,
        preferences: collegePreferences.filter(pref => pref.preferenceOrder < 5),
        timestamp: new Date().toISOString()
      });
      
      // Add notification
      addNotification({
        id: Date.now(),
        message: `Upward movement submitted for Round 1`,
        time: new Date().toLocaleTimeString(),
        read: false
      });
      
      // Generate and download receipt
      const receiptContent = `Upward Movement Receipt\n\nApplicant: ${personalInfo.name}\nApplication ID: ${personalInfo.applicationId}\nCurrent Round: 1\nNext Round: 2\nPreferences Submitted: ${collegePreferences.filter(pref => pref.preferenceOrder < 5).length}\nTimestamp: ${new Date().toLocaleString()}\n\nThis is your upward movement submission receipt.`;
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upward_movement_receipt_round_1.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('Upward movement submitted successfully! Receipt downloaded.');
    }
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading upward movement data...</p>
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
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Confirm Eligibility Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Confirm Eligibility</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Round 1</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                <span className="text-sm text-blue-600 font-medium">Round 2</span>
              </div>
            </div>

            {/* Orange Alert Box */}
            <div className="bg-[#fff7ed] border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-800 mb-2">
                    You can apply for upward movement to try for higher preferences.
                  </p>
                  <p className="text-sm text-orange-700">
                    By applying for upward movement, you are requesting to be considered for higher preference colleges in subsequent rounds while keeping your current allotment as backup.
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate Details */}
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Candidate</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-900">{personalInfo.name}</p>
                      <p className="text-sm text-gray-600">App ID: {personalInfo.applicationId}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Allotment</p>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-900">{counsellingStatus.allottedCollege?.split(',')[0] || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{counsellingStatus.allottedBranch}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Movement Rules */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Movement Rules (summary)
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Only higher-ranked preferences from your submitted list will be considered.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Once upgraded, the previous allotment cannot be reclaimed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>No fee payment required now; existing payment (if any) carries forward.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleViewFullPolicy}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">View Full Policy</span>
              </button>
              <button 
                onClick={handleContinueToPreferenceReview}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Continue to Preference Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3 sm:space-y-4">
          {/* Timeline Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Timeline</h3>
              <span className="text-xs text-blue-600">Next Round</span>
            </div>
            
          
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Submit movement</p>
                  <p className="text-xs text-gray-500">By {counsellingStatus.feePaymentDeadline?.split(' ')[0] || '6 PM'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Result publication</p>
                  <p className="text-xs text-gray-500">{counsellingStatus.nextRoundDate || 'Coming Soon'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 py-6 h-68">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Support</h3>
              <span className="text-xs text-blue-600">Helpdesk</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Questions about movement?</p>
                  <p className="text-xs text-gray-500">We can clarify eligibility and preference order rules.</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-2">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-gray-500" />
                  <p className="text-sm text-blue-600">support@counselling.gov</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 mb-2 ">Helpline</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-500" />
                  <p className="text-sm text-blue-600 ">1800-200-1234 (10am-6pm)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preference Review & Lock Section */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Preference Review & Lock</h2>
              <p className="text-sm text-gray-500 mt-1">Review and confirm your higher preferences for upward movement</p>
            </div>
            <span className="mt-2 sm:mt-0 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Your Higher Preferences */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Your higher preferences</h3>
              <div className="space-y-3">
                {collegePreferences
                  .filter(pref => pref.preferenceOrder < 5) // Show top 4 preferences
                  .map((pref, index) => (
                    <div 
                      key={index} 
                      className={`p-3 border rounded-lg ${
                        pref.preferenceOrder <= 2 
                          ? 'border-blue-200 bg-blue-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${
                            pref.preferenceOrder <= 2 
                              ? 'text-blue-900' 
                              : 'text-gray-700'
                          }`}>
                            {pref.college} • {pref.branch}
                          </p>
                          <p className={`text-sm ${
                            pref.preferenceOrder <= 2 
                              ? 'text-blue-700' 
                              : 'text-gray-600'
                          }`}>
                            Preference #{pref.preferenceOrder}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Lock Confirmation */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Lock confirmation</h3>
              
              <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="confirm-movement"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="w-4 h-4 mt-1 text-blue-600"
                  />
                  <label htmlFor="confirm-movement" className="text-sm text-orange-800">
                    I confirm that I want to be considered for upward movement to the above preferences.
                  </label>
                </div>
              </div>
              
              <div className="text-xs text-gray-600 mb-4">
                <p className="mb-2">You can edit preferences in the Update Options section before submission deadline.</p>
                <p className="mb-2">Note:</p>
                <p>• A movement receipt will be generated after submission.</p>
                <p>• Keep the PDF for records. No changes allowed after locking.</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleEditPreferences}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit Preferences</span>
                </button>
                <button 
                  onClick={handleSubmitUpwardMovement}
                  disabled={!isConfirmed}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                    isConfirmed 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>Lock & Submit Upward Movement</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpwardMovement;