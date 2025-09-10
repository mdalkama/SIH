import React, { useState, useRef, useEffect } from "react";
import { Search, X, Plus, Building, Bed, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

// Helper for Floor Selection
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

// Helper for Room Selection
const RoomSelectorPanel = ({ rooms, selectedRoomId, onSelect, isLoading }) => {
    if (isLoading) { return <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>; }
    if (rooms.length === 0) { return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">No rooms found on this floor.</p>; }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rooms.map(room => (
                <button type="button" key={room._id} onClick={() => onSelect(room)} className={`p-3 border rounded-lg text-center transition-all ${selectedRoomId === room._id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'}`}>
                    <p className="font-bold text-lg">Room {room.roomNumber}</p>
                    <p className={`text-xs mt-1 ${selectedRoomId === room._id ? 'opacity-80' : 'text-gray-500'}`}>{room.allocatedBeds} / {room.totalBeds} Beds</p>
                </button>
            ))}
        </div>
    );
};

const AddBedForm = ({ hostels }) => {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [detailedRoomData, setDetailedRoomData] = useState(null);
    const [isFetchingFloors, setIsFetchingFloors] = useState(false);
    const [isFetchingRooms, setIsFetchingRooms] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bedNumber, setBedNumber] = useState('');
    const [inlineError, setInlineError] = useState('');
    const [message, setMessage] = useState('');
    const searchContainerRef = useRef(null);

    // --- Data Fetching & Validation ---
    useEffect(() => {
        if (!selectedHostel) { setFloors([]); setSelectedFloor(null); return; }
        const fetchFloorsForHostel = async () => {
            setIsFetchingFloors(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors`, { 
                    method: "GET", // YAHAN FIX KIYA GAYA HAI
                    credentials: "include" 
                });
                if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to fetch floors'); }
                const data = await res.json(); 
                setFloors(data.success ? data.data : []);
            } catch (e) { setMessage({ type: 'error', text: e.message }); }
            finally { setIsFetchingFloors(false); }
        }; 
        fetchFloorsForHostel();
    }, [selectedHostel]);

    useEffect(() => {
        if (!selectedFloor) { setRooms([]); setSelectedRoom(null); return; }
        const fetchRoomsForFloor = async () => {
            setIsFetchingRooms(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}/rooms`, { 
                    method: "GET", // YAHAN FIX KIYA GAYA HAI
                    credentials: "include" 
                });
                if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to fetch rooms'); }
                const data = await res.json(); 
                setRooms(data.success ? data.data : []);
            } catch (e) { setMessage({ type: 'error', text: e.message }); }
            finally { setIsFetchingRooms(false); }
        }; 
        fetchRoomsForFloor();
    }, [selectedFloor, selectedHostel]);
    
    useEffect(() => {
        if (!selectedRoom) { setDetailedRoomData(null); return; }
        const fetchRoomDetails = async () => {
            setIsFetchingDetails(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}/rooms/${selectedRoom._id}`, { 
                    method: "GET", // YAHAN FIX KIYA GAYA HAI
                    credentials: "include" 
                });
                if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to fetch room details'); }
                const data = await res.json(); 
                if(data.success) setDetailedRoomData(data.data);
            } catch (e) { setMessage({ type: 'error', text: e.message }); }
            finally { setIsFetchingDetails(false); }
        }; 
        fetchRoomDetails();
    }, [selectedRoom, selectedHostel]);

    useEffect(() => {
        if (!bedNumber || !detailedRoomData || !detailedRoomData.beds) { setInlineError(''); return; }
        const { beds, capacity } = detailedRoomData;
        if (capacity && beds.length >= capacity) {
            setInlineError(`Room capacity of ${capacity} is full.`);
        } else if (beds.some(b => b.bedNumber.toString().toLowerCase() === bedNumber.toLowerCase())) {
            setInlineError(`Bed "${bedNumber}" already exists in this room.`);
        } else {
            setInlineError('');
        }
    }, [bedNumber, detailedRoomData]);

    useEffect(() => {
        const handleClickOutside = (event) => { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) setIsDropdownVisible(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- UI & Form Handlers ---
    const handleSelectHostel = (hostel) => { setSelectedHostel(hostel); setSearchTerm(''); setIsDropdownVisible(false); };
    const resetSelections = () => { setSelectedHostel(null); setSelectedFloor(null); setSelectedRoom(null); setSearchTerm(''); setMessage(''); };
    const filteredHostels = hostels ? hostels.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inlineError || !selectedRoom) return;
        setIsSubmitting(true); setMessage('');
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}/rooms/${selectedRoom._id}/beds`, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bedNumber }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: `Bed ${bedNumber} added successfully!` });
                setBedNumber('');
                const updatedRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}/rooms/${selectedRoom._id}`, {
                    method: "GET", // YAHAN FIX KIYA GAYA HAI
                    credentials: "include"
                });
                const updatedData = await updatedRes.json(); if(updatedData.success) setDetailedRoomData(updatedData.data);
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to add bed" });
            }
        } catch (e) { setMessage({ type: 'error', text: "An unexpected error occurred." }); }
        finally { setIsSubmitting(false); }
    };
    
    if (!hostels) { return <div className="text-center"><Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" /><p className="mt-2 text-gray-500">Loading initial data...</p></div>; }

    return (
        <div className="">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add a New Bed</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset className="space-y-2">
                    <legend className="text-lg font-semibold text-gray-800">1. Find Hostel</legend>
                    <div ref={searchContainerRef} className="relative">
                        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsDropdownVisible(true)} placeholder="Search for a hostel..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                        {isDropdownVisible && (<ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">{filteredHostels.length > 0 ? (filteredHostels.map(h => (<li key={h._id} onClick={() => handleSelectHostel(h)} className="px-4 py-2 cursor-pointer hover:bg-blue-50">{h.name}</li>))) : (<li className="px-4 py-3 text-center text-gray-500">{searchTerm ? "No results found" : "No hostels available"}</li>)}</ul>)}
                    </div>
                    {selectedHostel && (<div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"><p className="font-bold text-blue-800 flex items-center"><Building className="w-4 h-4 mr-2" />{selectedHostel.name}</p><button type="button" onClick={resetSelections} className="p-1.5 text-blue-600 hover:text-red-700 hover:bg-red-100 rounded-full" title="Change Hostel"><X className="w-4 h-4" /></button></div>)}
                </fieldset>

                <fieldset className="space-y-2" disabled={!selectedHostel}>
                    <legend className={`text-lg font-semibold ${selectedHostel ? 'text-gray-800' : 'text-gray-400'}`}>2. Select Floor</legend>
                    {selectedHostel && <FloorSelectorPanel floors={floors} selectedFloorId={selectedFloor?._id} onSelect={(f) => {setSelectedFloor(f); setSelectedRoom(null);}} isLoading={isFetchingFloors} />}
                </fieldset>
                
                <fieldset className="space-y-2" disabled={!selectedFloor}>
                    <legend className={`text-lg font-semibold ${selectedFloor ? 'text-gray-800' : 'text-gray-400'}`}>3. Select Room</legend>
                    {selectedFloor && <RoomSelectorPanel rooms={rooms} selectedRoomId={selectedRoom?._id} onSelect={(r) => {setSelectedRoom(r);setMessage('')}} isLoading={isFetchingRooms} />}
                </fieldset>

                <fieldset className="space-y-2" disabled={!selectedRoom || isFetchingDetails}>
                    <legend className={`text-lg font-semibold ${selectedRoom ? 'text-gray-800' : 'text-gray-400'}`}>4. Add Bed Details</legend>
                    {isFetchingDetails && <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>}
                    {detailedRoomData && (
                        <div className="p-3 bg-gray-50 border rounded-lg space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Room Capacity:</span><span className="font-semibold">{detailedRoomData.capacity || 'N/A'} Beds</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Beds Added:</span><span className="font-semibold">{detailedRoomData.beds.length}</span></div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number *</label>
                        <input type="text" value={bedNumber} onChange={(e) => setBedNumber(e.target.value)} placeholder={selectedRoom ? "e.g., B-01, Upper" : "Select a room first"} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inlineError ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`} required />
                        {inlineError && <p className="mt-1 text-xs text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-1"/>{inlineError}</p>}
                    </div>
                </fieldset>

                <div>
                    {message && (<div className={`text-sm p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}{message.text}</div>)}
                    <button type="submit" disabled={isSubmitting || !!inlineError || !selectedRoom || !bedNumber} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bed className="w-5 h-5" />}
                        <span>{isSubmitting ? 'Adding Bed...' : 'Add Bed'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBedForm;