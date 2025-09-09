import React, { useState, useRef, useEffect } from "react";
import { Search, X, Building, Bed, Loader2, AlertTriangle, CheckCircle, UserSearch, ArrowRight } from 'lucide-react';

// --- Helper Components ---

const FloorSelectorPanel = ({ floors, selectedFloorId, onSelect, isLoading }) => {
    if (isLoading) { return <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>; }
    if (floors.length === 0) { return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">No floors found.</p>; }
    return (<div className="p-2 bg-gray-100 rounded-lg"><div className="flex flex-wrap gap-2">{floors.map(floor => (<button type="button" key={floor._id} onClick={() => onSelect(floor)} className={`px-4 py-2 text-center rounded-md border text-sm transition-all ${selectedFloorId === floor._id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Floor {floor.floorNumber}</button>))}</div></div>);
};

const VacantBedSelector = ({ hostelId, floorId, onBedSelect }) => {
    const [rooms, setRooms] = useState([]);
    const [bedsByRoom, setBedsByRoom] = useState({});
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`, { credentials: "include" });
                if (!res.ok) throw new Error('Failed to fetch rooms');
                const data = await res.json();
                setRooms(data.success ? data.data : []);
            } catch (error) { console.error(error); } finally { setIsLoading(false); }
        };
        fetchRooms();
    }, [hostelId, floorId]);

    const handleRoomClick = async (roomId) => {
        if (expandedRoomId === roomId) { setExpandedRoomId(null); return; }
        setExpandedRoomId(roomId);
        if (!bedsByRoom[roomId]) {
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`, { credentials: "include" });
                if (!res.ok) throw new Error('Failed to fetch beds');
                const data = await res.json();
                setBedsByRoom(prev => ({ ...prev, [roomId]: data.data || [] }));
            } catch (error) { console.error(error); }
        }
    };

    if (isLoading) return <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>;
    if (rooms.length === 0) return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">No rooms found.</p>;

    return (<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{rooms.map(room => (<div key={room._id} className={`border rounded-lg transition-all ${expandedRoomId === room._id ? 'bg-blue-50 border-blue-300 col-span-full' : 'bg-white border-gray-300'}`}><button type="button" onClick={() => handleRoomClick(room._id)} className="w-full p-3 text-center"><p className="font-bold text-lg">Room {room.roomNumber}</p><p className="text-xs text-gray-500">{room.vacantBeds} / {room.totalBeds} Vacant</p></button>{expandedRoomId === room._id && (<div className="p-3 border-t border-blue-200"><h4 className="text-sm font-semibold mb-2 text-gray-700">Available Beds:</h4><div className="flex flex-wrap gap-2">{bedsByRoom[room._id] ? bedsByRoom[room._id].map(bed => (<button key={bed._id} type="button" onClick={() => onBedSelect({ ...bed, roomId: room._id, roomNumber: room.roomNumber })} disabled={bed.isOccupied} className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 ${bed.isOccupied ? 'bg-red-100 text-red-600 cursor-not-allowed' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}><Bed size={14} /> Bed {bed.bedNumber}</button>)) : <Loader2 className="w-4 h-4 animate-spin"/>}{bedsByRoom[room._id] && bedsByRoom[room._id].filter(b => !b.isOccupied).length === 0 && <p className="text-xs text-gray-500">No vacant beds.</p>}</div></div>)}</div>))}</div>);
};

const ShiftStudentForm = ({ hostels }) => {
    // --- State Management ---
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    console.log(studentSearchTerm)
    const [foundStudent, setFoundStudent] = useState(null);
    const [newLocation, setNewLocation] = useState({ hostel: null, floor: null, bed: null });
    const [floors, setFloors] = useState([]);
    const [isSearchingStudent, setIsSearchingStudent] = useState(false);
    const [isFetchingFloors, setIsFetchingFloors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // --- Data Fetching & Logic ---
    const handleStudentSearch = async () => {
        if (!studentSearchTerm) return;
        setIsSearchingStudent(true);
        setFoundStudent(null);
        setMessage('');
        try {
            // YAHAN FIX KIYA GAYA HAI: fetch options ko original code jaisa simple kar diya hai
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/student/search/${studentSearchTerm}`, {
                credentials: 'include'
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Student not found");
            }

            const data = await res.json();
            if (data.success) {
                if (!data.data.currentLocation) {
                    throw new Error("This student is not currently allocated to any bed.");
                }
                setFoundStudent(data.data);
            } else {
                throw new Error(data.error || "Could not find student.");
            }
        } catch (e) {
            setMessage({ type: 'error', text: e.message });
        } finally {
            setIsSearchingStudent(false);
        }
    };

    useEffect(() => {
        if (!newLocation.hostel) {
            setFloors([]);
            setNewLocation(p => ({ ...p, floor: null }));
            return;
        }
        const fetchFloorsData = async () => {
            setIsFetchingFloors(true);
            try {
                // YAHAN FIX KIYA GAYA HAI
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${newLocation.hostel._id}/floors`, {
                    credentials: "include"
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Failed to fetch floors');
                }
                const data = await res.json();
                setFloors(data.success ? data.data : []);
            } catch (e) {
                setMessage({ type: 'error', text: e.message });
            } finally {
                setIsFetchingFloors(false);
            }
        };
        fetchFloorsData();
    }, [newLocation.hostel]);

    const handleSubmit = async () => {
        if (!foundStudent || !newLocation.bed) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const payload = {
                studentId: foundStudent._id,
                newHostelId: newLocation.hostel._id,
                newFloorId: newLocation.floor._id,
                newRoomId: newLocation.bed.roomId,
                newBedId: newLocation.bed._id,
            };
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/shift-student`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Student shifted successfully!' });
                setTimeout(() => resetForm(), 2000);
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to shift student." });
            }
        } catch (e) {
            setMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setStudentSearchTerm('');
        setFoundStudent(null);
        setNewLocation({ hostel: null, floor: null, bed: null });
        setMessage('');
    };

    if (!hostels) {
        return <div className="max-w-4xl mx-auto p-6 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /><p className="mt-2">Loading data...</p></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shift a Student to a New Bed</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* --- "FROM" PANEL --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">1. Find Student to Shift</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Registration No. *</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={studentSearchTerm}
                                onChange={(e) => setStudentSearchTerm(e.target.value)}
                                placeholder="Enter registration number..."
                                className="flex-grow px-3 py-2 border rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleStudentSearch}
                                disabled={!studentSearchTerm || isSearchingStudent}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSearchingStudent ? <Loader2 className="w-5 h-5 animate-spin"/> : <UserSearch className="w-5 h-5"/>} Find
                            </button>
                        </div>
                    </div>

                    {foundStudent && (
                        <div className="p-4 bg-gray-50 border rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800">Current Location</h4>
                                <button onClick={() => setFoundStudent(null)} className="text-sm text-blue-600 hover:underline">Change</button>
                            </div>
                            <div className="text-sm space-y-2">
                                <p><strong className="w-20 inline-block">Student:</strong> {foundStudent.name}</p>
                                <p><strong className="w-20 inline-block">Hostel:</strong> {foundStudent.currentLocation.hostelName}</p>
                                <p><strong className="w-20 inline-block">Location:</strong> Floor {foundStudent.currentLocation.floorNumber}, Room {foundStudent.currentLocation.roomNumber}</p>
                                <p><strong className="w-20 inline-block">Bed:</strong> {foundStudent.currentLocation.bedNumber}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- "TO" PANEL --- */}
                <div className={`space-y-4 transition-opacity ${!foundStudent ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">2. Find New Vacant Bed</h3>
                    <fieldset disabled={!foundStudent} className="space-y-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">New Hostel</label>
                             <select
                                onChange={(e) => setNewLocation({ ...newLocation, hostel: hostels.find(h => h._id === e.target.value) })}
                                className="w-full px-3 py-2 border bg-white rounded-lg"
                                value={newLocation.hostel?._id || ''}
                             >
                                <option value="">Select a hostel</option>
                                {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                            </select>
                        </div>
                        {newLocation.hostel && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Floor</label>
                                <FloorSelectorPanel
                                    floors={floors}
                                    selectedFloorId={newLocation.floor?._id}
                                    onSelect={(f) => setNewLocation({...newLocation, floor: f})}
                                    isLoading={isFetchingFloors}
                                />
                            </div>
                        )}
                         {newLocation.floor && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Room & Bed</label>
                                <VacantBedSelector
                                    hostelId={newLocation.hostel._id}
                                    floorId={newLocation.floor._id}
                                    onBedSelect={(b) => setNewLocation({...newLocation, bed: b})}
                                />
                            </div>
                        )}
                    </fieldset>
                </div>
            </div>

            {/* --- CONFIRMATION & SUBMIT --- */}
            <div className="mt-8 pt-6 border-t">
                {message && (
                    <div className={`text-sm p-3 rounded-lg mb-4 flex items-center gap-2 ${
                        message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
                        {message.text}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-center sm:text-left">
                        {newLocation.bed && foundStudent && (
                            <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                                <span className="font-semibold text-gray-700">{foundStudent.name}</span>
                                <ArrowRight className="w-5 h-5 text-gray-400"/>
                                <span className="font-semibold text-blue-600">{newLocation.hostel.name}, Room {newLocation.bed.roomNumber}, Bed {newLocation.bed.bedNumber}</span>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !foundStudent || !newLocation.bed}
                        className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        <span>{isSubmitting ? 'Shifting...' : 'Confirm Shift'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShiftStudentForm;