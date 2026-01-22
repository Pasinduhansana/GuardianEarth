import React, { useEffect, useState, useRef, useContext } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import uploadimg from "../assets/Icons/cloud-add.png";
import CheckoutForm from "../Components/disaster-funding/Checkout";
import toast from "react-hot-toast";
import earth_img from "../assets/Earth.webp";
import BankSelector from "../Components/disaster-funding/Bank-Selector";
import { AuroraBackground } from "../Components/ui/aurora-background";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { AlertCircle, Globe, Users, DollarSign, Clock, Shield, Heart, MapPin, Calendar, X, BadgeCheck, XCircle } from "lucide-react";

const stripePromise = loadStripe("pk_test_51QyzW0F1MqlTWE7FVvTcRhf9uQFUPTOp9d3PdQ99tsftMm8mpJr71Eu8hohiAYUu3Ruf80xMXceVVzLrRIv1dZDG003Us4ou4b");

function Payment() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [depositBranch, setDepositBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [branchError, setbranchError] = useState("");
  const [Amounterror, setAmountError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [payments, setPayments] = useState([]);
  const [SlipImage, setSlipImage] = useState("");

  const { isAuthenticated, user } = useContext(AuthContext);
  const user_ID = user?.id;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).filter((file) => [".png", ".pdf"].includes(file.name.slice(-4).toLowerCase()));
    setSelectedFiles(files);
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/user/${user_ID}`);
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPayments = () => {
    fetchPayments();
  };

  useEffect(() => {
    document.title = "Guardian Earth";

    const fetchDisasters = async () => {
      const response = await fetch(`${API_BASE_URL}/api/disaster`);
      const data = await response.json();
      setDisasters(data.disasters || []);
    };

    if (user_ID) {
      fetchPayments();
    }
    fetchDisasters();
  }, [user_ID]);

  const clearFields = () => {
    setFullName("");
    setBankName("");
    setDepositBranch("");
    setAmount("");
    setSelectedFiles([]);
    setNameError("");
    setbranchError("");
    setAmountError("");
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!user_ID) {
      setMessage("User not logged in.");
      toast.error("User not logged in.");
      return;
    }

    if (!fullName || !depositBranch || !bankName || !amount) {
      setMessage("All fields are required!");
      return;
    }
    // Checking the file uploaded
    if (selectedFiles.length === 0) {
      setMessage("No file selected. Please upload a file before proceeding.");
      return;
    }

    if (!nameError == "") {
      setMessage(nameError);
      return;
    } else if (!branchError == "") {
      setMessage(branchError);
      return;
    } else if (amount < 100 && amount) {
      setMessage(Amounterror);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });

      let fileName = "";

      try {
        const response = await fetch(`${API_BASE_URL}/api/uploadfile`, {
          // Updated endpoint
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.url) {
          console.log("File uploaded successfully:", data.url);
          fileName = data.url;
        } else {
          toast.error("Failed to upload file.");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file.");
        setLoading(false);
        return;
      }

      if (!fileName) {
        toast.error("File upload failed. Please try again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/payment/verify-bank-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_ID,
          username: fullName,
          email: "Pasinduh@inqube.com",
          amount: amount,
          bankname: bankName,
          branch: depositBranch,
          currency: "USD",
          slipImage: fileName,
        }),
      });

      const result = await response.json();
      const payment_Id = result.paymentId;

      if (response.ok) {
        const responsemail = await fetch(`${API_BASE_URL}/api/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: payment_Id,
            username: fullName,
            email: "Pasinduh@inqube.com",
            amount: amount,
            bankname: bankName,
            branch: depositBranch,
            currency: "USD",
            slipImage: fileName,
          }),
        });

        const emailResult = await responsemail.json();

        if (responsemail.ok) {
          toast.success("Payment submitted and email sent successfully!");
          clearFields();
          refreshPayments();
        } else {
          toast.error(emailResult.error || "Failed to send email.");
        }
      } else {
        setMessage(result.error || "Something went wrong!");
      }
    } catch (error) {
      setLoading(false);
      setMessage("Error submitting payment. " + error);
      toast.error("Error submitting payment. " + error);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  // Name Validation Name
  const validateName = (fullName) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
    return nameRegex.test(fullName);
  };

  // Name Validation Branch
  const validateBranch = (depositBranch) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
    return nameRegex.test(depositBranch);
  };

  const validateAmount = (value) => {
    const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/; // Allows only numbers and up to 2 decimal places
    return amountRegex.test(value);
  };

  // Handle name Input Change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);

    if (!value) {
      setNameError("Name is required.");
    } else if (!validateName(value)) {
      setNameError("Only letters and spaces are allowed.");
    } else if (value.trim().length < 4) {
      setNameError("Name must be at least 4 characters long.");
    } else {
      if (message == nameError) {
        setMessage("");
      }
      setNameError("");
    }
  };

  // Handle Branch Input Change
  const handleBranchChange = (e) => {
    const value = e.target.value;
    setDepositBranch(value);

    if (!value) {
      setbranchError("Branch is required.");
    } else if (!validateBranch(value)) {
      setbranchError("Branch must contains Only letters and spaces.");
    } else if (value.trim().length < 4) {
      setbranchError("Branch must be at least 4 characters long.");
    } else {
      if (message == branchError) {
        setMessage("");
      }
      setbranchError("");
    }
  };

  const handleKeyDown = (e) => {
    if (["e", "E", "-", "+", ".", ",", "=", "/"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Handle Amount Input Change
  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Prevent non-numeric input
    if (value < 100) {
      setAmountError("Amount must be a positive number and at least $100.");
      setAmount(value);
    } else if (!value === "" && validateAmount(value)) {
      setAmount(value);
      setAmountError(""); // Clear error if valid
      setMessage("");
    } else {
      setAmount(value);
      setAmountError("Please enter a valid positive number.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute inset-0 -z-10">
        <AuroraBackground />
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1800px] relative z-10">
        <div className="flex gap-6">
          {/* Left Sidebar - Disaster List */}
          <div className="min-w-[380px] w-[380px]">
            {selectedDisaster ? (
              // Disaster Details View
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-5 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedDisaster.disasterType}</h2>
                  <button
                    onClick={() => setSelectedDisaster(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="h-[180px] rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={selectedDisaster.images}
                      alt={`Map showing location of ${selectedDisaster.Location || "this disaster"}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div className="flex flex-col text-left">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Disaster Date</p>
                        <p className="text-base font-medium text-gray-900">
                          {new Date(selectedDisaster.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div className="flex flex-col text-left">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="text-base font-medium text-gray-900">{selectedDisaster.Location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div className="flex flex-col text-left">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">People Affected</p>
                        <p className="text-base font-medium text-gray-900">{selectedDisaster.numberOfPeopleAffected.toLocaleString()} people</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div className="flex flex-col text-left">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Severity Level</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-semibold mt-1 w-fit ${
                            selectedDisaster.severityLevel === "High"
                              ? "bg-red-100 text-red-700"
                              : selectedDisaster.severityLevel === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {selectedDisaster.severityLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                    <p className="text-base text-gray-700 leading-relaxed text-left">{selectedDisaster.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              // Disaster List View
              <div className="bg-white rounded-lg shadow-sm p-6 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                <div className="text-left mb-5 border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-900">Active Disasters</h2>
                  <p className="text-base font-normal text-gray-500 mt-1">Select a disaster to view details and make a donation</p>
                </div>
                <div className="space-y-4">
                  {disasters.map((disaster) => (
                    <div
                      key={disaster._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white group"
                      onClick={() => setSelectedDisaster(disaster)}
                    >
                      {/* Disaster Header */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                          {disaster.disasterType}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-base font-semibold ${
                            disaster.severityLevel === "High"
                              ? "bg-red-100 text-red-700"
                              : disaster.severityLevel === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {disaster.severityLevel}
                        </span>
                      </div>

                      {/* Disaster Image */}
                      <div className="relative h-[140px] rounded-md overflow-hidden mb-3">
                        <img
                          src={disaster.images}
                          alt={`Image of ${disaster.disasterType}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-base px-2 py-1 rounded-md">
                          {new Date(disaster.date).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Disaster Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <p className="text-base text-gray-600 text-left truncate">{disaster.Location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <p className="text-base text-gray-600">{disaster.numberOfPeopleAffected.toLocaleString()} people affected</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Payment Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
                    <p className="text-base font-normal text-gray-500 mt-1.5 max-w-lg">
                      Your donation will help us provide emergency relief to families affected by disasters
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="bg-gray-100 p-1 gap-1 rounded-lg inline-flex border border-gray-200">
                      <button
                        className={`px-4 py-2 rounded-md text-base font-semibold transition-all ${
                          paymentMethod === "card" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        Card Payment
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-base font-semibold transition-all ${
                          paymentMethod === "bank" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() => setPaymentMethod("bank")}
                      >
                        Bank Transfer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Payment Form Section */}
              <div className="flex px-6 py-6">
                <div className="w-full max-w-3xl">
                  {paymentMethod === "card" ? (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm refreshPayments={refreshPayments} selectedDisaster={selectedDisaster} />
                    </Elements>
                  ) : (
                    <div className="space-y-5">
                      {/* Full Name */}
                      <div className="text-left">
                        <label className="block text-[12px] ml-3 font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={handleNameChange}
                          placeholder="Enter your full name"
                          className="w-full p-3 h-9 rounded-lg border text-[14px] focus:ring-0 focus:border-1 outline-none border-border-border1 focus:border-primary-light bg-gray-0 dark:bg-gray-800 text-text-primary dark:text-text-dark"
                        />
                        {nameError && (
                          <p className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {nameError}
                          </p>
                        )}
                      </div>

                      {/* Bank Selection */}
                      <div className="text-left">
                        <label className="block text-[12px] ml-3 font-semibold text-gray-700 mb-1">Select Bank</label>
                        <BankSelector bankName={bankName} setBankName={setBankName} />
                      </div>

                      {/* Branch Name */}
                      <div className="text-left">
                        <label className="block text-[12px] ml-3 font-semibold text-gray-700 mb-1">Branch Name</label>
                        <input
                          type="text"
                          value={depositBranch}
                          onChange={handleBranchChange}
                          placeholder="Enter branch name"
                          className="w-full p-3 h-9 rounded-lg border text-[14px] focus:ring-0 focus:border-1 outline-none border-border-border1 focus:border-primary-light bg-gray-0 dark:bg-gray-800 text-text-primary dark:text-text-dark"
                        />
                        {branchError && (
                          <p className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {branchError}
                          </p>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="text-left">
                        <label className="block text-[12px] ml-3 font-semibold text-gray-700 mb-1">Donation Amount (USD)</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={handleAmountChange}
                          onKeyDown={handleKeyDown}
                          className="w-full p-3 h-9 rounded-lg text-[14px] border focus:ring-0 focus:border-1 outline-none border-border-border1 focus:border-primary-light bg-gray-0 dark:bg-gray-800 text-text-primary dark:text-text-dark"
                          placeholder="$ 100.00"
                          min="100"
                        />
                        {amount < 100 && amount && (
                          <p className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {Amounterror}
                          </p>
                        )}
                      </div>

                      {/* Payment Slip Upload */}
                      <div className="text-left">
                        <label className="block text-[12px] ml-3 font-semibold text-gray-700 mb-1">Upload Payment Slip</label>
                        {selectedFiles.length === 0 ? (
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 group"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileChange} accept=".png,.jpg,.pdf" />
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                                <img src={uploadimg} alt="Upload" className="w-8 h-8 opacity-60 group-hover:opacity-100" />
                              </div>
                              <p className="text-base font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                              <p className="text-base text-gray-500">PNG, JPG or PDF (Max. 10MB)</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                  </div>
                                  <span className="text-base font-medium text-gray-900">{file.name}</span>
                                </div>
                                <button
                                  onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                                  className="text-red-500 hover:text-red-700 font-medium text-base hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {message && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-base flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {message}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isAuthenticated) {
                              toast.error("You must be logged in to make a payment.");
                              return;
                            }
                            if (!selectedDisaster) {
                              toast.error("Please select a disaster before submitting.");
                              return;
                            }
                            handleSubmit();
                          }}
                          className={`w-full bg-primary-light h-10 text-white rounded-lg font-semibold mt-6 transition duration-300 ${
                            loading ? "opacity-50" : "hover:bg-hover-light dark:hover:bg-hover-dark"
                          }`}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Submit Donation"}
                        </button>
                        <button
                          type="button"
                          onClick={clearFields}
                          className="w-full bg-white border border-gray-300 h-10 text-gray-700 rounded-lg font-semibold mt-6 transition duration-300 hover:bg-gray-50"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Funding Records Sidebar */}
                <div className="w-full max-w-[380px] border-l border-gray-200 pl-6">
                  <div className="bg-gray-50 rounded-lg p-5 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-300">
                      <h3 className="text-base font-bold text-gray-900">Payment History</h3>
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-emerald-700" />
                      </div>
                    </div>
                    {loading ? (
                      <div className="flex flex-col justify-center items-center h-40 gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                        <p className="text-gray-500 text-base">Loading payments...</p>
                      </div>
                    ) : payments.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-base font-medium">No payments found</p>
                        <p className="text-gray-400 text-base mt-1">Your donation history will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {payments.map((payment) => (
                          <div
                            key={payment._id}
                            className="px-4 py-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                          >
                            {/* Transaction Details */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col gap-1.5 text-left">
                                <div className="flex items-center gap-2 text-base">
                                  <span className="font-semibold text-gray-700">Transaction ID:</span>
                                  <span className="text-gray-500 font-mono">#{payment._id?.slice(-8) || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-base">
                                  <DollarSign className="w-4 h-4 text-emerald-600" />
                                  <span className="font-bold text-gray-900">${payment.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-base text-gray-500">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>
                                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <span
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-bold capitalize ${
                                  payment.status === "Successful"
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : payment.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                      : "bg-red-100 text-red-700 border border-red-200"
                                }`}
                              >
                                {payment.status === "Successful" && <BadgeCheck size={12} />}
                                {payment.status === "Pending" && <Clock size={12} />}
                                {payment.status === "Failed" && <XCircle size={12} />}
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
