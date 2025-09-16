import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const MacetNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Home',
      path: '/macet',
      items: []
    },
    {
      name: 'About Us',
      items: [
        { name: 'About MACET', path: '/macet/about' },
        { name: 'Mission & Vision', path: '/macet/mission-vision' },
        { name: 'Director Desk', path: '/macet/director-desk' },
        { name: 'Administration', path: '/macet/administration' }
      ]
    },
    {
      name: 'Academics',
      items: [
        { 
          name: 'Departments', 
          path: '/macet/departments'
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
        { name: 'Examination', path: '/macet/examination' }
      ]
    },
    {
      name: 'Admissions',
      path: '/macet/admissions',
      items: []
    },
    {
      name: 'Student Life',
      items: [
        { name: 'Hostels', path: '/macet/hostels' },
        { name: 'Sports & Recreation', path: '/macet/sports' },
        { name: 'Cultural Activities', path: '/macet/cultural' },
        { name: 'Student Clubs', path: '/macet/clubs' }
      ]
    },
    {
      name: 'Facilities',
      path: '/macet/facilities',
      items: []
    },
    {
      name: 'Placements',
      path: '/macet/placements',
      items: []
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

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-300/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-center h-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`px-1 py-0.5 rounded-md text-[10px] font-medium transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-white/90 text-white'
                        : 'text-black hover:bg-gray-200 hover:text-black'
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    className="px-1 py-0.5 rounded-md text-[10px] font-medium text-black hover:bg-gray-200 hover:text-black transition-colors duration-200 flex items-center space-x-1"
                    onClick={() => handleDropdownToggle(index)}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="w-2 h-2" />
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.items.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden absolute right-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-gray-800 p-0.5"
            >
              {isMenuOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`block px-2 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActivePath(item.path)
                          ? 'bg-gray-800 text-white'
                          : 'text-black hover:bg-gray-200 hover:text-black'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div>
                      <button
                        className="w-full text-left px-2 py-1 rounded-md text-sm font-medium text-black hover:bg-gray-200 hover:text-black transition-colors duration-200 flex items-center justify-between"
                        onClick={() => handleDropdownToggle(index)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {activeDropdown === index && (
                        <div className="pl-6 space-y-1">
                          {item.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              className="block px-2 py-1 rounded-md text-xs text-black hover:bg-gray-200 hover:text-black transition-colors duration-200"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MacetNavbar;
