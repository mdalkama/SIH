import React, { useState, useEffect } from 'react';
import { Home, User, Phone, MapPin, Plus, Send, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

// --- Helper Components ---
const DetailRow = ({ icon: Icon, label, value, subValue }) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 text-gray-500 mt-1 mr-4 flex-shrink-0" />
        <div>
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-sm text-gray-600">{value}</p>
            {subValue && <p className="text-sm text-gray-600">{subValue}</p>}
        </div>
    </div>
);
const ComplaintCardSkeleton = () => <div className="border border-gray-200 rounded-lg p-4 h-32 animate-pulse bg-gray-50"></div>;
const AllocationCardSkeleton = () => <div className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse"></div>;

const HostelDashboard = () => {
    // --- State Management ---
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaint, setComplaint] = useState({ issue: '', priority: 'Medium', title: '', description: '' });
    
    // API Data
    const [allocationDetails, setAllocationDetails] = useState(null);
    const [complaints, setComplaints] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    
    const issueCategories = ['Maintenance', 'Electrical', 'Plumbing', 'Cleaning', 'Internet/WiFi', 'Other'];

    // --- Data Fetching ---
    const fetchData = async () => {
        if (!isLoading) setIsLoading(true);
        setError(null);
        try {
            const [allocationRes, complaintsRes] = await Promise.all([
                fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/my-allocation', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/complaints', { credentials: 'include' })
            ]);

            if (!allocationRes.ok) {
                if (allocationRes.status === 404) {
                    setAllocationDetails(null);
                } else {
                    const err = await allocationRes.json();
                    throw new Error(err.message || 'Failed to fetch allocation details.');
                }
            } else {
                 const allocationData = await allocationRes.json();
                 if (allocationData.success) setAllocationDetails(allocationData.data);
            }
            
            if (!complaintsRes.ok) { const err = await complaintsRes.json(); throw new Error(err.message || 'Failed to fetch complaints.'); }
            const complaintsData = await complaintsRes.json();
            if (complaintsData.success) setComplaints(complaintsData.data);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);
    
    // --- Handlers ---
    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); setMessage('');
        try {
            const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/complaints/raise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(complaint),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error);
            
            setMessage('Complaint raised successfully!');
            await fetchData();
            setShowComplaintForm(false);
            setComplaint({ issue: '', priority: 'Medium', title: '', description: '' });
        } catch (err) {
            setMessage(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'In Progress': return <Clock className="w-4 h-4 text-yellow-500" />;
            default: return <AlertTriangle className="w-4 h-4 text-blue-500" />;
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-green-600 bg-green-100';
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6"><AllocationCardSkeleton /><div className="bg-white rounded-xl p-6"><ComplaintCardSkeleton/></div></div>
                    <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {allocationDetails?.name || 'Student'}</p>
                </div>

                {error && <div className="p-4 mb-6 text-center bg-red-50 text-red-700 rounded-lg"><AlertTriangle className="inline-block mr-2"/>{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {allocationDetails ? (
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <div className="flex items-center mb-6"><Home className="w-6 h-6 text-blue-600 mr-3" /><h2 className="text-xl font-semibold">Your Allocation Details</h2></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6"><DetailRow icon={User} label={allocationDetails.name} value={`Roll No: ${allocationDetails.rollNumber}`} /><DetailRow icon={MapPin} label={allocationDetails.hostelName} value={`Floor ${allocationDetails.floorNumber}, Room ${allocationDetails.roomNumber}`} subValue={allocationDetails.roomType} /></div>
                                    <div className="space-y-6"><DetailRow icon={Phone} label={`Warden: ${allocationDetails.warden}`} value={allocationDetails.wardenContact} /><DetailRow icon={Clock} label="Check-in Date" value={new Date(allocationDetails.checkInDate).toLocaleDateString()} /></div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-6 text-center">
                                <Home size={40} className="mx-auto text-gray-400 mb-3"/><h3 className="font-semibold text-lg">No Hostel Allocated</h3><p className="text-gray-500">You are not currently allocated to any hostel room.</p>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">Your Complaints</h2>
                                {allocationDetails && <button onClick={() => setShowComplaintForm(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Raise Complaint</button>}
                            </div>
                            <div className="space-y-4">
                                {complaints.length > 0 ? complaints.map((comp) => (
                                    <div key={comp._id} className="border p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2"><div className="flex items-center"><div className="mr-2">{getStatusIcon(comp.status)}</div><h3 className="font-medium">{comp.title}</h3></div><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(comp.priority)}`}>{comp.priority}</span></div>
                                        <p className="text-sm text-gray-600 mb-2 pl-6">{comp.description}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500 pl-6">
                                            <span>{comp.issue} • Room {comp.hostelDetail.roomNumber}</span>
                                            <span>{new Date(comp.createdAt).toLocaleDateString()} • {comp.status}</span>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-4">You have not raised any complaints yet.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3"><button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"><p className="font-medium">Room Change Request</p><p className="text-sm text-gray-500">Apply for a room change</p></button><button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"><p className="font-medium">Visitor Pass</p><p className="text-sm text-gray-500">Generate a pass for visitors</p></button></div>
                        </div>
                    </div>
                </div>

                {showComplaintForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raise a Complaint</h3>
                            <form onSubmit={handleComplaintSubmit} className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1">Issue Category *</label><select value={complaint.issue} onChange={(e) => setComplaint({ ...complaint, issue: e.target.value })} className="w-full border rounded-lg px-3 py-2" required><option value="">Select category</option>{issueCategories.map(c => (<option key={c} value={c}>{c}</option>))}</select></div>
                                <div><label className="block text-sm font-medium mb-1">Priority Level</label><select value={complaint.priority} onChange={(e) => setComplaint({ ...complaint, priority: e.target.value })} className="w-full border rounded-lg px-3 py-2"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
                                <div><label className="block text-sm font-medium mb-1">Issue Title *</label><input type="text" value={complaint.title} onChange={(e) => setComplaint({ ...complaint, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Fan not working" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Detailed Description *</label><textarea value={complaint.description} onChange={(e) => setComplaint({ ...complaint, description: e.target.value })} rows={4} className="w-full border rounded-lg px-3 py-2" placeholder="Provide more details..." required /></div>
                                {message && <p className="text-sm text-red-600">{message}</p>}
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-4 h-4 mr-2" />} Submit
                                    </button>
                                    <button type="button" onClick={() => setShowComplaintForm(false)} className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostelDashboard;