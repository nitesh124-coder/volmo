/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MultiLogin = () => {
  const navigate = useNavigate();
  const [currentLoginType, setCurrentLoginType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Show alert messages
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // ✅ Select login type
  const showLoginForm = (loginType) => {
    setCurrentLoginType(loginType);
    setShowForm(true);
    setFormData({ userId: "", password: "" });
    setMessage({ text: "", type: "" });
  };

  const showLoginTypeSelection = () => {
    setShowForm(false);
    setCurrentLoginType("");
  };

  // ✅ Handle input
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.password) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Admin Hardcoded Login
      if (
        currentLoginType === "admin" &&
        formData.userId === "admin@gmail.com" &&
        formData.password === "admin@gmail.com"
      ) {
        showMessage("Login successful! Redirecting...", "success");

        localStorage.setItem("userType", "admin");
        localStorage.setItem("userId", "admin@gmail.com");

        setTimeout(() => {
          navigate("/admin/admin-home");
        }, 1500);

        return; // ✅ No API call for admin
      }

      // ✅ Agent Login (API)
      let endpoint = "https://valmobackend.onrender.com/Agentlogin";
      let requestBody = {
        email: formData.userId, // ✅ email ke form se login
        password: formData.password,
        userType: currentLoginType,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      if (result.success || res.ok) {
        showMessage("Login successful! Redirecting...", "success");

        localStorage.setItem("userType", currentLoginType);
        localStorage.setItem("userId", result.userId);

        if (currentLoginType === "agent" && result.agentId) {
          localStorage.setItem("agentId", result.agentId);
        }

        if (currentLoginType === "admin") {
          setTimeout(() => {
            navigate("/admin/admin-home");
          }, 1500);
        } else if (currentLoginType === "agent") {
          setTimeout(() => {
            navigate("/agent/agent-dashboard");
          }, 1500);
        }
      } else {
        showMessage(result.message || "Invalid credentials", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Title depending on type
  const getLoginTitle = () => {
    switch (currentLoginType) {
      case "admin":
        return "Admin Login";
      case "agent":
        return "Agent Login";
      default:
        return "Login";
    }
  };

  // ✅ Labels depending on type
  const getUserIdLabel = () => {
    switch (currentLoginType) {
      case "admin":
        return "Email";
      case "agent":
        return "Email"; // ✅ Updated: agent login with email
      default:
        return "User ID";
    }
  };

  const getUserIdPlaceholder = () => {
    switch (currentLoginType) {
      case "admin":
        return "Enter your Email";
      case "agent":
        return "Enter your Email"; // ✅ Updated: no Unique ID
      default:
        return "Enter your User ID";
    }
  };

  const getPasswordPlaceholder = () => {
    return "Enter your Password";
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* LEFT SIDE IMAGE */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-50 p-4">
            <img
              src="/images/truck_image.png"
              alt="Login Illustration"
              className="max-w-[80%] max-h-[80%] object-contain"
            />
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center bg-gradient-to-b from-gray-50 to-white">
            {/* Login Type Selection */}
            {!showForm && (
              <div className="space-y-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-4">
                  Select Login Type
                </h2>

                <button
                  onClick={() => showLoginForm("admin")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition flex items-center justify-center space-x-2 text-base sm:text-lg shadow-md"
                >
                  <i className="fas fa-user-shield text-lg"></i>
                  <span>Admin Login</span>
                </button>

                <button
                  onClick={() => showLoginForm("agent")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition flex items-center justify-center space-x-2 text-base sm:text-lg shadow-md"
                >
                  <i className="fas fa-user-tie text-lg"></i>
                  <span>Agent Login</span>
                </button>
              </div>
            )}

            {/* Login Form */}
            {showForm && (
              <div>
                <div className="flex items-center mb-4">
                  <button
                    onClick={showLoginTypeSelection}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>Back
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mb-2">
                  {getLoginTitle()}
                </h2>
                <p className="text-gray-500 text-center mb-4 sm:mb-6 text-sm">
                  Please enter your credentials
                </p>

                {/* Alert messages */}
                {message.text && (
                  <div
                    className={`text-center py-2 mb-4 rounded text-sm ${
                      message.type === "error"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="userId" className="block mb-1 font-medium text-sm">
                      {getUserIdLabel()}
                    </label>
                    <input
                      type="text"
                      id="userId"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      placeholder={getUserIdPlaceholder()}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-1 font-medium text-sm"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      placeholder={getPasswordPlaceholder()}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition text-base font-medium shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </>
                    ) : "Login"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-4 sm:py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <i className="fas fa-envelope text-blue-400 text-xs sm:text-sm"></i>
                <span className="text-xs sm:text-sm">support@valmodeliver.in</span>
              </div>
              <p className="text-xs">© 2025 Valmo. All rights reserved.</p>
            </div>
            <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MultiLogin;