import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Track = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/track/${trackingId}`);
      const result = await response.json();
      
      if (response.ok) {
        setTrackingResult(result);
      } else {
        setError(result.message || 'Tracking ID not found');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Track Your Order</h2>
            <p className="text-gray-600 text-sm sm:text-base">Enter your tracking ID to check the status of your shipment</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking ID
                </label>
                <input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter your tracking ID"
                />
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Tracking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search mr-2"></i>
                    Track Order
                  </>
                )}
              </button>
            </form>
          </div>

          {trackingResult && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Tracking Results</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Tracking ID</p>
                    <p className="font-semibold text-sm sm:text-base">{trackingResult.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${trackingResult.status === 'Delivered' ? 'bg-green-100 text-green-800' : trackingResult.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {trackingResult.status}
                    </span>
                  </div>
                </div>

                {trackingResult.timeline && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Tracking Timeline</h4>
                    <div className="space-y-3">
                      {trackingResult.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{event.status}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{event.location}</p>
                            <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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

export default Track;
