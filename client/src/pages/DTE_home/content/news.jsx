import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, X } from 'lucide-react'

const News = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)

  // News data with dummy content
  const newsData = [
    {
      id: 1,
      title: "Smart India Hackathon 2024 - Innovation Challenge",
      excerpt: "Department of Technical Education announces nationwide hackathon for students to showcase innovative solutions for real-world problems.",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop",
      date: "15 Dec 2024",
      category: "Events",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "New Engineering Colleges Approved in Rajasthan",
      excerpt: "Government of Rajasthan approves establishment of 5 new engineering colleges to enhance technical education infrastructure across the state.",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
      date: "12 Dec 2024",
      category: "Education",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "Industry Partnership Program Launched",
      excerpt: "Strategic partnerships with leading tech companies to provide practical training and placement opportunities for technical students.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
      date: "10 Dec 2024",
      category: "Industry",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "Digital Learning Platform Upgrade",
      excerpt: "Advanced e-learning infrastructure deployed across all technical institutions with AI-powered personalized learning modules.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
      date: "08 Dec 2024",
      category: "Technology",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "Research Excellence Awards 2024",
      excerpt: "Outstanding research contributions recognized in annual awards ceremony celebrating innovation in technical education sector.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      date: "05 Dec 2024",
      category: "Research",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "Skill Development Initiative Expansion",
      excerpt: "Comprehensive skill development programs expanded to include emerging technologies like AI, IoT, and blockchain across all campuses.",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop",
      date: "03 Dec 2024",
      category: "Skills",
      readTime: "5 min read"
    }
  ]

  const itemsPerSlide = 3
  const totalSlides = Math.ceil(newsData.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

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

        {/* News Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-full p-4 border border-blue-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-full p-4 border border-blue-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* News Cards Container */}
          <div className="overflow-hidden px-8 py-6 mx-16">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pr-8">
                    {newsData.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((news) => (
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
                          <button className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg border border-blue-600">
                            Read More
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full border border-blue-600 ${
                  index === currentSlide
                    ? 'bg-blue-600'
                    : 'bg-white hover:bg-blue-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All News Button */}
        <div className="text-center mt-12">
          <button className="px-10 py-4 bg-white text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-xl border border-blue-600">
            View All News
          </button>
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
          backdrop-filter: blur(10px);
          background: transparent !important;
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