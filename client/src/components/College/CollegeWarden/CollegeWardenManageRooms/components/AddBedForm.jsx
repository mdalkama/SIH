import { useState } from "react";

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
        setLoading(true);
        const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`, {
            method: "GET",
            credentials: "include", // include cookies/session
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        if (data.success) {
            setFloors(data.data);
        } else {
            console.error("Failed to fetch floors:", data.error || "Unknown error");
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
        const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`, {
            method: "GET",
            credentials: "include", // include cookies/session
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        if (data.success) {
            setRooms(data.data);
        } else {
            console.error("Failed to fetch rooms:", data.error || "Unknown error");
        }
    } catch (error) {
        console.error("Error fetching rooms:", error);
    } finally {
        setLoading(false);
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
        const res = await fetch(
            `https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms/${formData.roomId}/beds`,
            {
                method: "POST",
                credentials: "include", // include cookies/session
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bedNumber: formData.bedNumber,
                }),
            }
        );

        const data = await res.json();

        if (data.success) {
            setMessage("Bed added successfully!");
            setFormData({
                hostelId: "",
                floorId: "",
                roomId: "",
                bedNumber: "",
            });
        } else {
            setMessage(data.error || "Failed to add bed");
            console.error("Failed to add bed:", data.error);
        }
    } catch (error) {
        console.error("Error adding bed:", error);
        setMessage("Error adding bed");
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

export default AddBedForm;