import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">About VALMO</h2>
            <p className="text-base sm:text-xl text-gray-600">India's Leading Logistics Network</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                VALMO is committed to revolutionizing India's logistics landscape by providing 
                reliable, efficient, and cost-effective delivery solutions. We empower entrepreneurs 
                through our comprehensive franchise model, creating opportunities for growth and success.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Our network spans across major cities and towns, ensuring seamless connectivity 
                and timely deliveries for businesses and individuals alike.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="/images/truck_image.png" 
                alt="VALMO Logistics" 
                className="w-full max-w-xs sm:max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-shipping-fast text-xl sm:text-2xl text-blue-600"></i>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Fast Delivery</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Quick and reliable delivery services across India</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-network-wired text-xl sm:text-2xl text-green-600"></i>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Wide Network</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Extensive network covering major cities and towns</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg md:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-handshake text-xl sm:text-2xl text-purple-600"></i>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Franchise Support</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Complete support and training for franchise partners</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Join Our Network?</h3>
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
              Become a part of India's fastest-growing logistics franchise and build your successful business.
            </p>
            <button 
              onClick={() => navigate('/form')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
            >
              Apply Now
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="/images/valmo-logo.svg" 
            alt="VALMO" 
            className="h-6 sm:h-8 mx-auto mb-3 sm:mb-4"
          />
          <p className="text-xs sm:text-sm">© 2024 VALMO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
