import React, { useState, useEffect } from 'react';
import { Edit, X, Loader2, AlertTriangle, CheckCircle, Info, Save } from 'lucide-react';
import ProfileEditForm from './components/ProfileEditForm';

const UNIVERSITY_API_URL = 'https://sih-4ptm.onrender.com/api/v1/university/main';

// --- NEW SKELETON LOADER COMPONENT ---
const ProfileSkeleton = () => (
    <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
            <div className="h-9 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-200"></div>
                    <div>
                        <div className="h-8 w-64 bg-slate-200 rounded-md mb-2"></div>
                        <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="h-6 w-1/4 bg-slate-200 rounded-md mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="h-6 w-1/4 bg-slate-200 rounded-md mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


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
                const responseData = await response.json();
                setUniversityData(responseData);
            } catch (err) {
                addToast('error', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUniversityData();
    }, []);


    // --- INTEGRATE SKELETON LOADER ---
    if (isLoading) {
        return (
            <div className="font-sans">
                <div className="max-w-7xl mx-auto">
                    <ProfileSkeleton />
                </div>
            </div>
        );
    }

    if (!universityData) {
        return <div className="text-center py-16 text-gray-500">Could not load university data. It might not be created yet.</div>
    }

    return (
        <div className=" font-sans">
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
                        onCancel={() => setIsEditing(false)}
                        setUniversityData={setUniversityData}
                        addToast={addToast}
                        setIsEditing={setIsEditing}
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
        <div className="space-y-6 animate-fade-in border-gray-200">
            <div className="bg-white p-6 rounded-lg border-gray-300 border shadow-sm">
                <div className="flex items-center gap-6">
                    <img src={data.logoUrl || 'https://placehold.co/100x100/E2E8F0/4A5568?text=Logo'} alt="University Logo" className="w-24 h-24 rounded-full object-cover border-gray-300 border" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                        <p className="text-md text-gray-600 font-mono">{data.universityId}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 border-gray-300 border-b pb-3 mb-4">Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField label="Chancellor" value={data.chancellorAndVC?.chancellorName} />
                    <InfoField label="Vice Chancellor" value={data.chancellorAndVC?.viceChancellorName} />
                    <InfoField label="Registrar" value={data.chancellorAndVC?.registrarName} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border-gray-200 border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 border-gray-300 border-b pb-3 mb-4">Contact & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField label="Email" value={data.contact?.email} />
                    <InfoField label="Phone" value={data.contact?.phone} />
                    <InfoField label="Website" value={data.contact?.website} />
                    <InfoField label="Address" value={`${data.location?.address || ''}, ${data.location?.city || ''}, ${data.location?.state || ''} - ${data.location?.pincode || ''}`.replace(/ ,| - $/, '').trim()} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800  border-gray-300 border-b pb-3 mb-4">Financial & Legal</h3>
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