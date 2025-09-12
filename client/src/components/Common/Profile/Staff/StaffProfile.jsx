import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase,
  Shield, Edit3, Save, Camera, AlertCircle, CheckCircle,
  Loader2, Building, GraduationCap, X, CreditCard, Clock
} from 'lucide-react';
import roleUtils from '../../../../utils/roleUtils';
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
            <p className={`p-3 bg-slate-100 rounded-lg text-slate-800 capitalize ${className}`}>
                {type === 'date' && value ? new Date(value).toLocaleDateString('en-GB') : value || 'N/A'}
            </p>
        )}
    </div>
);

const StaffProfile = () => {
  const [staffData, setStaffData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  console.log(staffData)

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch staff profile.");
        }
        
        const data = await response.json();
        
        if (data.user) {
          setStaffData(data.user);
          setEditedData(data.user);
        } else {
          throw new Error("No staff data found in the API response.");
        }
      } catch (error) {
        setStaffData(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(JSON.parse(JSON.stringify(staffData)));
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
        setStaffData(result.user);
        showToast('Profile updated successfully!');
      } else {
        setEditedData(staffData); 
        showToast(`Failed to update profile: ${result.message}`, 'error');
      }
    } catch (error) {
      setEditedData(staffData);
      showToast('An error occurred while saving.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    setEditedData(prev => {
      if (nested) {
        const nestedObject = prev[nested] || {};
        return { ...prev, [nested]: { ...nestedObject, [field]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  }

  if (error || !staffData) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
              <AlertCircle className="w-16 h-16 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-red-700">Failed to Load Profile</h2>
              <p className="mt-2 text-slate-600">{error || "Could not fetch staff data."}</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen">
      {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="">
        
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img src={staffData.profilePic || `https://ui-avatars.com/api/?name=${staffData.name}&background=random`} alt="Staff Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{staffData.name}</h1>
                <p className="text-slate-600">{roleUtils(staffData.role)}</p>
                <p className="text-sm text-blue-600 font-mono mt-1">{staffData.staffId}</p>
              </div>
            </div>
            {!isEditing ? (
              <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Edit3 size={16} /> Edit Profile</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save size={16} /> Save Changes</button>
              </div>
            )}
          </div>
        </div>
        
        {/* Content Cards */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Personal & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoField label="Phone" value={isEditing ? editedData.phone : staffData.phone} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange('phone', e.target.value)} />
                <InfoField label="Email" value={staffData.email} icon={Mail} isEditing={false} />
                <InfoField label="Date of Birth" value={staffData.dob} icon={Calendar} isEditing={false} type="date"/>
                <InfoField label="Gender" value={staffData.gender} icon={User} isEditing={false} />
                <InfoField label="Nationality" value={isEditing ? editedData.nationality : staffData.nationality} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange('nationality', e.target.value)} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoField label="Role" value={staffData.role} icon={Shield} isEditing={false} />
                  <InfoField label="Department" value={staffData.department} icon={Building} isEditing={false} />
                  <InfoField label="Employment Type" value={staffData.employmentType} icon={Briefcase} isEditing={false} />
                  <InfoField label="Experience" value={`${staffData.experience || 0} years`} icon={Clock} isEditing={false} />
                  <InfoField label="Salary" value={`₹${(staffData.salary || 0).toLocaleString('en-IN')}`} icon={CreditCard} isEditing={false} />
                  <InfoField label="Qualifications" value={isEditing ? editedData.qualifications : staffData.qualifications} icon={GraduationCap} isEditing={isEditing} onChange={(e) => handleInputChange('qualifications', e.target.value)} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                    <InfoField label="Street" value={isEditing ? editedData.address?.street : staffData.address?.street} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange('street', e.target.value, 'address')} />
                 </div>
                 <InfoField label="City" value={isEditing ? editedData.address?.city : staffData.address?.city} icon={Building} isEditing={isEditing} onChange={(e) => handleInputChange('city', e.target.value, 'address')} />
                 <InfoField label="State" value={isEditing ? editedData.address?.state : staffData.address?.state} icon={Building} isEditing={isEditing} onChange={(e) => handleInputChange('state', e.target.value, 'address')} />
                 <InfoField label="ZIP Code" value={isEditing ? editedData.address?.zipCode : staffData.address?.zipCode} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange('zipCode', e.target.value, 'address')} />
                 <InfoField label="Country" value={isEditing ? editedData.address?.country : staffData.address?.country} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange('country', e.target.value, 'address')} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;