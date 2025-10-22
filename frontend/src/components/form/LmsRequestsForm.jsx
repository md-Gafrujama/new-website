"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LmsRequestsForm({ onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    contactRole: "",
    organizationName: "",
    lmsType: "",
    numberOfUsers: "",
    industryVertical: "",
    requiredFeatures: [],
    integrationNeeds: [],
    customizationRequirements: "",
    brandingNeeds: [],
    contentTypes: [],
    learningModels: [],
    deploymentPreference: "",
    securityRequirements: [],
    supportRequirements: [],
    reportingNeeds: [],
    complianceRequirements: [],
    budgetRange: "",
    timeline: "",
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
        return formData.fullName.trim() && formData.email.trim() && formData.phone.trim() && formData.contactRole;
      case 2:
        return formData.organizationName.trim() && formData.lmsType && formData.numberOfUsers && formData.industryVertical;
      case 3:
        return formData.requiredFeatures.length > 0;
      case 4:
        return formData.integrationNeeds.length > 0 && formData.customizationRequirements.trim() && formData.brandingNeeds.length > 0;
      case 5:
        return formData.contentTypes.length > 0 && formData.learningModels.length > 0;
      case 6:
        return formData.deploymentPreference && formData.securityRequirements.length > 0;
      case 7:
        return formData.supportRequirements.length > 0 && formData.reportingNeeds.length > 0 && formData.complianceRequirements.length > 0;
      case 8:
        return formData.budgetRange && formData.timeline && formData.urgencyLevel && formData.additionalNotes.trim();
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
      const res = await fetch("http://localhost:5000/api/lms-requests", {
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
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Contact Role *</label>
              <select
                name="contactRole"
                onChange={handleChange}
                value={formData.contactRole}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Contact Role</option>
                <option>CEO/Founder</option>
                <option>CTO/Technical Lead</option>
                <option>Training Manager</option>
                <option>HR Director</option>
                <option>Education Administrator</option>
                <option>Learning & Development Manager</option>
                <option>IT Manager</option>
                <option>Project Manager</option>
                <option>Other</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Organization Name *</label>
              <input
                type="text"
                name="organizationName"
                placeholder="Enter your organization name"
                onChange={handleChange}
                value={formData.organizationName}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">LMS Type *</label>
              <select
                name="lmsType"
                onChange={handleChange}
                value={formData.lmsType}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select LMS Type</option>
                <option>Corporate Training</option>
                <option>Educational Institution</option>
                <option>Online Course Platform</option>
                <option>Certification System</option>
                <option>Employee Training</option>
                <option>Customer Training</option>
                <option>Compliance Training</option>
                <option>Skills Development</option>
                <option>Professional Development</option>
                <option>Healthcare Training</option>
                <option>Government Training</option>
                <option>Non-profit Training</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Number of Users *</label>
              <select
                name="numberOfUsers"
                onChange={handleChange}
                value={formData.numberOfUsers}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Number of Users</option>
                <option>1-50</option>
                <option>51-100</option>
                <option>101-500</option>
                <option>501-1000</option>
                <option>1001-5000</option>
                <option>5000+</option>
                <option>Not Sure</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Industry Vertical *</label>
              <select
                name="industryVertical"
                onChange={handleChange}
                value={formData.industryVertical}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Industry Vertical</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Finance & Banking</option>
                <option>Manufacturing</option>
                <option>Education</option>
                <option>Government</option>
                <option>Retail</option>
                <option>Hospitality</option>
                <option>Non-profit</option>
                <option>Consulting</option>
                <option>Real Estate</option>
                <option>Legal</option>
                <option>Automotive</option>
                <option>Energy</option>
                <option>Telecommunications</option>
                <option>Media & Entertainment</option>
                <option>Agriculture</option>
                <option>Construction</option>
                <option>Transportation</option>
                <option>Other</option>
              </select>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Required Features *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Course Creation & Management",
                  "Content Library",
                  "Video Streaming",
                  "Interactive Content",
                  "Quizzes & Assessments",
                  "Assignments",
                  "Certificates & Badges",
                  "Progress Tracking",
                  "Discussion Forums",
                  "Live Classes/Webinars",
                  "Mobile App",
                  "Offline Learning",
                  "Gamification",
                  "Reporting & Analytics",
                  "Multi-language Support",
                  "E-commerce Integration",
                  "SCORM Compliance",
                  "Tin Can API (xAPI)",
                  "User Management",
                  "Role-based Access",
                  "Social Learning",
                  "Microlearning",
                  "Blended Learning",
                  "Personalized Learning Paths",
                  "AI-powered Recommendations",
                  "Proctoring & Security",
                  "Virtual Classroom",
                  "Content Authoring Tools",
                  "API Access",
                  "White Labeling",
                  "Other"
                ].map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      name="requiredFeatures"
                      value={feature}
                      checked={formData.requiredFeatures.includes(feature)}
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Integration Needs *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Payment Gateways",
                  "Zoom/Teams Integration",
                  "Google Workspace",
                  "Microsoft 365",
                  "Salesforce CRM",
                  "HubSpot",
                  "Slack Integration",
                  "Email Services",
                  "CRM Systems",
                  "HR Systems (HRIS)",
                  "SSO (Single Sign-On)",
                  "Active Directory",
                  "LDAP Integration",
                  "Learning Analytics Tools",
                  "Content Management Systems",
                  "Video Conferencing Tools",
                  "Third-party Content Providers",
                  "Assessment Tools",
                  "Certification Bodies",
                  "Library Systems",
                  "Student Information Systems",
                  "E-portfolio Tools",
                  "Document Management",
                  "Marketing Automation",
                  "Survey Tools",
                  "Social Media Platforms",
                  "Mobile Apps",
                  "Custom APIs",
                  "None",
                  "Other"
                ].map((integration) => (
                  <label key={integration} className="flex items-center">
                    <input
                      type="checkbox"
                      name="integrationNeeds"
                      value={integration}
                      checked={formData.integrationNeeds.includes(integration)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {integration}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Customization Requirements *</label>
              <textarea
                name="customizationRequirements"
                placeholder="Describe your customization requirements"
                onChange={handleChange}
                value={formData.customizationRequirements}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Branding Needs *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Custom Branding/Logo",
                  "Custom Color Scheme",
                  "Custom Domain",
                  "White Label Solution",
                  "Custom User Interface",
                  "Custom Email Templates",
                  "Custom Certificates",
                  "Multi-tenant Architecture",
                  "Department-specific Branding",
                  "None"
                ].map((branding) => (
                  <label key={branding} className="flex items-center">
                    <input
                      type="checkbox"
                      name="brandingNeeds"
                      value={branding}
                      checked={formData.brandingNeeds.includes(branding)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {branding}
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Content Types *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Video Content",
                  "Interactive Presentations",
                  "Documents (PDF, Word)",
                  "Audio Files",
                  "SCORM Packages",
                  "HTML5 Content",
                  "Live Streaming",
                  "Recorded Webinars",
                  "Virtual Reality (VR)",
                  "Augmented Reality (AR)",
                  "Simulations",
                  "Games & Scenarios",
                  "Podcasts",
                  "eBooks",
                  "Infographics",
                  "Other"
                ].map((content) => (
                  <label key={content} className="flex items-center">
                    <input
                      type="checkbox"
                      name="contentTypes"
                      value={content}
                      checked={formData.contentTypes.includes(content)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {content}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Learning Models *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Self-paced Learning",
                  "Instructor-led Training",
                  "Blended Learning",
                  "Microlearning",
                  "Social Learning",
                  "Collaborative Learning",
                  "Adaptive Learning",
                  "Competency-based Learning",
                  "Mobile Learning",
                  "Just-in-time Learning",
                  "Scenario-based Learning",
                  "Problem-based Learning"
                ].map((model) => (
                  <label key={model} className="flex items-center">
                    <input
                      type="checkbox"
                      name="learningModels"
                      value={model}
                      checked={formData.learningModels.includes(model)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {model}
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Deployment Preference *</label>
              <select
                name="deploymentPreference"
                onChange={handleChange}
                value={formData.deploymentPreference}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Deployment Preference</option>
                <option>Cloud-based (SaaS)</option>
                <option>On-premise</option>
                <option>Hybrid</option>
                <option>Mobile-first</option>
                <option>No Preference</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Security Requirements *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Data Encryption",
                  "SSL Certificates",
                  "Two-Factor Authentication",
                  "Role-based Security",
                  "Audit Trails",
                  "GDPR Compliance",
                  "FERPA Compliance",
                  "HIPAA Compliance",
                  "SOC 2 Compliance",
                  "ISO 27001",
                  "Regular Backups",
                  "Disaster Recovery",
                  "Anti-plagiarism Tools",
                  "Secure Proctoring",
                  "IP Restrictions",
                  "None Specified"
                ].map((security) => (
                  <label key={security} className="flex items-center">
                    <input
                      type="checkbox"
                      name="securityRequirements"
                      value={security}
                      checked={formData.securityRequirements.includes(security)}
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Support Requirements *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "24/7 Technical Support",
                  "Business Hours Support",
                  "Email Support",
                  "Phone Support",
                  "Live Chat Support",
                  "Training & Onboarding",
                  "Documentation",
                  "Video Tutorials",
                  "Community Forum",
                  "Dedicated Account Manager",
                  "Implementation Support",
                  "Migration Assistance",
                  "Custom Development",
                  "Regular Updates",
                  "Performance Monitoring"
                ].map((support) => (
                  <label key={support} className="flex items-center">
                    <input
                      type="checkbox"
                      name="supportRequirements"
                      value={support}
                      checked={formData.supportRequirements.includes(support)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {support}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Reporting Needs *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Learner Progress Reports",
                  "Course Completion Reports",
                  "Assessment Results",
                  "Engagement Analytics",
                  "Time Tracking",
                  "Custom Reports",
                  "Real-time Dashboards",
                  "Export Capabilities",
                  "Automated Reports",
                  "Compliance Reports",
                  "ROI Analysis",
                  "Skills Gap Analysis",
                  "Learning Path Analytics",
                  "Mobile Analytics",
                  "Integration with BI Tools"
                ].map((reporting) => (
                  <label key={reporting} className="flex items-center">
                    <input
                      type="checkbox"
                      name="reportingNeeds"
                      value={reporting}
                      checked={formData.reportingNeeds.includes(reporting)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {reporting}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Compliance Requirements *</label>
              <div className="max-h-48 overflow-y-auto space-y-2 border p-3 rounded-lg">
                {[
                  "Corporate Training Compliance",
                  "Educational Standards",
                  "Professional Certification",
                  "Industry Regulations",
                  "Safety Training",
                  "Quality Assurance",
                  "Continuing Education",
                  "Mandatory Training Tracking",
                  "Audit Requirements",
                  "None"
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
              <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range *</label>
              <select
                name="budgetRange"
                onChange={handleChange}
                value={formData.budgetRange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Budget Range</option>
                <option>$2,000 - $5,000</option>
                <option>$5,000 - $15,000</option>
                <option>$15,000 - $30,000</option>
                <option>$30,000 - $60,000</option>
                <option>$60,000 - $100,000</option>
                <option>$100,000 - $200,000</option>
                <option>$200,000+</option>
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
                <option>1-2 months</option>
                <option>2-4 months</option>
                <option>4-6 months</option>
                <option>6-12 months</option>
                <option>12+ months</option>
                <option>ASAP</option>
                <option>Flexible</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Urgency Level *</label>
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
