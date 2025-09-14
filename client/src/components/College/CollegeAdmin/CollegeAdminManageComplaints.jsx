import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, AlertTriangle, Inbox, Clock, CheckCircle, User, Calendar, Tag, MoreVertical, X } from 'lucide-react';

// --- Helper Components ---
const TabButton = ({ label, count, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            active 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        }`}
    >
        {label}
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            active 
            ? 'bg-white/20 text-white' 
            : 'bg-slate-200 text-slate-700'
        }`}>
            {count}
        </span>
    </button>
);

const ComplaintCard = ({ complaint, onStatusUpdate, updatingId }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const getStatusInfo = (status) => {
        switch (status) {
            case 'Submitted': return { icon: <Inbox size={16} />, color: 'text-blue-700 bg-blue-100' };
            case 'Under Review': return { icon: <Clock size={16} />, color: 'text-yellow-700 bg-yellow-100' };
            case 'Resolved': return { icon: <CheckCircle size={16} />, color: 'text-green-700 bg-green-100' };
            case 'Rejected': return { icon: <X size={16} />, color: 'text-red-700 bg-red-100' };
            default: return { icon: <AlertTriangle size={16} />, color: 'text-gray-700 bg-gray-100' };
        }
    };
    
    const statusInfo = getStatusInfo(complaint.status);
    const availableStatuses = ["Submitted", "Under Review", "Resolved", "Rejected"];

    const handleUpdate = (status) => {
        onStatusUpdate(complaint._id, status);
        setIsDropdownOpen(false);
    };

    return (
        // --- THIS IS THE FIX ---
        // The colored border (borderColor) has been removed, and a consistent border-slate-200 is used.
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {complaint.status}
                        </span>
                        <h3 className="text-lg font-bold text-slate-800 mt-3">{complaint.title}</h3>
                    </div>
                    
                    <div className="relative flex-shrink-0">
                        {updatingId === complaint._id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        ) : (
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                                <MoreVertical size={18} />
                            </button>
                        )}

                        {isDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-400 ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    {availableStatuses.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdate(status)}
                                            className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:text-slate-300"
                                            disabled={complaint.status === status}
                                        >
                                            Mark as {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-sm text-slate-600 mt-2 border-t border-slate-100 pt-3">{complaint.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-2">
                <span className="flex items-center font-medium">
                    <User className="w-3.5 h-3.5 mr-1.5" />
                    {complaint.filedBy?.name || 'Unknown'} ({complaint.filedBy?.registrationNumber || 'N/A'})
                </span>
                <span className="flex items-center"><Tag className="w-3.5 h-3.5 mr-1.5" />{complaint.category}</span>
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" />{new Date(complaint.createdAt).toLocaleDateString('en-GB')}</span>
            </div>
        </div>
    );
};


const CollegeAdminManageComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Submitted');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchData = useCallback(async () => {
        if (complaints.length === 0) setLoading(true);
        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/complaints/college', {
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to fetch complaints.');
            setComplaints(result.complaints || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [complaints.length]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateStatus = async (complaintId, status) => {
        setUpdatingId(complaintId);
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/complaints/college/${complaintId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update status.');
            setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: status } : c));
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredComplaints = useMemo(() => {
        if (activeTab === 'All') return complaints;
        return complaints.filter(c => c.status === activeTab);
    }, [complaints, activeTab]);

    const tabCounts = useMemo(() => ({
        All: complaints.length,
        Submitted: complaints.filter(c => c.status === 'Submitted').length,
        UnderReview: complaints.filter(c => c.status === 'Under Review').length,
        Resolved: complaints.filter(c => c.status === 'Resolved').length,
    }), [complaints]);

    return (
        <div className="min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Student Grievances</h1>
                <p className="mt-1 text-slate-600">Review and manage all student-submitted complaints for your college.</p>
            </header>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-wrap gap-2">
                    <TabButton label="Submitted" count={tabCounts.Submitted} active={activeTab === 'Submitted'} onClick={() => setActiveTab('Submitted')} />
                    <TabButton label="Under Review" count={tabCounts.UnderReview} active={activeTab === 'Under Review'} onClick={() => setActiveTab('Under Review')} />
                    <TabButton label="Resolved" count={tabCounts.Resolved} active={activeTab === 'Resolved'} onClick={() => setActiveTab('Resolved')} />
                    <TabButton label="All" count={tabCounts.All} active={activeTab === 'All'} onClick={() => setActiveTab('All')} />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
            ) : error ? (
                <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertTriangle className="mx-auto w-12 h-12 text-red-500" /><p className="mt-4 text-red-600">{error}</p></div>
            ) : filteredComplaints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredComplaints.map(complaint => (
                        <ComplaintCard key={complaint._id} complaint={complaint} onStatusUpdate={handleUpdateStatus} updatingId={updatingId} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
                    <CheckCircle className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800">All Clear!</h3>
                    <p className="mt-1 text-sm text-slate-500">There are no complaints in the "{activeTab}" category.</p>
                </div>
            )}
        </div>
    );
};

export default CollegeAdminManageComplaints;