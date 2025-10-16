"use client";

import { useState, useEffect } from "react";

export default function DigitalMarketingForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessWebsite: "",
    socialLink: "",
    businessType: "",
    industryVertical: "",
    marketingType: [],
    targetAudience: "",
    targetRegion: "",
    monthlyBudget: "",
    currentMarketingChallenges: [],
    campaignGoals: [],
    timeline: "",
    additionalNotes: "",
    competitorAnalysis: false,
    hasExistingMarketingTeam: false,
    currentMarketingTools: [],
    previousMarketingExperience: "Some Experience",
    urgencyLevel: "Medium",
    expectedROI: "",
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
      if (Array.isArray(formData[name])) {
        // Handle array fields
        setFormData(prev => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        // Handle boolean fields
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
        return true; // Optional business fields
      case 3:
        return formData.marketingType.length > 0;
      case 4:
        return formData.targetAudience.trim() && formData.targetRegion.trim();
      case 5:
        return formData.monthlyBudget.trim() && formData.timeline.trim();
      case 6:
        return formData.campaignGoals.length > 0;
      case 7:
        return true; // Optional fields
      case 8:
        return formData.additionalNotes.trim() && captchaInput.trim();
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
      const res = await fetch("http://localhost:5000/api/digital-marketing-requests", {
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

  const marketingTypeOptions = [
    'SEO (Search Engine Optimization)',
    'Google Ads (PPC)',
    'Facebook Ads',
    'Instagram Marketing',
    'YouTube Marketing',
    'LinkedIn Marketing',
    'TikTok Marketing',
    'Twitter Marketing',
    'Content Marketing',
    'Email Marketing',
    'Social Media Management',
    'Influencer Marketing',
    'Affiliate Marketing',
    'Video Marketing',
    'Podcast Marketing',
    'PR & Media Outreach',
    'Local SEO',
    'E-commerce Marketing',
    'Other'
  ];

  const challengeOptions = [
    'Low Website Traffic',
    'Poor Conversion Rates',
    'High Cost Per Acquisition',
    'Low Brand Awareness',
    'Weak Social Media Presence',
    'Poor Search Engine Rankings',
    'Limited Lead Generation',
    'Inconsistent Messaging',
    'Lack of Analytics/Tracking',
    'Competition',
    'Budget Constraints',
    'Time Constraints',
    'Lack of Expertise',
    'Outdated Website',
    'Poor Customer Retention',
    'Other'
  ];

  const goalOptions = [
    'Generate Leads',
    'Increase Website Traffic',
    'Boost Sales/Revenue',
    'Build Brand Awareness',
    'Improve Online Presence',
    'Increase App Downloads',
    'Drive Event Registrations',
    'Grow Email Subscribers',
    'Enhance Customer Engagement',
    'Improve Search Rankings',
    'Increase Social Media Followers',
    'Promote New Product/Service',
    'Customer Retention',
    'Market Expansion',
    'Competitive Advantage',
    'Other'
  ];

  const toolOptions = [
    'Google Analytics',
    'Google Ads',
    'Facebook Business Manager',
    'HubSpot',
    'Mailchimp',
    'Hootsuite',
    'Buffer',
    'SEMrush',
    'Ahrefs',
    'Moz',
    'Canva',
    'Adobe Creative Suite',
    'WordPress',
    'Shopify',
    'Salesforce',
    'None',
    'Other'
  ];

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
        {/* STEP 1: Basic Information */}
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

        {/* STEP 2: Business Details */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Business Type</label>
              <input
                type="text"
                name="businessType"
                placeholder="e.g. E-commerce, Consulting, etc."
                onChange={handleChange}
                value={formData.businessType}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Industry Vertical</label>
              <select
                name="industryVertical"
                onChange={handleChange}
                value={formData.industryVertical}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Industry</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>E-commerce</option>
                <option>Education</option>
                <option>Real Estate</option>
                <option>Manufacturing</option>
                <option>Retail</option>
                <option>Hospitality</option>
                <option>Legal</option>
                <option>Automotive</option>
                <option>Food & Beverage</option>
                <option>Fashion</option>
                <option>Beauty & Wellness</option>
                <option>Travel & Tourism</option>
                <option>Entertainment</option>
                <option>Non-profit</option>
                <option>B2B Services</option>
                <option>Consulting</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Business Website</label>
              <input
                type="url"
                name="businessWebsite"
                placeholder="https://www.yourwebsite.com"
                onChange={handleChange}
                value={formData.businessWebsite}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* STEP 3: Marketing Type */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Marketing Type * (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded-lg">
                {marketingTypeOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="marketingType"
                      value={option}
                      checked={formData.marketingType.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STEP 4: Target Audience & Region */}
        {step === 4 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Target Audience *</label>
              <textarea
                name="targetAudience"
                placeholder="Describe your target audience (age, interests, demographics, etc.)"
                onChange={handleChange}
                value={formData.targetAudience}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Target Region *</label>
              <input
                type="text"
                name="targetRegion"
                placeholder="e.g. United States, Europe, Global"
                onChange={handleChange}
                value={formData.targetRegion}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </>
        )}

        {/* STEP 5: Budget & Timeline */}
        {step === 5 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Monthly Budget *</label>
              <select
                name="monthlyBudget"
                onChange={handleChange}
                value={formData.monthlyBudget}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Budget Range</option>
                <option>$500 - $1,000</option>
                <option>$1,000 - $2,500</option>
                <option>$2,500 - $5,000</option>
                <option>$5,000 - $10,000</option>
                <option>$10,000 - $25,000</option>
                <option>$25,000 - $50,000</option>
                <option>$50,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Timeline *</label>
              <select
                name="timeline"
                onChange={handleChange}
                value={formData.timeline}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Timeline</option>
                <option>1-3 months</option>
                <option>3-6 months</option>
                <option>6-12 months</option>
                <option>12+ months</option>
                <option>Ongoing/Long-term</option>
                <option>ASAP/Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Urgency Level</label>
              <select
                name="urgencyLevel"
                onChange={handleChange}
                value={formData.urgencyLevel}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 6: Campaign Goals */}
        {step === 6 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Campaign Goals * (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded-lg">
                {goalOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="campaignGoals"
                      value={option}
                      checked={formData.campaignGoals.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Expected ROI</label>
              <select
                name="expectedROI"
                onChange={handleChange}
                value={formData.expectedROI}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Expected ROI</option>
                <option>2x Return</option>
                <option>3x Return</option>
                <option>4x Return</option>
                <option>5x+ Return</option>
                <option>Break Even</option>
                <option>Not Sure</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="competitorAnalysis"
                  checked={formData.competitorAnalysis}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Include Competitor Analysis</span>
              </label>
            </div>
          </>
        )}

        {/* STEP 7: Current Situation */}
        {step === 7 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Current Marketing Challenges (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded-lg">
                {challengeOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="currentMarketingChallenges"
                      value={option}
                      checked={formData.currentMarketingChallenges.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="hasExistingMarketingTeam"
                  checked={formData.hasExistingMarketingTeam}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Do you have an existing marketing team?</span>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Current Marketing Tools (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-3 rounded-lg">
                {toolOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="currentMarketingTools"
                      value={option}
                      checked={formData.currentMarketingTools.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Previous Marketing Experience</label>
              <select
                name="previousMarketingExperience"
                onChange={handleChange}
                value={formData.previousMarketingExperience}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>None</option>
                <option>Some Experience</option>
                <option>Extensive Experience</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 8: Additional Notes & CAPTCHA */}
        {step === 8 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes *</label>
              <textarea
                name="additionalNotes"
                placeholder="Any additional information or specific requirements?"
                onChange={handleChange}
                value={formData.additionalNotes}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">CAPTCHA *</label>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold bg-gray-100 p-2 rounded">{captcha}</div>
                <input
                  type="text"
                  name="captchaInput"
                  placeholder="Enter CAPTCHA"
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  value={captchaInput}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
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
