import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, GraduationCap, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';

// Sample data for frontend CRUD - Replace with actual API calls later
const initialCourses = [
    {
        _id: '1',
        courseId: 'CSE2024',
        degree: 'B.Tech',
        branch: 'Computer Science Engineering',
        specialization: 'Artificial Intelligence',
        totalSemester: 8,
        semesters: [
            { semesterNumber: 1, subjects: ['sub1', 'sub2'] },
            { semesterNumber: 2, subjects: ['sub3', 'sub4'] },
            { semesterNumber: 3, subjects: ['sub5'] },
            { semesterNumber: 4, subjects: ['sub6'] },
            { semesterNumber: 5, subjects: ['sub7'] },
            { semesterNumber: 6, subjects: ['sub8'] },
            { semesterNumber: 7, subjects: ['sub9'] },
            { semesterNumber: 8, subjects: ['sub10'] },
        ]
    },
    {
        _id: '2',
        courseId: 'ECE2024',
        degree: 'B.Tech',
        branch: 'Electronics and Communication Engineering',
        specialization: '',
        totalSemester: 8,
        semesters: [
            { semesterNumber: 1, subjects: ['sub11', 'sub12'] },
            { semesterNumber: 2, subjects: ['sub13', 'sub14'] },
            { semesterNumber: 3, subjects: ['sub15'] },
            { semesterNumber: 4, subjects: ['sub16'] },
            { semesterNumber: 5, subjects: ['sub17'] },
            { semesterNumber: 6, subjects: ['sub18'] },
            { semesterNumber: 7, subjects: ['sub19'] },
            { semesterNumber: 8, subjects: ['sub20'] },
        ]
    },
    {
        _id: '3',
        courseId: 'MBA2024',
        degree: 'MBA',
        branch: 'Business Administration',
        specialization: 'Finance',
        totalSemester: 4,
        semesters: [
            { semesterNumber: 1, subjects: ['sub21', 'sub22'] },
            { semesterNumber: 2, subjects: ['sub23', 'sub24'] },
            { semesterNumber: 3, subjects: ['sub25'] },
            { semesterNumber: 4, subjects: ['sub26'] },
        ]
    }
];

const initialSubjects = [
    { _id: 'sub1', name: 'Mathematics I', code: 'MATH101', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub2', name: 'Physics I', code: 'PHY101', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub3', name: 'Programming in C', code: 'CS101', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub4', name: 'Engineering Graphics', code: 'EG101', credits: 3, type: 'CORE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub5', name: 'Data Structures', code: 'CS201', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub6', name: 'Computer Networks', code: 'CS202', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub7', name: 'Database Management', code: 'CS301', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub8', name: 'Software Engineering', code: 'CS302', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub9', name: 'Machine Learning', code: 'CS401', credits: 4, type: 'ELECTIVE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub10', name: 'Project Work', code: 'CS402', credits: 6, type: 'CORE', maxMarks: { internal: 50, external: 50, practical: 0 } },
    { _id: 'sub11', name: 'Circuit Analysis', code: 'ECE101', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub12', name: 'Electronic Devices', code: 'ECE102', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub13', name: 'Digital Electronics', code: 'ECE201', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub14', name: 'Signals and Systems', code: 'ECE202', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub15', name: 'Microprocessors', code: 'ECE301', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub16', name: 'Communication Systems', code: 'ECE302', credits: 4, type: 'CORE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub17', name: 'VLSI Design', code: 'ECE401', credits: 4, type: 'ELECTIVE', maxMarks: { internal: 30, external: 50, practical: 20 } },
    { _id: 'sub18', name: 'Antenna Theory', code: 'ECE402', credits: 4, type: 'ELECTIVE', maxMarks: { internal: 30, external: 70, practical: 0 } },
    { _id: 'sub19', name: 'Project I', code: 'ECE451', credits: 4, type: 'CORE', maxMarks: { internal: 50, external: 50, practical: 0 } },
    { _id: 'sub20', name: 'Project II', code: 'ECE452', credits: 6, type: 'CORE', maxMarks: { internal: 50, external: 50, practical: 0 } },
    { _id: 'sub21', name: 'Financial Management', code: 'MBA101', credits: 4, type: 'CORE', maxMarks: { internal: 40, external: 60, practical: 0 } },
    { _id: 'sub22', name: 'Marketing Management', code: 'MBA102', credits: 4, type: 'CORE', maxMarks: { internal: 40, external: 60, practical: 0 } },
    { _id: 'sub23', name: 'Operations Management', code: 'MBA201', credits: 4, type: 'CORE', maxMarks: { internal: 40, external: 60, practical: 0 } },
    { _id: 'sub24', name: 'Human Resource Management', code: 'MBA202', credits: 4, type: 'CORE', maxMarks: { internal: 40, external: 60, practical: 0 } },
    { _id: 'sub25', name: 'Investment Banking', code: 'MBA301', credits: 4, type: 'ELECTIVE', maxMarks: { internal: 40, external: 60, practical: 0 } },
    { _id: 'sub26', name: 'Dissertation', code: 'MBA401', credits: 8, type: 'CORE', maxMarks: { internal: 50, external: 50, practical: 0 } },
];

// --- Main Parent Component ---

const CollegeAdminManageCourses = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState(initialSubjects);
    const [courses, setCourses] = useState(initialCourses);

    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, itemName: '', itemType: 'item' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const processedData = useMemo(() => {
        const data = activeTab === 'courses' ? courses : subjects;

        const filtered = data.filter(item => {
            if (!item) return false;
            const query = searchTerm.toLowerCase();
            if (activeTab === 'courses') {
                return (item.courseId?.toLowerCase() || '').includes(query) ||
                    (item.degree?.toLowerCase() || '').includes(query) ||
                    (item.branch?.toLowerCase() || '').includes(query);
            } else {
                return (item.name?.toLowerCase() || '').includes(query) ||
                    (item.code?.toLowerCase() || '').includes(query) ||
                    (item.type?.toLowerCase() || '').includes(query);
            }
        });

        const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

        return { paginatedData: paginated, totalCount: filtered.length, filteredData: filtered };

    }, [courses, subjects, activeTab, searchTerm, currentPage, rowsPerPage]);

    const { paginatedData, totalCount, filteredData } = processedData;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm('');
        setCurrentPage(1);
        setRowsPerPage(10);
    };

    const showAlert = (type, message) => setAlert({ show: true, type, message });
    const hideAlert = () => setAlert({ show: false, type: 'info', message: '' });

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const handleDeleteClick = (id, itemName) => {
        setDeleteModal({
            show: true, itemId: id, itemName: itemName,
            itemType: activeTab === 'courses' ? 'course' : 'subject'
        });
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            const { itemId, itemName, itemType } = deleteModal;
            
            // Frontend-only delete - remove from state
            if (itemType === 'course') {
                setCourses(prev => prev.filter(c => c._id !== itemId));
            } else {
                setSubjects(prev => prev.filter(s => s._id !== itemId));
            }
            
            showAlert('success', `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} "${itemName}" deleted successfully!`);
        } catch (error) {
            showAlert('error', `Failed to delete ${deleteModal.itemType}. ${error.message}`);
        } finally {
            setLoading(false);
            setDeleteModal({ show: false, itemId: null, itemName: '', itemType: 'item' });
        }
    };

    const stats = useMemo(() => {
        if (activeTab === 'courses') {
            return {
                total: courses.length,
                btech: courses.filter(c => c.degree === 'B.Tech').length,
                mtech: courses.filter(c => c.degree === 'M.Tech').length,
                mba: courses.filter(c => c.degree === 'MBA').length
            };
        } else {
            return {
                total: subjects.length,
                core: subjects.filter(s => s.type === 'CORE').length,
                elective: subjects.filter(s => s.type === 'ELECTIVE').length,
                lab: subjects.filter(s => s.type === 'LAB').length
            };
        }
    }, [courses, subjects, activeTab]);

    return (
        <div className="min-h-screen font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="max-w-7xl mx-auto p-6">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Course Management</h1>
                    <p className="text-gray-600">Manage courses and subjects for your college</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard 
                        icon={activeTab === 'courses' ? <GraduationCap size={20} className="text-blue-600" /> : <BookOpen size={20} className="text-blue-600" />} 
                        title={`Total ${activeTab === 'courses' ? 'Courses' : 'Subjects'}`} 
                        value={stats.total} 
                    />
                    {activeTab === 'courses' ? (
                        <>
                            <StatCard title="B.Tech Programs" value={stats.btech} />
                            <StatCard title="M.Tech Programs" value={stats.mtech} />
                            <StatCard title="MBA Programs" value={stats.mba} />
                        </>
                    ) : (
                        <>
                            <StatCard title="Core Subjects" value={stats.core} />
                            <StatCard title="Elective Subjects" value={stats.elective} />
                            <StatCard title="Lab Subjects" value={stats.lab} />
                        </>
                    )}
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    {/* Tab Navigation */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-1">
                            <button 
                                onClick={() => handleTabChange('courses')} 
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === 'courses' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                            >
                                Manage Courses
                            </button>
                            <button 
                                onClick={() => handleTabChange('subjects')} 
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === 'subjects' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                            >
                                Manage Subjects
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    <TableView
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddClick={() => { setEditingItem(null); setShowAddModal(true); }}
                        activeTab={activeTab}
                    >
                        {activeTab === 'courses' ?
                            <CourseTable 
                                courses={paginatedData} 
                                onEdit={handleEdit} 
                                onDelete={handleDeleteClick} 
                                currentPage={currentPage} 
                                rowsPerPage={rowsPerPage} 
                            /> :
                            <SubjectTable 
                                subjects={paginatedData} 
                                onEdit={handleEdit} 
                                onDelete={handleDeleteClick} 
                                currentPage={currentPage} 
                                rowsPerPage={rowsPerPage} 
                            />
                        }

                        {loading && <div className="text-center py-12">Loading...</div>}
                        {!loading && paginatedData.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-lg text-gray-500">No {activeTab} found</p>
                                {searchTerm && <p className="text-sm text-gray-400">Try adjusting your search.</p>}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalCount={totalCount}
                            pageSize={rowsPerPage}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => { setRowsPerPage(size); setCurrentPage(1); }}
                            filteredData={filteredData}
                            activeTab={activeTab}
                        />
                    </TableView>
                </div>
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddEditModal 
                    setShowModal={setShowAddModal} 
                    activeTab={activeTab} 
                    mode="add" 
                    onAddSuccess={(newItem) => {
                        if (activeTab === 'courses') {
                            setCourses(prev => [...prev, newItem]);
                        } else {
                            setSubjects(prev => [...prev, newItem]);
                        }
                        showAlert('success', `${activeTab === 'courses' ? 'Course' : 'Subject'} added successfully!`);
                    }} 
                    onAddError={(error) => showAlert('error', `Failed to add. ${error.message || ''}`)} 
                />
            )}

            {showEditModal && (
                <AddEditModal 
                    setShowModal={setShowEditModal} 
                    activeTab={activeTab} 
                    mode="edit" 
                    initialData={editingItem}
                    onUpdateSuccess={(updatedItem) => {
                        if (activeTab === 'courses') {
                            setCourses(prev => prev.map(c => c._id === updatedItem._id ? updatedItem : c));
                        } else {
                            setSubjects(prev => prev.map(s => s._id === updatedItem._id ? updatedItem : s));
                        }
                        showAlert('success', `${activeTab === 'courses' ? 'Course' : 'Subject'} updated successfully!`);
                    }} 
                    onUpdateError={(error) => showAlert('error', `Failed to update. ${error.message || ''}`)} 
                />
            )}

            {/* Alert Notification */}
            <AlertNotification 
                show={alert.show} 
                type={alert.type} 
                message={alert.message} 
                onClose={hideAlert} 
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal 
                isOpen={deleteModal.show} 
                onClose={() => setDeleteModal({ ...deleteModal, show: false })} 
                onConfirm={handleDeleteConfirm} 
                title={`Delete ${deleteModal.itemType}`} 
                description={`Are you sure you want to delete "${deleteModal.itemName}"? This action is permanent.`} 
                isLoading={loading} 
            />
        </div>
    );
};

// --- Child Components ---

const StatCard = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)' }}>
        {icon}
        <div>
            <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</p>
            <p className="text-2xl font-bold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
        </div>
    </div>
);

const TableView = ({ searchTerm, onSearchChange, onAddClick, activeTab, children }) => (
    <div>
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                />
            </div>
            <button 
                onClick={onAddClick} 
                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
            >
                <Plus size={18} className="mr-2" /> 
                Add {activeTab === 'courses' ? 'Course' : 'Subject'}
            </button>
        </div>
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">{children}</div>
        </div>
    </div>
);

const CourseTable = ({ courses, onEdit, onDelete, currentPage, rowsPerPage }) => (
    <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12" style={{ fontFamily: 'Poppins, sans-serif' }}>#</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Course ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Program</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Semesters</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
            {courses.map((course, index) => {
                const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
                return (
                    <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">{course.courseId}</td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{course.degree} - {course.branch}</div>
                            {course.specialization && <div className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>{course.specialization}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{course.totalSemester}</td>
                        <td className="px-6 py-4">
                            <div className="flex space-x-3">
                                <button 
                                    onClick={() => onEdit(course)} 
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => onDelete(course._id, course.courseId)} 
                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                )
            })}
        </tbody>
    </table>
);

const SubjectTable = ({ subjects, onEdit, onDelete, currentPage, rowsPerPage }) => {
    const getTypeColor = (type) => {
        switch (type) {
            case 'CORE': return 'bg-blue-100 text-blue-800';
            case 'ELECTIVE': return 'bg-green-100 text-green-800';
            case 'LAB': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12" style={{ fontFamily: 'Poppins, sans-serif' }}>#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Credits</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Max Marks</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {subjects.map((subject, index) => {
                    const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
                    return (
                        <tr key={subject._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{subject.name}</div>
                                <div className="text-sm text-gray-500 font-mono">Code: {subject.code}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(subject.type)}`}>{subject.type}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">{subject.credits}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                <div>Int: {subject.maxMarks.internal}</div>
                                <div>Ext: {subject.maxMarks.external}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex space-x-3">
                                    <button onClick={() => onEdit(subject)} className="text-gray-500 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => onDelete(subject._id, subject.name)} className="text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
};

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange, filteredData, activeTab }) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(startItem + pageSize - 1, totalCount);

    const summaryStats = useMemo(() => {
        if (!filteredData) return {};
        if (activeTab === 'courses') {
            return {
                btech: filteredData.filter(c => c.degree === 'B.Tech').length,
                mtech: filteredData.filter(c => c.degree === 'M.Tech').length,
            }
        }
        return {
            core: filteredData.filter(s => s.type === 'CORE').length,
            elective: filteredData.filter(s => s.type === 'ELECTIVE').length,
        }
    }, [filteredData, activeTab]);

    return (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>Show:</span>
                    <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-md bg-white">
                        {[5, 10, 20].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                </div>
                <span>Showing {startItem}-{endItem} of {totalCount} records</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="font-semibold flex gap-4">
                    {activeTab === 'courses' ? 
                        <>
                            <span>B.Tech: <span className="text-blue-600">{summaryStats.btech}</span></span>
                            <span>M.Tech: <span className="text-green-600">{summaryStats.mtech}</span></span>
                        </> :
                        <>
                            <span>Core: <span className="text-blue-600">{summaryStats.core}</span></span>
                            <span>Elective: <span className="text-green-600">{summaryStats.elective}</span></span>
                        </>
                    }
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50">Previous</button>
                        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AlertNotification = ({ show, type, message, onClose }) => {
    if (!show) return null;
    const colors = {
        success: 'bg-green-100 border-green-300 text-green-800',
        error: 'bg-red-100 border-red-300 text-red-800',
        info: 'bg-blue-100 border-blue-300 text-blue-800',
    };
    return (
        <div className={`fixed top-5 right-5 p-4 rounded-lg border shadow-lg z-50 transition-transform transform ${show ? 'translate-x-0' : 'translate-x-full'} ${colors[type] || colors.info}`}>
            <div className="flex items-center justify-between">
                <p>{message}</p>
                <button onClick={onClose} className="ml-4"><X size={18} /></button>
            </div>
        </div>
    );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b"><h2 className="text-xl font-bold text-gray-800">{title}</h2></div>
                <div className="p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-10 sm:w-10">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                            <p className="text-sm text-gray-500 mt-1">{description}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
                    <button disabled={isLoading} onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple Modal for Add/Edit
const AddEditModal = ({ setShowModal, activeTab, mode = 'add', initialData = null, onAddSuccess, onAddError, onUpdateSuccess, onUpdateError }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '', degree: '', branch: '', specialization: '', totalSemester: 8,
        name: '', code: '', credits: '', type: 'CORE',
        maxMarks: { internal: 30, external: 70, practical: 0 }
    });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({ ...initialData, credits: initialData.credits?.toString() || '' });
        }
    }, [mode, initialData]);

    const generateId = () => 'id_' + Math.random().toString(36).substr(2, 9);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const newItem = {
                _id: mode === 'edit' ? initialData._id : generateId(),
                ...formData,
                credits: formData.credits ? parseInt(formData.credits) : 0,
                totalSemester: parseInt(formData.totalSemester)
            };
            
            if (mode === 'edit') {
                onUpdateSuccess && onUpdateSuccess(newItem);
            } else {
                onAddSuccess && onAddSuccess(newItem);
            }
            setShowModal(false);
        } catch (error) {
            if (mode === 'edit') {
                onUpdateError && onUpdateError(error);
            } else {
                onAddError && onAddError(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">{mode === 'edit' ? 'Edit' : 'Add New'} {activeTab === 'courses' ? 'Course' : 'Subject'}</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'courses' ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Course ID</label><input type="text" value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="CSE2024" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Degree</label><select value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select degree</option><option value="B.Tech">B.Tech</option><option value="M.Tech">M.Tech</option><option value="MBA">MBA</option></select></div>
                            </div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label><input type="text" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Computer Science Engineering" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label><input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="AI (optional)" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Total Semesters</label><select value={formData.totalSemester} onChange={(e) => setFormData({...formData, totalSemester: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">{[...Array(12)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}</select></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Data Structures" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject Code</label><input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="CS201" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Credits</label><input type="number" value={formData.credits} onChange={(e) => setFormData({...formData, credits: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="4" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Type</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="CORE">Core</option><option value="ELECTIVE">Elective</option><option value="LAB">Lab</option></select></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg"><label className="block text-sm font-semibold text-gray-700 mb-3">Max Marks</label><div className="grid grid-cols-3 gap-4"><div><label className="block text-xs font-medium text-gray-600 mb-1">Internal</label><input type="number" value={formData.maxMarks.internal} onChange={(e) => setFormData({...formData, maxMarks: {...formData.maxMarks, internal: parseInt(e.target.value) || 0}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div><label className="block text-xs font-medium text-gray-600 mb-1">External</label><input type="number" value={formData.maxMarks.external} onChange={(e) => setFormData({...formData, maxMarks: {...formData.maxMarks, external: parseInt(e.target.value) || 0}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div><label className="block text-xs font-medium text-gray-600 mb-1">Practical</label><input type="number" value={formData.maxMarks.practical} onChange={(e) => setFormData({...formData, maxMarks: {...formData.maxMarks, practical: parseInt(e.target.value) || 0}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div></div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">{loading ? `${mode === 'edit' ? 'Updating...' : 'Adding...'}` : `${mode === 'edit' ? 'Update' : 'Add'} ${activeTab === 'courses' ? 'Course' : 'Subject'}`}</button>
                </div>
            </div>
        </div>
    );
};

export default CollegeAdminManageCourses;