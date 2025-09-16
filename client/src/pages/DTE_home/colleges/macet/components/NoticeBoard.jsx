import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, FileText, Download, Calendar, Clock, 
  ExternalLink, X, Star, ChevronRight, ChevronLeft
} from 'lucide-react';

const NoticeBoard = ({ notices = [] }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);
  const animationRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Filter notices based on active tab
  const filteredNotices = activeTab === 'all' 
    ? notices 
    : notices.filter(notice => notice.category.toLowerCase() === activeTab);
    
  // Get unique categories for tabs
  const categories = ['all', ...new Set(notices.map(notice => notice.category.toLowerCase()))];

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    
    if (!container || !content || notices.length === 0) return;

    let scrollPosition = 0;
    let isScrolling = true;
    let lastScrollTime = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const frameRate = 60; // frames per second
    const frameDelay = 1000 / frameRate;

    const scrollContent = () => {
      if (!isScrolling || isHovered) {
        animationRef.current = requestAnimationFrame(scrollContent);
        return;
      }

      const now = Date.now();
      const deltaTime = now - lastScrollTime;
      
      if (deltaTime > frameDelay) {
        const containerHeight = container.clientHeight;
        const contentHeight = content.clientHeight;
        
        // Check if we've scrolled to the bottom
        if (scrollPosition >= contentHeight - containerHeight) {
          // Reset to top after a short delay
          if (!isAtBottom) {
            setIsAtBottom(true);
            setTimeout(() => {
              scrollPosition = 0;
              container.scrollTop = 0;
              setIsAtBottom(false);
            }, 2000); // Pause at bottom for 2 seconds
          }
        } else {
          // Continue scrolling
          scrollPosition += scrollSpeed * (deltaTime / 16.67); // Normalize speed
          container.scrollTop = scrollPosition;
        }
        
        lastScrollTime = now;
      }
      
      animationRef.current = requestAnimationFrame(scrollContent);
    };

    animationRef.current = requestAnimationFrame(scrollContent);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [notices.length, isHovered, isAtBottom]);

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
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Admission':
        return 'bg-blue-100 text-blue-800';
      case 'Placement':
        return 'bg-green-100 text-green-800';
      case 'Examination':
        return 'bg-red-100 text-red-800';
      case 'Event':
        return 'bg-purple-100 text-purple-800';
      case 'Scholarship':
        return 'bg-yellow-100 text-yellow-800';
      case 'Academic':
        return 'bg-indigo-100 text-indigo-800';
      case 'Training':
        return 'bg-pink-100 text-pink-800';
      case 'Fee':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (notices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No notices available at the moment.</p>
      </div>
    );
  }

  // Sort notices by date (newest first)
  const sortedNotices = [...filteredNotices].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Header with Tabs */}
      <div className="bg-blue-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-medium text-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-300 mr-2" />
            NOTICE BOARD
          </h2>
          <div className="flex items-center">
            <span className="h-2 w-2 bg-yellow-300 rounded-full animate-pulse mr-1"></span>
            <span className="text-xs text-white/90 font-medium">LIVE UPDATES</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mt-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-3 py-1 text-sm font-medium rounded-t-md mr-1 whitespace-nowrap ${
                activeTab === category
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-blue-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Scrolling Content */}
      <div 
        ref={scrollContainerRef}
        className="h-80 overflow-hidden relative bg-gray-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          ref={contentRef}
          className="p-2 space-y-1"
        >
          {sortedNotices.length > 0 ? (
            sortedNotices.map((notice) => (
              <div 
                key={notice.id}
                className="group cursor-pointer p-2 rounded hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                onClick={() => handleNoticeClick(notice)}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getCategoryColor(notice.category)}`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="ml-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-700 line-clamp-1">
                        {notice.title}
                      </h3>
                      <span className={`h-2 w-2 rounded-full ${getPriorityColor(notice.priority)} flex-shrink-0 ml-2`}></span>
                    </div>
                    <div className="flex items-center mt-0.5 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-0.5" />
                      <span>{formatDate(notice.date)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-2 ${getCategoryColor(notice.category)}`}>
                        {notice.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No notices found in this category.
            </div>
          )}
        </div>
        
        {/* Fade effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 px-4 py-2 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xs text-gray-600 font-medium">
            {sortedNotices.length} {sortedNotices.length === 1 ? 'Notice' : 'Notices'} • Updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
        <button 
          className="text-blue-700 hover:text-blue-900 text-xs font-semibold flex items-center uppercase tracking-wider"
          onClick={() => sortedNotices.length > 0 && handleNoticeClick(sortedNotices[0])}
          disabled={sortedNotices.length === 0}
        >
          View All Notices <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </button>
      </div>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedNotice && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={closeModal}
            ></div>
            
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-white/20 mr-3`}>
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedNotice.title}</h2>
                        <div className="flex items-center mt-1 space-x-3">
                          <span className="text-sm text-white/90 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(selectedNotice.date)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(selectedNotice.category)}`}>
                            {selectedNotice.category}
                          </span>
                          <span className={`h-2 w-2 rounded-full ${getPriorityColor(selectedNotice.priority)}`}></span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-white/80 hover:text-white transition-colors p-1 -mr-2"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700">
                      {selectedNotice.description}
                    </p>
                    
                    {selectedNotice.department && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Applicable Departments:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedNotice.department.split(',').map((dept, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {dept.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              Please read the notice carefully and take necessary action before the last date. 
                              For any queries, contact the concerned department.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Posted on {formatDate(selectedNotice.date)}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {selectedNotice.id}/{notices.length}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = selectedNotice.pdfUrl || '#';
                          link.download = `${selectedNotice.title.replace(/\s+/g, '_')}.pdf`;
                          link.click();
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => window.open(selectedNotice.pdfUrl || '#', '_blank')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Notice
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default NoticeBoard;
