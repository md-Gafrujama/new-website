"use client";

import { useState, useEffect } from "react";

export default function HealthcareRequestForm({ onClose }) {
  // Move state declarations to the top
  const [step, setStep] = useState(1);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    clinicHospitalName: "",
    facilityType: "",
    specialties: [],
    numberOfDoctorsStaff: "",
    patientVolume: "",
    solutionType: [],
    requiredFeatures: [],
    integrationRequirements: [],
    deploymentPreference: "",
    platformRequirements: [],
    complianceRequirements: [],
    dataSecurityNeeds: [],
    budgetRange: "",
    timeline: "",
    urgencyLevel: "",
    contactRole: "",
    supportRequirements: [],
    additionalNotes: "",
  });

  // Add prevStep function
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Generate captcha only on client-side
  const generateCaptcha = () => {
    if (typeof window !== 'undefined') {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCaptcha(result);
    }
  };

  // Initialize captcha on component mount - client-side only
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

  const steps = 12;

  // Validate step fields
  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.clinicHospitalName;
      case 2:
        return formData.facilityType;
      case 3:
        return formData.solutionType.length > 0;
      case 4:
        return formData.requiredFeatures.length > 0;
      case 5:
        return formData.integrationRequirements.length > 0 && formData.deploymentPreference;
      case 6:
        return formData.numberOfDoctorsStaff && formData.patientVolume;
      case 7:
        return formData.specialties.length > 0;
      case 8:
        return formData.budgetRange && formData.timeline && formData.urgencyLevel && formData.contactRole;
      case 9:
        return formData.complianceRequirements.length > 0;
      case 10:
        return formData.dataSecurityNeeds.length > 0;
      case 11:
        return true; // optional support requirements
      case 12:
        return true; // additional notes and captcha in last step
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    } else {
      alert("Please fill all required fields");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'clinicHospitalName',
      'solutionType', 'requiredFeatures', 'numberOfDoctorsStaff',
      'budgetRange', 'timeline', 'urgencyLevel', 'contactRole'
    ];

    const missingFields = requiredFields.filter(field => {
      if (Array.isArray(formData[field])) {
        return !formData[field] || formData[field].length === 0;
      }
      return !formData[field] || formData[field].trim() === '';
    });

    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate CAPTCHA
    if (captchaInput.toUpperCase() !== captcha) {
      alert("CAPTCHA verification failed. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/healthcare-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit request");
      }

      alert("Form submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full relative max-h-[90vh] overflow-y-auto">
      {/* Only render form content on client-side */}
      {typeof window !== 'undefined' && (
        <>
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
                  <label className="block text-gray-700 text-sm font-medium mb-2">Clinic/Hospital Name *</label>
                  <input
                    type="text"
                    name="clinicHospitalName"
                    placeholder="Enter clinic/hospital name"
                    onChange={handleChange}
                    value={formData.clinicHospitalName}
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
                  <label className="block text-gray-700 text-sm font-medium mb-2">Facility Type *</label>
                  <select
                    name="facilityType"
                    onChange={handleChange}
                    value={formData.facilityType}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Facility Type</option>
                    <option>Private Clinic</option>
                    <option>Multi-specialty Clinic</option>
                    <option>Hospital</option>
                    <option>Multi-specialty Hospital</option>
                    <option>Specialty Hospital</option>
                    <option>Diagnostic Center</option>
                    <option>Dental Clinic</option>
                    <option>Eye Care Center</option>
                    <option>Skin Care Center</option>
                    <option>Physiotherapy Center</option>
                    <option>Maternity Center</option>
                    <option>Pediatric Center</option>
                    <option>Mental Health Center</option>
                    <option>Rehabilitation Center</option>
                    <option>Emergency Care</option>
                    <option>Urgent Care</option>
                    <option>Nursing Home</option>
                    <option>Home Healthcare</option>
                    <option>Telemedicine Center</option>
                    <option>Mobile Clinic</option>
                    <option>Corporate Health Center</option>
                    <option>Government Hospital</option>
                    <option>NGO/Charitable Hospital</option>
                    <option>Research Institute</option>
                    <option>Medical College Hospital</option>
                    <option>Other</option>
                  </select>
                </div>
              </>
            )}

            {/* STEP 10 */}
            {step === 10 && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Data Security Needs (Select all that apply) *</label>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {[
                      "End-to-end Encryption",
                      "Data Backup & Recovery",
                      "Access Control",
                      "Audit Trails",
                      "Role-based Permissions",
                      "Two-factor Authentication",
                      "Biometric Authentication",
                      "Digital Signatures",
                      "Secure File Sharing",
                      "VPN Access",
                      "Firewall Protection",
                      "Anti-virus Protection",
                      "Regular Security Updates",
                      "Penetration Testing",
                      "Security Training",
                      "Incident Response Plan",
                      "Data Anonymization",
                      "Secure APIs",
                      "Cloud Security",
                      "On-premise Security"
                    ].map((security) => (
                      <label key={security} className="flex items-center">
                        <input
                          type="checkbox"
                          name="dataSecurityNeeds"
                          value={security}
                          checked={formData.dataSecurityNeeds.includes(security)}
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
                  <label className="block text-gray-700 text-sm font-medium mb-2">Specialties (Select all that apply) *</label>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {[
                      "General Medicine",
                      "Internal Medicine",
                      "Family Medicine",
                      "Pediatrics",
                      "Obstetrics & Gynecology",
                      "Surgery",
                      "Orthopedics",
                      "Cardiology",
                      "Neurology",
                      "Dermatology",
                      "Ophthalmology",
                      "ENT",
                      "Psychiatry",
                      "Radiology",
                      "Pathology",
                      "Anesthesiology",
                      "Emergency Medicine",
                      "Oncology",
                      "Urology",
                      "Gastroenterology",
                      "Pulmonology",
                      "Endocrinology",
                      "Nephrology",
                      "Rheumatology",
                      "Infectious Diseases",
                      "Geriatrics",
                      "Sports Medicine",
                      "Pain Management",
                      "Physical Medicine",
                      "Plastic Surgery",
                      "Dentistry",
                      "Physiotherapy",
                      "Nursing",
                      "Pharmacy",
                      "Other"
                    ].map((specialty) => (
                      <label key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          name="specialties"
                          value={specialty}
                          checked={formData.specialties.includes(specialty)}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        {specialty}
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
                  <label className="block text-gray-700 text-sm font-medium mb-2">Number of Doctors/Staff *</label>
                  <select
                    name="numberOfDoctorsStaff"
                    onChange={handleChange}
                    value={formData.numberOfDoctorsStaff}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Number of Doctors/Staff</option>
                    <option>1-5</option>
                    <option>6-15</option>
                    <option>16-30</option>
                    <option>31-50</option>
                    <option>51-100</option>
                    <option>101-250</option>
                    <option>250+</option>
                    <option>Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Patient Volume *</label>
                  <select
                    name="patientVolume"
                    onChange={handleChange}
                    value={formData.patientVolume}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Patient Volume</option>
                    <option>1-50 patients/day</option>
                    <option>51-100 patients/day</option>
                    <option>101-200 patients/day</option>
                    <option>201-500 patients/day</option>
                    <option>500+ patients/day</option>
                    <option>Not Sure</option>
                  </select>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Solution Type (Select all that apply) *</label>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {[
                      "Appointment Booking System",
                      "Electronic Medical Records (EMR)",
                      "Electronic Health Records (EHR)",
                      "Patient Management System",
                      "Hospital Management System (HMS)",
                      "Practice Management System",
                      "Telemedicine Platform",
                      "Patient Portal",
                      "Doctor Portal",
                      "Pharmacy Management",
                      "Laboratory Management",
                      "Radiology Information System",
                      "Billing & Insurance System",
                      "Claims Management",
                      "Inventory Management",
                      "Staff Management",
                      "Mobile App for Patients",
                      "Mobile App for Doctors",
                      "Queue Management",
                      "Emergency Management",
                      "Bed Management",
                      "Operation Theater Management",
                      "Ambulance Management",
                      "Medical Equipment Management",
                      "Other"
                    ].map((solution) => (
                      <label key={solution} className="flex items-center">
                        <input
                          type="checkbox"
                          name="solutionType"
                          value={solution}
                          checked={formData.solutionType.includes(solution)}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        {solution}
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
                  <label className="block text-gray-700 text-sm font-medium mb-2">Required Features (Select all that apply) *</label>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {[
                      "Online Appointment Booking",
                      "Appointment Scheduling",
                      "Patient Registration",
                      "Patient Check-in/Check-out",
                      "Electronic Medical Records",
                      "Prescription Management",
                      "Medical History Tracking",
                      "Lab Results Management",
                      "Radiology Reports",
                      "Billing & Invoicing",
                      "Insurance Claims",
                      "Payment Processing",
                      "Inventory Management",
                      "Staff Scheduling",
                      "Patient Communication",
                      "SMS/Email Notifications",
                      "Appointment Reminders",
                      "WhatsApp Integration",
                      "Video Consultation",
                      "Telemedicine",
                      "Patient Portal Access",
                      "Doctor Portal Access",
                      "Mobile App",
                      "Queue Management",
                      "Walk-in Management",
                      "Emergency Booking",
                      "Multi-location Support",
                      "Analytics & Reporting",
                      "HIPAA Compliance",
                      "Data Security",
                      "Backup & Recovery",
                      "Multi-language Support",
                      "Medical Certificate Generation",
                      "Referral Management",
                      "Follow-up Management",
                      "Vital Signs Tracking",
                      "Medication Management",
                      "Allergy Management",
                      "Chronic Disease Management",
                      "Vaccination Records",
                      "Bed Management",
                      "OPD Management",
                      "IPD Management",
                      "ICU Management",
                      "Operation Theater Booking",
                      "Equipment Management",
                      "Ambulance Booking",
                      "Blood Bank Management",
                      "Dietary Management",
                      "Discharge Management",
                      "Death Certificate",
                      "Medical Audit",
                      "Quality Control",
                      "Accreditation Support",
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

            {/* STEP 5 */}
            {step === 5 && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Integration Requirements (Select all that apply) *</label>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {[
                      "Payment Gateways",
                      "SMS Services",
                      "WhatsApp Business API",
                      "Email Services",
                      "Insurance APIs",
                      "Government Health APIs",
                      "Laboratory Systems",
                      "Pharmacy Systems",
                      "Radiology Systems",
                      "Hospital Equipment",
                      "Accounting Software",
                      "Banking Systems",
                      "Video Call Platforms (Zoom, Teams)",
                      "Cloud Storage",
                      "Backup Systems",
                      "Security Systems",
                      "Biometric Systems",
                      "ID Card Systems",
                      "RFID Systems",
                      "Barcode Systems",
                      "POS Systems",
                      "CRM Systems",
                      "ERP Systems",
                      "PACS (Picture Archiving)",
                      "RIS (Radiology Information System)",
                      "LIS (Laboratory Information System)",
                      "HIS (Hospital Information System)",
                      "Telehealth Platforms",
                      "Wearable Devices",
                      "IoT Medical Devices",
                      "AI/ML Analytics",
                      "Custom APIs",
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
                    <option>Mobile-first</option>
                    <option>No Preference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Platform Requirements (Select all that apply)</label>
                  <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                    {[
                      "Web Application",
                      "Desktop Application",
                      "Mobile App (iOS)",
                      "Mobile App (Android)",
                      "Tablet App",
                      "Kiosk Application",
                      "API Integration",
                      "Wearable App",
                      "Smart TV App"
                    ].map((platform) => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          name="platformRequirements"
                          value={platform}
                          checked={formData.platformRequirements.includes(platform)}
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

            {/* STEP 9 */}
            {step === 9 && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Compliance Requirements (Select all that apply) *</label>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {[
                      "HIPAA Compliance",
                      "HITECH Compliance",
                      "FDA Compliance",
                      "Joint Commission Standards",
                      "ISO 27001",
                      "SOC 2 Compliance",
                      "GDPR Compliance",
                      "Local Health Regulations",
                      "Medical Board Requirements",
                      "Insurance Board Requirements",
                      "Government Health Standards",
                      "International Standards",
                      "Accreditation Requirements",
                      "None Specified",
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
                  <label className="block text-gray-700 text-sm font-medium mb-2">Budget Range *</label>
                  <select
                    name="budgetRange"
                    onChange={handleChange}
                    value={formData.budgetRange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Budget Range</option>
                    <option>$3,000 - $8,000</option>
                    <option>$8,000 - $20,000</option>
                    <option>$20,000 - $40,000</option>
                    <option>$40,000 - $80,000</option>
                    <option>$80,000 - $150,000</option>
                    <option>$150,000 - $300,000</option>
                    <option>$300,000+</option>
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
                    <option>6-12 months</option>
                    <option>12-18 months</option>
                    <option>18+ months</option>
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
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Urgency Level</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Contact Role *</label>
                  <select
                    name="contactRole"
                    onChange={handleChange}
                    value={formData.contactRole}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Contact Role</option>
                    <option>Doctor/Physician</option>
                    <option>Hospital Administrator</option>
                    <option>Practice Manager</option>
                    <option>IT Manager</option>
                    <option>CTO/Technical Lead</option>
                    <option>Healthcare Consultant</option>
                    <option>Department Head</option>
                    <option>Medical Director</option>
                    <option>Nursing Supervisor</option>
                    <option>Operations Manager</option>
                    <option>Business Owner</option>
                    <option>Project Manager</option>
                    <option>Other</option>
                  </select>
                </div>
              </>
            )}

            {/* STEP 11 */}
            {step === 11 && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Support Requirements (Select all that apply)</label>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {[
                      "24/7 Technical Support",
                      "Business Hours Support",
                      "Emergency Support",
                      "On-site Support",
                      "Remote Support",
                      "Phone Support",
                      "Email Support",
                      "Live Chat Support",
                      "Training & Onboarding",
                      "User Manuals",
                      "Video Tutorials",
                      "Regular Updates",
                      "System Maintenance",
                      "Data Migration",
                      "Hardware Support",
                      "Software Support",
                      "Dedicated Account Manager"
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
              </>
            )}

            {/* STEP 12 */}
            {step === 12 && (
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
              </>
            )}

            {/* STEP 12 */}
            {step === 12 && (
              <>
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

            {/* STEP 12 */}
            {step === 12 && (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Review and Submit</h3>
                  <p className="text-gray-600 mb-4">Please review your information. Click Submit to send your healthcare solution request.</p>
                </div>
              </>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep} // Now prevStep is defined
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
        </>
      )}
    </div>

  );
}
