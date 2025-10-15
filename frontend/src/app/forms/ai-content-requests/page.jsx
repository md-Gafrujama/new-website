"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AiContentRequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    contentType: [],
    aiToolPreference: "",
    contentVolumePerMonth: "",
    languagesRequired: [],
    automationRequirements: [],
    budgetRange: "",
    timeline: "",
    businessType: "",
    targetAudience: "",
    contentGoals: [],
    contentTone: "",
    industryVertical: "",
    competitorAnalysis: false,
    seoRequirements: [],
    priority: "",
    additionalNotes: "",
  });

  // 🔹 Generate simple captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "competitorAnalysis") {
        setFormData({ ...formData, [name]: checked });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter((item) => item !== value),
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          formData.fullName.trim() &&
          formData.email.trim() &&
          formData.phone.trim()
        );
      case 3:
        return (
          formData.contentType.length > 0 &&
          formData.contentTone.trim() &&
          formData.languagesRequired.length > 0
        );
      case 4:
        return formData.aiToolPreference.trim();
      case 5:
        return formData.contentVolumePerMonth.trim();
      case 6:
        return (
          formData.budgetRange.trim() &&
          formData.timeline.trim() &&
          formData.priority.trim()
        );
      case 7:
        return formData.additionalNotes.trim();
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
    else alert("⚠️ Please fill all required fields before continuing.");
  };

  const prevStep = () => setStep((s) => s - 1);

  // 🔹 FIXED: improved backend error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput.toUpperCase() !== captcha) {
      alert("❌ CAPTCHA verification failed. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      console.log("Submitting form data:", formData);

      const res = await fetch("http://localhost:5000/api/ai-content-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (!res.ok) {
        // 🔹 Show specific backend validation messages if available
        if (data?.errors?.length) {
          alert(
            `❌ Validation Error:\n${data.errors
              .map((err) => `${err.path || ""}: ${err.msg || err}`)
              .join("\n")}`
          );
        } else {
          alert(`❌ Error: ${data.message || "Submission failed"}`);
        }
        return;
      }

      alert("✅ Request submitted successfully!");
      router.push("/");

    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert(`❌ Network or Server Error: ${error.message}`);
    }
  };

  const steps = 7;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-2xl relative">
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

        <form  className="space-y-5">
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Business Type</label>
                <input
                  type="text"
                  name="businessType"
                  placeholder="e.g. Digital Marketing Agency, E-commerce"
                  onChange={handleChange}
                  value={formData.businessType}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Industry Vertical</label>
                <select
                  name="industryVertical"
                  onChange={handleChange}
                  value={formData.industryVertical}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Industry Vertical</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Legal">Legal</option>
                  <option value="Travel">Travel</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Target Audience</label>
                <textarea
                  name="targetAudience"
                  placeholder="Describe your target audience..."
                  onChange={handleChange}
                  value={formData.targetAudience}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Content Type (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Blog Articles",
                    "Social Media Posts",
                    "Product Descriptions",
                    "Email Marketing",
                    "Website Content",
                    "Ad Copy",
                    "Press Releases",
                    "Technical Documentation",
                    "SEO Content",
                    "Video Scripts",
                    "Podcast Scripts",
                    "News Articles",
                    "Case Studies",
                    "White Papers",
                    "Landing Pages",
                    "Meta Descriptions",
                    "Social Media Captions",
                    "Newsletter Content",
                    "eBook Content",
                    "Other"
                  ].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        name="contentType"
                        value={type}
                        checked={formData.contentType.includes(type)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Content Tone *</label>
                <select
                  name="contentTone"
                  onChange={handleChange}
                  value={formData.contentTone}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Content Tone</option>
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Technical">Technical</option>
                  <option value="Creative">Creative</option>
                  <option value="Humorous">Humorous</option>
                  <option value="Formal">Formal</option>
                  <option value="Educational">Educational</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Languages Required (Select all that apply) *</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "English",
                    "Spanish",
                    "French",
                    "German",
                    "Italian",
                    "Portuguese",
                    "Chinese (Mandarin)",
                    "Japanese",
                    "Korean",
                    "Arabic",
                    "Hindi",
                    "Russian",
                    "Dutch",
                    "Swedish",
                    "Norwegian",
                    "Danish",
                    "Polish",
                    "Turkish",
                    "Thai",
                    "Vietnamese",
                    "Other"
                  ].map((lang) => (
                    <label key={lang} className="flex items-center">
                      <input
                        type="checkbox"
                        name="languagesRequired"
                        value={lang}
                        checked={formData.languagesRequired.includes(lang)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {lang}
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
                <label className="block text-gray-700 text-sm font-medium mb-2">AI Tool Preference *</label>
                <select
                  name="aiToolPreference"
                  onChange={handleChange}
                  value={formData.aiToolPreference}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select AI Tool Preference</option>
                  <option value="ChatGPT/OpenAI">ChatGPT/OpenAI</option>
                  <option value="Google Bard">Google Bard</option>
                  <option value="Claude (Anthropic)">Claude (Anthropic)</option>
                  <option value="Jasper AI">Jasper AI</option>
                  <option value="Copy.ai">Copy.ai</option>
                  <option value="Writesonic">Writesonic</option>
                  <option value="ContentBot">ContentBot</option>
                  <option value="Rytr">Rytr</option>
                  <option value="Anyword">Anyword</option>
                  <option value="Grammarly">Grammarly</option>
                  <option value="Custom Solution">Custom Solution</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Automation Requirements (Select all that apply)</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Auto Publishing",
                    "Content Scheduling",
                    "SEO Optimization",
                    "Keyword Integration",
                    "Brand Voice Consistency",
                    "Multi-platform Distribution",
                    "Performance Tracking",
                    "Content Approval Workflow",
                    "Plagiarism Detection",
                    "Content Personalization",
                    "A/B Testing",
                    "Social Media Integration",
                    "Email Campaign Integration",
                    "Analytics Integration",
                    "Content Calendar Management",
                    "Automated Proofreading",
                    "Image Generation",
                    "Video Content Creation",
                    "None",
                    "Other"
                  ].map((req) => (
                    <label key={req} className="flex items-center">
                      <input
                        type="checkbox"
                        name="automationRequirements"
                        value={req}
                        checked={formData.automationRequirements.includes(req)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {req}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Content Goals (Select all that apply)</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Increase Website Traffic",
                    "Generate Leads",
                    "Build Brand Awareness",
                    "Improve SEO Rankings",
                    "Drive Sales",
                    "Educate Customers",
                    "Engage Social Media Audience",
                    "Support Customer Service",
                    "Establish Thought Leadership",
                    "Other"
                  ].map((goal) => (
                    <label key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        name="contentGoals"
                        value={goal}
                        checked={formData.contentGoals.includes(goal)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {goal}
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Content Volume Per Month *</label>
                <select
                  name="contentVolumePerMonth"
                  onChange={handleChange}
                  value={formData.contentVolumePerMonth}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Content Volume</option>
                  <option value="1-10 pieces">1-10 pieces</option>
                  <option value="11-25 pieces">11-25 pieces</option>
                  <option value="26-50 pieces">26-50 pieces</option>
                  <option value="51-100 pieces">51-100 pieces</option>
                  <option value="101-200 pieces">101-200 pieces</option>
                  <option value="201-500 pieces">201-500 pieces</option>
                  <option value="500+ pieces">500+ pieces</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">SEO Requirements (Select all that apply)</label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                  {[
                    "Keyword Research",
                    "On-page SEO",
                    "Meta Tags",
                    "Schema Markup",
                    "Internal Linking",
                    "Content Optimization",
                    "Local SEO",
                    "Technical SEO",
                    "None"
                  ].map((seo) => (
                    <label key={seo} className="flex items-center">
                      <input
                        type="checkbox"
                        name="seoRequirements"
                        value={seo}
                        checked={formData.seoRequirements.includes(seo)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {seo}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Competitor Analysis</label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="competitorAnalysis"
                    checked={formData.competitorAnalysis}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Include competitor analysis in the content strategy</span>
                </div>
              </div>
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range *</label>
                <select
                  name="budgetRange"
                  onChange={handleChange}
                  value={formData.budgetRange}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Budget Range</option>
                  <option value="$500 - $1,000">$500 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                  <option value="$20,000 - $50,000">$20,000 - $50,000</option>
                  <option value="$50,000+">$50,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Timeline *</label>
                <select
                  name="timeline"
                  onChange={handleChange}
                  value={formData.timeline}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Timeline</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Priority *</label>
                <select
                  name="priority"
                  onChange={handleChange}
                  value={formData.priority}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes *</label>
                <textarea
                  name="additionalNotes"
                  placeholder="Provide any additional details about your AI content requirements..."
                  onChange={handleChange}
                  value={formData.additionalNotes}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
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
          
          {/* Buttons */}
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
                type="submit"
                className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleSubmit}
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
    </div>
  );
}
