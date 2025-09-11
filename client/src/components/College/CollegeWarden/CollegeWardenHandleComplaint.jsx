import React, { useState, useEffect, useMemo } from 'react';
import { Clock, CheckCircle, AlertTriangle, ChevronDown, Loader2 } from 'lucide-react';

// --- Helper Components ---
const ComplaintCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex justify-end mt-4">
            <div className="h-9 bg-gray-200 rounded-lg w-32"></div>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16 col-span-full">
        <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Complaints</h3>
        <p className="mt-1 text-sm text-gray-500">There are currently no complaints to display.</p>
    </div>
);


const CollegeWardenHandleComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingId, setUpdatingId] = useState(null); // To show spinner on a specific card

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('https://sih-4ptm.onrender.com/api/v1/college-warden/complaints', { credentials: 'include' });
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

    const handleUpdateStatus = async (studentHostelId, complaintId, status) => {
        setUpdatingId(complaintId);
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
            // Refresh data to show the change
            await fetchData();
        } catch (err) {
            alert(`Error: ${err.message}`); // Simple alert for errors
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredComplaints = useMemo(() => {
        if (filterStatus === 'All') {
            return complaints;
        }
        return complaints.filter(c => c.status === filterStatus);
    }, [complaints, filterStatus]);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Resolved': return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: 'bg-green-100 text-green-800' };
            case 'In Progress': return { icon: <Clock className="w-4 h-4 text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' };
            default: return { icon: <AlertTriangle className="w-4 h-4 text-blue-500" />, color: 'bg-blue-100 text-blue-800' };
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
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Complaints</h1>
                <p className="mt-1 text-sm text-gray-600">View and resolve student complaints from your college.</p>
            </div>

            <div className="mb-4">
                <div className="flex space-x-2">
                    {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${filterStatus === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => <ComplaintCardSkeleton key={i} />)
                ) : filteredComplaints.length > 0 ? (
                    filteredComplaints.map(complaint => {
                        const statusInfo = getStatusInfo(complaint.status);
                        return (
                            <div key={complaint._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>{statusInfo.icon}<span className="ml-1.5">{complaint.status}</span></span>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}>{complaint.priority} Priority</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                                    <div className="mt-4 text-xs text-gray-500 p-3 bg-gray-50 rounded-md">
                                        <p><strong>Location:</strong> {complaint.hostelDetail.hostelName}, Room {complaint.hostelDetail.roomNumber}</p>
                                        <p><strong>Issue:</strong> {complaint.issue}</p>
                                        <p><strong>Raised on:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Reg. No:</strong> {complaint.registrationNumber}</p>
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                    {updatingId === complaint._id ? (
                                        <div className="flex justify-end items-center text-sm text-gray-500">
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...
                                        </div>
                                    ) : (
                                        complaint.status !== 'Resolved' && (
                                            <div className="relative inline-block text-left">
                                                <select
                                                    onChange={(e) => handleUpdateStatus(complaint.studentHostelId, complaint._id, e.target.value)}
                                                    value={complaint.status} // Controlled component
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                                >
                                                    <option value="Open">Set to Open</option>
                                                    <option value="In Progress">Set to In Progress</option>
                                                    <option value="Resolved">Set to Resolved</option>
                                                </select>
                                            </div>
                                        )
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