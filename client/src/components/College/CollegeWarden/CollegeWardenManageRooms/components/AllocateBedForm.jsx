import React, { useState, useRef, useEffect } from "react";
import { Search, X, Building, User, Bed, Loader2, AlertTriangle, CheckCircle, UserSearch } from 'lucide-react';

// --- Helper Components ---
const FloorSelectorPanel = ({ floors, selectedFloorId, onSelect, isLoading }) => {
    if (isLoading) { return <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>; }
    if (floors.length === 0) { return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">No floors found for this hostel.</p>; }
    return (<div className="p-2 bg-gray-100 rounded-lg"><div className="flex flex-wrap gap-2">{floors.map(floor => (<button type="button" key={floor._id} onClick={() => onSelect(floor)} className={`px-4 py-2 text-center rounded-md border text-sm transition-all ${selectedFloorId === floor._id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Floor {floor.floorNumber}</button>))}</div></div>);
};

const RoomBedSelector = ({ hostelId, floorId, onBedSelect, selectedBedId }) => {
    const [rooms, setRooms] = useState([]);
    const [bedsByRoom, setBedsByRoom] = useState({});
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { const fetchRooms = async () => { setIsLoading(true); try { const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`, { credentials: "include" }); if (!res.ok) throw new Error('Failed to fetch rooms'); const data = await res.json(); setRooms(data.success ? data.data : []); } catch (error) { console.error(error); } finally { setIsLoading(false); } }; fetchRooms(); }, [hostelId, floorId]);
    const handleRoomClick = async (roomId) => { if (expandedRoomId === roomId) { setExpandedRoomId(null); return; } setExpandedRoomId(roomId); if (!bedsByRoom[roomId]) { try { const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`, { credentials: "include" }); if (!res.ok) throw new Error('Failed to fetch beds'); const data = await res.json(); setBedsByRoom(prev => ({ ...prev, [roomId]: data.data || [] })); } catch (error) { console.error(error); } } };
    if (isLoading) return <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>;
    if (rooms.length === 0) return <p className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg">No rooms found on this floor.</p>;
    return (<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{rooms.map(room => (<div key={room._id} className={`border rounded-lg transition-all duration-300 ${expandedRoomId === room._id ? 'bg-blue-50 border-blue-300 col-span-full' : 'bg-white border-gray-300'}`}><button type="button" onClick={() => handleRoomClick(room._id)} className="w-full p-3 text-center"><p className="font-bold text-lg">Room {room.roomNumber}</p><p className="text-xs text-gray-500">{room.vacantBeds} / {room.totalBeds} Vacant</p></button>{expandedRoomId === room._id && (<div className="p-3 border-t border-blue-200"><h4 className="text-sm font-semibold mb-2 text-gray-700">Available Beds:</h4><div className="flex flex-wrap gap-2">{bedsByRoom[room._id] ? bedsByRoom[room._id].map(bed => (<button key={bed._id} type="button" onClick={() => onBedSelect({ ...bed, roomId: room._id, roomNumber: room.roomNumber })} disabled={bed.isOccupied} className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all ${bed.isOccupied ? 'bg-red-100 text-red-600 cursor-not-allowed' : selectedBedId === bed._id ? 'bg-green-600 text-white ring-2 ring-offset-1 ring-green-600' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}><Bed size={14} /> Bed {bed.bedNumber}</button>)) : <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}{bedsByRoom[room._id] && bedsByRoom[room._id].filter(b => !b.isOccupied).length === 0 && <p className="text-xs text-gray-500">No vacant beds in this room.</p>}</div></div>)}</div>))}</div>);
};


const AllocateBedForm = ({ hostels }) => {
    // --- State Management ---
    const [currentStep, setCurrentStep] = useState(1);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [foundStudent, setFoundStudent] = useState(null);
    const [hostelSearchTerm, setHostelSearchTerm] = useState('');
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedBed, setSelectedBed] = useState(null);
    const [floors, setFloors] = useState([]);
    const [isSearchingStudent, setIsSearchingStudent] = useState(false);
    const [isFetchingFloors, setIsFetchingFloors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isHostelDropdownVisible, setIsHostelDropdownVisible] = useState(false);
    const hostelSearchContainerRef = useRef(null);

    // --- Data Fetching & Logic ---
    const handleStudentSearch = async () => {
        if (!studentSearchTerm) return;
        setIsSearchingStudent(true);
        setFoundStudent(null);
        setMessage('');
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/student/find/${studentSearchTerm}`, { credentials: 'include' });
            if (!res.ok) { const errData = await res.json(); throw new Error(errData.error || 'Student search failed'); }
            const data = await res.json();
            if (data.success) { setFoundStudent(data.data); setCurrentStep(2); }
            else { throw new Error(data.error); }
        } catch (e) {
            setMessage({ type: 'error', text: e.message });
        } finally {
            setIsSearchingStudent(false);
        }
    };

    useEffect(() => {
        if (!selectedHostel) { setFloors([]); setSelectedFloor(null); return; }
        const fetchFloorsForHostel = async () => {
            setIsFetchingFloors(true);
            try {
                const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors`, { credentials: "include" });
                if (!res.ok) { const errData = await res.json(); throw new Error(errData.error || 'Failed to fetch floors'); }
                const data = await res.json();
                setFloors(data.success ? data.data : []);
            } catch (e) { setMessage({ type: 'error', text: e.message }); }
            finally { setIsFetchingFloors(false); }
        };
        fetchFloorsForHostel();
    }, [selectedHostel]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (hostelSearchContainerRef.current && !hostelSearchContainerRef.current.contains(event.target)) {
                setIsHostelDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!foundStudent || !selectedBed) return;
        setIsSubmitting(true);
        setMessage('');
        console.log(selectedHostel._id, selectedFloor._id,selectedBed.roomId, selectedBed._id, foundStudent.registrationNumber);
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors/${selectedFloor._id}/rooms/${selectedBed.roomId}/beds/${selectedBed._id}/allocate`, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationNumber: foundStudent.registrationNumber }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: `Bed allocated successfully!` });
                setTimeout(() => resetForm(), 2000);
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to allocate bed." });
            }
        } catch (e) { setMessage({ type: 'error', text: "An unexpected error occurred." }); }
        finally { setIsSubmitting(false); }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setStudentSearchTerm(''); setFoundStudent(null);
        setHostelSearchTerm(''); setSelectedHostel(null);
        setSelectedFloor(null); setSelectedBed(null);
        setMessage('');
    };

    const handleSelectHostel = (hostel) => {
        setSelectedHostel(hostel);
        setHostelSearchTerm('');
        setIsHostelDropdownVisible(false);
    };

    const filteredHostels = hostels ? hostels.filter(h => h.name.toLowerCase().includes(hostelSearchTerm.toLowerCase())) : [];

    if (!hostels) { return <div className="text-center"><Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" /><p className="mt-2 text-gray-500">Loading initial data...</p></div>; }

    return (
        <div className="">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Allocate Bed to Student</h2>

            {currentStep === 1 && (
                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-gray-800">1. Find Student</legend>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Registration No. *</label>
                        <div className="flex gap-2">
                            <input type="text" value={studentSearchTerm} onChange={(e) => setStudentSearchTerm(e.target.value)} placeholder="Enter registration number..." className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="button" onClick={handleStudentSearch} disabled={!studentSearchTerm || isSearchingStudent} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                {isSearchingStudent ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserSearch className="w-5 h-5" />} Find
                            </button>
                        </div>
                    </div>
                </fieldset>
            )}

            {currentStep > 1 && (
                <div className="space-y-6">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800">Student to Allocate</p>
                                <p className="text-sm text-gray-600">{foundStudent?.name} ({foundStudent?.registrationNumber})</p>
                            </div>
                        </div>
                        <button onClick={() => { setCurrentStep(1); setFoundStudent(null); }} className="text-sm text-blue-600 hover:underline">Change</button>
                    </div>

                    <fieldset className="space-y-2" disabled={currentStep !== 2}>
                        <legend className="text-lg font-semibold text-gray-800">2. Find Location</legend>
                        <div ref={hostelSearchContainerRef} className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={hostelSearchTerm}
                                    onChange={(e) => setHostelSearchTerm(e.target.value)}
                                    onFocus={() => setIsHostelDropdownVisible(true)}
                                    placeholder="Search for a hostel..."
                                    className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            {isHostelDropdownVisible && (
                                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredHostels.length > 0 ? (
                                        filteredHostels.map(h => (
                                            <li key={h._id} onClick={() => handleSelectHostel(h)} className="px-4 py-2 cursor-pointer hover:bg-blue-50">
                                                {h.name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-center text-gray-500">{hostelSearchTerm ? "No results found" : "No hostels available"}</li>
                                    )}
                                </ul>
                            )}
                        </div>
                        {selectedHostel && (<div className="mt-2 p-3 bg-blue-50 border rounded-lg flex items-center justify-between"><p className="font-bold text-blue-800 flex items-center"><Building className="w-4 h-4 mr-2" />{selectedHostel.name}</p><button type="button" onClick={() => { setSelectedHostel(null); setSelectedFloor(null); }} className="p-1.5 text-blue-600 hover:text-red-700 rounded-full" title="Change Hostel"><X className="w-4 h-4" /></button></div>)}

                        {selectedHostel && <div className="mt-4"><FloorSelectorPanel floors={floors} selectedFloorId={selectedFloor?._id} onSelect={setSelectedFloor} isLoading={isFetchingFloors} /></div>}
                    </fieldset>

                    <fieldset className="space-y-2" disabled={currentStep !== 2 || !selectedFloor}>
                        <legend className={`text-lg font-semibold ${selectedFloor ? 'text-gray-800' : 'text-gray-400'}`}>3. Select Room & Bed</legend>
                        {selectedFloor && <RoomBedSelector hostelId={selectedHostel._id} floorId={selectedFloor._id} onBedSelect={(bed) => { setSelectedBed(bed); setCurrentStep(4); }} selectedBedId={selectedBed?._id} />}
                    </fieldset>
                </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">4. Confirm Allocation</h3>
                    <div className="p-4 bg-gray-50 border rounded-lg space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Student:</span><span className="font-semibold">{foundStudent.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Hostel:</span><span className="font-semibold">{selectedHostel.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Location:</span><span className="font-semibold">Floor {selectedFloor.floorNumber}, Room {selectedBed.roomNumber}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Bed:</span><span className="font-semibold">Bed {selectedBed.bedNumber}</span></div>
                    </div>
                    <div>
                        {message && (<div className={`text-sm p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}{message.text}</div>)}
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setCurrentStep(2)} className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300">Back</button>
                            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                Confirm Allocation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {message && !isSubmitting && currentStep < 4 && (
                <div className={`text-sm p-3 mt-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default AllocateBedForm;