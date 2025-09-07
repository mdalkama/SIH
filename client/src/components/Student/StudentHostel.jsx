import React, { useState } from 'react';
import { Home, User, Phone, MapPin, Plus, Send, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const HostelDashboard = () => {
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaint, setComplaint] = useState({
        category: '',
        priority: 'medium',
        title: '',
        description: '',
        roomNumber: ''
    });
    const [complaints, setComplaints] = useState([
        {
            id: 'C001',
            title: 'AC not working',
            category: 'Maintenance',
            status: 'In Progress',
            priority: 'high',
            date: '2024-09-05',
            description: 'Air conditioning unit stopped working yesterday'
        },
        {
            id: 'C002',
            title: 'Water pressure issue',
            category: 'Plumbing',
            status: 'Resolved',
            priority: 'medium',
            date: '2024-09-01',
            description: 'Low water pressure in bathroom tap'
        }
    ]);

    // Mock student data
    const studentData = {
        name: "Rahul Kumar",
        rollNumber: "2021CS001",
        hostelName: "Aryabhatta Hostel",
        blockNumber: "Block A",
        roomNumber: "A-205",
        roomType: "Double Occupancy",
        floorNumber: "2nd Floor",
        warden: "Dr. Priya Sharma",
        wardenContact: "+91-9876543210",
        checkInDate: "15 July 2024",
        roommate: "Amit Singh (2021CS002)"
    };

    const issueCategories = [
        'Maintenance', 'Electrical', 'Plumbing', 'Cleaning', 'Security',
        'Internet/WiFi', 'Food Quality', 'Noise Complaint', 'Room Change Request', 'Other'
    ];

    const handleComplaintSubmit = (e) => {
        e.preventDefault();
        const newComplaint = {
            id: `C${String(complaints.length + 1).padStart(3, '0')}`,
            ...complaint,
            status: 'Submitted',
            date: new Date().toISOString().split('T')[0]
        };
        setComplaints([newComplaint, ...complaints]);
        setComplaint({
            category: '',
            priority: 'medium',
            title: '',
            description: '',
            roomNumber: studentData.roomNumber
        });
        setShowComplaintForm(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'In Progress': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Submitted': return <AlertTriangle className="w-4 h-4 text-blue-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {studentData.name}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hostel Allocation Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <Home className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900">Your Allocation Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <User className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">{studentData.name}</p>
                                            <p className="text-sm text-gray-600">Roll No: {studentData.rollNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">{studentData.hostelName}</p>
                                            <p className="text-sm text-gray-600">{studentData.blockNumber}, Room {studentData.roomNumber}</p>
                                            <p className="text-sm text-gray-600">{studentData.floorNumber} • {studentData.roomType}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Phone className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Warden: {studentData.warden}</p>
                                            <p className="text-sm text-gray-600">{studentData.wardenContact}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Check-in Date</p>
                                        <p className="text-sm text-gray-600">{studentData.checkInDate}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Roommate</p>
                                        <p className="text-sm text-gray-600">{studentData.roommate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complaints Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Your Complaints</h2>
                                <button
                                    onClick={() => setShowComplaintForm(true)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Raise Complaint
                                </button>
                            </div>

                            <div className="space-y-4">
                                {complaints.map((comp) => (
                                    <div key={comp.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center">
                                                {getStatusIcon(comp.status)}
                                                <h3 className="font-medium text-gray-900 ml-2">{comp.title}</h3>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(comp.priority)}`}>
                                                {comp.priority} priority
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{comp.description}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>ID: {comp.id} • {comp.category}</span>
                                            <span>{comp.date} • Status: {comp.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <p className="font-medium text-gray-900">Room Change Request</p>
                                    <p className="text-sm text-gray-600">Apply for room change</p>
                                </button>
                                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <p className="font-medium text-gray-900">Visitor Pass</p>
                                    <p className="text-sm text-gray-600">Generate visitor pass</p>
                                </button>
                                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <p className="font-medium text-gray-900">Late Entry Pass</p>
                                    <p className="text-sm text-gray-600">Request late entry</p>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium text-gray-900">Security</p>
                                    <p className="text-sm text-gray-600">+91-9876543211</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Medical Emergency</p>
                                    <p className="text-sm text-gray-600">+91-9876543212</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Maintenance</p>
                                    <p className="text-sm text-gray-600">+91-9876543213</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaint Form Modal */}
                {showComplaintForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raise a Complaint</h3>

                            <form onSubmit={handleComplaintSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Issue Category *
                                    </label>
                                    <select
                                        value={complaint.category}
                                        onChange={(e) => setComplaint({ ...complaint, category: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {issueCategories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Room Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={complaint.roomNumber}
                                        onChange={(e) => setComplaint({ ...complaint, roomNumber: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={studentData.roomNumber}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority Level
                                    </label>
                                    <select
                                        value={complaint.priority}
                                        onChange={(e) => setComplaint({ ...complaint, priority: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Issue Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={complaint.title}
                                        onChange={(e) => setComplaint({ ...complaint, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Brief description of the issue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Detailed Description *
                                    </label>
                                    <textarea
                                        value={complaint.description}
                                        onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Provide detailed information about the issue..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Complaint
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowComplaintForm(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostelDashboard;