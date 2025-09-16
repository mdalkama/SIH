import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronDown, Menu, X, Users, Globe, User, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import macetData from '../macet.json';
import gpcData from '../gpc.json';

const DynamicCollegeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const location = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  // Get college data based on URL or query parameter
  const getCollegeData = () => {
    const queryId = searchParams.get('id');
    
    if (location.pathname.includes('macet') || id === '0' || queryId === '0') {
      return macetData;
    } else if (location.pathname.includes('gpc') || id === '1' || queryId === '1') {
      return gpcData;
    }
    return macetData; // Default fallback
  };

  const collegeData = getCollegeData();
  const { header, collegeInfo } = collegeData;

  // Auto-slide carousel every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % header.carousel.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [header.carousel.images.length]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown hover with reduced delay
  const handleDropdownEnter = (index) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    // Reduced delay from 1500ms to 300ms
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleDropdownStay = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };
  
  // Handle submenu hover
  const handleSubmenuEnter = (index) => {
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
    setCurrentSlide((prev) => (prev + 1) % header.carousel.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + header.carousel.images.length) % header.carousel.images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Top Utility Bar - Clean Style */}
      <div className="bg-white/40 border-b border-gray-200 py-3 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* College Contact Info */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{header.topBar.contact.email}</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{header.topBar.contact.phone}</span>
              </div>
            </div>

            {/* Desktop Menu for Top Bar */}
            <div className="hidden md:flex items-center space-x-3">
              {header.topBar.quickLinks.map((link, index) => (
                <React.Fragment key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1 rounded"
                  >
                    {link.text}
                  </a>
                  {index < header.topBar.quickLinks.length - 1 && (
                    <div className="w-px h-4 bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
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

            {/* Mobile Menu for Top Bar */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="relative flex items-center space-x-1 group">
                <Globe className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                <div className="relative">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 focus:text-blue-700 transition-all duration-300 font-medium px-3 py-1 pr-6 rounded-lg border border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md cursor-pointer text-xs min-w-[70px]"
                  >
                    <option value="हिंदी">हिंदी</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - College Specific */}
      <header className="theme-surface relative shadow-lg">
        {/* Logo Section */}
        <div className="theme-surface py-2 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6 border-b border-gray-100 top-0 z-40 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 hover:opacity-80 transition-opacity duration-300">
                <div className="flex-shrink-0">
                  <img 
                    src={collegeInfo.logo || "https://svumshow.com/assets/images/department-logo/pngwing.png"} 
                    alt={`${collegeInfo.name} Logo`} 
                    className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-25 xl:w-25 object-contain hover:scale-105 transition-transform duration-300 theme-logo"
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-bold theme-text leading-tight mb-0.5 sm:mb-1">
                    {collegeInfo.name}
                  </h1>
                  <h2 className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-bold theme-text leading-tight mb-0.5 sm:mb-1 md:mb-2">
                    {collegeInfo.shortName}
                  </h2>
                  <h4 className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-semibold theme-blue-text">
                    {collegeInfo.type} - Established {collegeInfo.established}
                  </h4>
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
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">{collegeInfo.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel with Dark Navigation Bar */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          {/* Carousel Images Container */}
          <div 
            className="flex h-full transition-all duration-700 ease-in-out transform"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              filter: 'brightness(1.05)'
            }}
          >
            {header.carousel.images.map((image, index) => (
              <div
                key={index}
                className="min-w-full h-full relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image.src})`,
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
                      {image.description}
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

          {/* Dark Navigation Bar */}
          <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'fixed top-0 shadow-lg backdrop-blur-xl bg-white/40 border-b border-white/10' : 'backdrop-blur-none'
          }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between">
                {/* Desktop Navigation Only */}
                <div className="hidden lg:flex items-center mx-auto">
                  {header.navbar.menuItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative group"
                      onMouseEnter={() => handleDropdownEnter(index)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {!item.hasDropdown ? (
                        <Link
                          to={item.url}
                          className={`px-2 xl:px-3 py-3 font-medium text-xs hover:bg-blue-500/20 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 ${
                            isScrolled 
                              ? 'text-gray-800 hover:text-blue-600' 
                              : 'text-white hover:text-blue-300'
                          }`}
                        >
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <button
                          className={`px-2 xl:px-3 py-3 font-medium text-xs hover:bg-blue-500/20 transition-all duration-300 flex items-center space-x-1 border-b-2 border-transparent hover:border-blue-400 ${
                            isScrolled 
                              ? 'text-gray-800 hover:text-blue-600' 
                              : 'text-white hover:text-blue-300'
                          }`}
                        >
                          <span>{item.title}</span>
                          <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                        </button>
                      )}

                      {/* Enhanced Dropdown with Submenu Support */}
                      {item.hasDropdown && activeDropdown === index && (
                        <div 
                          className={`absolute top-full mt-1 z-[80] min-w-[300px] ${
                            index > header.navbar.menuItems.length / 2 ? 'right-0' : 'left-0'
                          }`}
                          onMouseEnter={handleDropdownStay}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-visible">
                            <div className="p-2">
                              {item.dropdownItems.map((subItem, subIndex) => (
                                <div key={subIndex} className="relative group/sub">
                                  {subItem.hasDropdown ? (
                                    <div className="relative">
                                      <div className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-md flex items-center justify-between cursor-pointer group-hover:bg-blue-50">
                                        <span className="font-medium">{subItem.text}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover/sub:translate-x-1 transition-transform" />
                                      </div>
                                      {/* Submenu - Always render but control visibility with CSS */}
                                      <div 
                                        className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-lg border border-gray-100 w-64 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200"
                                        onMouseEnter={handleDropdownStay}
                                      >
                                        <div className="p-2">
                                          {subItem.dropdownItems?.map((nestedItem, nestedIndex) => (
                                            <Link
                                              key={nestedIndex}
                                              to={nestedItem.url}
                                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                            >
                                              {nestedItem.text}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <Link
                                      to={subItem.url}
                                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                    >
                                      {subItem.text}
                                    </Link>
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
            {header.carousel.images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white h-full w-80 shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{collegeInfo.shortName}</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {header.navbar.menuItems.map((item, index) => (
                    <div key={index}>
                      {!item.hasDropdown ? (
                        <Link
                          to={item.url}
                          className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <div>
                          <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium">
                            {item.title}
                          </button>
                          <div className="ml-4 mt-2 space-y-1">
                            {item.dropdownItems.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.url}
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.text}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default DynamicCollegeHeader;