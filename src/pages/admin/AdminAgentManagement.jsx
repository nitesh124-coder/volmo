/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminAgentManagement = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    agentId: "",
    email: "",
    password: "",
  });

  // Toggle Admin Dropdown
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Logout Function
  const logout = () => {
    alert("Logged out successfully!");
    // navigate("/login") if using react-router
  };

  // ✅ Fix: Form Change Handler using "name"
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit New Agent
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/agents", formData);
      alert("Agent created successfully ✅");
      setFormData({
        name: "",
        phone: "",
        agentId: "",
        email: "",
        password: "",
      });
      fetchAgents();
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent ❌");
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/agents");
      setAgents(res.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      alert("Failed to fetch agents ❌");
    }
  };

  // Load agents on mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // ✅ Delete Agent
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await axios.delete(`http://localhost:5000/agents/${id}`);
      alert("Agent deleted successfully ✅");
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent ❌");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-blue-600 shadow-md py-4 px-6 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <img
            src="https://registrations-meesho-valmo.in/valmologo.png"
            alt="VALMO"
            className="h-8"
          />
          <h1 className="text-xl font-bold">Agent Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Admin Menu Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-blue-200 flex items-center"
            >
              <i className="fas fa-bars mr-2" />
              Menu
              <i className="fas fa-chevron-down ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="py-1">
                  <a
                    href="/admin/admin-home.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-home mr-2" />
                    Home
                  </a>
                  <a
                    href="/admin/admin-agent-management.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-blue-50"
                  >
                    <i className="fas fa-users mr-2" />
                    Add Agent
                  </a>
                  <a
                    href="/admin/admin-applications.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-file-alt mr-2" />
                    Applications
                  </a>
                  <a
                    href="/admin/admin-bank-details.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-university mr-2" />
                    Bank Details
                  </a>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <i className="fas fa-sign-out-alt mr-2" />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Create New Agent Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">
            <i className="fas fa-user-plus mr-2" />
            Create New Agent
          </h2>
          <form
            id="agentForm"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <i className="fas fa-user mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent's full name"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <i className="fas fa-phone mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <i className="fas fa-id-card mr-2" />
                Unique ID *
              </label>
              <input
                type="text"
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={20}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter unique ID (3-20 characters)"
              />
              <small className="text-gray-500">
                This will be used for agent login
              </small>
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <i className="fas fa-envelope mr-2" />
                Email ID *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent's email address"
              />
              <small className="text-gray-500">
                Enter valid email address for agent login
              </small>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                <i className="fas fa-lock mr-2" />
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password for agent"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                id="createBtn"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <i className="fas fa-plus mr-2" />
                Create Agent
              </button>
            </div>
          </form>
        </div>

        {/* Agents List Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-600">
              <i className="fas fa-users mr-2" />
              All Agents
            </h2>
            <button
              onClick={fetchAgents}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <i className="fas fa-refresh mr-2" />
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Unique ID
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {agents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No agents found
                    </td>
                  </tr>
                ) : (
                  agents.map((agent) => (
                    <tr key={agent._id} className="border-b">
                      <td className="py-3 px-4">{agent.agentId}</td>
                      <td className="py-3 px-4">{agent.name}</td>
                      <td className="py-3 px-4">{agent.phone}</td>
                      <td className="py-3 px-4">{agent.email}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(agent._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-xs">© 2025 Valmo. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
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

export default AdminAgentManagement;
