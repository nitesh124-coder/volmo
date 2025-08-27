import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Terms of Use</h2>
          
          <div className="prose max-w-none">
            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                By accessing and using this website, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please 
                do not use this service.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Use License</h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                Permission is granted to temporarily download one copy of the materials on VALMO's 
                website for personal, non-commercial transitory viewing only. This is the grant of 
                a license, not a transfer of title.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                The materials on VALMO's website are provided on an 'as is' basis. VALMO makes no 
                warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                including without limitation, implied warranties or conditions of merchantability, 
                fitness for a particular purpose, or non-infringement of intellectual property or 
                other violation of rights.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Limitations</h3>
              <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                In no event shall VALMO or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising 
                out of the use or inability to use the materials on VALMO's website.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Contact Information</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                For any questions regarding these terms, please contact us at 
                <a href="mailto:support@valmodeliver.in" className="text-blue-600 hover:text-blue-800"> support@valmodeliver.in</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg" 
            alt="VALMO" 
            className="h-6 sm:h-8 mx-auto mb-3 sm:mb-4"
          />
          <p className="text-xs sm:text-sm">© 2024 VALMO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
