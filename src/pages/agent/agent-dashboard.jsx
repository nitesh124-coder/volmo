/** @format */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [bankDetailApplication, setBankDetailApplication] = useState(null);
  const [sendingBankDetails, setSendingBankDetails] = useState(false);
  const [availableBanks, setAvailableBanks] = useState([]);

  // Action loading states to prevent double submissions
  const [approvingApplications, setApprovingApplications] = useState(new Set());
  const [rejectingApplications, setRejectingApplications] = useState(new Set());
  const [sendingAgreements, setSendingAgreements] = useState(new Set());

  useEffect(() => {
    checkAuth();
    loadAvailableBanks();
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredApplications]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApplications(applications);
    } else {
      const q = searchTerm.toLowerCase();
      const filtered = applications.filter((application) => {
        const n = (application.name || "").toLowerCase();
        const p = String(application.phoneNumber || "").toLowerCase();
        const l = (application.location || "").toLowerCase();
        const e = (application.email || "").toLowerCase();
        return n.includes(q) || p.includes(q) || l.includes(q) || e.includes(q);
      });
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".mobile-actions-dropdown") &&
        !event.target.closest('[class*="fa-ellipsis-h"]')
      ) {
        document
          .querySelectorAll(".mobile-actions-dropdown")
          .forEach((dropdown) => {
            dropdown.classList.remove("block");
          });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const checkAuth = () => {
    const session = localStorage.getItem("agentSession");
    if (!session) {
      navigate("/agent-login");
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      setAgent(parsedSession);
    } catch (error) {
      console.error("Session parsing error:", error);
      navigate("/agent-login");
    }
  };

  const loadApplications = async () => {
    try {
      const response = await axios.get(
        `https://valmobackend.onrender.com/agent/applications/${agent.agentId}`
      );
      setApplications(response.data);
      setFilteredApplications(response.data);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const loadActivities = () => {
    // In a real app, this would fetch actual activities from the backend
    const mockActivities = [
      {
        id: 1,
        action: "Application Submitted",
        description: "New application from Rajesh Sharma",
        time: "2 hours ago",
      },
      {
        id: 2,
        action: "Application Approved",
        description: "You approved Priya Kumari's application",
        time: "1 day ago",
      },
      {
        id: 3,
        action: "Agreement Sent",
        description: "Franchise agreement sent to Amit Patel",
        time: "2 days ago",
      },
    ];
    setActivities(mockActivities);
  };

  const loadAvailableBanks = async () => {
    try {
      const response = await axios.get(
        "https://valmobackend.onrender.com/bank-details"
      );
      setAvailableBanks(response.data.data || []);
    } catch (error) {
      console.error("Error loading banks:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agentSession");
    navigate("/agent-login");
  };

  const handleApprove = async (applicationId) => {
    // Add to loading set
    setApprovingApplications((prev) => new Set(prev).add(applicationId));

    try {
      await axios.put(
        `https://valmobackend.onrender.com/agent/applications/${applicationId}/approve`
      );
      // Refresh applications
      loadApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    } finally {
      // Remove from loading set
      setApprovingApplications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleReject = async (applicationId) => {
    // Add to loading set
    setRejectingApplications((prev) => new Set(prev).add(applicationId));

    try {
      await axios.put(
        `https://valmobackend.onrender.com/agent/applications/${applicationId}/reject`
      );
      // Refresh applications
      loadApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application");
    } finally {
      // Remove from loading set
      setRejectingApplications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleSendAgreement = async (applicationId) => {
    // Add to loading set
    setSendingAgreements((prev) => new Set(prev).add(applicationId));

    try {
      await axios.post(
        `https://valmobackend.onrender.com/agent/applications/${applicationId}/send-agreement`
      );
      // Refresh applications
      loadApplications();
      alert("Agreement sent successfully!");
    } catch (error) {
      console.error("Error sending agreement:", error);
      alert("Failed to send agreement");
    } finally {
      // Remove from loading set
      setSendingAgreements((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleSendBankDetails = async (applicationId, bankId) => {
    setSendingBankDetails(true);
    try {
      await axios.post(
        `https://valmobackend.onrender.com/agent/applications/${applicationId}/send-bank-details`,
        { bankId }
      );
      alert("Bank details sent successfully!");
      setShowBankDetailsModal(false);
      setBankDetailApplication(null);
    } catch (error) {
      console.error("Error sending bank details:", error);
      alert("Failed to send bank details");
    } finally {
      setSendingBankDetails(false);
    }
  };

  const toggleMobileActions = (applicationId) => {
    const dropdown = document.getElementById(`mobile-actions-${applicationId}`);
    if (dropdown) {
      dropdown.classList.toggle("block");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/images/valmo-logo.svg"
              alt="VALMO"
              className="h-8"
              width="158"
              height="42"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {agent?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agent Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your franchise applications and activities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-file-alt text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-clock text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      applications.filter(
                        (app) => !app.approved && !app.rejected
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-check-circle text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter((app) => app.approved).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-times-circle text-red-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter((app) => app.rejected).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <i className="fas fa-download"></i>
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Applications
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applicant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {application.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.mobileNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.residentialCity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewApplication(application)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {!application.approved && !application.rejected && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApprove(application._id)
                                  }
                                  disabled={approvingApplications.has(
                                    application._id
                                  )}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                >
                                  {approvingApplications.has(
                                    application._id
                                  ) ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-check"></i>
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleReject(application._id)
                                  }
                                  disabled={rejectingApplications.has(
                                    application._id
                                  )}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                  {rejectingApplications.has(
                                    application._id
                                  ) ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-times"></i>
                                  )}
                                </button>
                              </>
                            )}
                            {application.approved &&
                              !application.agreementSent && (
                                <button
                                  onClick={() =>
                                    handleSendAgreement(application._id)
                                  }
                                  disabled={sendingAgreements.has(
                                    application._id
                                  )}
                                  className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                >
                                  {sendingAgreements.has(application._id) ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    <i className="fas fa-file-contract"></i>
                                  )}
                                </button>
                              )}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  toggleMobileActions(application._id)
                                }
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <i className="fas fa-ellipsis-h"></i>
                              </button>
                              <div
                                id={`mobile-actions-${application._id}`}
                                className="mobile-actions-dropdown hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                              >
                                <button
                                  onClick={() => {
                                    setBankDetailApplication(application);
                                    setShowBankDetailsModal(true);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Send Bank Details
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  View Documents
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Application Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedApplication.fullName}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedApplication.email}
                    </div>
                    <div>
                      <strong>Phone:</strong>{" "}
                      {selectedApplication.mobileNumber}
                    </div>
                    <div>
                      <strong>Location:</strong>{" "}
                      {selectedApplication.residentialCity}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <strong>Business Name:</strong>{" "}
                      {selectedApplication.businessName}
                    </div>
                    <div>
                      <strong>Investment Capacity:</strong>{" "}
                      {selectedApplication.investmentCapacity}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Status</h4>
                  <div className="mt-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedApplication.approved
                          ? "bg-green-100 text-green-800"
                          : selectedApplication.rejected
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedApplication.approved
                        ? "Approved"
                        : selectedApplication.rejected
                        ? "Rejected"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Bank Details Modal */}
      {showBankDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Send Bank Details
                </h3>
                <button
                  onClick={() => {
                    setShowBankDetailsModal(false);
                    setBankDetailApplication(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Select a bank to send details to{" "}
                  {bankDetailApplication?.fullName}:
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableBanks.map((bank) => (
                    <div
                      key={bank._id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {bank.bankName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {bank.accountHolderName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {bank.accountNumber}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleSendBankDetails(
                              bankDetailApplication._id,
                              bank._id
                            )
                          }
                          disabled={sendingBankDetails}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                        >
                          {sendingBankDetails ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            "Send"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img
                src="/images/valmo-logo.svg"
                alt="VALMO"
                className="h-10 mb-4"
                width="190"
                height="50"
              />
              <p className="text-sm">
                India's Leading Logistics Network. Join our franchise and be part
                of the fastest-growing logistics company in India.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/track"
                    className="hover:text-white transition-colors"
                  >
                    Track Order
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <i className="fas fa-map-marker-alt mt-1 text-blue-400"></i>
                  <span>
                    3rd Floor, Wing-E, Helios Business Park, Kadubeesanahalli
                    Village, Varthur Hobli, Outer Ring Road Bellandur,
                    Bangalore, Karnataka, India, 560103
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-envelope text-blue-400"></i>
                  <span>support@valmodeliver.in</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs">
            <p>© 2024 VALMO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgentDashboard;