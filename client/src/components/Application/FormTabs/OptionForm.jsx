import React, { useState, useEffect } from "react";
import { ChevronDown, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import collegeListData from "../collegeList.json";

// Process college data for easier filtering
const processCollegeData = () => {
  const districts = [...new Set(collegeListData.map(item => item.district))].sort();
  const collegeTypes = [...new Set(collegeListData.map(item => item.college_type))].sort();
  
  // Create colleges with branches (dummy branches for now)
  const colleges = collegeListData.map((item, index) => ({
    id: index + 1,
    name: item.college_name,
    district: item.district,
    type: item.college_type,
    branches: [
      "Computer Science Engineering",
      "Mechanical Engineering", 
      "Electrical Engineering",
      "Civil Engineering",
      "Electronics & Communication"
    ]
  }));
  
  return { districts, collegeTypes, colleges };
};

const collegeData = processCollegeData();

const SelectField = ({ label, options = [], required = false, value, onChange, name, placeholder = "--Choose Option--", error }) => (
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
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748b] w-4 h-4 pointer-events-none" />
    </div>
    {error && <span className="text-xs text-[#ef4444]">{error}</span>}
  </div>
);

const OptionForm = ({ formData, handleInputChange, errors = {} }) => {
  const [currentSelection, setCurrentSelection] = useState({
    district: "", collegeType: "", collegeName: "", branchName: ""
  });
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [optionChoices, setOptionChoices] = useState(formData.optionChoices || []);
  
  // Filter colleges based on district and type selection
  useEffect(() => {
    let filtered = collegeData?.colleges || [];
    
    if (currentSelection.district) {
      filtered = filtered.filter(college => college.district === currentSelection.district);
    }
    
    if (currentSelection.collegeType) {
      filtered = filtered.filter(college => college.type === currentSelection.collegeType);
    }
    
    setFilteredColleges(filtered);
    
    // Reset college selection if current college is not in filtered list
    if (currentSelection.collegeName && !filtered.find(c => c.name === currentSelection.collegeName)) {
      setCurrentSelection(prev => ({ ...prev, collegeName: "", branchName: "" }));
    }
  }, [currentSelection.district, currentSelection.collegeType, currentSelection.collegeName]);
  
  // Filter branches based on selected college
  useEffect(() => {
    if (currentSelection.collegeName) {
      const selectedCollege = filteredColleges.find(college => college.name === currentSelection.collegeName);
      if (selectedCollege) {
        setFilteredBranches(selectedCollege.branches);
      }
    } else {
      setFilteredBranches([]);
    }
    
    // Reset branch selection if current branch is not available
    if (currentSelection.branchName && filteredBranches.length > 0 && !filteredBranches.includes(currentSelection.branchName)) {
      setCurrentSelection(prev => ({ ...prev, branchName: "" }));
    }
  }, [currentSelection.collegeName, currentSelection.branchName, filteredColleges, filteredBranches]);
  
  // Handle dropdown changes
  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    setCurrentSelection(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'district' && { collegeName: "", branchName: "" }),
      ...(name === 'collegeType' && { collegeName: "", branchName: "" }),
      ...(name === 'collegeName' && { branchName: "" })
    }));
  };
  
  const addChoice = () => {
    if (currentSelection.district && currentSelection.collegeType && 
        currentSelection.collegeName && currentSelection.branchName) {
      
      const exists = optionChoices.find(choice => 
        choice.collegeName === currentSelection.collegeName && 
        choice.branchName === currentSelection.branchName
      );
      
      if (!exists && optionChoices.length < 10) {
        const selectedCollege = filteredColleges.find(c => c.name === currentSelection.collegeName);
        const newChoice = {
          id: Date.now(),
          priority: optionChoices.length + 1,
          collegeId: selectedCollege?.id || '',
          collegeName: currentSelection.collegeName,
          branchName: currentSelection.branchName,
          district: currentSelection.district
        };
        
        const updatedChoices = [...optionChoices, newChoice];
        setOptionChoices(updatedChoices);
        handleInputChange({ target: { name: 'optionChoices', value: updatedChoices } });
        
        setCurrentSelection({ district: "", collegeType: "", collegeName: "", branchName: "" });
      }
    }
  };
  
  const removeChoice = (id) => {
    const updatedChoices = optionChoices
      .filter(choice => choice.id !== id)
      .map((choice, index) => ({ ...choice, priority: index + 1 }));
    
    setOptionChoices(updatedChoices);
    handleInputChange({ target: { name: 'optionChoices', value: updatedChoices } });
  };
  
  const moveChoiceUp = (id) => {
    const index = optionChoices.findIndex(choice => choice.id === id);
    if (index > 0) {
      const updatedChoices = [...optionChoices];
      [updatedChoices[index], updatedChoices[index - 1]] = [updatedChoices[index - 1], updatedChoices[index]];
      updatedChoices.forEach((choice, idx) => { choice.priority = idx + 1; });
      
      setOptionChoices(updatedChoices);
      handleInputChange({ target: { name: 'optionChoices', value: updatedChoices } });
    }
  };
  
  const moveChoiceDown = (id) => {
    const index = optionChoices.findIndex(choice => choice.id === id);
    if (index < optionChoices.length - 1) {
      const updatedChoices = [...optionChoices];
      [updatedChoices[index], updatedChoices[index + 1]] = [updatedChoices[index + 1], updatedChoices[index]];
      updatedChoices.forEach((choice, idx) => { choice.priority = idx + 1; });
      
      setOptionChoices(updatedChoices);
      handleInputChange({ target: { name: 'optionChoices', value: updatedChoices } });
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-[#1e40af] mb-4 border-b pb-2">
          विकल्प फॉर्म (Option Form)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <SelectField
            label="जिला (District)"
            name="district"
            value={currentSelection.district}
            onChange={handleSelectionChange}
            options={collegeData?.districts || []}
            placeholder="Select District"
            required
            error={errors.district}
          />
          
          <SelectField
            label="कॉलेज का प्रकार (Type of College)"
            name="collegeType"
            value={currentSelection.collegeType}
            onChange={handleSelectionChange}
            options={collegeData?.collegeTypes || []}
            placeholder="--Choose Option--"
            required
            error={errors.collegeType}
          />
          
          <SelectField
            label="कॉलेज का नाम (Name of College)"
            name="collegeName"
            value={currentSelection.collegeName}
            onChange={handleSelectionChange}
            options={filteredColleges.map(college => college.name)}
            placeholder="--Choose Option--"
            required
            error={errors.collegeName}
          />
          
          <SelectField
            label="शाखा का नाम (Branch)"
            name="branchName"
            value={currentSelection.branchName}
            onChange={handleSelectionChange}
            options={filteredBranches}
            placeholder="--Choose Option--"
            required
            error={errors.branchName}
          />
        </div>
        
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={addChoice}
            disabled={!currentSelection.district || !currentSelection.collegeType || 
                     !currentSelection.collegeName || !currentSelection.branchName}
            className="flex items-center space-x-2 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus size={16} />
            <span>Add Choice</span>
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-[#64748b] mb-4">Option Choose List</h3>
        
        {optionChoices.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name of College</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Branch Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {optionChoices.map((choice, index) => (
                  <tr key={choice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{choice.priority}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">({choice.collegeId}) {choice.collegeName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{choice.branchName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => removeChoice(choice.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => moveChoiceUp(choice.id)}
                          disabled={index === 0}
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => moveChoiceDown(choice.id)}
                          disabled={index === optionChoices.length - 1}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No choices added yet. Please add your college preferences above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionForm;