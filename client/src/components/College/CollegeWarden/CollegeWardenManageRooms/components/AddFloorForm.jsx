import { useState } from "react";

const AddFloorForm = ({ hostels }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        floorNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            setLoading(true);
            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/hostel/${formData.hostelId}/floors`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // include cookies/session
                    body: JSON.stringify({
                        floorNumber: Number(formData.floorNumber) || 0, // ensure it's a number
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessage('Floor added successfully!');
                setFormData({ hostelId: '', floorNumber: '' });
                // optionally refetch floors here
                // fetchFloors(formData.hostelId);
            } else {
                setMessage(data.error || 'Failed to add floor');
            }
        } catch (error) {
            console.error('Error adding floor:', error);
            setMessage('Error adding floor');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Floor</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hostel *
                    </label>
                    <select
                        value={formData.hostelId}
                        onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
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
                        Floor Number *
                    </label>
                    <input
                        type="number"
                        value={formData.floorNumber}
                        onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.hostelId}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Floor'}
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
export default AddFloorForm