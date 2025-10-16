"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HrmsSolutionRequestForm({onClose}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companySize: "",
    requiredModules: [],
    currentHrTools: "",
    integrationRequirements: [],
    accessControlLevels: [],
    customizationNeeded: "",
    budgetRange: "",
    timeline: "",
    businessType: "",
    complianceRequirements: [],
    deploymentPreference: "",
    dataSecurityRequirements: [],
    expectedUsers: "",
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
          formData.phone.trim()
        );
      case 2:
        return formData.companySize.trim() && formData.businessType.trim();
      case 3:
        return formData.expectedUsers.trim() && formData.requiredModules.length > 0;
      case 4:
        return formData.currentHrTools.trim();
      case 5:
        return formData.integrationRequirements.length > 0;
      case 6:
        return formData.accessControlLevels.length > 0;
      case 7:
        return formData.complianceRequirements.length > 0;
      case 8:
        return formData.dataSecurityRequirements.length > 0;
      case 9:
        return (
          formData.budgetRange.trim() &&
          formData.timeline.trim() &&
          formData.priority.trim()
        );
      case 10:
        return formData.customizationNeeded.trim() && formData.additionalNotes.trim();
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

    console.log("Submitting form data:", formData); // Debug log

    try {
      const res = await fetch("http://localhost:5000/api/hrms-solution-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Response status:", res.status);
      console.log("Response data:", data);
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

  const steps = 10;

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
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Company Size *</label>
                <select
                  name="companySize"
                  onChange={handleChange}
                  value={formData.companySize}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Company Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-25">11-25 employees</option>
                  <option value="26-50">26-50 employees</option>
                  <option value="51-100">51-100 employees</option>
                  <option value="101-250">101-250 employees</option>
                  <option value="251-500">251-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Business Type *</label>
                <input
                  type="text"
                  name="businessType"
                  placeholder="e.g. Manufacturing, Retail, IT"
                  onChange={handleChange}
                  value={formData.businessType}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Expected Users *</label>
                <select
                  name="expectedUsers"
                  onChange={handleChange}
                  value={formData.expectedUsers}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Expected Users</option>
                  <option value="1-25 users">1-25 users</option>
                  <option value="26-50 users">26-50 users</option>
                  <option value="51-100 users">51-100 users</option>
                  <option value="101-250 users">101-250 users</option>
                  <option value="251-500 users">251-500 users</option>
                  <option value="500+ users">500+ users</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Required Modules (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Employee Management",
                    "Payroll Management",
                    "Attendance Tracking",
                    "Leave Management",
                    "Performance Management",
                    "Recruitment",
                    "Training & Development",
                    "Document Management",
                    "Employee Self-Service",
                    "Reporting & Analytics",
                    "Compliance Management",
                    "Benefits Administration",
                    "Time Tracking",
                    "Expense Management",
                    "Asset Management",
                    "Exit Management",
                    "Employee Engagement",
                    "Succession Planning",
                    "Goal Management",
                    "Appraisal System",
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Current HR Tools *</label>
                <input
                  type="text"
                  name="currentHrTools"
                  placeholder="e.g. Manual spreadsheets and basic payroll software"
                  onChange={handleChange}
                  value={formData.currentHrTools}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Integration Requirements (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Payroll Systems",
                    "Accounting Software (QuickBooks, SAP)",
                    "Time Tracking Tools",
                    "Email Services",
                    "Calendar Systems",
                    "Document Management",
                    "Biometric Systems",
                    "Third-party APIs",
                    "Banking Systems",
                    "ERP Systems",
                    "Learning Management Systems",
                    "Background Check Services",
                    "Video Conferencing Tools",
                    "Single Sign-On (SSO)",
                    "Active Directory",
                    "None",
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
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Access Control Levels (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Super Admin",
                    "HR Manager",
                    "Department Manager",
                    "Team Leader",
                    "Employee",
                    "Finance Team",
                    "IT Team",
                    "Payroll Administrator",
                    "Recruitment Specialist",
                    "Training Coordinator",
                    "Compliance Officer",
                    "Executive Leadership",
                    "Other"
                  ].map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        name="accessControlLevels"
                        value={level}
                        checked={formData.accessControlLevels.includes(level)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {level}
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Compliance Requirements (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "GDPR Compliance",
                    "HIPAA Compliance",
                    "SOX Compliance",
                    "FLSA Compliance",
                    "Equal Employment Opportunity",
                    "OSHA Compliance",
                    "Local Labor Laws",
                    "International Standards",
                    "None",
                    "Other"
                  ].map((compliance) => (
                    <label key={compliance} className="flex items-center">
                      <input
                        type="checkbox"
                        name="complianceRequirements"
                        value={compliance}
                        checked={formData.complianceRequirements.includes(compliance)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {compliance}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 8 */}
          {step === 8 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Data Security Requirements (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Data Encryption",
                    "Regular Backups",
                    "Access Control",
                    "Audit Trails",
                    "Two-Factor Authentication",
                    "Single Sign-On (SSO)",
                    "Role-based Permissions",
                    "Data Anonymization",
                    "Secure API Access",
                    "None",
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

          {/* STEP 9 */}
          {step === 9 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range *</label>
                <select
                  name="budgetRange"
                  onChange={handleChange}
                  value={formData.budgetRange}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Budget Range</option>
                  <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                  <option value="$5,000 - $12,000">$5,000 - $12,000</option>
                  <option value="$12,000 - $25,000">$12,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                  <option value="$100,000 - $200,000">$100,000 - $200,000</option>
                  <option value="$200,000+">$200,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Timeline *</label>
                <select
                  name="timeline"
                  onChange={handleChange}
                  value={formData.timeline}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Timeline</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="2-4 months">2-4 months</option>
                  <option value="4-6 months">4-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="12-18 months">12-18 months</option>
                  <option value="18+ months">18+ months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Priority *</label>
                <select
                  name="priority"
                  onChange={handleChange}
                  value={formData.priority}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 10 */}
          {step === 10 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Deployment Preference</label>
                <select
                  name="deploymentPreference"
                  onChange={handleChange}
                  value={formData.deploymentPreference}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Deployment Preference</option>
                  <option value="Cloud-based">Cloud-based</option>
                  <option value="On-premise">On-premise</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Customization Needed *</label>
                <textarea
                  name="customizationNeeded"
                  placeholder="Describe any specific customizations required..."
                  onChange={handleChange}
                  value={formData.customizationNeeded}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes *</label>
                <textarea
                  name="additionalNotes"
                  placeholder="Provide any additional details about your requirements..."
                  onChange={handleChange}
                  value={formData.additionalNotes}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  required
                />
              </div>

              {/* CAPTCHA */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Verify you're human</label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-lg font-bold text-gray-800">
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
                  className="w-full border p-3 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
            )}

            {step < steps ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
