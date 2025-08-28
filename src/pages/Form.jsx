/** @format */

import React, { useState, useEffect, useRef } from "react";

const Form = () => {
  // State management
  const [inviteToken, setInviteToken] = useState(null);
  const [agentInfo, setAgentInfo] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [passportPhotoFile, setPassportPhotoFile] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    fatherHusbandName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    panNumber: "",
    aadharNumber: "",
    passportNumber: "",

    // Contact Details
    mobileNumber: "",
    alternateMobileNumber: "",
    email: "",
    preferredCommunication: "",

    // Residential Address
    residentialStreet: "",
    residentialCity: "",
    residentialDistrict: "",
    residentialState: "",
    residentialPinCode: "",

    // Business Information
    businessName: "",
    businessType: "",
    gstNumber: "",
    officeAddress: "",
    officeCity: "",
    officeDistrict: "",
    officeState: "",
    officePinCode: "",
    numberOfEmployees: "",

    // Franchise Location Details
    franchisePinCode: "",
    premisesOwnership: "",
    totalSpace: "",
    warehouseSpace: "",
    parkingFacility: "",
    officeSetup: "",

    // Investment & Financial Information
    investmentCapacity: "",
    investmentSource: "",
    hasLoans: false,
    loanDetails: "",
    expectedRevenue: "",

    // Logistics & Operational Readiness
    hasCommercialVehicles: false,
    vehicleDetails: "",
    isFamiliarWithLogistics: false,
    hasLogisticsExperience: false,
    experienceDetails: "",
    staffCount: "",

    // Qualification Details
    education: "",
    professionalBackground: "",
    certifications: "",

    // Past Business Experience & References
    hasOtherFranchise: false,
    franchiseDetails: "",
    hasLegalIssues: false,
    legalDetails: "",
    reference1Name: "",
    reference1Contact: "",
    reference1Relationship: "",
    reference2Name: "",
    reference2Contact: "",
    reference2Relationship: "",

    // Bank Details
    bankName: "",
    bankBranch: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",

    // Terms & Conditions
    agreeTerms: false,
    agreeDisclaimer: false,
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [conditionalFields, setConditionalFields] = useState({
    loanDetails: false,
    vehicleDetails: false,
    experienceDetails: false,
    franchiseDetails: false,
    legalDetails: false,
  });
  const [filePreviews, setFilePreviews] = useState({});
  console.log("filePreviews", filePreviews);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const fileInputRefs = {
    panCard: useRef(null),
    aadharCard: useRef(null),
    passport: useRef(null),
    businessProof: useRef(null),
    cancelledCheque: useRef(null),
    addressProof: useRef(null),
    passportPhoto: useRef(null),
  };

  // Generate application number
  const generateApplicationNumber = () => {
    const prefix = "VL";
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const appNum = `${prefix}-${randomNum}`;
    setApplicationNumber(appNum);
    return appNum;
  };

  // Show toast notification
  const showToastMessage = (message, type = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(() => {
      setShowToast({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Validate invite token
  const validateInviteToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      showToastMessage(
        "This form requires a valid invitation link. Please contact your agent for a proper invitation.",
        "error"
      );
      return false;
    }

    try {
      // In a real implementation, you would call your API here
      // const response = await fetch(`/api/validate-token/${token}`);
      // const result = await response.json();

      // Simulated validation for demo
      const result = {
        valid: true,
        agentId: "AGT001",
        agentName: "John Doe",
        agentPhone: "9876543210",
        customerName: "",
      };

      if (!result.valid) {
        showToastMessage(
          result.message ||
            "Invalid or expired invitation token. Please request a new invitation link from your agent.",
          "error"
        );
        return false;
      }

      setInviteToken(token);
      setAgentInfo({
        agentId: result.agentId,
        agentName: result.agentName,
        agentPhone: result.agentPhone,
      });

      if (result.customerName) {
        setFormData((prev) => ({ ...prev, fullName: result.customerName }));
      }

      console.log("Valid invitation token. Agent:", result.agentName);
      return true;
    } catch (error) {
      console.error("Error validating token:", error);
      showToastMessage(
        "Unable to validate invitation token. Please check your internet connection and try again.",
        "error"
      );
      return false;
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle radio button changes
  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user selects an option
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToastMessage("File size must be less than 5MB", "error");
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        showToastMessage("Please select a valid image file", "error");
        e.target.value = "";
        return;
      }

      setPassportPhotoFile(file); // 👈 yaha file save ho gayi

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file uploads
  const handleFileUpload = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showToastMessage("File size must be under 5MB.", "error");
        e.target.value = "";
        return;
      }

      setFilePreviews((prev) => ({
        ...prev,
        [fieldName]: {
          name: file.name,
          file: file,
        },
      }));
    }
  };

  // Remove file
  const removeFile = (fieldName) => {
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });

    if (fileInputRefs[fieldName].current) {
      fileInputRefs[fieldName].current.value = "";
    }
  };

  // Toggle conditional fields
  const toggleConditionalField = (fieldName, show) => {
    setConditionalFields((prev) => ({
      ...prev,
      [fieldName]: show,
    }));
  };

  // Fetch pincode details
  const fetchPincodeDetails = async (pincode, type) => {
    if (!/^[0-9]{6}$/.test(pincode)) {
      showToastMessage("Invalid PIN code", "error");
      return;
    }

    try {
      // In a real implementation, you would call your API here
      // const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      // const data = await response.json();

      // Simulated response for demo
      const data = [
        {
          Status: "Success",
          PostOffice: [
            {
              Block: "Block Area",
              Name: "Area Name",
              District: "District Name",
              State: "State Name",
            },
          ],
        },
      ];

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        if (type === "residential") {
          setFormData((prev) => ({
            ...prev,
            residentialCity: postOffice.Block || postOffice.Name || "",
            residentialDistrict: postOffice.District || "",
            residentialState: postOffice.State || "",
          }));
        } else if (type === "office") {
          setFormData((prev) => ({
            ...prev,
            officeCity: postOffice.Block || postOffice.Name || "",
            officeDistrict: postOffice.District || "",
            officeState: postOffice.State || "",
          }));
        }

        showToastMessage("Details filled successfully", "success");
      } else {
        showToastMessage("No details found", "error");
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      showToastMessage("Error fetching details", "error");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = [
      "fullName",
      "fatherHusbandName",
      "dateOfBirth",
      "gender",

      "maritalStatus",
      "panNumber",
      "aadharNumber",

      "mobileNumber",

      "email",

      "residentialStreet",
      "residentialCity",
      "residentialDistrict",
      "residentialState",
      "residentialPinCode",

      "officeAddress",
      "officeCity",
      "officeDistrict",
      "officeState",
      "officePinCode",
      "numberOfEmployees",
      "franchisePinCode",
      "premisesOwnership",
      "totalSpace",
      "warehouseSpace",
      "parkingFacility",
      "officeSetup",
      "investmentCapacity",
      "investmentSource",
      "hasLoans",
      "expectedRevenue",
      "hasCommercialVehicles",
      "isFamiliarWithLogistics",
      "hasLogisticsExperience",
      "staffCount",
      "education",
      "hasOtherFranchise",
      "hasLegalIssues",

      "bankName",
      "bankBranch",
      "accountHolderName",
      "accountNumber",
      "ifscCode",

      "agreeTerms",
      "agreeDisclaimer",
    ];

    requiredFields.forEach((field) => {
      // Special handling for boolean fields
      if (
        field === "hasLoans" ||
        field === "hasCommercialVehicles" ||
        field === "isFamiliarWithLogistics" ||
        field === "hasLogisticsExperience" ||
        field === "hasOtherFranchise" ||
        field === "hasLegalIssues" ||
        field === "agreeTerms" ||
        field === "agreeDisclaimer"
      ) {
        if (formData[field] !== true && formData[field] !== false) {
          newErrors[field] = "This field is required";
          isValid = false;
          console.log(`Boolean field ${field} is invalid:`, formData[field]);
        }
      } else if (
        formData[field] === undefined ||
        formData[field] === null ||
        formData[field] === ""
      ) {
        newErrors[field] = "This field is required";
        isValid = false;
        console.log(`Text field ${field} is invalid:`, formData[field]);
      }
    });

    // Special validations
    if (
      formData.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())
    ) {
      newErrors.panNumber = "Enter valid PAN (e.g., ABCDE1234F)";
      isValid = false;
    }

    if (formData.aadharNumber && !/^[0-9]{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = "Enter 12-digit Aadhar number";
      isValid = false;
    }

    if (formData.mobileNumber && !/^[0-9]{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter 10-digit mobile number";
      isValid = false;
    }

    if (
      formData.alternateMobileNumber &&
      !/^[0-9]{10}$/.test(formData.alternateMobileNumber)
    ) {
      newErrors.alternateMobileNumber = "Enter 10-digit mobile number";
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (
      formData.residentialPinCode &&
      !/^[0-9]{6}$/.test(formData.residentialPinCode)
    ) {
      newErrors.residentialPinCode = "Enter 6-digit PIN code";
      isValid = false;
    }

    if (formData.officePinCode && !/^[0-9]{6}$/.test(formData.officePinCode)) {
      newErrors.officePinCode = "Enter 6-digit PIN code";
      isValid = false;
    }

    if (
      formData.franchisePinCode &&
      !/^[0-9]{6}$/.test(formData.franchisePinCode)
    ) {
      newErrors.franchisePinCode = "Enter 6-digit PIN code";
      isValid = false;
    }

    if (formData.totalSpace && isNaN(formData.totalSpace)) {
      newErrors.totalSpace = "Enter a valid number";
      isValid = false;
    }

    if (formData.numberOfEmployees && isNaN(formData.numberOfEmployees)) {
      newErrors.numberOfEmployees = "Enter a valid number";
      isValid = false;
    }

    if (
      formData.staffCount &&
      (isNaN(formData.staffCount) || formData.staffCount < 1)
    ) {
      newErrors.staffCount = "Enter a valid number (minimum 1)";
      isValid = false;
    }

    if (
      formData.ifscCode &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())
    ) {
      newErrors.ifscCode = "Enter valid IFSC code";
      isValid = false;
    }

    // Conditional field validations
    if (
      formData.hasLoans === true &&
      (!formData.loanDetails || formData.loanDetails === "")
    ) {
      newErrors.loanDetails = "This field is required when you have loans";
      isValid = false;
    }

    if (
      formData.hasCommercialVehicles === true &&
      (!formData.vehicleDetails || formData.vehicleDetails === "")
    ) {
      newErrors.vehicleDetails =
        "This field is required when you have commercial vehicles";
      isValid = false;
    }

    if (
      formData.hasLogisticsExperience === true &&
      (!formData.experienceDetails || formData.experienceDetails === "")
    ) {
      newErrors.experienceDetails =
        "This field is required when you have logistics experience";
      isValid = false;
    }

    if (
      formData.hasOtherFranchise === true &&
      (!formData.franchiseDetails || formData.franchiseDetails === "")
    ) {
      newErrors.franchiseDetails =
        "This field is required when you have other franchises";
      isValid = false;
    }

    if (
      formData.hasLegalIssues === true &&
      (!formData.legalDetails || formData.legalDetails === "")
    ) {
      newErrors.legalDetails =
        "This field is required when you have legal issues";
      isValid = false;
    }

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return { isValid, errors: newErrors };
  };

  // Submit form
  // Submit form
  const submitForm = async (e) => {
    e.preventDefault();

    console.log("Form data at submit:", formData);

    // Check if all required fields are present
    const requiredFields = [
      "fullName",
      "fatherHusbandName",
      "dateOfBirth",
      "gender",
      "nationality",
      "maritalStatus",
      "panNumber",
      "aadharNumber",
      "passportNumber",
      "mobileNumber",
      "alternateMobileNumber",
      "email",
      "preferredCommunication",
      "residentialStreet",
      "residentialCity",
      "residentialDistrict",
      "residentialState",
      "residentialPinCode",
      "businessName",
      "businessType",
      "gstNumber",
      "officeAddress",
      "officeCity",
      "officeDistrict",
      "officeState",
      "officePinCode",
      "numberOfEmployees",
      "franchisePinCode",
      "premisesOwnership",
      "totalSpace",
      "warehouseSpace",
      "parkingFacility",
      "officeSetup",
      "investmentCapacity",
      "investmentSource",
      "hasLoans",
      "expectedRevenue",
      "hasCommercialVehicles",
      "isFamiliarWithLogistics",
      "hasLogisticsExperience",
      "staffCount",
      "education",
      "professionalBackground",
      "certifications",
      "hasOtherFranchise",
      "hasLegalIssues",
      "reference1Name",
      "reference1Contact",
      "reference1Relationship",
      "reference2Name",
      "reference2Contact",
      "reference2Relationship",
      "bankName",
      "bankBranch",
      "accountHolderName",
      "accountNumber",
      "ifscCode",
      "upiId",
      "agreeTerms",
      "agreeDisclaimer",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !(field in formData) ||
        (field !== "hasLoans" &&
          field !== "hasCommercialVehicles" &&
          field !== "isFamiliarWithLogistics" &&
          field !== "hasLogisticsExperience" &&
          field !== "hasOtherFranchise" &&
          field !== "hasLegalIssues" &&
          field !== "agreeTerms" &&
          field !== "agreeDisclaimer" &&
          (formData[field] === undefined ||
            formData[field] === null ||
            formData[field] === ""))
    );

    // Special handling for boolean fields
    const booleanFields = [
      "hasLoans",
      "hasCommercialVehicles",
      "isFamiliarWithLogistics",
      "hasLogisticsExperience",
      "hasOtherFranchise",
      "hasLegalIssues",
      "agreeTerms",
      "agreeDisclaimer",
    ];

    const missingBooleanFields = booleanFields.filter(
      (field) => formData[field] !== true && formData[field] !== false
    );

    if (missingFields.length > 0 || missingBooleanFields.length > 0) {
      console.log("Missing text fields:", missingFields);
      console.log("Missing boolean fields:", missingBooleanFields);
    }

    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
      const errorCount = Object.keys(validationErrors).length;
      const errorFields = Object.keys(validationErrors).join(", ");
      console.log("Failed validation fields:", errorFields);
      showToastMessage(
        `Please fill all required fields. (${errorCount} errors found). Missing: ${errorFields}`,
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // ---- Create FormData object ----
      const formDataToSend = new FormData();

      // Append all normal fields
      Object.keys(formData).forEach((key) => {
        let value = formData[key];
        if (typeof value === "boolean") value = value.toString();
        formDataToSend.append(key, value || "");
      });

      // Append files with backend field names
      if (passportPhotoFile) {
        formDataToSend.append("photo", passportPhotoFile); // 👈 backend schema me "photo"
      }
      if (filePreviews.passport?.file) {
        formDataToSend.append("aadharBack", filePreviews.passport.file);
      }
      if (filePreviews.aadharCard?.file) {
        formDataToSend.append("aadharCard", filePreviews.aadharCard.file);
      }
      if (filePreviews.panCard?.file) {
        formDataToSend.append("panCard", filePreviews.panCard.file);
      }
      if (filePreviews.cancelledCheque?.file) {
        formDataToSend.append(
          "cancelCheque",
          filePreviews.cancelledCheque.file
        );
      }
      if (filePreviews.businessProof?.file) {
        formDataToSend.append(
          "gstCertificate",
          filePreviews.businessProof.file
        );
      }
      if (filePreviews.addressProof?.file) {
        formDataToSend.append("addressProof", filePreviews.addressProof.file);
      }

      // Multiple other docs
      if (filePreviews.otherDocuments?.length) {
        filePreviews.otherDocuments.forEach((doc) => {
          formDataToSend.append("otherDocuments", doc.file);
        });
      }

      // Debug log
      console.log("Submitting fields:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // ---- Submit to the API ----
      const response = await fetch(
        "https://valmobackend.onrender.com/createApplication",
        {
          method: "POST",
          body: formDataToSend, // no Content-Type header (browser sets it)
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        showToastMessage(
          "Thank you for showing interest in the Valmo Franchise! ✅ Your form has been successfully submitted. Our team will contact you shortly with the next steps. 🚚📦"
        );

        // Reset form
        setFormData({
          // reset all fields
          fullName: "",
          fatherHusbandName: "",
          dateOfBirth: "",
          gender: "",
          nationality: "",
          maritalStatus: "",
          panNumber: "",
          aadharNumber: "",
          passportNumber: "",
          mobileNumber: "",
          alternateMobileNumber: "",
          email: "",
          preferredCommunication: "",
          residentialStreet: "",
          residentialCity: "",
          residentialDistrict: "",
          residentialState: "",
          residentialPinCode: "",
          businessName: "",
          businessType: "",
          gstNumber: "",
          officeAddress: "",
          officeCity: "",
          officeDistrict: "",
          officeState: "",
          officePinCode: "",
          numberOfEmployees: "",
          franchisePinCode: "",
          premisesOwnership: "",
          totalSpace: "",
          warehouseSpace: "",
          parkingFacility: "",
          officeSetup: "",
          investmentCapacity: "",
          investmentSource: "",
          hasLoans: false,
          loanDetails: "",
          expectedRevenue: "",
          hasCommercialVehicles: false,
          vehicleDetails: "",
          isFamiliarWithLogistics: false,
          hasLogisticsExperience: false,
          experienceDetails: "",
          staffCount: "",
          education: "",
          professionalBackground: "",
          certifications: "",
          hasOtherFranchise: false,
          franchiseDetails: "",
          hasLegalIssues: false,
          legalDetails: "",
          reference1Name: "",
          reference1Contact: "",
          reference1Relationship: "",
          reference2Name: "",
          reference2Contact: "",
          reference2Relationship: "",
          bankName: "",
          bankBranch: "",
          accountHolderName: "",
          accountNumber: "",
          ifscCode: "",
          upiId: "",
          agreeTerms: false,
          agreeDisclaimer: false,
        });
        setPhotoPreview(null);
        setFilePreviews({});
        Object.values(fileInputRefs).forEach((ref) => {
          if (ref.current) ref.current.value = "";
        });
        setConditionalFields({
          loanDetails: false,
          vehicleDetails: false,
          experienceDetails: false,
          franchiseDetails: false,
          legalDetails: false,
        });
        generateApplicationNumber();
      } else {
        showToastMessage(
          result.message || "Failed to submit application",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToastMessage("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize component
  useEffect(() => {
    generateApplicationNumber();
    validateInviteToken();
  }, []);

  // Handle conditional field changes
  useEffect(() => {
    if (formData.hasLoans === true) {
      toggleConditionalField("loanDetails", true);
    } else {
      toggleConditionalField("loanDetails", false);
    }

    if (formData.hasCommercialVehicles === true) {
      toggleConditionalField("vehicleDetails", true);
    } else {
      toggleConditionalField("vehicleDetails", false);
    }

    if (formData.hasLogisticsExperience === true) {
      toggleConditionalField("experienceDetails", true);
    } else {
      toggleConditionalField("experienceDetails", false);
    }

    if (formData.hasOtherFranchise === true) {
      toggleConditionalField("franchiseDetails", true);
    } else {
      toggleConditionalField("franchiseDetails", false);
    }

    if (formData.hasLegalIssues === true) {
      toggleConditionalField("legalDetails", true);
    } else {
      toggleConditionalField("legalDetails", false);
    }
  }, [
    formData.hasLoans,
    formData.hasCommercialVehicles,
    formData.hasLogisticsExperience,
    formData.hasOtherFranchise,
    formData.hasLegalIssues,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Toast Notification */}
      {showToast.show && (
        <div
          className={`fixed top-6 right-6 p-4 rounded-lg shadow-xl z-50 
      transform transition-all duration-300 ease-in-out
      ${
        showToast.type === "success"
          ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
          : "bg-gradient-to-r from-red-500 to-red-600 text-white"
      }
    `}
        >
          <div className="flex items-center space-x-2">
            {showToast.type === "success" ? (
              <i className="fas fa-check-circle text-lg"></i>
            ) : (
              <i className="fas fa-exclamation-circle text-lg"></i>
            )}
            <span className="text-sm font-medium">{showToast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-indigo-700 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img
              src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
              alt="VALMO"
              className="h-8"
            />
            <h1 className="text-2xl font-bold">VALMO Logistics</h1>
          </div>
          <div className="text-center md:text-right">
            <div className="text-sm">
              Application No:{" "}
              <span className="font-mono">{applicationNumber}</span>
            </div>
            {agentInfo && (
              <div className="text-xs mt-1">
                <p>
                  Referred by: <strong>{agentInfo.agentName}</strong>
                </p>
                <p>Agent ID: {agentInfo.agentId}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="form-container max-w-4xl mx-auto overflow-hidden">
          {/* Company Header */}
          <div className="company-header text-white py-8 px-8 text-center relative">
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <img
                    src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
                    alt="VALMO"
                    className="h-8 w-8"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">VALMO</h1>
                  <p className="text-blue-100">Franchise Application</p>
                </div>
              </div>
              <p className="text-blue-100 text-sm">
                Join India's Leading Logistics Network
              </p>
            </div>
          </div>

          <form onSubmit={submitForm} className="p-8">
            {/* Section 1: Personal Information */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-user-circle mr-3 text-blue-600"></i> Personal
              Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name*
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="fatherHusbandName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Father's/Husband's Name*
                </label>
                <input
                  type="text"
                  id="fatherHusbandName"
                  name="fatherHusbandName"
                  value={formData.fatherHusbandName || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.fatherHusbandName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.fatherHusbandName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fatherHusbandName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth*
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender*
                </label>
                <div className="flex space-x-4">
                  {["Male", "Female", "Other"].map((gender) => (
                    <label key={gender} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === gender}
                        onChange={() => handleRadioChange("gender", gender)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{gender}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="nationality"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nationality*
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={"Indian"}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.nationality ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nationality && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nationality}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status*
                </label>
                <div className="flex space-x-4">
                  {["Single", "Married", "Other"].map((status) => (
                    <label key={status} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="maritalStatus"
                        checked={formData.maritalStatus === status}
                        onChange={() =>
                          handleRadioChange("maritalStatus", status)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
                {errors.maritalStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maritalStatus}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="panNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PAN Number*
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase ${
                    errors.panNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.panNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.panNumber}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="aadharNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Aadhar Number*
                </label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.aadharNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.aadharNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.aadharNumber}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="passportNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Passport Number*
                </label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.passportNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.passportNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.passportNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Passport Photo Upload Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-camera mr-2 text-indigo-600"></i> Passport
                Size Photo
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Photo Preview */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Passport Photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user text-gray-400 text-4xl"></i>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <label
                    htmlFor="passportPhoto"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload Passport Size Photo*
                  </label>
                  <input
                    type="file"
                    id="passportPhoto"
                    name="passportPhoto"
                    accept="image/*"
                    ref={fileInputRefs.passportPhoto}
                    onChange={handlePhotoUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Please upload a clear passport-size photograph (JPG, PNG,
                    max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Details */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-address-book mr-2 text-indigo-600"></i>{" "}
              Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number*
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="alternateMobileNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alternate Mobile Number*
                </label>
                <input
                  type="tel"
                  id="alternateMobileNumber"
                  name="alternateMobileNumber"
                  value={formData.alternateMobileNumber || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.alternateMobileNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.alternateMobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.alternateMobileNumber}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email ID*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Mode of Communication*
                </label>
                <div className="flex flex-col space-y-2">
                  {["Phone", "Email", "WhatsApp"].map((mode) => (
                    <label key={mode} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="preferredCommunication"
                        checked={formData.preferredCommunication === mode}
                        onChange={() =>
                          handleRadioChange("preferredCommunication", mode)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{mode}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredCommunication && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.preferredCommunication}
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Residential Address */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-home mr-2 text-indigo-600"></i> Residential
              Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="md:col-span-2">
                <label
                  htmlFor="residentialStreet"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  House No./Street*
                </label>
                <input
                  type="text"
                  id="residentialStreet"
                  name="residentialStreet"
                  value={formData.residentialStreet || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.residentialStreet
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.residentialStreet && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.residentialStreet}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="residentialCity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City*
                </label>
                <input
                  type="text"
                  id="residentialCity"
                  name="residentialCity"
                  value={formData.residentialCity || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.residentialCity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.residentialCity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.residentialCity}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="residentialDistrict"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  District*
                </label>
                <input
                  type="text"
                  id="residentialDistrict"
                  name="residentialDistrict"
                  value={formData.residentialDistrict || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.residentialDistrict
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.residentialDistrict && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.residentialDistrict}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="residentialState"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State*
                </label>
                <input
                  type="text"
                  id="residentialState"
                  name="residentialState"
                  value={formData.residentialState || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.residentialState
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.residentialState && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.residentialState}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="residentialPinCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PIN Code*
                </label>
                <input
                  type="text"
                  id="residentialPinCode"
                  name="residentialPinCode"
                  value={formData.residentialPinCode || ""}
                  onChange={handleInputChange}
                  onBlur={(e) =>
                    fetchPincodeDetails(e.target.value, "residential")
                  }
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.residentialPinCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.residentialPinCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.residentialPinCode}
                  </p>
                )}
              </div>
            </div>

            {/* Section 4: Business Information */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-briefcase mr-2 text-indigo-600"></i> Business
              Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Name (if applicable)*
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.businessName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Business*
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Sole Proprietor",
                    "Partnership",
                    "Private Ltd",
                    "LLP",
                    "Other",
                  ].map((type) => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="businessType"
                        checked={formData.businessType === type}
                        onChange={() => handleRadioChange("businessType", type)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.businessType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessType}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="gstNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  GST Number (if applicable)*
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase ${
                    errors.gstNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.gstNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gstNumber}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="officeAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Office Address*
                </label>
                <input
                  type="text"
                  id="officeAddress"
                  name="officeAddress"
                  value={formData.officeAddress || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.officeAddress ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.officeAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.officeAddress}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="officeCity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City*
                </label>
                <input
                  type="text"
                  id="officeCity"
                  name="officeCity"
                  value={formData.officeCity || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.officeCity ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.officeCity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.officeCity}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="officeDistrict"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  District*
                </label>
                <input
                  type="text"
                  id="officeDistrict"
                  name="officeDistrict"
                  value={formData.officeDistrict || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.officeDistrict ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.officeDistrict && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.officeDistrict}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="officeState"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State*
                </label>
                <input
                  type="text"
                  id="officeState"
                  name="officeState"
                  value={formData.officeState || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.officeState ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.officeState && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.officeState}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="officePinCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PIN Code*
                </label>
                <input
                  type="text"
                  id="officePinCode"
                  name="officePinCode"
                  value={formData.officePinCode || ""}
                  onChange={handleInputChange}
                  onBlur={(e) => fetchPincodeDetails(e.target.value, "office")}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.officePinCode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.officePinCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.officePinCode}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="numberOfEmployees"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Employees in Your Business (if applicable)*
                </label>
                <input
                  type="number"
                  id="numberOfEmployees"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees || ""}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.numberOfEmployees
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.numberOfEmployees && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.numberOfEmployees}
                  </p>
                )}
              </div>
            </div>

            {/* Section 5: Franchise Location Details */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-map-marker-alt mr-2 text-indigo-600"></i>{" "}
              Franchise Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label
                  htmlFor="franchisePinCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preferred PIN Code for Franchise*
                </label>
                <input
                  type="text"
                  id="franchisePinCode"
                  name="franchisePinCode"
                  value={formData.franchisePinCode || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.franchisePinCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.franchisePinCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.franchisePinCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you own or rent the business premises?*
                </label>
                <div className="flex space-x-4">
                  {["Own", "Rent"].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="premisesOwnership"
                        checked={formData.premisesOwnership === option}
                        onChange={() =>
                          handleRadioChange("premisesOwnership", option)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.premisesOwnership && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.premisesOwnership}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="totalSpace"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Total Available Space for Franchise (sq. ft.)*
                </label>
                <input
                  type="number"
                  id="totalSpace"
                  name="totalSpace"
                  value={formData.totalSpace || ""}
                  onChange={handleInputChange}
                  required
                  min="100"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.totalSpace ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.totalSpace && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.totalSpace}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="warehouseSpace"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Warehouse Space (if any) (sq. ft.)*
                </label>
                <input
                  type="number"
                  id="warehouseSpace"
                  name="warehouseSpace"
                  value={formData.warehouseSpace || ""}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.warehouseSpace ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.warehouseSpace && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.warehouseSpace}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parking Facility Available?*
                </label>
                <div className="flex space-x-4">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="parkingFacility"
                        checked={formData.parkingFacility === option}
                        onChange={() =>
                          handleRadioChange("parkingFacility", option)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.parkingFacility && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.parkingFacility}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Office Setup Availability*
                </label>
                <div className="flex flex-col space-y-2">
                  {[
                    "Fully Furnished",
                    "Partially Furnished",
                    "Unfurnished",
                  ].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="officeSetup"
                        checked={formData.officeSetup === option}
                        onChange={() =>
                          handleRadioChange("officeSetup", option)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.officeSetup && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.officeSetup}
                  </p>
                )}
              </div>
            </div>

            {/* Section 6: Investment & Financial Information */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-rupee-sign mr-2 text-indigo-600"></i>{" "}
              Investment & Financial Information
            </h2>
            <div className="bg-indigo-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                Registration & Fees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Registration Fee</p>
                  <p className="text-lg font-bold">₹18,600</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Security Money</p>
                  <p className="text-lg font-bold">
                    90% refundable after the agreement
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">
                    Interest Earned on Security Deposit
                  </p>
                  <p className="text-lg font-bold">7.5% annually</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">One-time Setup Fee</p>
                  <p className="text-lg font-bold">
                    ₹2,00,000 (lifetime investment)
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Agreement Fee</p>
                  <p className="text-lg font-bold">
                    ₹90,100 (fully refundable)
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Capacity*
                </label>
                <div className="flex flex-col space-y-2">
                  {[
                    "Below ₹5 Lakhs",
                    "₹5-10 Lakhs",
                    "₹10-20 Lakhs",
                    "Above ₹20 Lakhs",
                  ].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="investmentCapacity"
                        checked={formData.investmentCapacity === option}
                        onChange={() =>
                          handleRadioChange("investmentCapacity", option)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.investmentCapacity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.investmentCapacity}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source of Investment*
                </label>
                <div className="flex flex-col space-y-2">
                  {["Self-Funded", "Loan", "Business Partner", "Other"].map(
                    (option) => (
                      <label key={option} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="investmentSource"
                          checked={formData.investmentSource === option}
                          onChange={() =>
                            handleRadioChange("investmentSource", option)
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                    )
                  )}
                </div>
                {errors.investmentSource && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.investmentSource}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you have existing loans or liabilities?*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLoans"
                      checked={formData.hasLoans === true}
                      onChange={() => handleRadioChange("hasLoans", true)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLoans"
                      checked={formData.hasLoans === false}
                      onChange={() => handleRadioChange("hasLoans", false)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
                {errors.hasLoans && (
                  <p className="text-red-500 text-sm mt-1">{errors.hasLoans}</p>
                )}
              </div>
              {conditionalFields.loanDetails && (
                <div>
                  <label
                    htmlFor="loanDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Loan/Liability Details*
                  </label>
                  <textarea
                    id="loanDetails"
                    name="loanDetails"
                    value={formData.loanDetails || ""}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.loanDetails ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.loanDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.loanDetails}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="expectedRevenue"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expected Monthly Revenue from Franchise (Approx.)*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="expectedRevenue"
                    name="expectedRevenue"
                    value={formData.expectedRevenue || ""}
                    onChange={handleInputChange}
                    min="0"
                    className={`block w-full pl-8 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.expectedRevenue
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">.00</span>
                  </div>
                </div>
                {errors.expectedRevenue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expectedRevenue}
                  </p>
                )}
              </div>
            </div>

            {/* Section 7: Logistics & Operational Readiness */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <img
                src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
                alt="VALMO"
                className="h-5 w-5 mr-2 filter invert"
              />
              Logistics & Operational Readiness
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you own commercial vehicles for logistics?*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasCommercialVehicles"
                      checked={formData.hasCommercialVehicles === true}
                      onChange={() =>
                        handleRadioChange("hasCommercialVehicles", true)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasCommercialVehicles"
                      checked={formData.hasCommercialVehicles === false}
                      onChange={() =>
                        handleRadioChange("hasCommercialVehicles", false)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
                {errors.hasCommercialVehicles && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hasCommercialVehicles}
                  </p>
                )}
              </div>
              {conditionalFields.vehicleDetails && (
                <div>
                  <label
                    htmlFor="vehicleDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Vehicle Details*
                  </label>
                  <textarea
                    id="vehicleDetails"
                    name="vehicleDetails"
                    value={formData.vehicleDetails || ""}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.vehicleDetails
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.vehicleDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vehicleDetails}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Are you familiar with logistics and transportation
                  operations?*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isFamiliarWithLogistics"
                      checked={formData.isFamiliarWithLogistics === true}
                      onChange={() =>
                        handleRadioChange("isFamiliarWithLogistics", true)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isFamiliarWithLogistics"
                      checked={formData.isFamiliarWithLogistics === false}
                      onChange={() =>
                        handleRadioChange("isFamiliarWithLogistics", false)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
                {errors.isFamiliarWithLogistics && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.isFamiliarWithLogistics}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you have experience with courier/logistics services?*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLogisticsExperience"
                      checked={formData.hasLogisticsExperience === true}
                      onChange={() =>
                        handleRadioChange("hasLogisticsExperience", true)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLogisticsExperience"
                      checked={formData.hasLogisticsExperience === false}
                      onChange={() =>
                        handleRadioChange("hasLogisticsExperience", false)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
                {errors.hasLogisticsExperience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hasLogisticsExperience}
                  </p>
                )}
              </div>
              {conditionalFields.experienceDetails && (
                <div>
                  <label
                    htmlFor="experienceDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Details*
                  </label>
                  <textarea
                    id="experienceDetails"
                    name="experienceDetails"
                    value={formData.experienceDetails || ""}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.experienceDetails
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.experienceDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.experienceDetails}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="staffCount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Staff You Can Employ for the Franchise*
                </label>
                <input
                  type="number"
                  id="staffCount"
                  name="staffCount"
                  value={formData.staffCount || ""}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.staffCount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.staffCount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.staffCount}
                  </p>
                )}
              </div>
            </div>

            {/* Section 8: Qualification Details */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-graduation-cap mr-2 text-indigo-600"></i>
              Qualification Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highest Educational Qualification*
                </label>
                <div className="flex flex-col space-y-2">
                  {[
                    "10th Pass",
                    "12th Pass",
                    "Diploma",
                    "Graduate",
                    "Postgraduate",
                    "Other",
                  ].map((qualification) => (
                    <label
                      key={qualification}
                      className="inline-flex items-center"
                    >
                      <input
                        type="radio"
                        name="education"
                        checked={formData.education === qualification}
                        onChange={() =>
                          handleRadioChange("education", qualification)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">
                        {qualification}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.education && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.education}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="professionalBackground"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Professional Background (if any)*
                </label>
                <textarea
                  id="professionalBackground"
                  name="professionalBackground"
                  value={formData.professionalBackground || ""}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.professionalBackground
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                ></textarea>
                {errors.professionalBackground && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.professionalBackground}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="certifications"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Relevant Certifications (if any)*
                </label>
                <textarea
                  id="certifications"
                  name="certifications"
                  value={formData.certifications || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.certifications ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.certifications && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.certifications}
                  </p>
                )}
              </div>
            </div>

            {/* Section 9: Past Business Experience & References */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-history mr-2 text-indigo-600"></i> Past
              Business Experience & References
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you currently own any other franchise?*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasOtherFranchise"
                      checked={formData.hasOtherFranchise === true}
                      onChange={() =>
                        handleRadioChange("hasOtherFranchise", true)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasOtherFranchise"
                      checked={formData.hasOtherFranchise === false}
                      onChange={() =>
                        handleRadioChange("hasOtherFranchise", false)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
                {errors.hasOtherFranchise && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hasOtherFranchise}
                  </p>
                )}
              </div>
              {conditionalFields.franchiseDetails && (
                <div>
                  <label
                    htmlFor="franchiseDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name*
                  </label>
                  <input
                    type="text"
                    id="franchiseDetails"
                    name="franchiseDetails"
                    value={formData.franchiseDetails || ""}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.franchiseDetails
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.franchiseDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.franchiseDetails}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Have you been involved in any business disputes or legal
                  issues?*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLegalIssues"
                      checked={formData.hasLegalIssues === true}
                      onChange={() => handleRadioChange("hasLegalIssues", true)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLegalIssues"
                      checked={formData.hasLegalIssues === false}
                      onChange={() =>
                        handleRadioChange("hasLegalIssues", false)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
                {errors.hasLegalIssues && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hasLegalIssues}
                  </p>
                )}
              </div>
              {conditionalFields.legalDetails && (
                <div>
                  <label
                    htmlFor="legalDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Details*
                  </label>
                  <textarea
                    id="legalDetails"
                    name="legalDetails"
                    value={formData.legalDetails || ""}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.legalDetails ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.legalDetails && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.legalDetails}
                    </p>
                  )}
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
              Business References
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Reference 1
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="reference1Name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name*
                    </label>
                    <input
                      type="text"
                      id="reference1Name"
                      name="reference1Name"
                      value={formData.reference1Name || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.reference1Name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.reference1Name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference1Name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="reference1Contact"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact No.*
                    </label>
                    <input
                      type="tel"
                      id="reference1Contact"
                      name="reference1Contact"
                      value={formData.reference1Contact || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.reference1Contact
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.reference1Contact && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference1Contact}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="reference1Relationship"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Relationship*
                    </label>
                    <input
                      type="text"
                      id="reference1Relationship"
                      name="reference1Relationship"
                      value={formData.reference1Relationship || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.reference1Relationship
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.reference1Relationship && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference1Relationship}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Reference 2
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="reference2Name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name*
                    </label>
                    <input
                      type="text"
                      id="reference2Name"
                      name="reference2Name"
                      value={formData.reference2Name || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.reference2Name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.reference2Name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference2Name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="reference2Contact"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact No.*
                    </label>
                    <input
                      type="tel"
                      id="reference2Contact"
                      name="reference2Contact"
                      value={formData.reference2Contact || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.reference2Contact
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.reference2Contact && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference2Contact}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="reference2Relationship"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Relationship*
                    </label>
                    <input
                      type="text"
                      id="reference2Relationship"
                      name="reference2Relationship"
                      value={formData.reference2Relationship || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.reference2Relationship
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.reference2Relationship && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference2Relationship}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 10: Bank Details */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-university mr-2 text-indigo-600"></i> Bank
              Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bank Name*
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.bankName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="bankBranch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Branch*
                </label>
                <input
                  type="text"
                  id="bankBranch"
                  name="bankBranch"
                  value={formData.bankBranch || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.bankBranch ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.bankBranch && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bankBranch}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="accountHolderName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Holder's Name*
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.accountHolderName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.accountHolderName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountHolderName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Number*
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.accountNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountNumber}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="ifscCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  IFSC Code*
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase ${
                    errors.ifscCode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="upiId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  UPI ID (if any)*
                </label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={formData.upiId || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.upiId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.upiId && (
                  <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                )}
              </div>
            </div>

            {/* Section 11: Document Upload */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-file-upload mr-2 text-indigo-600"></i>{" "}
              Document Upload
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="file-upload-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Card*
                </label>
                <div className="file-upload relative p-6 text-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg">
                  <input
                    type="file"
                    id="panCard"
                    name="panCard"
                    required
                    ref={fileInputRefs.panCard}
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload("panCard", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <i className="fas fa-cloud-upload-alt text-4xl text-indigo-500 mb-2"></i>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 5MB
                  </p>
                  {filePreviews.panCard && (
                    <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded">
                      <div className="flex items-center">
                        <i className="fas fa-file text-indigo-500 mr-2"></i>
                        <span className="text-sm text-gray-700 truncate">
                          {filePreviews.panCard.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("panCard")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="file-upload-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Card Frontend*
                </label>
                <div className="file-upload relative p-6 text-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg">
                  <input
                    type="file"
                    id="aadharCard"
                    name="aadharCard"
                    required
                    ref={fileInputRefs.aadharCard}
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload("aadharCard", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <i className="fas fa-cloud-upload-alt text-4xl text-indigo-500 mb-2"></i>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 5MB
                  </p>
                  {filePreviews.aadharCard && (
                    <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded">
                      <div className="flex items-center">
                        <i className="fas fa-file text-indigo-500 mr-2"></i>
                        <span className="text-sm text-gray-700 truncate">
                          {filePreviews.aadharCard.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("aadharCard")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="file-upload-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Card Backside*
                </label>
                <div className="file-upload relative p-6 text-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg">
                  <input
                    type="file"
                    id="passport"
                    name="passport"
                    required
                    ref={fileInputRefs.passport}
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload("passport", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <i className="fas fa-cloud-upload-alt text-4xl text-indigo-500 mb-2"></i>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 5MB
                  </p>
                  {filePreviews.passport && (
                    <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded">
                      <div className="flex items-center">
                        <i className="fas fa-file text-indigo-500 mr-2"></i>
                        <span className="text-sm text-gray-700 truncate">
                          {filePreviews.passport.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("passport")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="file-upload-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank passbook /cheque*
                </label>
                <div className="file-upload relative p-6 text-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg">
                  <input
                    type="file"
                    id="cancelledCheque"
                    name="cancelledCheque"
                    ref={fileInputRefs.cancelledCheque}
                    accept="image/*,.pdf"
                    required
                    onChange={(e) => handleFileUpload("cancelledCheque", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <i className="fas fa-cloud-upload-alt text-4xl text-indigo-500 mb-2"></i>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 5MB
                  </p>
                  {filePreviews.cancelledCheque && (
                    <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded">
                      <div className="flex items-center">
                        <i className="fas fa-file text-indigo-500 mr-2"></i>
                        <span className="text-sm text-gray-700 truncate">
                          {filePreviews.cancelledCheque.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("cancelledCheque")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 12: Review & Submit Content */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-check-circle mr-2 text-indigo-600"></i> Final
              Review & Declaration
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Terms & Conditions
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-sm max-h-64 overflow-y-auto">
                <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-700">
                  <li>
                    The applicant must meet the minimum space and investment
                    requirements as set by Volmo Logistics.
                  </li>
                  <li>
                    The franchisee is responsible for obtaining all necessary
                    local business permits and legal clearances.
                  </li>
                  <li>
                    The franchisee must operate under Volmo Logistics' branding,
                    policies, and operational guidelines.
                  </li>
                  <li>
                    Any false or misleading information provided in this form
                    may lead to disqualification.
                  </li>
                  <li>
                    The franchisee must maintain a minimum monthly operational
                    standard as per company requirements.
                  </li>
                  <li>
                    Volmo Logistics reserves the right to terminate the
                    franchise agreement if performance benchmarks are not met.
                  </li>
                  <li>
                    The franchisee must not engage in any competing business
                    that directly affects Volmo Logistics' operations.
                  </li>
                  <li>
                    The investment amount is refundable, except for the
                    registration fee of ₹18,600.
                  </li>
                  <li>
                    The security deposit earns 7.5% annual interest, and 90% of
                    it is refundable after the agreement period.
                  </li>
                  <li>
                    Any legal disputes will be resolved under the jurisdiction
                    of Bangalore, Karnataka.
                  </li>
                </ol>
              </div>
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms || false}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">
                    I agree to the terms and conditions*
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Disclaimer
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-sm max-h-64 overflow-y-auto">
                <ul className="list-disc pl-5 space-y-3 text-sm text-gray-700">
                  <li>
                    Submission of this application does not guarantee approval
                    of the franchise.
                  </li>
                  <li>
                    Volmo Logistics reserves the right to verify the information
                    provided and conduct background checks.
                  </li>
                  <li>
                    The company is not liable for any investment made before
                    official franchise approval.
                  </li>
                  <li>
                    The one-time setup fee, agreement fee, and security deposit
                    are fully refundable, except for the registration fee.
                  </li>
                  <li>
                    The security deposit earns an annual interest of 7.5%.
                  </li>
                  <li>
                    Any changes to policies, investment requirements, or
                    operational guidelines will be communicated in writing.
                  </li>
                  <li>
                    Any legal disputes or disagreements will be subject to the
                    jurisdiction of Bangalore, Karnataka.
                  </li>
                  <li>
                    This form and its contents remain the property of Volmo
                    Logistics and must not be copied or shared without
                    permission.
                  </li>
                </ul>
              </div>
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="agreeDisclaimer"
                    name="agreeDisclaimer"
                    checked={formData.agreeDisclaimer || false}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">
                    I have read and understood the disclaimer*
                  </span>
                </label>
                {errors.agreeDisclaimer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.agreeDisclaimer}
                  </p>
                )}
              </div>
            </div>

            {/* Final Submit Button (Centered) */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center font-semibold text-lg shadow-lg ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-3"></i>{" "}
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-3"></i> Submit
                    Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <i className="fas fa-envelope text-blue-400"></i>
                <span className="text-sm">support@valmodeliver.in</span>
              </div>
              <p className="text-xs">© 2025 Valmo. All rights reserved.</p>
              <p className="text-xs text-gray-500 mt-1">
                Application Number:{" "}
                <span className="font-mono">{applicationNumber}</span>
              </p>
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
    </div>
  );
};

export default Form;
