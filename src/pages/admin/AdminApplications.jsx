/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://valmobackend.onrender.com/applications"
      );
      const data = await response.json();
      setApplications(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch applications");
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications based on search and filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !app.approved && !app.rejected) ||
      (filterStatus === "approved" && app.approved) ||
      (filterStatus === "rejected" && app.rejected);
    return matchesSearch && matchesFilter;
  });

  // Handle application approval
  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `https://valmobackend.onrender.com/applications/${id}/approve`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  // Handle application rejection
  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `https://valmobackend.onrender.com/applications/${id}/reject`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/images/valmo-logo.svg"
              alt="VALMO"
              className="h-6 sm:h-8"
            />
            <h1 className="text-lg sm:text-xl font-bold">
              Application Management
            </h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Admin Menu Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleDropdown}
                className="text-white hover:text-blue-200 flex items-center text-sm"
              >
                <i className="fas fa-bars mr-1 sm:mr-2" />
                Menu
                <i className="fas fa-chevron-down ml-1 sm:ml-2" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 sm:mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <a
                      href="/admin/admin-home"
                      className="block px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-home mr-1 sm:mr-2" />
                      Home
                    </a>
                    <a
                      href="/admin/admin-agent-management"
                      className="block px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-users mr-1 sm:mr-2" />
                      Add Agent
                    </a>
                    <a
                      href="/admin/admin-applications"
                      className="block px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 bg-blue-50 flex items-center"
                    >
                      <i className="fas fa-file-alt mr-1 sm:mr-2" />
                      Applications
                    </a>
                    <a
                      href="/admin/admin-bank-details"
                      className="block px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-university mr-1 sm:mr-2" />
                      Bank Details
                    </a>
                    <button
                      onClick={() => {
                        localStorage.removeItem("userType");
                        localStorage.removeItem("userId");
                        navigate("/");
                      }}
                      className="w-full text-left px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-1 sm:mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Application List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-circle text-3xl text-red-600 mb-3"></i>
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchApplications}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
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
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
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
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/application/${app._id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {!app.approved && !app.rejected && (
                              <>
                                <button
                                  onClick={() => handleApprove(app._id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  onClick={() => handleReject(app._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} VALMO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminApplications;