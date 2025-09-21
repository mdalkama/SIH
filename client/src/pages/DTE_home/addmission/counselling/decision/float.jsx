import React, { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle, 
  CreditCard,
  Lock,
  Bell,
  TrendingUp,
  RefreshCw,
  Shield,
  Info,
  AlertTriangle,
  ArrowUp,
  Check
} from 'lucide-react';
import { useApplicantData } from '../ApplicantDataContext';

const FloatDecision = () => {
  const { getPersonalInfo, getCounsellingStatus, getCollegePreferences } = useApplicantData();
  const personalInfo = getPersonalInfo();
  const counsellingStatus = getCounsellingStatus();
  const collegePreferences = getCollegePreferences();
  
  // Get the allotted college details
  const allottedCollege = collegePreferences.find(cp => cp.status === 'Allotted');
  
  // Get higher preferences (preferences with higher priority than the allotted one)
  const higherPreferences = collegePreferences.filter(cp => 
    cp.priority < (allottedCollege?.priority || Infinity)
  );
  
  // State for the selected upgrade option
  const [selectedUpgradeOption, setSelectedUpgradeOption] = useState('all');
  
  // Generate a submission ID
  const submissionId = `R1-FLOAT-${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  // Calculate next round deadline (3 days from now)
  const nextRoundDeadline = new Date();
  nextRoundDeadline.setDate(nextRoundDeadline.getDate() + 3);
  const formattedDeadline = nextRoundDeadline.toLocaleDateString('en-US', { 
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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Accept & Float Confirmed</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Your float decision has been successfully recorded for Round {counsellingStatus.currentRound}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Float Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-800">Your Accept & Float decision is recorded.</h2>
                <p className="text-sm text-green-700 mt-1">You will be considered for higher preferences in upcoming rounds. If upgraded, the current seat will be auto-released.</p>
              </div>
            </div>
          </div>

          {/* Candidate & Current Seat Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Candidate</p>
                <p className="font-semibold text-gray-900">{personalInfo.name} • App ID: {personalInfo.applicationId}</p>
                <p className="font-semibold text-gray-900">{personalInfo.registrationNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Current Seat</p>
                <p className="font-semibold text-gray-900">
                  {allottedCollege ? `${allottedCollege.college} • ${allottedCollege.branch}` : 'No seat allotted'}
                </p>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>You will be considered for higher preferences in upcoming rounds. If upgraded, the current seat will be auto-released. No institute reporting needed now.</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Keep your preference list updated till the lock deadline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Pay the provisional seat acceptance fee to stay eligible.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Track upgrade status in Seat Allotment after each round.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Download className="h-4 w-4" />
                <span className="font-medium">Download A&F Receipt (PDF)</span>
              </button>
             
            </div>
          </div>

          {/* Preference Snapshot */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preference Snapshot</h3>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                Top 5
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                  <Check className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Higher preferences eligible</p>
                  <p className="text-xs text-gray-600">You will be considered for preferences above {allottedCollege?.college} {allottedCollege?.branch} only.</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {higherPreferences.length > 0 ? (
                  higherPreferences.map((pref, index) => (
                    <p key={pref.priority} className="flex items-center gap-2">
                      <span>{pref.priority}.</span>
                      <span>{pref.college} • {pref.branch}</span>
                      {pref.status === 'Allotted' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Allotted
                        </span>
                      )}
                    </p>
                  ))
                ) : (
                  <p>No higher preferences available</p>
                )}
                {allottedCollege && (
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>{allottedCollege.priority}.</span>
                    <span>{allottedCollege.college} • {allottedCollege.branch}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Lock Preferences Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lock Preferences</h3>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                Optional Now
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Choose preferred upgrade rounds</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div 
                className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                  selectedUpgradeOption === 'next' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedUpgradeOption('next')}
              >
                <p className="font-semibold">Round 1 </p>
                <p className="text-xs">Stops after next round</p>
              </div>
              <div 
                className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                  selectedUpgradeOption === 'two' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedUpgradeOption('two')}
              >
                <p className="font-semibold">Round 1-2</p>
                <p className="text-xs">Consider for two rounds</p>
              </div>
              <div 
                className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                  selectedUpgradeOption === 'all' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedUpgradeOption('all')}
              >
                <p className="font-semibold">Till final round</p>
                <p className="text-xs">Continue for maximum chance</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Priority note (optional)</p>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">Add a short note for counselling team</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span className="font-medium">Switch to Freeze</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Lock Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Immediate Actions */}
        <div className="space-y-3 sm:space-y-4">
          {/* Immediate Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Immediate Actions</h3>
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">Required</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Pay provisional fee</span>
                </div>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">Due in 48h</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Lock preferences</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Before 12 Aug</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Enable alerts</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Recommended</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatDecision;