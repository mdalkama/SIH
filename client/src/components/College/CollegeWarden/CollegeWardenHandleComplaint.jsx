import React, { useState, useEffect, useMemo } from 'react';
import { Clock, CheckCircle, AlertTriangle, Loader2, Wrench, MapPin, Calendar, User, MessageSquare, Repeat, Users, Check, X, ChevronDown } from 'lucide-react';

// --- Helper Components (Unchanged) ---

const LoadingState = () => (
    <div className="p-10 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
        <p className="mt-2 text-sm text-slate-500">Loading requests...</p>
    </div>
);

const EmptyState = ({ icon: Icon, title, message }) => (
    <div className="text-center py-16 px-6 col-span-full">
        <Icon className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-medium text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
);


const CollegeWardenRequestManagement = () => {
    const [activeTab, setActiveTab] = useState('complaints');
    
    // State for each data type
    const [complaints, setComplaints] = useState([]);
    const [roomChangeRequests, setRoomChangeRequests] = useState([]);
    const [visitorPasses, setVisitorPasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const fetchData = async () => {
        if (!complaints.length) setLoading(true); 
        setError(null);
        try {
            const [complaintsRes, roomChangesRes, visitorsRes] = await Promise.all([
                fetch('https://sih-4ptm.onrender.com/api/v1/hostel/warden/complaints', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/hostel/warden/room-changes', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/hostel/warden/visitors', { credentials: 'include' })
            ]);

            const complaintsData = await complaintsRes.json();
            const roomChangesData = await roomChangesRes.json();
            const visitorsData = await visitorsRes.json();

            if (complaintsData.success) setComplaints(complaintsData.data || []);
            if (roomChangesData.success) setRoomChangeRequests(roomChangesData.data || []);
            if (visitorsData.success) setVisitorPasses(visitorsData.data || []);

        } catch (err) {
            setError('Failed to fetch some data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdownId && !event.target.closest('.action-dropdown-container')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);

    const handleUpdateComplaintStatus = async (studentHostelId, complaintId, status) => {
        setUpdatingId(complaintId);
        setOpenDropdownId(null);
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/complaints/${studentHostelId}/${complaintId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status }) });
            if (!res.ok) throw new Error('Failed to update status.');
            await fetchData();
        } catch (err) { alert(`Error: ${err.message}`); }
        finally { setUpdatingId(null); }
    };
    
    const handleUpdateRoomChangeStatus = async (studentHostelId, requestId, status) => {
        setUpdatingId(requestId);
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/room-changes/${studentHostelId}/${requestId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status }) });
            if (!res.ok) throw new Error('Failed to update status.');
            await fetchData();
        } catch (err) { alert(`Error: ${err.message}`); }
        finally { setUpdatingId(null); }
    };

    const tabs = [
        { id: 'complaints', label: 'Complaints', icon: MessageSquare, count: complaints.filter(c => c.status !== 'Resolved').length },
        { id: 'roomChanges', label: 'Room Changes', icon: Repeat, count: roomChangeRequests.filter(r => r.status === 'Pending').length },
        { id: 'visitors', label: 'Visitor Passes', icon: Users, count: visitorPasses.length }
    ];

    // --- RENDER FUNCTIONS FOR EACH TAB ---

    const renderContent = () => {
        if (loading) return <LoadingState />;

        switch (activeTab) {
            case 'complaints':
                if (complaints.length === 0) return <EmptyState icon={CheckCircle} title="All Clear!" message="No student complaints to show." />;
                return complaints.map(c => {
                    const statusInfo = { 'Resolved': { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-50 text-green-700' }, 'In Progress': { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-50 text-yellow-700' }, 'Open': { icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700' } }[c.status];
                    const priorityColor = { 'High': 'text-red-600', 'Medium': 'text-orange-600', 'Low': 'text-slate-500' }[c.priority];
                    return (
                        <div key={c._id} className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        <span className="ml-1.5">{c.status}</span>
                                    </span>
                                    <h3 className="text-lg font-semibold text-slate-800 mt-2">{c.title}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{c.description}</p>
                                </div>
                                <div className="action-dropdown-container relative flex-shrink-0">
                                    {updatingId === c._id ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : c.status !== 'Resolved' && (<button onClick={() => setOpenDropdownId(openDropdownId === c._id ? null : c._id)} className="inline-flex items-center justify-center p-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200">Actions <ChevronDown className="w-4 h-4 ml-2" /></button>)}
                                    {openDropdownId === c._id && (<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"><div className="py-1">{['Open', 'In Progress', 'Resolved'].map(s => (<button key={s} onClick={() => handleUpdateComplaintStatus(c.studentHostelId, c._id, s)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Mark as {s}</button>))}</div></div>)}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                                <span className="font-semibold text-xs uppercase tracking-wider" style={{ color: priorityColor.replace('text-', '') }}>{c.priority} Priority</span>
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1.5" />{c.hostelDetail.hostelName}, Room {c.hostelDetail.roomNumber}</span>
                                <span className="flex items-center"><Wrench className="w-3 h-3 mr-1.5" />{c.issue}</span>
                                <span className="flex items-center"><User className="w-3 h-3 mr-1.5" />{c.registrationNumber}</span>
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" />{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    );
                });

            case 'roomChanges':
                const pendingRequests = roomChangeRequests.filter(r => r.status === 'Pending');
                if (pendingRequests.length === 0) return <EmptyState icon={Repeat} title="No Pending Requests" message="There are no active room change requests." />;
                return pendingRequests.map(req => {
                    const isUpdating = updatingId === req._id;
                    return (
                        <div key={req._id} className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Room Change Request</h3>
                                    <p className="text-sm text-slate-500">From student: {req.registrationNumber}</p>
                                    <blockquote className="mt-2 text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3">"{req.reason}"</blockquote>
                                </div>
                                <div className="flex-shrink-0 flex gap-2">
                                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : <>
                                        <button onClick={() => handleUpdateRoomChangeStatus(req.studentHostelId, req._id, 'Rejected')} className="px-3 py-1.5 text-xs font-medium border border-slate-300 text-slate-700 bg-white rounded-md hover:bg-slate-50"><X className="w-3 h-3 inline mr-1" />Reject</button>
                                        <button onClick={() => handleUpdateRoomChangeStatus(req.studentHostelId, req._id, 'Approved')} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"><Check className="w-3 h-3 inline mr-1" />Approve</button>
                                    </>}
                                </div>
                            </div>
                             <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" />Requested on {new Date(req.requestedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    );
                });

            case 'visitors':
                if (visitorPasses.length === 0) return <EmptyState icon={Users} title="No Visitor Passes" message="No visitor passes have been generated recently." />;
                return visitorPasses.map(pass => (
                     <div key={pass._id} className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">{pass.visitorName} <span className="text-sm font-normal text-slate-500">({pass.relation || 'N/A'})</span></h3>
                                <p className="text-sm text-slate-500">Visiting Student: {pass.studentRegNo}</p>
                                {pass.purpose && <p className="text-sm text-slate-700 mt-2 italic border-l-2 border-slate-300 pl-3">"{pass.purpose}"</p>}
                            </div>
                            <div className="flex-shrink-0 text-right">
                                 <p className="text-xs text-slate-400">{new Date(pass.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                ));
            default: return null;
        }
    };

    return (
        <div className="min-h-screen">
            <div className="">
                
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-slate-900">Warden Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-600">Manage all student requests and issues from one place.</p>
                    </div>
                    <div className="border-t border-slate-200 px-2 sm:px-4">
                        <nav className="flex space-x-1" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`group inline-flex items-center py-3 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                                    <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                                    {tab.label}
                                    {tab.count > 0 && <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-200 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>{tab.count}</span>}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">{error}</div>}

                <div className="space-y-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default CollegeWardenRequestManagement;