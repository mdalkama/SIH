import React, { useState } from "react";
import { Download, FileText, Clock, CheckCircle, TrendingUp, XCircle } from "lucide-react";
import ConfirmDecision from "./confirm";

const AllotmentDecision = () => {
  const [selectedDecision, setSelectedDecision] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmitDecision = () => {
    if (selectedDecision) {
      setShowConfirm(true);
    }
  };

  const handleGoBack = () => {
    setShowConfirm(false);
  };

  // If showing confirm page, render ConfirmDecision component
  if (showConfirm) {
    return (
      <ConfirmDecision 
        decision={selectedDecision} 
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Make Your Decision</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Choose your action for the allocated seat in Round 1</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Decision Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Seat Allotment Details</h2>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full font-medium">
                Round 1
              </span>
            </div>

            {/* Institute Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Allotted Institute</p>
                  <p className="font-semibold text-gray-900">National Tech University</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Program</p>
                  <p className="font-medium text-gray-900">B.Tech Computer Science</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Reporting By</p>
                  <p className="font-semibold text-red-600">12 Aug, 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Decision Options */}
            <div className="space-y-3 mb-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Choose Your Action</h3>
              
              {/* Accept & Freeze */}
              <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedDecision === 'freeze' 
                  ? 'border-green-500 bg-green-50 shadow-md' 
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
              }`}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="freeze"
                  onChange={(e) => setSelectedDecision(e.target.value)}
                  className="w-5 h-5 text-green-600" 
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    selectedDecision === 'freeze' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircle className={`h-5 w-5 ${
                      selectedDecision === 'freeze' ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">Accept & Freeze</p>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Confirm seat • Exit counselling • Physical reporting required
                    </p>
                  </div>
                </div>
              </label>

              {/* Accept & Float */}
              <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedDecision === 'float' 
                  ? 'border-yellow-500 bg-yellow-50 shadow-md' 
                  : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-25'
              }`}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="float"
                  onChange={(e) => setSelectedDecision(e.target.value)}
                  className="w-5 h-5 text-yellow-600" 
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    selectedDecision === 'float' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <TrendingUp className={`h-5 w-5 ${
                      selectedDecision === 'float' ? 'text-yellow-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">Accept & Float</p>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        UPGRADE CHANCE
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Keep seat • Try for higher preference • Continue counselling
                    </p>
                  </div>
                </div>
              </label>

              {/* Reject & Exit */}
              <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedDecision === 'reject' 
                  ? 'border-red-500 bg-red-50 shadow-md' 
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
              }`}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="reject"
                  onChange={(e) => setSelectedDecision(e.target.value)}
                  className="w-5 h-5 text-red-600" 
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    selectedDecision === 'reject' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <XCircle className={`h-5 w-5 ${
                      selectedDecision === 'reject' ? 'text-red-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">Reject & Exit</p>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        CAUTION
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Give up seat • Exit counselling • No further participation
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100">
              <button 
                onClick={handleSubmitDecision}
                disabled={!selectedDecision}
                className={`w-full sm:w-auto mb-2 sm:mb-0 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedDecision 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedDecision ? 'Submit Decision' : 'Select an Option'}
              </button>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>Freeze:</strong> Final decision, physical reporting required</p>
                <p><strong>Float:</strong> Eligible for upward movement in subsequent rounds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-3 sm:space-y-4">
          {/* Checklist */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4">Checklist</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Verify personal and merit details
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Upload required documents
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Confirm reporting centre if Freeze
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Review preference order
              </li>
            </ul>
          </div>

          {/* Deadline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" /> Deadline
            </h3>
            <div className="text-center mb-3">
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-lg font-bold text-red-600 mb-1">02d : 11h : 24m</p>
                <p className="text-xs text-gray-600">Decision window</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3 text-center">
              You can change decision until the window closes.
            </p>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 text-xs">
                <Download size={14} /> Download Allotment Letter
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 text-xs">
                <FileText size={14} /> Print Instructions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decision History */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Decision History</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Track your decisions across all counselling rounds</p>
            </div>
            <button className="mt-2 sm:mt-0 text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-all">
              View All →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Round</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Institute</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Program</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Decision</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Round 1</span>
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-900">National Tech University</td>
                  <td className="py-3 px-2 text-gray-600">B.Tech CSE</td>
                  <td className="py-3 px-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-all">
                      <Download size={12} />
                      <span className="text-xs">Download</span>
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-400">Round 2</td>
                  <td className="py-3 px-2 text-gray-400">—</td>
                  <td className="py-3 px-2 text-gray-400">—</td>
                  <td className="py-3 px-2 text-gray-400">—</td>
                  <td className="py-3 px-2 text-gray-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllotmentDecision;
