import React from 'react';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const AddEditModal = ({
    setShowModal,
    activeTab,
    mode = 'add', // 'add' or 'edit'
    initialData = null,
    onAddSuccess,
    onAddError,
    onUpdateSuccess,
    onUpdateError,
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

    // Mock subjects data - replace with API call
    const [allSubjects] = useState([
        { _id: "64f1a1b2c3d4e5f678901234", name: "Data Structures", code: "CS101" },
        { _id: "64f1a1b2c3d4e5f678901235", name: "Algorithms", code: "CS102" },
        { _id: "64f1a1b2c3d4e5f678901236", name: "Database Systems", code: "CS103" },
        { _id: "64f1a1b2c3d4e5f678901237", name: "Operating Systems", code: "CS104" },
        { _id: "64f1a1b2c3d4e5f678901238", name: "Computer Networks", code: "CS105" },
        { _id: "64f1a1b2c3d4e5f678901239", name: "Software Engineering", code: "CS106" },
        { _id: "64f1a1b2c3d4e5f678901240", name: "Web Development", code: "CS107" },
        { _id: "64f1a1b2c3d4e5f678901241", name: "Machine Learning", code: "CS108" },
        { _id: "64f1a1b2c3d4e5f678901242", name: "Artificial Intelligence", code: "CS109" },
        { _id: "64f1a1b2c3d4e5f678901243", name: "Computer Graphics", code: "CS110" }
    ]);

    // Initialize form data based on mode
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            if (activeTab === 'courses') {
                setCourseId(initialData.courseId || '');
                setDegree(initialData.degree || '');
                setBranch(initialData.branch || '');
                setSpecialization(initialData.specialization || '');
                setTotalSemester(initialData.totalSemester || 8);
                setSemesters(initialData.semesters || []);
            } else {
                setSubjectForm(initialData);
            }
        }
    }, [mode, initialData, activeTab]);

    // Generate/resize semesters when totalSemester changes (works for add and edit)
    useEffect(() => {
        setSemesters((prev) => {
            const desired = parseInt(totalSemester) || 0;
            const existing = Array.isArray(prev) ? prev : [];

            // Keep existing semesters up to the desired count and normalize
            const trimmed = existing.slice(0, desired).map((s, i) => ({
                semesterNumber: i + 1,
                subjects: Array.isArray(s?.subjects) ? s.subjects : [],
            }));

            // If we need more, append fresh semesters
            if (trimmed.length < desired) {
                const toAdd = Array.from(
                    { length: desired - trimmed.length },
                    (_, idx) => ({
                        semesterNumber: trimmed.length + idx + 1,
                        subjects: [],
                    })
                );
                return [...trimmed, ...toAdd];
            }

            return trimmed;
        });
    }, [totalSemester]);

    // Add subject to semester
    const handleAddSubjectToSemester = (semIndex, subjectId) => {
        if (!subjectId) return;

        const updated = [...semesters];
        if (!updated[semIndex].subjects.includes(subjectId)) {
            updated[semIndex].subjects.push(subjectId);
        }
        setSemesters(updated);
    };

    // Remove subject from semester
    const handleRemoveSubjectFromSemester = (semIndex, subjectId) => {
        const updated = [...semesters];
        updated[semIndex].subjects = updated[semIndex].subjects.filter(id => id !== subjectId);
        setSemesters(updated);
    };

    // Get subject name by ID
    const getSubjectById = (id) => {
        return allSubjects.find(subject => subject._id === id);
    };

    // Handle Course Add/Edit
    const handleCourseSubmit = async () => {
        setLoading(true);
        try {
            const courseData = {
                courseId,
                degree,
                branch,
                specialization,
                totalSemester: parseInt(totalSemester),
                semesters,
            };

            const url = mode === 'edit'
                ? `https://sih-4ptm.onrender.com/api/v1/course/${initialData._id}`
                : 'https://sih-4ptm.onrender.com/api/v1/course';

            const method = mode === 'edit' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(courseData)
            });

            const data = await res.json();

            if (data.success) {
                // Inform parent for state update
                if (mode === 'edit') {
                    onUpdateSuccess && onUpdateSuccess(data);
                } else {
                    onAddSuccess && onAddSuccess(data);
                }
                resetForms();
                setShowModal(false);
            } else {
                const err = new Error(`Error ${mode === 'edit' ? 'updating' : 'adding'} course`);
                if (mode === 'edit') onUpdateError && onUpdateError(err);
                else onAddError && onAddError(err);
            }
        } catch (error) {
            if (mode === 'edit') onUpdateError && onUpdateError(error);
            else onAddError && onAddError(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Subject Add/Edit
    const handleSubjectSubmit = async () => {
        setLoading(true);
        try {
            const url = mode === 'edit'
                ? `https://sih-4ptm.onrender.com/api/v1/subject/${initialData._id}`
                : 'https://sih-4ptm.onrender.com/api/v1/subject';

            const method = mode === 'edit' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(subjectForm)
            });

            const data = await res.json();

            if (data.success) {
                if (mode === 'edit') {
                    onUpdateSuccess && onUpdateSuccess(data);
                } else {
                    onAddSuccess && onAddSuccess(data);
                }
                resetForms();
                setShowModal(false);
            } else {
                const err = new Error(`Error ${mode === 'edit' ? 'updating' : 'adding'} subject`);
                if (mode === 'edit') onUpdateError && onUpdateError(err);
                else onAddError && onAddError(err);
            }
        } catch (error) {
            if (mode === 'edit') onUpdateError && onUpdateError(error);
            else onAddError && onAddError(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForms = () => {
        setCourseId('');
        setDegree('');
        setBranch('');
        setSpecialization('');
        setTotalSemester(8);
        setSemesters([]);

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

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'edit' ? 'Edit' : 'Add New'} {activeTab === 'courses' ? 'Course' : 'Subject'}
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'courses' ? (
                        // Course Form
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Course ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., CSE2024"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Degree *
                                    </label>
                                    <select
                                        value={degree}
                                        onChange={(e) => setDegree(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Branch *
                                    </label>
                                    <input
                                        type="text"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Computer Science Engineering"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Total Semesters *
                                    </label>
                                    <select
                                        value={totalSemester}
                                        onChange={(e) => setTotalSemester(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select semesters</option>
                                        <option value={2}>2</option>
                                        <option value={4}>4</option>
                                        <option value={6}>6</option>
                                        <option value={8}>8</option>
                                        <option value={10}>10</option>
                                        <option value={12}>12</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Artificial Intelligence (optional)"
                                />
                            </div>

                            {/* Semesters */}
                            {totalSemester > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Semester Subjects</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {semesters.map((sem, semIndex) => (
                                            <div key={sem.semesterNumber} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-700">
                                                        Semester {sem.semesterNumber}
                                                    </h4>
                                                    <span className="text-sm text-gray-500">
                                                        {sem.subjects.length} subjects
                                                    </span>
                                                </div>

                                                {/* Add Subject Dropdown */}
                                                <div className="mb-3">
                                                    <select
                                                        onChange={(e) => {
                                                            handleAddSubjectToSemester(semIndex, e.target.value);
                                                            e.target.value = '';
                                                        }}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">+ Add Subject</option>
                                                        {allSubjects
                                                            .filter(subject => !sem.subjects.includes(subject._id))
                                                            .map((subject) => (
                                                                <option key={subject._id} value={subject._id}>
                                                                    {subject.name} ({subject.code})
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>

                                                {/* Selected Subjects */}
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {sem.subjects.map((subjectId) => {
                                                        const subject = getSubjectById(subjectId);
                                                        return (
                                                            <div
                                                                key={subjectId}
                                                                className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"
                                                            >
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                                        {subject?.name || 'Unknown Subject'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {subject?.code}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRemoveSubjectFromSemester(semIndex, subjectId)}
                                                                    className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {sem.subjects.length === 0 && (
                                                    <p className="text-sm text-gray-400 text-center py-4">
                                                        No subjects added yet
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Subject Form
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={subjectForm.name}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Data Structures and Algorithms"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={subjectForm.code}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., CS101"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Credits
                                    </label>
                                    <input
                                        type="number"
                                        value={subjectForm.credits}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 4"
                                        min="0"
                                        max="10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject Type
                                    </label>
                                    <select
                                        value={subjectForm.type}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="CORE">Core</option>
                                        <option value="ELECTIVE">Elective</option>
                                        <option value="LAB">Lab</option>
                                    </select>
                                </div>
                            </div>

                            {/* Max Marks Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Maximum Marks Distribution
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Internal Marks
                                        </label>
                                        <input
                                            type="number"
                                            value={subjectForm.maxMarks.internal}
                                            onChange={(e) => setSubjectForm({
                                                ...subjectForm,
                                                maxMarks: { ...subjectForm.maxMarks, internal: parseInt(e.target.value) || 0 }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            External Marks
                                        </label>
                                        <input
                                            type="number"
                                            value={subjectForm.maxMarks.external}
                                            onChange={(e) => setSubjectForm({
                                                ...subjectForm,
                                                maxMarks: { ...subjectForm.maxMarks, external: parseInt(e.target.value) || 0 }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Practical Marks
                                        </label>
                                        <input
                                            type="number"
                                            value={subjectForm.maxMarks.practical}
                                            onChange={(e) => setSubjectForm({
                                                ...subjectForm,
                                                maxMarks: { ...subjectForm.maxMarks, practical: parseInt(e.target.value) || 0 }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 text-sm text-gray-600 font-medium">
                                    Total: {subjectForm.maxMarks.internal + subjectForm.maxMarks.external + subjectForm.maxMarks.practical} marks
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={activeTab === 'courses' ? handleCourseSubmit : handleSubjectSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>{mode === 'edit' ? 'Updating...' : 'Adding...'}</span>
                            </div>
                        ) : (
                            `${mode === 'edit' ? 'Update' : 'Add'} ${activeTab === 'courses' ? 'Course' : 'Subject'}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditModal;