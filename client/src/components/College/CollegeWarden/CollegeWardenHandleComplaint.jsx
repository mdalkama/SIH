import React, { useState, useEffect, useMemo } from 'react';
import { Clock, CheckCircle, AlertTriangle, Loader2, Wrench, MapPin, Calendar, User, MessageSquare, ChevronDown } from 'lucide-react';

// --- Helper Components ---
const ComplaintCardSkeleton = () => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="h-6 bg-gray-200 rounded-full w-28"></div>
            <div className="h-5 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="p-3 bg-gray-50 rounded-md space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex justify-end mt-4">
            <div className="h-10 bg-gray-200 rounded-lg w-36"></div>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-20 col-span-full bg-gray-50 rounded-xl">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">All Clear!</h3>
        <p className="mt-1 text-sm text-gray-500">There are currently no complaints in this category.</p>
    </div>
);


const CollegeWardenHandleComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null); // For action dropdown

    const fetchData = async () => {
        if(!loading) setLoading(true); // Show loader on refetch
        setError(null);
        try {
            const res = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel/warden/complaints', { credentials: 'include' });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to fetch complaints.');
            }
            const data = await res.json();
            setComplaints(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Effect to close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdownId && !event.target.closest('.action-dropdown-container')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    const handleUpdateStatus = async (studentHostelId, complaintId, status) => {
        setUpdatingId(complaintId);
        setOpenDropdownId(null); // Close dropdown on action
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/college-warden/complaints/${studentHostelId}/${complaintId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to update status.');
            }
            // Optimistic UI update for faster feedback
            setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status } : c));
            // Then refetch to ensure data consistency
            await fetchData();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredComplaints = useMemo(() => {
        if (filterStatus === 'All') return complaints;
        return complaints.filter(c => c.status === filterStatus);
    }, [complaints, filterStatus]);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Resolved': return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800' };
            case 'In Progress': return { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800' };
            default: return { icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' };
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">Manage Complaints</h1>
                <p className="mt-1 text-sm text-gray-600">View and resolve student complaints from your college.</p>
                {/* Filter Buttons */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex space-x-2">
                        {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterStatus === status ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => <ComplaintCardSkeleton key={i} />)
                ) : filteredComplaints.length > 0 ? (
                    filteredComplaints.map(complaint => {
                        const statusInfo = getStatusInfo(complaint.status);
                        return (
                            <div key={complaint._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>{statusInfo.icon}<span className="ml-1.5">{complaint.status}</span></span>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}>{complaint.priority}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{complaint.description}</p>
                                    
                                    <div className="mt-4 text-xs text-gray-700 p-3 bg-gray-50 rounded-md border border-gray-200 space-y-2">
                                        <div className="flex items-center"><MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"/><p>{complaint.hostelDetail.hostelName}, Room {complaint.hostelDetail.roomNumber}</p></div>
                                        <div className="flex items-center"><Wrench className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"/><p>{complaint.issue}</p></div>
                                        <div className="flex items-center"><Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"/><p>{new Date(complaint.createdAt).toLocaleDateString()}</p></div>
                                        <div className="flex items-center"><User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"/><p>{complaint.registrationNumber}</p></div>
                                    </div>
                                </div>
                                
                                <div className="mt-5 text-right action-dropdown-container relative">
                                    {updatingId === complaint._id ? (
                                        <div className="flex justify-end items-center text-sm text-gray-500 p-2"><Loader2 className="w-4 h-4 animate-spin mr-2" />Updating...</div>
                                    ) : (
                                        complaint.status !== 'Resolved' && (
                                            <button 
                                                onClick={() => setOpenDropdownId(openDropdownId === complaint._id ? null : complaint._id)}
                                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                            >
                                                Change Status <ChevronDown className="w-4 h-4 ml-2" />
                                            </button>
                                        )
                                    )}

                                    {openDropdownId === complaint._id && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                            <div className="py-1" role="menu" aria-orientation="vertical">
                                                {['Open', 'In Progress', 'Resolved'].map(statusOption => (
                                                     <button
                                                        key={statusOption}
                                                        onClick={() => handleUpdateStatus(complaint.studentHostelId, complaint._id, statusOption)}
                                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        role="menuitem"
                                                     >
                                                        Mark as {statusOption}
                                                     </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default CollegeWardenHandleComplaint;