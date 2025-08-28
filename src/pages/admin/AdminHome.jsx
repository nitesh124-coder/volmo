/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalAgents: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch(
        "https://valmobackend.onrender.com/admin/stats"
      );
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent applications
      const appsResponse = await fetch(
        "https://valmobackend.onrender.com/admin/recent-applications"
      );
      const appsData = await appsResponse.json();
      setRecentApplications(appsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src="/images/valmo-logo.svg"
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
                <p className="text-xs sm:text-sm text-gray-600">
                  Approved Applications
                </p>
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
                <p className="text-xs sm:text-sm text-gray-600">Total Agents</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {stats.totalAgents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Recent Applications
              </h3>
              <button
                onClick={() => navigate("/admin/admin-applications")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-file-alt text-2xl text-gray-400 mb-2"></i>
                <p className="text-gray-600">No recent applications</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applicant
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applied On
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {app.fullName}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{app.email}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(app.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.approved
                                ? "bg-green-100 text-green-800"
                                : app.rejected
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {app.approved
                              ? "Approved"
                              : app.rejected
                              ? "Rejected"
                              : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/admin/admin-applications")}
                className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-alt text-blue-600"></i>
                </div>
                <div className="ml-4 text-left">
                  <h4 className="font-medium text-gray-900">Manage Applications</h4>
                  <p className="text-sm text-gray-600">
                    Review and process franchise applications
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/admin/admin-agent-management")}
                className="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-purple-600"></i>
                </div>
                <div className="ml-4 text-left">
                  <h4 className="font-medium text-gray-900">Manage Agents</h4>
                  <p className="text-sm text-gray-600">
                    Add and manage franchise agents
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/admin/admin-bank-details")}
                className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-university text-green-600"></i>
                </div>
                <div className="ml-4 text-left">
                  <h4 className="font-medium text-gray-900">Bank Details</h4>
                  <p className="text-sm text-gray-600">
                    Manage bank account information
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} VALMO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminHome;