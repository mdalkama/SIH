import React, { useState, useEffect } from 'react';
import { Plus, Building, MapPin, Users, Bed, ArrowRight, ArrowLeft, UserCheck, UserX, ArrowUpDown, Home, AlertCircle, CheckCircle, Pencil, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import ShiftStudentForm from './components/ShiftStudentForm';
import AddHostelForm from './components/AddHostelForm';
import AddFloorForm from './components/AddFloorForm';
import AddRoomForm from './components/AddRoomForm';
import AddBedForm from './components/AddBedForm';
import AllocateBedForm from './components/AllocateBedForm';
import VacateBedForm from './components/VacateBedForm';

// --- HELPER COMPONENTS ---

const ToastNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => { onClose(); }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
    const textColor = isError ? 'text-red-800' : 'text-green-800';
    const Icon = isError ? AlertCircle : CheckCircle;
    return (
        <div className={`fixed top-5 right-5 z-[100] flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg ${bgColor} ${textColor}`} role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"><Icon className="w-5 h-5" /></div>
            <div className="ml-3 text-sm font-medium">{message}</div>
            <button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-white/20" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
    );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType, itemName, isDeleting }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6"><div className="flex items-start"><div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" /></div><div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 className="text-lg leading-6 font-medium text-gray-900">Delete {itemType}</h3><div className="mt-2"><p className="text-sm text-gray-500">Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.</p></div></div></div></div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg"><button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</button><button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm" onClick={onClose} disabled={isDeleting}>Cancel</button></div>
            </div>
        </div>
    );
};

const EditModal = ({ isOpen, onClose, onSuccess, item, showToast }) => {
    if (!isOpen || !item) return null;
    const { type, data, context } = item;
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => { if (data) { setFormData({ floorNumber: data.floorNumber || '', roomNumber: data.roomNumber || '', roomType: data.roomType || '', bedNumber: data.bedNumber || '' }); } }, [data]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const getApiEndpoint = () => { const BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/hostel'; switch (type) { case 'floor': return `${BASE_URL}/${context.hostelId}/floors/${data._id}`; case 'room': return `${BASE_URL}/${context.hostelId}/floors/${context.floorId}/rooms/${data._id}`; case 'bed': return `${BASE_URL}/${context.hostelId}/floors/${context.floorId}/rooms/${context.roomId}/beds/${data._id}`; default: return ''; } };
    const getPayload = () => { switch (type) { case 'floor': return { floorNumber: formData.floorNumber }; case 'room': return { roomNumber: formData.roomNumber, roomType: formData.roomType }; case 'bed': return { bedNumber: formData.bedNumber }; default: return {}; } }
    const handleSubmit = async (e) => { e.preventDefault(); setIsSaving(true); try { const res = await fetch(getApiEndpoint(), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(getPayload()), }); const result = await res.json(); if (result.success) { showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`); onSuccess(); onClose(); } else { showToast(`Error: ${result.error || 'Failed to update.'}`, 'error'); } } catch (err) { console.error("Update error:", err); showToast("An unexpected error occurred.", 'error'); } finally { setIsSaving(false); } };
    const renderFormFields = () => { switch (type) { case 'floor': return (<div><label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700">Floor Number</label><input type="number" name="floorNumber" id="floorNumber" value={formData.floorNumber} onChange={handleChange} className="mt-1 p-3 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" /></div>); case 'room': return (<><div><label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label><input type="text" name="roomNumber" id="roomNumber" value={formData.roomNumber} onChange={handleChange} className="mt-1 block w-full rounded-md p-3 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" /></div><div className="mt-4"><label htmlFor="roomType" className="block text-sm font-medium text-gray-700">Room Type</label><input type="text" name="roomType" id="roomType" value={formData.roomType} onChange={handleChange} className="mt-1 block w-full rounded-md p-3 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="e.g., Standard, AC" /></div></>); case 'bed': return (<div><label htmlFor="bedNumber" className="block text-sm font-medium text-gray-700">Bed Number</label><input type="text" name="bedNumber" id="bedNumber" value={formData.bedNumber} onChange={handleChange} className="mt-1 block w-full p-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" /></div>); default: return null; } };
    return (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-medium text-gray-900">Edit {type}</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button></div><form onSubmit={handleSubmit}><div className="p-6">{renderFormFields()}</div><div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button><button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button></div></form></div></div>);
};

const EmptyState = ({ icon: Icon, title, message, actionText, onActionClick }) => (
    <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{message}</p>
        {actionText && onActionClick && (
            <button
                onClick={onActionClick}
                className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus className="w-4 h-4 mr-2" />
                {actionText}
            </button>
        )}
    </div>
);

// --- NEW SKELETON COMPONENTS ---
const HostelCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const FloorCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                <div>
                    <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

const RoomCardSkeleton = () => (
     <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                    <div className="h-5 bg-gray-200 rounded w-28 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
             <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

const HostelManagementSystem = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading on initial mount
    const BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

    const fetchHostels = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/hostel`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if (data.success) {
                setHostels(data.data);
            } else {
                console.error("Failed to fetch hostels:", data.error);
            }
        } catch (err) {
            console.error("Error fetching hostels:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    const tabs = [ { id: 'dashboard', label: 'Dashboard', icon: Building }, { id: 'add-hostel', label: 'Add Hostel', icon: Plus }, { id: 'add-floor', label: 'Add Floor', icon: Plus }, { id: 'add-room', label: 'Add Room', icon: Plus }, { id: 'add-bed', label: 'Add Bed', icon: Bed }, { id: 'allocate', label: 'Allocate', icon: UserCheck }, { id: 'vacate', label: 'Vacate', icon: UserX }, { id: 'shift', label: 'Shift Student', icon: ArrowUpDown }];
    
    const renderTabContent = () => {
        // Main loading state for the whole page
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <HostelCardSkeleton />
                    <HostelCardSkeleton />
                    <HostelCardSkeleton />
                </div>
            );
        }
        
        switch (activeTab) {
            case 'dashboard':
                return <HostelDashboard hostels={hostels} onSelectHostel={setSelectedHostel} selectedHostel={selectedHostel} selectedFloor={selectedFloor} selectedRoom={selectedRoom} onSelectFloor={setSelectedFloor} onSelectRoom={setSelectedRoom} onBack={() => { if (selectedRoom) setSelectedRoom(null); else if (selectedFloor) setSelectedFloor(null); else setSelectedHostel(null); }} onSwitchTab={setActiveTab} />;
            case 'add-hostel': return <AddHostelForm onSuccess={fetchHostels} />;
            case 'add-floor': return <AddFloorForm hostels={hostels} onSuccess={fetchHostels} />;
            case 'add-room': return <AddRoomForm hostels={hostels} />;
            case 'add-bed': return <AddBedForm hostels={hostels} />;
            case 'allocate': return <AllocateBedForm hostels={hostels} />;
            case 'vacate': return <VacateBedForm hostels={hostels} />;
            case 'shift': return <ShiftStudentForm hostels={hostels} />;
            default: return <HostelDashboard hostels={hostels} onSelectHostel={setSelectedHostel} onSwitchTab={setActiveTab} />;
        }
    };
    
    return (
        <div className=""><div className="max-w-7xl mx-auto"><div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex overflow-x-auto">{tabs.map((tab) => { const Icon = tab.icon; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><Icon className="w-4 h-4 mr-2" />{tab.label}</button>); })}</div></div><div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">{renderTabContent()}</div></div></div>
    );
};

const HostelDashboard = ({ hostels, onSelectHostel, selectedHostel, selectedFloor, selectedRoom, onSelectFloor, onSelectRoom, onBack, onSwitchTab }) => {
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/hostel';

    const fetchFloors = async (hostelId) => { setLoading(true); try { const res = await fetch(`${BASE_URL}/${hostelId}/floors`, { credentials: "include" }); const data = await res.json(); if (data.success) setFloors(data.data); } catch (error) { console.error("Error fetching floors:", error); } finally { setLoading(false); } };
    const fetchRooms = async (hostelId, floorId) => { setLoading(true); try { const res = await fetch(`${BASE_URL}/${hostelId}/floors/${floorId}/rooms`, { credentials: "include" }); const data = await res.json(); if (data.success) setRooms(data.data); } catch (error) { console.error("Error fetching rooms:", error); } finally { setLoading(false); } };
    const fetchBeds = async (hostelId, floorId, roomId) => { setLoading(true); try { const res = await fetch(`${BASE_URL}/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`, { credentials: "include" }); const data = await res.json(); if (data.success) setBeds(data.data); } catch (error) { console.error("Error fetching beds:", error); } finally { setLoading(false); } };
    useEffect(() => { if (selectedHostel && !selectedFloor) fetchFloors(selectedHostel._id); if (selectedHostel && selectedFloor && !selectedRoom) fetchRooms(selectedHostel._id, selectedFloor._id); if (selectedHostel && selectedFloor && selectedRoom) fetchBeds(selectedHostel._id, selectedFloor._id, selectedRoom._id); }, [selectedHostel, selectedFloor, selectedRoom]);
    const showToast = (message, type = 'success') => { setToast({ message, type }); };
    const handleOpenEditModal = (item) => { setSelectedItem(item); setIsEditModalOpen(true); };
    const handleOpenDeleteModal = (item) => { setSelectedItem(item); setIsDeleteModalOpen(true); };
    const handleDeleteConfirm = async () => {
        if (!selectedItem) return;
        setIsDeleting(true);
        const { type, data, context } = selectedItem;
        if (type === 'floor' && data.totalRooms > 0) { showToast('Cannot delete a floor that contains rooms.', 'error'); setIsDeleting(false); setIsDeleteModalOpen(false); return; }
        if (type === 'room' && data.totalBeds > 0) { showToast('Cannot delete a room that contains beds.', 'error'); setIsDeleting(false); setIsDeleteModalOpen(false); return; }
        if (type === 'bed' && data.isOccupied) { showToast('Cannot delete an occupied bed.', 'error'); setIsDeleting(false); setIsDeleteModalOpen(false); return; }
        let url, refreshCallback, refreshArgs;
        switch (type) {
            case 'floor': url = `${BASE_URL}/${context.hostelId}/floors/${data._id}`; refreshCallback = fetchFloors; refreshArgs = [context.hostelId]; break;
            case 'room': url = `${BASE_URL}/${context.hostelId}/floors/${context.floorId}/rooms/${data._id}`; refreshCallback = fetchRooms; refreshArgs = [context.hostelId, context.floorId]; break;
            case 'bed': url = `${BASE_URL}/${context.hostelId}/floors/${context.floorId}/rooms/${context.roomId}/beds/${data._id}`; refreshCallback = fetchBeds; refreshArgs = [context.hostelId, context.floorId, context.roomId]; break;
            default: setIsDeleting(false); return;
        }
        try { const res = await fetch(url, { method: 'DELETE', credentials: 'include' }); const result = await res.json(); if (result.success) { showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`); refreshCallback(...refreshArgs); } else { showToast(`Error: ${result.error || `Failed to delete.`}`, 'error'); } } catch (err) { console.error("Delete error:", err); showToast(`An unexpected error occurred.`, 'error'); }
        finally { setIsDeleting(false); setIsDeleteModalOpen(false); }
    };

    return (
        <>
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <EditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} item={selectedItem} showToast={showToast} onSuccess={() => { const { type, context } = selectedItem; if (type === 'floor') fetchFloors(context.hostelId); if (type === 'room') fetchRooms(context.hostelId, context.floorId); if (type === 'bed') fetchBeds(context.hostelId, context.floorId, context.roomId); }} />
            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} itemType={selectedItem?.type} itemName={`${selectedItem?.type || ''} ${selectedItem?.data?.floorNumber || selectedItem?.data?.roomNumber || selectedItem?.data?.bedNumber || ''}`} isDeleting={isDeleting} />

            {(() => {
                if (selectedHostel && selectedFloor && selectedRoom) {
                    return (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"><div className="flex items-center"><button onClick={onBack} className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 mr-4 font-medium"><ArrowLeft className="w-4 h-4 mr-1" /> Back</button><h2 className="text-lg sm:text-xl font-semibold text-gray-900">Beds in Room {selectedRoom.roomNumber}</h2></div></div>
                            {loading ? (<div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
                            ) : beds.length === 0 ? (
                                <EmptyState icon={Bed} title="No Beds Found" message="This room currently has no beds." actionText="Add New Bed" onActionClick={() => onSwitchTab('add-bed')} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {beds.map((bed) => (
                                        <div key={bed._id} className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
                                            {!bed.isOccupied && (<div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); handleOpenEditModal({ type: 'bed', data: bed, context: { hostelId: selectedHostel._id, floorId: selectedFloor._id, roomId: selectedRoom._id } }); }} className="p-1.5 bg-gray-100 rounded-full hover:bg-blue-100 text-blue-600"><Pencil className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal({ type: 'bed', data: bed, context: { hostelId: selectedHostel._id, floorId: selectedFloor._id, roomId: selectedRoom._id } }); }} className="p-1.5 bg-gray-100 rounded-full hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button></div>)}
                                            <div className="flex items-center justify-between mb-2"><h3 className="text-lg font-medium text-gray-900">Bed {bed.bedNumber}</h3><span className={`px-2 py-1 text-xs font-medium rounded-full ${bed.isOccupied ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{bed.isOccupied ? 'Occupied' : 'Vacant'}</span></div>
                                            {bed.isOccupied && bed.student && (<div className="mt-2 pt-2 border-t border-gray-200"><p className="text-sm text-gray-800 font-medium"><span className="font-normal text-gray-500">Occupant:</span> {bed.student.name}</p><p className="text-xs text-gray-500 mt-1"><span className="font-normal">Reg. No:</span> {bed.student.registrationNumber}</p></div>)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                if (selectedHostel && selectedFloor) {
                    const getRoomOccupancyColor = (rate) => rate === 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : rate <= 50 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : rate < 100 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-red-600 bg-red-50 border-red-200';
                    const getStatusIcon = (rate) => rate === 0 ? <CheckCircle className="w-4 h-4" /> : rate < 100 ? <AlertCircle className="w-4 h-4" /> : <Users className="w-4 h-4" />;
                    return (
                        <div>
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6 lg:gap-4"><div className="flex flex-col sm:flex-row items-start sm:items-center w-full lg:w-auto"><button onClick={onBack} className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 mb-3 sm:mb-0 sm:mr-6 font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Floors</button><div className="text-center sm:text-left"><h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Floor {selectedFloor?.floorNumber || '1'} Rooms</h1><p className="text-gray-600">{rooms.length} rooms available</p></div></div><div className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 flex items-center justify-around sm:justify-start space-x-2 sm:space-x-4 w-full lg:w-auto"><div className="text-center"><p className="text-lg sm:text-xl font-bold text-blue-600">{rooms.reduce((s, r) => s + r.totalBeds, 0)}</p><p className="text-xs text-gray-500">Total Beds</p></div><div className="text-center"><p className="text-lg sm:text-xl font-bold text-red-500">{rooms.reduce((s, r) => s + r.allocatedBeds, 0)}</p><p className="text-xs text-gray-500">Occupied</p></div><div className="text-center"><p className="text-lg sm:text-xl font-bold text-green-500">{rooms.reduce((s, r) => s + r.vacantBeds, 0)}</p><p className="text-xs text-gray-500">Available</p></div></div></div>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"><RoomCardSkeleton /><RoomCardSkeleton /><RoomCardSkeleton /></div>
                            ) : rooms.length === 0 ? (
                                <EmptyState icon={Home} title="No Rooms Found" message="This floor has no rooms yet. You can add one." actionText="Add New Room" onActionClick={() => onSwitchTab('add-room')} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                    {rooms.map((room) => {
                                        const rate = room.totalBeds > 0 ? (room.allocatedBeds / room.totalBeds) * 100 : 0;
                                        const colorClass = getRoomOccupancyColor(rate);
                                        return (
                                            <div key={room._id} onClick={() => onSelectRoom(room)} className="relative group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                                                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"><button onClick={(e) => { e.stopPropagation(); handleOpenEditModal({ type: 'room', data: room, context: { hostelId: selectedHostel._id, floorId: selectedFloor._id } }); }} className="p-1.5 bg-white rounded-full shadow-md hover:bg-blue-100 text-blue-600"><Pencil className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal({ type: 'room', data: room, context: { hostelId: selectedHostel._id, floorId: selectedFloor._id } }); }} className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button></div>
                                                <div className="p-5"><div className="flex items-center justify-between mb-3"><div className="flex items-center space-x-2"><div className="p-2 bg-blue-100 rounded-lg"><Home className="w-5 h-5 text-blue-600" /></div><div><h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Room {room.roomNumber}</h3><p className="text-sm text-gray-500">{room.roomType || 'Standard'}</p></div></div><ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" /></div><div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass} mb-4`}>{getStatusIcon(rate)}<span className="ml-2">{rate === 0 ? 'Available' : rate === 100 ? 'Full' : `${Math.round(rate)}% Occupied`}</span></div><div className="grid grid-cols-3 gap-3"><div className="text-center p-3 bg-gray-50 rounded-lg"><Bed className="w-4 h-4 text-gray-600 mx-auto mb-1" /><p className="font-bold">{room.totalBeds}</p><p className="text-xs text-gray-500">Total</p></div><div className="text-center p-3 bg-red-50 rounded-lg"><Users className="w-4 h-4 text-red-600 mx-auto mb-1" /><p className="font-bold text-red-600">{room.allocatedBeds}</p><p className="text-xs text-red-500">Occupied</p></div><div className="text-center p-3 bg-green-50 rounded-lg"><CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" /><p className="font-bold text-green-600">{room.vacantBeds}</p><p className="text-xs text-green-500">Vacant</p></div></div></div><div className="px-5 pb-5"><div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${rate === 0 ? 'bg-green-500' : rate <= 50 ? 'bg-yellow-500' : rate < 100 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${rate}%` }}></div></div></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }
                
                if (selectedHostel) {
                    return (
                        <div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-2"><button onClick={onBack} className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all sm:mr-6 font-medium"><ArrowLeft className="w-5 h-5 mr-2" /> Back to Hostels</button><div className="text-left sm:text-right"><h1 className="text-xl md:text-2xl font-bold text-gray-900">{selectedHostel.name}</h1><p className="text-gray-600 mt-1">Floor Management</p></div></div>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"><FloorCardSkeleton /><FloorCardSkeleton /><FloorCardSkeleton /></div>
                            ) : floors.length === 0 ? (
                                <EmptyState icon={Building} title="No Floors Found" message="This hostel has no floors. Start by adding one." actionText="Add New Floor" onActionClick={() => onSwitchTab('add-floor')} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {floors.map((floor) => {
                                        const rate = floor?.totalBeds ? Math.round(((floor.allocatedBeds || 0) / floor.totalBeds) * 100) : 0;
                                        return (
                                            <div key={floor._id} onClick={() => onSelectFloor(floor)} className="relative group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                                                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"><button onClick={(e) => { e.stopPropagation(); handleOpenEditModal({ type: 'floor', data: floor, context: { hostelId: selectedHostel._id } }); }} className="p-1.5 bg-white rounded-full shadow-md hover:bg-blue-100 text-blue-600"><Pencil className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal({ type: 'floor', data: floor, context: { hostelId: selectedHostel._id } }); }} className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button></div>
                                                <div className="p-5 md:p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"><span className="text-blue-600 font-bold text-lg">{floor.floorNumber}</span></div><div><h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600">Floor {floor.floorNumber}</h3><p className="text-sm text-gray-500">{rate}% occupied</p></div></div><ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" /></div><div className="mb-4"><div className="flex justify-between text-xs text-gray-500 mb-2"><span>Occupancy</span><span>{rate}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: `${rate}%` }}></div></div></div><div className="grid grid-cols-2 gap-4"><div className="text-center p-3 bg-gray-50 rounded-lg"><div className="font-bold">{floor.totalRooms}</div><div className="text-xs text-gray-500">Rooms</div></div><div className="text-center p-3 bg-gray-50 rounded-lg"><div className="font-bold">{floor.totalBeds}</div><div className="text-xs text-gray-500">Total Beds</div></div><div className="text-center p-3 bg-red-50 rounded-lg"><div className="font-bold text-red-600">{floor.allocatedBeds}</div><div className="text-xs text-red-500">Occupied</div></div><div className="text-center p-3 bg-green-50 rounded-lg"><div className="font-bold text-green-600">{floor.vacantBeds}</div><div className="text-xs text-green-500">Vacant</div></div></div></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }
                
                // Main Hostel List View
                const getOccupancyRate = (allocated, total) => total === 0 ? 0 : Math.round((allocated / total) * 100);
                const formatAddress = (address) => [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', ');
                return (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Hostels</h2>
                        {hostels.length === 0 ? (
                            <EmptyState icon={Building} title="No Hostels Found" message="Get started by adding a new hostel from the tabs above." actionText="Add New Hostel" onActionClick={() => onSwitchTab('add-hostel')} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {hostels.map((hostel) => {
                                    const rate = getOccupancyRate(hostel.allocatedBeds, hostel.totalBeds);
                                    return (
                                        <div key={hostel._id} onClick={() => onSelectHostel(hostel)} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                            <div className="flex items-start justify-between mb-4"><div><h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{hostel.name}</h3><div className="flex items-start text-sm text-gray-600"><MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" /><span className="leading-relaxed">{formatAddress(hostel.address)}</span></div></div><ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" /></div>
                                            <div className="grid grid-cols-2 gap-4 mb-4"><div className="bg-gray-50 rounded-lg p-3"><div className="flex items-center mb-1"><Building className="w-4 h-4 text-gray-500 mr-1" /><span className="text-xs text-gray-500 uppercase tracking-wide">Floors</span></div><span className="text-lg font-bold text-gray-900">{hostel.totalFloors}</span></div><div className="bg-gray-50 rounded-lg p-3"><div className="flex items-center mb-1"><Users className="w-4 h-4 text-gray-500 mr-1" /><span className="text-xs text-gray-500 uppercase tracking-wide">Rooms</span></div><span className="text-lg font-bold text-gray-900">{hostel.totalRooms}</span></div></div>
                                            <div className="space-y-3"><div className="flex justify-between"><div className="flex items-center"><Bed className="w-4 h-4 text-gray-500 mr-2" /><span className="text-sm text-gray-600">Total Beds</span></div><span className="font-semibold text-gray-900">{hostel.totalBeds}</span></div><div className="flex justify-between"><span className="text-sm text-gray-600">Allocated</span><span className="font-semibold text-gray-900">{hostel.allocatedBeds}</span></div><div className="flex justify-between"><span className="text-sm text-gray-600">Vacant</span><span className="font-semibold text-green-600">{hostel.vacantBeds}</span></div>
                                                {hostel.totalBeds > 0 && (<div className="pt-2 border-t border-gray-100"><div className="flex justify-between mb-2"><span className="text-sm text-gray-600">Occupancy</span><span className={`text-sm font-semibold px-2 py-1 rounded-full ${rate >= 90 ? 'bg-red-50 text-red-500' : rate >= 70 ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>{rate}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${rate >= 90 ? 'bg-red-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${rate}%` }}></div></div></div>)}
                                            </div>
                                            {hostel.collegeCode && (<div className="absolute top-3 right-12 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{hostel.collegeCode}</div>)}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })()}
        </>
    );
};

export default HostelManagementSystem;