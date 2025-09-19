import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  CheckCircle, 
  Upload, 
  CreditCard, 
  MapPin, 
  Mail, 
  Phone,
  HelpCircle,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Award,
  BarChart3,
  FileText,
  Star,
  Calendar,
  Clock,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useApplicantData } from '../ApplicantDataContext.jsx';

const Result = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
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
    markNotificationAsRead,
    deleteNotification,
    processFeePayment,
    processDocumentVerification,
    processReporting,
    addNotification,
    downloadResult,
    printResult,
    verifyResult,
    loading,
    error 
  } = useApplicantData();

  const personalInfo = getPersonalInfo();
  const examResults = getExamResults();
  const counsellingStatus = getCounsellingStatus();
  const collegePreferences = getCollegePreferences();
  const notifications = getNotifications();
  const allotmentStatus = getAllotmentStatus();

  const collegeResults = collegePreferences.map((pref, index) => ({
    id: index + 1,
    college: pref.college,
    branch: pref.branch,
    totalSeats: pref.totalSeats || 60,
    totalApplicants: pref.totalApplicants || 1200,
    myRank: pref.myRank || (index + 1) * 8,
    cutoffRank: pref.cutoffRank || 45,
    status: pref.myRank <= pref.cutoffRank ? 'Qualified' : 'Not Qualified',
    statusColor: pref.myRank <= pref.cutoffRank ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100',
    icon: pref.myRank <= pref.cutoffRank ? CheckCircle2 : XCircle,
    priority: index + 1,
    category: pref.college ? pref.college.split(' ')[0] : 'College'
  }));

  const filteredResults = collegeResults.filter(result => {
    const matchesFilter = selectedFilter === 'All' || result.status === selectedFilter;
    const matchesSearch = result.college.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         result.branch.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const qualifiedCount = collegeResults.filter(r => r.status === 'Qualified').length;
  const notQualifiedCount = collegeResults.filter(r => r.status === 'Not Qualified').length;
  const bestRank = collegeResults.length > 0 ? Math.min(...collegeResults.map(r => r.myRank)) : 'N/A';

  // Action handlers
  const handleDownloadResult = () => {
    const content = `Counselling Result\n\nApplicant: ${personalInfo?.name || 'N/A'}\nApplication ID: ${personalInfo?.applicationId || 'N/A'}\nTotal Score: ${examResults?.totalScore || 182}/240\nQualified Colleges: ${qualifiedCount}\nBest Rank: ${bestRank}\n\n${collegeResults.map((result, index) => `${index + 1}. ${result.college} - ${result.branch}\n   Status: ${result.status}\n   Your Rank: ${result.myRank}\n   Cutoff Rank: ${result.cutoffRank}`).join('\n\n')}\n\nGenerated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `counselling_result_${personalInfo?.applicationId || 'unknown'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Result downloaded successfully',
      time: new Date().toLocaleTimeString(),
      read: false
    });
  };

  const handlePrintResult = () => {
    window.print();
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: 'Result sent to printer',
      time: new Date().toLocaleTimeString(),
      read: false
    });
  };

  const handleVerifyResult = () => {
    // Simulate result verification
    const verificationCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    
    // Add notification
    addNotification({
      id: Date.now(),
      message: `Result verified. Verification code: ${verificationCode}`,
      time: new Date().toLocaleTimeString(),
      read: false
    });
    
    alert(`Result verified successfully!\nVerification Code: ${verificationCode}`);
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
          <p className="text-gray-600">Loading result data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-1 px-1 sm:px-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Result & Status</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View your exam results and college preference rankings</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Your Result */}
        <div className="lg:col-span-2 space-y-4">
          {/* Result Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Result</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Round {counsellingStatus?.currentRound || 'N/A'}</span>
              </div>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{examResults?.totalScore || 182} / 240</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{examResults?.percentile || 98.4}</div>
                <div className="text-sm text-gray-600">Percentile</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">AIR {examResults?.allIndiaRank || examResults?.rank || 312}</div>
                <div className="text-sm text-gray-600">All India Rank</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-emerald-600">{examResults?.status || 'Qualified'}</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button 
                onClick={handlePrintResult}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span className="text-sm font-medium">Print Scorecard</span>
              </button>
              <button 
                onClick={handleDownloadResult}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="font-medium">Download Scorecard</span>
              </button>
              <button 
                onClick={handleVerifyResult}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Verify Result</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column - Help & Support */}
        <div className="space-y-3 sm:space-y-4">
          {/* Help & Support */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                Help & Support
              </h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Need Assistance?</span>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 mb-2 font-medium">Email Support</p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-3 w-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-700 font-medium">support@counselling.gov</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-gray-600 mb-2 font-medium">Phone Support</p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-sm text-green-700 font-medium">1800-000-123</p>
                </div>
                <p className="text-xs text-green-600 mt-1">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width College Preference Results Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                College Preference Results
              </h2>
              <p className="text-sm text-gray-500 mt-1">Your ranking in selected colleges and branches</p>
            </div>
            <span className="mt-2 sm:mt-0 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full flex items-center gap-1">
              <Star className="h-3 w-3" />
              {collegeResults.length} Choices
            </span>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-2">
              {['All', 'Qualified', 'Not Qualified'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors font-medium ${
                    selectedFilter === filter
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search college or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Spreadsheet Style Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-800 border-r border-gray-300 w-20">Priority</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 border-r border-gray-300 min-w-48">College</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 border-r border-gray-300 min-w-48">Branch</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 border-r border-gray-300 w-24">Seats</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 border-r border-gray-300 w-32">Applicants</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 border-r border-gray-300 w-24">My Rank</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 border-r border-gray-300 w-24">Cutoff</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 w-32">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => {
                  const IconComponent = result.icon;
                  const isEven = index % 2 === 0;
                  return (
                    <tr key={result.id} className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                            {result.priority}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <div className="font-bold text-gray-900 text-base">{result.college}</div>
                        <div className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded-full inline-block">{result.category}</div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200">
                        <div className="text-gray-800 font-semibold">{result.branch}</div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="font-bold text-blue-600 text-base">{result.totalSeats}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 font-medium">{result.totalApplicants.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="h-4 w-4 text-orange-500" />
                          <span className="font-bold text-orange-600 text-base">#{result.myRank}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <span className="text-purple-600 font-bold text-base">#{result.cutoffRank}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <IconComponent className={`h-5 w-5 ${result.status === 'Qualified' ? 'text-green-600' : 'text-red-600'}`} />
                          <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${result.statusColor}`}>
                            {result.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No results found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
            </div>
          )}

        </div>

        {/* Notifications Section */}
        <div className="mt-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              <span className="text-xs text-gray-500">{notifications.filter(n => !n.read).length} unread</span>
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
              
              {notifications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;