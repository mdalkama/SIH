import React, { useState, useEffect } from 'react';
import {
  Home, User, Phone, MapPin, Plus, Send, Clock,
  CheckCircle, AlertTriangle, Loader2, Repeat,
  Users, X
} from 'lucide-react';

// --- Helper Components ---
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

const AllocationSkeleton = () =>
  <div className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse"></div>;
const ComplaintCardSkeleton = () =>
  <div className="border border-gray-200 rounded-lg p-4 h-32 animate-pulse bg-gray-50"></div>;

// Simple Modal
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Complaint List with Pagination ---
const ComplaintList = ({ complaints }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(complaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComplaints = complaints.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };

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

  return (
    <div>
      <div className="space-y-4">
        {currentComplaints.length > 0 ? currentComplaints.map((comp) => (
          <div key={comp._id} className="border border-blue-200 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="mr-2">{getStatusIcon(comp.status)}</div>
                <h3 className="font-medium">{comp.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(comp.priority)}`}>{comp.priority}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2 pl-6">{comp.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 pl-6">
              <span>{comp.issue} • Room {comp.hostelDetail.roomNumber}</span>
              <span>{new Date(comp.createdAt).toLocaleDateString()} • {comp.status}</span>
            </div>
          </div>
        )) : <p className="text-center py-4 text-gray-500">No complaints yet.</p>}
      </div>

      {complaints.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-500  rounded disabled:opacity-50">Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-500  rounded disabled:opacity-50">Next</button>
          </div>
          <div>
            <label className="mr-2 text-sm">Per page:</label>
            <select value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-500 rounded px-2 py-1">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const HostelDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [complaint, setComplaint] = useState({ issue: '', priority: 'Medium', title: '', description: '' });
  const [roomChangeReason, setRoomChangeReason] = useState('');
  const [visitor, setVisitor] = useState({ name: '', relation: '', purpose: '' });
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
      if (allocationRes.status === 404) { setAllocationDetails(null); }
      else if (!allocationRes.ok) { const err = await allocationRes.json(); throw new Error(err.message || 'Failed allocation.'); }
      else { const d = await allocationRes.json(); if (d.success) setAllocationDetails(d.data); }

      if (!complaintsRes.ok) { const err = await complaintsRes.json(); throw new Error(err.message || 'Failed complaints.'); }
      const complaintsData = await complaintsRes.json();
      if (complaintsData.success) setComplaints(complaintsData.data);

    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- API handlers ---
  const handleComplaintSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true); setMessage('');
    try {
      const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/complaints/raise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(complaint),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
    //   setMessage('Complaint raised successfully!');
      await fetchData();
      setActiveModal(null);
      setComplaint({ issue: '', priority: 'Medium', title: '', description: '' });
    } catch (err) { setMessage(err.message); }
    finally { setIsSubmitting(false); }
  };

  const handleRoomChangeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setMessage('');
    try {
      const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/room-change-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ reason: roomChangeReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit request.');
      setMessage(data.message);
      await fetchData();
      setActiveModal(null);
      setRoomChangeReason('');
    } catch (err) { setMessage(err.message); }
    finally { setIsSubmitting(false); }
  };

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setMessage('');
    try {
      const res = await fetch('https://sih-4ptm.onrender.com/api/v1/student-hostel/visitor-pass', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(visitor),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit request.');
      setMessage(data.message);
      await fetchData();
      setActiveModal(null);
      setVisitor({ name: '', relation: '', purpose: '' });
    } catch (err) { setMessage(err.message); }
    finally { setIsSubmitting(false); }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6"><AllocationSkeleton /><div className="bg-white rounded-xl p-6"><ComplaintCardSkeleton /></div></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Hostel Dashboard</h1>
          <p className="text-gray-600">Welcome, {allocationDetails?.name || 'Student'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {allocationDetails ? (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4"><Home className="w-6 h-6 text-blue-600 mr-2" /><h2 className="text-xl font-semibold">Your Allocation Details</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4"><DetailItem icon={User} label={allocationDetails.name} value={`Roll No: ${allocationDetails.rollNumber}`} /><DetailItem icon={MapPin} label={allocationDetails.hostelName} value={`Floor ${allocationDetails.floorNumber}, Room ${allocationDetails.roomNumber}`} subValue={allocationDetails.roomType} /></div>
                  <div className="space-y-4"><DetailItem icon={Phone} label={`Warden: ${allocationDetails.warden}`} value={allocationDetails.wardenContact} /><DetailItem icon={Clock} label="Check-in Date" value={new Date(allocationDetails.checkInDate).toLocaleDateString()} /></div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
                <Home size={40} className="mx-auto text-gray-400 mb-3"/><h3 className="font-semibold text-lg">No Hostel Allocated</h3><p className="text-gray-500">You are not currently allocated to any hostel room.</p>
              </div>
            )}

            {/* Complaints section with pagination */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Complaints</h2>
                {allocationDetails && (
                  <button onClick={() => setActiveModal('complaint')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2"/>Raise Complaint</button>
                )}
              </div>
              <ComplaintList complaints={complaints} />
            </div>
          </div>

          {/* Sidebar quick actions & contacts */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => setActiveModal('roomChange')} className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50">
                  <p className="font-medium">Room Change Request</p><p className="text-sm text-gray-500">Apply for a room change</p></button>
                <button onClick={() => setActiveModal('visitor')} className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50">
                  <p className="font-medium">Visitor Pass</p><p className="text-sm text-gray-500">Generate a pass for visitors</p></button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
              <div className="space-y-3"><div><p className="font-medium">Security</p><p className="text-sm text-gray-600">+91-9876543211</p></div>
                <div><p className="font-medium">Maintenance</p><p className="text-sm text-gray-600">+91-9876543213</p></div></div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal isOpen={activeModal === 'complaint'} onClose={() => setActiveModal(null)} title="Raise a Complaint">
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Issue Category *</label>
              <select value={complaint.issue}
                onChange={(e) => setComplaint({ ...complaint, issue: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white" required>
                <option value="" disabled>Select category</option>
                {issueCategories.map(c => (<option key={c} value={c}>{c}</option>))}
              </select></div>
            <div><label className="block text-sm font-medium mb-1">Priority</label>
              <select value={complaint.priority}
                onChange={(e) => setComplaint({ ...complaint, priority: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white">
                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Title *</label>
              <input type="text" value={complaint.title}
                onChange={(e) => setComplaint({ ...complaint, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required /></div>
            <div><label className="block text-sm font-medium mb-1">Description *</label>
              <textarea value={complaint.description}
                onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                rows={4} className="w-full border rounded-lg px-3 py-2" required /></div>
            {message && <p className="text-sm text-red-600">{message}</p>}
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                <Send className="w-4 h-4 mr-2" />{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}</button>
              <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={activeModal === 'roomChange'} onClose={() => setActiveModal(null)} title="Request Room Change">
          <form onSubmit={handleRoomChangeSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Reason *</label>
              <textarea value={roomChangeReason} onChange={(e) => setRoomChangeReason(e.target.value)}
                rows={5} className="w-full border rounded-lg p-2" required /></div>
            {message && <p className="text-sm text-red-600">{message}</p>}
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={isSubmitting}
                className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                <Repeat className="w-4 h-4 mr-2"/>{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Submit Request"}</button>
              <button type="button" onClick={() => setActiveModal(null)} className="py-2 border rounded-lg px-4">Cancel</button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={activeModal === 'visitor'} onClose={() => setActiveModal(null)} title="Generate Visitor Pass">
          <form onSubmit={handleVisitorSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Visitor's Name *</label>
              <input type="text" value={visitor.name} onChange={(e) => setVisitor({...visitor, name: e.target.value})}
                className="w-full border rounded-lg p-2" required/></div>
            <div><label className="block text-sm font-medium mb-1">Relation</label>
              <input type="text" value={visitor.relation} onChange={(e) => setVisitor({...visitor, relation: e.target.value})}
                className="w-full border rounded-lg p-2"/></div>
            <div><label className="block text-sm font-medium mb-1">Purpose</label>
              <textarea value={visitor.purpose} onChange={(e) => setVisitor({...visitor, purpose: e.target.value})}
                rows={3} className="w-full border rounded-lg p-2"/></div>
            {message && <p className="text-sm text-red-600">{message}</p>}
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={isSubmitting}
                className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                <Users className="w-4 h-4 mr-2"/>{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Generate Pass"}</button>
              <button type="button" onClick={() => setActiveModal(null)} className="py-2 border rounded-lg px-4">Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default HostelDashboard;