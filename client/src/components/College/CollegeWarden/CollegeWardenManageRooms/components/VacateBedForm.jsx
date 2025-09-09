import React, { useState, useRef, useEffect } from "react";
import { Search, X, Building, User, Bed, Loader2, AlertTriangle, CheckCircle, LogOut } from 'lucide-react';

// --- Helper Components for the Wizard ---

const FloorSelectorPanel = ({ floors, selectedFloorId, onSelect, isLoading }) => {
    if (isLoading) { return <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>; }
    if (floors.length === 0) { return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">No floors found for this hostel.</p>; }
    return (
        <div className="p-2 bg-gray-100 rounded-lg">
            <div className="flex flex-wrap gap-2">
                {floors.map(floor => (
                    <button type="button" key={floor._id} onClick={() => onSelect(floor)} className={`px-4 py-2 text-center rounded-md border text-sm transition-all ${selectedFloorId === floor._id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Floor {floor.floorNumber}</button>
                ))}
            </div>
        </div>
    );
};

const OccupiedBedSelector = ({ hostelId, floorId, onBedSelect }) => {
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
            } catch (error) { console.error(error); }
            finally { setIsLoading(false); }
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
    if (rooms.length === 0) return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">No rooms found on this floor.</p>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rooms.map(room => (
                <div key={room._id} className={`border rounded-lg transition-all duration-300 ${expandedRoomId === room._id ? 'bg-red-50 border-red-300 col-span-full' : 'bg-white border-gray-300'}`}>
                    <button type="button" onClick={() => handleRoomClick(room._id)} className="w-full p-3 text-center">
                        <p className="font-bold text-lg">Room {room.roomNumber}</p>
                        <p className="text-xs text-gray-500">{room.allocatedBeds} / {room.totalBeds} Occupied</p>
                    </button>
                    {expandedRoomId === room._id && (
                        <div className="p-3 border-t border-red-200">
                            <h4 className="text-sm font-semibold mb-2 text-gray-700">Select an occupied bed to vacate:</h4>
                            <div className="flex flex-wrap gap-2">
                                {bedsByRoom[room._id] ? bedsByRoom[room._id].map(bed => (
                                    <button
                                        key={bed._id}
                                        type="button"
                                        onClick={() => onBedSelect({ ...bed, roomId: room._id, roomNumber: room.roomNumber })}
                                        disabled={!bed.isOccupied}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all ${!bed.isOccupied ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                                'bg-red-100 text-red-800 hover:bg-red-200'
                                            }`}
                                    >
                                        <Bed size={14} /> Bed {bed.bedNumber}
                                        {bed.student && <span className="font-normal opacity-75">({bed.student.name})</span>}
                                    </button>
                                )) : <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                                {bedsByRoom[room._id] && bedsByRoom[room._id].filter(b => b.isOccupied).length === 0 && <p className="text-xs text-gray-500">No occupied beds in this room.</p>}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const VacateBedForm = ({ hostels }) => {
    // --- State Management for the Wizard ---
    const [currentStep, setCurrentStep] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedBed, setSelectedBed] = useState(null);

    const [floors, setFloors] = useState([]);

    const [isFetchingFloors, setIsFetchingFloors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [message, setMessage] = useState('');
    const searchContainerRef = useRef(null);

    // --- Data Fetching & Logic ---
    useEffect(() => {
        if (!selectedHostel) { setFloors([]); setSelectedFloor(null); return; }
        const fetchFloorsForHostel = async () => {
            setIsFetchingFloors(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors`, { credentials: "include" });
                if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to fetch floors'); }
                const data = await res.json();
                setFloors(data.success ? data.data : []);
            } catch (e) { setMessage({ type: 'error', text: e.message }); }
            finally { setIsFetchingFloors(false); }
        };
        fetchFloorsForHostel();
    }, [selectedHostel]);

    const handleSubmit = async () => {
        if (!selectedBed) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}/rooms/${selectedBed.roomId}/beds/${selectedBed._id}/vacate`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: `Bed vacated successfully!` });
                setTimeout(() => resetForm(), 2000);
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to vacate bed." });
            }
        } catch (e) { setMessage({ type: 'error', text: "An unexpected error occurred." }); }
        finally { setIsSubmitting(false); }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setSearchTerm(''); setSelectedHostel(null);
        setSelectedFloor(null); setSelectedBed(null);
        setMessage('');
    };

    if (!hostels) { return <div className="max-w-2xl mx-auto p-6 text-center"><Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" /><p className="mt-2 text-gray-500">Loading initial data...</p></div>; }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vacate a Bed</h2>

            {/* --- Step 1: Location Selection --- */}
            {currentStep === 1 && (
                <div className="space-y-6">
                    <fieldset className="space-y-2">
                        <legend className="text-lg font-semibold text-gray-800">1. Find Hostel</legend>
                        <div ref={searchContainerRef} className="relative">
                            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for a hostel..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
                            {searchTerm && (<ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">{hostels.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())).map(h => (<li key={h._id} onClick={() => { setSelectedHostel(h); setSearchTerm('') }} className="px-4 py-2 cursor-pointer hover:bg-blue-50">{h.name}</li>))}</ul>)}
                        </div>
                        {selectedHostel && (<div className="mt-2 p-3 bg-blue-50 border rounded-lg flex items-center justify-between"><p className="font-bold text-blue-800 flex items-center"><Building className="w-4 h-4 mr-2" />{selectedHostel.name}</p><button type="button" onClick={() => { setSelectedHostel(null); setSelectedFloor(null); }} className="p-1.5 text-blue-600 hover:text-red-700 rounded-full" title="Change Hostel"><X className="w-4 h-4" /></button></div>)}
                    </fieldset>

                    <fieldset className="space-y-2" disabled={!selectedHostel}>
                        <legend className={`text-lg font-semibold ${selectedHostel ? 'text-gray-800' : 'text-gray-400'}`}>2. Select Floor</legend>
                        {selectedHostel && <FloorSelectorPanel floors={floors} selectedFloorId={selectedFloor?._id} onSelect={setSelectedFloor} isLoading={isFetchingFloors} />}
                    </fieldset>

                    <fieldset className="space-y-2" disabled={!selectedFloor}>
                        <legend className={`text-lg font-semibold ${selectedFloor ? 'text-gray-800' : 'text-gray-400'}`}>3. Select Occupied Bed</legend>
                        {selectedFloor && <OccupiedBedSelector hostelId={selectedHostel._id} floorId={selectedFloor._id} onBedSelect={(bed) => { setSelectedBed(bed); setCurrentStep(2); }} />}
                    </fieldset>
                </div>
            )}

            {/* --- Step 2: Confirmation --- */}
            {currentStep === 2 && selectedBed && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">4. Confirm Vacate</h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Student:</span><span className="font-semibold text-red-900">{selectedBed.student?.name || 'Unknown'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Hostel:</span><span className="font-semibold">{selectedHostel.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Location:</span><span className="font-semibold">Floor {selectedFloor.floorNumber}, Room {selectedBed.roomNumber}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Bed:</span><span className="font-semibold">Bed {selectedBed.bedNumber}</span></div>
                    </div>
                    <div>
                        {message && (<div className={`text-sm p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}{message.text}</div>)}
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setCurrentStep(1)} className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300">Back</button>
                            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                                Confirm Vacate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VacateBedForm;