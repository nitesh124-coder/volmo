import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/valmo-logo.svg" 
              alt="VALMO" 
              className="h-8"
              width="119"
              height="32"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base">Home</a>
            <a href="/track" className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base">Track Order</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base">About</a>
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
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
