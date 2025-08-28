/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://valmobackend.onrender.com";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState(null);
  const [applications, setApplications] = useState([]);
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
  const [emailContent, setEmailContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activities, setActivities] = useState([]);
  const [isBankDetailModalOpen, setIsBankDetailModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
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
      if (!event.target.closest('.mobile-actions-dropdown') && !event.target.closest('[class*="fa-ellipsis-h"]')) {
        document.querySelectorAll('.mobile-actions-dropdown').forEach(dropdown => {
          dropdown.classList.remove('block');
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [approvingApplications, rejectingApplications, sendingAgreements]);

  const checkAuth = () => {
    const userType = localStorage.getItem("userType");
    if (userType !== "agent") {
      navigate("/multi-login");
      return;
    }
    const userId = localStorage.getItem("userId");
    const agentId = localStorage.getItem("agentId");
    setAgentData({ userId, agentId });
  };

  const loadAvailableBanks = async () => {
    try {
      const response = await fetch(`${API_BASE}/bankDetails`);
      const result = await response.json();

      if (response.ok && result.success) {
        // Handle both array and single object responses
        const banksData = Array.isArray(result.data) 
          ? result.data 
          : result.data ? [result.data] : [];
        setAvailableBanks(banksData);
      }
    } catch (err) {
      console.error("Error loading bank details:", err);
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      // Get agentId from localStorage
      const agentId = localStorage.getItem("agentId");
      
      // Fetch applications assigned to this agent
      const response = await fetch(`${API_BASE}/application/agent/${agentId}`);
      const result = await response.json();

      if (response.ok && result.success) {
        const applicationsWithDetails = (result.data || []).map((app) => ({
          ...app,
          phoneNumber: app.phoneNumber || "N/A",
          location: app.location || "N/A",
          approved: !!app.approved,
          rejected: !!app.rejected,
          agreementSent: !!app.agreementSent,
          // Check if bank details are assigned
          assignedBank: app.assignedBank || null,
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

  // Function to get recent 5 applications
  const getRecentApplications = () => {
    return [...filteredApplications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  // Function to load recent activities based on applications
  const loadActivities = () => {
    // Create mock activities based on applications
    const mockActivities = filteredApplications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((app, index) => ({
        id: index + 1,
        action: app.approved ? "Approved application" : app.rejected ? "Rejected application" : "Created new proposal",
        applicant: app.name,
        timestamp: app.createdAt || new Date().toISOString()
      }));
    
    setActivities(mockActivities);
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
    // Prevent double submission
    if (approvingApplications.has(`${appObj.email}-${appObj.name}`)) {
      return;
    }
    
    // Add to loading set
    setApprovingApplications(prev => new Set([...prev, `${appObj.email}-${appObj.name}`]));
    
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
    } finally {
      // Remove from loading set
      setApprovingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${appObj.email}-${appObj.name}`);
        return newSet;
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
    // Prevent double submission
    if (rejectingApplications.has(`${appObj.email}-${appObj.name}`)) {
      return;
    }
    
    // Add to loading set
    setRejectingApplications(prev => new Set([...prev, `${appObj.email}-${appObj.name}`]));
    
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
    } finally {
      // Remove from loading set
      setRejectingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${appObj.email}-${appObj.name}`);
        return newSet;
      });
    }
  };

  const handleAgreement = async (appObj) => {
    // Prevent double submission
    if (sendingAgreements.has(`${appObj.email}-${appObj.name}`)) {
      return;
    }
    
    // Add to loading set
    setSendingAgreements(prev => new Set([...prev, `${appObj.email}-${appObj.name}`]));
    
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
    } finally {
      // Remove from loading set
      setSendingAgreements(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${appObj.email}-${appObj.name}`);
        return newSet;
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/view-application/${applicationId}`);
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

    // Validation
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.pincode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Generate proposal link
      const link = `https://yourdomain.com/proposal-form?id=${Date.now()}`;

      // Generate email content
      const content = `Dear ${formData.name},

Thank you for your interest in becoming a VALMO franchise partner!

We are pleased to inform you that your proposal has been successfully registered with us. Please find the details below:

Name: ${formData.name}
Phone Number: ${formData.phoneNumber}
Email: ${formData.email}
Pincode: ${formData.pincode}

To proceed with the next steps, please click on the following link:
${link}

If you have any questions or need further assistance, feel free to reach out to us.

Best regards,
VALMO Team`;

      setProposalLink(link);
      setEmailContent(content);
      setShowCopyLink(true);

      // Show success message
      alert("Proposal created successfully!");
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert("Error creating proposal. Please try again.");
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

  const handleSendBankDetails = async () => {
    if (!selectedBank || !bankDetailApplication) {
      alert("Please select a bank option");
      return;
    }

    setSendingBankDetails(true);

    try {
      // Find the selected bank details if not QR code
      let bankDetails = null;
      if (selectedBank !== "qr_code") {
        const bank = availableBanks.find(b => b._id === selectedBank);
        if (bank) {
          bankDetails = {
            _id: bank._id,
            bankName: bank.bankName,
            branchName: bank.branchName,
            accountHolderName: bank.accountHolderName,
            accountNumber: bank.accountNumber,
            ifscCode: bank.ifscCode,
            upiId: bank.upiId,
            qrCode: bank.qrCode
          };
        }
      }

      // Send bank assignment to backend
      const response = await fetch("https://valmobackend.onrender.com/assignBankDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: bankDetailApplication.email,
          bankOption: selectedBank,
          bankDetails: bankDetails
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Bank details assigned successfully to ${bankDetailApplication.name}! The customer will now see these details in their dashboard.`);
        setIsBankDetailModalOpen(false);
        setSelectedBank("");
        setBankDetailApplication(null);
        // Refresh applications to show updated status
        loadApplications();
      } else {
        alert(result.message || "Failed to assign bank details. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning bank details:", error);
      alert("Failed to assign bank details. Please try again.");
    } finally {
      setSendingBankDetails(false);
    }
  };

  const handleBankDetail = (application) => {
    setBankDetailApplication(application);
    setIsBankDetailModalOpen(true);
    setSelectedBank("");
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      email: "",
      pincode: "",
    });
    setLocation("");
    setShowCopyLink(false);
    setProposalLink("");
    setEmailContent("");
    setIsModalOpen(false);
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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
                alt="VALMO"
                className="h-6 sm:h-8 filter invert"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">VALMO Agent</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-8 pr-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <i className="fas fa-search absolute left-2.5 top-2 sm:top-2.5 text-gray-400 text-xs sm:text-sm"></i>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative text-gray-600 hover:text-gray-900">
                  <i className="fas fa-bell text-lg"></i>
                  {activities.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {activities.length}
                    </span>
                  )}
                </button>
                <span className="text-gray-600 text-sm hidden sm:inline">
                  Welcome{agentData?.agentId ? `, ${agentData.agentId}` : agentData?.userId ? `, ${agentData.userId}` : ", Agent"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm"
                >
                  <i className="fas fa-sign-out-alt mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Agent Dashboard
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and review franchise applications
          </p>
        </div>

        {/* Quick Actions - Moved to top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="fas fa-file-contract text-xl sm:text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              Create Proposal
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
              Help customers submit new franchise proposals
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Create Proposal
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="fas fa-list text-xl sm:text-2xl text-green-600"></i>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              All Applications
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
              View all franchise applications
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => navigate('/admin/admin-applications')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                View All
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            {activities.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No recent activities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        for {activity.applicant}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Proposals Summary */}
        <div className="bg-white rounded-lg shadow-lg mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Proposals Summary
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredApplications.length}
                </div>
                <div className="text-gray-600 text-sm">Total Proposals</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {filteredApplications.filter(app => app.approved).length}
                </div>
                <div className="text-gray-600 text-sm">Approved</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredApplications.filter(app => !app.approved && !app.rejected).length}
                </div>
                <div className="text-gray-600 text-sm">Pending</div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Proposals</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredApplications
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((app) => (
                    <div key={app._id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{app.name}</span>
                      <span className="text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              All Applications ({filteredApplications.length})
            </h3>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search by name, phone, email, or location..."
                  className="pl-8 pr-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <i className="fas fa-search absolute left-2.5 top-2 sm:top-2.5 text-gray-400 text-xs sm:text-sm"></i>
              </div>
              <button
                onClick={loadApplications}
                className="flex items-center justify-center px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm whitespace-nowrap w-full sm:w-auto"
                title="Refresh applications"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                <span className="hidden xs:inline sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-6 sm:py-8">
                <i className="fas fa-spinner fa-spin text-xl sm:text-2xl text-gray-400 mb-3 sm:mb-4"></i>
                <p className="text-gray-600 text-sm sm:text-base">Loading applications...</p>
              </div>
            ) : getRecentApplications().length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <i className="fas fa-inbox text-3xl sm:text-4xl text-gray-400 mb-3 sm:mb-4"></i>
                <p className="text-gray-600 text-sm sm:text-base">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant Name
                      </th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Submitted Date
                      </th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div className="font-medium">{application.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {application.phoneNumber}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {application.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {application.email}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
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
                          {application.assignedBank && (
                            <span className="ml-2 px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {application.assignedBank.bankName || application.assignedBank.accountHolderName || "Bank Assigned"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden md:table-cell">
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs font-medium">
                          <div className="flex flex-wrap items-center gap-1">
                            <button
                              onClick={() =>
                                handleViewApplication(application.email)
                              }
                              className="text-blue-600 hover:text-blue-900 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View Application"
                            >
                              <i className="fas fa-eye text-xs"></i>
                            </button>

                            <button
                              onClick={() => handleEditApplication(application)}
                              className="text-yellow-600 hover:text-yellow-900 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Edit Application"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </button>

                            <button
                              onClick={() => handleApprove(application)}
                              disabled={application.approved || application.rejected || approvingApplications.has(`${application.email}-${application.name}`)}
                              className={`px-2 py-1 text-xs rounded font-medium shadow-sm transition-all duration-200 ${
                                application.approved || application.rejected
                                  ? "bg-green-500 text-white cursor-not-allowed opacity-75"
                                  : approvingApplications.has(`${application.email}-${application.name}`)
                                  ? "bg-blue-500 text-white cursor-not-allowed opacity-75"
                                  : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                              } hidden sm:inline-block`}
                            >
                              {approvingApplications.has(`${application.email}-${application.name}`) ? (
                                <>
                                  <i className="fas fa-spinner fa-spin mr-1"></i> Approving...
                                </>
                              ) : (
                                "Approve"
                              )}
                            </button>

                            <button
                              onClick={() => handleAgreement(application)}
                              disabled={
                                application.agreementSent !== false &&
                                application.agreementSent !== undefined ||
                                application.rejected ||
                                sendingAgreements.has(`${application.email}-${application.name}`)
                              }
                              className={`px-2 py-1 text-xs rounded font-medium shadow-sm transition-all duration-200 ${
                                application.agreementSent || application.rejected
                                  ? "bg-green-500 text-white cursor-not-allowed opacity-75"
                                  : sendingAgreements.has(`${application.email}-${application.name}`)
                                  ? "bg-blue-500 text-white cursor-not-allowed opacity-75"
                                  : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                              } hidden sm:inline-block`}
                            >
                              {sendingAgreements.has(`${application.email}-${application.name}`) ? (
                                <>
                                  <i className="fas fa-spinner fa-spin mr-1"></i> Sending...
                                </>
                              ) : (
                                "Agreement"
                              )}
                            </button>

                            <button
                              onClick={() => handleReject(application)}
                              disabled={application.rejected || application.approved || rejectingApplications.has(`${application.email}-${application.name}`)}
                              className={`px-2 py-1 text-xs rounded font-medium shadow-sm transition-all duration-200 ${
                                application.rejected || application.approved
                                  ? "bg-green-500 text-white cursor-not-allowed opacity-75"
                                  : rejectingApplications.has(`${application.email}-${application.name}`)
                                  ? "bg-blue-500 text-white cursor-not-allowed opacity-75"
                                  : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                              } hidden sm:inline-block`}
                            >
                              {rejectingApplications.has(`${application.email}-${application.name}`) ? (
                                <>
                                  <i className="fas fa-spinner fa-spin mr-1"></i> Processing...
                                </>
                              ) : (
                                "One Time Fee"
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleBankDetail(application)}
                              className="px-2 py-1 text-xs rounded font-medium shadow-sm transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white hover:shadow-md hidden sm:inline-block"
                            >
                              Bank Detail
                            </button>

                            {/* Dropdown for mobile actions */}
                            <div className="sm:hidden relative">
                              <button 
                                className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle dropdown for this specific row
                                  const dropdown = e.currentTarget.nextElementSibling;
                                  const isOpen = dropdown.classList.contains('block');
                                  
                                  // Close all other dropdowns
                                  document.querySelectorAll('.mobile-actions-dropdown').forEach(d => {
                                    if (d !== dropdown) d.classList.remove('block');
                                  });
                                  
                                  // Toggle current dropdown
                                  dropdown.classList.toggle('block', !isOpen);
                                }}
                              >
                                <i className="fas fa-ellipsis-h text-xs"></i>
                              </button>
                              <div className="mobile-actions-dropdown hidden absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                <button
                                  onClick={() => {
                                    handleViewApplication(application.email);
                                    document.querySelector('.mobile-actions-dropdown.block')?.classList.remove('block');
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <i className="fas fa-eye mr-2"></i>View
                                </button>
                                <button
                                  onClick={() => {
                                    handleEditApplication(application);
                                    document.querySelector('.mobile-actions-dropdown.block')?.classList.remove('block');
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <i className="fas fa-edit mr-2"></i>Edit
                                </button>
                                {!application.approved && !application.rejected && (
                                  <button
                                    onClick={() => {
                                      handleApprove(application);
                                      document.querySelector('.mobile-actions-dropdown.block')?.classList.remove('block');
                                    }}
                                    disabled={approvingApplications.has(`${application.email}-${application.name}`)}
                                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                      approvingApplications.has(`${application.email}-${application.name}`) 
                                        ? "opacity-50 cursor-not-allowed" 
                                        : ""
                                    }`}
                                  >
                                    <i className="fas fa-check mr-2"></i>
                                    {approvingApplications.has(`${application.email}-${application.name}`) 
                                      ? "Approving..." 
                                      : "Approve"}
                                  </button>
                                )}
                                {application.approved && !application.agreementSent && !application.rejected && (
                                  <button
                                    onClick={() => {
                                      handleAgreement(application);
                                      document.querySelector('.mobile-actions-dropdown.block')?.classList.remove('block');
                                    }}
                                    disabled={sendingAgreements.has(`${application.email}-${application.name}`)}
                                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                      sendingAgreements.has(`${application.email}-${application.name}`) 
                                        ? "opacity-50 cursor-not-allowed" 
                                        : ""
                                    }`}
                                  >
                                    <i className="fas fa-file-contract mr-2"></i>
                                    {sendingAgreements.has(`${application.email}-${application.name}`) 
                                      ? "Sending..." 
                                      : "Agreement"}
                                  </button>
                                )}
                                {!application.rejected && !application.approved && (
                                  <button
                                    onClick={() => {
                                      handleReject(application);
                                      document.querySelector('.mobile-actions-dropdown.block')?.classList.remove('block');
                                    }}
                                    disabled={rejectingApplications.has(`${application.email}-${application.name}`)}
                                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                      rejectingApplications.has(`${application.email}-${application.name}`) 
                                        ? "opacity-50 cursor-not-allowed" 
                                        : ""
                                    }`}
                                  >
                                    <i className="fas fa-money-bill mr-2"></i>
                                    {rejectingApplications.has(`${application.email}-${application.name}`) 
                                      ? "Processing..." 
                                      : "One Time Fee"}
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    handleBankDetail(application);
                                    document.querySelector('.mobile-actions-dropdown.block')?.classList.remove('block');
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <i className="fas fa-university mr-2"></i>Bank Detail
                                </button>
                              </div>
                            </div>
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
      </main>

      {/* Create Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                          Proposal Created Successfully!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            The proposal has been created. Copy the email content below
                            and send it to the client.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <textarea
                      value={emailContent}
                      readOnly
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm h-32"
                    />
                    <button
                      type="button"
                      onClick={handleCopyEmailContent}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      <i className="fas fa-copy mr-1"></i> Copy Email
                    </button>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
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
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bank Detail Modal */}
      {isBankDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Assign Bank Details to Customer
              </h3>
              <button
                onClick={() => {
                  setIsBankDetailModalOpen(false);
                  setSelectedBank("");
                  setBankDetailApplication(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {bankDetailApplication && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Assigning Bank to:
                  </h4>
                  <p className="text-sm text-blue-700">
                    {bankDetailApplication.name} ({bankDetailApplication.email})
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Note: Once assigned, these bank details will be shown to the customer
                    in their dashboard for payment.
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank for Customer
                </label>
                <div className="space-y-2">
                  {availableBanks.map((bank) => (
                    <label key={bank._id} className="flex items-center">
                      <input
                        type="radio"
                        name="bankOption"
                        value={bank._id}
                        checked={selectedBank === bank._id}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {bank.bankName} - {bank.branchName} ({bank.accountNumber})
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bankOption"
                      value="qr_code"
                      checked={selectedBank === "qr_code"}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">QR Code Payment</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsBankDetailModalOpen(false);
                    setSelectedBank("");
                    setBankDetailApplication(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendBankDetails}
                  disabled={!selectedBank || sendingBankDetails}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 w-full sm:w-auto ${
                    !selectedBank || sendingBankDetails
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {sendingBankDetails ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i> Assigning...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i> Assign Bank
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
