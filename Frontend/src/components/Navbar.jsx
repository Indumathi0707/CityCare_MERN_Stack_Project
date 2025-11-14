import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const getAvatarInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-city text-blue-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold">CityCare</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`hidden md:block px-3 py-2 rounded-lg transition duration-200 ${
                isActiveRoute('/') 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <i className="fas fa-home mr-2"></i>
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/report" 
                  className={`hidden md:block px-3 py-2 rounded-lg transition duration-200 ${
                    isActiveRoute('/report') 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <i className="fas fa-plus-circle mr-2"></i>
                  Report Issue
                </Link>
                <Link 
                  to="/my-issues" 
                  className={`hidden md:block px-3 py-2 rounded-lg transition duration-200 ${
                    isActiveRoute('/my-issues') 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <i className="fas fa-list-alt mr-2"></i>
                  My Issues
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`hidden md:block px-3 py-2 rounded-lg transition duration-200 ${
                      isActiveRoute('/admin') 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <i className="fas fa-cog mr-2"></i>
                    Admin
                  </Link>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition duration-200"
                  >
                    <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-sm font-semibold">
                      {getAvatarInitials(user.name)}
                    </div>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-blue-600 font-medium capitalize">{user.role}</p>
                      </div>
                      
                      <Link 
                        to="/my-issues" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="fas fa-list-alt mr-2 w-4"></i>
                        My Issues
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          <i className="fas fa-cog mr-2 w-4"></i>
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <i className="fas fa-sign-out-alt mr-2 w-4"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-lg transition duration-200 ${
                    isActiveRoute('/login') 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-semibold"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden border-t border-white border-opacity-20 py-2">
            <div className="flex justify-around">
              <Link 
                to="/" 
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition duration-200 ${
                  isActiveRoute('/') ? 'text-blue-200' : ''
                }`}
              >
                <i className="fas fa-home mb-1"></i>
                <span className="text-xs">Home</span>
              </Link>
              <Link 
                to="/report" 
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition duration-200 ${
                  isActiveRoute('/report') ? 'text-blue-200' : ''
                }`}
              >
                <i className="fas fa-plus-circle mb-1"></i>
                <span className="text-xs">Report</span>
              </Link>
              <Link 
                to="/my-issues" 
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition duration-200 ${
                  isActiveRoute('/my-issues') ? 'text-blue-200' : ''
                }`}
              >
                <i className="fas fa-list-alt mb-1"></i>
                <span className="text-xs">My Issues</span>
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`flex flex-col items-center px-2 py-1 rounded-lg transition duration-200 ${
                    isActiveRoute('/admin') ? 'text-blue-200' : ''
                  }`}
                >
                  <i className="fas fa-cog mb-1"></i>
                  <span className="text-xs">Admin</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;