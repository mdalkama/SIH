import React, { useState, useEffect } from 'react';
import { Plus, Building, MapPin, Users, Bed, ArrowRight, ArrowLeft, UserCheck, UserX, ArrowUpDown } from 'lucide-react';
import ShiftStudentForm from './CollegeWardenManageRooms/components/ShiftStudentForm';
import AddHostelForm from './CollegeWardenManageRooms/components/AddHostelForm';

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
        const res = await fetch("https://sih-4ptm.onrender.com/api/v1/hostel", {
            method: "GET",
            credentials: "include", // send cookies/session
        });

        const data = await res.json();
        if (data.success) {
            setHostels(data.data);
            console.log(data);
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
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">

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
            const res = await fetch(`${BASE_URL}/${hostelId}/floors`, {
                method: "GET",
                credentials: "include", // include cookies/session
            });

            const data = await res.json();
            if (data.success) {
                setFloors(data.data);
            } else {
                console.error("Failed to fetch floors:", data.error);
            }
        } catch (error) {
            console.error("Error fetching floors:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchRooms = async (hostelId, floorId) => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/${hostelId}/floors/${floorId}/rooms`, {
                method: "GET",
                credentials: "include", // include cookies/session
            });

            const data = await res.json();
            if (data.success) {
                setRooms(data.data);
            } else {
                console.error("Failed to fetch rooms:", data.error);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBeds = async (hostelId, floorId, roomId) => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`, {
                method: "GET",
                credentials: "include", // include cookies/session
            });

            const data = await res.json();
            if (data.success) {
                setBeds(data.data);
            } else {
                console.error("Failed to fetch beds:", data.error);
            }
        } catch (error) {
            console.error("Error fetching beds:", error);
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

    const getOccupancyRate = (allocated, total) => {
        if (total === 0) return 0;
        return Math.round((allocated / total) * 100);
    };

    const getOccupancyColor = (rate) => {
        if (rate >= 90) return 'text-red-500 bg-red-50';
        if (rate >= 70) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Hostels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => {
                    const occupancyRate = getOccupancyRate(hostel.allocatedBeds, hostel.totalBeds);
                    const occupancyColorClass = getOccupancyColor(occupancyRate);

                    const formatAddress = (address) => {
                        const parts = [address.street, address.city, address.state, address.zipCode].filter(Boolean);
                        return parts.join(', ');
                    };


                    return (
                        <div
                            key={hostel._id}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                            onClick={() => onSelectHostel(hostel)}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                        {hostel.name}
                                    </h3>
                                    <div className="flex items-start text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                        <span className="leading-relaxed">{formatAddress(hostel.address)}</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
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

                            {/* College Code */}
                            {hostel.collegeCode && (
                                <div className="absolute top-3 right-12 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                    {hostel.collegeCode}
                                </div>
                            )}

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                    );
                })}
            </div>
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
            setLoading(true);
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // include cookies/session
                    body: JSON.stringify({
                        floorNumber: Number(formData.floorNumber) || 0, // ensure it's a number
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessage('Floor added successfully!');
                setFormData({ hostelId: '', floorNumber: '' });
                // optionally refetch floors here
                // fetchFloors(formData.hostelId);
            } else {
                setMessage(data.error || 'Failed to add floor');
            }
        } catch (error) {
            console.error('Error adding floor:', error);
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
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`,
                { credentials: 'include' }
            );
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
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`,
                { credentials: 'include' }
            );
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
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`,
                { credentials: 'include' }
            );
            const data = await response.json();
            if (data.success) {
                // Only show vacant beds
                setBeds(data.data.map(bed => ({
                    ...bed,
                    isVacant: !bed.isOccupied
                })));
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


export default HostelManagementSystem;