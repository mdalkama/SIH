import {useState} from 'react';

const ShiftStudentForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        newHostelId: '',
        newFloorId: '',
        newRoomId: '',
        newBedId: ''
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
                { credentials: 'include' } // include cookies/session
            );
            const data = await response.json();
            if (data.success) {
                setFloors(data.data);
            } else {
                console.error('Failed to fetch floors:', data.error);
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
            } else {
                console.error('Failed to fetch rooms:', data.error);
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
                setBeds(data.data.filter(bed => !bed.isOccupied));
            } else {
                console.error('Failed to fetch beds:', data.error);
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
        }
    };


    const handleHostelChange = (hostelId) => {
        setFormData({ ...formData, newHostelId: hostelId, newFloorId: '', newRoomId: '', newBedId: '' });
        if (hostelId) {
            fetchFloors(hostelId);
        } else {
            setFloors([]);
        }
        setRooms([]);
        setBeds([]);
    };

    const handleFloorChange = (floorId) => {
        setFormData({ ...formData, newFloorId: floorId, newRoomId: '', newBedId: '' });
        if (floorId && formData.newHostelId) {
            fetchRooms(formData.newHostelId, floorId);
        } else {
            setRooms([]);
        }
        setBeds([]);
    };

    const handleRoomChange = (roomId) => {
        setFormData({ ...formData, newRoomId: roomId, newBedId: '' });
        if (roomId && formData.newHostelId && formData.newFloorId) {
            fetchBeds(formData.newHostelId, formData.newFloorId, roomId);
        } else {
            setBeds([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel/shift-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Student shifted successfully!');
                setFormData({ studentId: '', newHostelId: '', newFloorId: '', newRoomId: '', newBedId: '' });
            } else {
                setMessage(data.error || 'Failed to shift student');
            }
        } catch (error) {
            setMessage('Error shifting student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shift Student</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Hostel *
                    </label>
                    <select
                        value={formData.newHostelId}
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
                        New Floor *
                    </label>
                    <select
                        value={formData.newFloorId}
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
                        New Room *
                    </label>
                    <select
                        value={formData.newRoomId}
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
                        New Bed *
                    </label>
                    <select
                        value={formData.newBedId}
                        onChange={(e) => setFormData({ ...formData, newBedId: e.target.value })}
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

                <button
                    type="submit"
                    disabled={loading || !formData.studentId || !formData.newHostelId || !formData.newFloorId || !formData.newRoomId || !formData.newBedId}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                    {loading ? 'Shifting...' : 'Shift Student'}
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
export default ShiftStudentForm;