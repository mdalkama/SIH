import React, { useState } from "react";
import { User, MapPin, FileText, BookOpen, ClipboardList, File, Eye, ChevronDown, Check } from "lucide-react";

// Cache for transliteration results
const cache = new Map();

// Function to transliterate English text to Hindi using Google Input Tools
async function transliterateToHindi(latinText) {
  if (!latinText) return '';
  const key = latinText.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);

  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(
      latinText
    )}&itc=hi-t-i0-und&num=1`;

    const res = await fetch(url);
    const data = await res.json();

    const suggestion =
      Array.isArray(data) &&
      data[0] === 'SUCCESS' &&
      data[1] &&
      data[1][0] &&
      data[1][0][1] &&
      data[1][0][1][0]
        ? data[1][0][1][0]
        : '';

    const value = suggestion || latinText;
    cache.set(key, value);
    return value;
  } catch (error) {
    console.error('Transliteration API error:', error);
    return latinText; // fallback
  }
}
import AddressDetails from "./FormTabs/AddressDetails";
import OtherDetails from "./FormTabs/OtherDetails";
import QualificationDetails from "./FormTabs/QualificationDetails";
import OptionForm from "./FormTabs/OptionForm";
import Documents from "./FormTabs/Documents";
import Preview from "./FormTabs/Preview";

const InputField = ({ label, placeholder, type = "text", required = false, value, onChange, name, error, disabled = false }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold text-[#1e40af]">
      {label}
      {required && <span className="text-[#ef4444] ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full border rounded-lg px-4 py-3 bg-[#f8fafc] text-sm transition-all duration-200 placeholder-[#94a3b8] focus:outline-none focus:border-[#3b82f6] focus:shadow-md ${
        error ? "border-[#ef4444]" : "border-[#e2e8f0]"
      } ${
        disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
      }`}
    />
    {error && <span className="text-xs text-[#ef4444]">{error}</span>}
  </div>
);


const SelectField = ({ label, options = [], required = false, value, onChange, name, placeholder = "-- Select --", error, disabled = false }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold text-[#1e40af]">
      {label}
      {required && <span className="text-[#ef4444] ml-1">*</span>}
    </label>
    <div className="relative">
      <select name={name} value={value} onChange={onChange} required={required} disabled={disabled}
        className={`w-full border rounded-lg px-4 py-3 bg-[#f8fafc] text-sm appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#3b82f6] focus:shadow-md ${
          error ? "border-[#ef4444]" : "border-[#e2e8f0]"
        } ${
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        }`}
      >
        <option value="" className="text-[#94a3b8]">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748b] w-4 h-4 pointer-events-none" />
    </div>
    {error && <span className="text-xs text-[#ef4444]">{error}</span>}
  </div>
);

const AdmissionForm = ({ formName = "Polytechnic Admission Form 2025", logoUrl = "https://svumshow.com/assets/images/department-logo/pngwing.png", admissionType = "diploma", sessionYear = "2025" }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    applicantName: "", applicantNameHindi: "", fatherName: "", fatherNameHindi: "", motherName: "", motherNameHindi: "",
    gender: "", dateOfBirth: "", email: "", mobile: "", maritalStatus: "", religion: "", nationality: "",
    preferentialCategory: "", kashmiriMigrant: "", preferentialCategoryType: "", reservationCategory: "",
    identityProof: "", identityNumber: "",
    permanentAddressLine1: "", permanentAddressLine2: "", permanentAddressLine3: "", permanentState: "",
    permanentDistrict: "", permanentBlockTehsil: "", permanentCityVillage: "", permanentPincode: "",
    correspondenceAddressLine1: "", correspondenceAddressLine2: "", correspondenceAddressLine3: "",
    correspondenceState: "", correspondenceDistrict: "", correspondenceBlockTehsil: "",
    correspondenceCityVillage: "", correspondencePincode: "",
    parentIncome: "", parentIncomeAmount: "", tfwsApplication: "",
    tenthBoard: "", tenthYear: "", tenthRollNo: "", tenthMarksType: "", tenthMaxMarks: "",
    tenthObtainedMarks: "", tenthPercentage: "", supplementaryAppeared: "", supplementaryYear: "",
    supplementaryRollNo: "", supplementarySubject: "", supplementaryClass: "", supplementaryRecords: [],
    twelfthBoard: "", twelfthYear: "", twelfthRollNo: "", twelfthPercentage: "", twelfthStream: "",
    graduationDegree: "", graduationBranch: "", graduationUniversity: "", graduationYear: "", graduationPercentage: "",
    mastersDegree: "", mastersBranch: "", mastersUniversity: "", mastersYear: "", mastersPercentage: "",
    optionChoices: []
  });

  const [errors, setErrors] = useState({});
  const [completedTabs, setCompletedTabs] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  const tabs = [
    { name: "Applicant Details", icon: <User size={16} /> },
    { name: "Address Details", icon: <MapPin size={16} /> },
    { name: "Other Details", icon: <FileText size={16} /> },
    { name: "Qualification Detail", icon: <BookOpen size={16} /> },
    { name: "Option Form", icon: <ClipboardList size={16} /> },
    { name: "Documents", icon: <File size={16} /> },
    { name: "Preview", icon: <Eye size={16} /> }
  ];

  const handleInputChange = async (e) => {
    if (isPaymentCompleted) return; // Prevent changes after payment
    const { name, value } = e.target;
    
    console.log(`🔄 Form field changed: ${name} = ${value}`);
    
    // Update the current field
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      console.log('Updated formData:', newData);
      return newData;
    });
    
    // Auto-transliterate English fields to corresponding Hindi fields
    if (name === 'applicantName' && value.trim()) {
      try {
        const hindiValue = await transliterateToHindi(value);
        setFormData((prev) => ({ ...prev, applicantNameHindi: hindiValue }));
      } catch (error) {
        console.log('Transliteration failed for applicantName:', error);
      }
    } else if (name === 'fatherName' && value.trim()) {
      try {
        const hindiValue = await transliterateToHindi(value);
        setFormData((prev) => ({ ...prev, fatherNameHindi: hindiValue }));
      } catch (error) {
        console.log('Transliteration failed for fatherName:', error);
      }
    } else if (name === 'motherName' && value.trim()) {
      try {
        const hindiValue = await transliterateToHindi(value);
        setFormData((prev) => ({ ...prev, motherNameHindi: hindiValue }));
      } catch (error) {
        console.log('Transliteration failed for motherName:', error);
      }
    }
    
    // Clear errors for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (isPaymentCompleted) return; // Prevent changes after payment
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [name]: "File size must be less than 2MB" }));
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, [name]: "Only PDF, JPG, JPEG, and PNG files are allowed" }));
        return;
      }
      
      setUploadedFiles((prev) => ({ ...prev, [name]: file }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      console.log(`File uploaded for ${name}:`, file.name);
    }
  };

  const validateCurrentTab = () => {
    const newErrors = {};

    if (activeTab === 0) {
      const requiredFields = [
        "applicantName", "applicantNameHindi", "fatherName", "fatherNameHindi", "motherName", "motherNameHindi",
        "gender", "dateOfBirth", "email", "mobile", "maritalStatus", "religion", "nationality",
        "preferentialCategory", "kashmiriMigrant", "preferentialCategoryType", "reservationCategory",
        "identityProof", "identityNumber",
      ];
      requiredFields.forEach((field) => {
        if (!formData[field]) newErrors[field] = "This field is required";
      });
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Please enter a valid 10-digit mobile number";
    } else if (activeTab === 5) {
      const requiredDocs = ['studentPhoto', 'studentSign', 'aadharCard', 'tenthMarksheet'];
      requiredDocs.forEach((field) => {
        if (!uploadedFiles[field]) newErrors[field] = "Required document";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs((prev) => [...prev, activeTab]);
      }
      console.log("Saving Tab Data:", { tab: activeTab, data: formData });
      if (activeTab < tabs.length - 1) {
        setActiveTab(activeTab + 1);
      }
    }
  };

  const canAccessTab = (tabIndex) => {
    if (tabIndex === 0) return true;
    return completedTabs.includes(tabIndex - 1);
  };

  const handleFinalSubmit = async (finalData) => {
    setIsSubmitting(true);
    try {
      console.log('=== FINAL FORM SUBMISSION ===');
      console.log('Form Data:', formData);
      console.log('Uploaded Files:', uploadedFiles);
      console.log('Final Data:', finalData);
      console.log('=== END SUBMISSION DATA ===');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('आवेदन पत्र सफलतापूर्वक जमा हो गया! भुगतान के लिए आगे बढ़ें।');
    } catch (error) {
      console.error('Submission error:', error);
      alert('आवेदन पत्र जमा करने में त्रुटि! कृपया पुन: प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    setIsPaymentCompleted(true);
    setActiveTab(6); // Force user to Preview tab after payment
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-in {
          animation: slideIn 0.3s ease-out;
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
      {/* Official Rajasthan Government Header - Bilingual */}
      <header className="bg-white shadow-lg border-b-2 border-[#1e40af]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Logo and Title Section - Official Bilingual Format */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={logoUrl} 
                  alt="Government of Rajasthan Logo" 
                  className="h-12 w-12 sm:h-16 sm:w-16 object-contain" 
                  onError={(e) => (e.target.style.display = "none")} 
                />
              </div>
              <div className="text-center sm:text-left">
                {/* Official Government Hierarchy - Hindi & English */}
                <h1 className="text-lg sm:text-xl font-bold text-[#1e40af] leading-tight">
                  राजस्थान सरकार
                </h1>
                <h1 className="text-sm sm:text-base font-semibold text-[#2563eb] leading-tight mb-1">
                  Government of Rajasthan
                </h1>
                <h2 className="text-sm sm:text-base font-semibold text-gray-700 leading-tight">
                  तकनीकी शिक्षा विभाग
                </h2>
                <h2 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight mb-2">
                  Department of Technical Education
                </h2>
                <h3 className="text-sm sm:text-base font-bold text-[#1e40af] leading-tight">
                  {formName}
                </h3>
              </div>
            </div>
            
            {/* Right Side Portal Info - Professional Styling */}
            <div className="hidden lg:block ml-auto">
              <div className="text-right border border-gray-200 rounded-lg px-4 py-3">
                <div className="text-sm font-bold text-[#1e40af] mb-2">Online Admission Portal</div>
                <div className="border-b border-gray-300 mb-2"></div>
                <div className="text-xs text-gray-600">
                  <div className="font-medium">Session {sessionYear}</div>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Highly Responsive Tab Navigation - Mobile Optimized */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4 sm:mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide px-1 sm:px-0">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              const isCompleted = completedTabs.includes(index);
              const canAccess = canAccessTab(index);

              return (
                <button
                  key={index}
                  onClick={() => canAccess && !isPaymentCompleted && setActiveTab(index)}
                  disabled={!canAccess || isPaymentCompleted}
                  className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-1.5 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-xs font-medium transition-all duration-500 ease-out border-b-2 sm:border-b-3 whitespace-nowrap flex-1 min-w-[60px] sm:min-w-0 transform ${
                    canAccess && !isPaymentCompleted ? 'cursor-pointer' : 'cursor-not-allowed'
                  } ${
                    isActive ? "bg-[#1e40af] text-white border-[#1e40af] font-bold shadow-md sm:shadow-lg scale-[1.02] sm:scale-105" :
                    isCompleted ? "bg-[#10b981] text-white border-[#10b981] hover:bg-[#059669] hover:shadow-sm sm:hover:shadow-md hover:scale-[1.01] sm:hover:scale-102" :
                    canAccess && !isPaymentCompleted ? "bg-[#f8fafc] text-[#64748b] border-transparent hover:bg-[#e2e8f0] hover:text-[#1e40af] hover:shadow-sm hover:scale-[1.01] sm:hover:scale-102" :
                    "bg-[#f1f5f9] text-[#94a3b8] border-transparent cursor-not-allowed opacity-60"
                  } ${
                    isPaymentCompleted && index !== 6 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {/* Icon Section - Responsive */}
                  <div className="flex items-center justify-center transition-all duration-300">
                    {isCompleted ? (
                      <div className="bg-white rounded-full p-0.5 sm:p-1 transition-transform duration-300 hover:scale-110">
                        <Check size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-[#10b981]" />
                      </div>
                    ) : isActive ? (
                      <div className="bg-white/20 rounded-full p-0.5 sm:p-1 transition-all duration-300">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                          {React.cloneElement(tab.icon, { size: 10, className: 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4' })}
                        </div>
                      </div>
                    ) : (
                      <div className="transition-all duration-300 w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                        {React.cloneElement(tab.icon, { size: 10, className: 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4' })}
                      </div>
                    )}
                  </div>
                  
                  {/* Text Section - Highly Responsive */}
                  <span className="text-[10px] sm:text-xs md:text-sm leading-tight text-center px-0.5 sm:px-0 font-medium sm:font-normal">
                    <span className="block sm:hidden">
                      {/* Mobile: Shortened text */}
                      {tab.name.split(' ')[0]}
                    </span>
                    <span className="hidden sm:block">
                      {/* Desktop: Full text */}
                      {tab.name}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Super Responsive Form Container */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 sm:p-6 slide-in">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#1e40af] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              {activeTab === 0 && "आवेदक विवरण / Applicant Details"}
              {activeTab === 1 && "पता विवरण / Address Details"}
              {activeTab === 2 && "अन्य विवरण / Other Details"}
              {activeTab === 3 && "शैक्षणिक योग्यता / Qualification Details"}
              {activeTab === 4 && "विकल्प फॉर्म / Option Form"}
              {activeTab === 5 && "दस्तावेज़ / Documents"}
              {activeTab === 6 && "पूर्वावलोकन / Preview"}
            </h2>
          
          </div>

          {activeTab === 0 && (
            <form onSubmit={(e) => e.preventDefault()}>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="आवेदक का नाम (Applicant's Name)" name="applicantName" value={formData.applicantName} onChange={handleInputChange} placeholder="Enter Applicant's Name" required error={errors.applicantName} disabled={isPaymentCompleted} />
                <InputField label="आवेदक का नाम हिंदी में (Applicant's Name in Hindi) " name="applicantNameHindi" value={formData.applicantNameHindi} onChange={handleInputChange} placeholder="आवेदक का नाम हिंदी में" required error={errors.applicantNameHindi} disabled={isPaymentCompleted} />
                <InputField label="पिता का नाम (Father's Name)" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="Enter Father's Name" required error={errors.fatherName} disabled={isPaymentCompleted} />
                <InputField label="पिता का नाम हिंदी में (Father's Name in Hindi) " name="fatherNameHindi" value={formData.fatherNameHindi} onChange={handleInputChange} placeholder="पिता का नाम हिंदी में" required error={errors.fatherNameHindi} disabled={isPaymentCompleted} />
                <InputField label="माता का नाम (Mother's Name)" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="Enter Mother's Name" required error={errors.motherName} disabled={isPaymentCompleted} />
                <InputField label="माता का नाम हिंदी में (Mother's Name in Hindi) " name="motherNameHindi" value={formData.motherNameHindi} onChange={handleInputChange} placeholder="माता का नाम हिंदी में" required error={errors.motherNameHindi} disabled={isPaymentCompleted} />
                <SelectField label="लिंग (Gender)" name="gender" value={formData.gender} onChange={handleInputChange} options={["Male", "Female", "Other"]} placeholder="Select Gender" required error={errors.gender} disabled={isPaymentCompleted} />
                <InputField label="जन्म तिथि (Date of Birth)" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required error={errors.dateOfBirth} disabled={isPaymentCompleted} />
                <InputField label="ईमेल (Email Address)" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email Address" required error={errors.email} disabled={isPaymentCompleted} />
                <InputField label="मोबाइल नंबर (Mobile Number)" name="mobile" type="tel" value={formData.mobile} onChange={handleInputChange} placeholder="9876543210" required error={errors.mobile} disabled={isPaymentCompleted} />
                <SelectField label="वैवाहिक स्थिति (Marital Status)" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} options={["Single", "Married", "Divorced"]} placeholder="Select Marital Status" required error={errors.maritalStatus} disabled={isPaymentCompleted} />
                <SelectField label="धर्म (Religion)" name="religion" value={formData.religion} onChange={handleInputChange} options={["Hindu", "Muslim", "Christian", "Sikh", "Other"]} placeholder="Select Religion" required error={errors.religion} disabled={isPaymentCompleted} />
                <SelectField label="राष्ट्रीयता (Nationality)" name="nationality" value={formData.nationality} onChange={handleInputChange} options={["Indian", "Other"]} placeholder="Select" required error={errors.nationality} disabled={isPaymentCompleted} />
                <SelectField label="प्राथमिकता श्रेणी (Preferential Category)" name="preferentialCategory" value={formData.preferentialCategory} onChange={handleInputChange} options={["Category A", "Category B"]} placeholder="Select" required error={errors.preferentialCategory} disabled={isPaymentCompleted} />
                <SelectField label="कश्मीरी प्रवासी (Kashmiri Migrant)" name="kashmiriMigrant" value={formData.kashmiriMigrant} onChange={handleInputChange} options={["Yes", "No"]} placeholder="Select" required error={errors.kashmiriMigrant} disabled={isPaymentCompleted} />
                <SelectField label="प्राथमिकता श्रेणी प्रकार (Preferential Category Type)" name="preferentialCategoryType" value={formData.preferentialCategoryType} onChange={handleInputChange} options={["Type 1", "Type 2"]} placeholder="Select" required error={errors.preferentialCategoryType} disabled={isPaymentCompleted} />
                <SelectField label="आरक्षण श्रेणी (Reservation Category)" name="reservationCategory" value={formData.reservationCategory} onChange={handleInputChange} options={["General", "OBC", "SC", "ST", "EWS"]} placeholder="Select" required error={errors.reservationCategory} disabled={isPaymentCompleted} />
                <SelectField label="पहचान पत्र (Identity Proof)" name="identityProof" value={formData.identityProof} onChange={handleInputChange} options={["Aadhar Card", "PAN Card", "Voter ID"]} placeholder="Select Identity Proof" required error={errors.identityProof} disabled={isPaymentCompleted} />
                <InputField label="पहचान पत्र नंबर (Number of ID Proof)" name="identityNumber" value={formData.identityNumber} onChange={handleInputChange} placeholder="Enter ID Number" required error={errors.identityNumber} disabled={isPaymentCompleted} />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0">
                <button type="button" onClick={() => window.location.reload()} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#1e40af] text-[#1e40af] font-medium rounded-lg hover:bg-[#e0f2fe] transition-all duration-200 cursor-pointer text-sm sm:text-base">Reset</button>
                <button type="button" onClick={handleNext} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1e40af] text-white font-bold rounded-lg hover:bg-[#1e3a8a] hover:shadow-lg transition-all duration-200 cursor-pointer text-sm sm:text-base">Save & Next</button>
              </div>
            </form>
          )}

          {activeTab === 1 && (
            <form onSubmit={(e) => e.preventDefault()}>
              <AddressDetails formData={formData} handleInputChange={handleInputChange} errors={errors} disabled={isPaymentCompleted} />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0">
                <button type="button" onClick={() => setActiveTab(0)} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#1e40af] text-[#1e40af] font-medium rounded-lg hover:bg-[#e0f2fe] transition-all duration-200 cursor-pointer text-sm sm:text-base">Previous</button>
                <button type="button" onClick={handleNext} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1e40af] text-white font-bold rounded-lg hover:bg-[#1e3a8a] hover:shadow-lg transition-all duration-200 cursor-pointer text-sm sm:text-base">Save & Next</button>
              </div>
            </form>
          )}

          {activeTab === 2 && (
            <form onSubmit={(e) => e.preventDefault()}>
              <OtherDetails formData={formData} handleInputChange={handleInputChange} errors={errors} disabled={isPaymentCompleted} />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0">
                <button type="button" onClick={() => setActiveTab(1)} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#1e40af] text-[#1e40af] font-medium rounded-lg hover:bg-[#e0f2fe] transition-all duration-200 cursor-pointer text-sm sm:text-base">Previous</button>
                <button type="button" onClick={handleNext} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1e40af] text-white font-bold rounded-lg hover:bg-[#1e3a8a] hover:shadow-lg transition-all duration-200 cursor-pointer text-sm sm:text-base">Save & Next</button>
              </div>
            </form>
          )}

          {activeTab === 3 && (
            <form onSubmit={(e) => e.preventDefault()}>
              <QualificationDetails formData={formData} handleInputChange={handleInputChange} errors={errors} admissionType={admissionType} disabled={isPaymentCompleted} />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0">
                <button type="button" onClick={() => setActiveTab(2)} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#1e40af] text-[#1e40af] font-medium rounded-lg hover:bg-[#e0f2fe] transition-all duration-200 cursor-pointer text-sm sm:text-base">Previous</button>
                <button type="button" onClick={handleNext} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1e40af] text-white font-bold rounded-lg hover:bg-[#1e3a8a] hover:shadow-lg transition-all duration-200 cursor-pointer text-sm sm:text-base">Save & Next</button>
              </div>
            </form>
          )}

          {activeTab === 4 && (
            <form onSubmit={(e) => e.preventDefault()}>
              <OptionForm formData={formData} handleInputChange={handleInputChange} errors={errors} disabled={isPaymentCompleted} />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0">
                <button type="button" onClick={() => setActiveTab(3)} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#1e40af] text-[#1e40af] font-medium rounded-lg hover:bg-[#e0f2fe] transition-all duration-200 cursor-pointer text-sm sm:text-base">Previous</button>
                <button type="button" onClick={handleNext} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1e40af] text-white font-bold rounded-lg hover:bg-[#1e3a8a] hover:shadow-lg transition-all duration-200 cursor-pointer text-sm sm:text-base">Save & Next</button>
              </div>
            </form>
          )}

          {activeTab === 5 && (
            <form onSubmit={(e) => e.preventDefault()}>
              <Documents handleFileChange={handleFileChange} errors={errors} uploadedFiles={uploadedFiles} disabled={isPaymentCompleted} />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0">
                <button type="button" onClick={() => setActiveTab(4)} className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#1e40af] text-[#1e40af] font-medium rounded-lg hover:bg-[#e0f2fe] transition-all duration-200 cursor-pointer text-sm sm:text-base">Previous</button>
                <button type="button" onClick={handleNext} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1e40af] text-white font-bold rounded-lg hover:bg-[#1e3a8a] hover:shadow-lg transition-all duration-200 cursor-pointer text-sm sm:text-base">Save & Next</button>
              </div>
            </form>
          )}

          {activeTab === 6 && (
            <>
              <Preview 
                formData={formData} 
                uploadedFiles={uploadedFiles} 
                handleSubmit={handleFinalSubmit} 
                isSubmitting={isSubmitting} 
                setActiveTab={setActiveTab} 
                admissionType={admissionType}
                onPaymentComplete={handlePaymentComplete}
                isFormDisabled={isPaymentCompleted}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;