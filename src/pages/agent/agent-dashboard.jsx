/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://valmobackend.onrender.com"; // जरूरत हो तो .env से ले लेना

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState(null);
  const [applications, setApplications] = useState([]);
  console.log("application", applications);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    pincode: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    pincode: "",
  });
  const [editLocation, setEditLocation] = useState("");
  const [editSelectedLocations, setEditSelectedLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showCopyLink, setShowCopyLink] = useState(false);
  const [proposalLink, setProposalLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    checkAuth();
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const checkAuth = () => {
    const userType = localStorage.getItem("userType");
    if (userType !== "agent") {
      navigate("/multi-login");
      return;
    }
    const userId = localStorage.getItem("userId");
    setAgentData({ userId });
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/application`);
      const result = await response.json();

      if (response.ok && result.success) {
        const applicationsWithDetails = (result.data || []).map((app) => ({
          ...app,
          phoneNumber: app.phoneNumber || "N/A",
          location: app.location || "N/A",
          approved: !!app.approved,
          rejected: !!app.rejected,
          agreementSent: !!app.agreementSent,
        }));
        setApplications(applicationsWithDetails);
        setFilteredApplications(applicationsWithDetails);
      } else {
        console.error("Failed to load applications:", result?.message);
      }
    } catch (err) {
      console.error("Error loading applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Helpers ----------
  const callApi = async (url, payload) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      const msg = data?.message || "Request failed";
      throw new Error(msg);
    }
    return data;
  };

  const optimisticUpdate = (email, name, patch) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.email === email && app.name === name ? { ...app, ...patch } : app
      )
    );
    setFilteredApplications((prev) =>
      prev.map((app) =>
        app.email === email && app.name === name ? { ...app, ...patch } : app
      )
    );
  };

  // ---------- Actions (email + name based) ----------
  const handleApprove = async (appObj) => {
    // UI optimistic
    optimisticUpdate(appObj.email, appObj.name, {
      approved: true,
      rejected: false,
    });

    try {
      const data = await callApi(`${API_BASE}/application/approve`, {
        email: appObj.email,
        name: appObj.name,
      });
      // If backend has customerId in response, keep it
      if (data?.customerId) {
        optimisticUpdate(appObj.email, appObj.name, {
          customerId: data.customerId,
        });
      }
      alert("Approval mail sent ✅");
    } catch (err) {
      // revert on error
      optimisticUpdate(appObj.email, appObj.name, { approved: false });
      alert("Approve failed: " + err.message);
    }
  };

  const handleReject = async (appObj) => {
    optimisticUpdate(appObj.email, appObj.name, {
      rejected: true,
      approved: false,
    });
    try {
      // अगर backend में /application/reject बना है तो इसे use करें
      const data = await callApi(`${API_BASE}/application/reject`, {
        email: appObj.email,
        name: appObj.name,
      });
      alert(data?.message || "Rejected and mail sent ✅");
    } catch (err) {
      optimisticUpdate(appObj.email, appObj.name, { rejected: false });
      alert("Reject failed: " + err.message);
    }
  };

  const handleAgreement = async (appObj) => {
    optimisticUpdate(appObj.email, appObj.name, { agreementSent: true });
    try {
      // backend पर /application/agreement route बना होना चाहिए
      const data = await callApi(`${API_BASE}/application/agreement`, {
        email: appObj.email,
        name: appObj.name,
      });
      alert(data?.message || "Agreement mail sent ✅");
    } catch (err) {
      optimisticUpdate(appObj.email, appObj.name, { agreementSent: false });
      alert("Agreement failed: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/view-application?id=${applicationId}`);
  };

  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setEditFormData({
      name: application.name || "",
      phoneNumber: application.phoneNumber || "",
      email: application.email || "",
      pincode: application.pincode || "",
    });

    // If there's a pincode, fetch the location
    if (application.pincode) {
      fetchEditLocation(application.pincode);
    } else {
      setEditLocation("");
    }

    // Reset selected locations for edit modal
    setEditSelectedLocations([]);

    setIsEditModalOpen(true);
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const response = await fetch(
          `${API_BASE}/application/${applicationId}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          // Remove the deleted application from state
          setApplications((prev) =>
            prev.filter((app) => app._id !== applicationId)
          );
          setFilteredApplications((prev) =>
            prev.filter((app) => app._id !== applicationId)
          );
          alert("Application deleted successfully!");
        } else {
          alert(
            "Failed to delete application: " +
              (result?.message || "Unknown error")
          );
        }
      } catch (err) {
        console.error("Error deleting application:", err);
        alert("Error deleting application: " + err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      fetchLocation(value);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      fetchEditLocation(value);
    }
  };

  const fetchLocation = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.Status === "Success") {
        const postOffices = data[0].PostOffice || [];
        // Take ALL post offices (no limit)
        const locationStrings = postOffices.map(
          (postOffice) => postOffice.Name
        );
        // Join them with a separator
        const locationString = locationStrings.join(" | ");
        setLocation(locationString);
        // Reset selected locations when new pincode is entered
        setSelectedLocations([]);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const fetchEditLocation = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.Status === "Success") {
        const postOffices = data[0].PostOffice || [];
        // Take ALL post offices (no limit)
        const locationStrings = postOffices.map(
          (postOffice) => postOffice.Name
        );
        // Join them with a separator
        const locationString = locationStrings.join(" | ");
        setEditLocation(locationString);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const toggleEditLocationSelection = (location) => {
    setEditSelectedLocations((prev) => {
      if (prev.includes(location)) {
        return prev.filter((item) => item !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  const selectAllEditLocations = () => {
    if (editLocation) {
      const allLocations = editLocation.split(" | ");
      setEditSelectedLocations(allLocations);
    }
  };

  const deselectAllEditLocations = () => {
    setEditSelectedLocations([]);
  };

  const toggleLocationSelection = (location) => {
    setSelectedLocations((prev) => {
      if (prev.includes(location)) {
        return prev.filter((item) => item !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  const selectAllLocations = () => {
    if (location) {
      const allLocations = location.split(" | ");
      setSelectedLocations(allLocations);
    }
  };

  const deselectAllLocations = () => {
    setSelectedLocations([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use selected locations if any, otherwise use the full location string
    const locationToSend =
      selectedLocations.length > 0 ? selectedLocations.join(" | ") : location;

    const newProposal = { ...formData, location: locationToSend };
    try {
      const response = await fetch(`${API_BASE}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProposal),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        // Set the proposal link (you can customize this URL pattern as needed)
        const link = `https://yourdomain.com/proposal-form?id=${Date.now()}`;
        setProposalLink(link);
        setShowCopyLink(true);
        // Keep the modal open to show the copy link button
      } else {
        const err = await response.json().catch(() => ({}));
        alert("Error: " + (err.message || "Failed"));
        // Close the modal on error
        setFormData({ name: "", phoneNumber: "", email: "", pincode: "" });
        setLocation("");
        setSelectedLocations([]);
        setShowCopyLink(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Something went wrong!");
      // Close the modal on error
      setFormData({ name: "", phoneNumber: "", email: "", pincode: "" });
      setLocation("");
      setSelectedLocations([]);
      setShowCopyLink(false);
      setIsModalOpen(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use selected locations if any, otherwise use the full location string
      const locationToSend =
        editSelectedLocations.length > 0
          ? editSelectedLocations.join(" | ")
          : editLocation;

      const formDataToSend = {
        ...editFormData,
        location: locationToSend,
      };

      const response = await fetch(
        `${API_BASE}/application/${editingApplication._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataToSend),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Application updated successfully!");
        // Update the application in state
        const updatedApplications = applications.map((app) =>
          app._id === editingApplication._id
            ? { ...app, ...formDataToSend }
            : app
        );
        setApplications(updatedApplications);
        setFilteredApplications(updatedApplications);
        setIsEditModalOpen(false);
        setEditingApplication(null);
      } else {
        alert(
          "Failed to update application: " +
            (result?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Error updating application: " + error.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(proposalLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        // Fallback method
        const textArea = document.createElement("textarea");
        textArea.value = proposalLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      });
  };

  const handleResetForm = () => {
    setFormData({ name: "", phoneNumber: "", email: "", pincode: "" });
    setLocation("");
    setSelectedLocations([]);
    setShowCopyLink(false);
    setIsModalOpen(false);
    loadApplications();
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
              <h1 className="text-2xl font-bold text-gray-800">VALMO Agent</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Welcome{agentData?.userId ? `, ${agentData.userId}` : ", Agent"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Agent Dashboard
          </h2>
          <p className="text-gray-600">
            Manage and review franchise applications
          </p>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, phone, email, or location..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.name}
                          <div className="text-xs text-gray-500">
                            {application.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {application.email}
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
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleViewApplication(application._id)
                              }
                              className="text-blue-600 hover:text-blue-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View Application"
                            >
                              <i className="fas fa-eye"></i>
                            </button>

                            <button
                              onClick={() => handleEditApplication(application)}
                              className="text-yellow-600 hover:text-yellow-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Edit Application"
                            >
                              <i className="fas fa-edit"></i>
                            </button>

                            <button
                              onClick={() => handleApprove(application)}
                              disabled={application.approved}
                              className={`px-3 py-1 text-xs rounded font-medium shadow-sm transition-all duration-200 ${
                                application.approved
                                  ? "bg-green-500 text-white cursor-not-allowed opacity-75"
                                  : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                              }`}
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => handleAgreement(application)}
                              disabled={
                                application.agreementSent !== false &&
                                application.agreementSent !== undefined
                              }
                              className={`px-3 py-1 text-xs rounded font-medium shadow-sm transition-all duration-200 ${
                                application.agreementSent
                                  ? "bg-green-500 text-white cursor-not-allowed opacity-75"
                                  : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                              }`}
                            >
                              Agreement
                            </button>

                            <button
                              onClick={() => handleReject(application)}
                              disabled={application.rejected}
                              className={`px-3 py-1 text-xs rounded font-medium shadow-sm transition-all duration-200 ${
                                application.rejected
                                  ? "bg-green-500 text-white cursor-not-allowed opacity-75"
                                  : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                              }`}
                            >
                              One Time Fee
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-contract text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create Proposal
            </h3>
            <p className="text-gray-600 mb-4">
              Help customers submit new franchise proposals
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Create Proposal
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-list text-2xl text-green-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All Applications
            </h3>
            <p className="text-gray-600 mb-4">
              View all franchise applications
            </p>
            <button
              onClick={loadApplications}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              View All
            </button>
          </div>
        </div>
      </main>

      {/* Create Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Proposal
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    name: "",
                    phoneNumber: "",
                    email: "",
                    pincode: "",
                  });
                  setLocation("");
                  setShowCopyLink(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form
              onSubmit={
                !showCopyLink ? handleSubmit : (e) => e.preventDefault()
              }
            >
              {showCopyLink ? (
                <div className="px-6 py-4 space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <i className="fas fa-check-circle text-green-400"></i>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Application Submitted Successfully!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            The proposal has been created. Copy the link below
                            and send it to the client.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={proposalLink}
                      readOnly
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <i className="fas fa-copy mr-1"></i> Copy
                    </button>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {location && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Areas ({location.split(" | ").length} total)
                        </label>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={selectAllLocations}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={deselectAllLocations}
                            className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-1">
                          {location.split(" | ").map((area, index) => (
                            <div
                              key={index}
                              className={`py-1 text-sm cursor-pointer rounded px-2 ${
                                selectedLocations.includes(area)
                                  ? "bg-blue-500 text-white"
                                  : "hover:bg-gray-200"
                              }`}
                              onClick={() => toggleLocationSelection(area)}
                            >
                              {area}
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedLocations.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected: {selectedLocations.length} area(s)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {!showCopyLink && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Submit
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Application
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={editFormData.pincode}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {editLocation && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Areas ({editLocation.split(" | ").length} total)
                      </label>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={selectAllEditLocations}
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={deselectAllEditLocations}
                          className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-1">
                        {editLocation.split(" | ").map((area, index) => (
                          <div
                            key={index}
                            className={`py-1 text-sm cursor-pointer rounded px-2 ${
                              editSelectedLocations.includes(area)
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-200"
                            }`}
                            onClick={() => toggleEditLocationSelection(area)}
                          >
                            {area}
                          </div>
                        ))}
                      </div>
                    </div>
                    {editSelectedLocations.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected: {editSelectedLocations.length} area(s)
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
