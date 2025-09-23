import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Users, UserCheck, UserX, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

// --- NEW SKELETON LOADER COMPONENT (with bg-slate-200) ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-300 h-20 bg-slate-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
                {[...Array(10)].map((_, i) => <div key={i} className="h-12 bg-slate-200 rounded-lg"></div>)}
            </div>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const UniversityAdminManageRoles = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEmployeeId, setDeleteEmployeeId] = useState('');
    const [deleteEmployeeName, setDeleteEmployeeName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Set initial loading to true
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState('');
    
    const [formData, setFormData] = useState({ name: '', email: '', password: '', staffId: '', gender: '', salary: '', phone: '', collegeCode: '', status: 'Active' });
    const [employees, setEmployees] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const availableRoles = [
        { value: 'UniversityGoverningBody', label: 'Governing Body Member', endpoint: '/add-governing-body' },
        { value: 'UniversityRegistrar', label: 'University Registrar', endpoint: '/add-registrar' },
        { value: 'UniversityExaminationBody', label: 'Examination Body Member', endpoint: '/add-exam-body' },
        { value: 'CollegeAdmin', label: 'College Admin', endpoint: '/add-college-admin' }
    ];

    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/add-university-Staff`, {
                    method: 'GET', credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch staff');
                const mapped = (data?.staff || []).map((s) => ({
                    id: s._id,
                    name: s.name,
                    email: s.email,
                    staffId: s.staffId,
                    role: s.role,
                    phone: s.phone,
                    salary: s.salary,
                    gender: s.gender ? s.gender.charAt(0).toUpperCase() + s.gender.slice(1) : '',
                    collegeCode: s.collegeCode || '',
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

    const processedData = useMemo(() => {
        let filtered = employees;
        if (activeTab !== 'all') {
            if (activeTab === 'active' || activeTab === 'inactive') { filtered = employees.filter(emp => emp.status.toLowerCase() === activeTab); } else { filtered = employees.filter(emp => emp.role === activeTab); }
        }
        if (searchTerm) { const lowercasedSearchTerm = searchTerm.toLowerCase(); filtered = filtered.filter(emp => emp.name.toLowerCase().includes(lowercasedSearchTerm) || emp.email.toLowerCase().includes(lowercasedSearchTerm) || emp.staffId.toLowerCase().includes(lowercasedSearchTerm)); }
        const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
        return { paginatedData: paginated, totalCount: filtered.length, filteredData: filtered };
    }, [employees, activeTab, searchTerm, currentPage, rowsPerPage]);

    const { paginatedData, totalCount, filteredData } = processedData;
    const handleTabChange = (tab) => { setActiveTab(tab); setCurrentPage(1); };
    const getRoleBadgeColor = (role) => { switch (role) { case 'UniversityGoverningBody': return 'bg-blue-100 text-blue-800'; case 'UniversityRegistrar': return 'bg-green-100 text-green-800'; case 'UniversityExaminationBody': return 'bg-orange-100 text-orange-800'; case 'CollegeAdmin': return 'bg-purple-100 text-purple-800'; default: return 'bg-gray-100 text-gray-800'; } };
    const getRoleDisplayName = (role) => { switch (role) { case 'UniversityGoverningBody': return 'Governing Body'; case 'UniversityRegistrar': return 'Registrar'; case 'UniversityExaminationBody': return 'Exam Body'; case 'CollegeAdmin': return 'College Admin'; default: return role; } };
    const getEndpointForSelectedRole = () => { const cfg = availableRoles.find(r => r.value === selectedRole); return cfg ? cfg.endpoint : ''; };
    const validateForm = () => { /* ... (user's existing logic) ... */ return true; };
    const resetForm = () => { setFormData({ name: '', email: '', password: '', staffId: '', gender: '', salary: '', phone: '', collegeCode: '', status: 'Active', }); setSelectedRole(''); setIsEditing(false); setEditingEmployeeId(''); setShowDeleteModal(false); setDeleteEmployeeId(''); setDeleteEmployeeName(''); };
    const handleAddOrUpdate = async () => { /* ... (user's existing logic) ... */ };
    const handleEditClick = (employee) => { setIsEditing(true); setEditingEmployeeId(employee.id); setShowAddModal(true); setSelectedRole(employee.role); setFormData({ name: employee.name || '', email: employee.email || '', password: '', staffId: employee.staffId || '', gender: (employee.gender || '').toLowerCase(), salary: employee.salary || '', phone: employee.phone || '', collegeCode: employee.collegeCode || '', status: employee.status || 'Active', }); };
    const handleDeleteClick = (employee) => { setDeleteEmployeeId(employee.id); setDeleteEmployeeName(employee.name); setShowDeleteModal(true); };
    const handleDeleteConfirm = async () => { /* ... (user's existing logic) ... */ };
    const stats = useMemo(() => ({ total: employees.length, active: employees.filter(emp => emp.status === 'Active').length, inactive: employees.filter(emp => emp.status === 'Inactive').length, governingBody: employees.filter(emp => emp.role === 'UniversityGoverningBody').length, registrar: employees.filter(emp => emp.role === 'UniversityRegistrar').length, examBody: employees.filter(emp => emp.role === 'UniversityExaminationBody').length, collegeAdmin: employees.filter(emp => emp.role === 'CollegeAdmin').length, }), [employees]);

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    <StatCard icon={<Users size={20} className="text-blue-600" />} title="Total Staff" value={stats.total} />
                    <StatCard icon={<UserCheck size={20} className="text-green-500" />} title="Active" value={stats.active} />
                    <StatCard icon={<UserX size={20} className="text-yellow-500" />} title="Inactive" value={stats.inactive} />
                    <StatCard title="College Admins" value={stats.collegeAdmin} />
                    <StatCard title="Registrars" value={stats.registrar} />
                    <StatCard title="Exam Bodies" value={stats.examBody} />
                    <StatCard title="Governing Bodies" value={stats.governingBody} />
                </div>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-4 border-b border-gray-200"><div className="flex flex-wrap gap-1">{[ { key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'inactive', label: 'Inactive' }, { key: 'UniversityGoverningBody', label: 'Governing Body' }, { key: 'UniversityRegistrar', label: 'Registrar' }, { key: 'UniversityExaminationBody', label: 'Exam Body' }, { key: 'CollegeAdmin', label: 'College Admin' } ].map(tab => (<button key={tab.key} onClick={() => handleTabChange(tab.key)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab.key ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>{tab.label}</button>))}</div></div>
                    <TableView searchTerm={searchTerm} onSearchChange={setSearchTerm} onAddClick={() => { resetForm(); setShowAddModal(true); }} >
                        <EmployeeTable employees={paginatedData} onEdit={handleEditClick} onDelete={handleDeleteClick} getRoleDisplayName={getRoleDisplayName} getRoleBadgeColor={getRoleBadgeColor} currentPage={currentPage} rowsPerPage={rowsPerPage} />
                        {paginatedData.length === 0 && (<div className="text-center py-12"><Users size={48} className="mx-auto mb-4 text-gray-400" /><p className="text-lg text-gray-500">No employees found</p>{searchTerm && <p className="text-sm text-gray-400">Try adjusting your search.</p>}</div>)}
                        <Pagination currentPage={currentPage} totalCount={totalCount} pageSize={rowsPerPage} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setRowsPerPage(size); setCurrentPage(1); }} filteredData={filteredData} />
                    </TableView>
                </div>
            </div>
            {showAddModal && <AddEditModal {...{ isEditing, showAddModal, setShowAddModal, formData, setFormData, selectedRole, setSelectedRole, availableRoles, getRoleDisplayName, loading, handleAddOrUpdate, resetForm }} />}
            {showDeleteModal && <DeleteModal {...{ setShowDeleteModal, deleteEmployeeName, handleDeleteConfirm, loading }} />}
        </div>
    );
};

// --- Child Components ---
const StatCard = ({ icon, title, value }) => ( <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">{icon}<div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div></div>);
const TableView = ({ searchTerm, onSearchChange, onAddClick, children }) => ( <div><div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3"><div className="relative w-full sm:w-64"><Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button onClick={onAddClick} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus size={18} className="mr-2" /> Add Employee</button></div><div className="overflow-x-auto"><div className="inline-block min-w-full align-middle">{children}</div></div></div>);
const EmployeeTable = ({ employees, onEdit, onDelete, getRoleDisplayName, getRoleBadgeColor, currentPage, rowsPerPage }) => ( <table className="w-full min-w-[800px]"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody className="divide-y divide-gray-200">{employees.map((employee, index) => { const itemNumber = (currentPage - 1) * rowsPerPage + index + 1; return (<tr key={employee.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td><td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{employee.name}</div><div className="text-sm text-gray-500 font-mono">ID: {employee.staffId}</div></td><td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(employee.role)}`}>{getRoleDisplayName(employee.role)}</span>{employee.collegeCode && <div className="text-xs text-gray-500 mt-1 font-mono">Code: {employee.collegeCode}</div>}</td><td className="px-6 py-4"><div className="text-sm text-gray-900">{employee.phone}</div><div className="text-sm text-gray-500">{employee.email}</div></td><td className="px-6 py-4"><span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}><div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${employee.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>{employee.status}</span></td><td className="px-6 py-4"><div className="flex space-x-3"><button onClick={() => onEdit(employee)} className="text-gray-500 hover:text-blue-600 transition-colors" title="Edit Employee"><Edit2 size={16} /></button><button onClick={() => onDelete(employee)} className="text-gray-500 hover:text-red-600 transition-colors" title="Delete Employee"><Trash2 size={16} /></button></div></td></tr>) })}</tbody></table>);
const Pagination = ({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange, filteredData }) => { const totalPages = Math.ceil(totalCount / pageSize); const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0; const endItem = Math.min(startItem + pageSize - 1, totalCount); const summaryStats = useMemo(() => { if (!filteredData) return {}; return { total: filteredData.length, active: filteredData.filter(e => e.status === 'Active').length, inactive: filteredData.filter(e => e.status === 'Inactive').length, } }, [filteredData]); return (<div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4"><div className="flex items-center gap-4"><div className="flex items-center gap-2"><span>Show:</span><select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-md bg-white"><option value="5">5</option><option value="10">10</option><option value="20">20</option></select></div><span>Showing {startItem}-{endItem} of {totalCount} records</span></div><div className="flex items-center gap-6"><div className="font-semibold flex gap-4"><span>Active: <span className="text-green-600">{summaryStats.active}</span></span><span>Inactive: <span className="text-yellow-600">{summaryStats.inactive}</span></span></div>{totalPages > 1 && (<div className="flex items-center gap-2"><span>Page {currentPage} of {totalPages}</span><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50">Previous</button><button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50">Next</button></div>)}</div></div>); };
const AddEditModal = ({ isEditing, setShowAddModal, formData, setFormData, selectedRole, setSelectedRole, availableRoles, getRoleDisplayName, loading, handleAddOrUpdate, resetForm }) => ( <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"><div className="p-6 border-b"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2><button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div></div><div className="p-6 space-y-6 overflow-y-auto">{!isEditing && (<div><label className="block text-sm font-medium text-gray-700 mb-2">Employee Role *</label><select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select role</option>{availableRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>)}{isEditing && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label><div className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-700">{getRoleDisplayName(selectedRole)}</div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div></div>)}<div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter full name" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter email address" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Staff ID *</label><input type="text" value={formData.staffId} onChange={(e) => setFormData({ ...formData, staffId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter staff ID" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label><input type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter salary amount" /></div></div>{!isEditing && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={'Enter password'} /></div>)}{selectedRole === 'CollegeAdmin' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">College Code *</label><input type="text" value={formData.collegeCode} onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter College Code" /></div>)}</div><div className="p-6 border-t flex justify-end space-x-3 bg-gray-50"><button onClick={() => { setShowAddModal(false); resetForm(); }} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button><button disabled={loading} onClick={handleAddOrUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Employee' : 'Add Employee')}</button></div></div></div>);
const DeleteModal = ({ setShowDeleteModal, deleteEmployeeName, handleDeleteConfirm, loading }) => ( <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="p-6 border-b"><h2 className="text-xl font-bold text-gray-800">Delete Employee</h2></div><div className="p-6"><div className="flex items-start"><div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"><Trash2 className="h-6 w-6 text-red-600" /></div><div className="ml-4 text-left"><h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3><p className="text-sm text-gray-500 mt-1">Are you sure you want to delete <span className="font-semibold">{deleteEmployeeName}</span>? This action cannot be undone.</p></div></div></div><div className="p-4 bg-gray-50 border-t flex justify-end space-x-3"><button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button><button disabled={loading} onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">{loading ? 'Deleting...' : 'Delete'}</button></div></div></div>);

export default UniversityAdminManageRoles;