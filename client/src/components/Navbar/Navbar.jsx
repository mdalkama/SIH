import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation, NavLink } from "react-router-dom";
import getRoleDisplayName from "../../utils/roleUtils.js"
import menuConfig from "../../utils/menuConfigUtils.js";
import Loading from "../Loading.jsx";
import { useUser } from "../../context/UserContext.jsx";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  CheckCircle,
  ArrowUp,
  Edit,
  FileText,
  Award,
  Menu as MenuIcon,
  X,
  ChevronDown,
  ChevronRight,
  User as UserIcon,
  LogOut,
} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('');
    const { user, setUser, loading } = useUser();
    
    // Update active menu when location changes
    useEffect(() => {
        const path = location.pathname;
        const lastSegment = path.split("/").pop();
        setActiveMenu(lastSegment);
    }, [location]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("https://sih-4ptm.onrender.com/api/v1/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                setUser(null);
                window.location.href = "/login";
            } else {
                console.error("Failed to logout");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const navigationItems = menuConfig[user?.role] || [];

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="h-screen w-screen bg-[#F0F1F3] overflow-hidden flex p-0">
      {/* Sidebar */}
      <div 
        className={`h-full bg-[#0C1526] text-white transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 relative ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Sidebar Header with Title and Close Button */}
        <div className={`p-3 border-b border-[#1d2646] h-16 ${sidebarOpen ? 'flex items-center justify-between' : 'flex items-center justify-center'}`}>
          {sidebarOpen && (
            <h3 className="text-lg font-semibold text-white">DTE Rajasthan</h3>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-[#1d2646] text-white flex-shrink-0"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
        
        {/* User Profile - Below the collapse button */}
        <div className="p-4 border-b border-[#1d2646]">
          <div className={`flex ${!sidebarOpen ? 'justify-center' : ''} items-center`}>
            <div className="h-10 w-10 bg-[#2B386A] text-white rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon size={20} />
            </div>
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <div className="text-sm font-medium text-white truncate">
                  {user?.name || "User Name"}
                </div>
                <div className="text-xs text-gray-400">
                  {getRoleDisplayName(user?.role) || "Role"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 no-scrollbar mb-20">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center p-3 rounded-lg transition-all duration-200 ${
                        isActive || activeMenu === item.id
                          ? 'bg-[#1a2238] text-white shadow-md'
                          : 'text-gray-300 hover:bg-[#252f4a] hover:text-white'
                      }`
                    }
                    title={!sidebarOpen ? item.label : ''}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    <span className="flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    {sidebarOpen && (
                      <span className="ml-3 truncate">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0C1526] border-t border-[#1d2646] p-4">
          {sidebarOpen ? (
            <div className="flex flex-col">
              <div className="flex-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2.5 text-sm text-gray-300 hover:bg-[#252f4a] hover:text-white rounded-lg transition-colors duration-200 mt-auto"
              >
                <LogOut size={18} />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2.5 text-sm text-gray-300 hover:bg-[#252f4a] hover:text-white rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Top Navigation Bar */}
        <nav className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6">
          <div className="flex items-center">
            <div className="md:hidden mr-4">
              <button 
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
            <div className="flex items-center">
              <img
                className="h-10 w-auto"
                src="https://svumshow.com/assets/images/department-logo/pngwing.png"
                alt="DTE Logo"
              />
              <div className="hidden sm:flex flex-col ml-3">
                <div className="text-sm font-medium text-gray-900">Government of Rajasthan</div>
                <div className="text-xs text-gray-500">Department of Technical Education</div>
              </div>
            </div>
          </div>
          
          <div className="ml-auto flex items-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              <UserIcon size={18} />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 no-scrollbar">
          <Outlet />
        </div>
      </div>
        </div>
    );
};

export default Navbar;