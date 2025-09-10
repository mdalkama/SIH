import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, GraduationCap, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';

// --- Main Parent Component ---

const UniversityAdminManageCourses = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);

    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, itemName: '', itemType: 'item' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchCoursesAndSubjects = async () => {
            setLoading(true);
            try {
                const [coursesRes, subjectsRes] = await Promise.all([
                    fetch("https://sih-4ptm.onrender.com/api/v1/course", { method: "GET", credentials: "include" }),
                    fetch("https://sih-4ptm.onrender.com/api/v1/subject", { method: "GET", credentials: "include" })
                ]);

                const coursesData = await coursesRes.json();
                const subjectsData = await subjectsRes.json();

                if (coursesRes.ok) {
                    setCourses(coursesData || []);
                } else {
                    showAlert('error', `Error fetching courses: ${coursesData.message}`);
                }

                if (subjectsRes.ok) {
                    setSubjects(subjectsData || []);
                } else {
                    showAlert('error', `Error fetching subjects: ${subjectsData.message}`);
                }
            } catch (err) {
                showAlert('error', `Network error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCoursesAndSubjects();
    }, []);

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
            const endpoint = itemType === 'course' ? 'course' : 'subject';

            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/${endpoint}/${itemId}`, {
                method: 'DELETE', credentials: 'include',
            });

            if (response.ok) {
                if (itemType === 'course') {
                    setCourses(prev => prev.filter(c => c._id !== itemId));
                } else {
                    setSubjects(prev => prev.filter(s => s._id !== itemId));
                }
                showAlert('success', `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} "${itemName}" deleted successfully!`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to delete ${itemType}`);
            }
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
                // btech: courses.filter(c => c.degree === 'B.Tech').length,
                // mtech: courses.filter(c => c.degree === 'M.Tech').length,
                // mba: courses.filter(c => c.degree === 'MBA').length, 
                Diploma_Engg: courses.filter(c => c.degree === 'Diploma Engineering').length,
                Diploma_Non_Engg: courses.filter(c => c.degree === 'Diploma Non-Engineering').length,
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
        <div className="min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={activeTab === 'courses' ? <GraduationCap size={20} className="text-blue-600" /> : <BookOpen size={20} className="text-blue-600" />} title={`Total ${activeTab === 'courses' ? 'Courses' : 'Subjects'}`} value={stats.total} />
                    {activeTab === 'courses' ? (
                        <>
                            {/* <StatCard title="B.Tech Programs" value={stats.btech} />
                            <StatCard title="M.Tech Programs" value={stats.mtech} />
                            <StatCard title="MBA Programs" value={stats.mba} /> */}
                            <StatCard title="Diploma Engineering Programs" value={stats.Diploma_Engg} />
                            <StatCard title="Diploma Non-Engineering Programs" value={stats.Diploma_Non_Engg} />
                        </>
                    ) : (
                        <>
                            <StatCard title="Core Subjects" value={stats.core} />
                            <StatCard title="Elective Subjects" value={stats.elective} />
                            <StatCard title="Lab Subjects" value={stats.lab} />
                        </>
                    )}
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-1">
                            <button onClick={() => handleTabChange('courses')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'courses' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>Manage Courses</button>
                            <button onClick={() => handleTabChange('subjects')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'subjects' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>Manage Subjects</button>
                        </div>
                    </div>

                    <TableView
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddClick={() => { setEditingItem(null); setShowAddModal(true); }}
                        activeTab={activeTab}
                    >
                        {activeTab === 'courses' ?
                            <CourseTable courses={paginatedData} onEdit={handleEdit} onDelete={handleDeleteClick} currentPage={currentPage} rowsPerPage={rowsPerPage} /> :
                            <SubjectTable subjects={paginatedData} onEdit={handleEdit} onDelete={handleDeleteClick} currentPage={currentPage} rowsPerPage={rowsPerPage} />
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

            {showAddModal && <AddEditModal setShowModal={setShowAddModal} activeTab={activeTab} mode="add" onAddSuccess={(response) => {
                if (activeTab === 'courses') setCourses(prev => [...prev, response.course || response]);
                else setSubjects(prev => [...prev, response.subject || response]);
                showAlert('success', `${activeTab === 'courses' ? 'Course' : 'Subject'} added successfully!`);
            }} onAddError={(error) => showAlert('error', `Failed to add. ${error.message || ''}`)} />}

            {showEditModal && <AddEditModal setShowModal={setShowEditModal} activeTab={activeTab} mode="edit" initialData={editingItem} onUpdateSuccess={(response) => {
                const updatedItem = response.course || response.subject || response;
                if (activeTab === 'courses') setCourses(prev => prev.map(c => c._id === updatedItem._id ? updatedItem : c));
                else setSubjects(prev => prev.map(s => s._id === updatedItem._id ? updatedItem : s));
                showAlert('success', `${activeTab === 'courses' ? 'Course' : 'Subject'} updated successfully!`);
            }} onUpdateError={(error) => showAlert('error', `Failed to update. ${error.message || ''}`)} />}

            <AlertNotification show={alert.show} type={alert.type} message={alert.message} onClose={hideAlert} />

            <DeleteConfirmationModal isOpen={deleteModal.show} onClose={() => setDeleteModal({ ...deleteModal, show: false })} onConfirm={handleDeleteConfirm} title={`Delete ${deleteModal.itemType}`} description={`Are you sure you want to delete "${deleteModal.itemName}"? This action is permanent.`} itemName={deleteModal.itemName} isLoading={loading} />
        </div>
    );
};

// --- Child Components ---

const StatCard = ({ icon, title, value }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
        {icon}
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const TableView = ({ searchTerm, onSearchChange, onAddClick, activeTab, children }) => (
    <div>
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button onClick={onAddClick} className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={18} className="mr-2" /> Add {activeTab === 'courses' ? 'Course' : 'Subject'}
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semesters</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                            <div className="text-sm font-medium text-gray-900">{course.degree} - {course.branch}</div>
                            {course.specialization && <div className="text-xs text-gray-500">{course.specialization}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{course.totalSemester}</td>
                        <td className="px-6 py-4">
                            <div className="flex space-x-3">
                                <button onClick={() => onEdit(course)} className="text-gray-500 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                                <button onClick={() => onDelete(course._id, course.courseId)} className="text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {subjects.map((subject, index) => {
                    const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;
                    return (
                        <tr key={subject._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{subject.name}</div>
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
                    {activeTab === 'courses' ? <><span>B.Tech: <span className="text-blue-600">{summaryStats.btech}</span></span><span>M.Tech: <span className="text-green-600">{summaryStats.mtech}</span></span></>
                        : <><span>Core: <span className="text-blue-600">{summaryStats.core}</span></span><span>Elective: <span className="text-green-600">{summaryStats.elective}</span></span></>}
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

// --- Add/Edit Modal Component (formerly AddCourse) ---

const AddEditModal = ({
    setShowModal,
    activeTab,
    mode = 'add', // 'add' or 'edit'
    initialData = null,
    onAddSuccess,
    onAddError,
    onUpdateSuccess,
    onUpdateError
}) => {
    const [loading, setLoading] = useState(false);

    // Course Form State
    const [courseId, setCourseId] = useState("");
    const [degree, setDegree] = useState("");
    const [branch, setBranch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [totalSemester, setTotalSemester] = useState(2);
    const [semesters, setSemesters] = useState([]);

    // Subject Form State
    const [subjectForm, setSubjectForm] = useState({
        name: '', code: '', credits: '', type: 'CORE',
        maxMarks: { internal: 30, external: 70, practical: 0 }
    });

    const [allSubjects, setAllSubjects] = useState([]);
    const [subjectsLoading, setSubjectsLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setSubjectsLoading(true);
                const response = await fetch('https://sih-4ptm.onrender.com/api/v1/subject', { credentials: 'include' });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (Array.isArray(data)) setAllSubjects(data);
                else setAllSubjects([]);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                setAllSubjects([]);
            } finally {
                setSubjectsLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            if (activeTab === 'courses') {
                setCourseId(initialData.courseId || '');
                setDegree(initialData.degree || '');
                setBranch(initialData.branch || '');
                setSpecialization(initialData.specialization || '');
                setTotalSemester(initialData.totalSemester || 8);

                const semesterCount = initialData.totalSemester || 8;
                let existingSemesters = initialData.semesters || [];
                const normalizeSubjectId = (s) => typeof s === 'string' ? s : (s?._id || '');

                const updatedSemesters = Array.from({ length: semesterCount }, (_, index) => {
                    const existingSem = existingSemesters.find(sem => sem.semesterNumber === index + 1);
                    const rawSubjects = existingSem ? existingSem.subjects || [] : [];
                    const normalized = rawSubjects.map(normalizeSubjectId).filter(Boolean);
                    return { semesterNumber: index + 1, subjects: normalized };
                });
                setSemesters(updatedSemesters);
            } else {
                setSubjectForm({
                    name: initialData.name || '', code: initialData.code || '', credits: initialData.credits?.toString() || '', type: initialData.type || 'CORE',
                    maxMarks: { internal: initialData.maxMarks?.internal || 30, external: initialData.maxMarks?.external || 70, practical: initialData.maxMarks?.practical || 0 }
                });
            }
        } else if (mode === 'add') {
            setCourseId(""); setDegree(""); setBranch(""); setSpecialization(""); setTotalSemester(2); setSemesters([]);
            setSubjectForm({
                name: '', code: '', credits: '', type: 'CORE',
                maxMarks: { internal: 30, external: 70, practical: 0 }
            });
        }
    }, [mode, initialData, activeTab]);

    useEffect(() => {
        setSemesters(prev => {
            return Array.from({ length: totalSemester }, (_, index) => {
                const existingSem = prev.find(sem => sem.semesterNumber === index + 1);
                return { semesterNumber: index + 1, subjects: existingSem ? existingSem.subjects || [] : [] };
            });
        });
    }, [totalSemester]);

    const handleAddSubjectToSemester = (semIndex, subjectId) => {
        if (!subjectId) return;
        setSemesters(prev => {
            const updated = [...prev];
            if (!updated[semIndex].subjects) updated[semIndex].subjects = [];
            if (!updated[semIndex].subjects.includes(subjectId)) updated[semIndex].subjects.push(subjectId);
            return updated;
        });
    };

    const handleRemoveSubjectFromSemester = (semIndex, subjectId) => {
        setSemesters(prev => {
            const updated = [...prev];
            if (!updated[semIndex].subjects) updated[semIndex].subjects = [];
            updated[semIndex].subjects = updated[semIndex].subjects.filter(id => id !== subjectId);
            return updated;
        });
    };

    const getSubjectById = (id) => {
        const key = typeof id === 'object' ? id?._id : id;
        return allSubjects.find(subject => String(subject._id) === String(key));
    };

    const handleCourseSubmit = async () => {
        setLoading(true);
        try {
            const hasSubjects = semesters.some(sem => sem.subjects && Array.isArray(sem.subjects) && sem.subjects.length > 0);
            if (!hasSubjects) throw new Error('Please add at least one subject to any semester.');

            const courseData = {
                courseId, degree, branch, specialization, totalSemester: parseInt(totalSemester),
                semesters: semesters.map(sem => ({ semesterNumber: sem.semesterNumber, subjects: sem.subjects || [] }))
            };
            const url = mode === 'edit' ? `https://sih-4ptm.onrender.com/api/v1/course/${initialData._id}` : 'https://sih-4ptm.onrender.com/api/v1/course';
            const method = mode === 'edit' ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(courseData)
            });
            const data = await res.json();
            if (res.ok) {
                if (mode === 'edit') onUpdateSuccess && onUpdateSuccess(data);
                else onAddSuccess && onAddSuccess(data);
                setShowModal(false);
            } else {
                throw new Error(data.message || 'Failed to save course');
            }
        } catch (error) {
            if (mode === 'edit') onUpdateError && onUpdateError(error);
            else onAddError && onAddError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectSubmit = async () => {
        setLoading(true);
        try {
            if (!subjectForm.name || !subjectForm.code) throw new Error('Subject name and code are required.');
            const url = mode === 'edit' ? `https://sih-4ptm.onrender.com/api/v1/subject/${initialData._id}` : 'https://sih-4ptm.onrender.com/api/v1/subject';
            const method = mode === 'edit' ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ ...subjectForm, credits: subjectForm.credits ? parseInt(subjectForm.credits) : 0 })
            });
            const data = await res.json();
            if (res.ok) {
                if (mode === 'edit') onUpdateSuccess && onUpdateSuccess(data);
                else onAddSuccess && onAddSuccess(data);
                setShowModal(false);
            } else {
                throw new Error(data.message || 'Failed to save subject');
            }
        } catch (error) {
            if (mode === 'edit') onUpdateError && onUpdateError(error);
            else onAddError && onAddError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">{mode === 'edit' ? 'Edit' : 'Add New'} {activeTab === 'courses' ? 'Course' : 'Subject'}</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'courses' ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Course ID *</label><input type="text" value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., CSE2024" required /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Degree *</label><select value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required><option value="">Select degree</option><option value="Diploma Engineering">Diploma Engineering</option><option value="Diploma Non-Engineering">Diploma Non-Engineering</option></select></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Branch *</label><input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Computer Science Engineering" required /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Total Semesters *</label><select value={totalSemester} onChange={(e) => setTotalSemester(parseInt(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required><option value="">Select semesters</option>{[...Array(12)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}</select></div>
                            </div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label><input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Artificial Intelligence (optional)" /></div>
                            {totalSemester > 0 && (<div className="space-y-4"><h3 className="text-lg font-semibold text-gray-800">Semester Subjects</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{semesters.map((sem, semIndex) => (<div key={sem.semesterNumber} className="border border-gray-200 rounded-lg p-4 bg-gray-50"><div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-gray-700">Semester {sem.semesterNumber}</h4><span className="text-sm text-gray-500">{sem.subjects && Array.isArray(sem.subjects) ? sem.subjects.length : 0} subjects</span></div><div className="mb-3"><select onChange={(e) => { if (e.target.value) { handleAddSubjectToSemester(semIndex, e.target.value); e.target.value = ''; } }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={subjectsLoading || !Array.isArray(allSubjects) || allSubjects.length === 0}><option value="">+ Add Subject</option>{subjectsLoading ? (<option disabled>Loading subjects...</option>) : Array.isArray(allSubjects) && allSubjects.length > 0 ? (allSubjects.map((subject) => { const isAlreadyAdded = sem.subjects && Array.isArray(sem.subjects) && sem.subjects.some(id => id === subject._id); return (!isAlreadyAdded && (<option key={subject._id} value={subject._id}>{subject.name} ({subject.code})</option>)); })) : (<option disabled>No subjects available</option>)}</select></div><div className="space-y-2 max-h-32 overflow-y-auto">{sem.subjects && Array.isArray(sem.subjects) && sem.subjects.length > 0 ? (sem.subjects.map((subjectId) => { const subject = getSubjectById(subjectId); return (<div key={subjectId} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{subject?.name || 'Unknown Subject'}</p><p className="text-xs text-gray-500">{subject?.code || 'N/A'}</p></div><button onClick={() => handleRemoveSubjectFromSemester(semIndex, subjectId)} className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={14} /></button></div>); })) : (<p className="text-sm text-gray-400 text-center py-2">No subjects added yet</p>)}</div></div>))}</div></div>)}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name *</label><input type="text" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Data Structures and Algorithms" required /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject Code *</label><input type="text" value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., CS101" required /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Credits</label><input type="number" value={subjectForm.credits} onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 4" min="0" max="10" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject Type</label><select value={subjectForm.type} onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="CORE">Core</option><option value="ELECTIVE">Elective</option><option value="LAB">Lab</option></select></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg"><label className="block text-sm font-semibold text-gray-700 mb-3">Maximum Marks Distribution</label><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-xs font-medium text-gray-600 mb-1">Internal Marks</label><input type="number" value={subjectForm.maxMarks.internal} onChange={(e) => setSubjectForm({ ...subjectForm, maxMarks: { ...subjectForm.maxMarks, internal: parseInt(e.target.value) || 0 } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" max="100" /></div><div><label className="block text-xs font-medium text-gray-600 mb-1">External Marks</label><input type="number" value={subjectForm.maxMarks.external} onChange={(e) => setSubjectForm({ ...subjectForm, maxMarks: { ...subjectForm.maxMarks, external: parseInt(e.target.value) || 0 } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" max="100" /></div><div><label className="block text-xs font-medium text-gray-600 mb-1">Practical Marks</label><input type="number" value={subjectForm.maxMarks.practical} onChange={(e) => setSubjectForm({ ...subjectForm, maxMarks: { ...subjectForm.maxMarks, practical: parseInt(e.target.value) || 0 } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" max="100" /></div></div><div className="mt-3 text-sm text-gray-600 font-medium">Total: {subjectForm.maxMarks.internal + subjectForm.maxMarks.external + subjectForm.maxMarks.practical} marks</div></div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                    <button onClick={activeTab === 'courses' ? handleCourseSubmit : handleSubjectSubmit} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">{loading ? (<div className="flex items-center space-x-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>{mode === 'edit' ? 'Updating...' : 'Adding...'}</span></div>) : (`${mode === 'edit' ? 'Update' : 'Add'} ${activeTab === 'courses' ? 'Course' : 'Subject'}`)}</button>
                </div>
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

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, itemName, isLoading }) => {
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

export default UniversityAdminManageCourses;

