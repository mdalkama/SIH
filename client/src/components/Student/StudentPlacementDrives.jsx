import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, Briefcase, IndianRupee, Calendar, CheckCircle, Info, X, AlertTriangle, Building2, BookCheck, Eye, FileText, Link, ThumbsUp, ThumbsDown } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/placements';

// --- HELPER COMPONENTS ---
const Toast = ({ message, type, onClose }) => { useEffect(() => { const timer = setTimeout(() => { onClose(); }, 4000); return () => clearTimeout(timer); }, [onClose]); const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> }; return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4" style={{ borderColor: type === 'error' ? '#f43f5e' : type === 'info' ? '#0ea5e9' : '#10b981' }}><div className="flex-shrink-0">{icons[type]}</div><p className="flex-1 text-sm text-slate-700 font-medium">{message}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button></div>); };
const ToastContainer = ({ toasts, setToasts }) => { const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id)); return (<div className="fixed top-6 right-6 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>); };
const SkeletonLoader = () => (<div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => (<div key={i} className="bg-white p-6 rounded-xl border border-slate-200"><div className="flex justify-between items-start"><div><div className="h-6 w-48 bg-slate-200 rounded-md mb-2"></div><div className="h-5 w-32 bg-slate-200 rounded-md"></div></div><div className="h-8 w-24 bg-slate-200 rounded-full"></div></div><div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100"><div className="h-5 w-1/4 bg-slate-200 rounded-md"></div><div className="h-5 w-1/4 bg-slate-200 rounded-md"></div></div></div>))}</div>);
const DriveDetailsModal = ({ isOpen, onClose, drive }) => { if (!isOpen) return null; return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"><div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">{drive.jobTitle}</h2><p className="text-sm text-slate-500">{drive.companyName}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X size={20} /></button></div><div className="p-6 overflow-y-auto"><h3 className="font-semibold text-slate-700 mb-2">Job Description</h3><p className="text-sm text-slate-600 whitespace-pre-wrap">{drive.jobDescription}</p><h3 className="font-semibold text-slate-700 mt-6 mb-2">Eligibility</h3><div className="text-sm text-slate-600 space-y-1"><p><span className="font-medium">Courses:</span> {drive.eligibleCourses.join(', ')}</p><p><span className="font-medium">Min CGPA:</span> {drive.minCGPA}</p></div></div><div className="p-4 bg-slate-50 border-t flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold text-sm">Close</button></div></div></div>); };
const ApplyModal = ({ isOpen, onClose, drive, onConfirm, isApplying }) => { const [resumeUrl, setResumeUrl] = useState(''); if (!isOpen) return null; return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"><div className="bg-white rounded-lg shadow-xl w-full max-w-lg"><div className="p-4 border-b"><h2 className="text-lg font-bold text-slate-800">Apply to {drive.companyName}</h2><p className="text-sm text-slate-500">For the role of {drive.jobTitle}</p></div><div className="p-6"><label htmlFor="resumeUrl" className="block text-sm font-medium text-slate-700 mb-2">Resume Link*</label><div className="relative"><Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="resumeUrl" type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://drive.google.com/..." required className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg" /></div><p className="text-xs text-slate-500 mt-2">Please provide a public link to your resume (e.g., from Google Drive or Dropbox).</p></div><div className="p-4 bg-slate-50 border-t flex justify-end gap-3"><button onClick={onClose} disabled={isApplying} className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-100 font-semibold">Cancel</button><button onClick={() => onConfirm(drive, resumeUrl)} disabled={isApplying || !resumeUrl} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2 disabled:bg-indigo-300">{isApplying ? <Loader2 size={16} className="animate-spin"/> : <BookCheck size={16}/>} Submit Application</button></div></div></div>); };

const ApplicationStatusBadge = ({ status }) => {
    const styles = { APPLIED: 'bg-blue-100 text-blue-800', SHORTLISTED: 'bg-yellow-100 text-yellow-800', REJECTED: 'bg-red-100 text-red-800', OFFER_ACCEPTED: 'bg-green-100 text-green-800', OFFER_DECLINED: 'bg-orange-100 text-orange-800' };
    return (<div className="mt-4 pt-4 border-t border-slate-100"><p className="text-xs text-slate-500 font-semibold mb-2">APPLICATION STATUS</p><span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status] || 'bg-slate-100'}`}>{status ? status.replace(/_/g, ' ') : 'N/A'}</span></div>);
};

const ApplicationStatusActions = ({ drive, onRespond, isLoading }) => {
    const { applicationStatus } = drive;
    if (applicationStatus === 'SHORTLISTED') {
        return (
            <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Congratulations! You have been shortlisted.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => onRespond(drive._id, 'OFFER_ACCEPTED')} disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm disabled:bg-green-300">{isLoading ? <Loader2 size={16} className="animate-spin"/> : <ThumbsUp size={16}/>} Accept Offer</button>
                    <button onClick={() => onRespond(drive._id, 'OFFER_DECLINED')} disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm disabled:bg-red-300">{isLoading ? <Loader2 size={16} className="animate-spin"/> : <ThumbsDown size={16}/>} Decline Offer</button>
                </div>
            </div>
        );
    }
    return <ApplicationStatusBadge status={applicationStatus} />;
};

// --- MAIN STUDENT PLACEMENT COMPONENT ---
const StudentPlacementDrives = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [applyingDrive, setApplyingDrive] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [activeTab, setActiveTab] = useState('available');
    const [actionLoading, setActionLoading] = useState(null);
    
    const addToast = useCallback((type, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, message }]); }, []);
    const fetchDrives = useCallback(async () => { setLoading(true); setError(null); try { const response = await fetch(`${API_BASE_URL}/student/drives`, { credentials: 'include' }); if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || "Failed to fetch placement drives."); } const data = await response.json(); setDrives(data.drives || []); } catch (err) { setError(err.message); } finally { setLoading(false); } }, []);
    useEffect(() => { fetchDrives(); }, [fetchDrives]);
    
    const handleApply = async (drive, resumeUrl) => {
        setIsApplying(true);
        try {
            const response = await fetch(`${API_BASE_URL}/drives/${drive._id}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ resumeUrl }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            addToast('success', `Successfully applied to ${drive.companyName}!`);
            setApplyingDrive(null);
            fetchDrives();
        } catch (err) { addToast('error', err.message); } 
        finally { setIsApplying(false); }
    };

    const handleOfferResponse = async (driveId, newStatus) => {
        setActionLoading(driveId);
        try {
            const response = await fetch(`${API_BASE_URL}/student/applications/${driveId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: newStatus }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            addToast('success', `Offer status updated successfully!`);
            fetchDrives();
        } catch (err) { addToast('error', err.message); } 
        finally { setActionLoading(null); }
    };

    const filteredDrives = useMemo(() => { if (activeTab === 'applied') { return drives.filter(drive => drive.hasApplied); } return drives; }, [drives, activeTab]);
    
    if (loading) return <SkeletonLoader />;
    if (error) return <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{error}</div>;

    const renderDriveCard = (drive) => (
        <div key={drive._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div><h2 className="text-xl font-bold text-slate-800">{drive.jobTitle}</h2><div className="flex items-center gap-2 text-slate-600 mt-1"><Building2 size={14} /><span className="font-medium">{drive.companyName}</span></div></div>
                <span className="flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-700">Open for Applications</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-700"><IndianRupee size={16} className="text-green-600" /><p><span className="font-semibold">{drive.packageLPA} LPA</span> <span className="text-slate-500 text-sm">(Package)</span></p></div>
                <div className="flex items-center gap-2 text-slate-700"><Calendar size={16} className="text-red-600" /><p><span className="font-semibold">{new Date(drive.applicationDeadline).toLocaleDateString('en-GB')}</span> <span className="text-slate-500 text-sm">(Apply Before)</span></p></div>
            </div>
            {activeTab === 'applied' ? (
                <ApplicationStatusActions drive={drive} onRespond={handleOfferResponse} isLoading={actionLoading === drive._id} />
            ) : (
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button onClick={() => setSelectedDrive(drive)} className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-sm flex items-center justify-center gap-2"><Eye size={16}/> View Details</button>
                    {drive.hasApplied ? (<div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm"><CheckCircle size={16} /> Applied</div>) : (<button onClick={() => setApplyingDrive(drive)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm"><BookCheck size={16} /> Apply Now</button>)}
                </div>
            )}
        </div>
    );

    return (
        <div className="font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <header className="mb-8"><h1 className="text-3xl font-bold text-slate-900">Placement Opportunities</h1><p className="mt-1 text-slate-600">View and apply for upcoming job opportunities.</p></header>
            <div className="mb-6 border-b border-slate-200"><nav className="flex space-x-4"><button onClick={() => setActiveTab('available')} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'available' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><Briefcase size={16} /> Available Drives</button><button onClick={() => setActiveTab('applied')} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'applied' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><FileText size={16} /> My Applications</button></nav></div>
            <div className="space-y-4">{filteredDrives.length > 0 ? (filteredDrives.map(drive => renderDriveCard(drive))) : (<div className="text-center py-20 px-6 bg-white rounded-xl border-2 border-dashed border-slate-200">{activeTab === 'available' ? <Briefcase className="mx-auto h-12 w-12 text-slate-300" /> : <FileText className="mx-auto h-12 w-12 text-slate-300" />}<h3 className="mt-4 text-lg font-semibold text-slate-800">{activeTab === 'available' ? 'No Open Drives' : 'No Applications Found'}</h3><p className="mt-1 text-sm text-slate-500">{activeTab === 'available' ? "There are currently no placement drives open for you." : "You have not applied to any drives yet."}</p></div>)}</div>
            <DriveDetailsModal isOpen={!!selectedDrive} onClose={() => setSelectedDrive(null)} drive={selectedDrive} />
            <ApplyModal isOpen={!!applyingDrive} onClose={() => setApplyingDrive(null)} drive={applyingDrive} onConfirm={handleApply} isApplying={isApplying} />
        </div>
    );
};

export default StudentPlacementDrives;