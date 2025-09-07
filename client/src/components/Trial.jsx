import React, { useState, useEffect } from 'react';
import { Search, Users, Building, Bed, Plus, Filter, Download, Edit, Trash2, ArrowRight, Check, X, AlertCircle, Calendar, MapPin, Phone, Mail, History, Transfer, FileText, BarChart3, Settings, ChevronDown, ChevronRight, Clock, UserCheck } from 'lucide-react';

const EnhancedHostelManagement = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedHostel, setSelectedHostel] = useState('hostel1');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [studentRegNo, setStudentRegNo] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [allocations, setAllocations] = useState([]);
    const [notification, setNotification] = useState(null);
    const [roomFilters, setRoomFilters] = useState({
        type: 'all',
        status: 'all',
        occupancy: 'all'
    });
    const [expandedRoom, setExpandedRoom] = useState(null);
    const [allocationHistory, setAllocationHistory] = useState([]);

    // Enhanced Mock Data
    const hostelStats = {
        totalHostels: 4,
        totalRooms: 120,
        totalBeds: 480,
        occupiedBeds: 342,
        occupancyRate: 71.25,
        maintenanceRooms: 8,
        availableBeds: 138
    };

    const hostels = {
        hostel1: {
            id: 'hostel1',
            name: 'Aryabhatta Boys Hostel',
            type: 'Boys',
            totalRooms: 60,
            occupiedBeds: 180,
            totalBeds: 240,
            blocks: [{
                blockName: 'A Block',
                floors: [{
                    floorNumber: 1,
                    rooms: [
                        {
                            roomNumber: 'A101',
                            capacity: 4,
                            occupied: 3,
                            type: 'quad',
                            status: 'available',
                            facilities: ['AC', 'WiFi', 'Study Table'],
                            maintenanceNotes: '',
                            beds: [
                                { bedNumber: 'B1', isOccupied: true, studentName: 'Raj Kumar', studentId: 'CS2021001', course: 'B.Tech CS', year: '3rd', contact: '+91 9876543210' },
                                { bedNumber: 'B2', isOccupied: true, studentName: 'Amit Singh', studentId: 'CS2021002', course: 'B.Tech CS', year: '3rd', contact: '+91 9876543211' },
                                { bedNumber: 'B3', isOccupied: true, studentName: 'Vikash Sharma', studentId: 'CS2021003', course: 'B.Tech CS', year: '3rd', contact: '+91 9876543212' },
                                { bedNumber: 'B4', isOccupied: false }
                            ]
                        },
                        {
                            roomNumber: 'A102',
                            capacity: 4,
                            occupied: 4,
                            type: 'quad',
                            status: 'full',
                            facilities: ['AC', 'WiFi', 'Study Table'],
                            maintenanceNotes: '',
                            beds: [
                                { bedNumber: 'B1', isOccupied: true, studentName: 'Rohit Verma', studentId: 'CS2021004', course: 'B.Tech EE', year: '2nd', contact: '+91 9876543213' },
                                { bedNumber: 'B2', isOccupied: true, studentName: 'Suresh Yadav', studentId: 'CS2021005', course: 'B.Tech EE', year: '2nd', contact: '+91 9876543214' },
                                { bedNumber: 'B3', isOccupied: true, studentName: 'Manoj Kumar', studentId: 'CS2021006', course: 'B.Tech ME', year: '4th', contact: '+91 9876543215' },
                                { bedNumber: 'B4', isOccupied: true, studentName: 'Deepak Singh', studentId: 'CS2021007', course: 'B.Tech ME', year: '4th', contact: '+91 9876543216' }
                            ]
                        },
                        {
                            roomNumber: 'A103',
                            capacity: 2,
                            occupied: 1,
                            type: 'double',
                            status: 'available',
                            facilities: ['WiFi', 'Study Table'],
                            maintenanceNotes: '',
                            beds: [
                                { bedNumber: 'B1', isOccupied: true, studentName: 'Ankit Raj', studentId: 'CS2021008', course: 'B.Tech CE', year: '1st', contact: '+91 9876543217' },
                                { bedNumber: 'B2', isOccupied: false }
                            ]
                        },
                        {
                            roomNumber: 'A104',
                            capacity: 4,
                            occupied: 0,
                            type: 'quad',
                            status: 'maintenance',
                            facilities: ['AC', 'WiFi', 'Study Table'],
                            maintenanceNotes: 'AC repair in progress',
                            beds: [
                                { bedNumber: 'B1', isOccupied: false },
                                { bedNumber: 'B2', isOccupied: false },
                                { bedNumber: 'B3', isOccupied: false },
                                { bedNumber: 'B4', isOccupied: false }
                            ]
                        },
                        {
                            roomNumber: 'A105',
                            capacity: 3,
                            occupied: 2,
                            type: 'triple',
                            status: 'available',
                            facilities: ['WiFi', 'Study Table'],
                            maintenanceNotes: '',
                            beds: [
                                { bedNumber: 'B1', isOccupied: true, studentName: 'Ravi Kumar', studentId: 'CS2021015', course: 'B.Tech IT', year: '2nd', contact: '+91 9876543218' },
                                { bedNumber: 'B2', isOccupied: true, studentName: 'Sanjay Singh', studentId: 'CS2021016', course: 'B.Tech IT', year: '2nd', contact: '+91 9876543219' },
                                { bedNumber: 'B3', isOccupied: false }
                            ]
                        },
                        {
                            roomNumber: 'A106',
                            capacity: 1,
                            occupied: 0,
                            type: 'single',
                            status: 'available',
                            facilities: ['AC', 'WiFi', 'Study Table', 'Attached Bathroom'],
                            maintenanceNotes: '',
                            beds: [
                                { bedNumber: 'B1', isOccupied: false }
                            ]
                        }
                    ]
                }]
            }]
        },
        hostel2: {
            id: 'hostel2',
            name: 'Kalpana Chawla Girls Hostel',
            type: 'Girls',
            totalRooms: 40,
            occupiedBeds: 102,
            totalBeds: 160,
            blocks: [{
                blockName: 'B Block',
                floors: [{
                    floorNumber: 1,
                    rooms: [
                        {
                            roomNumber: 'B101',
                            capacity: 3,
                            occupied: 2,
                            type: 'triple',
                            status: 'available',
                            facilities: ['AC', 'WiFi', 'Study Table'],
                            maintenanceNotes: '',
                            beds: [
                                { bedNumber: 'B1', isOccupied: true, studentName: 'Priya Kumari', studentId: 'CS2021009', course: 'B.Tech CS', year: '3rd', contact: '+91 9876543220' },
                                { bedNumber: 'B2', isOccupied: true, studentName: 'Anjali Singh', studentId: 'CS2021010', course: 'B.Tech CS', year: '3rd', contact: '+91 9876543221' },
                                { bedNumber: 'B3', isOccupied: false }
                            ]
                        },
                        {
                            roomNumber: 'B102',
                            capacity: 2,
                            occupied: 2,
                            type: 'double',
                            status: 'full',
                            facilities: ['WiFi', 'Study Table'],
                            maintenanceNotes: '',
                            beds: [
                                { bedNumber: 'B1', isOccupied: true, studentName: 'Neha Sharma', studentId: 'CS2021011', course: 'B.Tech EE', year: '2nd', contact: '+91 9876543222' },
                                { bedNumber: 'B2', isOccupied: true, studentName: 'Ritu Yadav', studentId: 'CS2021012', course: 'B.Tech EE', year: '2nd', contact: '+91 9876543223' }
                            ]
                        }
                    ]
                }]
            }]
        }
    };

    const mockStudents = {
        'CS2021013': {
            regNo: 'CS2021013',
            name: 'Rahul Gupta',
            course: 'B.Tech Computer Science',
            year: '3rd Year',
            gender: 'Male',
            contact: '+91 9876543210',
            email: 'rahul.gupta@college.edu',
            previousHostel: null,
            specialRequirements: 'Ground floor preferred',
            profilePic: null,
            guardianContact: '+91 9876543299',
            address: 'Village Patna, Bihar',
            bloodGroup: 'O+',
            medicalConditions: 'None'
        },
        'CS2021014': {
            regNo: 'CS2021014',
            name: 'Kavita Devi',
            course: 'B.Tech Electronics',
            year: '2nd Year',
            gender: 'Female',
            contact: '+91 9876543211',
            email: 'kavita.devi@college.edu',
            previousHostel: 'hostel2',
            specialRequirements: 'None',
            profilePic: null,
            guardianContact: '+91 9876543298',
            address: 'Village Gaya, Bihar',
            bloodGroup: 'B+',
            medicalConditions: 'None'
        },
        'CS2021017': {
            regNo: 'CS2021017',
            name: 'Sunita Kumari',
            course: 'B.Tech Information Technology',
            year: '1st Year',
            gender: 'Female',
            contact: '+91 9876543224',
            email: 'sunita.kumari@college.edu',
            previousHostel: null,
            specialRequirements: 'Vegetarian mess preferred',
            profilePic: null,
            guardianContact: '+91 9876543297',
            address: 'Village Muzaffarpur, Bihar',
            bloodGroup: 'A+',
            medicalConditions: 'Asthma'
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchStudentData = () => {
        if (studentRegNo && mockStudents[studentRegNo]) {
            setSelectedStudent(mockStudents[studentRegNo]);
            showNotification(`Student data fetched successfully for ${studentRegNo}`);
        } else if (studentRegNo) {
            showNotification('Student not found in database', 'error');
            setSelectedStudent(null);
        }
    };

    const allocateStudent = (hostelId, roomNumber, bedNumber) => {
        if (!selectedStudent) return;

        const newAllocation = {
            id: Date.now(),
            student: selectedStudent,
            hostelId,
            hostelName: hostels[hostelId].name,
            roomNumber,
            bedNumber,
            allocationDate: new Date().toLocaleDateString(),
            academicYear: '2024-25',
            status: 'active',
            fees: 'Paid'
        };

        const historyEntry = {
            id: Date.now() + 1,
            studentId: selectedStudent.regNo,
            studentName: selectedStudent.name,
            action: 'Allocated',
            hostel: hostels[hostelId].name,
            room: roomNumber,
            bed: bedNumber,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            warden: 'Current User'
        };

        setAllocations([...allocations, newAllocation]);
        setAllocationHistory([...allocationHistory, historyEntry]);
        showNotification(`Successfully allocated ${selectedStudent.name} to ${roomNumber}-${bedNumber}`);
        setSelectedStudent(null);
        setStudentRegNo('');
    };

    const removeAllocation = (allocationId) => {
        const allocation = allocations.find(a => a.id === allocationId);
        if (allocation) {
            setAllocations(allocations.filter(a => a.id !== allocationId));

            const historyEntry = {
                id: Date.now(),
                studentId: allocation.student.regNo,
                studentName: allocation.student.name,
                action: 'Deallocated',
                hostel: allocation.hostelName,
                room: allocation.roomNumber,
                bed: allocation.bedNumber,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                warden: 'Current User'
            };

            setAllocationHistory([...allocationHistory, historyEntry]);
            showNotification(`Allocation removed for ${allocation.student.name}`, 'success');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800 border-green-200';
            case 'full': return 'bg-red-100 text-red-800 border-red-200';
            case 'maintenance': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getRoomColor = (room) => {
        if (room.status === 'maintenance') return 'bg-gray-50 border-gray-300 hover:bg-gray-100';
        if (room.status === 'full') return 'bg-red-50 border-red-300 hover:bg-red-100';
        if (room.occupied > 0) return 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100';
        return 'bg-green-50 border-green-300 hover:bg-green-100';
    };

    const getCompatibleRooms = (student) => {
        const compatibleHostels = Object.values(hostels).filter(hostel =>
            (student.gender === 'Male' && hostel.type === 'Boys') ||
            (student.gender === 'Female' && hostel.type === 'Girls')
        );

        let availableRooms = [];
        compatibleHostels.forEach(hostel => {
            hostel.blocks.forEach(block => {
                block.floors.forEach(floor => {
                    floor.rooms.forEach(room => {
                        if (room.status === 'available' && room.occupied < room.capacity) {
                            // Calculate compatibility score based on course/year matching
                            const occupiedBeds = room.beds.filter(bed => bed.isOccupied);
                            let compatibilityScore = 0;
                            occupiedBeds.forEach(bed => {
                                if (bed.course === student.course) compatibilityScore += 2;
                                if (bed.year === student.year) compatibilityScore += 1;
                            });

                            availableRooms.push({
                                ...room,
                                hostelName: hostel.name,
                                hostelId: hostel.id,
                                availableBeds: room.beds.filter(bed => !bed.isOccupied),
                                compatibilityScore,
                                currentOccupants: occupiedBeds
                            });
                        }
                    });
                });
            });
        });

        // Sort by compatibility score (higher is better)
        return availableRooms.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    };

    const filteredRooms = () => {
        const hostel = hostels[selectedHostel];
        if (!hostel) return [];

        let rooms = [];
        hostel.blocks.forEach(block => {
            block.floors.forEach(floor => {
                rooms.push(...floor.rooms);
            });
        });

        return rooms.filter(room => {
            if (roomFilters.type !== 'all' && room.type !== roomFilters.type) return false;
            if (roomFilters.status !== 'all' && room.status !== roomFilters.status) return false;
            if (roomFilters.occupancy !== 'all') {
                if (roomFilters.occupancy === 'empty' && room.occupied > 0) return false;
                if (roomFilters.occupancy === 'partial' && (room.occupied === 0 || room.occupied === room.capacity)) return false;
                if (roomFilters.occupancy === 'full' && room.occupied !== room.capacity) return false;
            }
            return true;
        });
    };

    const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle, trend }) => (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    {trend && <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                    </p>}
                </div>
                <div className={`bg-${color}-100 p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-left w-full"
        >
            <div className={`bg-${color}-100 p-2 rounded-lg flex-shrink-0`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div>
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Building className="w-8 h-8 text-blue-600" />
                            <h1 className="text-xl font-semibold text-gray-900">Enhanced Hostel Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Download className="w-4 h-4" />
                                <span>Export Report</span>
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', name: 'Dashboard', icon: BarChart3 },
                            { id: 'hostels', name: 'Hostel Management', icon: Building },
                            { id: 'allocation', name: 'Student Allocation', icon: Users },
                            { id: 'reports', name: 'Reports & Analytics', icon: FileText }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className="fixed top-20 right-4 z-50">
                    <div className={`flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'error'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-green-50 text-green-800 border border-green-200'
                        }`}>
                        {notification.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 mr-2" />
                        ) : (
                            <Check className="w-5 h-5 mr-2" />
                        )}
                        <span>{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Enhanced Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Hostels"
                                value={hostelStats.totalHostels}
                                icon={Building}
                                color="blue"
                                trend={0}
                            />
                            <StatCard
                                title="Occupied Beds"
                                value={hostelStats.occupiedBeds}
                                icon={Bed}
                                color="green"
                                subtitle={`${hostelStats.availableBeds} available`}
                                trend={5.2}
                            />
                            <StatCard
                                title="Occupancy Rate"
                                value={`${hostelStats.occupancyRate}%`}
                                icon={Users}
                                color="purple"
                                subtitle="Above target (70%)"
                                trend={2.1}
                            />
                            <StatCard
                                title="Maintenance"
                                value={hostelStats.maintenanceRooms}
                                icon={AlertCircle}
                                color="orange"
                                subtitle="Rooms under maintenance"
                                trend={-12}
                            />
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <QuickActionCard
                                    title="Allocate New Student"
                                    description="Search and allocate student to available rooms"
                                    icon={UserCheck}
                                    color="blue"
                                    onClick={() => setActiveTab('allocation')}
                                />
                                <QuickActionCard
                                    title="Room Management"
                                    description="View and manage all rooms across hostels"
                                    icon={Building}
                                    color="green"
                                    onClick={() => setActiveTab('hostels')}
                                />
                                <QuickActionCard
                                    title="Generate Reports"
                                    description="Create occupancy and allocation reports"
                                    icon={FileText}
                                    color="purple"
                                    onClick={() => setActiveTab('reports')}
                                />
                                <QuickActionCard
                                    title="Transfer Student"
                                    description="Move students between rooms and hostels"
                                    icon={Transfer}
                                    color="orange"
                                    onClick={() => { }}
                                />
                                <QuickActionCard
                                    title="Maintenance Requests"
                                    description="View and manage room maintenance tasks"
                                    icon={AlertCircle}
                                    color="red"
                                    onClick={() => { }}
                                />
                                <QuickActionCard
                                    title="Allocation History"
                                    description="Track all allocation changes and history"
                                    icon={History}
                                    color="gray"
                                    onClick={() => { }}
                                />
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Allocations */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Recent Allocations</h3>
                                    <button className="text-blue-600 text-sm hover:text-blue-700">View All</button>
                                </div>
                                {allocations.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No recent allocations</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {allocations.slice(-5).reverse().map((allocation) => (
                                            <div key={allocation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {allocation.student.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {allocation.roomNumber}-{allocation.bedNumber} • {allocation.allocationDate}
                                                    </p>
                                                </div>
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                    {allocation.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Maintenance Alerts */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Maintenance Alerts</h3>
                                    <button className="text-orange-600 text-sm hover:text-orange-700">View All</button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Room A104 - AC Repair</p>
                                            <p className="text-sm text-gray-600">Started 2 days ago</p>
                                        </div>
                                        <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">In Progress</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Room B205 - Plumbing</p>
                                            <p className="text-sm text-gray-600">Scheduled for tomorrow</p>
                                        </div>
                                        <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">Scheduled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Hostel Management Tab */}
                {activeTab === 'hostels' && (
                    <div className="space-y-6">
                        {/* Hostel Selection and Filters */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Room Management</h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    <select
                                        value={selectedHostel}
                                        onChange={(e) => setSelectedHostel(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {Object.entries(hostels).map(([id, hostel]) => (
                                            <option key={id} value={id}>{hostel.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={roomFilters.type}
                                        onChange={(e) => setRoomFilters({ ...roomFilters, type: e.target.value })}
                                        className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Room Types</option>
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="triple">Triple</option>
                                        <option value="quad">Quad</option>
                                    </select>

                                    <select
                                        value={roomFilters.status}
                                        onChange={(e) => setRoomFilters({ ...roomFilters, status: e.target.value })}
                                        className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="available">Available</option>
                                        <option value="full">Full</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>

                                    <select
                                        value={roomFilters.occupancy}
                                        onChange={(e) => setRoomFilters({ ...roomFilters, occupancy: e.target.value })}
                                        className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Occupancy</option>
                                        <option value="empty">Empty</option>
                                        <option value="partial">Partially Occupied</option>
                                        <option value="full">Full</option>
                                    </select>
                                </div>
                            </div>

                            {/* Hostel Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{hostels[selectedHostel]?.totalRooms || 0}</p>
                                    <p className="text-sm text-gray-600">Total Rooms</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{hostels[selectedHostel]?.occupiedBeds || 0}</p>
                                    <p className="text-sm text-gray-600">Occupied Beds</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">{hostels[selectedHostel]?.totalBeds || 0}</p>
                                    <p className="text-sm text-gray-600">Total Beds</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                        {hostels[selectedHostel] ? Math.round((hostels[selectedHostel].occupiedBeds / hostels[selectedHostel].totalBeds) * 100) : 0}%
                                    </p>
                                    <p className="text-sm text-gray-600">Occupancy Rate</p>
                                </div>
                            </div>

                            {/* Enhanced Room Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {filteredRooms().map((room) => (
                                    <div
                                        key={room.roomNumber}
                                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${getRoomColor(room)} ${expandedRoom === room.roomNumber ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-gray-900">{room.roomNumber}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getStatusColor(room.status)}`}>
                                                {room.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">{room.occupied}/{room.capacity}</span> occupied
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">{room.type} room</p>
                                        </div>

                                        {/* Occupancy Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${room.status === 'maintenance' ? 'bg-gray-400' :
                                                        room.status === 'full' ? 'bg-red-400' :
                                                            room.occupied > 0 ? 'bg-yellow-400' : 'bg-green-400'
                                                    }`}
                                                style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                                            ></div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedRoom(room);
                                                }}
                                                className="flex-1 bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-50 transition-colors"
                                            >
                                                <Edit className="w-3 h-3 inline mr-1" />
                                                Details
                                            </button>
                                            {room.status !== 'maintenance' && room.occupied < room.capacity && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveTab('allocation');
                                                    }}
                                                    className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3 inline mr-1" />
                                                    Allocate
                                                </button>
                                            )}
                                        </div>

                                        {/* Maintenance indicator */}
                                        {room.maintenanceNotes && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {filteredRooms().length === 0 && (
                                <div className="text-center py-12">
                                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No rooms match the current filters</p>
                                    <button
                                        onClick={() => setRoomFilters({ type: 'all', status: 'all', occupancy: 'all' })}
                                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Room Details Panel */}
                        {selectedRoom && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Room {selectedRoom.roomNumber} - {hostels[selectedHostel]?.name}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedRoom(null)}
                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Room Information */}
                                    <div className="lg:col-span-1">
                                        <h4 className="font-semibold text-gray-900 mb-4">Room Information</h4>
                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Capacity:</span>
                                                <span className="font-medium">{selectedRoom.capacity} beds</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Type:</span>
                                                <span className="font-medium capitalize">{selectedRoom.type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedRoom.status)}`}>
                                                    {selectedRoom.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Occupied:</span>
                                                <span className="font-medium">{selectedRoom.occupied}/{selectedRoom.capacity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Available:</span>
                                                <span className="font-medium text-green-600">{selectedRoom.capacity - selectedRoom.occupied}</span>
                                            </div>
                                        </div>

                                        {/* Facilities */}
                                        <h5 className="font-semibold text-gray-900 mt-6 mb-3">Facilities</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRoom.facilities.map((facility, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    {facility}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Maintenance Notes */}
                                        {selectedRoom.maintenanceNotes && (
                                            <div className="mt-6">
                                                <h5 className="font-semibold text-gray-900 mb-3">Maintenance Notes</h5>
                                                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                                    <p className="text-sm text-orange-800">{selectedRoom.maintenanceNotes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bed Allocation */}
                                    <div className="lg:col-span-2">
                                        <h4 className="font-semibold text-gray-900 mb-4">Bed Allocation</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedRoom.beds.map((bed) => (
                                                <div key={bed.bedNumber} className={`p-4 rounded-lg border-2 transition-all ${bed.isOccupied ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-bold text-gray-900">{bed.bedNumber}</span>
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${bed.isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {bed.isOccupied ? 'Occupied' : 'Available'}
                                                        </span>
                                                    </div>

                                                    {bed.isOccupied ? (
                                                        <div className="space-y-2">
                                                            <p className="font-semibold text-gray-900">{bed.studentName}</p>
                                                            <p className="text-sm text-gray-600">{bed.studentId}</p>
                                                            <p className="text-sm text-gray-600">{bed.course}</p>
                                                            <p className="text-sm text-gray-600">{bed.year}</p>
                                                            <div className="flex items-center space-x-2 mt-3">
                                                                <Phone className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm text-gray-600">{bed.contact}</span>
                                                            </div>
                                                            <div className="flex space-x-2 mt-3">
                                                                <button className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                                                                    <Edit className="w-3 h-3 inline mr-1" />
                                                                    Edit
                                                                </button>
                                                                <button className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                                                                    <Trash2 className="w-3 h-3 inline mr-1" />
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <Bed className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                            <p className="text-sm text-gray-600 mb-3">This bed is available</p>
                                                            <button
                                                                onClick={() => setActiveTab('allocation')}
                                                                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3 inline mr-1" />
                                                                Allocate Student
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Enhanced Student Allocation Tab */}
                {activeTab === 'allocation' && (
                    <div className="space-y-6">
                        {/* Student Search Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Student Search & Information</h3>
                            <div className="flex items-end space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter registration number (e.g., CS2021013)"
                                        value={studentRegNo}
                                        onChange={(e) => setStudentRegNo(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && fetchStudentData()}
                                    />
                                </div>
                                <button
                                    onClick={fetchStudentData}
                                    disabled={!studentRegNo}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Fetch Data</span>
                                </button>
                            </div>

                            <div className="mt-4 text-sm text-gray-600">
                                <p>Available test registration numbers: CS2021013 (Male), CS2021014 (Female), CS2021017 (Female)</p>
                            </div>
                        </div>

                        {/* Enhanced Student Profile Display */}
                        {selectedStudent && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Student Profile</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* Profile Picture Placeholder */}
                                    <div className="lg:col-span-1">
                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-16 h-16 text-gray-400" />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold text-xl text-gray-900">{selectedStudent.name}</h4>
                                            <p className="text-gray-600">{selectedStudent.regNo}</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${selectedStudent.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                                                }`}>
                                                {selectedStudent.gender}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Academic Information */}
                                    <div className="lg:col-span-1">
                                        <h5 className="font-semibold text-gray-900 mb-3">Academic Information</h5>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-sm text-gray-600">Course</span>
                                                <p className="font-medium">{selectedStudent.course}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Year</span>
                                                <p className="font-medium">{selectedStudent.year}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Previous Hostel</span>
                                                <p className="font-medium">{selectedStudent.previousHostel || 'None'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="lg:col-span-1">
                                        <h5 className="font-semibold text-gray-900 mb-3">Contact Information</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{selectedStudent.contact}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{selectedStudent.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <span className="text-xs text-gray-500">Guardian</span>
                                                    <p className="text-sm">{selectedStudent.guardianContact}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{selectedStudent.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="lg:col-span-1">
                                        <h5 className="font-semibold text-gray-900 mb-3">Additional Information</h5>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-sm text-gray-600">Blood Group</span>
                                                <p className="font-medium">{selectedStudent.bloodGroup}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Medical Conditions</span>
                                                <p className="font-medium">{selectedStudent.medicalConditions}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Special Requirements</span>
                                                <p className="font-medium">{selectedStudent.specialRequirements}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Available Room Options */}
                        {selectedStudent && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Available Room Options for {selectedStudent.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Showing rooms in {selectedStudent.gender === 'Male' ? 'Boys' : 'Girls'} hostels, sorted by compatibility score
                                </p>

                                {getCompatibleRooms(selectedStudent).length === 0 ? (
                                    <div className="text-center py-12">
                                        <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No compatible rooms available</p>
                                        <p className="text-gray-400 text-sm mt-2">All rooms in compatible hostels are either full or under maintenance</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {getCompatibleRooms(selectedStudent).map((room, index) => (
                                            <div key={`${room.hostelId}-${room.roomNumber}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-gray-900">{room.hostelName}</h4>
                                                        <p className="text-gray-600">Room {room.roomNumber}</p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <span className="text-sm text-gray-500 capitalize">{room.type} room</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="text-sm text-gray-500">{room.capacity - room.occupied} beds available</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {index === 0 && room.compatibilityScore > 0 && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                                                Best Match
                                                            </span>
                                                        )}
                                                        {room.compatibilityScore > 0 && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Compatibility: {room.compatibilityScore}/3
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Room Facilities */}
                                                <div className="mb-4">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Facilities</h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {room.facilities.slice(0, 3).map((facility, i) => (
                                                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                                                {facility}
                                                            </span>
                                                        ))}
                                                        {room.facilities.length > 3 && (
                                                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                                                +{room.facilities.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Available Beds */}
                                                <div className="mb-4">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Available Beds</h5>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {room.availableBeds.map((bed) => (
                                                            <button
                                                                key={bed.bedNumber}
                                                                onClick={() => allocateStudent(room.hostelId, room.roomNumber, bed.bedNumber)}
                                                                className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                                                            >
                                                                <span className="text-sm font-medium text-gray-900">{bed.bedNumber}</span>
                                                                <div className="flex items-center space-x-1">
                                                                    <span className="text-xs text-green-700 group-hover:hidden">Available</span>
                                                                    <Plus className="w-4 h-4 text-green-600 hidden group-hover:block" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Current Roommates */}
                                                {room.currentOccupants.length > 0 && (
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Current Roommates</h5>
                                                        <div className="space-y-1">
                                                            {room.currentOccupants.map((occupant) => (
                                                                <div key={occupant.bedNumber} className="flex items-center justify-between text-sm">
                                                                    <span className="text-gray-900">{occupant.studentName}</span>
                                                                    <div className="text-right">
                                                                        <p className="text-gray-600">{occupant.course}</p>
                                                                        <p className="text-gray-500 text-xs">{occupant.year}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Enhanced Current Allocations Management */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Current Allocations</h3>
                                <div className="flex items-center space-x-2">
                                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                                        <Download className="w-4 h-4" />
                                        <span>Export List</span>
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-sm text-gray-600">{allocations.length} active allocations</span>
                                </div>
                            </div>

                            {allocations.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No allocations yet</p>
                                    <p className="text-gray-400 text-sm mt-2">Start by searching for a student above to create the first allocation</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel & Room</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {allocations.map((allocation) => (
                                                <tr key={allocation.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                                                <Users className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{allocation.student.name}</p>
                                                                <p className="text-sm text-gray-500">{allocation.student.regNo}</p>
                                                                <p className="text-xs text-gray-400">{allocation.student.course}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{allocation.hostelName}</p>
                                                            <p className="text-sm text-gray-500">{allocation.roomNumber} - {allocation.bedNumber}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">{allocation.allocationDate}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">{allocation.academicYear}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {allocation.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50">
                                                                <Transfer className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeAllocation(allocation.id)}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                </div>
            </div>
    );
}

export default EnhancedHostelManagement