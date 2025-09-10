import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Edit, X, Loader2, Building, User, Search, ChevronLeft, ChevronRight, Trash2, AlertTriangle, CheckCircle, BarChart2, Info, Eye, EyeOff, BookOpen } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/manage-college';


// --- Main Component ---
const UniversityCollegeManager = () => {
    const [colleges, setColleges] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingCollege, setDeletingCollege] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [toasts, setToasts] = useState([]);

    // Toolbar State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalColleges, setTotalColleges] = useState(0);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    // Fetch all courses for the dropdowns, once on mount
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await fetch("https://sih-4ptm.onrender.com/api/v1/course", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch courses list");
                }

                const data = await response.json();

                // Handle different possible API response structures for courses
                if (Array.isArray(data.data)) {
                    setAllCourses(data.data);
                } else if (Array.isArray(data)) {
                    setAllCourses(data);
                } else if (data.courses) {
                    setAllCourses(data.courses);
                } else {
                    setAllCourses([]);
                }
            } catch (err) {
                addToast("error", err.message);
            }
        };

        fetchAllCourses();
    }, []);


    // Fetch colleges based on filters/pagination
    useEffect(() => {
        const fetchColleges = async () => {
            setIsPageLoading(true);
            setError('');
            try {
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: rowsPerPage,
                    search: searchTerm,
                    status: statusFilter,
                });

                const response = await fetch(`${API_BASE_URL}?${params.toString()}`, { credentials: 'include' });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch colleges.');
                }

                const data = await response.json();
                setColleges(data.colleges || []);
                setTotalColleges(data.totalDocs || 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsPageLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchColleges();
        }, 300); // Debounce search input

        return () => clearTimeout(debounceFetch);
    }, [currentPage, rowsPerPage, searchTerm, statusFilter]);


    const openModalForCreate = () => {
        setEditingCollege(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (college) => {
        setEditingCollege(college);
        setIsModalOpen(true);
    };

    const openDeleteModal = (college) => {
        setDeletingCollege(college);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        if (isLoading) return;
        setIsModalOpen(false);
        setEditingCollege(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingCollege(null);
    };

    const handleSaveCollege = async (collegeData, adminData) => {
        setIsLoading(true);
        try {
            let response;
            const universityId = "68c126f6d78ab505fb0a5143"; // Replace with actual dynamic University ID from auth context

            if (editingCollege) {
                // Update College
                response = await fetch(`${API_BASE_URL}/${editingCollege._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( collegeData ),
                    credentials: 'include'
                });
            } else {
                // Create College
                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ collegeData, adminData, universityId }),
                    credentials: 'include'
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred.');
            }

            const result = await response.json();
            const updatedCollege = result.college || result.data;

            if (editingCollege) {
                setColleges(colleges.map(c => c._id === editingCollege._id ? updatedCollege : c));
                addToast('success', `${updatedCollege.name} updated successfully.`);
            } else {
                setColleges(prev => [updatedCollege, ...prev]);
                setTotalColleges(prev => prev + 1);
                addToast('success', `${updatedCollege.name} created successfully.`);
            }

            closeModal();
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleDeleteCollege = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${deletingCollege._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete college.');
            }

            addToast('info', `${deletingCollege.name} has been deleted.`);
            setColleges(colleges.filter(c => c._id !== deletingCollege._id));
            setTotalColleges(prev => prev - 1);
            closeDeleteModal();
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => {
        return { total: totalColleges };
    }, [totalColleges]);

    return (
        <div className="min-h-screen font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard title="Total Colleges" value={stats.total} icon={<Building />} color="blue" />
                    <StatCard title="Active" value={"N/A"} icon={<CheckCircle />} color="green" />
                    <StatCard title="Pending" value={"N/A"} icon={<Loader2 />} color="yellow" />
                    <StatCard title="Inactive" value={"N/A"} icon={<X />} color="gray" />
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <DataTableToolbar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onAddClick={openModalForCreate}
                    />
                    {isPageLoading ? (
                        <div className="text-center p-16 text-gray-500">
                            <Loader2 className="animate-spin inline-block w-8 h-8" />
                            <p>Loading colleges...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center p-16 text-red-600">
                            <AlertTriangle className="inline-block w-8 h-8" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            <CollegesTable
                                colleges={colleges}
                                onEdit={openModalForEdit}
                                onDelete={openDeleteModal}
                                currentPage={currentPage}
                                rowsPerPage={rowsPerPage}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalCount={totalColleges}
                                pageSize={rowsPerPage}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={setRowsPerPage}
                            />
                        </>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <CollegeModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSave={handleSaveCollege}
                    college={editingCollege}
                    processing={isLoading}
                    allCourses={allCourses}
                />
            )}

            {isDeleteModalOpen && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteCollege}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete ${deletingCollege?.name}? This action cannot be undone.`}
                    confirmText="Yes, Delete"
                    confirmColor="red"
                    processing={isLoading}
                />
            )}
        </div>
    );
};


// --- Child Components ---

const StatCard = ({ title, value, icon, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        gray: 'bg-gray-100 text-gray-600',
    };
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-full ${colors[color]}`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

const DataTableToolbar = ({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange, onAddClick }) => (
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name, code..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending Approval">Pending Approval</option>
            </select>
        </div>
        <button onClick={onAddClick} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm whitespace-nowrap w-full sm:w-auto justify-center">
            <PlusCircle size={18} /> Add College
        </button>
    </div>
);

const CollegesTable = ({ colleges, onEdit, onDelete, currentPage, rowsPerPage }) => (
    <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                    <th className="p-3 font-semibold text-center w-12">#</th>
                    <th className="p-3 font-semibold">College</th>
                    <th className="p-3 font-semibold">Contact</th>
                    <th className="p-3 font-semibold">Admin</th>
                    <th className="p-3 font-semibold text-center">Courses</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                    <th className="p-3 font-semibold text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
                {colleges.length > 0 ? colleges.map((college, index) => {
                    const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
                    return (
                        <tr key={college._id} className="hover:bg-gray-50">
                            <td className="p-3 text-center text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
                            <td className="p-3">
                                <div className="font-medium text-gray-800">{college.name}</div>
                                <div className="text-gray-500 font-mono text-xs">Code: {college.code} | Type: {college.type}</div>
                            </td>
                            <td className="p-3">
                                <div className="text-gray-800">{college.contact?.email}</div>
                                <div className="text-gray-500">{college.contact?.phone}</div>
                            </td>
                            <td className="p-3">
                                {college.admin ? (
                                    <>
                                        <div className="font-medium text-gray-800">{college.admin.name}</div>
                                        <div className="text-gray-500 font-mono text-xs">ID: {college.admin.staffId}</div>
                                    </>
                                ) : <span className="text-gray-400">Not Assigned</span>}
                            </td>
                            <td className="p-3 text-center font-semibold text-gray-700">{college.courses?.length || 0}</td>
                            <td className="p-3 text-center"><StatusBadge status={college.status} /></td>
                            <td className="p-3 text-center">
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => onEdit(college)} className="text-gray-500 hover:text-blue-600" title="Edit College"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(college)} className="text-gray-500 hover:text-red-600" title="Delete College"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    );
                }) : (
                    <tr>
                        <td colSpan="7" className="text-center p-8 text-gray-500">No colleges found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange }) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(startItem + pageSize - 1, totalCount);

    const handlePageSizeChange = (e) => {
        onPageSizeChange(Number(e.target.value));
        onPageChange(1); // Reset to first page
    };

    return (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>Show:</span>
                    <select value={pageSize} onChange={handlePageSizeChange} className="px-2 py-1 border border-gray-300 rounded-md bg-white">
                        {[5, 10, 20].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                </div>
                <span>Showing {startItem}-{endItem} of {totalCount} records</span>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16} /></button>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        'Active': 'bg-green-100 text-green-800',
        'Inactive': 'bg-gray-100 text-gray-800',
        'Pending Approval': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'blue', processing }) => {
    if (!isOpen) return null;
    const colors = { red: 'bg-red-600 hover:bg-red-700', blue: 'bg-blue-600 hover:bg-blue-700' };
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="p-6"><div className="flex items-start gap-4"><div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${confirmColor === 'red' ? 'bg-red-100' : 'bg-blue-100'}`}><AlertTriangle className={`${confirmColor === 'red' ? 'text-red-600' : 'text-blue-600'}`} size={24} /></div><div><h3 className="text-lg font-bold text-gray-800">{title}</h3><p className="text-sm text-gray-500 mt-1">{message}</p></div></div></div><div className="p-4 bg-gray-50 border-t flex justify-end gap-3"><button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancel</button><button onClick={onConfirm} disabled={processing} className={`px-4 py-2 text-white rounded-lg ${colors[confirmColor]} disabled:opacity-50 flex items-center justify-center min-w-[100px]`}>{processing ? <Loader2 size={16} className="animate-spin" /> : confirmText}</button></div></div>
        </div>
    );
};

const CollegeModal = ({ isOpen, onClose, onSave, college, processing, allCourses }) => {
    const isEditing = !!college;
    const [activeTab, setActiveTab] = useState('details');
    const [showPassword, setShowPassword] = useState(false);

    // State is now structured to match the final JSON object
    const [formData, setFormData] = useState({
        // College Details
        name: college?.name || '',
        code: college?.code || '',
        type: college?.type || '',
        status: college?.status || 'Pending Approval',
        affiliationId: college?.affiliationId || '',
        establishmentDate: college?.establishmentDate?.split('T')[0] || '',
        capacity: college?.capacity || '',
        courses: college?.courses || [],

        // --- UPDATED: Nested location state ---
        location: {
            address: college?.location?.address || '',
            city: college?.location?.city || '',
            state: college?.location?.state || '',
            pincode: college?.location?.pincode || '',
        },
        // --- UPDATED: Nested contact state ---
        contact: {
            email: college?.contact?.email || '',
            phone: college?.contact?.phone || '',
            website: college?.contact?.website || '',
        },

        // Admin Details
        adminName: '',
        adminEmail: '',
        adminStaffId: '',
        adminPhone: '',
        adminPassword: '',
        adminGender: '',
        adminSalary: '',
    });
    const [error, setError] = useState('');

    // Handles changes for top-level fields (e.g., name, code)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- NEW: Handles changes for nested state objects (location, contact) ---
    const handleNestedChange = (section, e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }));
    };

    const handleCourseChange = (selectedCourseIds) => {
        setFormData(prev => ({ ...prev, courses: selectedCourseIds }));
    };

    const handleSubmit = () => {
        // Validation for required fields
        const { name, code, type, affiliationId, contact, location } = formData;
        if (!name || !code || !type || !affiliationId || !contact.email || !contact.phone || !location.city || !location.state) {
            setError('Please fill all required (*) fields in College Details and Contact tabs.'); return;
        }
        if (!isEditing) {
            const { adminName, adminEmail, adminStaffId, adminPassword } = formData;
            if (!adminName || !adminEmail || !adminStaffId || !adminPassword) {
                setError('Please switch to the Admin Details tab and fill all required (*) fields.'); return;
            }
        }
        setError('');

        // --- UPDATED: Assemble collegeData from the structured state ---
        const collegeData = {
            name: formData.name,
            code: formData.code,
            type: formData.type,
            status: formData.status,
            affiliationId: formData.affiliationId,
            establishmentDate: formData.establishmentDate,
            capacity: formData.capacity,
            location: formData.location, // Already a nested object
            contact: formData.contact,   // Already a nested object
            courses: formData.courses,
        };

        const adminData = isEditing ? null : {
            name: formData.adminName,
            email: formData.adminEmail,
            staffId: formData.adminStaffId,
            phone: formData.adminPhone,
            password: formData.adminPassword,
            gender: formData.adminGender,
            salary: formData.adminSalary
        };

        onSave(collegeData, adminData);
    };


    if (!isOpen) return null;

    const TabButton = ({ tabName, label }) => (
        <button type="button" onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tabName ? 'bg-white border-b-0 border-gray-300 text-blue-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-500'}`}>
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="p-4 border-b flex items-center justify-between"><h2 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit College' : 'Create New College'}</h2><button onClick={onClose} disabled={processing} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div>
                <div className="bg-gray-50 border-b border-gray-200 px-6">
                    <div className="flex -mb-px">
                        <TabButton tabName="details" label="College Details" />
                        <TabButton tabName="contact" label="Contact & Location" />
                        <TabButton tabName="courses" label="Manage Courses" />
                        {!isEditing && <TabButton tabName="admin" label="Create Admin" />}
                    </div>
                </div>
                <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                    {activeTab === 'details' && (<div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div className="md:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-1">College Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">College Code *</label><input type="text" name="code" value={formData.code} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">College Type *</label><input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="e.g., Engineering" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label><input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="e.g., 2500" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Affiliation ID *</label><input type="text" name="affiliationId" value={formData.affiliationId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Establishment Date</label><input type="date" name="establishmentDate" value={formData.establishmentDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg"><option>Active</option><option>Inactive</option><option>Pending Approval</option></select></div> </div>)}

                    {/* --- UPDATED: Contact & Location Tab --- */}
                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" name="address" value={formData.location.address} onChange={(e) => handleNestedChange('location', e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input type="text" name="city" value={formData.location.city} onChange={(e) => handleNestedChange('location', e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">State *</label><input type="text" name="state" value={formData.location.state} onChange={(e) => handleNestedChange('location', e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label><input type="text" name="pincode" value={formData.location.pincode} onChange={(e) => handleNestedChange('location', e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                            <div className="md:col-span-2"><hr className="my-2" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label><input type="email" name="email" value={formData.contact.email} onChange={(e) => handleNestedChange('contact', e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label><input type="tel" name="phone" value={formData.contact.phone} onChange={(e) => handleNestedChange('contact', e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input type="text" name="website" value={formData.contact.website} onChange={(e) => handleNestedChange('contact', e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                        </div>
                    )}

                    {activeTab === 'courses' && (<MultiSelectCourses allCourses={allCourses} selectedCourses={formData.courses} onChange={handleCourseChange} />)}
                    {!isEditing && activeTab === 'admin' && (<div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Full Name *</label><input type="text" name="adminName" value={formData.adminName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Email *</label><input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Staff ID *</label><input type="text" name="adminStaffId" value={formData.adminStaffId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Phone</label><input type="tel" name="adminPhone" value={formData.adminPhone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><select name="adminGender" value={formData.adminGender} onChange={handleChange} className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Salary</label><input type="number" name="adminSalary" value={formData.adminSalary} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div> <div className="md:col-span-3 relative"><label className="block text-sm font-medium text-gray-700 mb-1">Set Password *</label><input type={showPassword ? "text" : "password"} name="adminPassword" value={formData.adminPassword} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div> </div>)}
                    {error && <p className="text-red-600 text-sm pt-2">{error}</p>}
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3"><button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button><button onClick={handleSubmit} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center min-w-[120px] justify-center">{processing ? <Loader2 size={16} className="animate-spin" /> : (isEditing ? 'Save Changes' : 'Create College')}</button></div>
            </div>
        </div>
    );
};

const MultiSelectCourses = ({ allCourses, selectedCourses, onChange }) => {
    const availableCourses = allCourses.filter(c => !selectedCourses.includes(c._id));

    const handleAddCourse = (courseId) => {
        if (courseId) {
            onChange([...selectedCourses, courseId]);
        }
    };

    const handleRemoveCourse = (courseId) => {
        onChange(selectedCourses.filter(id => id !== courseId));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Courses to offer</label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[40px] bg-gray-50 mb-2">
                {selectedCourses.map(id => {
                    const course = allCourses.find(c => c._id === id);
                    return (
                        <div key={id} className="flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                            <span>{(course?.degree || course?.branch) ? `${course?.degree || ''} ${course?.branch || ''}`.trim() : 'Unknown Course'}</span>
                            <button onClick={() => handleRemoveCourse(id)}><X size={14} /></button>
                        </div>
                    );
                })}
                {selectedCourses.length === 0 && <p className="text-sm text-gray-400 p-1">No courses selected.</p>}
            </div>
            {availableCourses.length > 0 && (
                <select onChange={(e) => handleAddCourse(e.target.value)} value="" className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg">
                    <option value="">-- Add a course --</option>
                    {availableCourses.map(course => (
                        <option key={course._id} value={course._id}>{course.degree} ({course.branch})</option>
                    ))}
                </select>
            )}
        </div>
    );
};


const Toast = ({ message, type, onClose }) => {
    const icons = { success: <CheckCircle className="text-green-500" />, error: <AlertTriangle className="text-red-500" />, info: <Info className="text-blue-500" /> };
    return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-3 w-80 animate-fade-in-right"> <div className="flex-shrink-0">{icons[type]}</div> <p className="flex-1 text-sm text-gray-700">{message}</p> <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button> </div>);
};

const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };
    return (<div className="fixed top-5 right-5 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
};

export default UniversityCollegeManager;