import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

const SubscriberRegistration = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerificationStep, setEmailVerificationStep] = useState(1);

  const [formData, setFormData] = useState({
    applicantName: "",
    applicantDesignation: "",
    applicantAddress: "",
    applicantCity: "",
    applicantState: "",
    applicantCountry: "",
    applicantMobile: "",
    applicantEmail: "",
    organizationName: "",
    organizationAddress: "",
    organizationCity: "",
    organizationState: "",
    organizationCountry: "",
    organizationContactNumber: "",
    organizationEmail: "",
    conferenceTitle: "",
    conferenceDiscipline: "",
    conferenceCountry: "",
    conferenceEmail: "",
    authorizedSignatory: "",
  });

  const [paperId, setPaperId] = useState("");

  const createSubscriber = () => {
    const subscriber = {
      applicantName: formData.applicantName,
      applicantDesignation: formData.applicantDesignation,
      applicantAddress: formData.applicantAddress,
      applicantCity: formData.applicantCity,
      applicantState: formData.applicantState,
      applicantCountry: formData.applicantCountry,
      applicantMobile: formData.applicantMobile,
      applicantEmail: formData.applicantEmail,
      organizationName: formData.organizationName,
      organizationAddress: formData.organizationAddress,
      organizationCity: formData.organizationCity,
      organizationState: formData.organizationState,
      organizationCountry: formData.organizationCountry,
      organizationContactNumber: formData.organizationContactNumber,
      organizationEmail: formData.organizationEmail,
      conferenceTitle: formData.conferenceTitle,
      conferenceDiscipline: formData.conferenceDiscipline,
      conferenceCountry: formData.conferenceCountry,
      conferenceEmail: formData.conferenceEmail,
      authorizedSignatory: formData.authorizedSignatory,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSendOtp = async () => {
    // Validate that the conferenceEmail field is populated
    if (!formData.conferenceEmail) {
      alert("Please enter the Official Correspondence Email to send OTP.");
      return;
    }

    // Optional: Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.conferenceEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.conferenceEmail }),
      });

      if (response.ok) {
        setEmailVerificationStep(2); // Move to OTP verification step
        alert("OTP sent to your Official Correspondence Email.");
      } else {
        alert("Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending the OTP. Please try again later.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.conferenceEmail, otp }),
      });

      if (response.ok) {
        alert("Email verified successfully!");
        setEmailVerificationStep(3); // Mark email as verified
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  };

  const redirectToHome = () => {
    navigate("/select-conference");
    setShowPopup(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded bg-slate-50 max-w-5xl mt-5">
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Home Icon */}
            <div className="w-full flex justify-between items-center mb-4">
              <img
                src={homeIcon}
                alt="Home"
                className="w-8 h-8 cursor-pointer"
                onClick={redirectToHome}
              />
            </div>

            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg text-center">
                  <h2 className="text-xl font-semibold mb-4 text-green-600">
                    Your Paper is submitted successfully
                  </h2>
                  <p className="mb-4 text-xl font-medium">
                    <span style={{ color: "red" }}>*</span>Please note your
                    Paper ID for future reference.{paperId}
                  </p>
                  <button
                    onClick={handleRedirect}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Okay
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center text-4xl mb-4">
              <u>Subscriber Registration Form</u>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Applicant Section */}
              <section>
                <h2 className="text-lg font-semibold text-gray-700">
                  Applicant
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["Name", "applicantName"],
                    ["Designation", "applicantDesignation"],
                    ["Address", "applicantAddress"],
                    ["City", "applicantCity"],
                    ["State", "applicantState"],
                    ["Country", "applicantCountry"],
                    ["Mobile", "applicantMobile"],
                    ["Email", "applicantEmail"],
                  ].map(([label, name]) => (
                    <div key={name} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600">
                        {label}
                      </label>
                      <input
                        type={name.includes("Email") ? "email" : "text"}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Organization Section */}
              <section>
                <h2 className="text-lg font-semibold text-gray-700">
                  Organization
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["Name", "organizationName"],
                    ["Address", "organizationAddress"],
                    ["City", "organizationCity"],
                    ["State", "organizationState"],
                    ["Country", "organizationCountry"],
                    ["Contact Number", "organizationContactNumber"],
                    ["Email", "organizationEmail"],
                  ].map(([label, name]) => (
                    <div key={name} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600">
                        {label}
                      </label>
                      <input
                        type={name.includes("Email") ? "email" : "text"}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-700">
                  Conference
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Conference Fields */}
                  {[
                    ["Title of the Conference", "conferenceTitle"],
                    ["Discipline", "conferenceDiscipline"],
                    ["Country", "conferenceCountry"],
                    ["Official Correspondence Email", "conferenceEmail"],
                    ["Authorized Signatory", "authorizedSignatory"],
                  ].map(([label, name]) => (
                    <div key={name} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600">
                        {label}
                      </label>
                      <input
                        type={name.includes("Email") ? "email" : "text"}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      {/* Add the Send OTP button below the Official Correspondence Email */}
                      {name === "conferenceEmail" &&
                        emailVerificationStep === 1 && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Send OTP
                          </button>
                        )}

                      {/* Show OTP input and verification button */}
                      {name === "conferenceEmail" &&
                        emailVerificationStep === 2 && (
                          <div className="flex flex-col mt-2">
                            <label className="text-sm font-medium text-gray-600">
                              Enter OTP
                            </label>
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                              Verify OTP
                            </button>
                          </div>
                        )}

                      {/* Email verified message */}
                      {name === "conferenceEmail" &&
                        emailVerificationStep === 3 && (
                          <div className="mt-2 text-green-600 font-semibold">
                            Email Verified Successfully!
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberRegistration;
