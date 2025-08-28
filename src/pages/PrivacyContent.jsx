import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyContent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg" 
                alt="VALMO" 
                className="h-8 filter invert"
              />
              <h1 className="text-2xl font-bold text-gray-800">VALMO Logistics</h1>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/privacy')}
                className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>Back
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-home mr-2"></i>Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy - Detailed Content</h2>
          
          <div className="prose max-w-none space-y-8">
            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Privacy Policy describes how Fashnear Technologies Private Limited ("VALMO", "we", "us", or "our") 
                collects, uses, and shares information about you when you use our website, mobile applications, and services 
                (collectively, the "Services").
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">2.1 Information You Provide</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Personal information (name, email, phone number, address)</li>
                    <li>Business information for franchise applications</li>
                    <li>Financial information for payment processing</li>
                    <li>Documents and photos uploaded during application process</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">2.2 Information We Collect Automatically</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Device information and identifiers</li>
                    <li>Usage data and analytics</li>
                    <li>Location information (with your consent)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Process and evaluate franchise applications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important updates and notifications</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations and prevent fraud</li>
                <li>Marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">4. Information Sharing and Disclosure</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>With service providers who assist in our operations</li>
                <li>For legal compliance and law enforcement</li>
                <li>In connection with business transfers or mergers</li>
                <li>With your explicit consent</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Security</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, no method 
                of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information (subject to legal requirements)</li>
                <li>Object to processing of your information</li>
                <li>Data portability</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact Us</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> <a href="mailto:support@valmodeliver.in" className="text-blue-600 hover:text-blue-800">support@valmodeliver.in</a></p>
                  <p><strong>Address:</strong> 3rd Floor, Wing-E, Helios Business Park, Kadubeesanahalli Village, Varthur Hobli, Outer Ring Road Bellandur, Bangalore, Karnataka, India, 560103</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">8. Updates to This Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Last Updated: January 2024
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg" 
            alt="VALMO" 
            className="h-8 mx-auto mb-4"
          />
          <p className="text-sm">© 2024 VALMO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyContent;
