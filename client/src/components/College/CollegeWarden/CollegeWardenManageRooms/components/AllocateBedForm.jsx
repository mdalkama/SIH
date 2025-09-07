import { useState } from "react";

const AllocateBedForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        floorId: '',
        roomId: '',
        bedId: '',
        studentId: ''
    });
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchFloors = async (hostelId) => {
        try {
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors`,
                { credentials: 'include' }
            );
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            }
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const fetchRooms = async (hostelId, floorId) => {
        try {
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms`,
                { credentials: 'include' }
            );
            const data = await response.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchBeds = async (hostelId, floorId, roomId) => {
        try {
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${hostelId}/floors/${floorId}/rooms/${roomId}/beds`,
                { credentials: 'include' }
            );
            const data = await response.json();
            if (data.success) {
                // Only show vacant beds
                setBeds(data.data.map(bed => ({
                    ...bed,
                    isVacant: !bed.isOccupied
                })));
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
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
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors/${formData.floorId}/rooms/${formData.roomId}/beds/${formData.bedId}/allocate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: formData.studentId
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Bed allocated successfully!');
                setFormData({ hostelId: '', floorId: '', roomId: '', bedId: '', studentId: '' });
            } else {
                setMessage(data.error || 'Failed to allocate bed');
            }
        } catch (error) {
            setMessage('Error allocating bed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Allocate Bed</h2>

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
                                Room {room.roomNumber} ({room.vacantBeds} vacant)
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
                                Bed {bed.bedNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student ID *
                    </label>
                    <input
                        type="text"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Enter student ID"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.hostelId || !formData.floorId || !formData.roomId || !formData.bedId}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Allocating...' : 'Allocate Bed'}
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

export default AllocateBedForm;