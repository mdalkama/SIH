import React, { useState, useEffect } from 'react';
import { Plus, Building, MapPin, Users, Bed, ArrowRight, ArrowLeft, UserCheck, UserX, ArrowUpDown, Home, AlertCircle, CheckCircle } from 'lucide-react';
import ShiftStudentForm from './components/ShiftStudentForm';
import AddHostelForm from './components/AddHostelForm';
import AddFloorForm from './components/AddFloorForm';
import AddRoomForm from './components/AddRoomForm';
import AddBedForm from './components/AddBedForm';
import AllocateBedForm from './components/AllocateBedForm';
import VacateBedForm from './components/VacateBedForm';

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
                console.log(data.data);
                
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

    const getRoomOccupancyColor = (occupancyRate) => {
        if (occupancyRate === 0) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (occupancyRate <= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (occupancyRate < 100) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getStatusIcon = (occupancyRate) => {
        if (occupancyRate === 0) return <CheckCircle className="w-4 h-4" />;
        if (occupancyRate < 100) return <AlertCircle className="w-4 h-4" />;
        return <Users className="w-4 h-4" />;
    };


    
    if (selectedHostel && selectedFloor) {
        return (
            <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="flex items-center px-4 py-2 text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-sm mr-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Floors
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Floor {selectedFloor?.floorNumber || '1'} Rooms
                            </h1>
                            <p className="text-gray-600">
                                {rooms.length} rooms available • Manage occupancy and bed allocation
                            </p>
                        </div>
                    </div>

                    {/* Floor Summary Card */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {rooms.reduce((sum, room) => sum + room.totalBeds, 0)}
                                </p>
                                <p className="text-xs text-gray-500">Total Beds</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-500">
                                    {rooms.reduce((sum, room) => sum + room.allocatedBeds, 0)}
                                </p>
                                <p className="text-xs text-gray-500">Occupied</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-500">
                                    {rooms.reduce((sum, room) => sum + room.vacantBeds, 0)}
                                </p>
                                <p className="text-xs text-gray-500">Available</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                        <p className="text-gray-600">Loading rooms...</p>
                    </div>
                ) : (
                    /* Rooms Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rooms.map((room) => {
                            const occupancyRate = (room.allocatedBeds / room.totalBeds) * 100;
                            const occupancyColorClass = getRoomOccupancyColor(occupancyRate);

                            return (
                                <div
                                    key={room._id}
                                    className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                                    onClick={() => onSelectRoom(room)}
                                >
                                    {/* Card Header */}
                                    <div className="p-5 pb-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Home className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Room {room.roomNumber}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {room.roomType || 'Standard'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                                        </div>

                                        {/* Occupancy Status Badge */}
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${occupancyColorClass} mb-4`}>
                                            {getStatusIcon(occupancyRate)}
                                            <span className="ml-2">
                                                {occupancyRate === 0 ? 'Available' :
                                                    occupancyRate === 100 ? 'Full' :
                                                        `${Math.round(occupancyRate)}% Occupied`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bed Statistics */}
                                    <div className="px-5 pb-5">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-center mb-1">
                                                    <Bed className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <p className="text-xl font-bold text-gray-900">{room.totalBeds}</p>
                                                <p className="text-xs text-gray-500">Total</p>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <div className="flex items-center justify-center mb-1">
                                                    <Users className="w-4 h-4 text-red-600" />
                                                </div>
                                                <p className="text-xl font-bold text-red-600">{room.allocatedBeds}</p>
                                                <p className="text-xs text-red-500">Occupied</p>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center justify-center mb-1">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                </div>
                                                <p className="text-xl font-bold text-green-600">{room.vacantBeds}</p>
                                                <p className="text-xs text-green-500">Vacant</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="px-5 pb-5">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${occupancyRate === 0 ? 'bg-green-500' :
                                                        occupancyRate <= 50 ? 'bg-yellow-500' :
                                                            occupancyRate < 100 ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${occupancyRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && rooms.length === 0 && (
                    <div className="text-center py-16">
                        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Home className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
                        <p className="text-gray-600">No rooms are available on this floor.</p>
                    </div>
                )}
            </div>
        );
    }

    if (selectedHostel) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 mr-6 font-medium"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Hostels
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {selectedHostel.name}
                                </h1>
                                <p className="text-gray-600 mt-1">Floor Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                            <p className="text-gray-500 text-lg">Loading floors...</p>
                        </div>
                    ) : (
                        <>
                            {/* Floors Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {floors.map((floor) => {
                                    const occupancyRate = floor?.totalBeds
                                        ? (((Number(floor?.allocatedBeds) || 0) / (Number(floor?.totalBeds) || 1)) * 100).toFixed(0)
                                        : 0;


                                    return (
                                        <div
                                            key={floor._id}
                                            className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                                            onClick={() => onSelectFloor(floor)}
                                        >
                                            {/* Card Header */}
                                            <div className="p-6 pb-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                            <span className="text-blue-600 font-bold text-lg">
                                                                {floor.floorNumber}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-gray-900">
                                                                Floor {floor.floorNumber}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {occupancyRate}% occupied
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                        <span>Occupancy</span>
                                                        <span>{occupancyRate}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${occupancyRate}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="px-6 pb-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {floor.totalRooms}
                                                        </div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                                            Rooms
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {floor.totalBeds}
                                                        </div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                                            Total Beds
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                                        <div className="text-lg font-bold text-red-600">
                                                            {floor.allocatedBeds}
                                                        </div>
                                                        <div className="text-xs text-red-500 uppercase tracking-wide">
                                                            Occupied
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                                        <div className="text-lg font-bold text-green-600">
                                                            {floor.vacantBeds}
                                                        </div>
                                                        <div className="text-xs text-green-500 uppercase tracking-wide">
                                                            Vacant
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="px-6 pb-6">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${floor.vacantBeds === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : floor.vacantBeds <= 2
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {floor.vacantBeds === 0
                                                        ? 'Full'
                                                        : floor.vacantBeds <= 2
                                                            ? 'Nearly Full'
                                                            : 'Available'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Empty State */}
                            {floors.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ArrowRight className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No floors found</h3>
                                    <p className="text-gray-500">This hostel doesn't have any floors configured yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
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






export default HostelManagementSystem;