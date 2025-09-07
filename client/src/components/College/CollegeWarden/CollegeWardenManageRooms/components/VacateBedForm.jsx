import { useState } from "react";

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
            const res = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`,
                { credentials: "include" }
            );
            const data = await res.json();
            if (data.success) {
                setFloors(data.data || []);
            } else {
                console.error("Failed to fetch floors:", data.error || "Unknown error");
            }
        } catch (err) {
            console.error("Error fetching floors:", err);
        }
    };

    const fetchRooms = async (hostelId, floorId) => {
        try {
            const res = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`,
                { credentials: "include" }
            );
            const data = await res.json();
            if (data.success) {
                setRooms(data.data || []);
            } else {
                console.error("Failed to fetch rooms:", data.error || "Unknown error");
            }
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };

    const fetchBeds = async (hostelId, floorId, roomId) => {
        try {
            const res = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`,
                { credentials: "include" }
            );
            const data = await res.json();
            if (data.success) {
                // ✅ Show vacant + occupied, with vacancy flag
                setBeds(
                    (data.data || []).map((bed) => ({
                        ...bed,
                        isVacant: !bed.isOccupied,
                    }))
                );
            } else {
                console.error("Failed to fetch beds:", data.error || "Unknown error");
            }
        } catch (err) {
            console.error("Error fetching beds:", err);
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
            const res = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms/${formData.roomId}/beds/${formData.bedId}/vacate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // agar session/cookies use ho rahe ho
                }
            );

            const data = await res.json();

            if (data.success) {
                setMessage("Bed vacated successfully!");
                setFormData({
                    hostelId: "",
                    floorId: "",
                    roomId: "",
                    bedId: "",
                });

                // Optionally refresh beds list
                // fetchBeds(formData.hostelId, formData.floorId, formData.roomId);
            } else {
                setMessage(data.error || "Failed to vacate bed");
            }
        } catch (err) {
            console.error("Error vacating bed:", err);
            setMessage("Error vacating bed");
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
export default VacateBedForm;