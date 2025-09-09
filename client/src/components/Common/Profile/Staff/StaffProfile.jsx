import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Building, BookOpen, 
  FileText, Edit3, Download, Eye, Award, Clock, Users, Briefcase,
  Save, Upload, CheckCircle, AlertCircle, Camera, GraduationCap, IdCard
} from 'lucide-react';
import profileData from '../profileData.json';
import getRoleDisplayName from '../../../../utils/roleUtils';

const StaffProfile = () => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [staffData, setStaffData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();

          const createCompleteStaffData = (source = {}, fallback = profileData.staff) => ({
            ...fallback,
            ...source,
            _id: source._id || fallback._id || 'STAFF001',
            staffId: source.staffId || fallback.staffId || 'EMP-XX-XXXX',
            employeeCode: source.employeeCode || fallback.employeeCode || 'FAC001',
            name: source.name || fallback.name || 'Staff Name',
            email: source.email || fallback.email || 'staff@university.edu',
            phone: source.phone || fallback.phone || '+91 9876543210',
            alternatePhone: source.alternatePhone || fallback.alternatePhone || '+91 9876543210',
            designation: source.designation || fallback.designation || 'Assistant Professor',
            department: source.department || fallback.department || 'Computer Science',
            role: source.role || fallback.role || 'CollegeFaculty',
            profilePictureLink: source.profilePictureLink || fallback.profilePictureLink || '/api/placeholder/150/150',

            personalDetails: {
              ...fallback.personalDetails,
              ...(source.personalDetails || {}),
              fatherName: source?.personalDetails?.fatherName || fallback?.personalDetails?.fatherName || 'Father Name',
              motherName: source?.personalDetails?.motherName || fallback?.personalDetails?.motherName || 'Mother Name',
              dob: source?.personalDetails?.dob || fallback?.personalDetails?.dob || '1990-01-01',
              gender: source?.personalDetails?.gender || fallback?.personalDetails?.gender || 'male',
              nationality: source?.personalDetails?.nationality || fallback?.personalDetails?.nationality || 'Indian',
              bloodGroup: source?.personalDetails?.bloodGroup || fallback?.personalDetails?.bloodGroup || 'B+',
              maritalStatus: source?.personalDetails?.maritalStatus || fallback?.personalDetails?.maritalStatus || 'Single',
              aadhaarNo: source?.personalDetails?.aadhaarNo || fallback?.personalDetails?.aadhaarNo || '1234 5678 9012',
              panNo: source?.personalDetails?.panNo || fallback?.personalDetails?.panNo || 'ABCDE1234F'
            },

            employmentDetails: {
              ...fallback.employmentDetails,
              ...(source.employmentDetails || {}),
              joiningDate: source?.employmentDetails?.joiningDate || fallback?.employmentDetails?.joiningDate || '2022-01-01',
              employmentType: source?.employmentDetails?.employmentType || fallback?.employmentDetails?.employmentType || 'permanent',
              experience: source?.employmentDetails?.experience || fallback?.employmentDetails?.experience || 5,
              salary: source?.employmentDetails?.salary || fallback?.employmentDetails?.salary || 50000,
              qualification: source?.employmentDetails?.qualification || fallback?.employmentDetails?.qualification || 'M.Tech',
              specialization: source?.employmentDetails?.specialization || fallback?.employmentDetails?.specialization || 'Computer Science'
            },

            address: {
              ...fallback.address,
              ...(source.address || {}),
              street: source?.address?.street || fallback?.address?.street || 'Staff Address',
              city: source?.address?.city || fallback?.address?.city || 'City Name',
              state: source?.address?.state || fallback?.address?.state || 'State',
              zipCode: source?.address?.zipCode || fallback?.address?.zipCode || '000000',
              country: source?.address?.country || fallback?.address?.country || 'India'
            },

            emergencyContact: {
              ...fallback.emergencyContact,
              ...(source.emergencyContact || {}),
              name: source?.emergencyContact?.name || fallback?.emergencyContact?.name || 'Emergency Contact',
              phone: source?.emergencyContact?.phone || fallback?.emergencyContact?.phone || '+91 9876543210',
              relation: source?.emergencyContact?.relation || fallback?.emergencyContact?.relation || 'Relation'
            },

            bankDetails: {
              ...fallback.bankDetails,
              ...(source.bankDetails || {}),
              accountNumber: source?.bankDetails?.accountNumber || fallback?.bankDetails?.accountNumber || '123456789012',
              ifscCode: source?.bankDetails?.ifscCode || fallback?.bankDetails?.ifscCode || 'BANK0001234',
              bankName: source?.bankDetails?.bankName || fallback?.bankDetails?.bankName || 'Bank of India',
              branch: source?.bankDetails?.branch || fallback?.bankDetails?.branch || 'Main Branch'
            },

            status: source.status || fallback.status || 'active'
          });

          const completeData = createCompleteStaffData(data.user);
          setStaffData(completeData);
          console.log('Real staff data with fallbacks:', completeData);
        } else {
          const dummyData = createCompleteStaffData();
          setStaffData(dummyData);
          console.log('Using dummy staff data with placeholders');
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
        // Fallback to dummy data with placeholders
        const dummyData = {
          ...profileData.staff,
          _id: profileData.staff._id || 'STAFF001',
          staffId: profileData.staff.staffId || 'EMP-XX-XXXX',
          employeeCode: profileData.staff.employeeCode || 'FAC001',
          name: profileData.staff.name || 'Staff Name',
          email: profileData.staff.email || 'staff@university.edu',
          phone: profileData.staff.phone || '+91 9876543210',
          alternatePhone: profileData.staff.alternatePhone || '+91 9876543210',
          designation: profileData.staff.designation || 'Assistant Professor',
          department: profileData.staff.department || 'Computer Science',
          role: profileData.staff.role || 'CollegeFaculty',
          profilePictureLink: profileData.staff.profilePictureLink || '/api/placeholder/150/150',
          personalDetails: {
            ...profileData.staff.personalDetails,
            fatherName: profileData.staff.personalDetails?.fatherName || 'Father Name',
            motherName: profileData.staff.personalDetails?.motherName || 'Mother Name',
            dob: profileData.staff.personalDetails?.dob || '1990-01-01',
            gender: profileData.staff.personalDetails?.gender || 'male',
            nationality: profileData.staff.personalDetails?.nationality || 'Indian',
            bloodGroup: profileData.staff.personalDetails?.bloodGroup || 'B+',
            maritalStatus: profileData.staff.personalDetails?.maritalStatus || 'Single',
            aadhaarNo: profileData.staff.personalDetails?.aadhaarNo || '1234 5678 9012',
            panNo: profileData.staff.personalDetails?.panNo || 'ABCDE1234F'
          },
          employmentDetails: {
            ...profileData.staff.employmentDetails,
            joiningDate: profileData.staff.employmentDetails?.joiningDate || '2022-01-01',
            employmentType: profileData.staff.employmentDetails?.employmentType || 'permanent',
            experience: profileData.staff.employmentDetails?.experience || 5,
            salary: profileData.staff.employmentDetails?.salary || 50000,
            qualification: profileData.staff.employmentDetails?.qualification || 'M.Tech',
            specialization: profileData.staff.employmentDetails?.specialization || 'Computer Science'
          },
          address: {
            ...profileData.staff.address,
            street: profileData.staff.address?.street || 'Staff Address',
            city: profileData.staff.address?.city || 'City Name',
            state: profileData.staff.address?.state || 'State',
            zipCode: profileData.staff.address?.zipCode || '000000',
            country: profileData.staff.address?.country || 'India'
          },
          emergencyContact: {
            ...profileData.staff.emergencyContact,
            name: profileData.staff.emergencyContact?.name || 'Emergency Contact',
            phone: profileData.staff.emergencyContact?.phone || '+91 9876543210',
            relation: profileData.staff.emergencyContact?.relation || 'Relation'
          },
          bankDetails: {
            ...profileData.staff.bankDetails,
            accountNumber: profileData.staff.bankDetails?.accountNumber || '123456789012',
            ifscCode: profileData.staff.bankDetails?.ifscCode || 'BANK0001234',
            bankName: profileData.staff.bankDetails?.bankName || 'Bank of India',
            branch: profileData.staff.bankDetails?.branch || 'Main Branch'
          },
          status: profileData.staff.status || 'active'
        };
        setStaffData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(staffData);
  };

  const handleSave = async () => {
    try {
      console.log('Saving staff data:', editedData);
      
      // Update local state immediately
      setStaffData(editedData);
      
      // Try to save to backend
      const response = await fetch('https://sih-4ptm.onrender.com/api/v1/staff/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedData)
      });
      
      if (response.ok) {
        console.log('Profile saved to backend successfully');
        alert('Profile updated successfully!');
      } else {
        console.log('Backend save failed, but local changes saved');
        alert('Profile updated locally (backend connection failed)');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Profile updated locally (backend connection failed)');
    }
    
    setIsEditing(false);
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setEditedData(prev => ({
        ...prev,
        [nested]: { ...prev[nested], [field]: value }
      }));
    } else {
      setEditedData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = (fieldName, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setStaffData(prev => ({
          ...prev,
          profilePic: imageUrl
        }));
        console.log('Profile picture uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

//   const generateStaffIDCard = async () => {
//     try {
//       // Create ID card HTML element
//       const cardElement = document.createElement('div');
//       cardElement.style.position = 'fixed';
//       cardElement.style.left = '-9999px';
//       cardElement.style.top = '0';
//       cardElement.style.width = '550px';
//       cardElement.style.height = '350px';
//       cardElement.style.backgroundColor = 'white';
//       cardElement.style.fontFamily = 'Arial, sans-serif';
      
//       cardElement.innerHTML = `
//         <div style="
//           width: 550px;
//           height: 350px;
//           background: white;
//           border: 3px solid #1e40af;
//           border-radius: 20px;
//           overflow: hidden;
//           position: relative;
//           box-shadow: 0 8px 32px rgba(30, 64, 175, 0.2);
//         ">
//           <!-- Header Section -->
//           <div style="
//             background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
//             color: white;
//             padding: 20px;
//             text-align: center;
//           ">
//             <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
//               <div style="
//                 width: 50px;
//                 height: 50px;
//                 background: white;
//                 border-radius: 8px;
//                 padding: 5px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 color: #1e40af;
//                 font-weight: bold;
//                 font-size: 10px;
//               ">LOGO</div>
//               <div style="text-align: center;">
//                 <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">EMPLOYEE ID CARD</h1>
//                 <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.95; font-weight: 500;">Department of Technical Education</p>
//                 <p style="margin: 2px 0 0 0; font-size: 13px; opacity: 0.9;">Government of Rajasthan</p>
//               </div>
//               <div style="
//                 width: 50px;
//                 height: 50px;
//                 background: rgba(255,255,255,0.2);
//                 border: 2px solid rgba(255,255,255,0.3);
//                 border-radius: 8px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 font-size: 10px;
//                 font-weight: bold;
//                 text-align: center;
//               ">QR<br/>CODE</div>
//             </div>
//           </div>

//           <!-- Main Content Section -->
//           <div style="padding: 25px; background: white;">
//             <div style="display: flex; gap: 20px; align-items: flex-start;">
//               <!-- Profile Photo -->
//               <div style="flex-shrink: 0;">
//                 <div style="
//                   width: 120px;
//                   height: 140px;
//                   border: 3px solid #3b82f6;
//                   border-radius: 12px;
//                   overflow: hidden;
//                   background: linear-gradient(135deg, #3b82f6, #1e40af);
//                   display: flex;
//                   align-items: center;
//                   justify-content: center;
//                   color: white;
//                   font-size: 14px;
//                   font-weight: bold;
//                   text-align: center;
//                 ">
//                   ${staffData.profilePic ? 
//                     `<img src="${staffData.profilePic}" alt="Staff Photo" style="width: 100%; height: 100%; object-fit: cover;" />` :
//                     `EMPLOYEE<br/>PHOTO`
//                   }
//                 </div>
//               </div>

//               <!-- Employee Details -->
//               <div style="flex: 1; color: #1e40af;">
//                 <div style="margin-bottom: 15px;">
//                   <h2 style="
//                     margin: 0 0 8px 0;
//                     font-size: 24px;
//                     font-weight: bold;
//                     color: #1e40af;
//                     text-transform: uppercase;
//                     letter-spacing: 0.5px;
//                   ">${staffData.name || 'Employee Name'}</h2>
//                   <div style="height: 3px; width: 80px; background: linear-gradient(90deg, #3b82f6, #10b981); border-radius: 2px;"></div>
//                 </div>

//                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px; line-height: 1.6;">
//                   <div>
//                     <strong style="color: #1e40af;">Employee ID:</strong><br/>
//                     <span style="color: #374151; font-weight: 600;">${staffData.staffId || 'EMP-XX-XXXX'}</span>
//                   </div>
//                   <div>
//                     <strong style="color: #1e40af;">Employee Code:</strong><br/>
//                     <span style="color: #374151; font-weight: 600;">${staffData.employeeCode || 'FAC001'}</span>
//                   </div>
//                   <div>
//                     <strong style="color: #1e40af;">Designation:</strong><br/>
//                     <span style="color: #374151; font-weight: 600;">${staffData.designation || 'Assistant Professor'}</span>
//                   </div>
//                   <div>
//                     <strong style="color: #1e40af;">Department:</strong><br/>
//                     <span style="color: #374151; font-weight: 600;">${staffData.department || 'Computer Science'}</span>
//                   </div>
//                   <div>
//                     <strong style="color: #1e40af;">Experience:</strong><br/>
//                     <span style="color: #374151; font-weight: 600;">${staffData.employmentDetails?.experience || 0} Years</span>
//                   </div>
//                   <div>
//                     <strong style="color: #1e40af;">Employment Type:</strong><br/>
//                     <span style="color: #374151; font-weight: 600; text-transform: capitalize;">${staffData.employmentDetails?.employmentType || 'Permanent'}</span>
//                   </div>
//                 </div>

//                 <div style="margin-top: 15px; font-size: 13px;">
//                   <div style="margin-bottom: 5px;">
//                     <strong style="color: #1e40af;">Email:</strong> 
//                     <span style="color: #374151;">${staffData.email || 'staff@university.edu'}</span>
//                   </div>
//                   <div>
//                     <strong style="color: #1e40af;">Mobile:</strong> 
//                     <span style="color: #374151;">${staffData.phone || '+91 9876543210'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!-- Footer Section -->
//           <div style="
//             position: absolute;
//             bottom: 0;
//             left: 0;
//             right: 0;
//             background: linear-gradient(90deg, #1e40af, #3b82f6);
//             color: white;
//             padding: 12px 25px;
//             font-size: 12px;
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//           ">
//             <div>
//               <strong>Valid Till:</strong> Academic Year 2024-25
//             </div>
//             <div style="text-align: center;">
//               <div style="font-size: 10px; opacity: 0.9;">Joined</div>
//               <div style="font-weight: bold;">${staffData.employmentDetails?.joiningDate ? new Date(staffData.employmentDetails.joiningDate).toLocaleDateString('en-IN') : 'N/A'}</div>
//             </div>
//             <div style="text-align: right;">
//               <div style="font-size: 10px; opacity: 0.9;">Date of Issue</div>
//               <div style="font-weight: bold;">${new Date().toLocaleDateString('en-IN')}</div>
//             </div>
//           </div>
//         </div>
//       `;
      
//       // Add to document temporarily
//       document.body.appendChild(cardElement);
      
//       // Wait a moment for rendering
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Use browser's built-in canvas API to capture the element
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       // Set canvas size (2x for better quality)
//       canvas.width = 550 * 2;
//       canvas.height = 350 * 2;
//       ctx.scale(2, 2);
      
//       // Create a simple canvas-based ID card (fallback approach)
//       ctx.fillStyle = 'white';
//       ctx.fillRect(0, 0, 550, 350);
      
//       // Header
//       const gradient = ctx.createLinearGradient(0, 0, 550, 100);
//       gradient.addColorStop(0, '#1e40af');
//       gradient.addColorStop(1, '#3b82f6');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, 550, 100);
      
//       // Header text
//       ctx.fillStyle = 'white';
//       ctx.font = 'bold 22px Arial';
//       ctx.textAlign = 'center';
//       ctx.fillText('EMPLOYEE ID CARD', 275, 35);
//       ctx.font = '14px Arial';
//       ctx.fillText('Department of Technical Education', 275, 55);
//       ctx.fillText('Government of Rajasthan', 275, 75);
      
//       // Employee details
//       ctx.fillStyle = '#1e40af';
//       ctx.font = 'bold 24px Arial';
//       ctx.textAlign = 'left';
//       ctx.fillText(staffData.name || 'Employee Name', 150, 140);
      
//       ctx.font = '14px Arial';
//       ctx.fillText(`Employee ID: ${staffData.staffId || 'EMP-XX-XXXX'}`, 150, 170);
//       ctx.fillText(`Employee Code: ${staffData.employeeCode || 'FAC001'}`, 150, 190);
//       ctx.fillText(`Designation: ${staffData.designation || 'Assistant Professor'}`, 150, 210);
//       ctx.fillText(`Department: ${staffData.department || 'Computer Science'}`, 150, 230);
//       ctx.fillText(`Email: ${staffData.email || 'staff@university.edu'}`, 150, 250);
//       ctx.fillText(`Mobile: ${staffData.phone || '+91 9876543210'}`, 150, 270);
      
//       // Footer
//       const footerGradient = ctx.createLinearGradient(0, 300, 550, 350);
//       footerGradient.addColorStop(0, '#1e40af');
//       footerGradient.addColorStop(1, '#3b82f6');
//       ctx.fillStyle = footerGradient;
//       ctx.fillRect(0, 300, 550, 50);
      
//       ctx.fillStyle = 'white';
//       ctx.font = '12px Arial';
//       ctx.textAlign = 'left';
//       ctx.fillText('Valid Till: Academic Year 2024-25', 25, 325);
//       ctx.textAlign = 'right';
//       ctx.fillText(`Date of Issue: ${new Date().toLocaleDateString('en-IN')}`, 525, 325);
      
//       // Download
//       canvas.toBlob(function(blob) {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `Employee_ID_Card_${staffData.staffId || staffData.name || 'Employee'}.png`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
        
//         console.log('Employee ID Card downloaded as PNG');
//         alert('Employee ID Card downloaded successfully as PNG!');
//       }, 'image/png');
      
//       // Remove temporary element
//       document.body.removeChild(cardElement);
      
//     } catch (error) {
//       console.error('Error generating ID card:', error);
//       alert('Error generating ID card. Please try again.');
//     }
//   };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: User },
    { id: 'academic', label: 'Professional', icon: Briefcase },
    { id: 'notifications', label: 'Notifications', icon: AlertCircle },
    { id: 'id-card', label: 'ID Card', icon: Download }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1e40af]">Personal Information</h3>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-xl hover:bg-[#1d4ed8] transition-colors"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#10b981] text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative">
              <img
                src={staffData.profilePic || '/api/placeholder/150/150'}
                alt="Profile"
                className="w-32 h-32 rounded-xl object-cover border-4 border-[#3b82f6]"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#1e40af] text-white p-2 rounded-xl cursor-pointer hover:bg-[#1d4ed8]">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('profilePicture', e.target.files[0])}
                  />
                </label>
              )}
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium text-sm">Active Employee</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{staffData.employmentDetails?.employmentType}</p>
            </div>
          </div>

          {/* Basic Info Fields */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', editable: false }, // Only admin can edit
              { key: 'staffId', label: 'Staff ID', editable: false, className: 'text-blue-600 font-medium' },
              { key: 'employeeCode', label: 'Employee Code', editable: false, className: 'text-purple-600 font-medium' },
              { key: 'email', label: 'Email ID', editable: false, type: 'email' }, // Only admin can edit
              { key: 'phone', label: 'Phone Number', editable: true, type: 'tel' },
              { key: 'personalDetails.dob', label: 'Date of Birth', editable: false, type: 'date', nested: 'personalDetails' }, // Only admin can edit
              { key: 'personalDetails.gender', label: 'Gender', editable: false, nested: 'personalDetails', className: 'capitalize' },
              { key: 'personalDetails.nationality', label: 'Nationality', editable: false, nested: 'personalDetails' }
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-[#1e40af] mb-2">{field.label}</label>
                {isEditing && field.editable ? (
                  <input
                    type={field.type || 'text'}
                    value={field.nested ? 
                      (editedData[field.nested]?.[field.key.split('.')[1]] || staffData[field.nested]?.[field.key.split('.')[1]]) :
                      (editedData[field.key] || staffData[field.key])
                    }
                    onChange={(e) => field.nested ? 
                      handleInputChange(field.key.split('.')[1], e.target.value, field.nested) :
                      handleInputChange(field.key, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl bg-[#f8fafc] focus:border-[#3b82f6] focus:outline-none"
                  />
                ) : (
                  <p className={`p-3 bg-gray-50 rounded-xl ${field.className || ''}`}>
                    {field.nested ? 
                      (field.type === 'date' ? 
                        new Date(staffData[field.nested]?.[field.key.split('.')[1]]).toLocaleDateString() :
                        staffData[field.nested]?.[field.key.split('.')[1]]
                      ) :
                      staffData[field.key]
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Employment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'designation', label: 'Designation' },
            { key: 'department', label: 'Department' },
            { key: 'role', label: 'Role', transform: getRoleDisplayName },
            { key: 'employmentDetails.joiningDate', label: 'Joining Date', transform: (val) => new Date(val).toLocaleDateString() },
            { key: 'employmentDetails.employmentType', label: 'Employment Type', className: 'capitalize' },
            { key: 'employmentDetails.experience', label: 'Experience (Years)', className: 'font-bold text-green-600' },
            { key: 'employmentDetails.salary', label: 'Salary', className: 'font-bold text-blue-600', transform: (val) => `₹${val?.toLocaleString()}` },
            { key: 'status', label: 'Status', className: 'capitalize font-medium text-green-600' }
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[#1e40af] mb-2">{field.label}</label>
              <p className={`p-3 bg-gray-50 rounded-xl ${field.className || ''}`}>
                {(() => {
                  let value;
                  if (field.key.includes('.')) {
                    const [obj, prop] = field.key.split('.');
                    value = staffData[obj]?.[prop];
                  } else {
                    value = staffData[field.key];
                  }
                  return field.transform ? field.transform(value) : value;
                })()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'street', label: 'Street Address', editable: true },
            { key: 'city', label: 'City', editable: true },
            { key: 'state', label: 'State', editable: false },
            { key: 'zipCode', label: 'PIN Code', editable: false }
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[#1e40af] mb-2">{field.label}</label>
              {isEditing && field.editable ? (
                <input
                  type="text"
                  value={editedData.address?.[field.key] || staffData.address?.[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value, 'address')}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-[#f8fafc] focus:border-[#3b82f6] focus:outline-none"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-xl">{staffData.address?.[field.key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1e40af] mb-2">Contact Name</label>
            <p className="p-3 bg-gray-50 rounded-xl">{staffData.emergencyContact?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1e40af] mb-2">Phone Number</label>
            <p className="p-3 bg-gray-50 rounded-xl">{staffData.emergencyContact?.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1e40af] mb-2">Relation</label>
            <p className="p-3 bg-gray-50 rounded-xl">{staffData.emergencyContact?.relation}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessional = () => (
    <div className="space-y-6">
      {/* Academic/Teaching Details */}
      {staffData.academicDetails && (
        <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Academic & Teaching Details</h3>
          
          {/* Subjects Taught */}
          {staffData.subjects && staffData.subjects.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-[#1e40af] mb-4">Subjects Teaching</h4>
              <div className="grid gap-3">
                {staffData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-[#3b82f6]" size={18} />
                      <div>
                        <p className="font-semibold">{subject.name}</p>
                        <p className="text-sm text-gray-600">Code: {subject.code}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research & Publications */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <GraduationCap className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="text-lg font-bold text-blue-600">{staffData.academicDetails?.publications || 0}</p>
              <p className="text-sm text-gray-600">Publications</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Users className="mx-auto mb-2 text-green-600" size={24} />
              <p className="text-lg font-bold text-green-600">{staffData.academicDetails?.conferences || 0}</p>
              <p className="text-sm text-gray-600">Conferences</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Award className="mx-auto mb-2 text-purple-600" size={24} />
              <p className="text-lg font-bold text-purple-600">{staffData.employmentDetails?.experience || 0}</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <Building className="mx-auto mb-2 text-orange-600" size={24} />
              <p className="text-lg font-bold text-orange-600">{staffData.department || 'N/A'}</p>
              <p className="text-sm text-gray-600">Department</p>
            </div>
          </div>

          {/* Research Area */}
          {staffData.academicDetails?.researchArea && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-[#1e40af] mb-3">Research Areas</h4>
              <p className="p-3 bg-gray-50 rounded-xl">{staffData.academicDetails.researchArea}</p>
            </div>
          )}

          {/* Qualifications */}
          {staffData.employmentDetails?.qualifications && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-[#1e40af] mb-3">Qualifications</h4>
              <p className="p-3 bg-gray-50 rounded-xl">{staffData.employmentDetails.qualifications}</p>
            </div>
          )}
        </div>
      )}

      {/* Leave Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Leave Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Clock className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-2xl font-bold text-blue-600">{staffData.leaves?.total || 0}</p>
            <p className="text-sm text-gray-600">Total Leave Days</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <Calendar className="mx-auto mb-2 text-red-600" size={24} />
            <p className="text-2xl font-bold text-red-600">{staffData.leaves?.taken || 0}</p>
            <p className="text-sm text-gray-600">Taken</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <CheckCircle className="mx-auto mb-2 text-green-600" size={24} />
            <p className="text-2xl font-bold text-green-600">{staffData.leaves?.remaining || 0}</p>
            <p className="text-sm text-gray-600">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Notifications & Announcements</h3>
      <div className="space-y-4">
        {[
          { type: 'info', title: 'Faculty Meeting Reminder', desc: 'Department meeting scheduled for tomorrow at 10:00 AM', time: '1 day ago' },
          { type: 'success', title: 'Salary Credited', desc: 'Your monthly salary has been successfully credited to your account', time: '3 days ago' },
          { type: 'warning', title: 'Leave Application Status', desc: 'Your leave application for next week is pending approval', time: '5 days ago' },
          { type: 'info', title: 'Research Paper Submission', desc: 'Deadline for conference paper submission: 15th February 2024', time: '1 week ago' }
        ].map((notif, index) => (
          <div key={index} className={`p-4 rounded-xl border-l-4 ${
            notif.type === 'info' ? 'bg-blue-50 border-blue-500' :
            notif.type === 'success' ? 'bg-green-50 border-green-500' :
            'bg-yellow-50 border-yellow-500'
          }`}>
            <h4 className={`font-semibold ${
              notif.type === 'info' ? 'text-blue-800' :
              notif.type === 'success' ? 'text-green-800' :
              'text-yellow-800'
            }`}>{notif.title}</h4>
            <p className={`text-sm mt-1 ${
              notif.type === 'info' ? 'text-blue-700' :
              notif.type === 'success' ? 'text-green-700' :
              'text-yellow-700'
            }`}>{notif.desc}</p>
            <p className={`text-xs mt-2 ${
              notif.type === 'info' ? 'text-blue-600' :
              notif.type === 'success' ? 'text-green-600' :
              'text-yellow-600'
            }`}>{notif.time}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIDCard = () => (
    <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Digital Employee ID Card</h3>
        
        {/* Enhanced ID Card Preview */}
        <div className="bg-white border-4 border-[#1e40af] rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <img
                src="https://svumshow.com/assets/images/department-logo/pngwing.png"
                alt="Department Logo"
                className="w-17 h-22 object-contain invert filter brightness-0 rounded-lg"
              />
              <div>
                <h4 className="text-xl font-bold tracking-wider">EMPLOYEE ID CARD</h4>
                <p className="text-sm opacity-95 font-medium">Department of Technical Education</p>
                <p className="text-xs opacity-90">Government of Rajasthan</p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-6 bg-white">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src={staffData.profilePic || '/api/placeholder/120/140'}
                  alt="Staff Photo"
                  className="w-28 h-32 rounded-xl object-cover border-3 border-[#3b82f6] shadow-lg"
                />
              </div>
              
              <div className="flex-1 text-[#1e40af]">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-[#1e40af] uppercase tracking-wide">
                    {staffData.name || 'Employee Name'}
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-[#3b82f6] to-[#10b981] rounded mt-2"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-[#1e40af]">Employee ID:</span>
                    <div className="font-bold text-gray-700">{staffData.staffId || 'EMP-XX-XXXX'}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1e40af]">Employee Code:</span>
                    <div className="font-bold text-gray-700">{staffData.employeeCode || 'FAC001'}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1e40af]">Designation:</span>
                    <div className="font-bold text-gray-700">{staffData.designation || 'Assistant Professor'}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1e40af]">Department:</span>
                    <div className="font-bold text-gray-700">{staffData.department || 'Computer Science'}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1e40af]">Experience:</span>
                    <div className="font-bold text-gray-700">{staffData.employmentDetails?.experience || 0} Years</div>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1e40af]">Type:</span>
                    <div className="font-bold text-gray-700 capitalize">{staffData.employmentDetails?.employmentType || 'Permanent'}</div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-600">
                  <div><strong>Email:</strong> {staffData.email || 'staff@university.edu'}</div>
                  <div><strong>Mobile:</strong> {staffData.phone || '+91 9876543210'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white px-6 py-3 flex justify-between items-center text-sm">
            <div>
              <strong>Valid Till:</strong> Academic Year 2024-25
            </div>
            <div className="text-center">
              <div className="text-xs opacity-90">Joined</div>
              <div className="font-bold">
                {staffData.employmentDetails?.joiningDate ? 
                  new Date(staffData.employmentDetails.joiningDate).toLocaleDateString('en-IN') : 
                  'N/A'
                }
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-90">Date of Issue</div>
              <div className="font-bold">{new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>
    
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info': return renderBasicInfo();
      case 'academic': return renderProfessional();
      case 'notifications': return renderNotifications();
      case 'id-card': return renderIDCard();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={staffData.profilePic || '/api/placeholder/80/80'}
                alt="Profile"
                className="w-20 h-20 rounded-xl object-cover border-4 border-[#3b82f6]"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#1e40af]">{staffData.name}</h1>
                <p className="text-gray-600">{staffData.designation}</p>
                <p className="text-sm text-blue-600 font-medium">{staffData.staffId}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium text-sm">Staff</span>
              </div>
              <p className="text-sm text-gray-600">Role: {getRoleDisplayName(staffData.role)}</p>
              <p className="text-sm text-gray-600">Dept: {staffData.department}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#1e40af] text-[#1e40af] bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StaffProfile;