"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EcommerceRequestForm({ onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    projectType: "",
    platformsRequired: [],
    targetAudience: "",
    numberOfProducts: "",
    expectedMonthlyUsers: "",
    requiredCoreFeatures: [],
    userAccountOptions: [],
    paymentMethods: [],
    shippingMethod: "",
    taxHandling: "",
    adminPanelModules: [],
    searchPersonalizationLevel: "",
    analyticsTools: [],
    customizationLevel: "",
    hostingPreference: "",
    maintenanceSupport: "",
    budgetRange: "",
    desiredTimeline: "",
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
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate current step fields before going next
  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim() && formData.email.trim() && formData.phone.trim();
      case 2:
        return formData.companyName.trim() && formData.projectType && formData.platformsRequired.length > 0;
      case 3:
        return formData.targetAudience.trim() && formData.numberOfProducts && formData.expectedMonthlyUsers;
      case 4:
        return formData.requiredCoreFeatures.length > 0 && formData.userAccountOptions.length > 0 && formData.paymentMethods.length > 0;
      case 5:
        return formData.shippingMethod && formData.taxHandling && formData.adminPanelModules.length > 0;
      case 6:
        return formData.searchPersonalizationLevel && formData.analyticsTools.length > 0 && formData.customizationLevel;
      case 7:
        return formData.hostingPreference && formData.maintenanceSupport && formData.budgetRange;
      case 8:
        return formData.desiredTimeline && formData.additionalNotes.trim();
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
      const res = await fetch("http://localhost:5000/api/ecommerce-project-requests", {
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Company Name *</label>
              <input
                type="text"
                name="companyName"
                placeholder="Enter your company name"
                onChange={handleChange}
                value={formData.companyName}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Project Type *</label>
              <select
                name="projectType"
                onChange={handleChange}
                value={formData.projectType}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Project Type</option>
                <option>New Build</option>
                <option>Redesign</option>
                <option>Add Features</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Platforms Required *</label>
              <div className="space-y-2">
                {["Website", "iOS App", "Android App", "All"].map((platform) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      name="platformsRequired"
                      value={platform}
                      checked={formData.platformsRequired.includes(platform)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {platform}
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Number of Products *</label>
              <select
                name="numberOfProducts"
                onChange={handleChange}
                value={formData.numberOfProducts}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Number of Products</option>
                <option>1-50</option>
                <option>51-200</option>
                <option>201-1000</option>
                <option>1000-5000</option>
                <option>5000+</option>
                <option>Not Sure</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Expected Monthly Users *</label>
              <select
                name="expectedMonthlyUsers"
                onChange={handleChange}
                value={formData.expectedMonthlyUsers}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Expected Monthly Users</option>
                <option>1K-10K</option>
                <option>10K-50K</option>
                <option>50K-100K</option>
                <option>100K-500K</option>
                <option>500K+</option>
                <option>Not Sure</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Required Core Features *</label>
              <div className="space-y-2">
                {[
                  "Product Catalog",
                  "Shopping Cart",
                  "Checkout System",
                  "Wishlist",
                  "Product Search",
                  "Product Filters",
                  "Product Reviews",
                  "User Profiles",
                  "Order Tracking",
                  "Customer Support",
                  "Multi-vendor Support",
                  "Subscription Management",
                  "Digital Downloads",
                  "Gift Cards",
                  "Referral System",
                  "Other"
                ].map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      name="requiredCoreFeatures"
                      value={feature}
                      checked={formData.requiredCoreFeatures.includes(feature)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">User Account Options *</label>
              <div className="space-y-2">
                {["Guest Checkout", "Social Login", "Mandatory Signup", "Optional Registration"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="userAccountOptions"
                      value={option}
                      checked={formData.userAccountOptions.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Payment Methods *</label>
              <div className="space-y-2">
                {[
                  "UPI",
                  "Credit Cards",
                  "Debit Cards",
                  "Net Banking",
                  "Digital Wallets",
                  "Cash on Delivery",
                  "Bank Transfer",
                  "Cryptocurrency",
                  "Buy Now Pay Later",
                  "Subscriptions",
                  "EMI Options",
                  "Other"
                ].map((method) => (
                  <label key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      name="paymentMethods"
                      value={method}
                      checked={formData.paymentMethods.includes(method)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {method}
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Shipping Method *</label>
              <select
                name="shippingMethod"
                onChange={handleChange}
                value={formData.shippingMethod}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Shipping Method</option>
                <option>Standard Shipping</option>
                <option>Express Shipping</option>
                <option>Same Day Delivery</option>
                <option>Store Pickup</option>
                <option>Drop Shipping</option>
                <option>Third-party Logistics</option>
                <option>Custom Logistics</option>
                <option>Digital Only</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Tax Handling *</label>
              <select
                name="taxHandling"
                onChange={handleChange}
                value={formData.taxHandling}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Tax Handling</option>
                <option>Automatic GST</option>
                <option>Manual Entry</option>
                <option>No Tax</option>
                <option>International Tax</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Admin Panel Modules *</label>
              <div className="space-y-2">
                {[
                  "Order Management",
                  "Product Management",
                  "User Management",
                  "Inventory Control",
                  "Sales Reports",
                  "Analytics Dashboard",
                  "Customer Support",
                  "Marketing Tools",
                  "Shipping Management",
                  "Payment Management",
                  "Content Management",
                  "SEO Tools",
                  "Discount Management",
                  "Vendor Management",
                  "Other"
                ].map((module) => (
                  <label key={module} className="flex items-center">
                    <input
                      type="checkbox"
                      name="adminPanelModules"
                      value={module}
                      checked={formData.adminPanelModules.includes(module)}
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

        {/* STEP 6 */}
        {step === 6 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Search & Personalization Level *</label>
              <select
                name="searchPersonalizationLevel"
                onChange={handleChange}
                value={formData.searchPersonalizationLevel}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                <option>Basic Search</option>
                <option>Advanced Filters</option>
                <option>AI Recommendations</option>
                <option>Machine Learning</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Analytics Tools *</label>
              <div className="space-y-2">
                {[
                  "Google Analytics",
                  "Firebase Analytics",
                  "Custom Analytics",
                  "Heat Map Tools",
                  "A/B Testing",
                  "Conversion Tracking",
                  "User Behavior Analytics",
                  "Sales Analytics",
                  "Other"
                ].map((tool) => (
                  <label key={tool} className="flex items-center">
                    <input
                      type="checkbox"
                      name="analyticsTools"
                      value={tool}
                      checked={formData.analyticsTools.includes(tool)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {tool}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Customization Level *</label>
              <select
                name="customizationLevel"
                onChange={handleChange}
                value={formData.customizationLevel}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Customization Level</option>
                <option>Template Based</option>
                <option>Semi-custom</option>
                <option>Fully Custom</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 7 */}
        {step === 7 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Hosting Preference *</label>
              <select
                name="hostingPreference"
                onChange={handleChange}
                value={formData.hostingPreference}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Hosting Preference</option>
                <option>Cloud Hosting</option>
                <option>On-premise</option>
                <option>Managed Hosting</option>
                <option>Shared Hosting</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Maintenance & Support *</label>
              <select
                name="maintenanceSupport"
                onChange={handleChange}
                value={formData.maintenanceSupport}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Maintenance & Support</option>
                <option>Monthly Support</option>
                <option>24x7 Support</option>
                <option>On-demand Support</option>
                <option>Self-managed</option>
              </select>
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
                <option>$5,000 - $15,000</option>
                <option>$15,000 - $30,000</option>
                <option>$30,000 - $60,000</option>
                <option>$60,000 - $100,000</option>
                <option>$100,000 - $200,000</option>
                <option>$200,000+</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 8 */}
        {step === 8 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Desired Timeline *</label>
              <select
                name="desiredTimeline"
                onChange={handleChange}
                value={formData.desiredTimeline}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Desired Timeline</option>
                <option>1-3 months</option>
                <option>3-6 months</option>
                <option>6-12 months</option>
                <option>12+ months</option>
                <option>ASAP</option>
                <option>Flexible</option>
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
