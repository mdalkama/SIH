import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, Phone, Mail, MapPin, Globe, Clock, Users, User } from 'lucide-react';
import LeadershipMessages from './components/LeadershipMessages';
import macetData from './data/macetData.json';

const MacetHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const location = useLocation();
  
  // Check if we're on the MACET home page
  const isHomePage = location.pathname === '/macet' || location.pathname === '/macet/';

  // MACET Carousel images
  const carouselImages = [
    {
      url: 'https://tse3.mm.bing.net/th/id/OIP.STIvYQb0uqWPoytCesISKQHaEL?rs=1&pid=ImgDetMain&o=7&rm=3',
      title: 'Maulana Azad College of Engineering & Technology',
      subtitle: 'Excellence in Technical Education Since 1985'
    },
    {
      url: 'https://macet.ac.in/AdminPanel/Admin/Slider_Photo/164851987.jpg',
      title: 'State-of-the-Art Campus',
      subtitle: 'Modern Infrastructure for Quality Engineering Education'
    },
    {
      url: 'https://macet.ac.in/AdminPanel/Admin/Slider_Photo/400698816.jpg',
      title: 'Innovation & Research',
      subtitle: 'Advancing Technology for a Better Tomorrow'
    },
    {
      url: 'https://macet.ac.in/AdminPanel/Admin/Slider_Photo/964667141.jpg',
      title: 'Industry Ready Graduates',
      subtitle: 'Bridging Academia and Industry Excellence'
    }
  ];

  // Scroll functions for different sections
  const scrollToAboutUs = () => {
    const aboutSection = document.getElementById('about-macet-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToMission = () => {
    const missionSection = document.getElementById('mission-section');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToVision = () => {
    const visionSection = document.getElementById('vision-section');
    if (visionSection) {
      visionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigation structure for MACET
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: 'Home',
      path: '/macet',
      items: []
    },
    {
      name: 'About Us',
      items: [
        { name: 'About MACET', action: scrollToAboutUs },
        { name: 'Mission', action: scrollToMission },
        { name: 'Vision', action: scrollToVision },
        { name: 'Director Desk', path: '/macet/director-desk' }
      ]
    },
    {
      name: 'Academics',
      items: [
        { 
          name: 'Departments', 
          subitems: [
            { name: 'Computer Science & Engineering', path: '/macet/departments/cse' },
            { name: 'Electronics & Communication', path: '/macet/departments/ece' },
            { name: 'Mechanical Engineering', path: '/macet/departments/me' },
            { name: 'Civil Engineering', path: '/macet/departments/ce' },
            { name: 'Electrical Engineering', path: '/macet/departments/ee' }
          ]
        },
        { 
          name: 'Courses', 
          subitems: [
            { name: 'B.Tech Programs', path: '/macet/courses/btech' },
            { name: 'M.Tech Programs', path: '/macet/courses/mtech' },
            { name: 'Diploma Programs', path: '/macet/courses/diploma' }
          ]
        },
        { name: 'Academic Calendar', path: '/macet/academic-calendar' },
        { name: 'Syllabus', path: '/macet/syllabus' }
      ]
    },
    {
      name: 'Admissions',
      items: [
        { name: 'Admission Process', path: '/macet/admissions/process' },
        { name: 'Fee Structure', path: '/macet/admissions/fee-structure' },
        { name: 'Eligibility Criteria', path: '/macet/admissions/eligibility' },
        { name: 'Important Dates', path: '/macet/admissions/dates' }
      ]
    },
    {
      name: 'Student Life',
      items: [
        { name: 'Student Activities', path: '/macet/student-life/activities' },
        { name: 'Clubs & Societies', path: '/macet/student-life/clubs' },
        { name: 'Sports & Recreation', path: '/macet/student-life/sports' },
        { name: 'Hostels', path: '/macet/student-life/hostels' }
      ]
    },
    {
      name: 'Facilities',
      items: [
        { name: 'Library', path: '/macet/facilities/library' },
        { name: 'Laboratories', path: '/macet/facilities/labs' },
        { name: 'Computer Center', path: '/macet/facilities/computer-center' },
        { name: 'Cafeteria', path: '/macet/facilities/cafeteria' }
      ]
    },
    {
      name: 'Placements',
      items: [
        { name: 'Placement Statistics', path: '/macet/placements/statistics' },
        { name: 'Recruiters', path: '/macet/placements/recruiters' },
        { name: 'Training Programs', path: '/macet/placements/training' }
      ]
    },
    {
      name: 'Research',
      items: [
        { name: 'Research Areas', path: '/macet/research/areas' },
        { name: 'Publications', path: '/macet/research/publications' },
        { name: 'Projects', path: '/macet/research/projects' }
      ]
    },
    {
      name: 'Contact',
      path: '/macet/contact',
      items: []
    }
  ];

  // Auto-slide carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown hover with delay
  const handleDropdownEnter = (index) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 1500);
    setHoverTimeout(timeout);
  };

  const handleDropdownStay = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  // Add body padding when navbar is sticky
  useEffect(() => {
    if (isScrolled) {
      document.body.style.paddingTop = '60px';
    } else {
      document.body.style.paddingTop = '0';
    }
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [isScrolled]);

  // Manual navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Top Utility Bar - MACET Blue Theme */}
      <div className="bg-white border-b border-gray-200 py-3 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-end">
            {/* Desktop Menu for Top Bar */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/macet/student-portal"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                <User className="w-4 h-4" />
                <span>{selectedLanguage === 'हिंदी' ? 'छात्र पोर्टल' : 'Student Portal'}</span>
              </Link>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Link 
                to="/macet/faculty-portal"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                <Users className="w-4 h-4" />
                <span>{selectedLanguage === 'हिंदी' ? 'फैकल्टी पोर्टल' : 'Faculty Portal'}</span>
              </Link>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Link 
                to="/macet/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
              >
                {selectedLanguage === 'हिंदी' ? 'संपर्क करें' : 'Contact Us'}
              </Link>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              {/* Language Select */}
              <div className="relative flex items-center space-x-2 group">
                <Globe className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                <div className="relative">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 focus:text-blue-700 transition-all duration-300 font-medium px-4 py-2 pr-8 rounded-lg border border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg cursor-pointer text-sm min-w-[80px]"
                  >
                    <option value="हिंदी">हिंदी</option>
                    <option value="English">English</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - MACET */}
      <header className="relative shadow-lg bg-white">
        {/* Logo Section */}
        <div className="bg-white/95 backdrop-blur-md py-1 sm:py-2 md:py-3 px-2 sm:px-4 md:px-6 border-b border-gray-100  z-30 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-start">
              <Link to="/macet" className="flex items-center hover:opacity-80 transition-opacity duration-300">
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="flex-shrink-0">
                    <img 
                      src="https://media-exp1.licdn.com/dms/image/C510BAQFn_ZOd9vVHlA/company-logo_200_200/0/1549098537630?e=2159024400&v=beta&t=N_5E5SliJEPS9fY2mQJbJ-o9l3pZoOz7wiabfvjSmA4" 
                      alt="MACET Logo" 
                      className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-left">
                    <h1 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-green-700 leading-tight mb-0.5">
                      Maulana Azad College of Engineering & Technology
                    </h1>
                    <h2 className="text-[10px] sm:text-xs md:text-xs lg:text-sm xl:text-base font-semibold text-gray-700 leading-tight mb-0.5">
                      Affiliated to Bihar Engineering University, Govt. of Bihar
                    </h2>
                    <h3 className="text-[10px] sm:text-xs md:text-xs lg:text-sm font-medium text-gray-600">
                      Approved by AICTE, New Delhi, Govt. of India
                    </h3>
                  </div>
                </div>
              </Link>
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                {/* Mobile Hamburger Menu */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg text-gray-700 hover:bg-gray-100 transition-colors backdrop-blur-md border border-gray-200 hover:border-blue-300"
                  >
                    {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel with Navigation Bar - Only show on home page */}
        {isHomePage && (
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            {/* Carousel Images Container */}
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
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${image.url})`,
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

            {/* Navigation Bar - Positioned at top of carousel */}
            <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled ? 'fixed top-0 shadow-lg backdrop-blur-xl bg-white/40 border-b border-white/10' : 'backdrop-blur-none'
            }`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
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
                            className={`px-2 xl:px-3 py-3 font-medium text-xs hover:bg-blue-500/20 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 ${
                              isScrolled 
                                ? 'text-gray-800 hover:text-blue-600' 
                                : 'text-white hover:text-blue-300'
                            }`}
                          >
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <button
                            className={`px-2 xl:px-3 py-3 font-medium text-xs hover:bg-blue-500/20 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 ${
                              isScrolled 
                                ? 'text-gray-800 hover:text-blue-600' 
                                : 'text-white hover:text-blue-300'
                            }`}
                          >
                            <span>{item.name}</span>
                            {item.items.length > 0 && (
                              <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                            )}
                          </button>
                        )}

                        {/* Dropdown Menu */}
                        {item.items.length > 0 && activeDropdown === index && (
                          <div 
                            className={`absolute top-full mt-0 w-96 z-[80] ${
                              index > navigationItems.length / 2 ? 'right-0' : 'left-0'
                            }`}
                            onMouseEnter={handleDropdownStay}
                            onMouseLeave={handleDropdownLeave}
                          >
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-visible animate-fade-in-up border border-white/20">
                              <div className="p-6 space-y-2">
                                <h3 className="text-lg font-bold mb-4 border-b border-blue-400 pb-2 flex items-center text-gray-800">
                                  <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                                  {item.name}
                                </h3>
                                {item.items.map((subItem, subIndex) => (
                                  <div key={subIndex} className="group/sub relative">
                                    {subItem.path ? (
                                      <Link
                                        to={subItem.path}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm text-gray-700 hover:text-blue-600"
                                      >
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover/sub:opacity-100 transition-opacity"></span>
                                          {subItem.name}
                                        </span>
                                      </Link>
                                    ) : subItem.action ? (
                                      <button
                                        onClick={subItem.action}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm w-full text-left text-gray-700 hover:text-blue-600"
                                      >
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover/sub:opacity-100 transition-opacity"></span>
                                          {subItem.name}
                                        </span>
                                      </button>
                                    ) : subItem.subitems ? (
                                      <div className="group/nested relative">
                                        <div 
                                          className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm cursor-pointer text-gray-700 hover:text-blue-600"
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
                                          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-visible animate-fade-in-up border border-white/20">
                                            <div className="p-4 space-y-1">
                                              <h4 className="text-sm font-bold mb-3 border-b border-blue-400 pb-2 flex items-center text-gray-800">
                                                <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                                                {subItem.name}
                                              </h4>
                                              {subItem.subitems.map((nestedItem, nestedIndex) => (
                                                <Link
                                                  key={nestedIndex}
                                                  to={nestedItem.path}
                                                  className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 font-medium text-xs border border-transparent hover:border-blue-200 hover:shadow-md backdrop-blur-sm group/nested-item text-gray-700 hover:text-blue-600"
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
                                    ) : null}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div className="px-3 py-2 text-gray-700 font-medium">{item.name}</div>
                  )}
                  {item.items.map((subItem, subIndex) => (
                    <div key={subIndex} className="ml-4">
                      {subItem.path ? (
                        <Link
                          to={subItem.path}
                          className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
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
                          className="block w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          {subItem.name}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Leadership Messages Section */}
      <LeadershipMessages leadershipData={macetData.leadership} />
    </>
  );
};

export default MacetHeader;
