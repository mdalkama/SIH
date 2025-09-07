import { useState } from "react";

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
        const res = await fetch(
            `https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms`,
            {
                method: "POST",
                credentials: "include", // include cookies/session
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomNumber: formData.roomNumber,
                    roomType: formData.roomType,
                    capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
                }),
            }
        );

        const data = await res.json();

        if (data.success) {
            setMessage("Room added successfully!");
            setFormData({
                hostelId: "",
                floorId: "",
                roomNumber: "",
                roomType: "",
                capacity: "",
            });
        } else {
            setMessage(data.error || "Failed to add room");
            console.error("Failed to add room:", data.error);
        }
    } catch (error) {
        console.error("Error adding room:", error);
        setMessage("Error adding room");
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

export default AddRoomForm;