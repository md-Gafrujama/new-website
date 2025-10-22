"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SaasProductForm({ onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    productIdea: "",
    targetAudience: "",
    coreFeatures: [],
    monetizationModel: [],
    preferredTechStack: "",
    scalabilityRequirements: [],
    integrationNeeds: [],
    budgetRange: "",
    projectTimeline: "",
    competitors: [],
    uniqueSellingProposition: "",
    hasExistingTeam: false,
    designPreferences: "",
    priority: "",
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
    const { name, value, type } = e.target;
    if (type === "radio") {
      setFormData({ ...formData, [name]: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
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
        return (
          formData.businessName.trim() &&
          formData.productIdea.trim() &&
          formData.targetAudience.trim()
        );
      case 3:
        return formData.coreFeatures.length > 0 && formData.monetizationModel.length > 0;
      case 4:
        return (
          formData.preferredTechStack.trim() &&
          formData.scalabilityRequirements.length > 0
        );
      case 5:
        return (
          formData.integrationNeeds.length > 0 &&
          formData.budgetRange.trim() &&
          formData.projectTimeline.trim()
        );
      case 6:
        return (
          formData.competitors.length > 0 &&
          formData.uniqueSellingProposition.trim() &&
          formData.designPreferences.trim() &&
          formData.priority.trim() &&
          formData.additionalNotes.trim()
        );
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
      const res = await fetch("http://localhost:5000/api/saas-product-requests", {
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
      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const steps = 6;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full relative max-h-[90vh] overflow-y-auto">
      {/* Only one close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold z-10"
      >
        ×
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">
        Step {step} of {steps}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Business Name *</label>
              <input
                type="text"
                name="businessName"
                placeholder="Enter your business name"
                onChange={handleChange}
                value={formData.businessName}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Product Idea *</label>
              <textarea
                name="productIdea"
                placeholder="Describe your product idea..."
                onChange={handleChange}
                value={formData.productIdea}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Target Audience *</label>
              <textarea
                name="targetAudience"
                placeholder="Describe your target audience..."
                onChange={handleChange}
                value={formData.targetAudience}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Core Features *</label>
              <div className="space-y-2">
                {["User Authentication", "Dashboard & Analytics", "Real-time Collaboration", "API Access", "Admin Panel"].map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.coreFeatures.includes(feature)}
                      onChange={() => handleCheckboxChange("coreFeatures", feature)}
                      className="mr-2"
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Monetization Model *</label>
              <div className="space-y-2">
                {["Subscription (Monthly/Annual)", "Freemium"].map(model => (
                  <label key={model} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.monetizationModel.includes(model)}
                      onChange={() => handleCheckboxChange("monetizationModel", model)}
                      className="mr-2"
                    />
                    {model}
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Preferred Tech Stack *</label>
              <select
                name="preferredTechStack"
                onChange={handleChange}
                value={formData.preferredTechStack}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Tech Stack</option>
                <option value="MERN Stack">MERN Stack (MongoDB, Express, React, Node.js)</option>
                <option value="MEAN Stack">MEAN Stack (MongoDB, Express, Angular, Node.js)</option>
                <option value="LAMP Stack">LAMP Stack (Linux, Apache, MySQL, PHP)</option>
                <option value="Python/Django">Python/Django</option>
                <option value="Ruby on Rails">Ruby on Rails</option>
                <option value="Java/Spring">Java/Spring</option>
                <option value=".NET">.NET</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Scalability Requirements *</label>
              <div className="space-y-2">
                {["Cloud-based (AWS, GCP, Azure)", "Multi-user Support", "Multi-tenant Architecture", "Auto-scaling"].map(req => (
                  <label key={req} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.scalabilityRequirements.includes(req)}
                      onChange={() => handleCheckboxChange("scalabilityRequirements", req)}
                      className="mr-2"
                    />
                    {req}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Integration Needs *</label>
              <div className="space-y-2">
                {["Payment Gateways (Stripe, PayPal)", "CRM Integration (Salesforce, HubSpot)", "Email Services (SendGrid, Mailgun)", "Social Media APIs", "Single Sign-On (SSO)"].map(need => (
                  <label key={need} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.integrationNeeds.includes(need)}
                      onChange={() => handleCheckboxChange("integrationNeeds", need)}
                      className="mr-2"
                    />
                    {need}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range *</label>
              <select
                name="budgetRange"
                onChange={handleChange}
                value={formData.budgetRange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Budget Range</option>
                <option>$10,000 - $25,000</option>
                <option>$25,000 - $50,000</option>
                <option>$50,000 - $100,000</option>
                <option>$100,000 - $250,000</option>
                <option>$250,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Project Timeline *</label>
              <select
                name="projectTimeline"
                onChange={handleChange}
                value={formData.projectTimeline}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Timeline</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="12-18 months">12-18 months</option>
                <option value="18+ months">18+ months</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Competitors *</label>
              <div className="space-y-2">
                {["Jira", "Asana", "Trello"].map(comp => (
                  <label key={comp} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.competitors.includes(comp)}
                      onChange={() => handleCheckboxChange("competitors", comp)}
                      className="mr-2"
                    />
                    {comp}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Unique Selling Proposition *</label>
              <textarea
                name="uniqueSellingProposition"
                placeholder="Describe your USP..."
                onChange={handleChange}
                value={formData.uniqueSellingProposition}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Do you have an existing team? *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasExistingTeam"
                    value="true"
                    checked={formData.hasExistingTeam === true}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasExistingTeam"
                    value="false"
                    checked={formData.hasExistingTeam === false}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Design Preferences *</label>
              <textarea
                name="designPreferences"
                placeholder="Describe your design preferences..."
                onChange={handleChange}
                value={formData.designPreferences}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Priority *</label>
              <select
                name="priority"
                onChange={handleChange}
                value={formData.priority}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes *</label>
              <textarea
                name="additionalNotes"
                placeholder="Any additional notes..."
                onChange={handleChange}
                value={formData.additionalNotes}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
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
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                required
              />
            </div>
          </>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between mt-8 gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
          )}

          {step < steps ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-auto px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          )}
        </div>

        {/* Update progress dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(steps)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === i + 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </form>
    </div>
  );
}
