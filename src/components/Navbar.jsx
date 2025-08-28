import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
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
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Home</a>
            <a href="/track" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Track Order</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">About</a>
            <button
              onClick={() => navigate('/multi-login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/client-login')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Client Login
            </button>
          </nav>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100 border border-gray-200" onClick={toggleMenu}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu - Always render but conditionally show */}
        <div className={`md:hidden mt-2 pb-4 transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-3 pt-2 border-t border-gray-100">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm font-medium">Home</a>
            <a href="/track" className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm font-medium">Track Order</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors py-2 text-sm font-medium">About</a>
            <div className="flex flex-col space-y-2 pt-2">
              <button
                onClick={() => {
                  navigate('/multi-login');
                  setIsMenuOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 w-full text-sm"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/client-login');
                  setIsMenuOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 w-full text-sm"
              >
                Client Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
