import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Users, UserCheck, UserX, Filter, X, Eye, EyeOff } from 'lucide-react';

const UniversityAdminManageRoles = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        staffId: '',
        gender: '',
        salary: '',
        phone: '',
        department: '',
        subjects: []
    });

    // Available roles for University Admin
    const availableRoles = [
        { value: 'UniversityGoverningBody', label: 'Governing Body Member', endpoint: '/add-governing-body' },
        { value: 'UniversityRegistrar', label: 'University Registrar', endpoint: '/add-registrar' },
        { value: 'UniversityExaminationBody', label: 'Examination Body Member', endpoint: '/add-exam-body' }
    ];

    // Mock data - replace with actual API calls
    const [employees] = useState([
        {
            id: 1,
            name: 'Dr. John Smith',
            email: 'john.smith@university.edu',
            staffId: 'UGB001',
            role: 'UniversityGoverningBody',
            department: 'Administration',
            phone: '+91-9876543210',
            salary: 85000,
            gender: 'Male',
            status: 'Active',
            joinDate: '2023-01-15'
        },
        {
            id: 2,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@university.edu',
            staffId: 'REG001',
            role: 'UniversityRegistrar',
            department: 'Registry',
            phone: '+91-9876543211',
            salary: 95000,
            gender: 'Female',
            status: 'Active',
            joinDate: '2023-02-20'
        },
        {
            id: 3,
            name: 'Prof. Michael Brown',
            email: 'michael.brown@university.edu',
            staffId: 'EXM001',
            role: 'UniversityExaminationBody',
            department: 'Examinations',
            phone: '+91-9876543212',
            salary: 88000,
            gender: 'Male',
            status: 'Inactive',
            joinDate: '2023-03-10'
        }
    ]);

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            staffId: '',
            gender: '',
            salary: '',
            phone: '',
            department: '',
            subjects: []
        });
    };

    // const handleAddEmployee = async (roleEndpoint) => {
    //     setLoading(true);
    //     try {
    //         // Here you would make the API call
    //         // const response = await fetch(`/api/university-staff${roleEndpoint}`, {
    //         //   method: 'POST',
    //         //   headers: { 'Content-Type': 'application/json' },
    //         //   body: JSON.stringify(formData)
    //         // });

    //         // Mock success
    //         setTimeout(() => {
    //             setShowAddModal(false);
    //             resetForm();
    //             setLoading(false);
    //             alert('Employee added successfully!');
    //         }, 1500);
    //     } catch (error) {
    //         setLoading(false);
    //         alert('Error adding employee');
    //     }
    // };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.staffId.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'active') return matchesSearch && emp.status === 'Active';
        if (activeTab === 'inactive') return matchesSearch && emp.status === 'Inactive';
        return matchesSearch && emp.role === activeTab;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'UniversityGoverningBody': return 'bg-blue-100 text-blue-800';
            case 'UniversityRegistrar': return 'bg-green-100 text-green-800';
            case 'UniversityExaminationBody': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'UniversityGoverningBody': return 'Governing Body';
            case 'UniversityRegistrar': return 'Registrar';
            case 'UniversityExaminationBody': return 'Examination Body';
            default: return role;
        }
    };

    const getStats = () => {
        const total = employees.length;
        const active = employees.filter(emp => emp.status === 'Active').length;
        const inactive = employees.filter(emp => emp.status === 'Inactive').length;
        const governingBody = employees.filter(emp => emp.role === 'UniversityGoverningBody').length;
        const registrar = employees.filter(emp => emp.role === 'UniversityRegistrar').length;
        const examBody = employees.filter(emp => emp.role === 'UniversityExaminationBody').length;

        return { total, active, inactive, governingBody, registrar, examBody };
    };

    const stats = getStats();

    return (
        <div  className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 style={{ color: '#111827' }} className="text-3xl font-bold mb-2">Manage Employees</h1>
                    <p style={{ color: '#6B7280' }} className="text-base">Add and manage university staff members</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div className="flex items-center">
                            <Users size={20} style={{ color: '#2563EB' }} className="mr-2" />
                            <div>
                                <p style={{ color: '#6B7280' }} className="text-sm font-medium">Total</p>
                                <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div className="flex items-center">
                            <UserCheck size={20} style={{ color: '#059669' }} className="mr-2" />
                            <div>
                                <p style={{ color: '#6B7280' }} className="text-sm font-medium">Active</p>
                                <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.active}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div className="flex items-center">
                            <UserX size={20} style={{ color: '#D97706' }} className="mr-2" />
                            <div>
                                <p style={{ color: '#6B7280' }} className="text-sm font-medium">Inactive</p>
                                <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.inactive}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div>
                            <p style={{ color: '#6B7280' }} className="text-sm font-medium">Governing Body</p>
                            <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.governingBody}</p>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div>
                            <p style={{ color: '#6B7280' }} className="text-sm font-medium">Registrars</p>
                            <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.registrar}</p>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div>
                            <p style={{ color: '#6B7280' }} className="text-sm font-medium">Exam Body</p>
                            <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.examBody}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                    className="rounded-lg border shadow-sm">

                    {/* Controls */}
                    <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search size={18} style={{ color: '#6B7280' }}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{ backgroundColor: '#2563EB' }}
                                className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} className="mr-2" />
                                Add Employee
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-1 mt-6">
                            {[
                                { key: 'all', label: 'All Employees' },
                                { key: 'active', label: 'Active' },
                                { key: 'inactive', label: 'Inactive' },
                                { key: 'UniversityGoverningBody', label: 'Governing Body' },
                                { key: 'UniversityRegistrar', label: 'Registrar' },
                                { key: 'UniversityExaminationBody', label: 'Exam Body' }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Employee Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: '#E5E7EB' }}>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div style={{ color: '#111827' }} className="text-sm font-medium">
                                                    {employee.name}
                                                </div>
                                                <div style={{ color: '#6B7280' }} className="text-sm">
                                                    ID: {employee.staffId}
                                                </div>
                                                <div style={{ color: '#6B7280' }} className="text-sm">
                                                    {employee.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs text-nowrap font-medium rounded-full ${getRoleBadgeColor(employee.role)}`}>
                                                {getRoleDisplayName(employee.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div style={{ color: '#6B7280' }} className="text-sm text-nowrap">
                                                {employee.phone}
                                            </div>
                                            <div style={{ color: '#6B7280' }} className="text-sm">
                                                {employee.gender}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${employee.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-1 ${employee.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-12">
                                <Users size={48} style={{ color: '#6B7280' }} className="mx-auto mb-4" />
                                <p style={{ color: '#6B7280' }} className="text-lg">No employees found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-full w-full flex md:items-center items-start justify-center z-[100]">
                    <div style={{ backgroundColor: '#FFFFFF' }}
                        className="rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                            <div className="flex items-center justify-between">
                                <h2 style={{ color: '#111827' }} className="text-xl font-bold">Add New Employee</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Role Selection */}
                            <div>
                                <label style={{ color: '#111827' }} className="block text-sm font-medium mb-2">
                                    Employee Role *
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {availableRoles.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => {
                                                const selectedRoleData = availableRoles.find(r => r.value === role.value);
                                                if (selectedRoleData) {
                                                    // handleAddEmployee(selectedRoleData.endpoint);
                                                }
                                            }}
                                            disabled={loading}
                                            style={{ backgroundColor: '#2563EB' }}
                                            className="w-full p-4 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                        >
                                            <div className="font-medium">{role.label}</div>
                                            <div className="text-sm text-blue-100 mt-1">
                                                Click to add a new {role.label.toLowerCase()}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        Staff ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.staffId}
                                        onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter staff ID"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        Gender *
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        Salary *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter salary amount"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    style={{ borderColor: '#E5E7EB' }}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter department (optional)"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t flex justify-end space-x-3" style={{ borderColor: '#E5E7EB' }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                style={{ backgroundColor: '#2563EB' }}
                                className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add Employee'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityAdminManageRoles;