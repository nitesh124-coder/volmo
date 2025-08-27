/** @format */
import React, { useEffect, useState } from "react";

const AdminPaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Dummy load function (API call yaha likhna hoga)
  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Example: fetch from backend
      // const res = await fetch("http://localhost:5000/payments/pending");
      // const data = await res.json();
      // setPayments(data);

      // Dummy data for now
      setTimeout(() => {
        setPayments([
          {
            id: "1",
            customer: "Deepankar Joshi",
            customerId: "VALMO/12345",
            stage: "Initial",
            amount: 1000,
            method: "UPI",
            date: "2025-08-25",
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error loading payments:", err);
      setMessage("Failed to load payments");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPayments();
  }, []);

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Verification - VALMO Admin</title>

      {/* HEADER */}
      <header className="bg-[#092d5e] text-white py-4 px-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
              alt="Valmo Logo"
              className="h-10 mr-4"
            />
            <h1 className="text-2xl font-bold">Payment Verification</h1>
          </div>
          <a
            href="/admin-home"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <i className="fas fa-arrow-left mr-2" />
            Back to Dashboard
          </a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-6 py-8">
        {/* Alert messages */}
        {message && (
          <div className="text-center py-3 mb-4 rounded-lg bg-red-100 text-red-700">
            {message}
          </div>
        )}

        {/* Pending Payments */}
        <div className="card p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              <i className="fas fa-clock mr-2 text-yellow-600" />
              Pending Payment Verifications
            </h2>
            <button
              onClick={loadPendingPayments}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <i className="fas fa-refresh mr-2" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
              <p className="text-gray-600">Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-check-circle text-6xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Pending Payments
              </h3>
              <p className="text-gray-500">All payments have been verified!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">
                      Customer ID
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">
                      Payment Stage
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">
                      Method
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-3 px-4">{p.customer}</td>
                      <td className="py-3 px-4">{p.customerId}</td>
                      <td className="py-3 px-4">{p.stage}</td>
                      <td className="py-3 px-4">₹{p.amount}</td>
                      <td className="py-3 px-4">{p.method}</td>
                      <td className="py-3 px-4">{p.date}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                          Approve
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

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

export default AdminPaymentVerification;
