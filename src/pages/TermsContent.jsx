import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsContent = () => {
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
                onClick={() => navigate('/terms')}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Terms of Use - Detailed Content</h2>
          
          <div className="prose max-w-none space-y-8">
            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">1. Agreement to Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using the VALMO website and services, you agree to be bound by these Terms of Use 
                and all applicable laws and regulations. If you do not agree with any of these terms, you are 
                prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">2. Use License</h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Permission is granted to temporarily download one copy of the materials on VALMO's website 
                  for personal, non-commercial transitory viewing only. This is the grant of a license, not a 
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">3. Franchise Application Terms</h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  When submitting a franchise application through our platform:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>All information provided must be accurate and complete</li>
                  <li>You authorize us to verify the information provided</li>
                  <li>Application fees are non-refundable unless otherwise specified</li>
                  <li>We reserve the right to reject any application at our discretion</li>
                  <li>Approval does not guarantee franchise award</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">4. User Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in any fraudulent or deceptive practices</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibent text-gray-800 mb-4">5. Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The materials on VALMO's website are provided on an 'as is' basis. VALMO makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including without 
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
                or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitations of Liability</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In no event shall VALMO or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or 
                inability to use the materials on VALMO's website, even if VALMO or an authorized representative 
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">7. Privacy Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                of the services, to understand our practices.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">8. Modifications</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                VALMO may revise these terms of use at any time without notice. By using this website, you are 
                agreeing to be bound by the then current version of these Terms of Use.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">9. Governing Law</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of India, 
                and you irrevocably submit to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Information</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Use, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> <a href="mailto:support@valmodeliver.in" className="text-blue-600 hover:text-blue-800">support@valmodeliver.in</a></p>
                  <p><strong>Address:</strong> 3rd Floor, Wing-E, Helios Business Park, Kadubeesanahalli Village, Varthur Hobli, Outer Ring Road Bellandur, Bangalore, Karnataka, India, 560103</p>
                </div>
              </div>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Last Updated: January 2024
            </p>
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

export default TermsContent;
