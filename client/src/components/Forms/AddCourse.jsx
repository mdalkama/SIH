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
    const [allSubjects, setAllSubjects] = useState([]);
    const [subjectsLoading, setSubjectsLoading] = useState(true);

    // Fetch subjects from API
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setSubjectsLoading(true);
                const response = await fetch('https://sih-4ptm.onrender.com/api/v1/subject', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
                
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const uniqueSubjects = data.filter((subject, index, self) => 
                        index === self.findIndex(s => s._id === subject._id)
                    );
                    setAllSubjects(uniqueSubjects);
                } else {
                    setAllSubjects([]);
                }
            } catch (error) {
                console.log(error);
                
                setAllSubjects([]);
            } finally {
                setSubjectsLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    // Initialize form data based on mode
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
                
                const updatedSemesters = Array.from({ length: semesterCount }, (_, index) => {
                    const existingSem = existingSemesters.find(sem => sem.semesterNumber === index + 1);
                    const normalizedSubjects = (existingSem?.subjects || []).map(s => typeof s === 'string' ? s : s?._id).filter(Boolean);
                    return {
                        semesterNumber: index + 1,
                        subjects: normalizedSubjects
                    };
                });
                
                setSemesters(updatedSemesters);
            } else {
                const subjectData = {
                    name: initialData.name || '',
                    code: initialData.code || '',
                    credits: initialData.credits?.toString() || '',
                    type: initialData.type || 'CORE',
                    maxMarks: {
                        internal: initialData.maxMarks?.internal || 30,
                        external: initialData.maxMarks?.external || 70,
                        practical: initialData.maxMarks?.practical || 0
                    }
                };
                setSubjectForm(subjectData);
            }
        } else if (mode === 'add') {
            if (activeTab === 'courses') {
                setCourseId("");
                setDegree("");
                setBranch("");
                setSpecialization("");
                setTotalSemester(2);
                setSemesters([]);
            } else {
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
            }
        }
    }, [mode, initialData, activeTab]);

    // Generate semesters when totalSemester changes (for add mode only)
    useEffect(() => {
        if (mode === 'add') {
            const newSemesters = Array.from({ length: totalSemester }, (_, index) => {
                const existingSem = semesters.find(sem => sem.semesterNumber === index + 1);
                return {
                    semesterNumber: index + 1,
                    subjects: existingSem ? existingSem.subjects || [] : []
                };
            });
            
            setSemesters(newSemesters);
        }
    }, [totalSemester, mode, semesters]);

    // Add subject to semester
    const handleAddSubjectToSemester = (semIndex, subjectId) => {
        if (!subjectId) return;

        setSemesters(prevSemesters => {
            const updated = [...prevSemesters];
            if (!updated[semIndex].subjects) {
                updated[semIndex].subjects = [];
            }
            if (!updated[semIndex].subjects.includes(subjectId)) {
                updated[semIndex].subjects.push(subjectId);
            }
            return updated;
        });
    };

    // Remove subject from semester
    const handleRemoveSubjectFromSemester = (semIndex, subjectId) => {
        setSemesters(prevSemesters => {
            const updated = [...prevSemesters];
            if (!updated[semIndex].subjects) {
                updated[semIndex].subjects = [];
            }
            updated[semIndex].subjects = updated[semIndex].subjects.filter(id => id !== subjectId);
            return updated;
        });
    };

    const getSubjectById = (id) => {
        return allSubjects.find(subject => subject._id === id);
    };

    // Handle Course Add/Edit
    const handleCourseSubmit = async () => {
        setLoading(true);
        try {
            const hasSubjects = semesters.some(sem => 
                sem.subjects && Array.isArray(sem.subjects) && sem.subjects.length > 0
            );
            
            if (!hasSubjects) {
                throw new Error('Please add at least one subject to any semester before saving the course.');
            }

            const courseData = {
                courseId,
                degree,
                branch,
                specialization,
                totalSemester: parseInt(totalSemester),
                semesters: semesters.map(sem => ({
                    semesterNumber: sem.semesterNumber,
                    subjects: sem.subjects || []
                }))
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

            if (res.ok) {
                if (mode === 'edit') {
                    onUpdateSuccess && onUpdateSuccess(data);
                } else {
                    onAddSuccess && onAddSuccess(data);
                }
                resetForms();
                setShowModal(false);
            } else {
                const errorMessage = data.message || 'Failed to save course';
                if (mode === 'edit') {
                    onUpdateError && onUpdateError(new Error(errorMessage));
                } else {
                    onAddError && onAddError(new Error(errorMessage));
                }
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while saving the course';
            if (mode === 'edit') {
                onUpdateError && onUpdateError(new Error(errorMessage));
            } else {
                onAddError && onAddError(new Error(errorMessage));
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Subject Add/Edit
    const handleSubjectSubmit = async () => {
        setLoading(true);
        try {
            if (!subjectForm.name || !subjectForm.code) {
                throw new Error('Subject name and code are required.');
            }

            const url = mode === 'edit'
                ? `https://sih-4ptm.onrender.com/api/v1/subject/${initialData._id}`
                : 'https://sih-4ptm.onrender.com/api/v1/subject';

            const method = mode === 'edit' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...subjectForm,
                    credits: subjectForm.credits ? parseInt(subjectForm.credits) : 0
                })
            });

            const data = await res.json();

            if (res.ok) {
                if (mode === 'edit') {
                    onUpdateSuccess && onUpdateSuccess(data);
                } else {
                    onAddSuccess && onAddSuccess(data);
                }
                resetForms();
                setShowModal(false);
            } else {
                const errorMessage = data.message || 'Failed to save subject';
                if (mode === 'edit') {
                    onUpdateError && onUpdateError(new Error(errorMessage));
                } else {
                    onAddError && onAddError(new Error(errorMessage));
                }
            }
        } catch (error) {
            const errorMessage = error.message || 'An error occurred while saving the subject';
            if (mode === 'edit') {
                onUpdateError && onUpdateError(new Error(errorMessage));
            } else {
                onAddError && onAddError(new Error(errorMessage));
            }
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
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i+1} value={i+1}>{i+1}</option>
                                        ))}
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
                                                        {sem.subjects && Array.isArray(sem.subjects) ? sem.subjects.length : 0} subjects
                                                    </span>
                                                </div>

                                                {/* Add Subject Dropdown */}
                                                <div className="mb-3">
                                                    <select
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleAddSubjectToSemester(semIndex, e.target.value);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        disabled={subjectsLoading || !Array.isArray(allSubjects) || allSubjects.length === 0}
                                                    >
                                                        <option value="">+ Add Subject</option>
                                                        {subjectsLoading ? (
                                                            <option disabled>Loading subjects...</option>
                                                        ) : Array.isArray(allSubjects) && allSubjects.length > 0 ? (
                                                            allSubjects
                                                                .filter((subject, index, self) => 
                                                                    index === self.findIndex(s => s._id === subject._id)
                                                                )
                                                                .map((subject) => {
                                                                    const isAlreadyAdded = sem.subjects && Array.isArray(sem.subjects) && 
                                                                        sem.subjects.some(id => id === subject._id);
                                                                    return (
                                                                        !isAlreadyAdded && (
                                                                            <option key={subject._id} value={subject._id}>
                                                                                {subject.name} ({subject.code})
                                                                            </option>
                                                                        )
                                                                    );
                                                                })
                                                        ) : (
                                                            <option disabled>No subjects available</option>
                                                        )}
                                                    </select>
                                                </div>

                                                {/* Selected Subjects */}
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {sem.subjects && Array.isArray(sem.subjects) && sem.subjects.length > 0 ? (
                                                        [...new Set(sem.subjects)].map((subjectId) => {
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
                                                                            {subject?.code || 'N/A'}
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
                                                        })
                                                    ) : (
                                                        <p className="text-sm text-gray-400 text-center py-2">
                                                            No subjects added yet
                                                        </p>
                                                    )}
                                                </div>
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
                                        onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
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
                                        onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
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
                                        onChange={(e) => setSubjectForm(prev => ({ ...prev, credits: e.target.value }))}
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
                                        onChange={(e) => setSubjectForm(prev => ({ ...prev, type: e.target.value }))}
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
                                            onChange={(e) => setSubjectForm(prev => ({
                                                ...prev,
                                                maxMarks: { ...prev.maxMarks, internal: parseInt(e.target.value) || 0 }
                                            }))}
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
                                            onChange={(e) => setSubjectForm(prev => ({
                                                ...prev,
                                                maxMarks: { ...prev.maxMarks, external: parseInt(e.target.value) || 0 }
                                            }))}
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
                                            onChange={(e) => setSubjectForm(prev => ({
                                                ...prev,
                                                maxMarks: { ...prev.maxMarks, practical: parseInt(e.target.value) || 0 }
                                            }))}
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