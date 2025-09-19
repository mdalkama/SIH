import React, { useState } from "react";
import { Search, RotateCcw, Upload, Send, Save, FileText, ChevronRight, Download, Printer, Share2, Eye } from "lucide-react";

const MeritSection = () => {
  const [activeTab, setActiveTab] = useState('merit');
  const [correctionStatus, setCorrectionStatus] = useState('pending');

  const [expandedView, setExpandedView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const meritData = [
    { id: 1, crlRank: 145, name: 'Vikram Singh', category: 'OBC', categoryRank: 18, gender: 'Male', dob: '14/07/2001', applicationNo: 'APP-2024-087', state: 'Punjab', quota: 'HS' },
    { id: 2, crlRank: 148, name: 'Amit Patel', category: 'SC', categoryRank: 12, gender: 'Male', dob: '05/03/2001', applicationNo: 'APP-2024-045', state: 'Gujarat', quota: 'AI' },
    { id: 3, crlRank: 150, name: 'Rahul Verma', category: 'UR', categoryRank: 45, gender: 'Male', dob: '12/05/2001', applicationNo: 'APP-2024-001', state: 'Maharashtra', quota: 'AI' },
    { id: 4, crlRank: 152, name: 'Rohan Kumar', category: 'UR', categoryRank: 46, gender: 'Male', dob: '19/04/2001', applicationNo: 'APP-2024-112', state: 'Bihar', quota: 'AI' },
    { id: 5, crlRank: 154, name: 'Aditi Sharma', category: 'UR', categoryRank: 47, gender: 'Female', dob: '15/08/2000', applicationNo: 'APP-2024-154', state: 'Delhi', quota: 'HS' },
    { id: 6, crlRank: 158, name: 'Sneha Reddy', category: 'SC', categoryRank: 15, gender: 'Female', dob: '08/12/2000', applicationNo: 'APP-2024-267', state: 'Andhra Pradesh', quota: 'OS' },
    
  ];

  const getRankBadge = (rank, type = 'crl') => {
    const isCurrentUser = rank === 154;
    const bgColor = isCurrentUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
    const text = type === 'crl' ? `CRL: ${rank}` : `CR-${type}: ${rank}`;
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${bgColor}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-2 px-2 sm:px-2 ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Merit & Rank Details</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage your merit position and rank details</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Merit Position Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Your Merit Position</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-500">Round 1</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Merit Rank</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">154</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Category Rank</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">68</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Category</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">UR</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Cut-off</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">172</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                <button className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 mb-2 sm:mb-0">
                  View Merit Calculation <ChevronRight className="inline h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <div className="flex space-x-1 sm:space-x-2">
                  <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
                    <Printer className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Preview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Application</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Review your submitted application details</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <button className="group relative flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                    <Eye className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="relative">Preview Application</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Application No.</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">APP-78QK9</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">Aditi Sharma</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Date of Birth</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">15/08/2000</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Gender</p>
                  <p className="text-xs sm:text-sm text-gray-900 mt-0.5">Female</p>
                </div>
              </div>
            </div>
          </div>

          {/* Merit List */}
         
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                <span className="font-medium">Download Rank Card</span>
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                <span className="font-medium">Raise Correction</span>
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                <span className="font-medium">View Cut-off Trends</span>
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
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
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
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
              <div className={`grid gap-2 px-3 py-3 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border-b border-gray-200 ${
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
                    className={`grid gap-2 items-center p-3 hover:bg-gray-50 transition-colors ${
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
    </div>
  );
};

export default MeritSection;
