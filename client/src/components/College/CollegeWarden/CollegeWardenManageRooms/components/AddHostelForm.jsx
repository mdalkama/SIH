import React, { useState } from 'react';

const AddHostelForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        totalFloors: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            setLoading(true);
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/hostel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include cookies/session
                body: JSON.stringify({
                    ...formData,
                    totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Hostel created successfully!');
                setFormData({ name: '', address: '', totalFloors: '' });
                onSuccess();
            } else {
                setMessage(data.error || 'Failed to create hostel');
            }
        } catch (error) {
            setMessage('Error creating hostel');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Hostel</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hostel Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                    </label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Floors
                    </label>
                    <input
                        type="number"
                        value={formData.totalFloors}
                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Hostel'}
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

export default AddHostelForm;