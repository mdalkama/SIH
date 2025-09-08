import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Users, UserCheck, UserX, Filter, X, Eye, EyeOff } from 'lucide-react';

const UniversityAdminManageRoles = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEmployeeId, setDeleteEmployeeId] = useState('');
    const [deleteEmployeeName, setDeleteEmployeeName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState('');
    const API_BASE = 'https://sih-4ptm.onrender.com/api/v1';
    // const[role,setRole] = useState('UniversityGoverningBody');


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        staffId: '',
        gender: '',
        salary: '',
        phone: '',
        department: '',
        collegeId: '',
        subjects: []
    });

    // Available roles for University Admin
    const availableRoles = [
        { value: 'UniversityGoverningBody', label: 'Governing Body Member', endpoint: '/add-governing-body' },
        { value: 'UniversityRegistrar', label: 'University Registrar', endpoint: '/add-registrar' },
        { value: 'UniversityExaminationBody', label: 'Examination Body Member', endpoint: '/add-exam-body' },
        { value: 'CollegeAdmin', label: 'College Admin', endpoint: '/add-college-admin' }
    ];

    const [employees, setEmployees] = useState([
    ]);
    const [selectedRole, setSelectedRole] = useState('');
    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            try {
                const res = await fetch('https://sih-4ptm.onrender.com/api/v1/add-university-Staff', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                console.log('University staff API response:', data);

                const mapped = (data?.staff || []).map((s) => ({
                    id: s._id,
                    name: s.name,
                    email: s.email,
                    staffId: s.staffId,
                    role: s.role,
                    department: s.department,
                    phone: s.phone,
                    salary: s.salary,
                    gender: s.gender ? s.gender.charAt(0).toUpperCase() + s.gender.slice(1) : '',
                    status: s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : 'Active',
                    joinDate: s.createdAt ? s.createdAt.slice(0, 10) : '',
                }));

                setEmployees(mapped);
            } catch (e) {
                console.error('Failed to fetch university staff:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

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
            case 'CollegeAdmin': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'UniversityGoverningBody': return 'Governing Body';
            case 'UniversityRegistrar': return 'Registrar';
            case 'UniversityExaminationBody': return 'Examination Body';
            case 'CollegeAdmin': return 'College Admin';
            default: return role;
        }
    };

    const getEndpointForSelectedRole = () => {
        const cfg = availableRoles.find(r => r.value === selectedRole);
        return cfg ? cfg.endpoint : '';
    };

    const validateForm = () => {
        const required = ['name', 'email', 'staffId', 'gender', 'salary', 'phone'];
        for (const key of required) {
            if (!String(formData[key] || '').trim()) {
                alert(`${key} is required`);
                return false;
            }
        }
        if (!isEditing && !String(formData.password || '').trim()) {
            alert('password is required');
            return false;
        }
        if (!isEditing && !selectedRole) {
            alert('Please select a role');
            return false;
        }
        if (!isEditing && selectedRole === 'CollegeAdmin' && !String(formData.collegeId || '').trim()) {
            alert('collegeId is required for CollegeAdmin');
            return false;
        }
        return true;
    };

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
            collegeId: '',
            subjects: []
        });
        setSelectedRole('');
        setIsEditing(false);
        setEditingEmployeeId('');
        setShowDeleteModal(false);
        setDeleteEmployeeId('');
        setDeleteEmployeeName('');
    };

    const handleAddOrUpdate = async () => {
        if (!validateForm()) return;

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            staffId: formData.staffId,
            gender: formData.gender,
            salary: formData.salary,
            phone: formData.phone,
        };

        if (selectedRole === 'CollegeAdmin' && formData.collegeId) {
            payload.collegeId = formData.collegeId;
        }
        
        // For editing, include collegeId if it exists
        if (isEditing && formData.collegeId) {
            payload.collegeId = formData.collegeId;
        }

        if (isEditing && !payload.password) {
            delete payload.password;
        }

        try {
            setLoading(true);
            if (isEditing) {
                const res = await fetch(`${API_BASE}/add-university-Staff/${editingEmployeeId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed to update');

                setEmployees(prev => prev.map(emp => emp.id === editingEmployeeId ? {
                    ...emp,
                    name: data?.staff?.name ?? payload.name,
                    email: data?.staff?.email ?? payload.email,
                    phone: data?.staff?.phone ?? payload.phone,
                    salary: data?.staff?.salary ?? payload.salary,
                    gender: data?.staff?.gender ? data.staff.gender.charAt(0).toUpperCase() + data.staff.gender.slice(1) : emp.gender,
                    collegeId: data?.staff?.collegeId ?? payload.collegeId ?? emp.collegeId,
                } : emp));
            } else {
                const endpoint = getEndpointForSelectedRole();
                if (!endpoint) {
                    alert('Invalid role selection');
                    return;
                }
                const res = await fetch(`${API_BASE}/add-university-Staff${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ ...payload, role: selectedRole })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed to add');

                const s = data.staff;
                setEmployees(prev => [{
                    id: s._id,
                    name: s.name,
                    email: s.email,
                    staffId: s.staffId,
                    role: s.role,
                    department: s.department,
                    phone: s.phone,
                    salary: s.salary,
                    gender: s.gender ? s.gender.charAt(0).toUpperCase() + s.gender.slice(1) : '',
                    status: s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : 'Active',
                    joinDate: s.createdAt ? s.createdAt.slice(0, 10) : '',
                }, ...prev]);
            }

            resetForm();
            setShowAddModal(false);
        } catch (e) {
            console.error(e);
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (employee) => {
        setIsEditing(true);
        setEditingEmployeeId(employee.id);
        setShowAddModal(true);
        setSelectedRole(employee.role);
        setFormData({
            name: employee.name || '',
            email: employee.email || '',
            password: '',
            staffId: employee.staffId || '',
            gender: employee.gender || '',
            salary: employee.salary || '',
            phone: employee.phone || '',
            department: employee.department || '',
            collegeId: employee.collegeId || '',
            subjects: []
        });
    };

    const handleDeleteClick = (employee) => {
        setDeleteEmployeeId(employee.id);
        setDeleteEmployeeName(employee.name);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/add-university-Staff/${deleteEmployeeId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Failed to delete employee');

            // Remove employee from the list
            setEmployees(prev => prev.filter(emp => emp.id !== deleteEmployeeId));
            
            setShowDeleteModal(false);
            setDeleteEmployeeId('');
            setDeleteEmployeeName('');
        } catch (e) {
            console.error(e);
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const getStats = () => {
        const total = employees.length;
        const active = employees.filter(emp => emp.status === 'Active').length;
        const inactive = employees.filter(emp => emp.status === 'Inactive').length;
        const governingBody = employees.filter(emp => emp.role === 'UniversityGoverningBody').length;
        const registrar = employees.filter(emp => emp.role === 'UniversityRegistrar').length;
        const examBody = employees.filter(emp => emp.role === 'UniversityExaminationBody').length;
        const collegeAdmin = employees.filter(emp => emp.role === 'CollegeAdmin').length;
        return { total, active, inactive, governingBody, registrar, examBody, collegeAdmin };
    };
    const stats = getStats();

    return (
        <div  className="min-h-screen">
            <div className="max-w-7xl mx-auto">
             

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
                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div>
                            <p style={{ color: '#6B7280' }} className="text-sm font-medium">College Admin</p>
                            <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.collegeAdmin}</p>
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
                                onClick={() => { resetForm(); setShowAddModal(true); }}
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
                                { key: 'UniversityExaminationBody', label: 'Exam Body' },
                                { key: 'CollegeAdmin', label: 'College Admin' }
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
                                                <button 
                                                    onClick={() => handleEditClick(employee)} 
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Edit Employee"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(employee)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    title="Delete Employee"
                                                >
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
                                <h2 style={{ color: '#111827' }} className="text-xl font-bold">
                                    {isEditing ? 'Edit Employee' : 'Add New Employee'}
                                </h2>
                                <button
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Role Selection - Only show when adding new employee */}
                            {!isEditing && (
                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-2">
                                        Employee Role *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            style={{ borderColor: '#E5E7EB' }}
                                            className="w-full px-3 py-2 pr-10 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition appearance-none"
                                        >
                                            <option value="">Select role</option>
                                            {availableRoles.map(r => (
                                                <option key={r.value} value={r.value}>{r.label}</option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                                    </div>
                                </div>
                            )}

                            {/* Show current role when editing */}
                            {isEditing && (
                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-2">
                                        Current Role
                                    </label>
                                    <div className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-700">
                                        {getRoleDisplayName(selectedRole)}
                                    </div>
                                </div>
                            )}
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
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
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

                            {!isEditing && (
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
                            )}

                            

                            {selectedRole === 'CollegeAdmin' && (
                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        College ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.collegeId}
                                        onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter College ID"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t flex justify-end space-x-3" style={{ borderColor: '#E5E7EB' }}>
                            <button
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                style={{ backgroundColor: '#2563EB' }}
                                className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                onClick={handleAddOrUpdate}
                            >
                                {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Employee' : 'Add Employee')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-full w-full flex items-center justify-center z-[100]">
                    <div style={{ backgroundColor: '#FFFFFF' }}
                        className="rounded-lg shadow-xl w-full max-w-md">
                        
                        <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                            <div className="flex items-center justify-between">
                                <h2 style={{ color: '#111827' }} className="text-xl font-bold">Delete Employee</h2>
                                <button
                                    onClick={() => { setShowDeleteModal(false); setDeleteEmployeeId(''); setDeleteEmployeeName(''); }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                      {/* ye delete popup hai  */}
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <Trash2 size={24} className="text-red-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 style={{ color: '#111827' }} className="text-lg font-medium">
                                        Are you sure you want to delete this employee?
                                    </h3>
                                    <p style={{ color: '#6B7280' }} className="text-sm mt-1">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }} 
                                className="p-4 border rounded-lg">
                                <p style={{ color: '#991B1B' }} className="text-sm font-medium">
                                    Employee: <span className="font-semibold">{deleteEmployeeName}</span>
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t flex justify-end space-x-3" style={{ borderColor: '#E5E7EB' }}>
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeleteEmployeeId(''); setDeleteEmployeeName(''); }}
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                style={{ backgroundColor: '#DC2626' }}
                                className="px-4 py-2 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                onClick={handleDeleteConfirm}
                            >
                                {loading ? 'Deleting...' : 'Delete Employee'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityAdminManageRoles;