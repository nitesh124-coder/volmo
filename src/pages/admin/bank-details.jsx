/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BankDetails = () => {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [editingBankId, setEditingBankId] = useState(null);
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
  });
  const [qrFiles, setQrFiles] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Fetch bank details
  const fetchBanks = async () => {
    try {
      const res = await axios.get(
        "https://valmobackend.onrender.com/bank-details"
      );
      if (res.data.success) {
        // Handle both single bank object and array of banks
        const bankData = Array.isArray(res.data.data)
          ? res.data.data
          : res.data.data
          ? [res.data.data]
          : [];
        setBanks(bankData);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching bank details");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQrFileChange = (e, bankId) => {
    setQrFiles((prev) => ({
      ...prev,
      [bankId]: e.target.files[0],
    }));
  };

  const handleAddBank = () => {
    setEditingBankId("new");
    setFormData({
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      upiId: "",
    });
  };

  const handleEditBank = (bank) => {
    setEditingBankId(bank._id);
    setFormData({
      accountHolderName: bank.accountHolderName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      bankName: bank.bankName,
      branchName: bank.branchName,
      upiId: bank.upiId || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingBankId(null);
    setFormData({
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      upiId: "",
    });
  };

  const handleSaveBank = async () => {
    try {
      let res;
      const payload = { ...formData };

      if (editingBankId === "new") {
        // Add new bank
        res = await axios.post(
          "https://valmobackend.onrender.com/bank-details",
          payload
        );
      } else {
        // Update existing bank
        res = await axios.put(
          `https://valmobackend.onrender.com/bank-details/${editingBankId}`,
          payload
        );
      }

      if (res.data.success) {
        showMessage(
          editingBankId === "new"
            ? "Bank added successfully"
            : "Bank updated successfully",
          "success"
        );
        setEditingBankId(null);
        fetchBanks();
      }
    } catch (err) {
      console.error(err);
      showMessage("Error saving bank details", "error");
    }
  };

  const handleDeleteBank = async (id) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      try {
        const res = await axios.delete(
          `https://valmobackend.onrender.com/bank-details/${id}`
        );
        if (res.data.success) {
          showMessage("Bank deleted successfully", "success");
          fetchBanks();
        }
      } catch (err) {
        console.error(err);
        showMessage("Error deleting bank", "error");
      }
    }
  };

  const handleUploadQr = async (bankId) => {
    if (!qrFiles[bankId]) {
      alert("Please select a QR code image first");
      return;
    }

    const formData = new FormData();
    formData.append("qrCode", qrFiles[bankId]);

    try {
      const res = await axios.post(
        `https://valmobackend.onrender.com/bank-details/${bankId}/qr-code`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        showMessage("QR code uploaded successfully", "success");
        fetchBanks();
        // Clear the file input
        setQrFiles((prev) => {
          const newFiles = { ...prev };
          delete newFiles[bankId];
          return newFiles;
        });
      }
    } catch (err) {
      console.error(err);
      showMessage("Error uploading QR code", "error");
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

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
            <h1 className="text-lg sm:text-xl font-bold">Bank Management</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Admin Menu Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleDropdown}
                className="text-white hover:text-blue-200 flex items-center text-sm"
              >
                <i className="fas fa-bars mr-2" />
                Menu
                <i className="fas fa-chevron-down ml-2" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <a
                      href="/admin/admin-home"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-home mr-2" />
                      Home
                    </a>
                    <a
                      href="/admin/admin-agent-management"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-users mr-2" />
                      Add Agent
                    </a>
                    <a
                      href="/admin/admin-applications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-file-alt mr-2" />
                      Applications
                    </a>
                    <a
                      href="/admin/admin-bank-details"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-blue-50 flex items-center"
                    >
                      <i className="fas fa-university mr-2" />
                      Bank Details
                    </a>
                    <button
                      onClick={() => {
                        localStorage.removeItem("userType");
                        localStorage.removeItem("userId");
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2" />
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
        {/* Alert Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Bank Accounts
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Manage bank account details for franchise payments
              </p>
            </div>
            <button
              onClick={handleAddBank}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Bank Account
            </button>
          </div>

          {/* Add/Edit Form */}
          {editingBankId && (
            <div className="mb-8 bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {editingBankId === "new" ? "Add New Bank" : "Edit Bank"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleSaveBank}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Banks List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Account Holder
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bank Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Account Number
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IFSC Code
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    QR Code
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
                {banks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No bank accounts found
                    </td>
                  </tr>
                ) : (
                  banks.map((bank) => (
                    <tr key={bank._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {bank.accountHolderName}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {bank.bankName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {bank.branchName}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {bank.accountNumber}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {bank.ifscCode}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {bank.qrCode && (
                            <a
                              href={bank.qrCode}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              View QR
                            </a>
                          )}
                          <div className="flex flex-col">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleQrFileChange(e, bank._id)
                              }
                              className="text-xs"
                            />
                            {qrFiles[bank._id] && (
                              <button
                                onClick={() => handleUploadQr(bank._id)}
                                className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                              >
                                Upload
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBank(bank)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteBank(bank._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

export default BankDetails;