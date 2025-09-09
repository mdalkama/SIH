import React from "react";
import { ChevronDown } from "lucide-react";

// Reusable Input Field Component with consistent styling
const InputField = ({ 
  label, 
  placeholder, 
  type = "text", 
  required = false, 
  value, 
  onChange, 
  name,
  error
}) => (
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
      className={`w-full border rounded-lg px-4 py-3 bg-[#f8fafc] text-sm transition-all duration-200 placeholder-[#94a3b8] focus:outline-none focus:border-[#3b82f6] focus:shadow-md ${
        error ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
      }`}
    />
    {error && <span className="text-xs text-[#ef4444]">{error}</span>}
  </div>
);

// Reusable Select Field Component with dropdown styling
const SelectField = ({ 
  label, 
  options = [], 
  required = false, 
  value, 
  onChange, 
  name,
  placeholder = "-- Select --",
  error
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold text-[#1e40af]">
      {label}
      {required && <span className="text-[#ef4444] ml-1">*</span>}
    </label>
    <div className="relative">
      <select 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border rounded-lg px-4 py-3 bg-[#f8fafc] text-sm appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#3b82f6] focus:shadow-md hover:bg-[#e0f2fe] ${
          error ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
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

/**
 * OtherDetails Component
 * Handles only the 3 fields shown in the image: parent income, income amount, and TFWS application
 * Backend API endpoint: /api/other-details
 */
const OtherDetails = ({ formData, handleInputChange, errors = {} }) => {
  return (
    <div className="space-y-8">
      {/* Other Details Section - Only 3 fields as per image */}
      <div>
        <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
          अन्य विवरण (Other Details)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent's income from all sources dropdown */}
          <SelectField
            label="सभी स्रोतों से माता-पिता की आय (Parent's income from all sources)"
            name="parentIncome"
            value={formData.parentIncome || ''}
            onChange={handleInputChange}
            options={[
              "Less than Rs 8 lacs",
              "Rs 8 lacs to Rs 12 lacs", 
              "Rs 12 lacs to Rs 20 lacs",
              "More than Rs 20 lacs"
            ]}
            placeholder="Select income range"
            required
            error={errors.parentIncome}
          />
          
          {/* Parent's Income In Amount field */}
          <InputField
            label="माता-पिता की आय राशि में (Parent's Income In Amount)"
            name="parentIncomeAmount"
            type="number"
            value={formData.parentIncomeAmount || ''}
            onChange={handleInputChange}
            placeholder="200000"
            required
            error={errors.parentIncomeAmount}
          />
          
          {/* TFWS application dropdown */}
          <SelectField
            label="क्या आप TFWS आवेदन करना चाहते है (Do you want apply for TFWS)"
            name="tfwsApplication"
            value={formData.tfwsApplication || ''}
            onChange={handleInputChange}
            options={["Yes", "No"]}
            placeholder="Select option"
            required
            error={errors.tfwsApplication}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherDetails;