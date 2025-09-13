import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Users, Globe, User, ChevronLeft, ChevronRight } from 'lucide-react';
import contactPersonsPdf from '../../assets/Contact Persons DTE Updated.pdf';
import { useLocation } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const location = useLocation()
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/'

  // Carousel images with working URLs
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=600&fit=crop',
      title: 'Innovation & Research',
      subtitle: 'Advancing Technology for a Better Tomorrow'
    },
    {
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&h=600&fit=crop',
      title: 'State-of-the-Art Facilities',
      subtitle: 'Modern Infrastructure for Quality Education'
    },
    {
      url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=1920&h=600&fit=crop',
      title: 'Industry Partnerships',
      subtitle: 'Bridging Academia and Industry'
    },
    {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=600&fit=crop',
      title: 'Digital Innovation',
      subtitle: 'Leading the Digital Transformation in Education'
    }
  ]

  // Scroll to About Us section
  const scrollToAboutUs = () => {
    const aboutSection = document.getElementById('about-dte-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to Mission section
  const scrollToMission = () => {
    const missionSection = document.getElementById('mission-section');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to Vision section
  const scrollToVision = () => {
    const visionSection = document.getElementById('vision-section');
    if (visionSection) {
      visionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigation structure with multi-level dropdowns for Government of Rajasthan
  const navigate = useNavigate();

  const handleContactUsClick = () => {
    window.open(contactPersonsPdf, '_blank');
  };

  const navigationItems = [
    {
      name: 'About Us',
      items: [
        { name: 'About Us', action: scrollToAboutUs },
        { name: 'Mission', action: scrollToMission },
        { name: 'Vision', action: scrollToVision }
      ]
    },
    {
      name: 'Admissions',
      items: [
        { 
          name: 'Diploma Engineering', 
          subitems: [
            { name: 'First Year Diploma Engineering', path: '/admission/diploma-engineering-first-year' },
            { name: 'Lateral Entry Diploma Engineering', path: '/admission/diploma-engineering-lateral-entry' }
          ]
        },
        { 
          name: 'Diploma Non-Engineering', 
          subitems: [
            { name: 'First Year Diploma Non-Engineering', path: '/admission/diploma-non-engineering-first-year' },
            { name: 'Second Year Graduate Non-Engineering Courses', path: '/admission/diploma-non-engineering-second-year-graduate' },
            { name: 'First Year Degree Non-Engineering', path: '/admission/diploma-non-engineering-first-year-degree' }
          ]
        }
      ]
    },
    {
      name: 'Students Corner',
      path: '/students-corner',
      items: []
    },
    {
      name: 'Employee Corner',
      items: [
        { name: 'Transfer Orders', path: '/employee/transfer-orders' },
        { name: 'Promotion Orders', path: '/employee/promotion-orders' },
        { name: 'Posting Orders', path: '/employee/posting-orders' },
        { name: 'Retirement Orders', path: '/employee/retirement-orders' },
        { name: 'Seniority List', path: '/employee/seniority-list' },
        { name: 'Civil List', path: '/employee/civil-list' },
        { name: 'Emp. Transfer Policy', path: '/employee/transfer-policy' },
        { name: 'Recruitment', path: '/employee/recruitment' }
      ]
    },
    {
      name: 'Documents',
      items: [
        { name: 'Circulars & Letters', path: '/documents/circulars-letters' },
        { name: 'Establishment', path: '/documents/establishment' },
        { name: 'Department Rules', path: '/documents/department-rules' }
      ]
    },
    {
      name: 'RTI',
      path: '/rti',
      items: []
    },
    {
      name: 'Tenders & Auctions',
      path: '/tenders-auctions',
      items: []
    },
    {
      name: 'Roster',
      path: '/roster',
      items: []
    },
    {
      name: 'Colleges',
      path: '/colleges',
      items: []
    },
    {
      name: 'NOC',
      path: '/noc',
      items: []
    },
    {
      name: 'Other Links',
      items: [
        { 
          name: 'Government Portals', 
          subitems: [
            { name: 'Department of Technical Education, Rajasthan', path: 'https://dte.rajasthan.gov.in/' },
            { name: 'Education Department', path: 'https://education.rajasthan.gov.in/home' },
            { name: 'AICTE', path: 'https://internship.aicte-india.org/' },
            { name: 'UGC', path: 'https://www.ugc.gov.in/' }
          ]
        },
        { 
          name: 'Useful Links', 
          subitems: [
            { name: 'Digital India', path: 'https://www.digitalindiaportal.co.in/' },
            { name: 'Skill India', path: 'https://www.skillindiadigital.gov.in' },
            { name: 'Startup India', path: 'https://udyogsuvidhakendra.in/startup-india-registration?msclkid=0a074f8999b6100bb449274ca7ce74ad' }
          ]
        },
        { 
          name: 'External Resources', 
          subitems: [
            { name: 'NPTEL', path: 'https://nptel.ac.in/?locale=en_us' },
            { name: 'SWAYAM', path: 'https://onlinecourses.nptel.ac.in/' },
            { name: 'Virtual Labs', path: 'https://www.vlab.co.in/' }
          ]
        }
      ]
    }
  ]

  // Auto-slide carousel every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle dropdown hover with delay
  const handleDropdownEnter = (index) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    setActiveDropdown(index)
  }

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 1500) // 1500ms delay before closing (increased for better stability)
    setHoverTimeout(timeout)
  }

  const handleDropdownStay = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }

  // Add body padding when navbar is sticky
  useEffect(() => {
    if (isScrolled) {
      document.body.style.paddingTop = '60px'
    } else {
      document.body.style.paddingTop = '0'
    }
    return () => {
      document.body.style.paddingTop = '0'
    }
  }, [isScrolled])

  // Manual navigation functions with smooth transition
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Handle indicator click
  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <>
      {/* Top Utility Bar - Clean Style */}
      <div className="bg-white border-b border-gray-200 py-3 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-end">
            {/* Desktop Menu for Top Bar */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/login?role=student"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                <User className="w-4 h-4" />
                <span>{selectedLanguage === 'हिंदी' ? 'छात्र' : 'Students'}</span>
              </Link>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Link 
                to="/login?role=staff"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                <Users className="w-4 h-4" />
                <span>{selectedLanguage === 'हिंदी' ? 'कर्मचारी' : 'Staff'}</span>
              </Link>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <button 
                onClick={handleContactUsClick}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                {selectedLanguage === 'हिंदी' ? 'संपर्क करें' : 'Contact Us'}
              </button>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              {/* Language Select */}
              <div className="relative flex items-center space-x-2 group">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                <div className="relative">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:text-blue-700 dark:focus:text-blue-300 transition-all duration-300 font-medium px-4 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg cursor-pointer text-sm min-w-[80px] backdrop-blur-sm"
                  >
                    <option value="हिंदी">हिंदी</option>
                    <option value="English">English</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  {/* Modern accent line */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left w-full rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Mobile Menu Button for Top Bar */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Modern Mobile Language Select */}
              <div className="relative flex items-center space-x-1 group">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                <div className="relative">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:text-blue-700 dark:focus:text-blue-300 transition-all duration-300 font-medium px-3 py-1 pr-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none shadow-sm hover:shadow-md cursor-pointer text-xs min-w-[70px]"
                  >
                    <option value="हिंदी">हिंदी</option>
                  </select>
                </div>
              </div>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Link 
                to="/login?role=student"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                <User className="w-4 h-4" />
                <span>Students</span>
              </Link>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Link 
                to="/login?role=staff"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                <Users className="w-4 h-4" />
                <span>Staff</span>
              </Link>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <button 
                onClick={handleContactUsClick}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                Contact Us
              </button>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              {/* Modern Language Select */}
              <div className="relative flex items-center space-x-2 group">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                <div className="relative">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:text-blue-700 dark:focus:text-blue-300 transition-all duration-300 font-medium px-4 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg cursor-pointer text-sm min-w-[80px] backdrop-blur-sm"
                  >
                    <option value="हिंदी">हिंदी</option>
                    <option value="English">English</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  {/* Modern accent line */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left w-full rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Government of Rajasthan */}
      <header className="theme-surface relative shadow-lg">
        {/* Logo Section */}
        <div className="theme-surface py-2 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6 border-b border-gray-100 top-0 z-40 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 hover:opacity-80 transition-opacity duration-300">
                <div className="flex-shrink-0">
                  <img 
                    src="https://svumshow.com/assets/images/department-logo/pngwing.png" 
                    alt="Government of Rajasthan Logo" 
                    className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-25 xl:w-25 object-contain hover:scale-105 transition-transform duration-300 theme-logo"
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-bold theme-text leading-tight mb-0.5 sm:mb-1">
                    राजस्थान सरकार
                  </h1>
                  <h2 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-bold theme-text leading-tight mb-0.5 sm:mb-1 md:mb-2">
                    तकनीकी शिक्षा निदेशालय
                  </h2>
                  <h4 className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-semibold theme-blue-text">
                    Government of Rajasthan - Department of Technical Education
                  </h4>
                </div>
              </Link>
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                {/* Mobile Hamburger Menu */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                  >
                    {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
                  </button>
                </div>
                <img 
                  src="https://dte.rajasthan.gov.in/assets/img/mono.jpg" 
                  alt="DTE Mono Logo" 
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 xl:h-20 xl:w-20 object-cover rounded-full hover:scale-105 transition-transform duration-300 border border-gray-200 dark:border-gray-700"
                />
                <img 
                  src="https://dte.rajasthan.gov.in/assets/img/Azadi.png" 
                  alt="Azadi Ka Amrit Mahotsav" 
                  className="h-8 sm:h-10 md:h-12 lg:h-16 xl:h-20 object-contain hover:scale-105 transition-transform duration-300"
                  style={{ filter: 'brightness(1.2) contrast(1.1) !important', display: 'block !important', visibility: 'visible !important', opacity: '1 !important' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Carousel with Dark Navigation Bar - Only show on home page */}
        {isHomePage && (
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            {/* Carousel Images Container with Enhanced Sliding Effects */}
            <div 
              className="flex h-full transition-all duration-700 ease-in-out transform"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                filter: 'brightness(1.05)'
              }}
            >
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className="min-w-full h-full relative"
                  style={{
                    backgroundImage: `linear-gradient(var(--theme-carousel-overlay), var(--theme-carousel-overlay)), url(${image.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center mt-8 md:mt-16">
                    <div className="text-center text-white max-w-4xl px-4 md:px-6">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4 transform transition-all duration-1000 delay-300" 
                          style={{ 
                            opacity: index === currentSlide ? 1 : 0,
                            transform: index === currentSlide ? 'translateY(0)' : 'translateY(30px)'
                          }}>
                        {image.title}
                      </h2>
                      <p className="text-sm sm:text-base md:text-xl lg:text-2xl transform transition-all duration-1000 delay-500" 
                         style={{ 
                           opacity: index === currentSlide ? 1 : 0,
                           transform: index === currentSlide ? 'translateY(0)' : 'translateY(30px)'
                         }}>
                        {image.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 md:p-4 text-white hover:bg-white/40 transition-all duration-500 hover:scale-110 hover:shadow-xl group"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 md:p-4 text-white hover:bg-white/40 transition-all duration-500 hover:scale-110 hover:shadow-xl group"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Dark Navigation Bar - Positioned at top of carousel like IIT Bombay with glass effects */}
            <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled ? 'fixed top-0 shadow-lg backdrop-blur-xl bg-black/40 dark:bg-black/60 border-b border-white/10' : 'backdrop-blur-none'
            }`}>
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                  {/* Desktop Navigation Only */}
                  <div className="hidden lg:flex items-center mx-auto">
                    {navigationItems.map((item, index) => (
                      <div 
                        key={index} 
                        className="relative group"
                        onMouseEnter={() => handleDropdownEnter(index)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {item.path ? (
                          <Link
                            to={item.path}
                            className="px-2 xl:px-3 py-3 text-white font-medium text-xs hover:bg-blue-500/20 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 hover:text-blue-300"
                          >
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <button
                            className="px-2 xl:px-3 py-3 text-white font-medium text-xs hover:bg-blue-500/20 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 hover:text-blue-300"
                          >
                            <span>{item.name}</span>
                            {item.items.length > 0 && (
                              <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                            )}
                          </button>
                        )}

                        {/* Enhanced Glass Morphism Dropdown - ONLY on home page */}
                        {item.items.length > 0 && activeDropdown === index && (
                          <div 
                            className={`absolute top-full mt-0 w-96 z-[80] ${
                              index > navigationItems.length / 2 ? 'right-0' : 'left-0'
                            }`}
                            onMouseEnter={handleDropdownStay}
                            onMouseLeave={handleDropdownLeave}
                          >
                            <div className="glass-dropdown rounded-2xl shadow-2xl overflow-visible animate-fade-in-up">
                              <div className="backdrop-blur-xl p-6 space-y-2">
                                <h3 className="text-lg font-bold mb-4 border-b border-blue-400 pb-2 flex items-center">
                                  <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                                  {item.name}
                                </h3>
                                {item.items.map((subItem, subIndex) => (
                                  <div key={subIndex} className="group/sub relative">
                                    {subItem.path ? (
                                      <Link
                                        to={subItem.path}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm"
                                      >
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover/sub:opacity-100 transition-opacity"></span>
                                          {subItem.name}
                                        </span>
                                      </Link>
                                    ) : subItem.action ? (
                                      <button
                                        onClick={subItem.action}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm w-full text-left"
                                      >
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover/sub:opacity-100 transition-opacity"></span>
                                          {subItem.name}
                                        </span>
                                      </button>
                                    ) : subItem.subitems ? (
                                      <div className="group/nested relative">
                                        <div 
                                          className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm cursor-pointer"
                                          style={{ paddingRight: '50px' }}
                                        >
                                          <span className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover/sub:opacity-100 transition-opacity"></span>
                                            {subItem.name}
                                          </span>
                                          <ChevronRight className="w-4 h-4 text-blue-400" />
                                        </div>
                                        {/* Nested Dropdown */}
                                        <div 
                                          className="absolute left-full top-0 ml-0 w-80 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-700 z-[90]"
                                          onMouseEnter={handleDropdownStay}
                                          onMouseLeave={handleDropdownLeave}
                                          style={{
                                            left: '95%',
                                            top: '-10px',
                                            paddingLeft: '10px'
                                          }}
                                        >
                                          <div className="glass-dropdown rounded-2xl shadow-2xl overflow-visible animate-fade-in-up">
                                            <div className="backdrop-blur-xl p-4 space-y-1">
                                              <h4 className="text-sm font-bold mb-3 border-b border-blue-400 pb-2 flex items-center">
                                                <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                                                {subItem.name}
                                              </h4>
                                              {subItem.subitems.map((nestedItem, nestedIndex) => (
                                                <Link
                                                  key={nestedIndex}
                                                  to={nestedItem.path}
                                                  className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 font-medium text-xs border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm group/nested-item"
                                                  onClick={() => setActiveDropdown(null)}
                                                >
                                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-0 group-hover/nested-item:opacity-100 transition-opacity"></span>
                                                  {nestedItem.name}
                                                </Link>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <a
                                        href="#"
                                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm"
                                      >
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover/sub:opacity-100 transition-opacity"></span>
                                          {subItem.name}
                                        </span>
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Carousel Indicators */}
            <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 ${
                    index === currentSlide
                      ? 'bg-white scale-125 shadow-lg ring-1 md:ring-2 ring-white/50'
                      : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Navigation Bar - Always show on non-home pages with solid colors, no glass effects */}
        {!isHomePage && (
          <nav className="bg-black border-b border-gray-800 top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between">
                {/* Desktop Navigation Only */}
                <div className="hidden lg:flex items-center mx-auto">
                  {navigationItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative group"
                      onMouseEnter={() => handleDropdownEnter(index)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {item.path ? (
                        <Link
                          to={item.path}
                          className="px-2 xl:px-3 py-3 text-white font-medium text-xs hover:bg-gray-800 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 hover:text-blue-300"
                        >
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <button
                          className="px-2 xl:px-3 py-3 text-white font-medium text-xs hover:bg-gray-800 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 hover:text-blue-300"
                        >
                          <span>{item.name}</span>
                          {item.items.length > 0 && (
                            <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                          )}
                        </button>
                      )}

                      {/* Solid Dropdown - NO glass effects on non-home pages */}
                      {item.items.length > 0 && activeDropdown === index && (
                        <div 
                          className={`absolute top-full mt-0 w-96 z-[80] ${
                            index > navigationItems.length / 2 ? 'right-0' : 'left-0'
                          }`}
                          onMouseEnter={handleDropdownStay}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="bg-white rounded-lg shadow-2xl overflow-visible animate-fade-in-up border border-gray-200">
                            <div className="p-4 space-y-1">
                              <h3 className="text-lg font-bold mb-3 border-b border-gray-200 pb-2 text-gray-800">
                                {item.name}
                              </h3>
                              {item.items.map((subItem, subIndex) => (
                                <div key={subIndex} className="group/sub relative">
                                  {subItem.path ? (
                                    <Link
                                      to={subItem.path}
                                      className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                      <span className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        {subItem.name}
                                      </span>
                                    </Link>
                                  ) : subItem.action ? (
                                    <button
                                      onClick={subItem.action}
                                      className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                    >
                                      <span className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        {subItem.name}
                                      </span>
                                    </button>
                                  ) : subItem.subitems ? (
                                    <div className="group/nested relative">
                                      <div 
                                        className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                        style={{ paddingRight: '50px' }}
                                      >
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                          {subItem.name}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                      </div>
                                      {/* Nested Dropdown for non-home pages */}
                                      <div 
                                        className="absolute left-full top-0 ml-0 w-80 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-700 z-[90]"
                                        onMouseEnter={handleDropdownStay}
                                        onMouseLeave={handleDropdownLeave}
                                        style={{
                                          left: '95%',
                                          top: '-10px',
                                          paddingLeft: '10px'
                                        }}
                                      >
                                        <div className="bg-white rounded-lg shadow-2xl overflow-visible animate-fade-in-up border border-gray-200">
                                          <div className="p-4 space-y-1">
                                            <h4 className="text-sm font-bold mb-3 border-b border-gray-200 pb-2 text-gray-800">
                                              {subItem.name}
                                            </h4>
                                            {subItem.subitems.map((nestedItem, nestedIndex) => (
                                              <Link
                                                key={nestedIndex}
                                                to={nestedItem.path}
                                                className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 font-medium text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-800 group/nested-item"
                                                onClick={() => setActiveDropdown(null)}
                                              >
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                                {nestedItem.name}
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <a
                                      href="#"
                                      className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                      <span className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        {subItem.name}
                                      </span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-black/90 backdrop-blur-xl w-full sm:w-80 h-full shadow-xl overflow-y-auto border-r border-white/20">
            <div className="p-4 border-b border-white/20 bg-black/95 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Navigation Menu</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navigationItems.map((item, index) => (
                <div key={index} className="border-b border-white/10 pb-3">
                  <button className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/20 hover:text-white rounded-lg font-medium transition-colors flex items-center justify-between backdrop-blur-sm group">
                    <span className="text-sm sm:text-base">{item.name}</span>
                    {item.items.length > 0 && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                  </button>
                  {item.items.length > 0 && (
                    <div className="ml-2 mt-2 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <div key={subIndex}>
                          {subItem.path ? (
                            <Link
                              to={subItem.path}
                              className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors backdrop-blur-sm border-l-2 border-transparent hover:border-blue-400"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ) : subItem.action ? (
                            <button
                              onClick={() => {
                                subItem.action();
                                setIsMenuOpen(false);
                              }}
                              className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors backdrop-blur-sm border-l-2 border-transparent hover:border-blue-400 w-full text-left"
                            >
                              {subItem.name}
                            </button>
                          ) : subItem.subitems ? (
                            <div className="space-y-1">
                              <div className="px-3 py-2 text-sm text-gray-300 font-medium border-l-2 border-blue-400">
                                {subItem.name}
                              </div>
                              <div className="ml-4 space-y-1">
                                {subItem.subitems.map((nestedItem, nestedIndex) => (
                                  <Link
                                    key={nestedIndex}
                                    to={nestedItem.path}
                                    className="block px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors backdrop-blur-sm border-l-2 border-transparent hover:border-green-400"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {nestedItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <a
                              href="#"
                              className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors backdrop-blur-sm border-l-2 border-transparent hover:border-blue-400"
                            >
                              {subItem.name}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

export default Header