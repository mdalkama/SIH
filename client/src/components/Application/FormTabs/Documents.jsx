import React from "react";
import { Upload, FileText, Image, CheckCircle } from "lucide-react";

/**
 * FileUploadField Component
 * Reusable file upload component with drag-and-drop styling
 */
const FileUploadField = ({ 
  label, 
  required = false, 
  accept, 
  onChange, 
  name, 
  error,
  uploadedFile 
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold text-[#1e40af]">
      {label}
      {required && <span className="text-[#ef4444] ml-1">*</span>}
    </label>
    <div className="relative">
      {/* Hidden file input */}
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        required={required}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Visual upload area */}
      <div className={`w-full border-2 border-dashed rounded-lg px-4 py-6 text-center transition-all duration-200 hover:border-[#3b82f6] hover:bg-[#e0f2fe] ${
        error ? 'border-[#ef4444] bg-red-50' : uploadedFile ? 'border-[#10b981] bg-green-50' : 'border-[#e2e8f0] bg-[#f8fafc]'
      }`}>
        {uploadedFile ? (
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="text-[#10b981]" size={20} />
            <span className="text-sm text-[#10b981] font-medium">File Uploaded</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto mb-2 text-[#64748b]" size={24} />
            <p className="text-sm text-[#64748b]">Click to upload or drag and drop</p>
            <p className="text-xs text-[#94a3b8] mt-1">PDF, JPG, PNG (Max 2MB)</p>
          </>
        )}
      </div>
    </div>
    {error && <span className="text-xs text-[#ef4444]">{error}</span>}
  </div>
);

/**
 * Documents Component
 * Handles document upload for admission process based on uploaded documents table
 * Backend API endpoint: /api/document-upload
 */
const Documents = ({ handleFileChange, errors = {}, uploadedFiles = {} }) => {
  // Total documents count for progress calculation  
  const totalDocuments = 7; // Total documents as per the uploaded documents table

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-[#1e40af] mb-2 flex items-center">
          <Upload className="mr-3" size={24} />
           अपलोड किए गए दस्तावेज़ (Uploaded Documents)
        </h2>
        <p className="text-sm text-[#64748b]">कृपया सभी आवश्यक दस्तावेज़ अपलोड करें। * चिह्नित फील्ड अनिवार्य हैं।</p>
      </div>

      {/* Documents Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-[#1e40af]">
            दस्तावेज़ सूची (Document List)
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Required Documents */}
          <div>
            <h4 className="text-md font-semibold text-[#1e40af] mb-4 flex items-center">
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs mr-2">आवश्यक</span>
              अनिवार्य दस्तावेज़ (Mandatory Documents)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Student Photo */}
              <FileUploadField
                label="1. छात्र फोटो (Student Photo)"
                name="studentPhoto"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                required
                error={errors.studentPhoto}
                uploadedFile={uploadedFiles.studentPhoto}
              />
              
              {/* 2. Student Signature */}
              <FileUploadField
                label="2. छात्र हस्ताक्षर (Student Sign)"
                name="studentSign"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                required
                error={errors.studentSign}
                uploadedFile={uploadedFiles.studentSign}
              />
              
              {/* 3. Aadhar Card */}
              <FileUploadField
                label="3. आधार कार्ड (Aadhar Card)"
                name="aadharCard"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
                error={errors.aadharCard}
                uploadedFile={uploadedFiles.aadharCard}
              />
              
              {/* 4. 10th Marksheet */}
              <FileUploadField
                label="4. 10वीं कक्षा की मार्कशीट (Marksheet of 10th class)"
                name="tenthMarksheet"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
                error={errors.tenthMarksheet}
                uploadedFile={uploadedFiles.tenthMarksheet}
              />
            </div>
          </div>

          {/* Optional Documents */}
          <div>
            <h4 className="text-md font-semibold text-[#1e40af] mb-4 flex items-center">
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs mr-2">वैकल्पिक</span>
              वैकल्पिक दस्तावेज़ (Optional Documents)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 5. Preferential Category Certificate */}
              <FileUploadField
                label="5. प्राथमिकता श्रेणी प्रमाण पत्र की स्कैन कॉपी अपलोड करें (Upload Scanned Copy of Preferential Category Certificate)"
                name="preferentialCategoryCertificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                error={errors.preferentialCategoryCertificate}
                uploadedFile={uploadedFiles.preferentialCategoryCertificate}
              />
              
              {/* 6. Affidavit Certificate */}
              <FileUploadField
                label="6. शपथ पत्र प्रमाण पत्र (Affidavit Certificate)"
                name="affidavitCertificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                error={errors.affidavitCertificate}
                uploadedFile={uploadedFiles.affidavitCertificate}
              />
              
              {/* 7. TFWS Certificate */}
              <FileUploadField
                label="7. TFWS प्रमाण पत्र (TFWS Certificate)"
                name="tfwsCertificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                error={errors.tfwsCertificate}
                uploadedFile={uploadedFiles.tfwsCertificate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Document Guidelines Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-[#1e40af] mb-4 flex items-center">
          <FileText size={20} className="mr-3" />
          📄 दस्तावेज़ दिशानिर्देश (Document Guidelines)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-sm text-[#1e40af] mb-2">फाइल आवश्यकताएं:</h5>
            <ul className="text-sm text-[#64748b] space-y-1">
              <li>• फाइल प्रकार: PDF, JPG, JPEG, PNG</li>
              <li>• अधिकतम आकार: 2MB प्रति फाइल</li>
              <li>• सभी दस्तावेज़ स्पष्ट और पठनीय हों</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-[#1e40af] mb-2">विशेष आवश्यकताएं:</h5>
            <ul className="text-sm text-[#64748b] space-y-1">
              <li>• फोटो: पासपोर्ट साइज़ (2x2 इंच)</li>
              <li>• हस्ताक्षर: सफ़ेद कागज़ पर स्याही से</li>
              <li>• आधार कार्ड और हस्ताक्षर अनिवार्य</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Progress Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-[#1e40af] flex items-center">
            <CheckCircle className="mr-3" size={20} />
            📈 अपलोड प्रगति (Upload Progress)
          </h4>
          <span className="text-sm font-medium text-[#64748b]">
            {Object.keys(uploadedFiles).length}/{totalDocuments} फाइलें अपलोड
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#10b981] to-[#059669] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${(Object.keys(uploadedFiles).length / totalDocuments) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Required documents status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className={`p-3 rounded-lg border ${uploadedFiles.studentPhoto ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <span className={`font-medium ${uploadedFiles.studentPhoto ? 'text-green-600' : 'text-red-600'}`}>
              {uploadedFiles.studentPhoto ? '✓' : '✗'} छात्र फोटो
            </span>
          </div>
          <div className={`p-3 rounded-lg border ${uploadedFiles.studentSign ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <span className={`font-medium ${uploadedFiles.studentSign ? 'text-green-600' : 'text-red-600'}`}>
              {uploadedFiles.studentSign ? '✓' : '✗'} हस्ताक्षर
            </span>
          </div>
          <div className={`p-3 rounded-lg border ${uploadedFiles.aadharCard ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <span className={`font-medium ${uploadedFiles.aadharCard ? 'text-green-600' : 'text-red-600'}`}>
              {uploadedFiles.aadharCard ? '✓' : '✗'} आधार कार्ड
            </span>
          </div>
          <div className={`p-3 rounded-lg border ${uploadedFiles.tenthMarksheet ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <span className={`font-medium ${uploadedFiles.tenthMarksheet ? 'text-green-600' : 'text-red-600'}`}>
              {uploadedFiles.tenthMarksheet ? '✓' : '✗'} 10वीं मार्कशीट
            </span>
          </div>
        </div>
        
        {Object.keys(uploadedFiles).length === totalDocuments && (
          <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium text-center">
              🎉 बधाई हो! सभी दस्तावेज़ सफलतापूर्वक अपलोड हो गए हैं!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;