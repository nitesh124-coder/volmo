/** @format */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BankDetails1 = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const [status, setStatus] = useState("");

  // Check auth on component mount
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/multi-login");
    }
  }, [navigate]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const logout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const res = await axios.get(
        "https://valmobackend.onrender.com/bankDetails"
      );
      if (res.data.success) {
        // Handle both single bank object and array of banks
        const bankData = Array.isArray(res.data.data) 
          ? res.data.data 
          : res.data.data ? [res.data.data] : [];
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
    setQrFiles(prev => ({
      ...prev,
      [bankId]: e.target.files[0]
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
      accountHolderName: bank.accountHolderName || "",
      accountNumber: bank.accountNumber || "",
      ifscCode: bank.ifscCode || "",
      bankName: bank.bankName || "",
      branchName: bank.branchName || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("Saving...");

      let res;
      if (editingBankId === "new") {
        // Add new bank
        res = await axios.post(
          "https://valmobackend.onrender.com/addBankDetails",
          formData
        );
      } else {
        // Update existing bank
        res = await axios.put(
          `https://valmobackend.onrender.com/bankDetails/${editingBankId}`,
          formData
        );
      }

      if (res.data.success) {
        alert("Bank details saved successfully ✅");
        fetchBankDetails(); // Refresh the list
        setEditingBankId(null);
        setStatus("Saved successfully!");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error saving bank details ❌");
    }
  };

  const handleDeleteBank = async (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank?")) return;
    
    try {
      const res = await axios.delete(
        `https://valmobackend.onrender.com/bankDetails/${bankId}`
      );
      
      if (res.data.success) {
        alert("Bank deleted successfully ✅");
        fetchBankDetails(); // Refresh the list
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting bank details ❌");
    }
  };

  const handleQrUpload = async (bankId) => {
    const qrFile = qrFiles[bankId];
    if (!qrFile) {
      alert("Please select a QR file to upload.");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", qrFile);

      // Upload QR code
      const res = await axios.post(
        "https://valmobackend.onrender.com/upload",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          validateStatus: () => true,
        }
      );

      if (!res.data.success) {
        alert(res.data.message || "Failed to upload QR ❌");
        return;
      }

      const qrUrl = res.data.url;
      console.log("Uploaded QR URL:", qrUrl);

      // Update bank details with QR code
      const updateRes = await axios.put(
        `https://valmobackend.onrender.com/bankDetails/${bankId}`,
        { qrCode: qrUrl },
        { validateStatus: () => true }
      );

      if (updateRes.data.success) {
        // Update local state
        setBanks(prevBanks => 
          prevBanks.map(bank => 
            bank._id === bankId ? { ...bank, qrCode: qrUrl } : bank
          )
        );
        
        // Clear the QR file for this bank
        setQrFiles(prev => {
          const newQrFiles = { ...prev };
          delete newQrFiles[bankId];
          return newQrFiles;
        });
        
        alert(
          updateRes.data.message || "QR code uploaded & saved successfully ✅"
        );
      } else {
        alert(updateRes.data.message || "Failed to save bank details ❌");
      }
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("Error uploading QR code ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <header className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-blue-200 flex items-center"
            >
              <i className="fas fa-bars mr-2" />
              Menu
              <i className="fas fa-chevron-down ml-2" />
            </button>
            {isDropdownOpen && (
              <ul className="absolute mt-10 bg-white shadow-lg rounded w-48">
                <li>
                  <a
                    href="/admin/admin-home"
                    className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <i className="fas fa-home mr-2" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/admin-bank-details"
                    className="block px-4 py-2 hover:bg-gray-100 bg-blue-50 flex items-center"
                  >
                    <i className="fas fa-university mr-2" />
                    Bank Details
                  </a>
                </li>
              </ul>
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

      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-700">
            Bank Details Management
          </h2>
          <button
            onClick={handleAddBank}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center w-full sm:w-auto justify-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Bank
          </button>
        </div>

        {/* Add/Edit Bank Form */}
        {(editingBankId === "new" || editingBankId) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {editingBankId === "new" ? "Add New Bank" : "Edit Bank Details"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Account Holder Name", name: "accountHolderName" },
                  { label: "Account Number", name: "accountNumber" },
                  { label: "IFSC Code", name: "ifscCode" },
                  { label: "Bank Name", name: "bankName" },
                  { label: "Branch Name", name: "branchName" },
                  { label: "UPI ID (Optional)", name: "upiId" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="border rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={field.name !== "upiId"}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto text-center"
                >
                  Save Bank Details
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bank List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Bank Accounts
          </h3>
          
          {banks.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-university text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No bank accounts added yet</p>
              <button
                onClick={handleAddBank}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
              >
                Add Your First Bank
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {banks.map((bank) => (
                <div key={bank._id} className="border border-gray-200 rounded-lg p-4">
                  {editingBankId === bank._id ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: "Account Holder Name", name: "accountHolderName" },
                          { label: "Account Number", name: "accountNumber" },
                          { label: "IFSC Code", name: "ifscCode" },
                          { label: "Bank Name", name: "bankName" },
                          { label: "Branch Name", name: "branchName" },
                          { label: "UPI ID (Optional)", name: "upiId" },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block font-medium text-gray-700 mb-1">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              className="border rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required={field.name !== "upiId"}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto text-center"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {/* Bank Info Section */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg text-gray-800">{bank.bankName}</h4>
                        <p className="text-gray-600 mb-2">{bank.branchName}</p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Account Holder:</span> {bank.accountHolderName}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Account Number:</span> {bank.accountNumber}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">IFSC:</span> {bank.ifscCode}
                          </p>
                          {bank.upiId && (
                            <p className="text-sm">
                              <span className="font-medium">UPI ID:</span> {bank.upiId}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* QR Code Section */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">QR Code</h4>
                        {bank.qrCode ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={bank.qrCode}
                              alt="QR Code"
                              className="w-32 h-32 object-contain border border-gray-200 rounded mb-2"
                            />
                            <a 
                              href={bank.qrCode} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              View Full Size
                            </a>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">No QR code uploaded</div>
                        )}
                      </div>
                      
                      {/* Actions Section */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <button
                            onClick={() => handleEditBank(bank)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm flex-1 min-w-[80px]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBank(bank._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex-1 min-w-[80px]"
                          >
                            Delete
                          </button>
                        </div>
                        
                        <div className="w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleQrFileChange(e, bank._id)}
                            className="hidden"
                            id={`qr-upload-${bank._id}`}
                          />
                          <label 
                            htmlFor={`qr-upload-${bank._id}`} 
                            className="cursor-pointer block mb-2 text-sm text-gray-700"
                          >
                            {qrFiles[bank._id]?.name || "Choose QR image"}
                          </label>
                          <button
                            type="button"
                            onClick={() => handleQrUpload(bank._id)}
                            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm w-full"
                          >
                            Upload QR
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {status && (
          <p
            className={`mt-4 text-sm text-center p-2 rounded ${
              status.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </p>
        )}
      </main>
    </div>
  );
};

export default BankDetails1;
