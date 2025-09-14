import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Mail, Globe, Edit3, Save, Loader2, AlertCircle, X, CheckCircle, User, Link, Calendar, Users } from 'lucide-react';

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

const InfoField = ({ label, value, icon: Icon, isEditing, onChange, name, type = 'text' }) => (
    <div>
        <label className="flex items-center text-sm font-medium text-slate-500 mb-1">
            <Icon className="w-4 h-4 mr-2 text-slate-400" />
            {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={type === 'date' && value ? value.split('T')[0] : (value || '')}
                onChange={onChange}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition"
            />
        ) : (
            <p className="p-2.5 bg-slate-100 rounded-lg text-slate-800">
                {type === 'date' && value ? new Date(value).toLocaleDateString('en-GB') : (value || 'N/A')}
            </p>
        )}
    </div>
);

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-24 bg-slate-200 rounded-xl"></div>
        <div className="space-y-6">
            <div className="h-64 bg-slate-200 rounded-xl"></div>
            <div className="h-48 bg-slate-200 rounded-xl"></div>
            <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const CollegeAdminManageCollege = () => {
    const [collegeData, setCollegeData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ id: Date.now(), message, type });
    };

    useEffect(() => {
        const fetchCollegeDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch('https://sih-4ptm.onrender.com/api/v1/manage-college/my-details', {
                    credentials: 'include'
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || 'Failed to fetch college details.');
                }
                const data = await res.json();
                
                if (data && data._id) {
                    setCollegeData(data);
                    setEditedData(JSON.parse(JSON.stringify(data)));
                } else {
                    throw new Error("Invalid college data received from the API.");
                }
            } catch (err) {
                setError(err.message);
                showToast(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchCollegeDetails();
    }, []);

    const handleInputChange = (e, nestedKey = null) => {
        const { name, value } = e.target;
        setEditedData(prev => {
            if (nestedKey) {
                return { ...prev, [nestedKey]: { ...prev[nestedKey], [name]: value } };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSaveChanges = async () => {
        setIsEditing(false);
        setLoading(true);
        try {
            const payload = {
                name: editedData.name,
                establishmentDate: editedData.establishmentDate,
                location: editedData.location,
                contact: editedData.contact,
                capacity: editedData.capacity // Include capacity if it becomes editable
            };

            const res = await fetch('https://sih-4ptm.onrender.com/api/v1/manage-college/update/my-details', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to update details.');
            
            setCollegeData(result.college);
            showToast('College details updated successfully!');
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
            setEditedData(collegeData);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-red-50 rounded-xl">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-medium text-red-800">Failed to Load College Data</h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
        );
    }
    
    if (!collegeData) {
        return null;
    }

    return (
        <div className="space-y-8">
            {toast && <ToastNotification {...toast} onClose={() => setToast(null)} />}
            
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Manage College Profile</h1>
                    <p className="mt-1 text-sm text-slate-600">View and update your college's official details.</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Edit3 size={16} /> Edit Details</button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => { setIsEditing(false); setEditedData(collegeData); }} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                        <button onClick={handleSaveChanges} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save size={16} /> Save Changes</button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">College Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* The grid now spans the full width */}
                        <div className="md:col-span-2">
                            <InfoField label="College Name" name="name" value={isEditing ? editedData.name : collegeData.name} icon={Building} isEditing={isEditing} onChange={handleInputChange} />
                        </div>
                        <InfoField label="College Code" name="code" value={collegeData.code} icon={Link} isEditing={false} />
                        <InfoField label="Affiliation ID" name="affiliationId" value={collegeData.affiliationId} icon={Link} isEditing={false} />
                        <InfoField label="Establishment Date" name="establishmentDate" value={collegeData.establishmentDate} icon={Calendar} isEditing={false} onChange={handleInputChange} type="date" />
                        <InfoField label="Total Student Capacity" name="capacity" value={isEditing ? editedData.capacity : collegeData.capacity} icon={Users} isEditing={isEditing} onChange={handleInputChange} type="number"/>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoField label="Contact Number" name="phone" value={isEditing ? editedData.contact?.phone : collegeData.contact?.phone} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'contact')} />
                        <InfoField label="Email Address" name="email" value={isEditing ? editedData.contact?.email : collegeData.contact?.email} icon={Mail} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'contact')} type="email"/>
                        <div className="md:col-span-2">
                           <InfoField label="Website" name="website" value={isEditing ? editedData.contact?.website : collegeData.contact?.website} icon={Globe} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'contact')} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Location & Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="md:col-span-2">
                            <InfoField label="Street / Area" name="address" value={isEditing ? editedData.location?.address : collegeData.location?.address} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'location')} />
                         </div>
                         <InfoField label="City" name="city" value={isEditing ? editedData.location?.city : collegeData.location?.city} icon={Building} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'location')} />
                         <InfoField label="State" name="state" value={isEditing ? editedData.location?.state : collegeData.location?.state} icon={Building} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'location')} />
                         <InfoField label="ZIP Code" name="pincode" value={isEditing ? editedData.location?.pincode : collegeData.location?.pincode} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'location')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeAdminManageCollege;