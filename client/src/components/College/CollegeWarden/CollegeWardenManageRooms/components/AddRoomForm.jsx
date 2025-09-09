import React, { useState, useRef, useEffect } from "react";
import { Search, X, Plus, Building, Wifi, Wind, Bath, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

// HELPER COMPONENT: Floor Selector
const FloorSelectorPanel = ({ floors, selectedFloorId, onSelect, isLoading }) => {
    if (isLoading) {
        return (
            <div className="p-2 space-y-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2 animate-pulse">
                    <div className="h-12 w-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-12 w-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-12 w-24 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }
    if (floors.length === 0) {
        return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-200">No floors found for this hostel. Please add a floor first.</p>;
    }
    return (
        <div className="p-2 bg-gray-100 rounded-lg">
            <div className="flex flex-wrap gap-2">
                {floors.map(floor => (
                    <button
                        type="button"
                        key={floor._id}
                        onClick={() => onSelect(floor)}
                        className={`px-4 py-2 text-center rounded-md border text-sm transition-all duration-200 ${
                            selectedFloorId === floor._id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                        }`}
                    >
                        Floor {floor.floorNumber}
                        <span className="block text-xs opacity-80 mt-0.5">{floor.totalRooms} Rooms</span>
                    </button>
                ))}
            </div>
        </div>
    );
};


const AddRoomForm = ({ hostels }) => {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const [floors, setFloors] = useState([]);
    const [detailedFloorData, setDetailedFloorData] = useState(null);
    
    const [isFetchingFloors, setIsFetchingFloors] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [roomData, setRoomData] = useState({
        roomNumber: '',
        roomType: '',
        capacity: '',
        price: '',
        facilities: [],
    });
    const [inlineError, setInlineError] = useState('');
    const [message, setMessage] = useState('');

    const searchContainerRef = useRef(null);

    const roomTypeOptions = ["Single", "Double", "Triple", "Dorm"];
    const facilityOptions = ["AC", "Attached Bathroom", "Wi-Fi", "Geyser"];

    // --- Data Fetching & Validation ---

    useEffect(() => {
        if (!selectedHostel) { setFloors([]); setSelectedFloor(null); return; }
        const fetchFloorsForHostel = async () => {
            setIsFetchingFloors(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors`, { credentials: "include" });
                const data = await res.json();
                setFloors(data.success ? data.data : []);
            } catch (error) { setMessage({ type: 'error', text: 'Could not fetch floors.' }); }
            finally { setIsFetchingFloors(false); }
        };
        fetchFloorsForHostel();
    }, [selectedHostel]);
    
    useEffect(() => {
        if (!selectedFloor || !selectedHostel) { setDetailedFloorData(null); return; }
        const fetchFloorDetails = async () => {
            setIsFetchingDetails(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}`, {credentials: 'include'});
                const data = await res.json();
                if(data.success) setDetailedFloorData(data.data);
            } catch (error) { setMessage({ type: 'error', text: 'Could not fetch room details.' }); }
            finally { setIsFetchingDetails(false); }
        };
        fetchFloorDetails();
    }, [selectedFloor, selectedHostel]);
    
    useEffect(() => {
        if (!roomData.roomNumber || !detailedFloorData || !detailedFloorData.rooms) { setInlineError(''); return; }
        const isDuplicate = detailedFloorData.rooms.some(r => r.roomNumber.toString().toLowerCase() === roomData.roomNumber.toLowerCase());
        setInlineError(isDuplicate ? `Room "${roomData.roomNumber}" already exists on this floor.` : '');
    }, [roomData.roomNumber, detailedFloorData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) { setIsDropdownVisible(false); }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);

    // --- UI Handlers ---
    const handleSelectHostel = (hostel) => {
        setSelectedHostel(hostel);
        setSearchTerm('');
        setIsDropdownVisible(false);
    };

    const clearHostelSelection = () => {
        setSelectedHostel(null);
        setSelectedFloor(null);
        setSearchTerm('');
        setMessage('');
    };
    
    const handleFacilitiesChange = (e) => {
        const { value, checked } = e.target;
        setRoomData(prev => {
            const facilities = checked
                ? [...prev.facilities, value]
                : prev.facilities.filter(facility => facility !== value);
            return { ...prev, facilities };
        });
    };

    const filteredHostels = hostels ? hostels.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

    // --- Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inlineError || !selectedHostel || !selectedFloor) return;
        
        setIsSubmitting(true);
        setMessage('');

        try {
            const payload = {
                roomNumber: roomData.roomNumber,
                roomType: roomData.roomType,
                capacity: parseInt(roomData.capacity),
                price: parseInt(roomData.price),
                facilities: roomData.facilities,
            };

            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}/rooms`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            
            if (data.success) {
                setMessage({ type: 'success', text: `Room ${roomData.roomNumber} added successfully!` });
                setRoomData({ roomNumber: '', roomType: '', capacity: '', price: '', facilities: [] });
                const updatedRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors`, {credentials: 'include'});
                const updatedData = await updatedRes.json();
                if(updatedData.success) setFloors(updatedData.data);
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to add room" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!hostels) {
        return <div className="max-w-lg mx-auto p-6 text-center"><Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" /><p className="mt-2 text-gray-500">Loading initial data...</p></div>;
    }

    return (
        // YAHAN CHANGE HUA HAI: Width wapas max-w-lg kar di gayi hai
        <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add a New Room</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset className="space-y-2">
                    <legend className="text-lg font-semibold text-gray-800">1. Find Hostel</legend>
                    <div ref={searchContainerRef} className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsDropdownVisible(true)} placeholder="Search for a hostel..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {isDropdownVisible && (<ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">{filteredHostels.length > 0 ? (filteredHostels.map(h => (<li key={h._id} onClick={() => handleSelectHostel(h)} className="px-4 py-2 cursor-pointer hover:bg-blue-50">{h.name}</li>))) : (<li className="px-4 py-3 text-center text-gray-500">{searchTerm ? "No results found" : "No hostels available"}</li>)}</ul>)}
                    </div>
                    {selectedHostel && (<div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"><p className="font-bold text-blue-800 flex items-center"><Building className="w-4 h-4 mr-2" />{selectedHostel.name}</p><button type="button" onClick={clearHostelSelection} className="p-1.5 text-blue-600 hover:text-red-700 hover:bg-red-100 rounded-full" title="Change Hostel"><X className="w-4 h-4" /></button></div>)}
                </fieldset>

                <fieldset className="space-y-2" disabled={!selectedHostel}>
                    <legend className={`text-lg font-semibold ${selectedHostel ? 'text-gray-800' : 'text-gray-400'}`}>2. Select Floor</legend>
                    {selectedHostel && <FloorSelectorPanel floors={floors} selectedFloorId={selectedFloor?._id} onSelect={(floor) => {setSelectedFloor(floor);setMessage('')}} isLoading={isFetchingFloors} />}
                </fieldset>

                <fieldset className="space-y-4" disabled={!selectedFloor || isFetchingDetails}>
                    <legend className={`text-lg font-semibold ${selectedFloor ? 'text-gray-800' : 'text-gray-400'}`}>3. Add Room Details</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                            <input type="text" value={roomData.roomNumber} onChange={(e) => setRoomData({...roomData, roomNumber: e.target.value})} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inlineError ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`} required />
                            {inlineError && <p className="mt-1 text-xs text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-1"/>{inlineError}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                            <select value={roomData.roomType} onChange={(e) => setRoomData({ ...roomData, roomType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                                <option value="" disabled>Select a type</option>
                                {roomTypeOptions.map(type => (<option key={type} value={type}>{type}</option>))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Beds) *</label>
                            <input type="number" value={roomData.capacity} onChange={(e) => setRoomData({...roomData, capacity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Bed (₹) *</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                                <input type="number" value={roomData.price} onChange={(e) => setRoomData({...roomData, price: e.target.value})} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" required />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                        <div className="grid grid-cols-2 gap-4">
                            {facilityOptions.map(facility => (
                                <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" value={facility} checked={roomData.facilities.includes(facility)} onChange={handleFacilitiesChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-gray-700">{facility}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </fieldset>
                
                <div>
                     {message && (<div className={`text-sm p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}{message.text}</div>)}
                    <button type="submit" disabled={isSubmitting || !!inlineError || !selectedHostel || !selectedFloor || !roomData.roomNumber || !roomData.roomType || !roomData.capacity || !roomData.price} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        <span>{isSubmitting ? 'Adding Room...' : 'Add Room'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRoomForm;