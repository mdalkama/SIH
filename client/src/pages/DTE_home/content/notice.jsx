import React, { useEffect, useRef } from 'react'

const Notice = () => {
  const noticeScrollRef = useRef(null)
  const eventsScrollRef = useRef(null)
  const academicScrollRef = useRef(null)

  // Auto-scroll functionality with better scroll management
  useEffect(() => {
    const scrollContainers = [
      { ref: noticeScrollRef, speed: 1.2 },
      { ref: eventsScrollRef, speed: 1.2 },
      { ref: academicScrollRef, speed: 1.2 }
    ]

    const intervals = scrollContainers.map(({ ref, speed }) => {
      return setInterval(() => {
        if (ref.current && ref.current.dataset.paused !== 'true') {
          const container = ref.current
          const scrollTop = container.scrollTop
          const scrollHeight = container.scrollHeight
          const clientHeight = container.clientHeight

          // Only auto-scroll if content is scrollable
          if (scrollHeight > clientHeight) {
            // Check if reached bottom, reset to top with a small delay
            if (scrollTop + clientHeight >= scrollHeight - 5) {
              setTimeout(() => {
                if (container && container.dataset.paused !== 'true') {
                  container.scrollTop = 0
                }
              }, 2000) // 2 second pause at bottom
            } else {
              container.scrollTop += speed
            }
          }
        }
      }, 60) // Slightly slower for better UX
    })

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [])

  // Dummy data for notices
  const notices = [
    {
      id: 1,
      title: "Admission link is live (18/08/2025; 3 PM to 23/08/2025) for those who have confirmed their seat during JoSAA-2025 counselling",
      date: "18 Aug 2025",
      isImportant: true
    },
    {
      id: 2,
      title: "Physical reporting schedule for admission to UG Programme through JoSAA/CSAB/DASA/SII for the Academic year 2025-26",
      date: "15 Aug 2025",
      isImportant: true
    },
    {
      id: 3,
      title: "Final Merit List for M.Tech Admission 2025-26",
      date: "12 Aug 2025",
      isImportant: false
    },
    {
      id: 4,
      title: "Schedule for Counselling for B.Tech First Year Admission 2025-26",
      date: "10 Aug 2025",
      isImportant: false
    },
    {
      id: 5,
      title: "Important Instructions for New Students Academic Session 2025-26",
      date: "08 Aug 2025",
      isImportant: true
    },
    {
      id: 6,
      title: "Fee Structure for Academic Year 2025-26",
      date: "05 Aug 2025",
      isImportant: false
    },
    {
      id: 7,
      title: "Hostel Allocation for First Year Students",
      date: "03 Aug 2025",
      isImportant: true
    }
  ]

  // Dummy data for events
  const events = [
    {
      id: 1,
      title: "Smart India Hackathon 2025",
      description: "Organized by Government of India in collaboration with Ministry of Education",
      startDate: "24-11-2025",
      endDate: "28-11-2025",
      location: "DTE Rajasthan",
      hasAttachment: true,
      hasRegistration: true
    },
    {
      id: 2,
      title: "Architectural Heritage Management and Heritage Conservation of Postcolonial Buildings in India",
      description: "National Conference on Heritage Conservation",
      startDate: "20-12-2025",
      endDate: "22-12-2025",
      location: "Government Engineering College, Ajmer",
      hasAttachment: true,
      hasRegistration: true
    },
    {
      id: 3,
      title: "Technical Symposium on Emerging Technologies",
      description: "Annual technical event for engineering students",
      startDate: "15-01-2026",
      endDate: "16-01-2026",
      location: "Government Polytechnic, Jaipur",
      hasAttachment: false,
      hasRegistration: true
    },
    {
      id: 4,
      title: "Industry Connect Workshop",
      description: "Bridging gap between academia and industry",
      startDate: "05-02-2026",
      endDate: "06-02-2026",
      location: "DTE Conference Hall",
      hasAttachment: true,
      hasRegistration: true
    }
  ]

  // Dummy data for academic notices
  const academicNotices = [
    {
      id: 1,
      title: "National Sports Day Celebration 2025",
      date: "28 Aug 2025",
      isImportant: true
    },
    {
      id: 2,
      title: "Notification Regarding Selection Trials for Inter NIT Tournament 2025-26 at NIT Patna",
      date: "26 Aug 2025",
      isImportant: true
    },
    {
      id: 3,
      title: "Allotment Notice for Minor Programme in Academic Session 2025-26",
      date: "22 Aug 2025",
      isImportant: true
    },
    {
      id: 4,
      title: "End Semester Examination Schedule for Winter Session 2025",
      date: "20 Aug 2025",
      isImportant: false
    },
    {
      id: 5,
      title: "Result Declaration for B.Tech Semester-VI",
      date: "18 Aug 2025",
      isImportant: false
    },
    {
      id: 6,
      title: "Registration for Extra-Curricular Activities",
      date: "15 Aug 2025",
      isImportant: false
    },
    {
      id: 7,
      title: "Library Book Return Deadline",
      date: "12 Aug 2025",
      isImportant: true
    },
    {
      id: 8,
      title: "Mid-Semester Examination Timetable",
      date: "10 Aug 2025",
      isImportant: false
    }
  ]

  const pauseScroll = (ref) => {
    const container = ref.current
    if (container) {
      container.dataset.paused = 'true'
      // Also pause all scrolling temporarily when user interacts
      setTimeout(() => {
        if (container.dataset.paused === 'true') {
          container.dataset.paused = 'false'
        }
      }, 3000) // Resume after 3 seconds if user doesn't interact
    }
  }

  const resumeScroll = (ref) => {
    const container = ref.current
    if (container) {
      // Small delay before resuming to ensure smooth UX
      setTimeout(() => {
        container.dataset.paused = 'false'
      }, 500)
    }
  }

  return (
    <div className="theme-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Notice Section */}
          <div className="theme-surface rounded-lg shadow-lg overflow-hidden notice-card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold theme-text">Notice</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                  View all
                </button>
              </div>
            </div>
            <div 
              ref={noticeScrollRef}
              className="max-h-96 overflow-y-auto notice-scrollbar"
              onMouseEnter={() => pauseScroll(noticeScrollRef)}
              onMouseLeave={() => resumeScroll(noticeScrollRef)}
              onTouchStart={() => pauseScroll(noticeScrollRef)}
              onTouchEnd={() => resumeScroll(noticeScrollRef)}
              style={{ 
                overflowAnchor: 'none',
                scrollBehavior: 'auto'
              }}
            >
              <div className="p-6 space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="notice-item border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0 hover:shadow-md rounded-lg px-3 py-3 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      {notice.isImportant && (
                        <span className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0">⭐</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium theme-text leading-relaxed mb-2">
                          {notice.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{notice.date}</span>
                          <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-xs transition-colors">
                            <span>View Notice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="theme-surface rounded-lg shadow-lg overflow-hidden notice-card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold theme-text">Events</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                  View all
                </button>
              </div>
            </div>
            <div 
              ref={eventsScrollRef}
              className="max-h-96 overflow-y-auto notice-scrollbar"
              onMouseEnter={() => pauseScroll(eventsScrollRef)}
              onMouseLeave={() => resumeScroll(eventsScrollRef)}
              onTouchStart={() => pauseScroll(eventsScrollRef)}
              onTouchEnd={() => resumeScroll(eventsScrollRef)}
              style={{ 
                overflowAnchor: 'none',
                scrollBehavior: 'auto'
              }}
            >
              <div className="p-6 space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="notice-item border-b border-gray-100 dark:border-gray-700 pb-6 last:border-b-0 hover:shadow-md rounded-lg px-3 py-3 cursor-pointer">
                    <h3 className="font-semibold theme-text mb-2 leading-relaxed">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{event.startDate} - {event.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.hasAttachment && (
                        <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-xs transition-colors">
                          <span>Event Attachment</span>
                        </button>
                      )}
                      {event.hasRegistration && (
                        <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-xs transition-colors">
                          <span>Event Registration</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Notices Section */}
          <div className="theme-surface rounded-lg shadow-lg overflow-hidden notice-card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold theme-text">Academic Notices</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                  View all
                </button>
              </div>
            </div>
            <div 
              ref={academicScrollRef}
              className="max-h-96 overflow-y-auto notice-scrollbar"
              onMouseEnter={() => pauseScroll(academicScrollRef)}
              onMouseLeave={() => resumeScroll(academicScrollRef)}
              onTouchStart={() => pauseScroll(academicScrollRef)}
              onTouchEnd={() => resumeScroll(academicScrollRef)}
              style={{ 
                overflowAnchor: 'none',
                scrollBehavior: 'auto'
              }}
            >
              <div className="p-6 space-y-4">
                {academicNotices.map((notice) => (
                  <div key={notice.id} className="notice-item border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0 hover:shadow-md rounded-lg px-3 py-3 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      {notice.isImportant && (
                        <span className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0">⭐</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium theme-text leading-relaxed mb-2">
                          {notice.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{notice.date}</span>
                          <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-xs transition-colors">
                            <span>View Notice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Custom Scrollbar Styles - Hidden scrollbars */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Hide scrollbars for notice sections */
          .notice-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          .notice-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          
          /* Enhanced box shadow for elevated appearance */
          .notice-card {
            box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.12), 0 6px 8px -2px rgba(0, 0, 0, 0.08) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          .theme-dark .notice-card {
            box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.4), 0 6px 8px -2px rgba(0, 0, 0, 0.2) !important;
          }
          
          /* Individual notice item hover effects - Custom CSS for dark mode */
          .theme-dark .notice-item:hover {
            background-color: rgba(51, 65, 85, 0.7) !important; /* slate-700 with opacity */
            border-color: rgba(71, 85, 105, 0.8) !important; /* slate-600 with opacity */
          }
          
          .theme-light .notice-item:hover {
            background-color: #f9fafb !important; /* gray-50 */
            border-color: #dbeafe !important; /* blue-100 */
          }
          
          .notice-item {
            transition: all 0.3s ease !important;
          }
        `
      }} />
    </div>
  )
}

export default Notice