"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CrmSolutionRequestForm({onClose}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    teamSize: "",
    currentCrmTool: "",
    requiredModules: [],
    integrationRequirements: [],
    customizationNeeds: "",
    budgetRange: "",
    timeline: "",
    businessType: "",
    currentChallenges: [],
    expectedUsers: "",
    deploymentPreference: "",
    dataSecurityRequirements: [],
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

  // ✅ validate current step fields before going next
  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          formData.fullName.trim() &&
          formData.email.trim() &&
          formData.phone.trim() &&
          formData.businessName.trim()
        );
      case 2:
        return formData.teamSize.trim() && formData.businessType.trim();
      case 3:
        return formData.requiredModules.length > 0;
      case 4:
        return formData.integrationRequirements.length > 0;
      case 5:
        return formData.currentChallenges.length > 0 && formData.deploymentPreference.trim();
      case 6:
        return formData.dataSecurityRequirements.length > 0;
      case 7:
        return (
          formData.budgetRange.trim() &&
          formData.timeline.trim() &&
          formData.priority.trim() &&
          formData.expectedUsers.trim()
        );
      case 8:
        return true; // Additional notes are optional
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
      const res = await fetch("http://localhost:5000/api/crm-solution-requests", {
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

  const steps = 8;

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
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter your business name"
                  onChange={handleChange}
                  value={formData.businessName}
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Team Size *</label>
                <select
                  name="teamSize"
                  onChange={handleChange}
                  value={formData.teamSize}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Team Size</option>
                  <option>1-5</option>
                  <option>6-15</option>
                  <option>16-50</option>
                  <option>51-100</option>
                  <option>100+</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Business Type *</label>
                <input
                  type="text"
                  name="businessType"
                  placeholder="e.g. Digital Marketing Agency"
                  onChange={handleChange}
                  value={formData.businessType}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Current CRM Tool</label>
                <input
                  type="text"
                  name="currentCrmTool"
                  placeholder="e.g. Excel spreadsheets and basic email"
                  onChange={handleChange}
                  value={formData.currentCrmTool}
                  className="w-full border p-2 rounded"
                />
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Required Modules (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "Lead Management",
                    "Deal Pipeline",
                    "Contact Management",
                    "Email Marketing",
                    "Reporting & Analytics",
                    "Task Management",
                    "Customer Support",
                    "Sales Forecasting",
                    "Automation",
                    "Integration Tools",
                    "Mobile Access",
                    "Custom Dashboards",
                    "Other"
                  ].map((module) => (
                    <label key={module} className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiredModules"
                        value={module}
                        checked={formData.requiredModules.includes(module)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {module}
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Integration Requirements (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "Email Services (Gmail, Outlook)",
                    "WhatsApp Integration",
                    "Social Media Platforms",
                    "Marketing Tools (Mailchimp, HubSpot)",
                    "Payment Gateways",
                    "E-commerce Platforms",
                    "Accounting Software",
                    "Project Management Tools",
                    "API Integrations",
                    "Other"
                  ].map((integration) => (
                    <label key={integration} className="flex items-center">
                      <input
                        type="checkbox"
                        name="integrationRequirements"
                        value={integration}
                        checked={formData.integrationRequirements.includes(integration)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {integration}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Customization Needs</label>
                <textarea
                  name="customizationNeeds"
                  placeholder="Describe your customization needs..."
                  onChange={handleChange}
                  value={formData.customizationNeeds}
                  className="w-full border p-2 rounded h-24"
                />
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Current Challenges (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "Lead Management",
                    "Follow-up Management",
                    "Reporting",
                    "Team Collaboration",
                    "Data Entry",
                    "Customer Insights",
                    "Scalability",
                    "Automation",
                    "Integration",
                    "Security",
                    "Other"
                  ].map((challenge) => (
                    <label key={challenge} className="flex items-center">
                      <input
                        type="checkbox"
                        name="currentChallenges"
                        value={challenge}
                        checked={formData.currentChallenges.includes(challenge)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {challenge}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Deployment Preference *</label>
                <select
                  name="deploymentPreference"
                  onChange={handleChange}
                  value={formData.deploymentPreference}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Deployment Preference</option>
                  <option>Cloud-based</option>
                  <option>On-premise</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Data Security Requirements (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "GDPR Compliance",
                    "Data Encryption",
                    "Access Control",
                    "Regular Backups",
                    "Audit Logs",
                    "Two-Factor Authentication",
                    "Data Masking",
                    "Compliance Certifications",
                    "Other"
                  ].map((security) => (
                    <label key={security} className="flex items-center">
                      <input
                        type="checkbox"
                        name="dataSecurityRequirements"
                        value={security}
                        checked={formData.dataSecurityRequirements.includes(security)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {security}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 7 */}
          {step === 7 && (
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
                  <option>$1,000 - $3,000</option>
                  <option>$3,000 - $7,000</option>
                  <option>$7,000 - $15,000</option>
                  <option>$15,000 - $30,000</option>
                  <option>$30,000+</option>
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
                  <option>6+ months</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Priority *</label>
                <select
                  name="priority"
                  onChange={handleChange}
                  value={formData.priority}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Expected Users *</label>
                <select
                  name="expectedUsers"
                  onChange={handleChange}
                  value={formData.expectedUsers}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Expected Users</option>
                  <option>1-10 users</option>
                  <option>11-25 users</option>
                  <option>26-50 users</option>
                  <option>51-100 users</option>
                  <option>100+ users</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 8 */}
          {step === 8 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  placeholder="Provide any additional details about your requirements..."
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
