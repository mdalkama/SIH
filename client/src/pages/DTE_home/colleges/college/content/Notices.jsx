import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Star, Calendar, ExternalLink, X, Download } from 'lucide-react';
import macetData from '../macet.json';
import gpcData from '../gpc.json';

const Notices = () => {
  const [isScrolling, setIsScrolling] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredNoticeId, setHoveredNoticeId] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get college data based on URL or query parameter
  const getCollegeData = () => {
    const queryId = searchParams.get('id');
    
    if (location.pathname.includes('macet') || queryId === '0') {
      return macetData;
    } else if (location.pathname.includes('gpc') || queryId === '1') {
      return gpcData;
    }
    return macetData; // Default fallback
  };

  const collegeData = getCollegeData();
  const { notices } = collegeData;

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Latest Notices & Updates
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest announcements, important dates, and college notifications
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-slate-400 to-slate-600 mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Important Announcements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Notice */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Star className="w-6 h-6" fill="currentColor" />
                  Featured Notice
                </h2>
              </div>
              <div className="p-8">
                {notices.items.filter(notice => notice.priority === 'high')[0] && (
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-800 mb-4 leading-tight">
                      {notices.items.filter(notice => notice.priority === 'high')[0].title}
                    </h3>
                    <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                      {notices.items.filter(notice => notice.priority === 'high')[0].description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 font-medium">
                        {formatDate(notices.items.filter(notice => notice.priority === 'high')[0].date)}
                      </span>
                      <button
                        onClick={() => handleNoticeClick(notices.items.filter(notice => notice.priority === 'high')[0])}
                        className="bg-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Notices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {notices.items.slice(1, 5).map((notice) => (
                <div key={notice.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                      {notice.category}
                    </span>
                    {notice.isNew && (
                      <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2 leading-tight">
                    {notice.title}
                  </h3>
                  <p className="text-slate-600 text-base mb-6 line-clamp-3 leading-relaxed">
                    {notice.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Calendar className="w-4 h-4" />
                      {formatDate(notice.date)}
                    </div>
                    <button
                      onClick={() => handleNoticeClick(notice)}
                      className="text-slate-600 hover:text-slate-800 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Notice Board */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Live Notice Board */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Notice Board</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-200 font-medium">LIVE</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Infinite Scrolling Notices Container */}
                  <div 
                    className="max-h-96 overflow-y-auto relative scrollbar-hide"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <div 
                      className={`space-y-6 ${isScrolling && !hoveredNoticeId ? 'animate-infinite-scroll' : ''}`}
                      style={{
                        animation: isScrolling && !hoveredNoticeId ? 'infiniteScroll 30s linear infinite' : 'paused'
                      }}
                    >
                      {/* First set of notices */}
                      {notices.items.map((notice, index) => (
                        <div 
                          key={notice.id} 
                          className={`border-b border-slate-100 pb-6 last:border-b-0 transition-all duration-300 ${
                            hoveredNoticeId === notice.id ? 'bg-slate-50 rounded-lg p-4 shadow-lg' : ''
                          }`}
                          onMouseEnter={() => setHoveredNoticeId(notice.id)}
                          onMouseLeave={() => setHoveredNoticeId(null)}
                        >
                          {/* Notice Item */}
                          <div className="flex items-start gap-4">
                            {/* Priority Indicator */}
                            {notice.priority === 'high' && (
                              <Star className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" fill="currentColor" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                              {/* Notice Title */}
                              <h3 className="text-base font-semibold text-slate-800 leading-tight mb-2">
                                {notice.title}
                              </h3>
                              
                              {/* Date */}
                              <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-500 font-medium">
                                  {formatDate(notice.date)}
                                </span>
                                {notice.isNew && (
                                  <span className="px-2 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>

                              {/* Category Badge */}
                              <div className="mb-3">
                                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(notice.priority)}`}>
                                  {notice.category}
                                </span>
                              </div>

                              {/* View Notice Button */}
                              <button
                                onClick={() => handleNoticeClick(notice)}
                                className="text-slate-600 hover:text-slate-800 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-200"
                              >
                                View Notice
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Second set of notices for infinite scroll */}
                      {notices.items.map((notice, index) => (
                        <div 
                          key={`duplicate-${notice.id}`} 
                          className={`border-b border-slate-100 pb-6 last:border-b-0 transition-all duration-300 ${
                            hoveredNoticeId === `duplicate-${notice.id}` ? 'bg-slate-50 rounded-lg p-4 shadow-lg' : ''
                          }`}
                          onMouseEnter={() => setHoveredNoticeId(`duplicate-${notice.id}`)}
                          onMouseLeave={() => setHoveredNoticeId(null)}
                        >
                          {/* Notice Item */}
                          <div className="flex items-start gap-4">
                            {/* Priority Indicator */}
                            {notice.priority === 'high' && (
                              <Star className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" fill="currentColor" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                              {/* Notice Title */}
                              <h3 className="text-base font-semibold text-slate-800 leading-tight mb-2">
                                {notice.title}
                                {notice.new && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                                    NEW
                                  </span>
                                )}
                              </h3>
                              
                              {/* Notice Description */}
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {notice.description}
                              </p>
                              
                              {/* Date and Category */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>{notice.date}</span>
                                </div>
                              </div>

                              {/* Category Badge */}
                              <div className="mb-3">
                                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(notice.priority)}`}>
                                  {notice.category}
                                </span>
                              </div>

                              {/* View Notice Button */}
                              <button
                                onClick={() => handleNoticeClick(notice)}
                                className="text-slate-600 hover:text-slate-800 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-200"
                              >
                                View Notice
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Important Notice</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Notice Details */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(selectedNotice.date)}
                  </span>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedNotice.priority)}`}>
                    {selectedNotice.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Notice Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedNotice.title}
              </h3>

              {/* Notice Description */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotice.description}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <p className="text-sm text-gray-900">{selectedNotice.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Priority:</span>
                  <p className="text-sm text-gray-900 capitalize">{selectedNotice.priority}</p>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-center">
                <a
                  href={selectedNotice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Notice
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for scroll animation */}
      <style jsx>{`
        @keyframes infiniteScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-infinite-scroll {
          animation: infiniteScroll 30s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Notices;