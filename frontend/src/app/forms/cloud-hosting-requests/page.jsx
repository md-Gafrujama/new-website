"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CloudHostingRequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentHostingProvider: "",
    serviceType: [],
    platformPreference: "",
    storageRequirements: "",
    trafficRequirements: "",
    securityBackupNeeds: [],
    budgetRange: "",
    timeline: "",
    operatingSystem: "",
    databaseNeeds: [],
    expectedUsers: "",
    businessType: "",
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
        return formData.currentHostingProvider.trim() && formData.businessType.trim();
      case 3:
        return formData.serviceType.length > 0 && formData.platformPreference.trim();
      case 4:
        return (
          formData.storageRequirements.trim() &&
          formData.trafficRequirements.trim() &&
          formData.expectedUsers.trim()
        );
      case 5:
        return formData.securityBackupNeeds.length > 0 && formData.operatingSystem.trim();
      case 6:
        return formData.databaseNeeds.length > 0;
      case 7:
        return (
          formData.budgetRange.trim() &&
          formData.timeline.trim() &&
          formData.urgencyLevel.trim()
        );
      case 8:
        return formData.additionalNotes.trim();
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
      const res = await fetch("http://localhost:5000/api/cloud-hosting-requests", {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl relative">
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Current Hosting Provider</label>
                <input
                  type="text"
                  name="currentHostingProvider"
                  placeholder="e.g. Basic shared hosting"
                  onChange={handleChange}
                  value={formData.currentHostingProvider}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Business Type</label>
                <input
                  type="text"
                  name="businessType"
                  placeholder="e.g. Small Business"
                  onChange={handleChange}
                  value={formData.businessType}
                  className="w-full border p-2 rounded"
                />
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Service Type (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "Cloud Setup & Migration",
                    "Website Hosting",
                    "Server Management",
                    "Database Management",
                    "Backup Solutions",
                    "Security Services",
                    "Performance Optimization",
                    "Technical Support",
                    "DevOps Services",
                    "CDN Setup",
                    "Email Hosting",
                    "SSL Certificate Setup",
                    "Domain Management",
                    "Monitoring & Analytics",
                    "Other"
                  ].map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        name="serviceType"
                        value={service}
                        checked={formData.serviceType.includes(service)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Platform Preference *</label>
                <select
                  name="platformPreference"
                  onChange={handleChange}
                  value={formData.platformPreference}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Platform Preference</option>
                  <option>AWS (Amazon Web Services)</option>
                  <option>Google Cloud Platform (GCP)</option>
                  <option>Microsoft Azure</option>
                  <option>DigitalOcean</option>
                  <option>Vultr</option>
                  <option>Linode</option>
                  <option>Cloudflare</option>
                  <option>Heroku</option>
                  <option>Vercel</option>
                  <option>Netlify</option>
                  <option>No Preference</option>
                  <option>Other</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Storage Requirements *</label>
                <select
                  name="storageRequirements"
                  onChange={handleChange}
                  value={formData.storageRequirements}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Storage Requirements</option>
                  <option>Up to 10 GB</option>
                  <option>10-50 GB</option>
                  <option>50-200 GB</option>
                  <option>200 GB - 1 TB</option>
                  <option>1-5 TB</option>
                  <option>5-20 TB</option>
                  <option>20+ TB</option>
                  <option>Not Sure</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Traffic Requirements *</label>
                <select
                  name="trafficRequirements"
                  onChange={handleChange}
                  value={formData.trafficRequirements}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Traffic Requirements</option>
                  <option>Up to 1,000 visits/month</option>
                  <option>1K-10K visits/month</option>
                  <option>10K-100K visits/month</option>
                  <option>100K-1M visits/month</option>
                  <option>1M-10M visits/month</option>
                  <option>10M+ visits/month</option>
                  <option>Not Sure</option>
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
                  <option>1-100 users</option>
                  <option>100-1,000 users</option>
                  <option>1K-10K users</option>
                  <option>10K-100K users</option>
                  <option>100K+ users</option>
                  <option>Not Sure</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Security & Backup Needs (Select all that apply)</label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {[
                    "SSL Certificates",
                    "DDoS Protection",
                    "Regular Backups",
                    "Malware Scanning",
                    "Firewall Configuration",
                    "Security Monitoring",
                    "Data Encryption",
                    "Compliance (GDPR, HIPAA)",
                    "Disaster Recovery",
                    "Two-Factor Authentication",
                    "Access Control",
                    "Vulnerability Assessment",
                    "None",
                    "Other"
                  ].map((need) => (
                    <label key={need} className="flex items-center">
                      <input
                        type="checkbox"
                        name="securityBackupNeeds"
                        value={need}
                        checked={formData.securityBackupNeeds.includes(need)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {need}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Operating System</label>
                <select
                  name="operatingSystem"
                  onChange={handleChange}
                  value={formData.operatingSystem}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Operating System</option>
                  <option>Linux (Ubuntu)</option>
                  <option>Linux (CentOS)</option>
                  <option>Linux (Debian)</option>
                  <option>Windows Server</option>
                  <option>No Preference</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Database Needs (Select all that apply)</label>
                <div className="space-y-2 mt-2">
                  {["MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "No Database", "Other"].map((db) => (
                    <label key={db} className="flex items-center">
                      <input
                        type="checkbox"
                        name="databaseNeeds"
                        value={db}
                        checked={formData.databaseNeeds.includes(db)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {db}
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
                  <option>$50 - $200/month</option>
                  <option>$200 - $500/month</option>
                  <option>$500 - $1,000/month</option>
                  <option>$1,000 - $2,500/month</option>
                  <option>$2,500 - $5,000/month</option>
                  <option>$5,000 - $10,000/month</option>
                  <option>$10,000+/month</option>
                  <option>One-time project</option>
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
                  <option>Immediate (ASAP)</option>
                  <option>1-2 weeks</option>
                  <option>2-4 weeks</option>
                  <option>1-2 months</option>
                  <option>2-3 months</option>
                  <option>3+ months</option>
                  <option>Ongoing Support</option>
                  <option>Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Urgency Level *</label>
                <select
                  name="urgencyLevel"
                  onChange={handleChange}
                  value={formData.urgencyLevel}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Urgency Level</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
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
    </div>
  );
}
