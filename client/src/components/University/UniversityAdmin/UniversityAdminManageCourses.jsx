import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, GraduationCap, Eye, X, Save } from 'lucide-react';
import AddCourse from '../../Forms/AddCourse';

const UniversityAdminManageCourses = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);

        const [courseForm, setCourseForm] = useState({
            courseId: '',
            degree: '',
            branch: '',
            specialization: '',
            totalSemester: '',
            semesters: []
        });

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

    // Mock data - replace with actual API calls
    const [courses] = useState([
        {
            _id: '1',
            courseId: 'CSE2024',
            degree: 'B.Tech',
            branch: 'Computer Science Engineering',
            specialization: 'Artificial Intelligence',
            totalSemester: 8,
            semesters: [
                { semester: 1, subjects: ['SUB001', 'SUB002'] },
                { semester: 2, subjects: ['SUB003', 'SUB004'] }
            ],
            createdAt: '2024-01-15'
        },
        {
            _id: '2',
            courseId: 'ECE2024',
            degree: 'B.Tech',
            branch: 'Electronics & Communication',
            specialization: 'VLSI Design',
            totalSemester: 8,
            semesters: [
                { semester: 1, subjects: ['SUB005', 'SUB006'] },
                { semester: 2, subjects: ['SUB007', 'SUB008'] }
            ],
            createdAt: '2024-02-10'
        },
        {
            _id: '3',
            courseId: 'MBA2024',
            degree: 'MBA',
            branch: 'Management',
            specialization: 'Finance',
            totalSemester: 4,
            semesters: [
                { semester: 1, subjects: ['SUB007', 'SUB008'] }
            ],
            createdAt: '2024-03-05'
        }
    ]);

    const [subjects] = useState([
        {
            _id: 'SUB001',
            name: 'Data Structures and Algorithms',
            code: 'CS101',
            credits: 4,
            type: 'CORE',
            maxMarks: { internal: 30, external: 70, practical: 0 },
            createdAt: '2024-01-10'
        },
        {
            _id: 'SUB002',
            name: 'Database Management Systems',
            code: 'CS201',
            credits: 3,
            type: 'CORE',
            maxMarks: { internal: 30, external: 70, practical: 0 },
            createdAt: '2024-01-12'
        },
        {
            _id: 'SUB003',
            name: 'Machine Learning',
            code: 'CS301',
            credits: 4,
            type: 'ELECTIVE',
            maxMarks: { internal: 40, external: 60, practical: 0 },
            createdAt: '2024-01-15'
        },
        {
            _id: 'SUB004',
            name: 'Web Development Lab',
            code: 'CS401L',
            credits: 2,
            type: 'LAB',
            maxMarks: { internal: 50, external: 0, practical: 50 },
            createdAt: '2024-01-18'
        }
    ]);

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

    const handleAddCourse = async () => {
        setLoading(true);
        try {
            // API call would go here
            // const response = await fetch('/api/v1/courses', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(courseForm)
            // });

            setTimeout(() => {
                setShowAddModal(false);
                resetForms();
                setLoading(false);
                alert('Course added successfully!');
            }, 1500);
        } catch (error) {
            setLoading(false);
            alert('Error adding course');
        }
    };

    const handleAddSubject = async () => {
        setLoading(true);
        try {
            // API call would go here
            // const response = await fetch('/api/v1/subjects', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(subjectForm)
            // });

            setTimeout(() => {
                setShowAddModal(false);
                resetForms();
                setLoading(false);
                alert('Subject added successfully!');
            }, 1500);
        } catch (error) {
            setLoading(false);
            alert('Error adding subject');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'courses') {
            setCourseForm({
                courseId: item.courseId,
                degree: item.degree,
                branch: item.branch,
                specialization: item.specialization || '',
                totalSemester: item.totalSemester.toString(),
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

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'courses' ? 'courses' : 'subjects';
            const data = activeTab === 'courses' ? courseForm : subjectForm;

            // API call would go here
            // const response = await fetch(`/api/v1/${endpoint}/${editingItem._id}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(data)
            // });

            setTimeout(() => {
                setShowEditModal(false);
                setEditingItem(null);
                resetForms();
                setLoading(false);
                alert(`${activeTab === 'courses' ? 'Course' : 'Subject'} updated successfully!`);
            }, 1500);
        } catch (error) {
            setLoading(false);
            alert('Error updating item');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const endpoint = activeTab === 'courses' ? 'courses' : 'subjects';
            // API call would go here
            // await fetch(`/api/v1/${endpoint}/${id}`, { method: 'DELETE' });

            alert(`${activeTab === 'courses' ? 'Course' : 'Subject'} deleted successfully!`);
        } catch (error) {
            alert('Error deleting item');
        }
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
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
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
                    className="rounded-lg border shadow-sm">

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
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className="text-red-600 hover:text-red-900"
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
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(subject._id)}
                                                        className="text-red-600 hover:text-red-900"
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
                <AddCourse setShowAddModal={setShowAddModal} activeTab={activeTab}/>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-full w-full flex md:items-center items-start justify-center z-[100]">
                    <div style={{ backgroundColor: '#FFFFFF' }}
                        className="rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                            <div className="flex items-center justify-between">
                                <h2 style={{ color: '#111827' }} className="text-xl font-bold">
                                    Edit {activeTab === 'courses' ? 'Course' : 'Subject'}
                                </h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {activeTab === 'courses' ? (
                                // Course Edit Form
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Course ID *
                                            </label>
                                            <input
                                                type="text"
                                                value={courseForm.courseId}
                                                onChange={(e) => setCourseForm({ ...courseForm, courseId: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., CSE2024"
                                            />
                                        </div>

                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Degree *
                                            </label>
                                            <select
                                                value={courseForm.degree}
                                                onChange={(e) => setCourseForm({ ...courseForm, degree: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select degree</option>
                                                <option value="B.Tech">B.Tech</option>
                                                <option value="M.Tech">M.Tech</option>
                                                <option value="MBA">MBA</option>
                                                <option value="BBA">BBA</option>
                                                <option value="MCA">MCA</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Branch
                                            </label>
                                            <input
                                                type="text"
                                                value={courseForm.branch}
                                                onChange={(e) => setCourseForm({ ...courseForm, branch: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., Computer Science Engineering"
                                            />
                                        </div>

                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Total Semesters *
                                            </label>
                                            <select
                                                value={courseForm.totalSemester}
                                                onChange={(e) => setCourseForm({ ...courseForm, totalSemester: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select semesters</option>
                                                <option value="2">2</option>
                                                <option value="4">4</option>
                                                <option value="6">6</option>
                                                <option value="8">8</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            value={courseForm.specialization}
                                            onChange={(e) => setCourseForm({ ...courseForm, specialization: e.target.value })}
                                            style={{ borderColor: '#E5E7EB' }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Artificial Intelligence (optional)"
                                        />
                                    </div>
                                </>
                            ) : (
                                // Subject Edit Form
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Subject Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={subjectForm.name}
                                                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., Data Structures and Algorithms"
                                            />
                                        </div>

                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Subject Code *
                                            </label>
                                            <input
                                                type="text"
                                                value={subjectForm.code}
                                                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., CS101"
                                            />
                                        </div>

                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Credits
                                            </label>
                                            <input
                                                type="number"
                                                value={subjectForm.credits}
                                                onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., 4"
                                                min="0"
                                                max="10"
                                            />
                                        </div>

                                        <div>
                                            <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                                Subject Type
                                            </label>
                                            <select
                                                value={subjectForm.type}
                                                onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
                                                style={{ borderColor: '#E5E7EB' }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="CORE">Core</option>
                                                <option value="ELECTIVE">Elective</option>
                                                <option value="LAB">Lab</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Max Marks Section */}
                                    <div>
                                        <label style={{ color: '#111827' }} className="block text-sm font-medium mb-3">
                                            Maximum Marks Distribution
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label style={{ color: '#6B7280' }} className="block text-xs font-medium mb-1">
                                                    Internal Marks
                                                </label>
                                                <input
                                                    type="number"
                                                    value={subjectForm.maxMarks.internal}
                                                    onChange={(e) => setSubjectForm({
                                                        ...subjectForm,
                                                        maxMarks: { ...subjectForm.maxMarks, internal: parseInt(e.target.value) || 0 }
                                                    })}
                                                    style={{ borderColor: '#E5E7EB' }}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label style={{ color: '#6B7280' }} className="block text-xs font-medium mb-1">
                                                    External Marks
                                                </label>
                                                <input
                                                    type="number"
                                                    value={subjectForm.maxMarks.external}
                                                    onChange={(e) => setSubjectForm({
                                                        ...subjectForm,
                                                        maxMarks: { ...subjectForm.maxMarks, external: parseInt(e.target.value) || 0 }
                                                    })}
                                                    style={{ borderColor: '#E5E7EB' }}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label style={{ color: '#6B7280' }} className="block text-xs font-medium mb-1">
                                                    Practical Marks
                                                </label>
                                                <input
                                                    type="number"
                                                    value={subjectForm.maxMarks.practical}
                                                    onChange={(e) => setSubjectForm({
                                                        ...subjectForm,
                                                        maxMarks: { ...subjectForm.maxMarks, practical: parseInt(e.target.value) || 0 }
                                                    })}
                                                    style={{ borderColor: '#E5E7EB' }}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                                            Total: {subjectForm.maxMarks.internal + subjectForm.maxMarks.external + subjectForm.maxMarks.practical} marks
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t flex justify-end space-x-3" style={{ borderColor: '#E5E7EB' }}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                style={{ backgroundColor: '#2563EB' }}
                                className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                            >
                                <Save size={16} className="mr-2" />
                                {loading ? 'Updating...' : `Update ${activeTab === 'courses' ? 'Course' : 'Subject'}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityAdminManageCourses;
