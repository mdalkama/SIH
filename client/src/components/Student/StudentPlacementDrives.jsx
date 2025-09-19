import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Briefcase, IndianRupee, Calendar, CheckCircle, Info, X, AlertTriangle, Building2, BookCheck, Eye } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/placements';

// --- HELPER COMPONENTS ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => { const timer = setTimeout(() => { onClose(); }, 4000); return () => clearTimeout(timer); }, [onClose]);
    const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> };
    return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4" style={{ borderColor: type === 'error' ? '#f43f5e' : type === 'info' ? '#0ea5e9' : '#10b981' }}><div className="flex-shrink-0">{icons[type]}</div><p className="flex-1 text-sm text-slate-700 font-medium">{message}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button></div>);
};
const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return (<div className="fixed top-6 right-6 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
};
const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="h-6 w-48 bg-slate-200 rounded-md mb-2"></div>
                        <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
                    </div>
                    <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                    <div className="h-5 w-1/4 bg-slate-200 rounded-md"></div>
                    <div className="h-5 w-1/4 bg-slate-200 rounded-md"></div>
                </div>
            </div>
        ))}
    </div>
);
const DriveDetailsModal = ({ isOpen, onClose, drive }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">{drive.jobTitle}</h2><p className="text-sm text-slate-500">{drive.companyName}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X size={20} /></button></div>
                <div className="p-6 overflow-y-auto">
                    <h3 className="font-semibold text-slate-700 mb-2">Job Description</h3><p className="text-sm text-slate-600 whitespace-pre-wrap">{drive.jobDescription}</p>
                    <h3 className="font-semibold text-slate-700 mt-6 mb-2">Eligibility</h3><div className="text-sm text-slate-600 space-y-1"><p><span className="font-medium">Courses:</span> {drive.eligibleCourses.join(', ')}</p><p><span className="font-medium">Min CGPA:</span> {drive.minCGPA}</p></div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold text-sm">Close</button></div>
            </div>
        </div>
    );
};


// --- MAIN STUDENT PLACEMENT COMPONENT ---
const StudentPlacementDrives = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [applyingId, setApplyingId] = useState(null);
    
    const addToast = useCallback((type, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, message }]); }, []);

    const fetchDrives = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/student/drives`, { credentials: 'include' });
            if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || "Failed to fetch placement drives."); }
            const data = await response.json();
            setDrives(data.drives || []);
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchDrives(); }, [fetchDrives]);
    
    const handleApply = async (driveId, companyName) => {
        setApplyingId(driveId);
        try {
            const response = await fetch(`${API_BASE_URL}/drives/${driveId}/apply`, { method: 'POST', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            addToast('success', `Successfully applied to ${companyName}!`);
            fetchDrives();
        } catch (err) { addToast('error', err.message); } 
        finally { setApplyingId(null); }
    };
    
    if (loading) return <SkeletonLoader />;
    if (error) return <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{error}</div>;

    return (
        <div className="font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Placement Opportunities</h1>
                <p className="mt-1 text-slate-600">View and apply for upcoming job opportunities.</p>
            </header>

            <div className="space-y-4">
                {drives.length > 0 ? drives.map(drive => {
                    // Check if the current user has already applied. This assumes you have a way to know the current user's ID.
                    // For this dummy component, let's assume `drive.hasApplied` is a boolean from the API.
                    const hasApplied = drive.applications?.some(app => app.studentId === 'CURRENT_USER_ID'); // Replace with real logic

                    return (
                        <div key={drive._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{drive.jobTitle}</h2>
                                    <div className="flex items-center gap-2 text-slate-600 mt-1">
                                        <Building2 size={14} />
                                        <span className="font-medium">{drive.companyName}</span>
                                    </div>
                                </div>
                                <span className="flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-700">Open for Applications</span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <IndianRupee size={16} className="text-green-600" />
                                    <p><span className="font-semibold">{drive.packageLPA} LPA</span> <span className="text-slate-500 text-sm">(Package)</span></p>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Calendar size={16} className="text-red-600" />
                                    <p><span className="font-semibold">{new Date(drive.applicationDeadline).toLocaleDateString('en-GB')}</span> <span className="text-slate-500 text-sm">(Apply Before)</span></p>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setSelectedDrive(drive)} className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm flex items-center justify-center gap-2">
                                    <Eye size={16}/> View Details
                                </button>
                                {hasApplied ? (
                                    <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
                                        <CheckCircle size={16} /> Applied
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleApply(drive._id, drive.companyName)}
                                        disabled={applyingId === drive._id}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm disabled:bg-indigo-300"
                                    >
                                        {applyingId === drive._id ? (<Loader2 size={16} className="animate-spin" />) : (<BookCheck size={16} />)}
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                }) : (
                    <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
                        <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-800">No Open Drives</h3>
                        <p className="mt-1 text-sm text-slate-500">There are currently no placement drives open for you. Check back later!</p>
                    </div>
                )}
            </div>
            
            <DriveDetailsModal isOpen={!!selectedDrive} onClose={() => setSelectedDrive(null)} drive={selectedDrive} />
        </div>
    );
};

export default StudentPlacementDrives;