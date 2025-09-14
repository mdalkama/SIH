import React, { useState, useEffect } from 'react';
import {
  Home, User, Phone, MapPin, Send, Clock,
  CheckCircle, AlertTriangle, Loader2, Repeat,
  Users, X, IndianRupee, ChevronLeft, ChevronRight
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const DetailItem = ({ icon: Icon, label, value, subValue }) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 text-gray-500 mt-1 mr-4 flex-shrink-0" />
        <div>
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-sm text-gray-600">{value}</p>
            {subValue && <p className="text-sm text-gray-600">{subValue}</p>}
        </div>
    </div>
);

const AllocationSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="flex items-center mb-4"><div className="w-8 h-8 bg-gray-200 rounded mr-2"></div><div className="h-6 w-40 bg-gray-200 rounded"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"><div className="space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div><div className="space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-2/3"></div></div></div>
    </div>
);

const CardListSkeleton = () => (
    <div className="bg-white rounded-lg p-6 animate-pulse border border-gray-200 shadow-sm">
        <div className="h-8 bg-gray-200 rounded-md w-full mb-4"></div>
        <div className="space-y-4">
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-16 bg-gray-100 rounded-lg"></div>
        </div>
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-semibold text-gray-900">{title}</h3><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button></div>
                {children}
            </div>
        </div>
    );
};

const PaginatedContent = ({ data, renderItem, itemsPerPageOptions = [5, 10, 20], emptyStateMessage, tableHeaders }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

    // This ensures data is always an array before further processing
    const safeData = Array.isArray(data) ? data : [];

    const totalPages = Math.ceil(safeData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = safeData.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [data, itemsPerPage]);

    if (safeData.length === 0) {
        return <p className="text-center text-gray-500 py-8">{emptyStateMessage}</p>;
    }

    return (
        <div>
            {tableHeaders ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left">
                            <tr>{tableHeaders.map((header, i) => <th key={i} className={`p-3 font-semibold text-slate-600 ${header.className}`}>{header.label}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentItems.map(item => renderItem(item))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="space-y-4">
                    {currentItems.map(item => renderItem(item))}
                </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-4">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="p-1 border border-gray-300 rounded-md">
                        {itemsPerPageOptions.map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                </div>
                <div>Showing {startIndex + 1} to {Math.min(endIndex, safeData.length)} of {safeData.length} results</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 border rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 border rounded-md disabled:opacity-50"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

// --- HELPER FUNCTIONS ---
const getComplaintStatusIcon = (status) => {
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

const getRoomChangeStatusColor = (status) => {
    switch(status) {
        case 'Approved': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-yellow-100 text-yellow-800';
    }
};


// --- MAIN COMPONENT ---
const HostelDashboard = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [complaint, setComplaint] = useState({ issue: '', priority: 'Medium', title: '', description: '' });
    const [roomChangeReason, setRoomChangeReason] = useState('');
    const [visitor, setVisitor] = useState({ name: '', relation: '', purpose: '' });
    
    const [allocationDetails, setAllocationDetails] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [roomChangeRequests, setRoomChangeRequests] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [fees, setFees] = useState([]);
    console.log(fees)
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [activeContentTab, setActiveContentTab] = useState('fees');

    const issueCategories = ['Maintenance', 'Electrical', 'Plumbing', 'Cleaning', 'Internet/WiFi', 'Other'];

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [allocRes, compRes, roomChangeRes, visitorRes, feeRes] = await Promise.all([
                fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/my-allocation', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/complaints', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/room-change-requests', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/visitors', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/fees', { credentials: 'include' })
            ]);

            if (allocRes.status === 404) setAllocationDetails(null);
            else if (allocRes.ok) { const d = await allocRes.json(); if (d.success) setAllocationDetails(d.data); }
            else { const e = await allocRes.json(); throw new Error(e.message || 'Failed to fetch allocation'); }
            
<<<<<<< HEAD
            if(compRes.ok) { const d = await compRes.json(); if(d.success) setComplaints(Array.isArray(d.data) ? d.data : []); }
            if(roomChangeRes.ok) { const d = await roomChangeRes.json(); if(d.success) setRoomChangeRequests(Array.isArray(d.data) ? d.data : []); }
            if(visitorRes.ok) { const d = await visitorRes.json(); if(d.success) setVisitors(Array.isArray(d.data) ? d.data : []); }
            if(feeRes.ok) { const d = await feeRes.json(); if(d.success) setFees(Array.isArray(d.data) ? d.data : []); } // Set fees data with array check
=======
            if(compRes.ok) { const d = await compRes.json(); if(d.success) setComplaints(d.data || []); }
            if(roomChangeRes.ok) { const d = await roomChangeRes.json(); if(d.success) setRoomChangeRequests(d.data || []); }
            if(visitorRes.ok) { const d = await visitorRes.json(); if(d.success) setVisitors(d.data || []); }
            if(feeRes.ok) { const d = await feeRes.json(); if(d.success) setFees(d.data.hostelFees || []); }
>>>>>>> 0e8821a023129b65b83a3c1a40df23315a2d98bd

        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleComplaintSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); try { const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/complaints/raise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(complaint) }); const data = await res.json(); if (!res.ok) throw new Error(data.message || data.error); await fetchData(); setActiveModal(null); setComplaint({ issue: '', priority: 'Medium', title: '', description: '' }); } catch (err) { setMessage(err.message); } finally { setIsSubmitting(false); } };
    const handleRoomChangeSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); try { const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/room-change-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ reason: roomChangeReason }) }); const data = await res.json(); if (!res.ok) throw new Error(data.message); await fetchData(); setActiveModal(null); setRoomChangeReason(''); } catch (err) { setMessage(err.message); } finally { setIsSubmitting(false); } };
    const handleVisitorSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); try { const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/visitor-pass', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(visitor) }); const data = await res.json(); if (!res.ok) throw new Error(data.message); await fetchData(); setActiveModal(null); setVisitor({ name: '', relation: '', purpose: '' }); } catch (err) { setMessage(err.message); } finally { setIsSubmitting(false); } };

    const renderContent = () => {
        switch (activeContentTab) {
            case 'fees': return renderFees();
            case 'complaints': return renderComplaints();
            case 'roomChanges': return renderRoomChanges();
            case 'visitors': return renderVisitors();
            default: return null;
        }
    };

    const renderFees = () => {
<<<<<<< HEAD
        if (!Array.isArray(fees) || fees.length === 0) {
            return <p className="text-center text-gray-500 py-8">No hostel fee records have been assigned yet.</p>;
        }
=======
        const headers = [
            { label: 'Month', className: '' },
            { label: 'Total Amount', className: 'text-right' },
            { label: 'Amount Paid', className: 'text-right' },
            { label: 'Pending', className: 'text-right' },
            { label: 'Status', className: 'text-center' },
        ];
>>>>>>> 0e8821a023129b65b83a3c1a40df23315a2d98bd
        return (
            <PaginatedContent
                data={fees.slice().reverse()}
                tableHeaders={headers}
                emptyStateMessage="No hostel fee records have been assigned yet."
                renderItem={(fee) => {
                    const pending = fee.amount - fee.paidAmount;
                    const isPaid = pending <= 0;
                    return (
                        <tr key={fee._id} className="hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-800">{fee.month}</td>
                            <td className="p-3 text-right font-mono text-slate-600">₹{fee.amount.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-right font-mono text-green-600">₹{fee.paidAmount.toLocaleString('en-IN')}</td>
                            <td className={`p-3 text-right font-mono font-semibold ${pending > 0 ? 'text-red-600' : 'text-slate-500'}`}>₹{pending.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-center">
                                {isPaid ? <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Paid</span> : <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> {fee.status}</span>}
                            </td>
                        </tr>
                    );
                }}
            />
        );
    };

<<<<<<< HEAD
    const renderComplaints = () => {
        const recentComplaints = Array.isArray(complaints) ? complaints.slice(0, 5) : [];
        if (recentComplaints.length === 0) {
            return <p className="text-center text-gray-500 py-8">You haven't raised any complaints yet.</p>;
        }
        const getStatusIcon = (status) => { switch (status) { case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-500" />; case 'In Progress': return <Clock className="w-4 h-4 text-yellow-500" />; default: return <AlertTriangle className="w-4 h-4 text-blue-500" />; } };
        const getPriorityColor = (priority) => { switch (priority) { case 'High': return 'text-red-600 bg-red-100'; case 'Medium': return 'text-yellow-600 bg-yellow-100'; default: return 'text-green-600 bg-green-100'; } };
        return (
            <div className="space-y-4">
                {recentComplaints.map((comp) => (
                    <div key={comp._id} className="border border-gray-200 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><div className="mr-1">{getStatusIcon(comp.status)}</div><h3 className="font-semibold text-gray-800">{comp.title}</h3></div><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(comp.priority)}`}>{comp.priority}</span></div>
                        <p className="text-sm text-gray-600 mb-2 pl-7">{comp.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 pl-7"><span>{comp.issue} • Room {comp.hostelDetail.roomNumber}</span><span>{new Date(comp.createdAt).toLocaleDateString()} • {comp.status}</span></div>
                    </div>
                ))}
            </div>
        );
    };

    const renderRoomChanges = () => {
        const recentRoomChanges = Array.isArray(roomChangeRequests) ? roomChangeRequests.slice(0, 5) : [];
        if (recentRoomChanges.length === 0) {
            return <p className="text-center text-gray-500 py-8">No room change requests found.</p>;
        }
        const getStatusColor = (status) => { switch(status) { case 'Approved': return 'bg-green-100 text-green-800'; case 'Rejected': return 'bg-red-100 text-red-800'; default: return 'bg-yellow-100 text-yellow-800'; } };
        return (
            <div className="space-y-4">
                {recentRoomChanges.map(req => (
                    <div key={req._id} className="border border-gray-200 p-4 rounded-lg">
                        <div className="flex justify-between items-start"><p className="text-sm text-gray-500">Requested on: {new Date(req.requestedAt).toLocaleDateString()}</p><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.status)}`}>{req.status}</span></div>
                        <p className="mt-2 font-medium text-gray-800">Reason:</p><p className="text-sm text-gray-600 italic">"{req.reason}"</p>
                    </div>
                ))}
            </div>
        );
    };

    const renderVisitors = () => {
        const recentVisitors = Array.isArray(visitors) ? visitors.slice(0, 5) : [];
        if (recentVisitors.length === 0) {
            return <p className="text-center text-gray-500 py-8">No visitor passes found.</p>;
        }
        return (
            <div className="space-y-3">
                {recentVisitors.map(visitor => (
                    <div key={visitor._id} className="border border-gray-200 p-4 rounded-lg">
                        <div className="flex justify-between items-center"><h4 className="font-semibold text-gray-800">{visitor.name}</h4><span className="text-sm text-gray-500">{new Date(visitor.date).toLocaleDateString()}</span></div>
                        <p className="text-sm text-gray-600">Relation: <span className="font-medium">{visitor.relation || 'N/A'}</span></p><p className="text-sm text-gray-600">Purpose: <span className="font-medium">{visitor.purpose || 'N/A'}</span></p>
                    </div>
                ))}
            </div>
        );
    };
=======
    const renderComplaints = () => (
        <PaginatedContent
            data={complaints}
            emptyStateMessage="You haven't raised any complaints yet."
            renderItem={(comp) => (
                <div key={comp._id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><div className="mr-1">{getComplaintStatusIcon(comp.status)}</div><h3 className="font-semibold text-gray-800">{comp.title}</h3></div><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(comp.priority)}`}>{comp.priority}</span></div>
                    <p className="text-sm text-gray-600 mb-2 pl-7">{comp.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 pl-7"><span>{comp.issue} • Room {comp.hostelDetail.roomNumber}</span><span>{new Date(comp.createdAt).toLocaleDateString()} • {comp.status}</span></div>
                </div>
            )}
        />
    );

    const renderRoomChanges = () => (
        <PaginatedContent
            data={roomChangeRequests}
            emptyStateMessage="No room change requests found."
            renderItem={(req) => (
                <div key={req._id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start"><p className="text-sm text-gray-500">Requested on: {new Date(req.requestedAt).toLocaleDateString()}</p><span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoomChangeStatusColor(req.status)}`}>{req.status}</span></div>
                    <p className="mt-2 font-medium text-gray-800">Reason:</p><p className="text-sm text-gray-600 italic">"{req.reason}"</p>
                </div>
            )}
        />
    );

    const renderVisitors = () => (
        <PaginatedContent
            data={visitors}
            emptyStateMessage="No visitor passes found."
            renderItem={(visitor) => (
                <div key={visitor._id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center"><h4 className="font-semibold text-gray-800">{visitor.name}</h4><span className="text-sm text-gray-500">{new Date(visitor.date).toLocaleDateString()}</span></div>
                    <p className="text-sm text-gray-600">Relation: <span className="font-medium">{visitor.relation || 'N/A'}</span></p><p className="text-sm text-gray-600">Purpose: <span className="font-medium">{visitor.purpose || 'N/A'}</span></p>
                </div>
            )}
        />
    );
>>>>>>> 0e8821a023129b65b83a3c1a40df23315a2d98bd

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 p-4">
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6"><AllocationSkeleton /><CardListSkeleton /></div>
                    <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm  border border-gray-300 p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">Hostel Dashboard</h1>
                    <p className="text-gray-600">Welcome, {allocationDetails?.name || 'Student'}</p>
                </div>
                {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-lg">{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {allocationDetails ? (
                            <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                                <div className="flex items-center mb-4"><Home className="w-6 h-6 text-blue-600 mr-2" /><h2 className="text-xl font-semibold">Your Allocation Details</h2></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><DetailItem icon={User} label={allocationDetails.name} value={`Roll No: ${allocationDetails.rollNumber}`} /><DetailItem icon={MapPin} label={allocationDetails.hostelName} value={`Floor ${allocationDetails.floorNumber}, Room ${allocationDetails.roomNumber}`} subValue={allocationDetails.roomType} /><DetailItem icon={Phone} label={`Warden: ${allocationDetails.warden}`} value={`${allocationDetails.wardenContact}`} /><DetailItem icon={Clock} label="Check-in Date" value={new Date(allocationDetails.checkInDate).toLocaleDateString()} /></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center"><Home size={40} className="mx-auto text-gray-400 mb-3" /><h3 className="font-semibold text-lg">No Hostel Allocated</h3><p className="text-gray-500">You are not currently allocated to any hostel room.</p></div>
                        )}

                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-6 px-6 " aria-label="Tabs">
                                    <button onClick={() => setActiveContentTab('fees')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeContentTab === 'fees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><IndianRupee className="inline-block mr-1 h-4 w-4" /> Hostel Fees</button>
                                    <button onClick={() => setActiveContentTab('complaints')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeContentTab === 'complaints' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Complaints</button>
                                    <button onClick={() => setActiveContentTab('roomChanges')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeContentTab === 'roomChanges' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Room Changes</button>
                                    <button onClick={() => setActiveContentTab('visitors')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeContentTab === 'visitors' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Visitors</button>
                                </nav>
                            </div>
                            <div className="p-3">{renderContent()}</div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg  border border-gray-300 shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => setActiveModal('complaint')} className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-3"><Send className="w-5 h-5 text-blue-600"/> <p className="font-medium">Raise Complaint</p></button>
                                <button onClick={() => setActiveModal('roomChange')} className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-3"><Repeat className="w-5 h-5 text-orange-600"/> <p className="font-medium">Request Room Change</p></button>
                                <button onClick={() => setActiveModal('visitor')} className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-3"><Users className="w-5 h-5 text-purple-600"/> <p className="font-medium">Generate Visitor Pass</p></button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
                            <div className="space-y-3"><div><p className="font-medium">Security</p><p className="text-sm text-gray-600">+91-9876543211</p></div><div><p className="font-medium">Maintenance</p><p className="text-sm text-gray-600">+91-9876543213</p></div></div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={activeModal === 'complaint'} onClose={() => setActiveModal(null)} title="Raise a Complaint"><form onSubmit={handleComplaintSubmit} className="space-y-4"><div><label className="block text-sm font-medium mb-1">Issue Category *</label><select value={complaint.issue} onChange={(e) => setComplaint({ ...complaint, issue: e.target.value })} className="w-full border border-gray-500 rounded-lg px-3 py-2 bg-white" required><option value="" disabled>Select category</option>{issueCategories.map(c => (<option key={c} value={c}>{c}</option>))}</select></div><div><label className="block text-sm font-medium mb-1">Priority</label><select value={complaint.priority} onChange={(e) => setComplaint({ ...complaint, priority: e.target.value })} className="w-full border border-gray-500 rounded-lg px-3 py-2 bg-white"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div><div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" value={complaint.title} onChange={(e) => setComplaint({ ...complaint, title: e.target.value })} className="w-full border border-gray-500 rounded-lg px-3 py-2" required /></div><div><label className="block text-sm font-medium mb-1">Description *</label><textarea value={complaint.description} onChange={(e) => setComplaint({ ...complaint, description: e.target.value })} rows={4} className="w-full border border-gray-500 rounded-lg px-3 py-2" required /></div>{message && <p className="text-sm text-red-600">{message}</p>}<div className="flex gap-3 pt-4"><button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"><Send className="w-4 h-4 mr-2" />{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}</button><button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border rounded-lg">Cancel</button></div></form></Modal>
                <Modal isOpen={activeModal === 'roomChange'} onClose={() => setActiveModal(null)} title="Request Room Change"><form onSubmit={handleRoomChangeSubmit} className="space-y-4"><div><label className="block text-sm font-medium mb-1">Reason *</label><textarea value={roomChangeReason} onChange={(e) => setRoomChangeReason(e.target.value)} rows={5} className="w-full border border-gray-500 rounded-lg p-2" required /></div>{message && <p className="text-sm text-red-600">{message}</p>}<div className="flex gap-3 pt-4"><button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"><Repeat className="w-4 h-4 mr-2" />{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}</button><button type="button" onClick={() => setActiveModal(null)} className="py-2 border rounded-lg px-4">Cancel</button></div></form></Modal>
                <Modal isOpen={activeModal === 'visitor'} onClose={() => setActiveModal(null)} title="Generate Visitor Pass"><form onSubmit={handleVisitorSubmit} className="space-y-4"><div><label className="block text-sm font-medium mb-1">Visitor's Name *</label><input type="text" value={visitor.name} onChange={(e) => setVisitor({ ...visitor, name: e.target.value })} className="w-full border border-gray-500 rounded-lg p-2" required/></div><div><label className="block text-sm font-medium mb-1">Relation</label><input type="text" value={visitor.relation} onChange={(e) => setVisitor({ ...visitor, relation: e.target.value })} className="w-full border border-gray-500 rounded-lg p-2"/></div><div><label className="block text-sm font-medium mb-1">Purpose</label><textarea value={visitor.purpose} onChange={(e) => setVisitor({ ...visitor, purpose: e.target.value })} rows={3} className="w-full border border-gray-500 rounded-lg p-2"/></div>{message && <p className="text-sm text-red-600">{message}</p>}<div className="flex gap-3 pt-4"><button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"><Users className="w-4 h-4 mr-2" />{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Pass"}</button><button type="button" onClick={() => setActiveModal(null)} className="py-2 border rounded-lg px-4">Cancel</button></div></form></Modal>
            </div>
        </div>
    );
};

export default HostelDashboard;