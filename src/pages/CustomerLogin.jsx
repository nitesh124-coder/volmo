/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showMessage = (message, type) => {
    setMessage({ text: message, type });
    if (type === "success") {
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userId, password } = formData;

    if (!userId || !password) {
      showMessage("Please enter both email and password", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Backend URL
      const response = await fetch(
        `https://valmobackend.onrender.com/customer/credentials?email=${userId}`
      );
      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Customer not found", "error");
      } else {
        // Check password
        if (password === data.password) {
          showMessage("Login successful! Redirecting...", "success");

          // Store session
          localStorage.setItem(
            "customerSession",
            JSON.stringify({
              customerId: data.customerId,
              email: userId,
              loginTime: new Date().toISOString(),
            })
          );

          // Redirect to customer dashboard with ID
          setTimeout(() => navigate(`/customer-dashboard/${userId}`), 500);
        } else {
          showMessage("Incorrect password", "error");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      showMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      }}
    >
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div
          className="hidden lg:flex lg:w-1/2 items-center justify-center p-4 sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 58, 138, 0.1) 100%)",
          }}
        >
          <div className="relative">
            <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-16 h-16 sm:w-24 sm:h-24 bg-blue-300 rounded-full opacity-30"></div>
            <img
              src="/images/truck_image.png"
              alt="VALMO Truck"
              className="max-w-full h-auto relative z-10"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block bg-green-600 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <img
                  src="/images/valmo-logo.svg"
                  alt="VALMO Logo"
                  className="h-6 sm:h-8"
                />
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Welcome back !!</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sign In</h2>
            </div>

            {message.text && (
              <div
                className={`text-center py-3 mb-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="userId"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base"
                  style={{
                    border: "1px solid #d1fae5",
                    backgroundColor: "#f0fdf4",
                  }}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base"
                  style={{
                    border: "1px solid #d1fae5",
                    backgroundColor: "#f0fdf4",
                  }}
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 text-base sm:text-lg shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : "Sign In"}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                Can't Find Your confirmation Details?
              </p>
              <p className="text-xs text-gray-500">
                For your account password contact your support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
