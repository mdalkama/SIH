import React, { useState, useRef } from 'react'
import { Calendar, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAllNews } from '../../../data/newsData'

const News = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()

  // Get news data from shared data file
  const newsData = getAllNews()

  const getCategoryColor = (category) => {
    const colors = {
      Events: 'bg-blue-500',
      Education: 'bg-green-500',
      Industry: 'bg-purple-500',
      Technology: 'bg-orange-500',
      Research: 'bg-red-500',
      Skills: 'bg-indigo-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleReadMore = (newsId) => {
    navigate(`/news/${newsId}`)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -370, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 370, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="theme-bg py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold theme-text mb-4">
            Latest News & Updates
          </h2>
          <p className="text-xl theme-text-secondary max-w-3xl mx-auto">
            Stay informed with the latest developments in technical education and innovation
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Scrollable News Container */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-full p-3 shadow-lg border border-blue-600 transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-full p-3 shadow-lg border border-blue-600 transition-colors duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* News Cards Container - Scrollable */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide px-12"
            onScroll={handleScroll}
          >
            <div className="flex space-x-6 pb-6" style={{ width: 'max-content' }}>
              {newsData.map((news) => (
                <div
                  key={news.id}
                  className="news-card theme-surface rounded-xl shadow-lg overflow-hidden group"
                >
                  {/* Image Container */}
                  <div 
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(news.image)}
                  >
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(news.category)}`}>
                      {news.category}
                    </div>
                    
                    {/* Zoom Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6">
                    {/* Date and Read Time */}
                    <div className="flex items-center justify-between mb-3 text-sm theme-text-secondary">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{news.date}</span>
                      </div>
                      <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-medium border border-blue-600">
                        {news.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold theme-text mb-3 line-clamp-2 group-hover:text-blue-600">
                      {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="theme-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                      {news.excerpt}
                    </p>

                    {/* Read More Button */}
                    <button 
                      onClick={() => handleReadMore(news.id)}
                      className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg border border-blue-600 transition-colors duration-300"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(newsData.length / 3) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-blue-300"
              />
            ))}
            <div className="flex items-center ml-4 text-sm theme-text-secondary">
              <span>Scroll to see more →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-full object-contain"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-full p-3 border border-blue-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Custom Styles */}
        <style jsx>{`
          .news-card {
            min-width: 350px;
            max-width: 350px;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          /* Dark mode specific styling for news cards */
          .theme-dark .news-card {
            background: transparent !important;
          }

          .theme-dark .news-card:hover {
            background: transparent !important;
          }

          /* Light mode specific styling for news cards */
          .theme-light .news-card {
            background: transparent !important;
          }

          .theme-light .news-card:hover {
            background: transparent !important;
          }
        `}</style>
    </div>
  )
}

export default News