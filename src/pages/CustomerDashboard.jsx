/** @format */

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  const [customerSession, setCustomerSession] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [status, setStatus] = useState();
  const [Bank, setBank] = useState();

  // ✅ interval IDs ko state me mat rakho → useRef
  const timerIntervalRef = useRef(null);
  const statusPollingRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("customerSession");
    navigate("/customer-login");
  };

  // ✅ checkAuth & polling
  useEffect(() => {
    if (!checkAuth()) {
      return;
    }

    // Load initial data
    loadApplicationDetails();

    // Poll every 10 seconds
    statusPollingRef.current = setInterval(() => {
      loadApplicationDetails();
    }, 10000);

    return () => {
      if (statusPollingRef.current) clearInterval(statusPollingRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const checkAuth = () => {
    const session = localStorage.getItem("customerSession");
    if (!session) {
      navigate("/customer-login");
      return false;
    }

    try {
      const parsedSession = JSON.parse(session);
      // Check if session is for the correct user
      if (parsedSession.email !== email) {
        navigate("/customer-login");
        return false;
      }

      setCustomerSession(parsedSession);
      return true;
    } catch (error) {
      console.error("Session parsing error:", error);
      navigate("/customer-login");
      return false;
    }
  };

  const loadApplicationDetails = async () => {
    try {
      const response = await axios.get(
        `https://valmobackend.onrender.com/application-details/${email}`
      );
      setApplicationDetails(response.data);
    } catch (error) {
      console.error("Error loading application details:", error);
    }
  };

  const startTimer = () => {
    setTimer(180); // 3 minutes
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerIntervalRef.current);
          setShowPaymentModal(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
    startTimer();
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!customerSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-700">
              Welcome, {customerSession.email}
            </span>
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
              Application Dashboard
            </h1>
            <p className="text-gray-600">
              Track your franchise application status
            </p>
          </div>

          {/* Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Application Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                <i className="fas fa-file-alt mr-2 sm:mr-3 text-blue-600"></i>
                Application Details
              </h3>

              {applicationDetails ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div>
                        <strong className="text-gray-700 text-sm">Name:</strong>{" "}
                        <span className="text-gray-900 text-sm">
                          {applicationDetails.fullName}
                        </span>
                      </div>
                      <div>
                        <strong className="text-gray-700 text-sm">Email:</strong>{" "}
                        <span className="text-gray-900 text-sm">
                          {applicationDetails.email}
                        </span>
                      </div>
                      <div>
                        <strong className="text-gray-700 text-sm">
                          Address:
                        </strong>{" "}
                        <span className="text-gray-900 text-sm">
                          {applicationDetails.residentialStreet},{" "}
                          {applicationDetails.residentialCity},{" "}
                          {applicationDetails.residentialDistrict},{" "}
                          {applicationDetails.residentialState} -{" "}
                          {applicationDetails.residentialPinCode}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <strong className="text-gray-700 text-sm">
                          Investment Capacity:
                        </strong>{" "}
                        <span className="text-gray-900 text-sm">
                          {applicationDetails.investmentCapacity}
                        </span>
                      </div>
                      <div>
                        <strong className="text-gray-700 text-sm">
                          Experience:
                        </strong>{" "}
                        <span className="text-gray-900 text-sm">
                          {applicationDetails.professionalBackground || "N/A"}
                        </span>
                      </div>
                      <div>
                        <strong className="text-gray-700 text-sm">
                          Application Date:
                        </strong>{" "}
                        <span className="text-gray-900 text-sm">
                          {new Date(
                            applicationDetails.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <strong className="text-gray-700 text-sm">Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                            applicationDetails.approved
                              ? "bg-green-100 text-green-800"
                              : applicationDetails.rejected
                              ? "bg-red-100 text-red-800"
                              : applicationDetails.oneTimeFeePaid
                              ? "bg-green-100 text-green-800"
                              : applicationDetails.agreementSent
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {applicationDetails.approved
                            ? "Approved"
                            : applicationDetails.rejected
                            ? "Rejected"
                            : applicationDetails.oneTimeFeePaid
                            ? "One Time Fee Paid"
                            : applicationDetails.agreementSent
                            ? "Agreement Sent"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Uploaded Documents
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Photo:</strong>{" "}
                        {applicationDetails.photo ? (
                          <a
                            href={applicationDetails.photo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          "Not Uploaded"
                        )}
                      </li>
                      <li>
                        <strong>Aadhar Card:</strong>{" "}
                        {applicationDetails.aadharCard ? (
                          <a
                            href={applicationDetails.aadharCard}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          "Not Uploaded"
                        )}
                      </li>
                      <li>
                        <strong>PAN Card:</strong>{" "}
                        {applicationDetails.panCard ? (
                          <a
                            href={applicationDetails.panCard}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          "Not Uploaded"
                        )}
                      </li>
                      <li>
                        <strong>Passbook/Cancelled Cheque:</strong>{" "}
                        {applicationDetails.cancelCheque ? (
                          <a
                            href={applicationDetails.cancelCheque}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          "Not Uploaded"
                        )}
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                  <p className="text-gray-600">
                    Loading your application details...
                  </p>
                </div>
              )}
            </div>

            {/* Payment Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                <i className="fas fa-credit-card mr-2 sm:mr-3 text-green-600"></i>
                Payment Status
              </h3>

              <div className="text-center py-4">
                {applicationDetails?.assignedBank && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <i className="fas fa-info-circle text-xl sm:text-2xl text-blue-600 mb-2"></i>
                    <p className="text-blue-800 font-semibold text-sm sm:text-base">
                      Bank Details Assigned by Agent
                    </p>
                    <p className="text-blue-600 text-xs sm:text-sm mt-1">
                      Your agent has assigned specific payment details for your
                      application. Please use the bank details or QR code shown
                      below to complete your payment.
                    </p>
                  </div>
                )}

                {applicationDetails?.oneTimeFeePaid ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <i className="fas fa-check-circle text-4xl text-green-600 mb-4"></i>
                    <h4 className="text-xl font-bold text-green-800 mb-2">
                      Payment Successful!
                    </h4>
                    <p className="text-green-700 mb-4">
                      Your one-time fee has been successfully paid. Our team will
                      contact you shortly with next steps.
                    </p>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="font-semibold text-gray-800">
                        Transaction ID: {applicationDetails.transactionId}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Paid on:{" "}
                        {new Date(
                          applicationDetails.paymentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                      <i className="fas fa-exclamation-circle text-3xl text-yellow-600 mb-3"></i>
                      <h4 className="text-lg font-bold text-yellow-800 mb-2">
                        Payment Pending
                      </h4>
                      <p className="text-yellow-700 mb-4">
                        Please complete your payment to proceed with your
                        application.
                      </p>
                      <button
                        onClick={handlePayNow}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center mx-auto"
                      >
                        <i className="fas fa-rupee-sign mr-2"></i>
                        Pay Now
                      </button>
                    </div>

                    {applicationDetails?.assignedBank && (
                      <div className="text-left bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-bold text-gray-800 mb-2">
                          Agent Assigned Payment Details:
                        </h5>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Bank:</strong>{" "}
                            {applicationDetails.assignedBank.bankName}
                          </p>
                          <p>
                            <strong>Account Holder:</strong>{" "}
                            {applicationDetails.assignedBank.accountHolderName}
                          </p>
                          <p>
                            <strong>Account Number:</strong>{" "}
                            {applicationDetails.assignedBank.accountNumber}
                          </p>
                          <p>
                            <strong>IFSC:</strong>{" "}
                            {applicationDetails.assignedBank.ifscCode}
                          </p>
                          <p>
                            <strong>UPI ID:</strong>{" "}
                            {applicationDetails.assignedBank.upiId || "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-list mr-3 text-indigo-600"></i>Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-contract text-blue-600 text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Application Review</h4>
                <p className="text-gray-600 text-sm">
                  Our team is reviewing your application. This process typically
                  takes 2-3 business days.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-handshake text-green-600 text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Approval & Agreement</h4>
                <p className="text-gray-600 text-sm">
                  Once approved, you'll receive the franchise agreement for
                  review and signing.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-graduation-cap text-purple-600 text-xl"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Training & Onboarding</h4>
                <p className="text-gray-600 text-sm">
                  After signing the agreement, you'll undergo comprehensive
                  training to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Complete Payment
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="mb-6 text-center">
                <div className="bg-red-100 text-red-800 py-2 px-4 rounded-lg inline-block mb-4">
                  <i className="fas fa-clock mr-2"></i>
                  Time remaining: {formatTime(timer)}
                </div>
                <p className="text-gray-600 mb-4">
                  Please complete your payment within the time limit to secure
                  your application.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Registration Fee</span>
                      <span>₹18,600</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Money (90% refundable)</span>
                      <span>₹90,100</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
                      <span>Total Amount</span>
                      <span>₹1,08,700</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">
                    Payment Instructions
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1 list-disc pl-5">
                    <li>Make payment to the bank details provided below</li>
                    <li>
                      After payment, upload the transaction receipt in your
                      application
                    </li>
                    <li>Keep the transaction ID for your records</li>
                  </ul>
                </div>

                {applicationDetails?.assignedBank ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">
                      Agent Assigned Bank Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Bank:</strong>{" "}
                        {applicationDetails.assignedBank.bankName}
                      </p>
                      <p>
                        <strong>Account Holder:</strong>{" "}
                        {applicationDetails.assignedBank.accountHolderName}
                      </p>
                      <p>
                        <strong>Account Number:</strong>{" "}
                        {applicationDetails.assignedBank.accountNumber}
                      </p>
                      <p>
                        <strong>IFSC:</strong>{" "}
                        {applicationDetails.assignedBank.ifscCode}
                      </p>
                      {applicationDetails.assignedBank.upiId && (
                        <p>
                          <strong>UPI ID:</strong>{" "}
                          {applicationDetails.assignedBank.upiId}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">
                      Bank Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Bank:</strong> HDFC Bank
                      </p>
                      <p>
                        <strong>Account Holder:</strong> Fashnear Technologies
                        Private Limited
                      </p>
                      <p>
                        <strong>Account Number:</strong> 50200079894881
                      </p>
                      <p>
                        <strong>IFSC:</strong> HDFC0000252
                      </p>
                      <p>
                        <strong>Branch:</strong> Marathahalli, Bangalore
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would redirect to a payment gateway
                      alert(
                        "In a real application, this would redirect to a payment gateway"
                      );
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    Proceed to Pay
                  </button>
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

export default CustomerDashboard;