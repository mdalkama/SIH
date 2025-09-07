import React, { useState, useEffect } from 'react';
import { Plus, Building, Users, Bed, ArrowRight, ArrowLeft, UserCheck, UserX, ArrowUpDown } from 'lucide-react';

const HostelManagementSystem = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(false);

    const BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/hostel';

    // Fetch hostels
    const fetchHostels = async () => {
        try {
            setLoading(true);
            const response = await fetch(BASE_URL);
            const data = await response.json();
            if (data.success) {
                setHostels(data.data);
            }
        } catch (error) {
            console.error('Error fetching hostels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Building },
        { id: 'add-hostel', label: 'Add Hostel', icon: Plus },
        { id: 'add-floor', label: 'Add Floor', icon: Plus },
        { id: 'add-room', label: 'Add Room', icon: Plus },
        { id: 'add-bed', label: 'Add Bed', icon: Bed },
        { id: 'allocate', label: 'Allocate', icon: UserCheck },
        { id: 'vacate', label: 'Vacate', icon: UserX },
        { id: 'shift', label: 'Shift Student', icon: ArrowUpDown }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <HostelDashboard
                    hostels={hostels}
                    onSelectHostel={setSelectedHostel}
                    selectedHostel={selectedHostel}
                    selectedFloor={selectedFloor}
                    selectedRoom={selectedRoom}
                    onSelectFloor={setSelectedFloor}
                    onSelectRoom={setSelectedRoom}
                    onBack={() => {
                        if (selectedRoom) {
                            setSelectedRoom(null);
                        } else if (selectedFloor) {
                            setSelectedFloor(null);
                        } else {
                            setSelectedHostel(null);
                        }
                    }}
                />;
            case 'add-hostel':
                return <AddHostelForm onSuccess={fetchHostels} />;
            case 'add-floor':
                return <AddFloorForm hostels={hostels} />;
            case 'add-room':
                return <AddRoomForm hostels={hostels} />;
            case 'add-bed':
                return <AddBedForm hostels={hostels} />;
            case 'allocate':
                return <AllocateBedForm hostels={hostels} />;
            case 'vacate':
                return <VacateBedForm hostels={hostels} />;
            case 'shift':
                return <ShiftStudentForm hostels={hostels} />;
            default:
                return <HostelDashboard hostels={hostels} onSelectHostel={setSelectedHostel} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Hostel Management System</h1>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        renderTabContent()
                    )}
                </div>
            </div>
        </div>
    );
};

// Dashboard Component
const HostelDashboard = ({ hostels, onSelectHostel, selectedHostel, selectedFloor, selectedRoom, onSelectFloor, onSelectRoom, onBack }) => {
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);

    const BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/hostel';

    const fetchFloors = async (hostelId) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/${hostelId}/floors`);
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async (hostelId, floorId) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/${hostelId}/floors/${floorId}/rooms`);
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBeds = async (hostelId, floorId, roomId) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`);
            const data = await response.json();
            if (data.success) {
                setBeds(data.data);
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedHostel && !selectedFloor) {
            fetchFloors(selectedHostel._id);
        }
        if (selectedHostel && selectedFloor && !selectedRoom) {
            fetchRooms(selectedHostel._id, selectedFloor._id);
        }
        if (selectedHostel && selectedFloor && selectedRoom) {
            fetchBeds(selectedHostel._id, selectedFloor._id, selectedRoom._id);
        }
    }, [selectedHostel, selectedFloor, selectedRoom]);

    if (selectedHostel && selectedFloor && selectedRoom) {
        return (
            <div>
                <div className="flex items-center mb-6">
                    <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Beds in Room {selectedRoom.roomNumber}
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {beds.map((bed) => (
                            <div key={bed._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Bed {bed.bedNumber}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${bed.isOccupied
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                        {bed.isOccupied ? 'Occupied' : 'Vacant'}
                                    </span>
                                </div>
                                {bed.isOccupied && bed.occupant && (
                                    <p className="text-sm text-gray-600">Occupant: {bed.occupant}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (selectedHostel && selectedFloor) {
        return (
            <div>
                <div className="flex items-center mb-6">
                    <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Rooms on Floor {selectedFloor.floorNumber}
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map((room) => (
                            <div
                                key={room._id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => onSelectRoom(room)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Room {room.roomNumber}</h3>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Type: {room.roomType || 'Standard'}</p>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-500">Total:</span>
                                        <span className="ml-1 font-medium">{room.totalBeds}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Occupied:</span>
                                        <span className="ml-1 font-medium text-red-600">{room.allocatedBeds}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Vacant:</span>
                                        <span className="ml-1 font-medium text-green-600">{room.vacantBeds}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (selectedHostel) {
        return (
            <div>
                <div className="flex items-center mb-6">
                    <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Floors in {selectedHostel.name}
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {floors.map((floor) => (
                            <div
                                key={floor._id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => onSelectFloor(floor)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Floor {floor.floorNumber}</h3>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Rooms:</span>
                                        <span className="ml-1 font-medium">{floor.totalRooms}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Beds:</span>
                                        <span className="ml-1 font-medium">{floor.totalBeds}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Occupied:</span>
                                        <span className="ml-1 font-medium text-red-600">{floor.allocatedBeds}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Vacant:</span>
                                        <span className="ml-1 font-medium text-green-600">{floor.vacantBeds}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Hostels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => (
                    <div
                        key={hostel._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onSelectHostel(hostel)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{hostel.name}</h3>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{hostel.address}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Floors:</span>
                                <span className="ml-1 font-medium">{hostel.totalFloors}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Rooms:</span>
                                <span className="ml-1 font-medium">{hostel.totalRooms}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Total Beds:</span>
                                <span className="ml-1 font-medium">{hostel.totalBeds}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Vacant:</span>
                                <span className="ml-1 font-medium text-green-600">{hostel.vacantBeds}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Add Hostel Form
const AddHostelForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        totalFloors: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer your-token' // Add actual token
                },
                body: JSON.stringify({
                    ...formData,
                    totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Hostel created successfully!');
                setFormData({ name: '', address: '', totalFloors: '' });
                onSuccess();
            } else {
                setMessage(data.error || 'Failed to create hostel');
            }
        } catch (error) {
            setMessage('Error creating hostel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Hostel</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hostel Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                    </label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Floors
                    </label>
                    <input
                        type="number"
                        value={formData.totalFloors}
                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Hostel'}
                </button>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

// Add Floor Form
const AddFloorForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        floorNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    floorNumber: parseInt(formData.floorNumber)
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Floor added successfully!');
                setFormData({ hostelId: '', floorNumber: '' });
            } else {
                setMessage(data.error || 'Failed to add floor');
            }
        } catch (error) {
            setMessage('Error adding floor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Floor</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hostel *
                    </label>
                    <select
                        value={formData.hostelId}
                        onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Choose a hostel</option>
                        {hostels.map((hostel) => (
                            <option key={hostel._id} value={hostel._id}>
                                {hostel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Floor Number *
                    </label>
                    <input
                        type="number"
                        value={formData.floorNumber}
                        onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.hostelId}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Floor'}
                </button>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

// Add Room Form
const AddRoomForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        floorId: '',
        roomNumber: '',
        roomType: '',
        capacity: ''
    });
    const [floors, setFloors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchFloors = async (hostelId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`);
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const handleHostelChange = (hostelId) => {
        setFormData({ ...formData, hostelId, floorId: '' });
        if (hostelId) {
            fetchFloors(hostelId);
        } else {
            setFloors([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomNumber: formData.roomNumber,
                    roomType: formData.roomType,
                    capacity: formData.capacity ? parseInt(formData.capacity) : undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Room added successfully!');
                setFormData({ hostelId: '', floorId: '', roomNumber: '', roomType: '', capacity: '' });
            } else {
                setMessage(data.error || 'Failed to add room');
            }
        } catch (error) {
            setMessage('Error adding room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Room</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hostel *
                    </label>
                    <select
                        value={formData.hostelId}
                        onChange={(e) => handleHostelChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Choose a hostel</option>
                        {hostels.map((hostel) => (
                            <option key={hostel._id} value={hostel._id}>
                                {hostel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Floor *
                    </label>
                    <select
                        value={formData.floorId}
                        onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!floors.length}
                    >
                        <option value="">Choose a floor</option>
                        {floors.map((floor) => (
                            <option key={floor._id} value={floor._id}>
                                Floor {floor.floorNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Number *
                    </label>
                    <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type
                    </label>
                    <input
                        type="text"
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Single, Double, Triple"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                    </label>
                    <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.hostelId || !formData.floorId}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Room'}
                </button>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

// Add Bed Form
const AddBedForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        floorId: '',
        roomId: '',
        bedNumber: ''
    });
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchFloors = async (hostelId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`);
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const fetchRooms = async (hostelId, floorId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`);
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleHostelChange = (hostelId) => {
        setFormData({ ...formData, hostelId, floorId: '', roomId: '' });
        if (hostelId) {
            fetchFloors(hostelId);
        } else {
            setFloors([]);
        }
        setRooms([]);
    };

    const handleFloorChange = (floorId) => {
        setFormData({ ...formData, floorId, roomId: '' });
        if (floorId && formData.hostelId) {
            fetchRooms(formData.hostelId, floorId);
        } else {
            setRooms([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms/${formData.roomId}/beds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bedNumber: formData.bedNumber
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Bed added successfully!');
                setFormData({ hostelId: '', floorId: '', roomId: '', bedNumber: '' });
            } else {
                setMessage(data.error || 'Failed to add bed');
            }
        } catch (error) {
            setMessage('Error adding bed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Bed</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hostel *
                    </label>
                    <select
                        value={formData.hostelId}
                        onChange={(e) => handleHostelChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Choose a hostel</option>
                        {hostels.map((hostel) => (
                            <option key={hostel._id} value={hostel._id}>
                                {hostel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Floor *
                    </label>
                    <select
                        value={formData.floorId}
                        onChange={(e) => handleFloorChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!floors.length}
                    >
                        <option value="">Choose a floor</option>
                        {floors.map((floor) => (
                            <option key={floor._id} value={floor._id}>
                                Floor {floor.floorNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Room *
                    </label>
                    <select
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!rooms.length}
                    >
                        <option value="">Choose a room</option>
                        {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                                Room {room.roomNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bed Number *
                    </label>
                    <input
                        type="text"
                        value={formData.bedNumber}
                        onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.hostelId || !formData.floorId || !formData.roomId}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Bed'}
                </button>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

// Allocate Bed Form
const AllocateBedForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        floorId: '',
        roomId: '',
        bedId: '',
        studentId: ''
    });
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchFloors = async (hostelId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`);
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const fetchRooms = async (hostelId, floorId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`);
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchBeds = async (hostelId, floorId, roomId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`);
            const data = await response.json();
            if (data.success) {
                setBeds(data.data.filter(bed => !bed.isOccupied)); // Only show vacant beds
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
        }
    };

    const handleHostelChange = (hostelId) => {
        setFormData({ ...formData, hostelId, floorId: '', roomId: '', bedId: '' });
        if (hostelId) {
            fetchFloors(hostelId);
        } else {
            setFloors([]);
        }
        setRooms([]);
        setBeds([]);
    };

    const handleFloorChange = (floorId) => {
        setFormData({ ...formData, floorId, roomId: '', bedId: '' });
        if (floorId && formData.hostelId) {
            fetchRooms(formData.hostelId, floorId);
        } else {
            setRooms([]);
        }
        setBeds([]);
    };

    const handleRoomChange = (roomId) => {
        setFormData({ ...formData, roomId, bedId: '' });
        if (roomId && formData.hostelId && formData.floorId) {
            fetchBeds(formData.hostelId, formData.floorId, roomId);
        } else {
            setBeds([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms/${formData.roomId}/beds/${formData.bedId}/allocate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: formData.studentId
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Bed allocated successfully!');
                setFormData({ hostelId: '', floorId: '', roomId: '', bedId: '', studentId: '' });
            } else {
                setMessage(data.error || 'Failed to allocate bed');
            }
        } catch (error) {
            setMessage('Error allocating bed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Allocate Bed</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hostel *
                    </label>
                    <select
                        value={formData.hostelId}
                        onChange={(e) => handleHostelChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Choose a hostel</option>
                        {hostels.map((hostel) => (
                            <option key={hostel._id} value={hostel._id}>
                                {hostel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Floor *
                    </label>
                    <select
                        value={formData.floorId}
                        onChange={(e) => handleFloorChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!floors.length}
                    >
                        <option value="">Choose a floor</option>
                        {floors.map((floor) => (
                            <option key={floor._id} value={floor._id}>
                                Floor {floor.floorNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Room *
                    </label>
                    <select
                        value={formData.roomId}
                        onChange={(e) => handleRoomChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!rooms.length}
                    >
                        <option value="">Choose a room</option>
                        {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                                Room {room.roomNumber} ({room.vacantBeds} vacant)
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Bed *
                    </label>
                    <select
                        value={formData.bedId}
                        onChange={(e) => setFormData({ ...formData, bedId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!beds.length}
                    >
                        <option value="">Choose a bed</option>
                        {beds.map((bed) => (
                            <option key={bed._id} value={bed._id}>
                                Bed {bed.bedNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student ID *
                    </label>
                    <input
                        type="text"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Enter student ID"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.hostelId || !formData.floorId || !formData.roomId || !formData.bedId}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Allocating...' : 'Allocate Bed'}
                </button>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

// Vacate Bed Form
const VacateBedForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        floorId: '',
        roomId: '',
        bedId: ''
    });
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchFloors = async (hostelId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`);
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const fetchRooms = async (hostelId, floorId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`);
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchBeds = async (hostelId, floorId, roomId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`);
            const data = await response.json();
            if (data.success) {
                setBeds(data.data.filter(bed => bed.isOccupied)); // Only show occupied beds
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
        }
    };

    const handleHostelChange = (hostelId) => {
        setFormData({ ...formData, hostelId, floorId: '', roomId: '', bedId: '' });
        if (hostelId) {
            fetchFloors(hostelId);
        } else {
            setFloors([]);
        }
        setRooms([]);
        setBeds([]);
    };

    const handleFloorChange = (floorId) => {
        setFormData({ ...formData, floorId, roomId: '', bedId: '' });
        if (floorId && formData.hostelId) {
            fetchRooms(formData.hostelId, floorId);
        } else {
            setRooms([]);
        }
        setBeds([]);
    };

    const handleRoomChange = (roomId) => {
        setFormData({ ...formData, roomId, bedId: '' });
        if (roomId && formData.hostelId && formData.floorId) {
            fetchBeds(formData.hostelId, formData.floorId, roomId);
        } else {
            setBeds([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms/${formData.roomId}/beds/${formData.bedId}/vacate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Bed vacated successfully!');
                setFormData({ hostelId: '', floorId: '', roomId: '', bedId: '' });
            } else {
                setMessage(data.error || 'Failed to vacate bed');
            }
        } catch (error) {
            setMessage('Error vacating bed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vacate Bed</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hostel *
                    </label>
                    <select
                        value={formData.hostelId}
                        onChange={(e) => handleHostelChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Choose a hostel</option>
                        {hostels.map((hostel) => (
                            <option key={hostel._id} value={hostel._id}>
                                {hostel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Floor *
                    </label>
                    <select
                        value={formData.floorId}
                        onChange={(e) => handleFloorChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!floors.length}
                    >
                        <option value="">Choose a floor</option>
                        {floors.map((floor) => (
                            <option key={floor._id} value={floor._id}>
                                Floor {floor.floorNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Room *
                    </label>
                    <select
                        value={formData.roomId}
                        onChange={(e) => handleRoomChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!rooms.length}
                    >
                        <option value="">Choose a room</option>
                        {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                                Room {room.roomNumber} ({room.allocatedBeds} occupied)
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Bed *
                    </label>
                    <select
                        value={formData.bedId}
                        onChange={(e) => setFormData({ ...formData, bedId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!beds.length}
                    >
                        <option value="">Choose a bed</option>
                        {beds.map((bed) => (
                            <option key={bed._id} value={bed._id}>
                                Bed {bed.bedNumber} - {bed.occupant || 'Occupied'}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.hostelId || !formData.floorId || !formData.roomId || !formData.bedId}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? 'Vacating...' : 'Vacate Bed'}
                </button>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

// Shift Student Form
const ShiftStudentForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        newHostelId: '',
        newFloorId: '',
        newRoomId: '',
        newBedId: ''
    });
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchFloors = async (hostelId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`);
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const fetchRooms = async (hostelId, floorId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`);
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchBeds = async (hostelId, floorId, roomId) => {
        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`);
            const data = await response.json();
            if (data.success) {
                setBeds(data.data.filter(bed => !bed.isOccupied));
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
        }
    };

    const handleHostelChange = (hostelId) => {
        setFormData({ ...formData, newHostelId: hostelId, newFloorId: '', newRoomId: '', newBedId: '' });
        if (hostelId) {
            fetchFloors(hostelId);
        } else {
            setFloors([]);
        }
        setRooms([]);
        setBeds([]);
    };

    const handleFloorChange = (floorId) => {
        setFormData({ ...formData, newFloorId: floorId, newRoomId: '', newBedId: '' });
        if (floorId && formData.newHostelId) {
            fetchRooms(formData.newHostelId, floorId);
        } else {
            setRooms([]);
        }
        setBeds([]);
    };

    const handleRoomChange = (roomId) => {
        setFormData({ ...formData, newRoomId: roomId, newBedId: '' });
        if (roomId && formData.newHostelId && formData.newFloorId) {
            fetchBeds(formData.newHostelId, formData.newFloorId, roomId);
        } else {
            setBeds([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel/shift-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Student shifted successfully!');
                setFormData({ studentId: '', newHostelId: '', newFloorId: '', newRoomId: '', newBedId: '' });
            } else {
                setMessage(data.error || 'Failed to shift student');
            }
        } catch (error) {
            setMessage('Error shifting student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shift Student</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student ID *
                    </label>
                    <input
                        type="text"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Enter student ID"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Hostel *
                    </label>
                    <select
                        value={formData.newHostelId}
                        onChange={(e) => handleHostelChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Choose a hostel</option>
                        {hostels.map((hostel) => (
                            <option key={hostel._id} value={hostel._id}>
                                {hostel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Floor *
                    </label>
                    <select
                        value={formData.newFloorId}
                        onChange={(e) => handleFloorChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!floors.length}
                    >
                        <option value="">Choose a floor</option>
                        {floors.map((floor) => (
                            <option key={floor._id} value={floor._id}>
                                Floor {floor.floorNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Room *
                    </label>
                    <select
                        value={formData.newRoomId}
                        onChange={(e) => handleRoomChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!rooms.length}
                    >
                        <option value="">Choose a room</option>
                        {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                                Room {room.roomNumber} ({room.vacantBeds} vacant)
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Bed *
                    </label>
                    <select
                        value={formData.newBedId}
                        onChange={(e) => setFormData({ ...formData, newBedId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!beds.length}
                    >
                        <option value="">Choose a bed</option>
                        {beds.map((bed) => (
                            <option key={bed._id} value={bed._id}>
                                Bed {bed.bedNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.studentId || !formData.newHostelId || !formData.newFloorId || !formData.newRoomId || !formData.newBedId}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                    {loading ? 'Shifting...' : 'Shift Student'}
                </button>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default HostelManagementSystem;