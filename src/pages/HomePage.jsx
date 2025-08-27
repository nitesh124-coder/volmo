import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Text */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  We are <span className="text-blue-600">Valmo</span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
                  India's most reliable and lowest cost logistics service partner
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Join India's Leading Logistics Network. Partner with VALMO and become part of India's fastest-growing logistics franchise.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-truck text-2xl text-blue-600 mr-3"></i>
                    <h4 className="text-lg font-bold text-gray-800">Reliable Service</h4>
                  </div>
                  <p className="text-gray-600">Dependable logistics solutions for your business needs</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-shield-alt text-2xl text-green-600 mr-3"></i>
                    <h4 className="text-lg font-bold text-gray-800">Secure Delivery</h4>
                  </div>
                  <p className="text-gray-600">Safe and secure handling of all your shipments</p>
                </div>
              </div>
            </div>

            {/* Right Content - Truck Image */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <img 
                  src="/images/truck_image.png" 
                  alt="VALMO Logistics Truck" 
                  className="w-full h-auto max-w-lg mx-auto lg:max-w-none"
                  width="650"
                  height="500"
                />
              </div>
              {/* Decorative blur circles */}
              <div className="absolute -top-4 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose VALMO?</h3>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">Discover what makes VALMO the preferred choice for logistics solutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-2xl text-center hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-shipping-fast text-3xl text-white"></i>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-6">Smart Logistics Network</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Advanced logistics platform with intelligent routing technology designed for efficient delivery across major Indian cities.</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-2xl text-center hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-rocket text-3xl text-white"></i>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-6">Complete Business Support</h4>
              <p className="text-gray-600 text-lg leading-relaxed">360° business support including training, marketing, technology platform, and dedicated relationship manager.</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 lg:p-10 shadow-2xl text-center hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-chart-line text-3xl text-white"></i>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-6">Growth Potential</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Scalable business model with strong growth potential and multiple revenue opportunities in the expanding logistics market.</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Success Stories</h3>
            <p className="text-xl text-gray-600">Hear from our successful franchise partners</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 lg:p-12 border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  RS
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-800">Rajesh Sharma</h5>
                  <p className="text-blue-600 font-medium">Delhi Partner</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg italic leading-relaxed">
                "VALMO's innovative platform helped me establish my logistics business efficiently. The technology and support made all the difference!"
              </p>
              <div className="flex text-yellow-400 mt-4">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 lg:p-12 border border-green-200">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  PK
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-800">Priya Kumari</h5>
                  <p className="text-green-600 font-medium">Mumbai Partner</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg italic leading-relaxed">
                "Starting with VALMO was the right choice. Their platform and guidance helped me build a sustainable logistics business from the ground up."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img 
                  src="/images/valmo-logo.svg" 
                  alt="VALMO" 
                  className="h-12 mb-4"
                  width="190"
                  height="50"
                />
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Fashnear Technologies Private Limited</h4>
                <div className="flex items-start space-x-3">
                  <i className="fas fa-map-marker-alt text-blue-400 mt-1"></i>
                  <div className="text-sm">
                    <p>3rd Floor, Wing-E, Helios Business Park,</p>
                    <p>Kadubeesanahalli Village, Varthur Hobli,</p>
                    <p>Outer Ring Road Bellandur, Bangalore,</p>
                    <p>Karnataka, India, 560103</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-envelope text-blue-400"></i>
                  <span>support@valmodeliver.in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <div><a href="/about" className="hover:text-white transition-colors">About Us</a></div>
                <div><a href="/track" className="hover:text-white transition-colors">Track Order</a></div>
                <div><a href="/form" className="hover:text-white transition-colors">Apply Now</a></div>
              </div>
            </div>

            {/* Legal */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <div><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></div>
                <div><a href="/terms" className="hover:text-white transition-colors">Terms of Use</a></div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-600 mt-8 pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Copyright © 2024 VALMO. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
