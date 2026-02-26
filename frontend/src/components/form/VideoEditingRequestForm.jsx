"use client";

import { useState, useEffect } from "react";

export default function VideoEditingRequestForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceType: "",
    projectDescription: "",
    timeline: "",
    budgetRange: "",
    additionalNotes: "",
  });

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    if (step === 1) return formData.fullName.trim() && formData.email.trim() && formData.phone.trim();
    if (step === 2) return formData.serviceType && formData.projectDescription.trim();
    if (step === 3) return true;
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
    else alert("Please fill all required fields.");
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captcha) {
      alert("CAPTCHA verification failed. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/video-editing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      alert("Request submitted successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };

  const steps = 4;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full relative max-h-[90vh] overflow-y-auto">
      <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold z-10">×</button>
      <h2 className="text-2xl font-semibold mb-6 text-center">Video Editing & 3D Animation Request — Step {step} of {steps}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
              <input type="text" name="fullName" placeholder="Your full name" onChange={handleChange} value={formData.fullName} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email *</label>
              <input type="email" name="email" placeholder="Your email" onChange={handleChange} value={formData.email} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Phone *</label>
              <input type="text" name="phone" placeholder="Your phone" onChange={handleChange} value={formData.phone} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" required />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Service Type *</label>
              <select name="serviceType" onChange={handleChange} value={formData.serviceType} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" required>
                <option value="">Select</option>
                <option value="Video Editing">Video Editing</option>
                <option value="3D Animation">3D Animation</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Project Description *</label>
              <textarea name="projectDescription" rows={4} placeholder="Describe your project" onChange={handleChange} value={formData.projectDescription} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" required />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Timeline</label>
              <input type="text" name="timeline" placeholder="e.g. 2 weeks" onChange={handleChange} value={formData.timeline} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range</label>
              <input type="text" name="budgetRange" placeholder="e.g. $500 - $2000" onChange={handleChange} value={formData.budgetRange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Additional Notes</label>
              <textarea name="additionalNotes" rows={3} placeholder="Any other details" onChange={handleChange} value={formData.additionalNotes} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Verify CAPTCHA *</label>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-gray-200 rounded font-mono text-lg tracking-widest">{captcha}</span>
                <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter above code" className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-[#00e4fc]" maxLength={6} />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 ? <button type="button" onClick={prevStep} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Back</button> : <span />}
          {step < steps ? <button type="button" onClick={nextStep} className="px-6 py-2 bg-[#0A2540] text-white rounded-lg hover:opacity-90">Next</button> : <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#00e4fc] to-[#00ffce] text-white font-semibold rounded-lg">Submit</button>}
        </div>
      </form>
    </div>
  );
}
