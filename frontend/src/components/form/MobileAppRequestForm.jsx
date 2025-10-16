"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MobileAppRequestForm({onClose}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    appType: [],
    preferredFramework: "",
    mainFeatures: [],
    targetAudience: "",
    backendRequired: "",
    budgetRange: "",
    timeline: "",
    appDesignPreference: "",
    additionalNotes: "",
  });

  // Generate simple captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  // Initialize captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "appType") {
        setFormData((prev) => ({
          ...prev,
          appType: checked
            ? [...prev.appType, value]
            : prev.appType.filter((item) => item !== value),
        }));
      } else if (name === "mainFeatures") {
        setFormData((prev) => ({
          ...prev,
          mainFeatures: checked
            ? [...prev.mainFeatures, value]
            : prev.mainFeatures.filter((item) => item !== value),
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ validate current step fields before going next
  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          formData.fullName.trim() &&
          formData.email.trim() &&
          formData.phone.trim()
        );
      case 2:
        return formData.appType.length > 0 && formData.preferredFramework.trim();
      case 3:
        return formData.mainFeatures.length > 0;
      case 4:
        return formData.targetAudience.trim() && formData.backendRequired.trim();
      case 5:
        return formData.budgetRange.trim() && formData.timeline.trim();
      case 6:
        return formData.appDesignPreference.trim() && formData.additionalNotes.trim();
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    } else {
      alert("⚠️ Please fill all required fields before continuing.");
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate CAPTCHA
    if (captchaInput.toUpperCase() !== captcha) {
      alert("❌ CAPTCHA verification failed. Please try again.");
      generateCaptcha(); // Generate new captcha
      setCaptchaInput("");
      return;
    }

    // Prepare form data for submission
    const submissionData = {
      ...formData,
      backendRequired: formData.backendRequired === "true",
    };

    try {
      const res = await fetch("http://localhost:5000/api/mobile-app-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }
      alert("✅ Request submitted successfully!");
      console.log("Response:", data);
      // Redirect to home page after successful submission
      router.push("/");
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const steps = 6;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full relative max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold mb-4 text-center">
        Step {step} of {steps}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  value={formData.fullName}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  onChange={handleChange}
                  value={formData.email}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                  value={formData.phone}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">App Type *</label>
                <div className="space-y-2 mt-2">
                  {["iOS", "Android"].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        name="appType"
                        value={type}
                        checked={formData.appType.includes(type)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Preferred Framework *</label>
                <select
                  name="preferredFramework"
                  onChange={handleChange}
                  value={formData.preferredFramework}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Preferred Framework</option>
                  <option>React Native</option>
                  <option>Flutter</option>
                  <option>Native iOS</option>
                  <option>Native Android</option>
                  <option>Xamarin</option>
                  <option>Ionic</option>
                  <option>No Preference</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Main Features *</label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "User Registration/Login",
                    "Push Notifications",
                    "Payment Gateway",
                    "GPS/Location Services",
                    "Chat/Messaging",
                    "Camera/Photo Gallery",
                    "Social Media Integration",
                    "Offline Mode",
                    "Analytics",
                    "Admin Panel",
                  ].map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        name="mainFeatures"
                        value={feature}
                        checked={formData.mainFeatures.includes(feature)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Target Audience *</label>
                <textarea
                  name="targetAudience"
                  placeholder="Describe your target audience..."
                  onChange={handleChange}
                  value={formData.targetAudience}
                  className="w-full border p-2 rounded h-24"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Backend Required *</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backendRequired"
                      value="true"
                      checked={formData.backendRequired === "true"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backendRequired"
                      value="false"
                      checked={formData.backendRequired === "false"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range *</label>
                <select
                  name="budgetRange"
                  onChange={handleChange}
                  value={formData.budgetRange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Budget Range</option>
                  <option>$5,000 - $10,000</option>
                  <option>$10,000 - $25,000</option>
                  <option>$25,000 - $50,000</option>
                  <option>$50,000 - $100,000</option>
                  <option>$100,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Timeline *</label>
                <select
                  name="timeline"
                  onChange={handleChange}
                  value={formData.timeline}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Timeline</option>
                  <option>1-2 months</option>
                  <option>2-4 months</option>
                  <option>4-6 months</option>
                  <option>6-12 months</option>
                  <option>12+ months</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">App Design Preference *</label>
                <select
                  name="appDesignPreference"
                  onChange={handleChange}
                  value={formData.appDesignPreference}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Design Preference</option>
                  <option>Modern/Material Design</option>
                  <option>iOS Style</option>
                  <option>Custom Design</option>
                  <option>Minimalist</option>
                  <option>Colorful/Bold</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes *</label>
                <textarea
                  name="additionalNotes"
                  placeholder="Provide any additional details about your app requirements..."
                  onChange={handleChange}
                  value={formData.additionalNotes}
                  className="w-full border p-2 rounded h-32"
                />
              </div>

              {/* CAPTCHA */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Verify you're human</label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="bg-gray-100 p-2 rounded font-mono text-lg font-bold text-gray-800">
                    {captcha}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    ↻ Refresh
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter the code above"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                  required
                />
              </div>
            </>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}

            {step < steps ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(steps)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  step === i + 1 ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </form>
      </div>
    
  );
}
