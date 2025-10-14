"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WebsiteRequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    websiteType: "",
    preferredTechnology: "",
    numberOfPages: "",
    designStyle: "",
    budgetRange: "",
    projectDeadline: "",
    additionalRequirements: "",
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        return formData.businessName.trim() && formData.websiteType.trim();
      case 3:
        return (
          formData.preferredTechnology.trim() && formData.numberOfPages.trim()
        );
      case 4:
        return formData.designStyle.trim() && formData.budgetRange.trim();
      case 5:
        return formData.projectDeadline.trim();
      case 6:
        return formData.additionalRequirements.trim();
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

    try {
      const res = await fetch("http://localhost:5000/api/website-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        {/* Cut Icon */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter your business name"
                  onChange={handleChange}
                  value={formData.businessName}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Website Type *</label>
                <select
                  name="websiteType"
                  onChange={handleChange}
                  value={formData.websiteType}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Website Type</option>
                  <option>Portfolio</option>
                  <option>Business</option>
                  <option>E-commerce</option>
                  <option>Blog</option>
                  <option>Non-profit</option>
                  <option>Educational</option>
                  <option>Healthcare</option>
                  <option>Real Estate</option>
                  <option>Restaurant/Food</option>
                  <option>Other</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Preferred Technology *</label>
                <select
                  name="preferredTechnology"
                  onChange={handleChange}
                  value={formData.preferredTechnology}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Preferred Technology</option>
                  <option>WordPress</option>
                  <option>React</option>
                  <option>Next.js</option>
                  <option>Vue.js</option>
                  <option>Angular</option>
                  <option>Shopify</option>
                  <option>Wix</option>
                  <option>Custom Development</option>
                  <option>No Preference</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Number of Pages *</label>
                <input
                  type="text"
                  name="numberOfPages"
                  placeholder="e.g. 10-15"
                  onChange={handleChange}
                  value={formData.numberOfPages}
                  className="w-full border p-2 rounded"
                />
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Design Style *</label>
                <select
                  name="designStyle"
                  onChange={handleChange}
                  value={formData.designStyle}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Design Style</option>
                  <option>Modern</option>
                  <option>Minimal</option>
                  <option>Corporate</option>
                  <option>Creative</option>
                  <option>Professional</option>
                  <option>Elegant</option>
                  <option>Bold</option>
                  <option>Vintage</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range *</label>
                <select
                  name="budgetRange"
                  onChange={handleChange}
                  value={formData.budgetRange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Budget Range</option>
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $2,500</option>
                  <option>$2,500 - $5,000</option>
                  <option>$5,000 - $10,000</option>
                  <option>$10,000 - $25,000</option>
                  <option>$25,000+</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Project Deadline *</label>
                <input
                  type="date"
                  name="projectDeadline"
                  onChange={handleChange}
                  value={formData.projectDeadline}
                  className="w-full border p-2 rounded"
                />
              </div>
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Additional Requirements</label>
                <textarea
                  name="additionalRequirements"
                  placeholder="Describe any additional requirements..."
                  onChange={handleChange}
                  value={formData.additionalRequirements}
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
    </div>
  );
}
