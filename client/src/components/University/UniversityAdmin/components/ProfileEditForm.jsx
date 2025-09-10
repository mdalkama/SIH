import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

// --- FormField Component ---
const FormField = ({ label, name, value, onChange, placeholder, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500">*</span>}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

const ProfileEditForm = ({ initialData, onCancel, setUniversityData, addToast, setIsEditing }) => {
    // --- Split useState for each section ---
    const [basicInfo, setBasicInfo] = useState({
        name: initialData.name || '',
        universityId: initialData.universityId || '',
        logoUrl: initialData.logoUrl || '',
    });

    const [leadership, setLeadership] = useState({
        chancellorName: initialData.chancellorAndVC?.chancellorName || '',
        viceChancellorName: initialData.chancellorAndVC?.viceChancellorName || '',
        registrarName: initialData.chancellorAndVC?.registrarName || '',
    });

    const [contact, setContact] = useState({
        email: initialData.contact?.email || '',
        phone: initialData.contact?.phone || '',
        website: initialData.contact?.website || '',
    });

    const [location, setLocation] = useState({
        address: initialData.location?.address || '',
        city: initialData.location?.city || '',
        state: initialData.location?.state || '',
        pincode: initialData.location?.pincode || '',
    });

    const [financials, setFinancials] = useState({
        bankName: initialData.financials?.bankName || '',
        accountNumber: initialData.financials?.accountNumber || '',
        ifscCode: initialData.financials?.ifscCode || '',
        panNumber: initialData.financials?.panNumber || '',
        gstin: initialData.financials?.gstin || '',
    });

    const [isLoading, setIsLoading] = useState(false);

    // --- Save handler ---
    const handleSave = async () => {
        setIsLoading(true);
        const formData = {
            ...basicInfo,
            chancellorAndVC: leadership,
            contact,
            location,
            financials
        };

        try {
            const response = await fetch("https://sih-4ptm.onrender.com/api/v1/university/main", {
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
            setUniversityData(updatedData.university);
            addToast('success', 'University profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm animate-fade-in space-y-8">

            {/* Basic Info */}
            <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="University Name" name="name" value={basicInfo.name} onChange={(e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
                    <FormField label="University ID" name="universityId" value={basicInfo.universityId} onChange={(e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
                    <FormField label="Logo URL" name="logoUrl" value={basicInfo.logoUrl} onChange={(e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))} placeholder="https://..." />
                </div>
            </div>

            {/* Leadership */}
            <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Chancellor" name="chancellorName" value={leadership.chancellorName} onChange={(e) => setLeadership(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                    <FormField label="Vice Chancellor" name="viceChancellorName" value={leadership.viceChancellorName} onChange={(e) => setLeadership(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                    <FormField label="Registrar" name="registrarName" value={leadership.registrarName} onChange={(e) => setLeadership(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                </div>
            </div>

            {/* Contact */}
            <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Email" name="email" value={contact.email} onChange={(e) => setContact(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
                    <FormField label="Phone" name="phone" value={contact.phone} onChange={(e) => setContact(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
                    <FormField label="Website" name="website" value={contact.website} onChange={(e) => setContact(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                </div>
            </div>

            {/* Location */}
            <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Address" name="address" value={location.address} onChange={(e) => setLocation(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                    <FormField label="City" name="city" value={location.city} onChange={(e) => setLocation(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
                    <FormField label="State" name="state" value={location.state} onChange={(e) => setLocation(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
                    <FormField label="Pincode" name="pincode" value={location.pincode} onChange={(e) => setLocation(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                </div>
            </div>

            {/* Financials */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial & Legal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Bank Name" name="bankName" value={financials.bankName} onChange={(e) => setFinancials(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                    <FormField label="Account Number" name="accountNumber" value={financials.accountNumber} onChange={(e) => setFinancials(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                    <FormField label="IFSC Code" name="ifscCode" value={financials.ifscCode} onChange={(e) => setFinancials(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                    <FormField label="PAN" name="panNumber" value={financials.panNumber} onChange={(e) => setFinancials(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
                    <FormField label="GSTIN" name="gstin" value={financials.gstin} onChange={(e) => setFinancials(prev => ({ ...prev, [e.target.name]: e.target.value }))} />
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

export default ProfileEditForm;
