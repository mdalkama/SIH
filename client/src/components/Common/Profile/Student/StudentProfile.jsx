import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, GraduationCap,
  Edit3, Save, Camera, Book, AlertCircle, Award, UserCheck, Clock
} from 'lucide-react';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [studentData, setStudentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch student profile.");
        }
        
        const data = await response.json();
        
        if (data.success && data.user) {
          setStudentData(data.user);
          setEditedData(data.user); // Initialize editable data
          console.log('Successfully fetched real student data:', data.user);
        } else {
          throw new Error("No student data found in the API response.");
        }

      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudentData(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleEdit = () => {
    setIsEditing(true);
    // Ensure editedData is a deep copy to avoid direct state mutation
    setEditedData(JSON.parse(JSON.stringify(studentData)));
  };

  const handleSave = async () => {
    setIsEditing(false);
    setLoading(true); // Show loading indicator while saving
    try {
      console.log('Saving student data:', editedData);
      
      const response = await fetch('https://sih-4ptm.onrender.com/api/v1/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editedData)
      });
      
      const result = await response.json();

      if (result.success) {
        // Update the main studentData with the successfully saved data
        setStudentData(result.user);
        alert('Profile updated successfully!');
      } else {
        // If save fails, revert local changes to what they were before editing
        setEditedData(studentData); 
        alert(`Failed to update profile: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Revert local changes on error
      setEditedData(studentData);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    setEditedData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: { ...prev[nested], [field]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  };
  
  const handleFileUpload = async (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      // Optimistically update the UI
      setStudentData(prev => ({ ...prev, profilePictureLink: imageUrl }));
      setEditedData(prev => ({ ...prev, profilePictureLink: imageUrl }));
      alert("Profile picture preview updated. Press 'Save' to make it permanent.");
    };
    reader.readAsDataURL(file);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !studentData) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen">
              <AlertCircle className="w-16 h-16 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-red-700">Failed to Load Profile</h2>
              <p className="mt-2 text-gray-600">{error || "Could not fetch student data. Please try again later."}</p>
          </div>
      );
  }

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'notifications', label: 'Notifications', icon: AlertCircle }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-blue-900">Personal Information</h3>
          {!isEditing ? (
            <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Edit3 size={16} /> Edit Profile</button>
          ) : (
            <div className="flex gap-2"><button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save size={16} /> Save</button><button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button></div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative">
              <img src={studentData.profilePictureLink || `https://ui-avatars.com/api/?name=${studentData.name}&background=random`} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" />
              {isEditing && (<label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"><Camera size={16} /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0])} /></label>)}
            </div>
            <div className="mt-4 text-center"><div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="font-medium text-sm">Active Student</span></div></div>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', editable: false },
              { key: 'registrationNumber', label: 'Registration No.', editable: false, className: 'text-blue-600 font-medium' },
              { key: 'phone', label: 'Phone Number', editable: true, type: 'tel' },
              { key: 'alternatePhone', label: 'Alternate Phone', editable: true, type: 'tel' },
              { key: 'personalDetails.dob', label: 'Date of Birth', editable: false, type: 'date', nested: 'personalDetails' },
              { key: 'address.street', label: 'Street Address', editable: true, nested: 'address' },
              { key: 'address.city', label: 'City', editable: true, nested: 'address' },
              { key: 'address.state', label: 'State', editable: false, nested: 'address' },
            ].map(field => {
              const value = field.nested ? studentData[field.nested]?.[field.key.split('.')[1]] : studentData[field.key];
              const editedValue = field.nested ? editedData[field.nested]?.[field.key.split('.')[1]] : editedData[field.key];
              return (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">{field.label}</label>
                  {isEditing && field.editable ? (
                    <input type={field.type || 'text'} value={editedValue || ''} onChange={(e) => field.nested ? handleInputChange(field.key.split('.')[1], e.target.value, field.nested) : handleInputChange(field.key, e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-slate-50 focus:border-blue-500 focus:outline-none" />
                  ) : (
                    <p className={`p-3 bg-gray-100 rounded-lg ${field.className || ''}`}>{field.type === 'date' && value ? new Date(value).toLocaleDateString() : value || 'N/A'}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Other sections like Academic, Parent, Address info can be added here following the same pattern */}
    </div>
  );

  const renderAcademic = () => (
    <div className="space-y-6">
      {/* Current Semester Subjects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-6">Current Semester Subjects</h3>
        <div className="grid gap-4">
          {(studentData.academicDetails?.currentSubjects || []).map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3"><Book className="text-blue-500" size={20} /><div><p className="font-semibold">{subject.name}</p><p className="text-sm text-gray-600">Code: {subject.code}</p></div></div>
              <div className="text-right"><p className="font-semibold text-blue-800">{subject.credits} Credits</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-6">Academic Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl"><Award className="mx-auto mb-2 text-blue-600" size={24} /><p className="text-2xl font-bold text-blue-600">{studentData.academicDetails?.currentCGPA || 'N/A'}</p><p className="text-sm text-gray-600">Current CGPA</p></div>
          <div className="text-center p-4 bg-green-50 rounded-xl"><UserCheck className="mx-auto mb-2 text-green-600" size={24} /><p className="text-2xl font-bold text-green-600">{studentData.academicDetails?.attendance || 'N/A'}</p><p className="text-sm text-gray-600">Attendance</p></div>
          <div className="text-center p-4 bg-purple-50 rounded-xl"><Clock className="mx-auto mb-2 text-purple-600" size={24} /><p className="text-2xl font-bold text-purple-600">{studentData.semester || 'N/A'}</p><p className="text-sm text-gray-600">Current Semester</p></div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-6">Notifications & Announcements</h3>
      <div className="text-center text-gray-500 py-10">
        <p>No new notifications at the moment.</p>
      </div>
    </div>
  );


  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info': return renderBasicInfo();
      case 'academic': return renderAcademic();
      case 'notifications': return renderNotifications();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={studentData.profilePictureLink || `https://ui-avatars.com/api/?name=${studentData.name}&background=random`} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">{studentData.name}</h1>
                <p className="text-gray-600">{studentData.academicDetails?.course || 'Course Not Assigned'}</p>
                <p className="text-sm text-blue-600 font-medium">{studentData.registrationNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full mb-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="font-medium text-sm">Student</span></div>
              <p className="text-sm text-gray-600">Semester: {studentData.semester}</p>
              <p className="text-sm text-gray-600">CGPA: {studentData.academicDetails?.currentCGPA}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-4 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StudentProfile;