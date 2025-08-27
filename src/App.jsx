/** @format */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

import MultiLogin from "./pages/MultiLogin";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import ViewApplication from "./pages/admin/ViewApplication";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Track from "./pages/Track";
import PrivacyContent from "./pages/PrivacyContent";
import TermsContent from "./pages/TermsContent";
import AdminAgentManagement from "./pages/admin/AdminAgentManagement";
import BankDetails1 from "./pages/admin/bank-details";
import AdminApplications from "./pages/admin/AdminApplications";
import Form from "./pages/Form";
import AdminPaymentVerification from "./pages/admin/AdminPaymentVerification";
// Admin components
import AdminHome from "./pages/admin/AdminHome";

// Agent component

import AgentDashboard from "./pages/agent/agent-dashboard";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/multi-login" element={<MultiLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/client-login" element={<CustomerLogin />} />
          <Route
            path="/customer-dashboard/:email"
            element={<CustomerDashboard />}
          />

          <Route path="/view-application" element={<ViewApplication />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy-content" element={<PrivacyContent />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-content" element={<TermsContent />} />
          <Route path="/track" element={<Track />} />
          <Route path="/form" element={<Form />} />

          {/* Admin Routes */}
          <Route path="/admin/admin-home" element={<AdminHome />} />
          <Route
            path="/admin/admin-applications"
            element={<AdminApplications />}
          />
          <Route
            path="/view-application/:email"
            element={<ViewApplication />}
          />
          <Route
            path="/admin/admin-payment-verification"
            element={<AdminPaymentVerification />}
          />
          <Route
            path="/admin/admin-agent-management"
            element={<AdminAgentManagement />}
          />
          <Route path="/admin/admin-bank-details" element={<BankDetails1 />} />

          {/* Agent Routes */}
          <Route path="/agent/agent-dashboard" element={<AgentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
