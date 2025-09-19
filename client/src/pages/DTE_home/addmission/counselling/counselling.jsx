import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart2,
  CheckCircle,
  ArrowUp,
  Edit,
  FileText,
  Award,
  Menu, 
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { NavLink, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';

// Import all components
import Overview from './overview/overview';
import Merit from './merit/merit';
import SeatAllotment from './seat/seat';
import Decision from './decision/decision';
import UpwardMovement from './upwardMovement/upwardMovement';
import UpdateOptions from './updateOptions/updateOptions';
import AdmitCard from './admitCard/admitCard';
import Result from './result/result';

const counselling = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const menuItems = [
    {
      title: 'Overview',
      icon: <LayoutDashboard size={20} />,
      link: '/counselling/overview',
      component: <Overview />
    },
    {
      title: 'Merit',
      icon: <BarChart2 size={20} />,
      link: '/counselling/merit',
      component: <Merit />
    },
    {
      title: 'Seat Allotment',
      icon: <Users size={20} />,
      link: '/counselling/seat-allotment',
      component: <SeatAllotment />
    },
    {
      title: 'Decision',
      icon: <CheckCircle size={20} />,
      link: '/counselling/decision',
      component: <Decision />
    },
    {
      title: 'Upward Movement',
      icon: <ArrowUp size={20} />,
      link: '/counselling/upward-movement',
      component: <UpwardMovement />
    },
    {
      title: 'Update Options',
      icon: <Edit size={20} />,
      link: '/counselling/update-options',
      component: <UpdateOptions />
    },
    {
      title: 'Admit Card',
      icon: <FileText size={20} />,
      link: '/counselling/admit-card',
      component: <AdmitCard />
    },
    {
      title: 'Result',
      icon: <Award size={20} />,
      link: '/counselling/result',
      component: <Result />
    }
  ];

  return (
    <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`bg-[#0c1526] text-white transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="p-3 flex items-center justify-between border-b border-[#1d2646] h-16">
          {sidebarOpen && (
            <h3 className="text-lg font-semibold text-white">DTE Rajasthan</h3>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-[#1d2646] text-white flex-shrink-0"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={`${item.link}?applicationId=${applicationId}`}
                  className={({ isActive }) =>
                    `group flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#1a2238] text-white shadow-md '
                        : 'text-white hover:text-white hover:bg-[#252f4a]'
                    }`
                  }
                  title={!sidebarOpen ? item.title : ''}
                >
                  <span className="flex-shrink-0 text-inherit">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="ml-3 truncate text-inherit">
                      {item.title}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-[#1d2646] mt-auto">
          <button 
            onClick={() => {
              // Add your logout logic here
              console.log('Logout clicked');
              // Example: navigate to login page
              // navigate('/login');
            }}
            className={`w-full flex items-center ${sidebarOpen ? 'justify-start pl-3' : 'justify-center'} space-x-3 py-2.5 text-gray-300 hover:text-white hover:bg-[#1a2238] rounded-lg transition-all duration-200`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <img 
                src="https://vectorseek.com/wp-content/uploads/2023/09/Government-Of-India-Logo-Vector.svg-.png" 
                alt="Government of Rajasthan" 
                className="h-12 w-auto"
                loading="lazy"
              />
              <div className="hidden sm:block">
                <div className="text-sm sm:text-base font-semibold text-gray-800">Department of Technical Education</div>
                <div className="text-xs sm:text-sm text-gray-600">Government of Rajasthan</div>
              </div>
            </div>
            <div className="text-sm sm:text-base font-medium text-[#2c396b] whitespace-nowrap ml-2 sm:ml-4">
              <div>Admission Counseling Portal</div>
              {applicationId && (
                <div className="text-xs text-gray-600 mt-1">
                  Application ID: {applicationId}
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to={`/counselling/overview?applicationId=${applicationId}`} replace />} />
            {menuItems.map((item, index) => (
              <Route 
                key={index}
                path={item.link.replace('/counselling', '')}
                element={
                  <div className="p-4 sm:p-6">
                    {item.component}
                  </div>
                }
              />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default counselling;