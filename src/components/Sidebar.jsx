import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/company-logo.webp";
import logoDesign from "../assets/logoDesign.PNG"
import { 
  Home, 
  Calendar, 
  MapPin, 
  Users,
  Settings,
  ChevronLeft,
  Building2,
  Ticket,
  Grid3X3,
  LogOut,
  X
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Auto-close sidebar on mobile when route changes
  // useEffect(() => {
  //   if (isOpen) {
  //     onClose();
  //   }
  // }, [location.pathname, onClose, isOpen]);

  useEffect(() => {
  if (isOpen && window.innerWidth < 768) { // mobile only
    onClose();
  }
}, [location.pathname]);
  
  // Close sidebar on Escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay with fade-in animation */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative z-50
          top-0 left-0 h-screen
          bg-gradient-to-b from-gray-50 to-white
          border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isCollapsed ? "w-20" : "w-64"}
          shadow-lg md:shadow-sm`}
      >
        {/* Close button for mobile */}
        {/* <button
          onClick={onClose}
          className="absolute -right-12 top-4 md:hidden p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button> */}

        {/* Collapse Toggle Button (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 hidden md:flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-110"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`p-4 border-b border-gray-200 ${isCollapsed ? "px-3" : ""}`}>
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  {/* <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    FORESIGHT DIGITAL
                  </h2> */}
                  <img src={logo} alt="" />
                </div>
              )}
              {isCollapsed && (
                <div className="w-8 h-8 flex items-center justify-center">
                  {/* <Ticket className="w-5 h-5 text-white" /> */}
                  <img src={logoDesign} alt="logo" />
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 p-4 space-y-1 overflow-y-auto ${isCollapsed ? "px-2" : ""}`}>
            <SidebarLink 
              to="/book" 
              label="Booking Window" 
              icon={<Home className="w-5 h-5" />} 
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              to="/venues" 
              label="Venues" 
              icon={<Building2 className="w-5 h-5" />} 
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              to="/events" 
              label="Events" 
              icon={<Calendar className="w-5 h-5" />} 
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              to="/manageSeats" 
              label="Manage Seating" 
              icon={<Grid3X3 className="w-5 h-5" />} 
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              to="/attendees" 
              label="Attendees" 
              icon={<Users className="w-5 h-5" />} 
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              to="/locations" 
              label="Locations" 
              icon={<MapPin className="w-5 h-5" />} 
              isCollapsed={isCollapsed}
            />
            
            {/* Divider */}
            <div className={`h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 ${isCollapsed ? "mx-1" : ""}`} />
            
            <SidebarLink 
              to="/settings" 
              label="Settings" 
              icon={<Settings className="w-5 h-5" />} 
              isCollapsed={isCollapsed}
            />
          </nav>

          {/* Footer/User Section */}
          <div className={`p-4 border-t border-gray-200 ${isCollapsed ? "px-2" : ""}`}>
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
              {!isCollapsed && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4 text-gray-500" />
                  </button>
                </>
              )}
              {isCollapsed && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, label, icon, isCollapsed }) {
  const location = useLocation();
  const isActive = location.pathname === to || 
                   (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`
        relative flex items-center 
        px-3 py-2.5 rounded-lg
        font-medium
        transition-all duration-300 ease-out
        group
        ${isActive 
          ? 'bg-gradient-to-r from-green-50 to-blue-50 text-green-700 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-r-full" />
      )}
      
      {/* Icon */}
      <div className={`
        transition-all duration-300
        ${isActive 
          ? 'text-green-600 scale-110' 
          : 'text-gray-500 group-hover:text-gray-700 group-hover:scale-110'
        }
      `}>
        {icon}
      </div>
      
      {/* Label with slide-in animation */}
      {!isCollapsed && (
        <span className={`
          ml-3 transition-all duration-300
          ${isActive ? 'font-semibold' : ''}
          whitespace-nowrap overflow-hidden
        `}>
          {label}
        </span>
      )}
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {label}
        </div>
      )}
    </Link>
  );
}

export default Sidebar;