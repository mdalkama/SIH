import React, { useState } from 'react';
import { 
  Download, 
  AlertTriangle, 
  Share2,
  RefreshCw,
  Search,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  CreditCard
} from 'lucide-react';

const RejectDecision = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Exit from Counselling Confirmed</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Your rejection has been successfully recorded for Round 1</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Exit Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-orange-800 mb-2">You have rejected the allotted seat and exited the process.</h2>
                <p className="text-sm text-orange-700">
                  This decision is final and cannot be reversed. You are no longer eligible to participate in further counselling rounds. If you have already paid any provisional fees, initiate a refund request below (as per policy).
                </p>
              </div>
            </div>
          </div>

          {/* Candidate & Rejected Seat Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Candidate</p>
                <p className="font-semibold text-gray-900">Aarav Sharma • App ID:</p>
                <p className="font-semibold text-gray-900">23C-1145</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Rejected Seat</p>
                <p className="font-semibold text-gray-900">NTU • B.Tech Computer Science</p>
              </div>
            </div>

            {/* What this means */}
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What this means</h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Your participation in the current counselling is now closed. If you have already paid any provisional fees, initiate a refund request below (as per policy).</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Download the exit acknowledgement for your records.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Request refund (if eligible) using your payment reference.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Optionally share your reason for exit to help us improve.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Download className="h-4 w-4" />
                <span className="font-medium">Download Exit Acknowledgement (PDF)</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span className="font-medium">Start Refund Request</span>
              </button>
            </div>
          </div>

          {/* Exit Feedback & Refund */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Exit Feedback & Refund</h3>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                Optional
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Choose a reason for exit</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => setSelectedReason('accepted')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedReason === 'accepted' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">Accepted offer elsewhere</p>
                <p className="text-xs mt-1">Joined another institute</p>
              </button>
              
              <button 
                onClick={() => setSelectedReason('financial')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedReason === 'financial' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">Financial constraints</p>
                <p className="text-xs mt-1">Unable to proceed</p>
              </button>
              
              <button 
                onClick={() => setSelectedReason('program')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedReason === 'program' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">Program preference change</p>
                <p className="text-xs mt-1">Different course/branch</p>
              </button>
              
              <button 
                onClick={() => setSelectedReason('personal')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedReason === 'personal' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">Personal reasons</p>
                <p className="text-xs mt-1">Health/relocation</p>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Additional details (optional)</p>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Add a short note for the counselling authority"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Payment reference (for refund)</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g., TXN-89XK34"
                  className="flex-1 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">Exit Portal</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Submit Feedback & Request Refund</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Next Actions & Support */}
        <div className="space-y-3 sm:space-y-4">
          {/* Next Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Next Actions</h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Optional</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <Share2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Share exit reason</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">~2 min</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Refund request</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">Policy-based</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Explore future rounds</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">If applicable</span>
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
                <p className="text-sm text-gray-700 mb-2">Our helpdesk can guide you with policy, refunds and re-application.</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">support@counselling.gov</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Helpline</p>
                    <p className="text-sm font-medium text-gray-900">1800-200-1234 (10am-6pm)</p>
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

export default RejectDecision;