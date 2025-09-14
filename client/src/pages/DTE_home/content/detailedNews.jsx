import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, ArrowLeft, Share2, ExternalLink, X } from 'lucide-react'
import { getNewsById } from '../../../data/newsData'

const DetailedNews = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [newsItem, setNewsItem] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // Get news item from shared data - replace with actual API call later
    const fetchNewsItem = () => {
      const item = getNewsById(id)
      if (item) {
        setNewsItem(item)
      }
      setLoading(false)
    }

    fetchNewsItem()
  }, [id])

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.excerpt,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold theme-text mb-4">News Not Found</h2>
          <p className="theme-text-secondary mb-6">The requested news article could not be found.</p>
          <button 
            onClick={goBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen theme-bg">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 theme-surface border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to News</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="mb-8">
          {/* Category Badge */}
          <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4 ${getCategoryColor(newsItem.category)}`}>
            {newsItem.category}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold theme-text mb-4 leading-tight">
            {newsItem.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm theme-text-secondary mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{newsItem.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>By {newsItem.author}</span>
            </div>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
              {newsItem.readTime}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {newsItem.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 theme-text-secondary text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div 
            className="relative h-96 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => handleImageClick(newsItem.image)}
          >
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none theme-text">
          <div 
            dangerouslySetInnerHTML={{ __html: newsItem.fullContent }}
            className="article-content"
          />
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="theme-text-secondary text-sm">Share this article:</span>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={goBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Back to News
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-full object-contain"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-full p-3 border border-blue-600 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          color: inherit;
        }
        
        .article-content p {
          margin: 1rem 0;
          line-height: 1.7;
        }
        
        .article-content ul, .article-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .article-content li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .article-content strong {
          font-weight: 600;
        }
        
        .prose {
          color: inherit;
        }
        
        .prose h3 {
          color: inherit;
        }
        
        .prose p {
          color: inherit;
        }
        
        .prose ul {
          color: inherit;
        }
        
        .prose ol {
          color: inherit;
        }
        
        .prose li {
          color: inherit;
        }
      `}</style>
    </div>
  )
}

export default DetailedNews
