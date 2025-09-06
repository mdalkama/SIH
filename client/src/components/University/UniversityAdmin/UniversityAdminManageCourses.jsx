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
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);

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
                <AddCourse setShowModal={setShowAddModal} activeTab={activeTab} mode="add"/>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <AddCourse
                    setShowModal={setShowEditModal}
                    activeTab={activeTab}
                    mode="edit"
                />
            )}
        </div>
    );
};

export default UniversityAdminManageCourses;
