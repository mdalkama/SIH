import React, { useState, useEffect } from 'react';
import { Edit, X, Loader2, AlertTriangle, CheckCircle, Info, Save } from 'lucide-react';

// --- MOCK API URL (Replace with your actual endpoint) ---
// I'm assuming a single university profile is fetched/updated.
const UNIVERSITY_API_URL = 'https://sih-4ptm.onrender.com/api/v1/university/main';

// --- Main Profile Page Component ---
const UniversityProfilePage = () => {
    const [universityData, setUniversityData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    useEffect(() => {
        const fetchUniversityData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(UNIVERSITY_API_URL, { credentials: 'include' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch university profile.');
                }
                const data = await response.json();
                setUniversityData(data);
            } catch (err) {
                addToast('error', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUniversityData();
    }, []);

    const handleSave = async (formData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${UNIVERSITY_API_URL}/${universityData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }
            const updatedData = await response.json();
            setUniversityData(updatedData);
            addToast('success', 'University profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !universityData) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    if (!universityData) {
        return <div className="text-center py-16 text-gray-500">Could not load university data.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">University Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Edit size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <ProfileEditForm
                        initialData={universityData}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                        isLoading={isLoading}
                    />
                ) : (
                    <ProfileView data={universityData} />
                )}
            </div>
        </div>
    );
};


// --- Display Component ---
const ProfileView = ({ data }) => {
    const InfoField = ({ label, value }) => (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-md font-medium text-gray-800">{value || '-'}</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-6">
                    <img src={data.logoUrl || 'https://placehold.co/100x100/E2E8F0/4A5568?text=Logo'} alt="University Logo" className="w-24 h-24 rounded-full object-cover border" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                        <p className="text-md text-gray-600 font-mono">{data.universityId}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField label="Chancellor" value={data.chancellorAndVC?.chancellorName} />
                    <InfoField label="Vice Chancellor" value={data.chancellorAndVC?.viceChancellorName} />
                    <InfoField label="Registrar" value={data.chancellorAndVC?.registrarName} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Contact & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField label="Email" value={data.contact?.email} />
                    <InfoField label="Phone" value={data.contact?.phone} />
                    <InfoField label="Website" value={data.contact?.website} />
                    <InfoField label="Address" value={`${data.location?.address}, ${data.location?.city}, ${data.location?.state} - ${data.location?.pincode}`} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Financial & Legal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField label="Bank Name" value={data.financials?.bankName} />
                    <InfoField label="Account Number" value={data.financials?.accountNumber} />
                    <InfoField label="IFSC Code" value={data.financials?.ifscCode} />
                    <InfoField label="PAN" value={data.financials?.panNumber} />
                    <InfoField label="GSTIN" value={data.financials?.gstin} />
                </div>
            </div>
        </div>
    );
};

// --- Form Component ---
const ProfileEditForm = ({ initialData, onSave, onCancel, isLoading }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const FormField = ({ label, name, value, onChange, section, placeholder, required = false }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
            <input
                type="text"
                name={name}
                value={value || ''}
                onChange={(e) => onChange(e, section)}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm animate-fade-in space-y-8">
            {/* Basic Info */}
            <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="University Name" name="name" value={formData.name} onChange={handleChange} required />
                    <FormField label="University ID" name="universityId" value={formData.universityId} onChange={handleChange} required />
                    <FormField label="Logo URL" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://..." />
                </div>
            </div>

            {/* Leadership */}
            <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Chancellor" name="chancellorName" value={formData.chancellorAndVC?.chancellorName} onChange={(e) => handleChange(e, 'chancellorAndVC')} />
                    <FormField label="Vice Chancellor" name="viceChancellorName" value={formData.chancellorAndVC?.viceChancellorName} onChange={(e) => handleChange(e, 'chancellorAndVC')} />
                    <FormField label="Registrar" name="registrarName" value={formData.chancellorAndVC?.registrarName} onChange={(e) => handleChange(e, 'chancellorAndVC')} />
                </div>
            </div>

            {/* Contact & Location */}
            <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField label="Email" name="email" value={formData.contact?.email} onChange={(e) => handleChange(e, 'contact')} required />
                    <FormField label="Phone" name="phone" value={formData.contact?.phone} onChange={(e) => handleChange(e, 'contact')} required />
                    <FormField label="Website" name="website" value={formData.contact?.website} onChange={(e) => handleChange(e, 'contact')} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Address" name="address" value={formData.location?.address} onChange={(e) => handleChange(e, 'location')} />
                    <FormField label="City" name="city" value={formData.location?.city} onChange={(e) => handleChange(e, 'location')} required />
                    <FormField label="State" name="state" value={formData.location?.state} onChange={(e) => handleChange(e, 'location')} required />
                    <FormField label="Pincode" name="pincode" value={formData.location?.pincode} onChange={(e) => handleChange(e, 'location')} />
                </div>
            </div>

            {/* Financials */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial & Legal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Bank Name" name="bankName" value={formData.financials?.bankName} onChange={(e) => handleChange(e, 'financials')} />
                    <FormField label="Account Number" name="accountNumber" value={formData.financials?.accountNumber} onChange={(e) => handleChange(e, 'financials')} />
                    <FormField label="IFSC Code" name="ifscCode" value={formData.financials?.ifscCode} onChange={(e) => handleChange(e, 'financials')} />
                    <FormField label="PAN" name="panNumber" value={formData.financials?.panNumber} onChange={(e) => handleChange(e, 'financials')} />
                    <FormField label="GSTIN" name="gstin" value={formData.financials?.gstin} onChange={(e) => handleChange(e, 'financials')} />
                </div>
            </div>


            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6 border-t pt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center">
                    {isLoading ? <><Loader2 size={16} className="animate-spin" />&nbsp;Saving...</> : <><Save size={16} />&nbsp;Save Changes</>}
                </button>
            </div>
        </form>
    );
};


// --- Helper Components ---
const Toast = ({ message, type, onClose }) => {
    const icons = { success: <CheckCircle className="text-green-500" />, error: <AlertTriangle className="text-red-500" />, info: <Info className="text-blue-500" /> };
    return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-3 w-80 animate-fade-in-right"> <div className="flex-shrink-0">{icons[type]}</div> <p className="flex-1 text-sm text-gray-700">{message}</p> <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button> </div>);
};

const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return (<div className="fixed top-5 right-5 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
};


export default UniversityProfilePage;
