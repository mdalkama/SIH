import React, { useState, useRef, useEffect } from "react";
import { Search, X, Plus, Building, MapPin, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

// Helper component for displaying the live context of a selected hostel
const HostelContextPanel = ({ hostelData, isFetching }) => {
    if (isFetching) {
        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Fetching hostel details...</span>
            </div>
        );
    }

    if (!hostelData) return null;

    const addedFloors = hostelData.floors?.length || 0;
    const totalCapacity = hostelData.totalFloors || 0;
    const progress = totalCapacity > 0 ? (addedFloors / totalCapacity) * 100 : 0;

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-fade-in">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-gray-800">Floor Capacity</h4>
                    <span className="text-sm font-bold text-gray-600">{addedFloors} / {totalCapacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            {hostelData.floors && hostelData.floors.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Existing Floors:</h4>
                    <div className="flex flex-wrap gap-2">
                        {hostelData.floors.map(floor => (
                            <span key={floor._id} className="px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                {floor.floorNumber}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const AddFloorForm = ({ hostels }) => {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [detailedHostelData, setDetailedHostelData] = useState(null);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    const [floorNumber, setFloorNumber] = useState('');
    const [inlineError, setInlineError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const searchContainerRef = useRef(null);

    // --- Data Fetching & Validation ---

    useEffect(() => {
        if (!selectedHostel) {
            setDetailedHostelData(null);
            return;
        }

        const fetchDetails = async () => {
            setIsFetchingDetails(true);
            try {
                const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}`, { credentials: 'include' });
                const data = await response.json();
                if (data.success) {
                    setDetailedHostelData(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch hostel details", error);
                setMessage({ type: 'error', text: 'Could not fetch hostel details.' });
            } finally {
                setIsFetchingDetails(false);
            }
        };

        fetchDetails();
    }, [selectedHostel]);

    useEffect(() => {
        if (!floorNumber || !detailedHostelData || !detailedHostelData.floors) {
            setInlineError('');
            return;
        }
        const isDuplicate = detailedHostelData.floors.some(f => f.floorNumber.toString() === floorNumber);
        if (isDuplicate) {
            setInlineError(`Floor number "${floorNumber}" already exists in this hostel.`);
        } else {
            setInlineError('');
        }
    }, [floorNumber, detailedHostelData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- UI Handlers ---

    const handleSelectHostel = (hostel) => {
        setSelectedHostel(hostel);
        setSearchTerm('');
        setIsDropdownVisible(false);
    };

    const clearSelection = () => {
        setSelectedHostel(null);
        setDetailedHostelData(null);
        setFloorNumber('');
        setInlineError('');
        setMessage('');
    };
    
    // YAHAN CHANGE HUA HAI: Ab search term khali hone par bhi saare hostels dikhenge
    const filteredHostels = hostels ? hostels.filter(h => 
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // --- Form Submission ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inlineError || !selectedHostel || !floorNumber) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}/floors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ floorNumber: Number(floorNumber) }),
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: `Floor ${floorNumber} added successfully to ${selectedHostel.name}!` });
                setFloorNumber(''); 
                const updatedResponse = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${selectedHostel._id}`, { credentials: 'include' });
                const updatedData = await updatedResponse.json();
                if (updatedData.success) {
                    setDetailedHostelData(updatedData.data);
                }
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to add floor' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!hostels) {
        return <div className="max-w-md mx-auto p-6 text-center"><Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" /><p className="mt-2 text-gray-500">Loading initial data...</p></div>;
    }

    return (
        <div className="max-w-md mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Floor Management Panel</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset className="space-y-2">
                    <legend className="text-lg font-semibold text-gray-800">1. Find Hostel</legend>
                    <div ref={searchContainerRef} className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsDropdownVisible(true)} placeholder="Search for a hostel..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {isDropdownVisible && (
                            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                                {filteredHostels.length > 0 ? (
                                    filteredHostels.map((h) => (
                                        <li key={h._id} onClick={() => handleSelectHostel(h)} className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-blue-50">
                                            {h.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-3 text-center text-gray-500">{searchTerm ? "No results found" : "No hostels available"}</li>
                                )}
                            </ul>
                        )}
                    </div>
                    {selectedHostel && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <p className="font-bold text-blue-800 flex items-center"><Building className="w-4 h-4 mr-2" />{selectedHostel.name}</p>
                            <button type="button" onClick={clearSelection} className="p-1.5 text-blue-600 hover:text-red-700 hover:bg-red-100 rounded-full" title="Change Hostel"><X className="w-4 h-4" /></button>
                        </div>
                    )}
                </fieldset>

                {selectedHostel && <HostelContextPanel hostelData={detailedHostelData} isFetching={isFetchingDetails} />}

                <fieldset className="space-y-2" disabled={!selectedHostel || isFetchingDetails}>
                    <legend className={`text-lg font-semibold ${selectedHostel ? 'text-gray-800' : 'text-gray-400'}`}>2. Add Floor Number</legend>
                    <div>
                        <input type="number" value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} placeholder={selectedHostel ? "Enter floor number" : "Select a hostel first"} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${inlineError ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-500'} disabled:bg-gray-100`} required min="0" />
                        {inlineError && <p className="mt-1 text-xs text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-1"/>{inlineError}</p>}
                    </div>
                </fieldset>

                <div>
                    {message && (<div className={`text-sm p-3 rounded-lg mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}{message.text}</div>)}
                    <button type="submit" disabled={isSubmitting || !!inlineError || !selectedHostel || !floorNumber} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        <span>{isSubmitting ? 'Adding...' : 'Add Floor'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFloorForm;