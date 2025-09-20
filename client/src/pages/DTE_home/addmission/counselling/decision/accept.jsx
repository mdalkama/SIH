import React, { useEffect } from 'react';
import { 
  Download, 
  Printer, 
  CheckCircle, 
  Calendar,
  CreditCard,
  Upload,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink,
  FileText,
  Clock,
  Info
} from 'lucide-react';
import { useApplicantData } from '../ApplicantDataContext';

const AcceptDecision = () => {
  const { getPersonalInfo, getCounsellingStatus, getCollegePreferences, getCounsellingRounds } = useApplicantData();
  const personalInfo = getPersonalInfo();
  const counsellingStatus = getCounsellingStatus();
  const collegePreferences = getCollegePreferences();
  const counsellingRounds = getCounsellingRounds();
  
  // Get the allotted college details
  const allottedCollege = collegePreferences.find(cp => cp.status === 'Allotted');
  
  // Generate a submission ID
  const submissionId = `R${counsellingStatus.currentRound}-DEC-${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Calculate reporting deadline (3 days from now)
  const reportingDeadline = new Date();
  reportingDeadline.setDate(reportingDeadline.getDate() + 3);
  const formattedDeadline = reportingDeadline.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return (
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Decision Receipt</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Your acceptance has been successfully recorded for Round {counsellingStatus.currentRound}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Receipt Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-800">Your decision has been submitted.</h2>
              </div>
            </div>
          </div>

          {/* Decision Receipt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Decision Receipt</h2>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full font-medium">
                Round {counsellingStatus.currentRound}
              </span>
            </div>

            {/* Candidate & Decision Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Candidate</p>
                <p className="font-semibold text-gray-900">{personalInfo.name} • App ID: {personalInfo.applicationId}</p>
                <p className="font-semibold text-gray-900">{personalInfo.registrationNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Decision</p>
                <p className="font-semibold text-green-600">Accept & Freeze • Round {counsellingStatus.currentRound}</p>
              </div>
            </div>

            {/* Institute & Program Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Institute</p>
                <p className="font-semibold text-gray-900">{allottedCollege?.college || 'Not Allotted'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Program</p>
                <p className="font-semibold text-gray-900">{allottedCollege?.branch || 'Not Allotted'}</p>
              </div>
            </div>

            {/* Submission Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Submission ID</p>
                <p className="font-semibold text-gray-900">{submissionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Submitted On</p>
                <p className="font-semibold text-gray-900">{formattedDate}, {formattedTime}</p>
              </div>
            </div>

            {/* Reporting Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Reporting Instructions</h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Report to {allottedCollege?.college || 'the allotted college'} by {formattedDeadline} with the following:</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Decision receipt and government ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>10th & 12th marksheets, transfer certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Category certificate (if applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Fee payment proof</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Download className="h-4 w-4" />
                <span className="font-medium">Download Receipt (PDF)</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="h-4 w-4" />
                <span className="font-medium">Print</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">View Reporting Centre Map</span>
              </button>
            </div>
          </div>

          {/* Policy Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Policy Notes</h3>
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
                Important
              </span>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-2">Freeze selected.</p>
                  <p className="text-sm text-yellow-700">
                    You have exited further counselling rounds. Upward movement is disabled for this application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Next Actions & Support */}
        <div className="space-y-3 sm:space-y-4">
          {/* Next Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Next Actions</h3>
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">Required</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Book reporting slot</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Open</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Pay admission fee</span>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Pending</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Upload className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Upload documents</span>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Pending</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Get directions</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Optional</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Support</h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Helpdesk</span>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="h-4 w-4 text-gray-600" />
                  <p className="text-xs font-medium text-gray-600">Need assistance?</p>
                </div>
                <p className="text-sm text-gray-700">Call +91-80-1234-5678 (9 AM - 6 PM) or email support@ntu.edu</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  <Mail className="h-3 w-3" />
                  Contact Support
                </button>
                <button className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  <HelpCircle className="h-3 w-3" />
                  FAQs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptDecision;