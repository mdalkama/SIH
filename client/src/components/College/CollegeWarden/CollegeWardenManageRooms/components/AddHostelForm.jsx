import React, { useState, useEffect } from 'react';
import { Edit3, Bed, Trash2, MapPin, Building, Users, AlertCircle, Check, X, Plus, Home, Loader2, AlertTriangle } from 'lucide-react';

// HELPER COMPONENT 1: Simple Modal (No Animation)
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- NEW SKELETON COMPONENT ---
const HostelCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
        </div>
    </div>
);

// HELPER COMPONENT 3: Empty State UI
const EmptyState = ({ onAddClick }) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
            <Home className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">No Hostels Found</h3>
        <p className="text-gray-500 mt-2 mb-6">Get started by adding your first hostel.</p>
        <button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 mx-auto"
        >
            <Plus className="w-4 h-4" /> Add Hostel
        </button>
    </div>
);

// ==================================================================================
// MAIN COMPONENT: AddHostelForm
// ==================================================================================
const AddHostelForm = () => {
    // --- State Management ---
    const [hostels, setHostels] = useState([]);
    const [editingHostel, setEditingHostel] = useState(null);
    const [isListLoading, setIsListLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        address: { street: '', city: 'Patna', state: 'Bihar', zipCode: '' },
        totalFloors: ''
    });

    const API_URL = 'https://sih-4ptm.onrender.com/api/v1/hostel';

    // --- Data Fetching ---
    const fetchHostels = async () => {
        setIsListLoading(true);
        setMessage('');
        try {
            const response = await fetch(API_URL, { credentials: 'include' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch hostels");
            }

            const data = await response.json();
            setHostels(data.success ? data.data : []);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsListLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    // --- API Handlers (CRUD) ---
    const handleAdd = async () => {
        if (!formData.name.trim() || !formData.address.street.trim() || !formData.address.zipCode.trim()) {
            setMessage({ type: 'error', text: 'Please fill all required fields' });
            return;
        }
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...formData, totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : 0 })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Hostel created successfully!' });
                setFormData({ name: '', address: { street: '', city: 'Patna', state: 'Bihar', zipCode: '' }, totalFloors: '' });
                setShowAddForm(false);
                fetchHostels();
            } else {
                throw new Error(data.error || 'Failed to create hostel');
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingHostel.name.trim() || !editingHostel.address.street.trim()) {
            setMessage({ type: 'error', text: 'Please fill all required fields' });
            return;
        }
        setIsSubmitting(true);
        setMessage('');
        try {
            const response = await fetch(`${API_URL}/${editingHostel._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: editingHostel.name, address: editingHostel.address, totalFloors: editingHostel.totalFloors })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Hostel updated successfully!' });
                setEditingHostel(null);
                fetchHostels();
            } else {
                throw new Error(data.error || 'Failed to update hostel');
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setIsSubmitting(true);
        setMessage('');
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'include' });
            const data = await response.json();
            
            if (response.ok) {
                setMessage({ type: 'success', text: 'Hostel deleted successfully!' });
                setDeleteConfirm(null);
                fetchHostels();
            } else {
                throw new Error(data.error || 'Failed to delete hostel');
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- UTILITY FUNCTIONS ---
    const getOccupancyRate = (allocated, total) => { if (total === 0) return 0; return Math.round((allocated / total) * 100); };
    const getOccupancyColor = (percentage) => { if (percentage >= 90) return 'text-red-600 bg-red-100'; if (percentage >= 70) return 'text-amber-600 bg-amber-100'; return 'text-green-600 bg-green-100'; };
    const formatAddress = (address) => { if (typeof address === 'string') return address; if (!address) return 'No address'; return [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', '); };

    // --- RENDER ---
    return (
        <div className="">
            <div className="">
                <div className="mb-8 flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Management</h1></div>
                    <button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Hostel
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'success' ? <CheckCircle size={20}/> : <AlertTriangle size={20}/>}
                        {message.text}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isListLoading ? (
                        <>
                           <HostelCardSkeleton />
                           <HostelCardSkeleton />
                           <HostelCardSkeleton />
                        </>
                    ) : hostels.length > 0 ? (
                        hostels.map((hostel) => {
                            const occupancyRate = getOccupancyRate(hostel.allocatedBeds, hostel.totalBeds);
                            const occupancyColorClass = getOccupancyColor(occupancyRate);
                            return (
                                <div key={hostel._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{hostel.name}</h3>
                                            <div className="flex items-start text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                <span>{formatAddress(hostel.address)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingHostel({ ...hostel, address: hostel.address || { street: '', city: '', state: '', zipCode: '' } })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteConfirm(hostel._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3"><div className="flex items-center mb-1"><Building className="w-4 h-4 text-gray-500 mr-1" /><span className="text-xs text-gray-500 uppercase">Floors</span></div><span className="text-lg font-bold">{hostel.totalFloors}</span></div>
                                        <div className="bg-gray-50 rounded-lg p-3"><div className="flex items-center mb-1"><Users className="w-4 h-4 text-gray-500 mr-1" /><span className="text-xs text-gray-500 uppercase">Rooms</span></div><span className="text-lg font-bold">{hostel.totalRooms}</span></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center"><div className="flex items-center text-sm text-gray-600"><Bed className="w-4 h-4 mr-2" />Total Beds</div><span className="font-semibold">{hostel.totalBeds}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600 ml-6">Allocated</span><span className="font-semibold">{hostel.allocatedBeds}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-sm text-green-600 ml-6">Vacant</span><span className="font-semibold text-green-600">{hostel.vacantBeds}</span></div>
                                        {hostel.totalBeds > 0 && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex justify-between mb-2"><span className="text-sm text-gray-600">Occupancy</span><span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${occupancyColorClass}`}>{occupancyRate}%</span></div>
                                                <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${occupancyRate >= 90 ? 'bg-red-500' : occupancyRate >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${occupancyRate}%` }}></div></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <EmptyState onAddClick={() => setShowAddForm(true)} />
                    )}
                </div>
            </div>

            <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add New Hostel">
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label><input type="text" value={formData.address.street} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={formData.address.state} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label><input type="text" value={formData.address.zipCode} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label><input type="number" value={formData.totalFloors} onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })} min="0" className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium">Cancel</button>
                        <button type="button" onClick={handleAdd} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSubmitting ? (<Loader2 className="w-5 h-5 animate-spin" />) : (<Plus className="w-5 h-5" />)}Add Hostel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!editingHostel} onClose={() => setEditingHostel(null)} title="Edit Hostel">
                {editingHostel && (
                     <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name *</label><input type="text" value={editingHostel.name} onChange={(e) => setEditingHostel({ ...editingHostel, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label><input type="text" value={editingHostel.address.street} onChange={(e) => setEditingHostel({ ...editingHostel, address: { ...editingHostel.address, street: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={editingHostel.address.city} onChange={(e) => setEditingHostel({ ...editingHostel, address: { ...editingHostel.address, city: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={editingHostel.address.state} onChange={(e) => setEditingHostel({ ...editingHostel, address: { ...editingHostel.address, state: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label><input type="text" value={editingHostel.address.zipCode} onChange={(e) => setEditingHostel({ ...editingHostel, address: { ...editingHostel.address, zipCode: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" /></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label><input type="number" value={editingHostel.totalFloors} onChange={(e) => setEditingHostel({ ...editingHostel, totalFloors: parseInt(e.target.value) || 0 })} min="0" className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setEditingHostel(null)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium">Cancel</button>
                            <button type="button" onClick={handleUpdate} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSubmitting ? (<Loader2 className="w-5 h-5 animate-spin" />) : (<Check className="w-5 h-5" />)}Update
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Hostel">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700 mb-6">Are you sure? This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium">Cancel</button>
                        <button type="button" onClick={() => handleDelete(deleteConfirm)} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSubmitting ? (<Loader2 className="w-5 h-5 animate-spin" />) : (<Trash2 className="w-5 h-5" />)}Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddHostelForm;