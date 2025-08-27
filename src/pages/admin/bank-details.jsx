/** @format */
import React, { useState, useEffect } from "react";
import axios from "axios";

const BankDetails1 = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
  });
  const [qrFile, setQrFile] = useState(null);
  const [status, setStatus] = useState("");

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleEdit = () => setIsEditing(!isEditing);

  const logout = () => {
    alert("Logged out!");
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const res = await axios.get(
        "https://valmobackend.onrender.com/bankDetails"
      );
      if (res.data.success && res.data.data) {
        setBankDetails(res.data.data);
        setFormData({
          accountHolderName: res.data.data.accountHolderName || "",
          accountNumber: res.data.data.accountNumber || "",
          ifscCode: res.data.data.ifscCode || "",
          bankName: res.data.data.bankName || "",
          branchName: res.data.data.branchName || "",
          upiId: res.data.data.upiId || "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching bank details");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQrFileChange = (e) => {
    setQrFile(e.target.files[0]);
  };

  // 🔹 Bank Details Save
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("Saving...");

      const payload = { ...formData };

      let res;
      if (bankDetails) {
        res = await axios.put(
          "https://valmobackend.onrender.com/addBankDetails",
          payload
        );
      } else {
        res = await axios.put(
          "https://valmobackend.onrender.com/addBankDetails",
          payload
        );
      }

      if (res.data.success) {
        alert("Bank details saved successfully ✅");
        setBankDetails(res.data.data);
        setIsEditing(false);
        setStatus("Saved successfully!");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error saving bank details ❌");
    }
  };

  // 🔹 QR Upload (alag button se)
  const handleQrUpload = async () => {
    if (!qrFile) {
      alert("Please select a QR file to upload.");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", qrFile);

      // ✅ Upload QR code
      const res = await axios.post(
        "https://valmobackend.onrender.com/upload",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          validateStatus: () => true, // ✅ force axios to not throw error on non-200
        }
      );

      if (!res.data.success) {
        alert(res.data.message || "Failed to upload QR ❌");
        return;
      }

      const qrUrl = res.data.url;
      console.log("Uploaded QR URL:", qrUrl);

      // ✅ Update bank details
      const payload = { ...formData, qrCode: qrUrl };
      const updateRes = await axios.put(
        "https://valmobackend.onrender.com/addBankDetails",
        payload,
        { validateStatus: () => true }
      );

      if (updateRes.data.success) {
        setBankDetails(updateRes.data.data);
        setQrFile(null);
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
              <ul className="absolute mt-10 bg-white shadow-lg rounded w-40">
                <li>
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/bank-details"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
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

      <main className="max-w-4xl mx-auto py-10 px-4">
        {/* Bank Details Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              Bank Details Management
            </h2>
            {!isEditing && (
              <button
                onClick={toggleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit Details
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Account Holder Name", name: "accountHolderName" },
                  { label: "Account Number", name: "accountNumber" },
                  { label: "IFSC Code", name: "ifscCode" },
                  { label: "Bank Name", name: "bankName" },
                  { label: "Branch Name", name: "branchName" },
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
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save Details
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {bankDetails ? (
                <>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-48">
                      Account Holder Name:
                    </span>
                    <span>{bankDetails.accountHolderName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-48">
                      Account Number:
                    </span>
                    <span>{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-48">
                      IFSC Code:
                    </span>
                    <span>{bankDetails.ifscCode}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-48">
                      Bank Name:
                    </span>
                    <span>{bankDetails.bankName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-48">
                      Branch Name:
                    </span>
                    <span>{bankDetails.branchName}</span>
                  </div>
                  {bankDetails.qrCode && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-700">
                        QR Code:
                      </span>
                      <img
                        src={bankDetails.qrCode}
                        alt="QR Code"
                        className="w-40 h-40 mt-2"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p>No bank details available.</p>
              )}
            </div>
          )}
        </div>

        {/* QR Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            QR Code Upload
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleQrFileChange}
              className="hidden"
              id="qr-upload"
            />
            <label htmlFor="qr-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center">
                <i className="fas fa-qrcode text-4xl text-gray-400 mb-3"></i>
                <p className="text-gray-600 mb-2">Click to upload QR code</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                {qrFile && (
                  <p className="text-sm text-green-600 mt-2">
                    {qrFile.name} selected
                  </p>
                )}
              </div>
            </label>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleQrUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload QR Code
              </button>
            </div>
          </div>
        </div>

        {status && (
          <p
            className={`mt-4 text-sm ${
              status.includes("success") ? "text-green-600" : "text-red-600"
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
