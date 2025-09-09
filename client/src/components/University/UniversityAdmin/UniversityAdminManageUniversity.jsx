import React, { useState } from 'react';
import { Edit, Save, X, Plus, Trash2, University, User, Phone, Globe, MapPin, Banknote, Award } from 'lucide-react';

// --- Mock Data Based on the University Schema ---
const mockUniversityData = {
    _id: "68c0f3a1e8b7d123456789ab",
    name: "Aryabhatta Knowledge University, Patna",
    universityId: "AKU-PATNA",
    logoUrl: "https://placehold.co/100x100/e2e8f0/475569?text=AKU",
    establishmentDate: "2010-05-26",
    chancellorAndVC: {
        chancellorName: "Hon'ble Governor of Bihar",
        viceChancellorName: "Dr. Ramesh Singh",
        registrarName: "Mr. Alok Verma",
    },
    contact: {
        email: "contact@aku.ac.in",
        phone: "+91 612 2351919",
        website: "https://www.akubihar.ac.in/",
    },
    location: {
        address: "Mithapur Farm Area",
        city: "Patna",
        state: "Bihar",
        country: "India",
        pincode: "800001",
    },
    financials: {
        bankName: "State Bank of India",
        accountNumber: "12345678901",
        ifscCode: "SBIN0001234",
        panNumber: "ABCDE1234F",
        gstin: "05ABCDE1234F1Z5",
    },
    accreditations: [
        { _id: "accr1", body: "NAAC", grade: "A+", validFrom: "2022-08-01", validTill: "2027-07-31" },
        { _id: "accr2", body: "UGC", grade: "Recognized", validFrom: "2010-05-26", validTill: null },
    ],
    // These would be populated from their respective collections in a real app
    affiliatedColleges: [/* Array of ObjectIds */],
    coursesOffered: [/* Array of ObjectIds */],
    admissionSessions: [/* Array of ObjectIds */],
    settings: {
        defaultCurrency: 'INR',
        timezone: 'Asia/Kolkata',
    }
};

// --- Main Component ---
const UniversityProfileManager = () => {
    const [universityData, setUniversityData] = useState(mockUniversityData);
    const [editData, setEditData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = () => {
        // Create a deep copy for editing to avoid modifying the original state directly
        setEditData(JSON.parse(JSON.stringify(universityData)));
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditData(null);
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUniversityData(editData);
        setIsLoading(false);
        setIsEditing(false);
        setEditData(null);
    };

    const handleInputChange = (section, field, value) => {
        setEditData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleAccreditationChange = (index, field, value) => {
        const updatedAccreditations = [...editData.accreditations];
        updatedAccreditations[index][field] = value;
        setEditData(prev => ({ ...prev, accreditations: updatedAccreditations }));
    };

    const addAccreditation = () => {
        const newAccreditation = { _id: `new_${Date.now()}`, body: '', grade: '', validFrom: '', validTill: '' };
        setEditData(prev => ({ ...prev, accreditations: [...prev.accreditations, newAccreditation] }));
    };

    const removeAccreditation = (index) => {
        const updatedAccreditations = editData.accreditations.filter((_, i) => i !== index);
        setEditData(prev => ({ ...prev, accreditations: updatedAccreditations }));
    };

    const dataToShow = isEditing ? editData : universityData;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <img src={dataToShow.logoUrl} alt="University Logo" className="w-16 h-16 rounded-full bg-white border" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{dataToShow.name}</h1>
                            <p className="text-sm text-gray-500">University ID: {dataToShow.universityId}</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                            <Edit size={16} /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300">
                                {isLoading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <ProfileSection icon={University} title="Basic Information">
                        <InfoField label="University Name" value={dataToShow.name} isEditing={isEditing} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                        <InfoField label="University ID" value={dataToShow.universityId} isEditing={isEditing} onChange={e => setEditData({ ...editData, universityId: e.target.value })} />
                        <InfoField label="Establishment Date" type="date" value={dataToShow.establishmentDate} isEditing={isEditing} onChange={e => setEditData({ ...editData, establishmentDate: e.target.value })} />
                        <InfoField label="Logo URL" value={dataToShow.logoUrl} isEditing={isEditing} onChange={e => setEditData({ ...editData, logoUrl: e.target.value })} />
                    </ProfileSection>

                    <ProfileSection icon={User} title="Leadership">
                        <InfoField label="Chancellor" value={dataToShow.chancellorAndVC.chancellorName} isEditing={isEditing} onChange={e => handleInputChange('chancellorAndVC', 'chancellorName', e.target.value)} />
                        <InfoField label="Vice Chancellor" value={dataToShow.chancellorAndVC.viceChancellorName} isEditing={isEditing} onChange={e => handleInputChange('chancellorAndVC', 'viceChancellorName', e.target.value)} />
                        <InfoField label="Registrar" value={dataToShow.chancellorAndVC.registrarName} isEditing={isEditing} onChange={e => handleInputChange('chancellorAndVC', 'registrarName', e.target.value)} />
                    </ProfileSection>

                    <ProfileSection icon={Phone} title="Contact & Location">
                        <InfoField label="Email Address" value={dataToShow.contact.email} isEditing={isEditing} onChange={e => handleInputChange('contact', 'email', e.target.value)} />
                        <InfoField label="Phone Number" value={dataToShow.contact.phone} isEditing={isEditing} onChange={e => handleInputChange('contact', 'phone', e.target.value)} />
                        <InfoField label="Website" value={dataToShow.contact.website} isEditing={isEditing} onChange={e => handleInputChange('contact', 'website', e.target.value)} />
                        <InfoField label="Address" value={dataToShow.location.address} isEditing={isEditing} onChange={e => handleInputChange('location', 'address', e.target.value)} />
                        <InfoField label="City" value={dataToShow.location.city} isEditing={isEditing} onChange={e => handleInputChange('location', 'city', e.target.value)} />
                        <InfoField label="State" value={dataToShow.location.state} isEditing={isEditing} onChange={e => handleInputChange('location', 'state', e.target.value)} />
                        <InfoField label="Pincode" value={dataToShow.location.pincode} isEditing={isEditing} onChange={e => handleInputChange('location', 'pincode', e.target.value)} />
                    </ProfileSection>

                    <ProfileSection icon={Banknote} title="Financial & Legal">
                        <InfoField label="Bank Name" value={dataToShow.financials.bankName} isEditing={isEditing} onChange={e => handleInputChange('financials', 'bankName', e.target.value)} />
                        <InfoField label="Account Number" value={dataToShow.financials.accountNumber} isEditing={isEditing} onChange={e => handleInputChange('financials', 'accountNumber', e.target.value)} />
                        <InfoField label="IFSC Code" value={dataToShow.financials.ifscCode} isEditing={isEditing} onChange={e => handleInputChange('financials', 'ifscCode', e.target.value)} />
                        <InfoField label="PAN Number" value={dataToShow.financials.panNumber} isEditing={isEditing} onChange={e => handleInputChange('financials', 'panNumber', e.target.value)} />
                        <InfoField label="GSTIN" value={dataToShow.financials.gstin} isEditing={isEditing} onChange={e => handleInputChange('financials', 'gstin', e.target.value)} />
                    </ProfileSection>

                    <ProfileSection icon={Award} title="Accreditations">
                        {dataToShow.accreditations.map((accr, index) => (
                            <AccreditationCard key={accr._id} accreditation={accr} index={index} isEditing={isEditing} onChange={handleAccreditationChange} onRemove={removeAccreditation} />
                        ))}
                        {isEditing && (
                            <div className="mt-4">
                                <button onClick={addAccreditation} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    <Plus size={16} /> Add Accreditation
                                </button>
                            </div>
                        )}
                    </ProfileSection>
                </div>
            </div>
        </div>
    );
};

// --- Child Components ---

const ProfileSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <Icon className="text-gray-500" size={20} />
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {children}
        </div>
    </div>
);

const InfoField = ({ label, value, isEditing, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        {isEditing ? (
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        ) : (
            <p className="text-gray-800 font-medium mt-1">{value || '-'}</p>
        )}
    </div>
);

const AccreditationCard = ({ accreditation, index, isEditing, onChange, onRemove }) => {
    if (isEditing) {
        return (
            <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border relative">
                <button onClick={() => onRemove(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Body (e.g., NAAC)" value={accreditation.body} isEditing onChange={(e) => onChange(index, 'body', e.target.value)} />
                    <InfoField label="Grade" value={accreditation.grade} isEditing onChange={(e) => onChange(index, 'grade', e.target.value)} />
                    <InfoField label="Valid From" type="date" value={accreditation.validFrom} isEditing onChange={(e) => onChange(index, 'validFrom', e.target.value)} />
                    <InfoField label="Valid Till" type="date" value={accreditation.validTill} isEditing onChange={(e) => onChange(index, 'validTill', e.target.value)} />
                </div>
            </div>
        );
    }

    return (
        <div className="md:col-span-2">
            <p className="text-gray-800 font-semibold">{accreditation.body}: <span className="text-blue-600">{accreditation.grade}</span></p>
            <p className="text-sm text-gray-500">
                Validity: {new Date(accreditation.validFrom).toLocaleDateString('en-GB')} - {accreditation.validTill ? new Date(accreditation.validTill).toLocaleDateString('en-GB') : 'Present'}
            </p>
        </div>
    );
};

export default UniversityProfileManager;
