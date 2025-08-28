/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalAgents: 0,
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = () => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/multi-login");
      return;
    }

    const userId = localStorage.getItem("userId");
    setAdminData({ userId });
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const result = await response.json();

      if (response.ok) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
                alt="VALMO"
                className="h-6 sm:h-8 filter invert"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                VALMO Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm"
              >
                <i className="fas fa-sign-out-alt mr-1 sm:mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage applications, agents, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-xl sm:text-2xl text-blue-600"></i>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Applications
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-xl sm:text-2xl text-yellow-600"></i>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Pending Review
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats.pendingApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-xl sm:text-2xl text-green-600"></i>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">Approved</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats.approvedApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-xl sm:text-2xl text-purple-600"></i>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Active Agents
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats.totalAgents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/admin-applications")}
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-file-alt text-xl sm:text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Manage Applications
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Review and process franchise applications
              </p>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/admin-agent-management")}
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-users text-xl sm:text-2xl text-green-600"></i>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Agent Management
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Manage agents and their permissions
              </p>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/admin-bank-details")}
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-university text-xl sm:text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Bank Details
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Manage payment and bank information
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-chart-bar text-xl sm:text-2xl text-red-600"></i>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Reports
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                View detailed reports and analytics
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-cog text-xl sm:text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Settings
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                System configuration and settings
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
