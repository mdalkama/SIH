import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const NoticeTicker = ({ notices = [] }) => {
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (notices.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % notices.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [notices.length, isPaused]);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  if (notices.length === 0) return null;

  return (
    <div className="relative">
      {/* Notice Ticker */}
      <div 
        ref={containerRef}
        className="bg-blue-50 border-b border-blue-100 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex items-center">
            <div className="flex-shrink-0 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md">
              Notice
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNoticeIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  <button
                    onClick={() => handleNoticeClick(notices[currentNoticeIndex])}
                    className="text-blue-800 hover:text-blue-600 text-sm font-medium focus:outline-none"
                  >
                    {notices[currentNoticeIndex].title}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => handleNoticeClick(notices[currentNoticeIndex])}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Notices ({notices.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedNotice?.title || 'Notice'}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setIsModalOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedNotice?.description || 'No description available.'}
                      </p>
                      {selectedNotice?.link && (
                        <div className="mt-4">
                          <a
                            href={selectedNotice.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View PDF
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => window.open(selectedNotice?.link || '#', '_blank')}
                >
                  Download Notice
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeTicker;
