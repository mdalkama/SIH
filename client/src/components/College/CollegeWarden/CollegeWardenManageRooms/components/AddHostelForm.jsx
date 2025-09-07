import React, { useState, useEffect } from 'react';
import { Edit3, Bed, Trash2, MapPin, Building, Users, AlertCircle, Check, X, Plus } from 'lucide-react';

const AddHostelForm = () => {
    const [hostels, setHostels] = useState([]);
    const [editingHostel, setEditingHostel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState('');

    // Form data for adding new hostel
    const [formData, setFormData] = useState({
        name: '',
        address: {
            street: '',
            city: 'Patna',
            state: 'Bihar',
            zipCode: ''
        },
        totalFloors: ''
    });

    // Fetch hostels on component mount
    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setHostels(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch hostels:', error);
        }
    };

    const handleAdd = async () => {
        if (!formData.name.trim() || !formData.address.street.trim() || !formData.address.zipCode.trim()) {
            setMessage('Please fill all required fields');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : 0
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Hostel created successfully!');
                setFormData({
                    name: '',
                    address: { street: '', city: 'Patna', state: 'Bihar', zipCode: '' },
                    totalFloors: ''
                });
                setShowAddForm(false);
                fetchHostels(); // Refresh the list
            } else {
                setMessage(data.error || 'Failed to create hostel');
            }
        } catch (error) {
            setMessage('Error creating hostel');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (hostel) => {
        setEditingHostel({
            ...hostel,
            address: hostel.address || { street: '', city: 'Patna', state: 'Bihar', zipCode: '' }
        });
    };

    const handleUpdate = async () => {
        if (!editingHostel.name.trim() || !editingHostel.address.street.trim()) {
            setMessage('Please fill all required fields');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${editingHostel._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: editingHostel.name,
                    address: editingHostel.address,
                    totalFloors: editingHostel.totalFloors
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Hostel updated successfully!');
                setEditingHostel(null);
                fetchHostels(); // Refresh the list
            } else {
                setMessage(data.error || 'Failed to update hostel');
            }
        } catch (error) {
            setMessage('Error updating hostel');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Hostel deleted successfully!');
                setDeleteConfirm(null);
                fetchHostels(); // Refresh the list
            } else {
                setMessage(data.error || 'Failed to delete hostel');
            }
        } catch (error) {
            setMessage('Error deleting hostel');
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (address) => {
        if (typeof address === 'string') return address;
        if (!address) return 'No address provided';

        const { street, city, state, zipCode } = address;
        return `${street || ''}, ${city || ''}, ${state || ''} ${zipCode || ''}`.replace(/,\s*,/g, ',').trim();
    };

    const getOccupancyColor = (percentage) => {
        if (percentage >= 90) return 'text-red-500';
        if (percentage >= 70) return 'text-amber-500';
        return 'text-green-500';
    };



    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Management</h1>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Hostel
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {hostels.map((hostel) => {
                        const getOccupancyRate = (allocated, total) => {
                            if (total === 0) return 0;
                            return Math.round((allocated / total) * 100);
                        };
                        const occupancyRate = getOccupancyRate(hostel.allocatedBeds, hostel.totalBeds);
                        const occupancyColorClass = getOccupancyColor(occupancyRate);

                        const formatAddress = (address) => {
                            const parts = [address.street, address.city, address.state, address.zipCode].filter(Boolean);
                            return parts.join(', ');
                        };
                        return (
                            <>
                                <div
                                    key={hostel._id}
                                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{hostel.name}</h3>
                                            <div className="flex items-start text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                <span>{formatAddress(hostel.address)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(hostel)}
                                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Hostel"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(hostel._id)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Hostel"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center mb-1">
                                                <Building className="w-4 h-4 text-gray-500 mr-1" />
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Floors</span>
                                            </div>
                                            <span className="text-lg font-bold text-gray-900">{hostel.totalFloors}</span>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center mb-1">
                                                <Users className="w-4 h-4 text-gray-500 mr-1" />
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Rooms</span>
                                            </div>
                                            <span className="text-lg font-bold text-gray-900">{hostel.totalRooms}</span>
                                        </div>
                                    </div>

                                    {/* Bed Information */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Bed className="w-4 h-4 text-gray-500 mr-2" />
                                                <span className="text-sm text-gray-600">Total Beds</span>
                                            </div>
                                            <span className="font-semibold text-gray-900">{hostel.totalBeds}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Allocated</span>
                                            <span className="font-semibold text-gray-900">{hostel.allocatedBeds}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Vacant</span>
                                            <span className="font-semibold text-green-600">{hostel.vacantBeds}</span>
                                        </div>

                                        {/* Occupancy Rate */}
                                        {hostel.totalBeds > 0 && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-600">Occupancy</span>
                                                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${occupancyColorClass}`}>
                                                        {occupancyRate}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${occupancyRate >= 90 ? 'bg-red-500' :
                                                            occupancyRate >= 70 ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                            }`}
                                                        style={{ width: `${occupancyRate}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* No Data State */}
                                        {hostel.totalBeds === 0 && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="text-center py-2">
                                                    <span className="text-sm text-gray-400 italic">No bed data available</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                    {/* Hover Effect Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            </>

                        );
                    })}
                </div>
            </div>

            {/* Add Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Add New Hostel</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hostel Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.street}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, street: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.city}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, city: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.state}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, state: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.zipCode}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, zipCode: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Floors
                                </label>
                                <input
                                    type="number"
                                    value={formData.totalFloors}
                                    onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    Add Hostel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingHostel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Edit Hostel</h2>
                            <button
                                onClick={() => setEditingHostel(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hostel Name *
                                </label>
                                <input
                                    type="text"
                                    value={editingHostel.name}
                                    onChange={(e) => setEditingHostel({ ...editingHostel, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={editingHostel.address.street}
                                        onChange={(e) => setEditingHostel({
                                            ...editingHostel,
                                            address: { ...editingHostel.address, street: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={editingHostel.address.city}
                                        onChange={(e) => setEditingHostel({
                                            ...editingHostel,
                                            address: { ...editingHostel.address, city: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={editingHostel.address.state}
                                        onChange={(e) => setEditingHostel({
                                            ...editingHostel,
                                            address: { ...editingHostel.address, state: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        value={editingHostel.address.zipCode}
                                        onChange={(e) => setEditingHostel({
                                            ...editingHostel,
                                            address: { ...editingHostel.address, zipCode: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Floors
                                </label>
                                <input
                                    type="number"
                                    value={editingHostel.totalFloors}
                                    onChange={(e) => setEditingHostel({ ...editingHostel, totalFloors: parseInt(e.target.value) })}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setEditingHostel(null)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Hostel</h3>
                                <p className="text-sm text-gray-600">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete this hostel? All associated data will be permanently removed.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddHostelForm;