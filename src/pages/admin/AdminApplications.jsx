/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminApplications = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Toggle Admin Dropdown
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Logout Function
  const logout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://valmobackend.onrender.com/getApplication"
      );
      setApplications(res.data.data || []);
      setFilteredApplications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to fetch applications ❌");
    } finally {
      setLoading(false);
    }
  };

  // Search and filter applications
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApplications(applications);
    } else {
      const q = searchTerm.toLowerCase();
      const filtered = applications.filter((application) => {
        const name = (application.fullName || "").toLowerCase();
        const email = (application.email || "").toLowerCase();
        const phone = String(application.mobileNumber || "").toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
      });
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  // Check if user is admin
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/multi-login");
      return;
    }
    fetchApplications();
  }, []);

  // Handle application actions
  const handleApprove = async (application) => {
    try {
      await axios.post(
        "https://valmobackend.onrender.com/application/approve",
        {
          email: application.email,
          name: application.name,
        }
      );
      alert("Application approved successfully ✅");
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application ❌");
    }
  };

  const handleReject = async (application) => {
    try {
      await axios.post("https://valmobackend.onrender.com/application/reject", {
        email: application.email,
        name: application.name,
      });
      alert("Application rejected successfully ✅");
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application ❌");
    }
  };

  const handleAgreement = async (application) => {
    try {
      await axios.post(
        "https://valmobackend.onrender.com/application/agreement",
        {
          email: application.email,
          name: application.name,
        }
      );
      alert("Agreement sent successfully ✅");
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Error sending agreement:", error);
      alert("Failed to send agreement ❌");
    }
  };

  // View Application
  const handleViewApplication = (applicationId) => {
    // Navigate to view application page
    navigate(`/view-application/${encodeURIComponent(applicationId)}`);
  };

  // Edit Application (placeholder - would typically open edit modal)
  const handleEditApplication = (application) => {
    // For now, we'll just show an alert - you can implement edit modal later
    alert("Edit functionality would open here");
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await axios.delete(
        `https://valmobackend.onrender.com/application/${applicationId}`
      );
      alert("Application deleted successfully ✅");
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application ❌");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-blue-600 shadow-md py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img
            src="https://registrations-meesho-valmo.in/valmologo.png"
            alt="VALMO"
            className="h-6 sm:h-8"
          />
<<<<<<< HEAD
          <h1 className="text-lg sm:text-xl font-bold">Application Management</h1>
=======
          <h1 className="text-lg sm:text-xl font-bold">
            Application Management
          </h1>
>>>>>>> 0310b2beb89ebe1928cf83f7e4d888208930260f
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Admin Menu Dropdown */}
          <div className="relative">
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
                </div>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-red-600 flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-1 sm:mr-2" />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6">
        {/* Search Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-blue-600">
              <i className="fas fa-file-alt mr-1 sm:mr-2" />
              All Applications
            </h2>
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full p-2 sm:p-3 pl-8 sm:pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-2 sm:left-3 top-2.5 sm:top-4 text-gray-400 text-xs sm:text-sm"></i>
            </div>
            <button
              onClick={fetchApplications}
              className="bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-green-600 flex items-center text-xs sm:text-sm"
            >
              <i className="fas fa-refresh mr-1 sm:mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Applications List Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-6 sm:py-8">
                <i className="fas fa-spinner fa-spin text-xl sm:text-2xl text-blue-600 mb-3 sm:mb-4"></i>
<<<<<<< HEAD
                <p className="text-gray-600 text-sm sm:text-base">Loading applications...</p>
=======
                <p className="text-gray-600 text-sm sm:text-base">
                  Loading applications...
                </p>
>>>>>>> 0310b2beb89ebe1928cf83f7e4d888208930260f
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <i className="fas fa-inbox text-3xl sm:text-4xl text-gray-400 mb-3 sm:mb-4"></i>
<<<<<<< HEAD
                <p className="text-gray-600 text-sm sm:text-base">No applications found</p>
=======
                <p className="text-gray-600 text-sm sm:text-base">
                  No applications found
                </p>
>>>>>>> 0310b2beb89ebe1928cf83f7e4d888208930260f
              </div>
            ) : (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Applicant Name
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Email ID
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Phone
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Status
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Submitted Date
                    </th>
                    <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-700 text-xs sm:text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                    >
<<<<<<< HEAD
                      <td className="py-2 px-3 sm:py-3 sm:px-4">{application.fullName}</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">{application.email}</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">{application.mobileNumber}</td>
=======
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.fullName}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.email}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.mobileNumber}
                      </td>
>>>>>>> 0310b2beb89ebe1928cf83f7e4d888208930260f
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        <span
                          className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
                            application.approved
                              ? "bg-green-100 text-green-800"
                              : application.rejected
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {application.approved
                            ? "Approved"
                            : application.rejected
                            ? "Rejected"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        {application.createdAt
                          ? new Date(application.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() =>
                              handleViewApplication(application.email)
                            }
                            className="text-blue-600 hover:text-blue-900 bg-gray-100 hover:bg-gray-200 p-1.5 sm:p-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                            title="View Application"
                          >
                            <i className="fas fa-eye text-xs sm:text-sm"></i>
                          </button>

                          <button
                            onClick={() => handleEditApplication(application)}
                            className="text-yellow-600 hover:text-yellow-900 bg-gray-100 hover:bg-gray-200 p-1.5 sm:p-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Edit Application"
                          >
                            <i className="fas fa-edit text-xs sm:text-sm"></i>
                          </button>

                          <button
                            onClick={() => handleDelete(application._id)}
                            className="text-red-600 hover:text-red-900 bg-gray-100 hover:bg-gray-200 p-1.5 sm:p-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Delete Application"
                          >
                            <i className="fas fa-trash text-xs sm:text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-4 sm:py-6 mt-6 sm:mt-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
<<<<<<< HEAD
              <p className="text-xs sm:text-sm">© 2025 Valmo. All rights reserved.</p>
=======
              <p className="text-xs sm:text-sm">
                © 2025 Valmo. All rights reserved.
              </p>
>>>>>>> 0310b2beb89ebe1928cf83f7e4d888208930260f
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
    </>
  );
};

export default AdminApplications;
