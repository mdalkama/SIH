import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, Briefcase, IndianRupee, Calendar, CheckCircle, Info, X, AlertTriangle, Building2, BookCheck, Eye, FileText, Link, Star, BookUser, ThumbsUp, ThumbsDown, SlidersHorizontal } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/placements';

// --- HELPER COMPONENTS ---
const Toast = ({ message, type, onClose }) => { useEffect(() => { const timer = setTimeout(() => { onClose(); }, 4000); return () => clearTimeout(timer); }, [onClose]); const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> }; return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4" style={{ borderColor: type === 'error' ? '#f43f5e' : type === 'info' ? '#0ea5e9' : '#10b981' }}><div className="flex-shrink-0">{icons[type]}</div><p className="flex-1 text-sm text-slate-700 font-medium">{message}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button></div>); };
const ToastContainer = ({ toasts, setToasts }) => { const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id)); return (<div className="fixed top-6 right-6 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>); };
const SkeletonLoader = () => (<div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => (<div key={i} className="bg-white p-6 rounded-xl border border-slate-200"><div className="flex justify-between items-start"><div><div className="h-6 w-48 bg-slate-200 rounded-md mb-2"></div><div className="h-5 w-32 bg-slate-200 rounded-md"></div></div><div className="h-8 w-24 bg-slate-200 rounded-full"></div></div><div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100"><div className="h-5 w-1/4 bg-slate-200 rounded-md"></div><div className="h-5 w-1/4 bg-slate-200 rounded-md"></div></div></div>))}</div>);
const DriveDetailsModal = ({ isOpen, onClose, drive }) => { if (!isOpen) return null; return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"><div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"><div className="p-5 border-b border-slate-200 bg-white flex justify-between items-start"><div><h2 className="text-xl font-bold text-slate-900">{drive.jobTitle}</h2><div className="flex items-center gap-2 text-slate-600 mt-1"><Building2 size={14} /><span className="font-semibold text-indigo-600">{drive.companyName}</span></div></div><button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"><X size={20} /></button></div><div className="p-6 overflow-y-auto"><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200"><IndianRupee className="w-7 h-7 text-green-500 flex-shrink-0" /><div><p className="text-xs font-semibold text-slate-500 uppercase">Package</p><p className="font-bold text-slate-800">{drive.packageLPA} LPA</p></div></div><div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200"><BookUser className="w-7 h-7 text-blue-500 flex-shrink-0" /><div><p className="text-xs font-semibold text-slate-500 uppercase">Eligible Courses</p><p className="font-bold text-slate-800">{drive.eligibleCourses.join(', ')}</p></div></div><div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200"><Star className="w-7 h-7 text-amber-500 flex-shrink-0" /><div><p className="text-xs font-semibold text-slate-500 uppercase">Min. CGPA</p><p className="font-bold text-slate-800">{drive.minCGPA}</p></div></div></div><div><h3 className="font-semibold text-slate-800 mb-2 text-base">Job Description</h3><div className="prose prose-sm text-slate-600 max-w-none bg-white p-4 rounded-md border border-slate-200"><p>{drive.jobDescription}</p></div></div></div><div className="p-4 bg-white border-t border-slate-200 flex justify-end"><button onClick={onClose} className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold text-sm transition-colors">Close</button></div></div></div>); };
const ApplyModal = ({ isOpen, onClose, drive, onConfirm, isApplying }) => { const [resumeUrl, setResumeUrl] = useState(''); if (!isOpen) return null; return (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"><div className="bg-white rounded-lg shadow-xl w-full max-w-lg"><div className="p-4 border-b"><h2 className="text-lg font-bold text-slate-800">Apply to {drive.companyName}</h2><p className="text-sm text-slate-500">For the role of {drive.jobTitle}</p></div><div className="p-6"><label htmlFor="resumeUrl" className="block text-sm font-medium text-slate-700 mb-2">Resume Link*</label><div className="relative"><Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="resumeUrl" type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://drive.google.com/..." required className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg" /></div><p className="text-xs text-slate-500 mt-2">Please provide a public link to your resume (e.g., from Google Drive or Dropbox).</p></div><div className="p-4 bg-slate-50 border-t flex justify-end gap-3"><button onClick={onClose} disabled={isApplying} className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-100 font-semibold">Cancel</button><button onClick={() => onConfirm(drive, resumeUrl)} disabled={isApplying || !resumeUrl} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2 disabled:bg-indigo-300">{isApplying ? <Loader2 size={16} className="animate-spin"/> : <BookCheck size={16}/>} Submit Application</button></div></div></div>); };
const ApplicationStatusBadge = ({ status }) => { const styles = { APPLIED: 'bg-blue-100 text-blue-800', SHORTLISTED: 'bg-yellow-100 text-yellow-800', REJECTED: 'bg-red-100 text-red-800', OFFER_ACCEPTED: 'bg-green-100 text-green-800', OFFER_DECLINED: 'bg-orange-100 text-orange-800' }; return (<div className="mt-4 pt-4 border-t border-slate-100"><p className="text-xs text-slate-500 font-semibold mb-2">APPLICATION STATUS</p><span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status] || 'bg-slate-100'}`}>{status ? status.replace(/_/g, ' ') : 'N/A'}</span></div>); };
const ApplicationStatusActions = ({ drive, onRespond, loadingAction }) => { const { applicationStatus } = drive; if (applicationStatus === 'SHORTLISTED') { const isAccepting = loadingAction && loadingAction.driveId === drive._id && loadingAction.type === 'accept'; const isDeclining = loadingAction && loadingAction.driveId === drive._id && loadingAction.type === 'decline'; return (<div className="mt-4 pt-4 border-t border-slate-100"><p className="text-sm font-semibold text-yellow-800 mb-2">Congratulations! You have been shortlisted.</p><div className="flex flex-col sm:flex-row gap-3"><button onClick={() => onRespond(drive._id, 'OFFER_ACCEPTED', 'accept')} disabled={isAccepting || isDeclining} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm disabled:bg-green-300">{isAccepting ? <Loader2 size={16} className="animate-spin"/> : <ThumbsUp size={16}/>} Accept Offer</button><button onClick={() => onRespond(drive._id, 'OFFER_DECLINED', 'decline')} disabled={isAccepting || isDeclining} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm disabled:bg-red-300">{isDeclining ? <Loader2 size={16} className="animate-spin"/> : <ThumbsDown size={16}/>} Decline Offer</button></div></div>); } return <ApplicationStatusBadge status={applicationStatus} />; };

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
    const [filters, setFilters] = useState({ course: '', minPackage: '', minCGPA: '' });
    
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
    
    const handleApply = async (drive, resumeUrl) => { setIsApplying(true); try { const response = await fetch(`${API_BASE_URL}/drives/${drive._id}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ resumeUrl }) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); addToast('success', `Successfully applied to ${drive.companyName}!`); setApplyingDrive(null); fetchDrives(); } catch (err) { addToast('error', err.message); } finally { setIsApplying(false); } };
    const handleOfferResponse = async (driveId, newStatus, actionType) => { setActionLoading({ driveId, type: actionType }); try { const response = await fetch(`${API_BASE_URL}/student/applications/${driveId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: newStatus }) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); addToast('success', `Offer status updated successfully!`); fetchDrives(); } catch (err) { addToast('error', err.message); } finally { setActionLoading(null); } };

    const filteredDrives = useMemo(() => {
        let drivesToDisplay = drives;
        if (activeTab === 'applied') {
            return drives.filter(drive => drive.hasApplied);
        }
        return drivesToDisplay.filter(drive => {
            const courseFilterPassed = filters.course ? drive.eligibleCourses.some(c => c.toLowerCase().includes(filters.course.toLowerCase())) : true;
            const packageFilterPassed = filters.minPackage ? drive.packageLPA >= parseFloat(filters.minPackage) : true;
            const cgpaFilterPassed = filters.minCGPA ? drive.minCGPA <= parseFloat(filters.minCGPA) : true;
            return courseFilterPassed && packageFilterPassed && cgpaFilterPassed;
        });
    }, [drives, activeTab, filters]);

    const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
    
    if (loading) return <SkeletonLoader />;
    if (error) return <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{error}</div>;

    const renderDriveCard = (drive) => (
        <div key={drive._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4"><h2 className="text-xl font-bold text-slate-800">{drive.jobTitle}</h2><div className="flex items-center gap-2 text-slate-600 mt-1"><Building2 size={14} /><span className="font-medium">{drive.companyName}</span></div></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-slate-100"><div className="flex items-center gap-2 text-slate-700"><IndianRupee size={16} className="text-green-600" /><p><span className="font-semibold">{drive.packageLPA} LPA</span> <span className="text-slate-500 text-sm">(Package)</span></p></div><div className="flex items-center gap-2 text-slate-700"><Calendar size={16} className="text-red-600" /><p><span className="font-semibold">{new Date(drive.applicationDeadline).toLocaleDateString('en-GB')}</span> <span className="text-slate-500 text-sm">(Apply Before)</span></p></div></div>
            {activeTab === 'applied' ? (<ApplicationStatusActions drive={drive} onRespond={handleOfferResponse} loadingAction={actionLoading} />) : (<div className="mt-5 flex flex-col sm:flex-row gap-3"><button onClick={() => setSelectedDrive(drive)} className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold text-sm flex items-center justify-center gap-2"><Eye size={16}/> View Details</button>{drive.hasApplied ? (<div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm"><CheckCircle size={16} /> Applied</div>) : (<button onClick={() => setApplyingDrive(drive)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm"><BookCheck size={16} /> Apply Now</button>)}</div>)}
        </div>
    );

    return (
        <div className="font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="mb-6 border-b border-slate-200"><nav className="flex space-x-4"><button onClick={() => setActiveTab('available')} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'available' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><Briefcase size={16} /> Available Drives</button><button onClick={() => setActiveTab('applied')} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'applied' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><FileText size={16} /> My Applications</button></nav></div>
            
            {activeTab === 'available' && (<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center"><div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><SlidersHorizontal size={16}/> Filter by:</div><input name="course" value={filters.course} onChange={handleFilterChange} placeholder="Course (e.g., CSE)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/><input name="minPackage" value={filters.minPackage} onChange={handleFilterChange} type="number" placeholder="Min. Package (LPA)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/><input name="minCGPA" value={filters.minCGPA} onChange={handleFilterChange} type="number" step="0.1" placeholder="Your CGPA (e.g., 8.5)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/></div></div>)}
            
            <div className="space-y-4">{filteredDrives.length > 0 ? (filteredDrives.map(drive => renderDriveCard(drive))) : (<div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200"><h3 className="mt-4 text-lg font-semibold text-slate-800">{activeTab === 'available' ? 'No Drives Found' : 'No Applications Found'}</h3><p className="mt-1 text-sm text-slate-500">{activeTab === 'available' ? "Try adjusting your filters or check back later." : "You have not applied to any drives yet."}</p></div>)}</div>
            
            <DriveDetailsModal isOpen={!!selectedDrive} onClose={() => setSelectedDrive(null)} drive={selectedDrive} />
            <ApplyModal isOpen={!!applyingDrive} onClose={() => setApplyingDrive(null)} drive={applyingDrive} onConfirm={handleApply} isApplying={isApplying} />
        </div>
    );
};

export default StudentPlacementDrives;