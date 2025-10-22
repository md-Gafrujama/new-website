"use client";

import { useState, useEffect } from "react";

export default function BrandingDesignForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    brandName: "",
    designType: [],
    brandColors: "",
    brandGuidelines: "",
    designStylePreference: "",
    deliverablesRequired: [],
    budgetRange: "",
    timeline: "",
    targetAudience: "",
    keyCompetitors: [],
    designInspiration: [],
    projectObjective: "",
    contactRole: "",
    urgencyLevel: "",
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
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate current step fields before going next
  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim() && formData.email.trim() && formData.phone.trim() && formData.contactRole;
      case 2:
        return formData.brandName.trim() && formData.designType.length > 0;
      case 3:
        return formData.brandColors.trim() && formData.brandGuidelines.trim() && formData.designStylePreference.trim();
      case 4:
        return formData.deliverablesRequired.length > 0 && formData.budgetRange && formData.timeline;
      case 5:
        return formData.targetAudience.trim() && formData.projectObjective.trim() && formData.additionalNotes.trim();
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
      const res = await fetch("http://localhost:5000/api/branding-design-requests", {
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

  const steps = 5;

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
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Contact Role *</label>
              <select
                name="contactRole"
                onChange={handleChange}
                value={formData.contactRole}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Contact Role</option>
                <option>Business Owner</option>
                <option>Marketing Manager</option>
                <option>Creative Director</option>
                <option>CEO/Founder</option>
                <option>Other</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Brand Name *</label>
              <input
                type="text"
                name="brandName"
                placeholder="Enter your brand name"
                onChange={handleChange}
                value={formData.brandName}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Design Type *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Logo Design",
                  "Packaging Design",
                  "Social Media Kit",
                  "Brand Guidelines",
                  "Website Design",
                  "Business Card Design",
                  "Brochure Design",
                  "Other"
                ].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      name="designType"
                      value={type}
                      checked={formData.designType.includes(type)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Brand Colors *</label>
              <textarea
                name="brandColors"
                placeholder="Describe your brand colors (e.g., hex codes, color names)"
                onChange={handleChange}
                value={formData.brandColors}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Brand Guidelines *</label>
              <textarea
                name="brandGuidelines"
                placeholder="Describe your brand guidelines and preferences"
                onChange={handleChange}
                value={formData.brandGuidelines}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Design Style Preference *</label>
              <select
                name="designStylePreference"
                onChange={handleChange}
                value={formData.designStylePreference}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Design Style</option>
                <option>Modern/Contemporary</option>
                <option>Minimal/Clean</option>
                <option>Corporate/Professional</option>
                <option>Creative/Artistic</option>
                <option>Vintage/Retro</option>
                <option>Elegant/Luxury</option>
                <option>Bold/Dynamic</option>
                <option>Playful/Fun</option>
                <option>Traditional/Classic</option>
                <option>Natural/Organic</option>
                <option>Abstract/Geometric</option>
                <option>Futuristic/Tech</option>
                <option>Grunge/Urban</option>
                <option>Hand-drawn/Illustrative</option>
                <option>Custom Style</option>
                <option>No Preference</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Deliverables Required *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Logo Pack (PNG, JPG, SVG)",
                  "Brand Guidelines",
                  "Packaging Mockups",
                  "Social Media Kit",
                  "Email Signature",
                  "Business Cards",
                  "Letterhead",
                  "Website Mockups",
                  "Other"
                ].map((deliverable) => (
                  <label key={deliverable} className="flex items-center">
                    <input
                      type="checkbox"
                      name="deliverablesRequired"
                      value={deliverable}
                      checked={formData.deliverablesRequired.includes(deliverable)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {deliverable}
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
              >
                <option value="">Select Budget Range</option>
                <option>$200 - $500</option>
                <option>$500 - $1,000</option>
                <option>$1,000 - $2,500</option>
                <option>$2,500 - $5,000</option>
                <option>$5,000 - $10,000</option>
                <option>$10,000 - $25,000</option>
                <option>$25,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Timeline *</label>
              <select
                name="timeline"
                onChange={handleChange}
                value={formData.timeline}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Timeline</option>
                <option>1-2 weeks</option>
                <option>2-4 weeks</option>
                <option>1-2 months</option>
                <option>2-3 months</option>
                <option>3-6 months</option>
                <option>6+ months</option>
                <option>ASAP/Urgent</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Target Audience *</label>
              <textarea
                name="targetAudience"
                placeholder="Describe your target audience"
                onChange={handleChange}
                value={formData.targetAudience}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Key Competitors</label>
              <input
                type="text"
                name="keyCompetitors"
                placeholder="Enter key competitors (comma separated)"
                onChange={(e) => setFormData({ ...formData, keyCompetitors: e.target.value.split(',').map(s => s.trim()) })}
                value={formData.keyCompetitors.join(', ')}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Design Inspiration</label>
              <input
                type="text"
                name="designInspiration"
                placeholder="Enter inspiration links (comma separated)"
                onChange={(e) => setFormData({ ...formData, designInspiration: e.target.value.split(',').map(s => s.trim()) })}
                value={formData.designInspiration.join(', ')}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Project Objective *</label>
              <textarea
                name="projectObjective"
                placeholder="Describe your project objective"
                onChange={handleChange}
                value={formData.projectObjective}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Urgency Level</label>
              <select
                name="urgencyLevel"
                onChange={handleChange}
                value={formData.urgencyLevel}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Urgency Level</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
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
