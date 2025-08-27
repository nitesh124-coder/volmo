import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/valmo-logo.svg" 
              alt="VALMO" 
              className="h-6 sm:h-8"
              width="119"
              height="32"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Home</a>
            <a href="/track" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Track Order</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">About</a>
            <button
              onClick={() => navigate('/multi-login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/client-login')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              Client Login
            </button>
          </nav>
          {/* Mobile Menu Button */}`
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={toggleMenu}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 pb-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm">Home</a>
              <a href="/track" className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm">Track Order</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm">About</a>
              <button
                onClick={() => {
                  navigate('/multi-login');
                  setIsMenuOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 w-full text-sm"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/client-login');
                  setIsMenuOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 w-full text-sm"
              >
                Client Login
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
