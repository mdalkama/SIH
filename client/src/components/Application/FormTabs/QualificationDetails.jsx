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
 * QualificationDetails Component
 * Dynamic component that changes based on admission type (diploma, degree, etc.)
 * Backend API endpoint: /api/qualification-details
 */
const QualificationDetails = ({ formData, handleInputChange, errors = {}, admissionType = "diploma" }) => {
  
  // Define qualification requirements based on admission type
  const getQualificationConfig = (type) => {
    switch(type.toLowerCase()) {
      case 'diploma':
      case 'polytechnic':
        return {
          title: 'Polytechnic Diploma Qualification',
          required: ['10th'],
          optional: ['12th'],
          allowSupplementary: true
        };
      case 'degree':
      case 'engineering':
      case 'btech':
        return {
          title: 'Engineering Degree Qualification', 
          required: ['10th', '12th'],
          optional: ['diploma'],
          allowSupplementary: false
        };
      case 'mtech':
      case 'masters':
        return {
          title: 'Masters Qualification',
          required: ['10th', '12th', 'graduation'],
          optional: [],
          allowSupplementary: false
        };
      case 'phd':
      case 'doctorate':
        return {
          title: 'PhD Qualification',
          required: ['10th', '12th', 'graduation', 'masters'],
          optional: [],
          allowSupplementary: false
        };
      default:
        return {
          title: 'Polytechnic Diploma Qualification',
          required: ['10th'],
          optional: ['12th'],
          allowSupplementary: true
        };
    }
  };
  
  const config = getQualificationConfig(admissionType);
  
  // Function to add supplementary record
  const addSupplementaryRecord = () => {
    const supplementaryData = {
      year: formData.supplementaryYear,
      rollNo: formData.supplementaryRollNo,
      subject: formData.supplementarySubject,
      class: formData.supplementaryClass
    };
    
    // Get existing supplementary records or initialize empty array
    const existingRecords = formData.supplementaryRecords || [];
    const updatedRecords = [...existingRecords, supplementaryData];
    
    // Update form data with new supplementary record
    const event = {
      target: { 
        name: 'supplementaryRecords', 
        value: updatedRecords 
      }
    };
    handleInputChange(event);
    
    // Clear the input fields after adding
    ['supplementaryYear', 'supplementaryRollNo', 'supplementarySubject', 'supplementaryClass'].forEach(field => {
      const clearEvent = {
        target: { name: field, value: '' }
      };
      handleInputChange(clearEvent);
    });
  };
  
  return (
    <div className="space-y-8">
      {/* 10th Class Educational Details Section - Always Required */}
      {config.required.includes('10th') && (
        <div>
          <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
            दसवीं कक्षा की जानकारी (10th Class Details) <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Board selection for 10th class */}
            <SelectField
              label="बोर्ड (Board)"
              name="tenthBoard"
              value={formData.tenthBoard || ''}
              onChange={handleInputChange}
              options={["RBSE", "CBSE", "ICSE", "Other State Board"]}
              placeholder="Select Board"
              required
              error={errors.tenthBoard}
            />
            
            {/* Year of passing */}
            <InputField
              label="पासिंग वर्ष (Year of Passing)"
              name="tenthYear"
              type="number"
              value={formData.tenthYear || ''}
              onChange={handleInputChange}
              placeholder="2020"
              required
              error={errors.tenthYear}
            />
            
            {/* Roll number */}
            <InputField
              label="रोल नंबर (Roll Number)"
              name="tenthRollNo"
              value={formData.tenthRollNo || ''}
              onChange={handleInputChange}
              placeholder="15124202"
              required
              error={errors.tenthRollNo}
            />
            
            {/* Marks Type - CGPA/GPA or Percentage */}
            <SelectField
              label="अंक प्रकार (Marks Type)"
              name="tenthMarksType"
              value={formData.tenthMarksType || ''}
              onChange={handleInputChange}
              options={["CGPA/GPA", "Percentage"]}
              placeholder="Select Type"
              required
              error={errors.tenthMarksType}
            />
            
            {/* Aggregate Maximum Marks */}
            <InputField
              label="कुल अधिकतम अंक (Aggregate Maximum Marks)"
              name="tenthMaxMarks"
              type="number"
              value={formData.tenthMaxMarks || ''}
              onChange={handleInputChange}
              placeholder="10"
              required
              error={errors.tenthMaxMarks}
            />
            
            {/* Aggregate Marks Obtained */}
            <InputField
              label="कुल प्राप्त अंक (Aggregate Marks Obtained)"
              name="tenthObtainedMarks"
              type="number"
              value={formData.tenthObtainedMarks || ''}
              onChange={handleInputChange}
              placeholder="9"
              required
              error={errors.tenthObtainedMarks}
            />
            
            {/* Percentage */}
            <InputField
              label="प्रतिशत (Per(%))"
              name="tenthPercentage"
              type="number"
              value={formData.tenthPercentage || ''}
              onChange={handleInputChange}
              placeholder="85.50"
              required
              error={errors.tenthPercentage}
            />
          </div>
          
          {/* Supplementary/Improvement Section for Diploma */}
          {config.allowSupplementary && (
            <div className="mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-[#1e40af] mb-4">
                  माध्यमिक में सुधार/पूरक के लिए उपस्थित (Appeared for Supplementary/Improvement in Secondary)
                </h4>
                
                {/* Yes/No Radio Buttons */}
                <div className="flex items-center space-x-6 mb-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="supplementaryAppeared" 
                      value="yes"
                      checked={formData.supplementaryAppeared === 'yes'}
                      onChange={handleInputChange}
                      className="text-[#1e40af] focus:ring-[#1e40af]"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="supplementaryAppeared" 
                      value="no"
                      checked={formData.supplementaryAppeared === 'no'}
                      onChange={handleInputChange}
                      className="text-[#1e40af] focus:ring-[#1e40af]"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
                
                {/* Supplementary Details - Show only if Yes is selected */}
                {formData.supplementaryAppeared === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <SelectField
                      label="वर्ष (Year of Passing)"
                      name="supplementaryYear"
                      value={formData.supplementaryYear || ''}
                      onChange={handleInputChange}
                      options={Array.from({length: 10}, (_, i) => (new Date().getFullYear() - i).toString())}
                      placeholder="Select Year"
                      error={errors.supplementaryYear}
                    />
                    
                    <InputField
                      label="रोल नंबर (Roll Number)"
                      name="supplementaryRollNo"
                      value={formData.supplementaryRollNo || ''}
                      onChange={handleInputChange}
                      placeholder="Enter Roll Number"
                      error={errors.supplementaryRollNo}
                    />
                    
                    <InputField
                      label="विषय (Subject)"
                      name="supplementarySubject"
                      value={formData.supplementarySubject || ''}
                      onChange={handleInputChange}
                      placeholder="Enter Subject"
                      error={errors.supplementarySubject}
                    />
                    
                    <SelectField
                      label="कक्षा (Class)"
                      name="supplementaryClass"
                      value={formData.supplementaryClass || ''}
                      onChange={handleInputChange}
                      options={["10th", "12th"]}
                      placeholder="Select Class"
                      error={errors.supplementaryClass}
                    />
                    
                    <div className="flex items-end">
                      <button 
                        type="button"
                        className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors text-sm"
                        onClick={addSupplementaryRecord}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Display Added Supplementary Records */}
          {formData.supplementaryRecords && formData.supplementaryRecords.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-semibold text-[#1e40af] mb-3">Added Supplementary Records:</h5>
              <div className="space-y-2">
                {formData.supplementaryRecords.map((record, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="grid grid-cols-4 gap-4 text-sm flex-1">
                      <span><strong>Year:</strong> {record.year}</span>
                      <span><strong>Roll No:</strong> {record.rollNo}</span>
                      <span><strong>Subject:</strong> {record.subject}</span>
                      <span><strong>Class:</strong> {record.class}</span>
                    </div>
                    <button 
                      type="button"
                      className="text-red-500 hover:text-red-700 text-sm"
                      onClick={() => {
                        const updatedRecords = formData.supplementaryRecords.filter((_, i) => i !== index);
                        const event = {
                          target: { name: 'supplementaryRecords', value: updatedRecords }
                        };
                        handleInputChange(event);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 12th Class Educational Details Section - Conditional */}
      {(config.required.includes('12th') || config.optional.includes('12th')) && (
        <div>
          <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
            बारहवीं कक्षा की जानकारी (12th Class Details) 
            {config.required.includes('12th') ? 
              <span className="text-red-500">*</span> : 
              <span className="text-gray-500 text-sm">(Optional)</span>
            }
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Board selection for 12th class */}
            <SelectField
              label="बोर्ड (Board)"
              name="twelfthBoard"
              value={formData.twelfthBoard || ''}
              onChange={handleInputChange}
              options={["RBSE", "CBSE", "ICSE", "Other State Board"]}
              placeholder="Select Board"
              required={config.required.includes('12th')}
              error={errors.twelfthBoard}
            />
            
            {/* Passing year for 12th class */}
            <InputField
              label="पासिंग वर्ष (Passing Year)"
              name="twelfthYear"
              type="number"
              value={formData.twelfthYear || ''}
              onChange={handleInputChange}
              placeholder="YYYY"
              required={config.required.includes('12th')}
              error={errors.twelfthYear}
            />
            
            {/* Percentage/Marks obtained in 12th */}
            <InputField
              label="प्रतिशत (Percentage)"
              name="twelfthPercentage"
              type="number"
              value={formData.twelfthPercentage || ''}
              onChange={handleInputChange}
              placeholder="Enter percentage"
              required={config.required.includes('12th')}
              error={errors.twelfthPercentage}
            />
            
            {/* Roll number for 12th class */}
            <InputField
              label="रोल नंबर (Roll Number)"
              name="twelfthRollNo"
              value={formData.twelfthRollNo || ''}
              onChange={handleInputChange}
              placeholder="Enter roll number"
              required={config.required.includes('12th')}
              error={errors.twelfthRollNo}
            />
            
            {/* Academic stream in 12th class */}
            <SelectField
              label="स्ट्रीम (Stream)"
              name="twelfthStream"
              value={formData.twelfthStream || ''}
              onChange={handleInputChange}
              options={["Science", "Commerce", "Arts"]}
              placeholder="Select Stream"
              required={config.required.includes('12th')}
              error={errors.twelfthStream}
            />
          </div>
        </div>
      )}

      {/* Graduation Details - For Higher Education */}
      {(config.required.includes('graduation') || config.optional.includes('graduation')) && (
        <div>
          <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
            स्नातक की जानकारी (Graduation Details) 
            {config.required.includes('graduation') ? 
              <span className="text-red-500">*</span> : 
              <span className="text-gray-500 text-sm">(Optional)</span>
            }
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField
              label="डिग्री का नाम (Degree Name)"
              name="graduationDegree"
              value={formData.graduationDegree || ''}
              onChange={handleInputChange}
              placeholder="B.Tech, B.E., B.Sc etc."
              required={config.required.includes('graduation')}
              error={errors.graduationDegree}
            />
            
            <InputField
              label="विषय/शाखा (Subject/Branch)"
              name="graduationBranch"
              value={formData.graduationBranch || ''}
              onChange={handleInputChange}
              placeholder="Computer Science, Mechanical etc."
              required={config.required.includes('graduation')}
              error={errors.graduationBranch}
            />
            
            <InputField
              label="विश्वविद्यालय (University)"
              name="graduationUniversity"
              value={formData.graduationUniversity || ''}
              onChange={handleInputChange}
              placeholder="Enter university name"
              required={config.required.includes('graduation')}
              error={errors.graduationUniversity}
            />
            
            <InputField
              label="पासिंग वर्ष (Passing Year)"
              name="graduationYear"
              type="number"
              value={formData.graduationYear || ''}
              onChange={handleInputChange}
              placeholder="YYYY"
              required={config.required.includes('graduation')}
              error={errors.graduationYear}
            />
            
            <InputField
              label="प्रतिशत/CGPA (Percentage/CGPA)"
              name="graduationPercentage"
              type="number"
              value={formData.graduationPercentage || ''}
              onChange={handleInputChange}
              placeholder="Enter percentage or CGPA"
              required={config.required.includes('graduation')}
              error={errors.graduationPercentage}
            />
          </div>
        </div>
      )}

      {/* Masters Details - For PhD */}
      {(config.required.includes('masters') || config.optional.includes('masters')) && (
        <div>
          <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
            पोस्ट ग्रेजुएशन की जानकारी (Masters Details) 
            {config.required.includes('masters') ? 
              <span className="text-red-500">*</span> : 
              <span className="text-gray-500 text-sm">(Optional)</span>
            }
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField
              label="डिग्री का नाम (Degree Name)"
              name="mastersDegree"
              value={formData.mastersDegree || ''}
              onChange={handleInputChange}
              placeholder="M.Tech, M.E., M.Sc etc."
              required={config.required.includes('masters')}
              error={errors.mastersDegree}
            />
            
            <InputField
              label="विषय/शाखा (Subject/Branch)"
              name="mastersBranch"
              value={formData.mastersBranch || ''}
              onChange={handleInputChange}
              placeholder="Specialization"
              required={config.required.includes('masters')}
              error={errors.mastersBranch}
            />
            
            <InputField
              label="विश्वविद्यालय (University)"
              name="mastersUniversity"
              value={formData.mastersUniversity || ''}
              onChange={handleInputChange}
              placeholder="Enter university name"
              required={config.required.includes('masters')}
              error={errors.mastersUniversity}
            />
            
            <InputField
              label="पासिंग वर्ष (Passing Year)"
              name="mastersYear"
              type="number"
              value={formData.mastersYear || ''}
              onChange={handleInputChange}
              placeholder="YYYY"
              required={config.required.includes('masters')}
              error={errors.mastersYear}
            />
            
            <InputField
              label="प्रतिशत/CGPA (Percentage/CGPA)"
              name="mastersPercentage"
              type="number"
              value={formData.mastersPercentage || ''}
              onChange={handleInputChange}
              placeholder="Enter percentage or CGPA"
              required={config.required.includes('masters')}
              error={errors.mastersPercentage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QualificationDetails;