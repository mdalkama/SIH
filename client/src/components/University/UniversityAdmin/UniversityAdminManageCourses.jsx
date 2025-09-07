import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, GraduationCap, Eye, X, Save, CheckCircle, AlertCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import AddCourse from '../../Forms/AddCourse';

/**
 * Custom Alert Notification Component - Integrated directly in this file
 */
const AlertNotification = ({ 
    type = 'info', 
    message = '', 
    duration = 4000, 
    onClose, 
    show = false,
    position = 'top-right',
    size = 'medium', 
    closable = true,
    autoClose = true
}) => {
    // Auto-dismiss functionality
    useEffect(() => {
        if (show && autoClose && duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, autoClose, duration, onClose]);

    if (!show) return null;

    // Configuration for different alert types
    const alertConfig = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100'
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-600',
            iconBg: 'bg-yellow-100'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100'
        }
    };

    const config = alertConfig[type] || alertConfig.info;
    const IconComponent = config.icon;

    // Position configuration
    const positionClasses = {
        'top-right': 'fixed top-4 right-4',
        'top-left': 'fixed top-4 left-4',
        'bottom-right': 'fixed bottom-4 right-4',
        'bottom-left': 'fixed bottom-4 left-4',
        'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2'
    };

    // Size configuration
    const sizeClasses = {
        'small': 'max-w-xs sm:max-w-sm',
        'medium': 'max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl',
        'large': 'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl'
    };

    const positionClass = positionClasses[position] || positionClasses['top-right'];
    const sizeClass = sizeClasses[size] || sizeClasses['medium'];

    return (
        <div className={`${positionClass} z-50 w-full ${sizeClass} px-4 sm:px-6 md:px-8 lg:px-0`}>
            <div className={`
                ${config.bgColor} 
                ${config.borderColor} 
                ${config.textColor}
                border rounded-lg shadow-lg p-3 sm:p-4
                flex items-start gap-2 sm:gap-3
                transform transition-all duration-300 ease-in-out
                animate-in slide-in-from-right-5
                w-full
            `}>
                {/* Icon */}
                <div className={`${config.iconBg} rounded-full p-1 flex-shrink-0 mt-0.5`}>
                    <IconComponent size={16} className={`${config.iconColor} sm:w-5 sm:h-5`} />
                </div>
                
                {/* Message */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 break-words">
                        {message}
                    </p>
                </div>
                
                {/* Close Button - Only show if closable */}
                {closable && (
                    <button
                        onClick={onClose}
                        className={`
                            ${config.textColor} 
                            hover:opacity-70 
                            flex-shrink-0 
                            transition-opacity duration-200
                            p-1 rounded-full hover:bg-black hover:bg-opacity-10
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                        `}
                        aria-label="Close notification"
                    >
                        <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * Professional Delete Confirmation Modal Component - Integrated directly in this file
 */
const DeleteConfirmationModal = ({
    isOpen = false,
    onClose,
    onConfirm,
    title = "Are you sure you want to delete this item?",
    description = "This action cannot be undone.",
    itemName = "",
    itemType = "item",
    isLoading = false,
    confirmText = "Delete",
    cancelText = "Cancel"
}) => {
    // Handle ESC key press to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div 
                className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Confirm Deletion
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            aria-label="Close modal"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {/* Warning Icon and Main Content */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 size={20} className="text-red-600 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                                {description}
                            </p>
                            
                            {/* Item Details */}
                            {itemName && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle size={14} className="text-red-600 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-medium text-red-800">
                                            {itemType.charAt(0).toUpperCase() + itemType.slice(1)} to be deleted:
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold text-red-900 break-words">
                                        {itemName}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs sm:text-sm">Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm">{confirmText}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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

        const [courseForm, setCourseForm] = useState({
            courseId: '',
            degree: '',
            branch: '',
            specialization: '',
            totalSemester: '',
            semesters: []
        });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("https://sih-4ptm.onrender.com/api/v1/course", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (data) {
                    setCourses(data);
                    console.log(data);
                }
            } catch (err) {
                console.error("Error fetching logged-in user:", err);
                // Add some mock data for testing if API fails
                setCourses([
                    {
                        _id: "1",
                        courseId: "CS101",
                        degree: "B.Tech",
                        branch: "Computer Science",
                        specialization: "Software Engineering",
                        totalSemester: 8,
                        semesters: [1, 2, 3, 4, 5, 6, 7, 8]
                    },
                    {
                        _id: "2",
                        courseId: "IT102",
                        degree: "B.Tech",
                        branch: "Information Technology",
                        specialization: "Data Science",
                        totalSemester: 8,
                        semesters: [1, 2, 3, 4, 5, 6, 7, 8]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("https://sih-4ptm.onrender.com/api/v1/subject", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (data) {
                    setSubjects(data);
                    console.log(data);
                }
            } catch (err) {
                console.error("Error fetching logged-in user:", err);
                // Add some mock data for testing if API fails
                setSubjects([
                    {
                        _id: "1",
                        name: "Data Structures",
                        code: "CS101",
                        credits: 4,
                        type: "CORE",
                        maxMarks: { internal: 30, external: 70, practical: 0 }
                    },
                    {
                        _id: "2",
                        name: "Algorithms",
                        code: "CS102",
                        credits: 4,
                        type: "CORE",
                        maxMarks: { internal: 30, external: 70, practical: 0 }
                    },
                    {
                        _id: "3",
                        name: "Web Development",
                        code: "CS103",
                        credits: 3,
                        type: "ELECTIVE",
                        maxMarks: { internal: 30, external: 50, practical: 20 }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    // Subject Form State
    const [subjectForm, setSubjectForm] = useState({
        name: '',
        code: '',
        credits: '',
        type: 'CORE',
        maxMarks: {
            internal: 30,
            external: 70,
            practical: 0
        }
    });

    // Professional alert system - replaces basic alert() calls
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    // Convenience methods for different alert types
    const showSuccessAlert = (message) => showAlert('success', message);
    const showErrorAlert = (message) => showAlert('error', message);
    const showWarningAlert = (message) => showAlert('warning', message);
    const showInfoAlert = (message) => showAlert('info', message);

    const hideAlert = () => {
        setAlert({ show: false, type: 'info', message: '' });
    };

    // Enhanced form reset with better state management
    const resetForms = () => {
        setCourseForm({
            courseId: '',
            degree: '',
            branch: '',
            specialization: '',
            totalSemester: '',
            semesters: []
        });
        setSubjectForm({
            name: '',
            code: '',
            credits: '',
            type: 'CORE',
            maxMarks: {
                internal: 30,
                external: 70,
                practical: 0
            }
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'courses') {
            setCourseForm({
                courseId: item.courseId,
                degree: item.degree,
                branch: item.branch,
                specialization: item.specialization || '',
                totalSemester: item.totalSemester, // Keep as number, don't convert to string
                semesters: item.semesters || []
            });
        } else {
            setSubjectForm({
                name: item.name,
                code: item.code,
                credits: item.credits.toString(),
                type: item.type,
                maxMarks: item.maxMarks
            });
        }
        setShowEditModal(true);
    };

    // Enhanced update handler with professional alerts
    const handleUpdate = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'courses' ? 'course' : 'subject';
            const data = activeTab === 'courses' ? courseForm : subjectForm;
            const itemId = editingItem._id;

            // Real API call to update in backend
            const response = await fetch(`https://sih-4ptm.onrender.com/api/v1/${endpoint}/${itemId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const updatedItem = await response.json();
                
                // Update local state based on active tab
                if (activeTab === 'courses') {
                    setCourses(prevCourses => 
                        prevCourses.map(course => 
                            course._id === itemId 
                                ? { ...course, ...updatedItem }
                                : course
                        )
                    );
                } else {
                    setSubjects(prevSubjects => 
                        prevSubjects.map(subject => 
                            subject._id === itemId 
                                ? { ...subject, ...updatedItem }
                                : subject
                        )
                    );
                }

                setShowEditModal(false);
                setEditingItem(null);
                resetForms();
                setLoading(false);
                // Professional success alert instead of basic alert()
                showSuccessAlert(`${activeTab === 'courses' ? 'Course' : 'Subject'} updated successfully!`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update item');
            }
        } catch (error) {
            setLoading(false);
            // Professional error alert with better user experience
            showErrorAlert(`Failed to update ${activeTab === 'courses' ? 'course' : 'subject'}. ${error.message}`);
        }
    };

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
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 style={{ color: '#111827' }} className="text-3xl font-bold mb-2">
                        Academic Management
                    </h1>
                    <p style={{ color: '#6B7280' }} className="text-base">
                        Manage courses and subjects for your institution
                    </p>
                </div>

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
                            // Handle different response structures
                            const newItem = response.data || response.course || response.subject || response;
                            
                            // Validate that we have a valid item
                            if (!newItem || (!newItem._id && !newItem.id)) {
                                // Create a fallback item with basic structure
                                const fallbackItem = {
                                    _id: `temp_${Date.now()}`,
                                    courseId: response.courseId || 'New Course',
                                    degree: response.degree || 'B.Tech',
                                    branch: response.branch || 'Computer Science',
                                    specialization: response.specialization || '',
                                    totalSemester: response.totalSemester || 8,
                                    semesters: response.semesters || []
                                };
                                
                                if (activeTab === 'courses') {
                                    setCourses(prevCourses => [...prevCourses, fallbackItem]);
                                } else {
                                    setSubjects(prevSubjects => [...prevSubjects, fallbackItem]);
                                }
                            } else {
                                // Add new item to local state
                                if (activeTab === 'courses') {
                                    setCourses(prevCourses => [...prevCourses, newItem]);
                                } else {
                                    setSubjects(prevSubjects => [...prevSubjects, newItem]);
                                }
                            }
                            
                            showSuccessAlert(`${activeTab === 'courses' ? 'Course' : 'Subject'} added successfully!`);
                        } catch (error) {
                            showErrorAlert(`Failed to add ${activeTab === 'courses' ? 'course' : 'subject'}. Please try again.`);
                        }
                    }}
                    onAddError={(error) => {
                        showErrorAlert(`Failed to add ${activeTab === 'courses' ? 'course' : 'subject'}. ${error.message}`);
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
                            // Handle different response structures
                            const updatedItem = response.data || response.course || response.subject || response;
                            
                            // Validate that we have a valid item
                            if (!updatedItem || (!updatedItem._id && !updatedItem.id)) {
                                // For updates, we need to merge with existing data
                                const existingItem = activeTab === 'courses' 
                                    ? courses.find(c => c._id === editingItem._id)
                                    : subjects.find(s => s._id === editingItem._id);
                                
                                if (existingItem) {
                                    const mergedItem = { ...existingItem, ...response };
                                    if (activeTab === 'courses') {
                                        setCourses(prevCourses => 
                                            prevCourses.map(course => 
                                                course._id === editingItem._id ? mergedItem : course
                                            )
                                        );
                                    } else {
                                        setSubjects(prevSubjects => 
                                            prevSubjects.map(subject => 
                                                subject._id === editingItem._id ? mergedItem : subject
                                            )
                                        );
                                    }
                                }
                            } else {
                                // Update item in local state
                                if (activeTab === 'courses') {
                                    setCourses(prevCourses => 
                                        prevCourses.map(course => 
                                            course._id === updatedItem._id ? updatedItem : course
                                        )
                                    );
                                } else {
                                    setSubjects(prevSubjects => 
                                        prevSubjects.map(subject => 
                                            subject._id === updatedItem._id ? updatedItem : subject
                                        )
                                    );
                                }
                            }
                            
                            showSuccessAlert(`${activeTab === 'courses' ? 'Course' : 'Subject'} updated successfully!`);
                        } catch (error) {
                            showErrorAlert(`Failed to update ${activeTab === 'courses' ? 'course' : 'subject'}. Please try again.`);
                        }
                    }}
                    onUpdateError={(error) => {
                        showErrorAlert(`Failed to update ${activeTab === 'courses' ? 'course' : 'subject'}. ${error.message}`);
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