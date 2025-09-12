import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, GraduationCap,
  Edit3, Save, Camera, Book, AlertCircle, Award, UserCheck, Clock,
  CheckCircle, X, Loader2, FileText, Building,
  Users
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const ToastNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => { onClose(); }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
    const textColor = isError ? 'text-red-800' : 'text-green-800';
    const Icon = isError ? AlertCircle : CheckCircle;
    return (
        <div className={`fixed top-5 right-5 z-[100] flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg ${bgColor} ${textColor}`} role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"><Icon className="w-5 h-5" /></div>
            <div className="ml-3 text-sm font-medium">{message}</div>
            <button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-white/20" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
    );
};

const InfoField = ({ label, value, icon: Icon, isEditing, onChange, type = 'text', className = '' }) => (
    <div>
        <label className="flex items-center text-sm font-semibold text-slate-600 mb-2">
            <Icon className="w-4 h-4 mr-2 text-slate-400" />
            {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition"
            />
        ) : (
            <p className={`p-3 bg-slate-100 rounded-lg text-slate-800 ${className}`}>
                {type === 'date' && value ? new Date(value).toLocaleDateString('en-GB') : value || 'N/A'}
            </p>
        )}
    </div>
);

// ==================================================================================
// MAIN COMPONENT: StudentProfile
// ==================================================================================
const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [studentData, setStudentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  console.log(studentData);

  const showToast = (message, type = 'success') => {
      setToast({ message, type });
  };

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
        
        if (data.user) {
            setStudentData(data.user);
            setEditedData(data.user); // Initialize editable data from the API response
        } else {
            throw new Error("No student data found in the API response.");
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudentData(null); // Set to null on error
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(JSON.parse(JSON.stringify(studentData)));
  };

  const handleSave = async () => {
    setIsEditing(false);
    setLoading(true);
    try {
      const response = await fetch('https://sih-4ptm.onrender.com/api/v1/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editedData)
      });
      
      const result = await response.json();
      if (result.success) {
        setStudentData(result.user);
        showToast('Profile updated successfully!');
      } else {
        setEditedData(studentData); 
        showToast(`Failed to update profile: ${result.message}`, 'error');
      }
    } catch (error) {
      setEditedData(studentData);
      showToast('An error occurred while saving.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    setEditedData(prev => {
      if (nested) {
        return { ...prev, [nested]: { ...prev[nested], [field]: value } };
      }
      return { ...prev, [field]: value };
    });
  };
  
  const handleFileUpload = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setStudentData(prev => ({ ...prev, profilePictureLink: imageUrl }));
      setEditedData(prev => ({ ...prev, profilePictureLink: imageUrl }));
      showToast("Profile picture preview updated. Press 'Save' to make it permanent.", 'success');
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !studentData) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
              <AlertCircle className="w-16 h-16 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-red-700">Failed to Load Profile</h2>
              <p className="mt-2 text-slate-600">{error || "Could not fetch student data."}</p>
          </div>
      );
  }

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
          {!isEditing ? (
            <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Edit3 size={16} /> Edit Profile</button>
          ) : (
            <div className="flex gap-2"><button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save size={16} /> Save Changes</button><button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600">Cancel</button></div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoField label="Full Name" value={studentData.name} icon={User} isEditing={false} />
            <InfoField label="Registration No." value={studentData.registrationNumber} icon={FileText} isEditing={false} className="font-mono text-blue-600"/>
            <InfoField label="Roll Number" value={studentData.rollNumber} icon={FileText} isEditing={false} />
            <InfoField label="Email" value={studentData.email} icon={Mail} isEditing={false} />
            <InfoField label="Phone" value={isEditing ? editedData.phone : studentData.phone} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange('phone', e.target.value)} />
            <InfoField label="Alternate Phone" value={isEditing ? editedData.alternatePhone : studentData.alternatePhone} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange('alternatePhone', e.target.value)} />
            <InfoField label="Date of Birth" value={studentData?.dob} icon={Calendar} isEditing={false} type="date" />
            <InfoField label="Gender" value={studentData?.gender} icon={Users} isEditing={false} className="capitalize" />
            <InfoField label="Blood Group" value={studentData?.bloodGroup} icon={AlertCircle} isEditing={false} />
        </div>
      </div>
      
      {/* Parent/Guardian & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Family Information</h3>
            <div className="space-y-4">
                <InfoField label="Father's Name" value={isEditing ? editedData?.fatherName : studentData?.fatherName} icon={User} isEditing={isEditing} onChange={(e) => handleInputChange('fatherName', e.target.value, 'personalDetails')} />
                <InfoField label="Mother's Name" value={isEditing ? editedData?.motherName : studentData?.motherName} icon={User} isEditing={isEditing} onChange={(e) => handleInputChange('motherName', e.target.value, 'personalDetails')} />
                <InfoField label="Parent's Contact" value={isEditing ? editedData?.parentsNumber : studentData?.parentsNumber} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange('parentsNumber', e.target.value, 'personalDetails')} />
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Address Information</h3>
            <div className="space-y-4">
                <InfoField label="Street Address" value={isEditing ? editedData?.address : studentData?.address} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange('street', e.target.value, 'address')} />
            </div>
        </div>
      </div>
    </div>
  );

  const renderAcademic = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Academic Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl"><Award className="mx-auto mb-2 text-blue-600" size={28} /><p className="text-3xl font-bold text-blue-800">{studentData.academicDetails?.currentCGPA || 'N/A'}</p><p className="text-sm text-slate-600">Current CGPA</p></div>
          <div className="text-center p-4 bg-green-50 rounded-xl"><UserCheck className="mx-auto mb-2 text-green-600" size={28} /><p className="text-3xl font-bold text-green-800">{studentData.academicDetails?.attendance || 'N/A'}</p><p className="text-sm text-slate-600">Attendance</p></div>
          <div className="text-center p-4 bg-purple-50 rounded-xl"><Clock className="mx-auto mb-2 text-purple-600" size={28} /><p className="text-3xl font-bold text-purple-800">{studentData.semester || 'N/A'}</p><p className="text-sm text-slate-600">Current Semester</p></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Current Semester Subjects</h3>
        <div className="space-y-3">
          {(studentData.academicDetails?.currentSubjects || []).length > 0 ? (
              studentData.academicDetails.currentSubjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4"><Book className="text-blue-500" size={20} /><div><p className="font-semibold text-slate-800">{subject.name}</p><p className="text-sm text-slate-500">Code: {subject.code}</p></div></div>
                    <div className="text-right"><p className="font-semibold text-blue-800">{subject.credits} Credits</p></div>
                </div>
              ))
          ) : (
            <p className="text-center text-slate-500 py-4">No subjects found for the current semester.</p>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info': return renderBasicInfo();
      case 'academic': return renderAcademic();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img src={studentData.profilePictureLink || `https://ui-avatars.com/api/?name=${studentData.name}&background=random`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
                {isEditing && (<label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"><Camera size={16} /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0])} /></label>)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{studentData.name}</h1>
                <p className="text-slate-600">{studentData?.course || 'N/A'}</p>
                <p className="text-sm text-blue-600 font-mono mt-1">{studentData.registrationNumber}</p>
              </div>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full mb-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="font-medium text-sm">Active Student</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                  <Icon size={18} /> {tab.label}
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