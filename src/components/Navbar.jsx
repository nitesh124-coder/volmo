import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userType = localStorage.getItem("userType");
    setUserType(userType);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    localStorage.removeItem("customerSession");
    setUserType(null);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/valmo-logo.svg" 
              alt="VALMO" 
              className="h-6 sm:h-8 w-auto"
              width="119"
              height="32"
            />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <a href="/" className="text-white hover:text-blue-200 transition-colors text-sm font-medium">Home</a>
            <a href="/track" className="text-white hover:text-blue-200 transition-colors text-sm font-medium">Track Order</a>
            <a href="/about" className="text-white hover:text-blue-200 transition-colors text-sm font-medium">About</a>
            {userType ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/multi-login')}
                  className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/client-login')}
                  className="bg-white hover:bg-gray-100 text-green-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  Client Login
                </button>
              </>
            )}
          </nav>
          
          {/* Mobile Navigation with visible login buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            {!userType ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate('/multi-login')}
                  className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 text-xs"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/client-login')}
                  className="bg-white hover:bg-gray-100 text-green-600 font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 text-xs"
                >
                  Client
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 text-xs flex items-center"
              >
                <i className="fas fa-sign-out-alt mr-1"></i>Logout
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button className="p-2 rounded-md hover:bg-blue-500 border border-blue-400" onClick={toggleMenu} aria-label="Toggle menu">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Always render but conditionally show */}
        <div className={`md:hidden mt-2 pb-4 transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-3 pt-2 border-t border-blue-500">
            <a href="/" className="text-white hover:text-blue-200 transition-colors py-2 text-sm font-medium">Home</a>
            <a href="/track" className="text-white hover:text-blue-200 transition-colors py-2 text-sm font-medium">Track Order</a>
            <a href="/about" className="text-white hover:text-blue-200 transition-colors py-2 text-sm font-medium">About</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
