import React from "react";

// Enhanced Input Component
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


const AddressDetails = ({ formData, handleInputChange, errors = {} }) => {
  // Function to copy permanent address to correspondence address
  const copyPermanentToCorrespondence = (e) => {
    if (e.target.checked) {
      // Create synthetic events for all correspondence fields
      const fieldsToUpdate = [
        { name: 'correspondenceAddressLine1', value: formData.permanentAddressLine1 || '' },
        { name: 'correspondenceAddressLine2', value: formData.permanentAddressLine2 || '' },
        { name: 'correspondenceAddressLine3', value: formData.permanentAddressLine3 || '' },
        { name: 'correspondenceState', value: formData.permanentState || '' },
        { name: 'correspondenceDistrict', value: formData.permanentDistrict || '' },
        { name: 'correspondenceBlockTehsil', value: formData.permanentBlockTehsil || '' },
        { name: 'correspondenceCityVillage', value: formData.permanentCityVillage || '' },
        { name: 'correspondencePincode', value: formData.permanentPincode || '' }
      ];
      
      fieldsToUpdate.forEach(field => {
        const event = {
          target: { name: field.name, value: field.value }
        };
        handleInputChange(event);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Permanent Address Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
          Permanent Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address Line 1 */}
          <InputField
            label="पता पंक्ति 1 (Address Line 1)*"
            name="permanentAddressLine1"
            value={formData.permanentAddressLine1 || ''}
            onChange={handleInputChange}
            placeholder="Enter address line 1"
            required
            error={errors.permanentAddressLine1}
          />
          
          {/* Address Line 2 */}
          <InputField
            label="पता पंक्ति 2 (Address Line 2)*"
            name="permanentAddressLine2"
            value={formData.permanentAddressLine2 || ''}
            onChange={handleInputChange}
            placeholder="Enter address line 2"
            required
            error={errors.permanentAddressLine2}
          />
          
          {/* Address Line 3 */}
          <InputField
            label="पता पंक्ति 3 (Address Line 3)"
            name="permanentAddressLine3"
            value={formData.permanentAddressLine3 || ''}
            onChange={handleInputChange}
            placeholder="Enter address line 3"
            error={errors.permanentAddressLine3}
          />
          
          {/* State */}
          <InputField
            label="राज्य (State)*"
            name="permanentState"
            value={formData.permanentState || ''}
            onChange={handleInputChange}
            placeholder="Enter State"
            required
            error={errors.permanentState}
          />
          
          {/* District */}
          <InputField
            label="जिला (District)*"
            name="permanentDistrict"
            value={formData.permanentDistrict || ''}
            onChange={handleInputChange}
            placeholder="Enter District"
            required
            error={errors.permanentDistrict}
          />
          
          {/* Block/Tehsil */}
          <InputField
            label="ब्लॉक/तहसील (Block/Tehsil)"
            name="permanentBlockTehsil"
            value={formData.permanentBlockTehsil || ''}
            onChange={handleInputChange}
            placeholder="Enter Block/Tehsil"
            error={errors.permanentBlockTehsil}
          />
          
          {/* City/Village */}
          <InputField
            label="शहर/गांव (City/Village)*"
            name="permanentCityVillage"
            value={formData.permanentCityVillage || ''}
            onChange={handleInputChange}
            placeholder="Enter city or village"
            required
            error={errors.permanentCityVillage}
          />
          
          {/* Pincode */}
          <InputField
            label="पिन कोड (Pincode)*"
            name="permanentPincode"
            type="number"
            value={formData.permanentPincode || ''}
            onChange={handleInputChange}
            placeholder="Enter 6-digit pincode"
            required
            error={errors.permanentPincode}
          />
        </div>
      </div>

      {/* Correspondence Address Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
          Correspondence Address
        </h3>
        
        {/* Checkbox to copy permanent address */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 text-sm text-[#64748b] cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-[#1e40af] focus:ring-[#1e40af]"
              onChange={copyPermanentToCorrespondence}
            />
            <span>Use Correspondence address as permanent address.</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address Line 1 */}
          <InputField
            label="पता पंक्ति 1 (Address Line 1)*"
            name="correspondenceAddressLine1"
            value={formData.correspondenceAddressLine1 || ''}
            onChange={handleInputChange}
            placeholder="Enter address line 1"
            required
            error={errors.correspondenceAddressLine1}
          />
          
          {/* Address Line 2 */}
          <InputField
            label="पता पंक्ति 2 (Address Line 2)*"
            name="correspondenceAddressLine2"
            value={formData.correspondenceAddressLine2 || ''}
            onChange={handleInputChange}
            placeholder="Enter address line 2"
            required
            error={errors.correspondenceAddressLine2}
          />
          
          {/* Address Line 3 */}
          <InputField
            label="पता पंक्ति 3 (Address Line 3)"
            name="correspondenceAddressLine3"
            value={formData.correspondenceAddressLine3 || ''}
            onChange={handleInputChange}
            placeholder="Enter address line 3"
            error={errors.correspondenceAddressLine3}
          />
          
          {/* State */}
          <InputField
            label="राज्य (State)*"
            name="correspondenceState"
            value={formData.correspondenceState || ''}
            onChange={handleInputChange}
            placeholder="Enter State"
            required
            error={errors.correspondenceState}
          />
          
          {/* District */}
          <InputField
            label="जिला (District)*"
            name="correspondenceDistrict"
            value={formData.correspondenceDistrict || ''}
            onChange={handleInputChange}
            placeholder="Enter District"
            required
            error={errors.correspondenceDistrict}
          />
          
          {/* Block/Tehsil */}
          <InputField
            label="ब्लॉक/तहसील (Block/Tehsil)"
            name="correspondenceBlockTehsil"
            value={formData.correspondenceBlockTehsil || ''}
            onChange={handleInputChange}
            placeholder="Enter Block/Tehsil"
            error={errors.correspondenceBlockTehsil}
          />
          
          {/* City/Village */}
          <InputField
            label="शहर/गांव (City/Village)*"
            name="correspondenceCityVillage"
            value={formData.correspondenceCityVillage || ''}
            onChange={handleInputChange}
            placeholder="Enter city or village"
            required
            error={errors.correspondenceCityVillage}
          />
          
          {/* Pincode */}
          <InputField
            label="पिन कोड (Pincode)*"
            name="correspondencePincode"
            type="number"
            value={formData.correspondencePincode || ''}
            onChange={handleInputChange}
            placeholder="Enter 6-digit pincode"
            required
            error={errors.correspondencePincode}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;