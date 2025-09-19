import React, { useState, useContext } from "react";
import { Search, RotateCcw, Upload, Send, Save, FileText, ChevronRight, Download, Printer, Share2, Eye, AlertCircle, RefreshCw } from "lucide-react";
import { useApplicantData } from '../ApplicantDataContext.jsx';

const MeritSection = () => {
  const [activeTab, setActiveTab] = useState('merit');
  const [correctionStatus, setCorrectionStatus] = useState('pending');
  const [expandedView, setExpandedView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { 
    getPersonalInfo, 
    getExamResults, 
    getCounsellingStatus, 
    updateExamResults,
    updatePersonalInfo,
    addNotification,
    loading,
    error 
  } = useApplicantData();

  const personalInfo = getPersonalInfo();
  const examResults = getExamResults();
  const counsellingStatus = getCounsellingStatus();

  // Action handlers
  const handleDownloadMerit = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `merit-certificate-${personalInfo.applicationId}.pdf`;
    link.click();
    
    addNotification({
      message: 'Merit certificate downloaded successfully!',
      type: 'success'
    });
  };

  const handlePrintMerit = () => {
    window.print();
    addNotification({
      message: 'Merit certificate sent to printer!',
      type: 'info'
    });
  };

  const handleShareMerit = () => {
    // Simulate share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Merit Certificate',
        text: `My merit rank is ${examResults.allIndiaRank} in ${personalInfo.category} category`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`My merit rank is ${examResults.allIndiaRank} in ${personalInfo.category} category`);
      alert('Merit details copied to clipboard!');
    }
    
    addNotification({
      message: 'Merit details shared successfully!',
      type: 'success'
    });
  };

  const handlePreviewApplication = () => {
    // Simulate opening application preview
    alert('Application preview would open in a new window/tab');
    
    addNotification({
      message: 'Application preview opened!',
      type: 'info'
    });
  };

  const handleSubmitCorrection = () => {
    setCorrectionStatus('submitted');
    
    addNotification({
      message: 'Correction request submitted successfully. You will be notified once reviewed.',
      type: 'success'
    });
  };

  const handleViewMeritCalculation = () => {
    // Simulate opening merit calculation details
    alert(`Merit Calculation Details:\n\nAll India Rank: ${examResults.allIndiaRank}\nCategory Rank: ${examResults.categoryRank}\nPercentile: ${examResults.percentile}%\n\nCalculation based on: JEE Main Score + Board Marks`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading merit data...</p>
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

  // Generate merit data dynamically based on the applicant's rank
  const generateMeritData = () => {
    const currentRank = examResults.allIndiaRank || 154;
    const meritData = [];
    
    // Generate 20 entries around the current rank
    for (let i = currentRank - 10; i <= currentRank + 10; i++) {
      if (i > 0) {
        const isCurrentUser = i === currentRank;
        meritData.push({
          id: i,
          crlRank: i,
          name: isCurrentUser ? personalInfo.name : `Student ${i}`,
          category: isCurrentUser ? personalInfo.category : ['General', 'OBC', 'SC', 'ST'][Math.floor(Math.random() * 4)],
          categoryRank: isCurrentUser ? examResults.categoryRank : Math.floor(Math.random() * 100) + 1,
          gender: isCurrentUser ? personalInfo.gender : ['Male', 'Female'][Math.floor(Math.random() * 2)],
          dob: isCurrentUser ? personalInfo.dateOfBirth : `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/200${Math.floor(Math.random() * 5)}`,
          applicationNo: isCurrentUser ? personalInfo.applicationId : `APP-2024-${i.toString().padStart(3, '0')}`,
          state: isCurrentUser ? 'Rajasthan' : ['Rajasthan', 'Delhi', 'UP', 'MP', 'Gujarat'][Math.floor(Math.random() * 5)],
          quota: isCurrentUser ? 'State' : ['HS', 'OS', 'AI'][Math.floor(Math.random() * 3)]
        });
      }
    }
    
    return meritData;
  };

  const meritData = generateMeritData();

  const getRankBadge = (rank, type = 'crl') => {
    const isCurrentUser = rank === examResults.allIndiaRank;
    const bgColor = isCurrentUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
    const text = type === 'crl' ? `CRL: ${rank}` : `CR-${type}: ${rank}`;
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${bgColor}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2 ">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Merit & Rank Details</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage your merit position and rank details</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('merit')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'merit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Merit Details
          </button>
          <button
            onClick={() => setActiveTab('correction')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'correction' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Correction Request
          </button>
        </nav>
      </div>

      {/* Main Content Grid - Reordered for better flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Merit Position Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Your Merit Position</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-500">Round 1</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Merit Rank</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{examResults.allIndiaRank || 'N/A'}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Category Rank</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{examResults.categoryRank || 'N/A'}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Category</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{personalInfo.category?.split(' ')[0] || 'N/A'}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Percentile</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{examResults.percentile || 'N/A'}%</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                <button 
                  onClick={handleViewMeritCalculation}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 mb-2 sm:mb-0"
                >
                  View Merit Calculation <ChevronRight className="inline h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <div className="flex space-x-1 sm:space-x-2">
                  <button 
                    onClick={handleDownloadMerit}
                    className="p-1.5 sm:p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                    title="Download Merit Certificate"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={handlePrintMerit}
                    className="p-1.5 sm:p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                    title="Print Merit Certificate"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={handleShareMerit}
                    className="p-1.5 sm:p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                    title="Share Merit Details"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Preview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Application</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Review your submitted application details</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <button 
                    onClick={handlePreviewApplication}
                    className="group relative flex items-center px-3 sm:px-3.5 py-1.5 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <Eye className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="relative">Preview Application</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Application No.</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">{personalInfo.applicationId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">{personalInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Date of Birth</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">{personalInfo.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Gender</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">{personalInfo.gender}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Merit List */}
         
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                <span className="font-medium">Download Rank Card</span>
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                <span className="font-medium">Raise Correction</span>
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                <span className="font-medium">View Cut-off Trends</span>
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4">Important Dates</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Round 1 Freeze</p>
                <p className="text-sm font-medium text-gray-900">25 Sep 2024, 5:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Seat Allotment</p>
                <p className="text-sm font-medium text-gray-900">28 Sep 2024</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Document Verification</p>
                <p className="text-sm font-medium text-gray-900">29-30 Sep 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Merit List - Excel Style */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Complete Merit List - Round 1</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {expandedView ? `Showing all ${meritData.length} candidates` : 'Showing candidates near your rank'}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setExpandedView(!expandedView)}
                className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                {expandedView ? 'Show Less' : 'Show All Details'}
                <ChevronRight className={`ml-1 h-3 w-3 transition-transform ${expandedView ? 'rotate-90' : ''}`} />
              </button>
              <button className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-3 w-3 mr-1" />
                Export CSV
              </button>
              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Updated: 19 Sep 2025
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className={`grid gap-2 px-2.5 py-2.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border-b border-gray-200 ${
                expandedView ? 'grid-cols-10' : 'grid-cols-6'
              }`}>
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-2">Candidate Name</div>
                {expandedView && <div className="col-span-1 text-center">App No.</div>}
                <div className="col-span-1 text-center">Category</div>
                <div className="col-span-1 text-center">CRL Rank</div>
                <div className="col-span-1 text-center">Category Rank</div>
                {expandedView && (
                  <>
                    <div className="col-span-1 text-center">Gender</div>
                    <div className="col-span-1 text-center">State</div>
                    <div className="col-span-1 text-center">Quota</div>
                  </>
                )}
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {(expandedView ? meritData : meritData.slice(0, 6)).map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`grid gap-2 items-center p-2.5 hover:bg-gray-50 transition-colors ${
                      expandedView ? 'grid-cols-10' : 'grid-cols-6'
                    } ${
                      item.crlRank === 154 
                        ? 'bg-blue-50 border-l-4 border-blue-400' 
                        : 'bg-white'
                    }`}
                  >
                    {/* Serial Number */}
                    <div className="col-span-1 text-xs sm:text-sm font-medium text-gray-500 text-center">
                      {index + 1}
                    </div>
                    
                    {/* Candidate Name */}
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.crlRank === 154 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          You
                        </span>
                      )}
                    </div>
                    
                    {/* Application Number (only in expanded view) */}
                    {expandedView && (
                      <div className="col-span-1 text-xs text-center text-gray-600 font-mono">
                        {item.applicationNo}
                      </div>
                    )}
                    
                    {/* Category */}
                    <div className="col-span-1 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.category === 'UR' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'OBC' ? 'bg-yellow-100 text-yellow-800' :
                        item.category === 'SC' ? 'bg-green-100 text-green-800' :
                        item.category === 'ST' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    
                    {/* CRL Rank */}
                    <div className="col-span-1 text-center">
                      <span className={`inline-flex items-center justify-center h-8 w-16 rounded-md text-sm font-bold ${
                        item.crlRank === 154 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.crlRank}
                      </span>
                    </div>
                    
                    {/* Category Rank */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center h-8 w-16 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-200">
                        {item.categoryRank}
                      </span>
                    </div>
                    
                    {/* Additional columns in expanded view */}
                    {expandedView && (
                      <>
                        <div className="col-span-1 text-center text-sm text-gray-600">
                          {item.gender}
                        </div>
                        <div className="col-span-1 text-center text-xs text-gray-600">
                          {item.state}
                        </div>
                        <div className="col-span-1 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {item.quota}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-xs text-gray-500 mb-3 sm:mb-0">
              Showing {expandedView ? meritData.length : Math.min(6, meritData.length)} of {meritData.length} candidates
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Correction Tab Content */}
      {activeTab === 'correction' && (
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Correction Request</h2>
                <p className="text-sm text-gray-600">Submit correction requests for any discrepancies in your merit details</p>
              </div>

              {/* Correction Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      correctionStatus === 'pending' ? 'bg-yellow-500' : 
                      correctionStatus === 'submitted' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Request Status</p>
                      <p className="text-xs text-gray-500 capitalize">{correctionStatus}</p>
                    </div>
                  </div>
                  {correctionStatus === 'submitted' && (
                    <span className="text-xs text-blue-600 font-medium">Under Review</span>
                  )}
                </div>
              </div>

              {/* Correction Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field to Correct</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select field...</option>
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    <option value="rank">Merit Rank</option>
                    <option value="categoryRank">Category Rank</option>
                    <option value="percentile">Percentile</option>
                    <option value="dob">Date of Birth</option>
                    <option value="gender">Gender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Value</label>
                  <input 
                    type="text" 
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Current value will appear here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Value</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the correct value"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload supporting documents</p>
                    <p className="text-xs text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                      Choose Files
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide details about the correction needed..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitCorrection}
                    disabled={correctionStatus === 'submitted'}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      correctionStatus === 'submitted' 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {correctionStatus === 'submitted' ? 'Submitted' : 'Submit Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeritSection;
