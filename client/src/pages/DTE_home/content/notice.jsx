import React, { useEffect, useRef, useState } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'

const Notice = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef(null)
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

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Dummy data for notices
  const notices = [
    {
      id: 1,
      title: "Admission link is live (18/08/2025; 3 PM to 23/08/2025) for those who have confirmed their seat during JoSAA-2025 counselling",
      date: "18 Aug 2025",
      isImportant: true,
      pdfUrl: "/notices/admission-link-josaa-2025.pdf",
      content: "This is to inform all candidates who have confirmed their seats during JoSAA-2025 counselling that the admission link is now live. Please complete the admission process within the specified dates to secure your admission."
    },
    {
      id: 2,
      title: "Physical reporting schedule for admission to UG Programme through JoSAA/CSAB/DASA/SII for the Academic year 2025-26",
      date: "15 Aug 2025",
      isImportant: true,
      pdfUrl: "/notices/physical-reporting-schedule-2025.pdf",
      content: "Detailed schedule for physical reporting for UG Programme admissions through various channels including JoSAA, CSAB, DASA, and SII for the academic year 2025-26."
    },
    {
      id: 3,
      title: "Final Merit List for M.Tech Admission 2025-26",
      date: "12 Aug 2025",
      isImportant: false,
      pdfUrl: "/notices/mtech-merit-list-2025.pdf",
      content: "The final merit list for M.Tech admissions for the academic year 2025-26 has been published. Selected candidates are requested to complete the admission formalities as per the schedule."
    },
    {
      id: 4,
      title: "Schedule for Counselling for B.Tech First Year Admission 2025-26",
      date: "10 Aug 2025",
      isImportant: false,
      pdfUrl: "/notices/btech-counselling-schedule-2025.pdf",
      content: "Schedule for counselling for B.Tech first year admission for the academic year 2025-26."
    },
    {
      id: 5,
      title: "Important Instructions for New Students Academic Session 2025-26",
      date: "08 Aug 2025",
      isImportant: true,
      pdfUrl: "/notices/new-students-instructions-2025.pdf",
      content: "Important instructions for new students joining the academic session 2025-26."
    },
    {
      id: 6,
      title: "Fee Structure for Academic Year 2025-26",
      date: "05 Aug 2025",
      isImportant: false,
      pdfUrl: "/notices/fee-structure-2025.pdf",
      content: "Fee structure for the academic year 2025-26."
    },
    {
      id: 7,
      title: "Hostel Allocation for First Year Students",
      date: "03 Aug 2025",
      isImportant: true,
      pdfUrl: "/notices/hostel-allocation-2025.pdf",
      content: "Hostel allocation details for first year students."
    }
  ]

  // Dummy data for events
  const events = [
    {
      id: 1,
      title: "Smart India Hackathon 2025",
      description: "Organized by Government of India in collaboration with Ministry of Education, Smart India Hackathon is a nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives.",
      startDate: "24-11-2025",
      endDate: "28-11-2025",
      location: "DTE Rajasthan",
      hasAttachment: true,
      hasRegistration: true,
      pdfUrl: "/events/sih-2025-brochure.pdf",
      youtubeLink: "https://youtube.com/embed/sih2025",
      registrationLink: "https://sih.gov.in/register"
    },
    {
      id: 2,
      title: "Architectural Heritage Management and Heritage Conservation of Postcolonial Buildings in India",
      description: "National Conference on Heritage Conservation",
      startDate: "20-12-2025",
      endDate: "22-12-2025",
      location: "Government Engineering College, Ajmer",
      hasAttachment: true,
      hasRegistration: true,
      pdfUrl: "/events/heritage-conservation-2025.pdf",
      youtubeLink: "https://youtube.com/embed/heritage2025",
      registrationLink: "https://heritage.gov.in/register"
    },
    {
      id: 3,
      title: "Technical Symposium on Emerging Technologies",
      description: "Annual technical event for engineering students",
      startDate: "15-01-2026",
      endDate: "16-01-2026",
      location: "Government Polytechnic, Jaipur",
      hasAttachment: false,
      hasRegistration: true,
      pdfUrl: "/events/emerging-technologies-2026.pdf",
      youtubeLink: "https://youtube.com/embed/emerging2026",
      registrationLink: "https://emergingtech.gov.in/register"
    },
    {
      id: 4,
      title: "Industry Connect Workshop",
      description: "Bridging gap between academia and industry",
      startDate: "05-02-2026",
      endDate: "06-02-2026",
      location: "DTE Conference Hall",
      hasAttachment: true,
      hasRegistration: true,
      pdfUrl: "/events/industry-connect-2026.pdf",
      youtubeLink: "https://youtube.com/embed/industry2026",
      registrationLink: "https://industryconnect.gov.in/register"
    }
  ]

  // Dummy data for academic notices
  const academicNotices = [
    {
      id: 1,
      title: "National Sports Day Celebration 2025",
      date: "28 Aug 2025",
      isImportant: true,
      pdfUrl: "/academic/sports-day-2025.pdf",
      content: "Join us in celebrating National Sports Day with various sports competitions and activities. Participation certificates will be awarded to all participants."
    },
    {
      id: 2,
      title: "Notification Regarding Selection Trials for Inter NIT Tournament 2025-26 at NIT Patna",
      date: "26 Aug 2025",
      isImportant: true,
      pdfUrl: "/academic/inter-nit-tournament-2025.pdf",
      content: "Notification regarding selection trials for Inter NIT Tournament 2025-26 at NIT Patna."
    },
    {
      id: 3,
      title: "Allotment Notice for Minor Programme in Academic Session 2025-26",
      date: "22 Aug 2025",
      isImportant: true,
      pdfUrl: "/academic/minor-programme-allotment-2025.pdf",
      content: "Allotment notice for minor programme in academic session 2025-26."
    },
    {
      id: 4,
      title: "End Semester Examination Schedule for Winter Session 2025",
      date: "20 Aug 2025",
      isImportant: false,
      pdfUrl: "/academic/end-semester-exam-schedule-2025.pdf",
      content: "End semester examination schedule for winter session 2025."
    },
    {
      id: 5,
      title: "Result Declaration for B.Tech Semester-VI",
      date: "18 Aug 2025",
      isImportant: false,
      pdfUrl: "/academic/btech-sem-vi-result-2025.pdf",
      content: "Result declaration for B.Tech semester-VI."
    },
    {
      id: 6,
      title: "Registration for Extra-Curricular Activities",
      date: "15 Aug 2025",
      isImportant: false,
      pdfUrl: "/academic/extra-curricular-activities-2025.pdf",
      content: "Registration for extra-curricular activities."
    },
    {
      id: 7,
      title: "Library Book Return Deadline",
      date: "12 Aug 2025",
      isImportant: true,
      pdfUrl: "/academic/library-book-return-2025.pdf",
      content: "Library book return deadline."
    },
    {
      id: 8,
      title: "Mid-Semester Examination Timetable",
      date: "10 Aug 2025",
      isImportant: false,
      pdfUrl: "/academic/mid-semester-exam-timetable-2025.pdf",
      content: "Mid-semester examination timetable."
    }
  ]

  const pauseScroll = (ref) => {
    const container = ref?.current
    if (container) {
      container.dataset.paused = 'true'
      // Also pause all scrolling temporarily when user interacts
      setTimeout(() => {
        if (container?.dataset?.paused === 'true') {
          container.dataset.paused = 'false'
        }
      }, 3000) // Resume after 3 seconds if user doesn't interact
    }
  }

  const resumeScroll = (ref) => {
    const container = ref?.current
    if (container) {
      // Small delay before resuming to ensure smooth UX
      setTimeout(() => {
        if (container) {
          container.dataset.paused = 'false'
        }
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
                  <div key={notice.id} className="notice-item border-b border-gray-100 :border-gray-700 pb-4 last:border-b-0 hover:shadow-md rounded-lg px-3 py-3 cursor-pointer">
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
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleItemClick(notice, 'notice')
                            }}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-xs transition-colors"
                          >
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
                  <div key={event.id} className="notice-item border-b border-gray-100 :border-gray-700 pb-6 last:border-b-0 hover:shadow-md rounded-lg px-3 py-3 cursor-pointer">
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
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleItemClick(event, 'event')
                          }}
                          className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-xs transition-colors"
                        >
                          <Download size={14} />
                          <span>Brochure</span>
                        </button>
                      )}
                      {event.hasRegistration && (
                        <a 
                          href={event.registrationLink || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-xs transition-colors"
                        >
                          <ExternalLink size={14} />
                          <span>Register Now</span>
                        </a>
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
                  <div key={notice.id} className="notice-item border-b border-gray-100 :border-gray-700 pb-4 last:border-b-0 hover:shadow-md rounded-lg px-3 py-3 cursor-pointer">
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
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleItemClick(notice, 'academic')
                            }}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-xs transition-colors"
                          >
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
          
          .theme- .notice-card {
            box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.4), 0 6px 8px -2px rgba(0, 0, 0, 0.2) !important;
          }
          
          /* Individual notice item hover effects - Custom CSS for  mode */
          .theme- .notice-item:hover {
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
      
      {/* Detail Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white :bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold theme-text">
                  {selectedItem.title}
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 :text-gray-300 :hover:text-white p-1 -mr-2"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedItem.type !== 'event' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 :text-gray-300">
                    <span>Date: {selectedItem.date}</span>
                    {selectedItem.isImportant && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full :bg-yellow-900 :text-yellow-200">
                        Important
                      </span>
                    )}
                  </div>
                )}

                {selectedItem.type === 'event' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600 :text-gray-300">
                      <span>🗓️ {selectedItem.startDate} - {selectedItem.endDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 :text-gray-300">
                      <span>📍 {selectedItem.location}</span>
                    </div>
                  </div>
                )}

                <div className="prose :prose-invert max-w-none">
                  <p className="text-gray-700 :text-gray-300">
                    {selectedItem.content || selectedItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 :border-gray-700">
                  <div className="flex flex-wrap gap-3">
                    {(selectedItem.pdfUrl || (selectedItem.type !== 'event' && selectedItem.type !== 'academic')) && (
                      <a
                        href={selectedItem.pdfUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Download size={16} className="mr-2" />
                        Download {selectedItem.type === 'event' ? 'Brochure' : 'Notice'}
                      </a>
                    )}

                    {selectedItem.type === 'event' && selectedItem.youtubeLink && (
                      <a
                        href={selectedItem.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        Watch Video
                      </a>
                    )}

                    {selectedItem.type === 'event' && selectedItem.registrationLink && (
                      <a
                        href={selectedItem.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Register Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notice