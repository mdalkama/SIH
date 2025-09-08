import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import AddCourse from '../../Forms/AddCourse';
import AlertNotification from '../../Common/AlertNotification';
import DeleteConfirmationModal from '../../Common/DeleteConfirmationModel';

// Alerts and Delete modal are imported from Common components

const UniversityAdminManageCourses = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    
    // Enhanced state management for professional alerts and delete confirmation
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [deleteModal, setDeleteModal] = useState({ 
        show: false, 
        itemId: null, 
        itemName: '', 
        itemType: 'item' 
    });

    // course form state removed from parent; managed inside AddCourse modal

    // Listen for messages from child windows (modals)
    useEffect(() => {
        const handleMessage = (event) => {
            // Handle messages from our own origin
            if (event.data && event.data.type === 'alert') {
                const { type, message } = event.data.data;
                
                // Validate message format
                if (type && message) {
                    setAlert(event.data.data);
                } else {
                    console.error('Invalid alert message format:', event.data.data);
                    setAlert({
                        show: true,
                        type: 'error',
                        message: 'Received invalid alert message'
                    });
                }
            }
        };

        window.addEventListener('message', handleMessage);
        
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://sih-4ptm.onrender.com/api/v1/course", {
                    method: "GET",
                    credentials: "include",
                });
                
                console.log('Course API response status:', res.status);
                
                const data = await res.json();
                console.log('Course API response data:', data);
                
                if (res.ok) {
                    setCourses(data);
                } else {
                    console.error("Error fetching courses:", data.message);
                    setAlert({
                        show: true,
                        type: 'error',
                        message: `Error fetching courses: ${data.message}`
                    });
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setAlert({
                    show: true,
                    type: 'error',
                    message: `Network error while fetching courses: ${err.message}`
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://sih-4ptm.onrender.com/api/v1/subject", {
                    method: "GET",
                    credentials: "include",
                });
                
                console.log('Subject API response status:', res.status);
                
                const data = await res.json();
                console.log('Subject API response data:', data);
                
                if (res.ok) {
                    setSubjects(data);
                } else {
                    console.error("Error fetching subjects:", data.message);
                    setAlert({
                        show: true,
                        type: 'error',
                        message: `Error fetching subjects: ${data.message}`
                    });
                }
            } catch (err) {
                console.error("Error fetching subjects:", err);
                setAlert({
                    show: true,
                    type: 'error',
                    message: `Network error while fetching subjects: ${err.message}`
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    // Subject Form State
    // subject form state removed from parent; managed inside AddCourse modal

    // Professional alert system - replaces basic alert() calls
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    // Convenience methods for different alert types
    const showSuccessAlert = (message) => showAlert('success', message);
    const showErrorAlert = (message) => showAlert('error', message);
    // const showWarningAlert = (message) => showAlert('warning', message);
    // const showInfoAlert = (message) => showAlert('info', message);

    const hideAlert = () => {
        setAlert({ show: false, type: 'info', message: '' });
    };

    // Enhanced form reset with better state management
    // no local reset needed; AddCourse handles its own state

    const handleEdit = (item) => {
        console.log('Editing item:', item);
        
        if (!item) {
            console.error('Invalid item passed to handleEdit');
            return;
        }
        
        setEditingItem(item);
        
        // form state lives inside AddCourse; parent only tracks current item
        
        setShowEditModal(true);
    };

    // removed local handleUpdate, updates are handled via AddCourse callbacks

    // Professional delete confirmation system - replaces basic confirm() dialog
    const handleDeleteClick = (id, itemName) => {
        setDeleteModal({
            show: true,
            itemId: id,
            itemName: itemName,
            itemType: activeTab === 'courses' ? 'course' : 'subject'
        });
    };

    // Enhanced delete handler with professional confirmation and alerts
    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'courses' ? 'course' : 'subject';
            const itemId = deleteModal.itemId;
            const itemName = deleteModal.itemName;
            const itemType = deleteModal.itemType;

            // Real API call to delete from backend
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/${endpoint}/${itemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                // Remove item from local state only after successful API call
                if (activeTab === 'courses') {
                    setCourses(prevCourses => prevCourses.filter(course => course._id !== itemId));
                } else {
                    setSubjects(prevSubjects => prevSubjects.filter(subject => subject._id !== itemId));
                }

                setLoading(false);
                setDeleteModal({ show: false, itemId: null, itemName: '', itemType: 'item' });
                // Professional success alert with better messaging
                showSuccessAlert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} "${itemName}" deleted successfully!`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }
        } catch (error) {
            setLoading(false);
            // Professional error alert with helpful messaging
            showErrorAlert(`Failed to delete ${deleteModal.itemType}. ${error.message}`);
        }
    };

    // Close delete modal handler
    const handleDeleteCancel = () => {
        setDeleteModal({ show: false, itemId: null, itemName: '', itemType: 'item' });
    };

    // Edit course function
    // course edit helper is same as handleEdit

    // Edit subject function
    // subject edit helper is same as handleEdit

    // Update course function
    // removing unused legacy helpers to fix lints
    /* const handleUpdateCourse = async (courseId, courseData) => {
        try {
            setLoading(true);
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/course/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(courseData),
            });

            const data = await res.json();

            if (res.ok) {
                setCourses(courses.map(course => course._id === courseId ? data.course : course));
                setAlert({
                    show: true,
                    type: 'success',
                    message: `Course updated successfully`
                });
                return true;
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: `Error updating course: ${data.message}`
                });
                return false;
            }
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: `Network error updating course: ${error.message}`
            });
            return false;
        } finally {
            setLoading(false);
        }
    }; */

    // Update subject function
    /* const handleUpdateSubject = async (subjectId, subjectData) => {
        try {
            setLoading(true);
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/subject/${subjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(subjectData),
            });

            const data = await res.json();

            if (res.ok) {
                setSubjects(subjects.map(subject => subject._id === subjectId ? data.subject : subject));
                setAlert({
                    show: true,
                    type: 'success',
                    message: `Subject updated successfully`
                });
                return true;
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: `Error updating subject: ${data.message}`
                });
                return false;
            }
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: `Network error updating subject: ${error.message}`
            });
            return false;
        } finally {
            setLoading(false);
        }
    }; */

    // Delete course function
    /* const handleDeleteCourse = async (courseId, courseName) => {
        try {
            setLoading(true);
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/course/${courseId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                setCourses(courses.filter(course => course._id !== courseId));
                setAlert({
                    show: true,
                    type: 'success',
                    message: `Course "${courseName}" deleted successfully`
                });
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: `Error deleting course: ${data.message}`
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: `Network error deleting course: ${error.message}`
            });
        } finally {
            setLoading(false);
            setDeleteModal({ show: false, itemId: null, itemName: '', itemType: 'item' });
        }
    }; */

    // Delete subject function
    /* const handleDeleteSubject = async (subjectId, subjectName) => {
        try {
            setLoading(true);
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/subject/${subjectId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                setSubjects(subjects.filter(subject => subject._id !== subjectId));
                setAlert({
                    show: true,
                    type: 'success',
                    message: `Subject "${subjectName}" deleted successfully`
                });
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: `Error deleting subject: ${data.message}`
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: `Network error deleting subject: ${error.message}`
            });
        } finally {
            setLoading(false);
            setDeleteModal({ show: false, itemId: null, itemName: '', itemType: 'item' });
        }

    }; */

    const filteredCourses = courses.filter(course =>
        course.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.specialization && course.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeColor = (type) => {
        switch (type) {
            case 'CORE': return 'bg-blue-100 text-blue-800';
            case 'ELECTIVE': return 'bg-green-100 text-green-800';
            case 'LAB': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStats = () => {
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
    };

    const stats = getStats();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
              

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                        className="p-4 rounded-lg border shadow-sm">
                        <div className="flex items-center">
                            {activeTab === 'courses' ? (
                                <GraduationCap size={20} style={{ color: '#2563EB' }} className="mr-2" />
                            ) : (
                                <BookOpen size={20} style={{ color: '#2563EB' }} className="mr-2" />
                            )}
                            <div>
                                <p style={{ color: '#6B7280' }} className="text-sm font-medium">
                                    Total {activeTab === 'courses' ? 'Courses' : 'Subjects'}
                                </p>
                                <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'courses' ? (
                        <>
                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                                className="p-4 rounded-lg border shadow-sm">
                                <div>
                                    <p style={{ color: '#6B7280' }} className="text-sm font-medium">B.Tech Programs</p>
                                    <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.btech}</p>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                                className="p-4 rounded-lg border shadow-sm">
                                <div>
                                    <p style={{ color: '#6B7280' }} className="text-sm font-medium">M.Tech Programs</p>
                                    <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.mtech}</p>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                                className="p-4 rounded-lg border shadow-sm">
                                <div>
                                    <p style={{ color: '#6B7280' }} className="text-sm font-medium">MBA Programs</p>
                                    <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.mba}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                                className="p-4 rounded-lg border shadow-sm">
                                <div>
                                    <p style={{ color: '#6B7280' }} className="text-sm font-medium">Core Subjects</p>
                                    <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.core}</p>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                                className="p-4 rounded-lg border shadow-sm">
                                <div>
                                    <p style={{ color: '#6B7280' }} className="text-sm font-medium">Elective Subjects</p>
                                    <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.elective}</p>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                                className="p-4 rounded-lg border shadow-sm">
                                <div>
                                    <p style={{ color: '#6B7280' }} className="text-sm font-medium">Lab Subjects</p>
                                    <p style={{ color: '#111827' }} className="text-2xl font-bold">{stats.lab}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Main Content Card */}
                <div style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
                    className="rounded-xl border shadow-lg hover:shadow-xl transition-shadow duration-300">

                    {/* Controls */}
                    <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                        {/* Tabs */}
                        <div className="flex space-x-1 mb-6">
                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'courses'
                                        ? 'text-blue-600 bg-blue-50 '
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <GraduationCap size={16} className="inline mr-2" />
                                Manage Courses
                            </button>
                            <button
                                onClick={() => setActiveTab('subjects')}
                                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'subjects'
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <BookOpen size={16} className="inline mr-2" />
                                Manage Subjects
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search size={18} style={{ color: '#6B7280' }}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ borderColor: '#E5E7EB' }}
                                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                />
                            </div>

                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{ backgroundColor: '#2563EB' }}
                                className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} className="mr-2" />
                                Add {activeTab === 'courses' ? 'Course' : 'Subject'}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-x-auto">
                        {activeTab === 'courses' ? (
                            // Courses Table
                            <table className="w-full">
                                <thead style={{ backgroundColor: '#F9FAFB' }}>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Course Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Program Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Semesters
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: '#E5E7EB' }}>
                                    {filteredCourses.map((course) => (
                                        <tr key={course._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div style={{ color: '#111827' }} className="text-sm font-medium">
                                                        {course.courseId}
                                                    </div>
                                                    <div style={{ color: '#6B7280' }} className="text-sm">
                                                        {course.degree} - {course.branch}
                                                    </div>
                                                    {course.specialization && (
                                                        <div style={{ color: '#6B7280' }} className="text-sm">
                                                            Specialization: {course.specialization}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {course.degree}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div style={{ color: '#6B7280' }} className="text-sm">
                                                    {course.totalSemester} Semesters
                                                </div>
                                                <div style={{ color: '#6B7280' }} className="text-sm">
                                                    {course.semesters.length} configured
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(course)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all duration-200"
                                                        title={`Edit ${course.courseId}`}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(course._id, course.courseId)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-all duration-200"
                                                        title={`Delete ${course.courseId}`}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            // Subjects Table
                            <table className="w-full">
                                <thead style={{ backgroundColor: '#F9FAFB' }}>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Credits
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Max Marks
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: '#E5E7EB' }}>
                                    {filteredSubjects.map((subject) => (
                                        <tr key={subject._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div style={{ color: '#111827' }} className="text-sm font-medium">
                                                        {subject.name}
                                                    </div>
                                                    <div style={{ color: '#6B7280' }} className="text-sm">
                                                        Code: {subject.code}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(subject.type)}`}>
                                                    {subject.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div style={{ color: '#111827' }} className="text-sm font-medium">
                                                    {subject.credits}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div style={{ color: '#6B7280' }} className="text-sm">
                                                    Internal: {subject.maxMarks.internal}
                                                </div>
                                                <div style={{ color: '#6B7280' }} className="text-sm">
                                                    External: {subject.maxMarks.external}
                                                </div>
                                                {subject.maxMarks.practical > 0 && (
                                                    <div style={{ color: '#6B7280' }} className="text-sm">
                                                        Practical: {subject.maxMarks.practical}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(subject)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-all duration-200"
                                                        title={`Edit ${subject.name}`}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(subject._id, subject.name)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-all duration-200"
                                                        title={`Delete ${subject.name}`}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {((activeTab === 'courses' && filteredCourses.length === 0) ||
                            (activeTab === 'subjects' && filteredSubjects.length === 0)) && (
                                <div className="text-center py-12">
                                    {activeTab === 'courses' ? (
                                        <GraduationCap size={48} style={{ color: '#6B7280' }} className="mx-auto mb-4" />
                                    ) : (
                                        <BookOpen size={48} style={{ color: '#6B7280' }} className="mx-auto mb-4" />
                                    )}
                                    <p style={{ color: '#6B7280' }} className="text-lg">
                                        No {activeTab} found
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <AddCourse 
                    setShowModal={setShowAddModal} 
                    activeTab={activeTab} 
                    mode="add"
                    onAddSuccess={(response) => {
                        try {
                            console.log('AddCourse onAddSuccess response:', response);
                            
                            // Add new item to local state
                            if (activeTab === 'courses') {
                                // For courses, the response contains the full course object
                                if (response && response.course) {
                                    setCourses(prevCourses => [...prevCourses, response.course]);
                                } else if (response && response._id) {
                                    setCourses(prevCourses => [...prevCourses, response]);
                                }
                            } else {
                                // For subjects, the response contains the full subject object
                                if (response && response.subject) {
                                    setSubjects(prevSubjects => [...prevSubjects, response.subject]);
                                } else if (response && response._id) {
                                    setSubjects(prevSubjects => [...prevSubjects, response]);
                                }
                            }
                            
                            showSuccessAlert(`${activeTab === 'courses' ? 'Course' : 'Subject'} added successfully!`);
                        } catch (error) {
                            console.error('Error in onAddSuccess:', error);
                            showErrorAlert(`Failed to add ${activeTab === 'courses' ? 'course' : 'subject'}. Please try again.`);
                        }
                    }}
                    onAddError={(error) => {
                        showErrorAlert(`Failed to add ${activeTab === 'courses' ? 'course' : 'subject'}. ${error.message || 'Please try again.'}`);
                    }}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <AddCourse
                    setShowModal={setShowEditModal}
                    activeTab={activeTab}
                    mode="edit"
                    initialData={editingItem}
                    onUpdateSuccess={(response) => {
                        try {
                            console.log('AddCourse onUpdateSuccess response:', response);
                            
                            // Update item in local state
                            if (activeTab === 'courses') {
                                // For courses, the response contains the full course object
                                if (response && response.course) {
                                    setCourses(prevCourses => 
                                        prevCourses.map(course => 
                                            course._id === response.course._id ? response.course : course
                                        )
                                    );
                                } else if (response && response._id) {
                                    setCourses(prevCourses => 
                                        prevCourses.map(course => 
                                            course._id === response._id ? response : course
                                        )
                                    );
                                }
                            } else {
                                // For subjects, the response contains the full subject object
                                if (response && response.subject) {
                                    setSubjects(prevSubjects => 
                                        prevSubjects.map(subject => 
                                            subject._id === response.subject._id ? response.subject : subject
                                        )
                                    );
                                } else if (response && response._id) {
                                    setSubjects(prevSubjects => 
                                        prevSubjects.map(subject => 
                                            subject._id === response._id ? response : subject
                                        )
                                    );
                                }
                            }
                            
                            showSuccessAlert(`${activeTab === 'courses' ? 'Course' : 'Subject'} updated successfully!`);
                        } catch (error) {
                            console.error('Error in onUpdateSuccess:', error);
                            showErrorAlert(`Failed to update ${activeTab === 'courses' ? 'course' : 'subject'}. Please try again.`);
                        }
                    }}
                    onUpdateError={(error) => {
                        showErrorAlert(`Failed to update ${activeTab === 'courses' ? 'course' : 'subject'}. ${error.message || 'Please try again.'}`);
                    }}
                />
            )}

            {/* Professional Alert Notification System */}
            <AlertNotification
                show={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={hideAlert}
                duration={4000}
                position="top-right"
                size="medium"
                closable={true}
                autoClose={true}
            />

            {/* Professional Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.show}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title={`Are you sure you want to delete this ${deleteModal.itemType}?`}
                description="This action cannot be undone. All associated data will be permanently removed."
                itemName={deleteModal.itemName}
                itemType={deleteModal.itemType}
                isLoading={loading}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default UniversityAdminManageCourses;