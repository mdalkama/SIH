import React from 'react'
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';


const AddCourse = ({ setShowAddModal, activeTab }) => {
    const [loading, setLoading] = useState(false);
    const [courseId, setCourseId] = useState("");
    const [degree, setDegree] = useState("");
    const [branch, setBranch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [totalSemester, setTotalSemester] = useState(0);
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

    const [allSubjects] = useState([
        { _id: "64f1a1b2c3d4e5f678901234", name: "Data Structures", code: "CS101" },
        { _id: "64f1a1b2c3d4e5f678901235", name: "Algorithms", code: "CS102" },
        { _id: "64f1a1b2c3d4e5f678901236", name: "Database Systems", code: "CS103" },
        { _id: "64f1a1b2c3d4e5f678901237", name: "Operating Systems", code: "CS104" },
        { _id: "64f1a1b2c3d4e5f678901238", name: "Computer Networks", code: "CS105" },
    ]);


        useEffect(() => {
            const newSemesters = Array.from({ length: totalSemester }, (_, index) => ({
                semesterNumber: index + 1,
                subjects: [],
            }));
            setSemesters(newSemesters);
        }, [totalSemester]);
    
        const handleSubjectChange = (semIndex, subjectId) => {
            const updated = [...semesters];
            if (!updated[semIndex].subjects.includes(subjectId)) {
                updated[semIndex].subjects.push(subjectId);
            }
            setSemesters(updated);
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
            const courseData = {
                degree,
                branch,
                specialization,
                totalSemester,
                semesters,
            };
            console.log("📌 Final Course Data:", courseData);
            alert("Course data logged in console!");
        };






    const handleAddCourse = async () => {
        setLoading(true);
        try {
            const courseData = {
                courseId,
                degree,
                branch,
                specialization,
                totalSemester,
                semesters,
            };
            const res = await fetch('https://sih-4ptm.onrender.com/api/v1/course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(courseData)
            });
            const data = await res.json();
            console.log(data)
            if (data.success) {
                console.log(data)
            } else {
                alert('Error adding course');
            }
        } catch (error) {
            alert('Error adding course catch');
        } finally {
            setLoading(false);
        }
    }

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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-full w-full flex md:items-center items-start justify-center z-[100]">
            <div style={{ backgroundColor: '#FFFFFF' }}
                className="rounded-lg shadow-xl w-full  max-w-2xl h-screen sm:max-h-[90vh] overflow-y-auto">

                <div className="p-6 border-b h-[80px]" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex items-center justify-between">
                        <h2 style={{ color: '#111827' }} className="text-xl font-bold">
                            Add New {activeTab === 'courses' ? 'Course' : 'Subject'}
                        </h2>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6 h-[calc(100%-180px)] overflow-y-auto">
                    {activeTab === 'courses' ? (
                        // Course Form
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                        Course ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
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
                                        value={degree}
                                        onChange={(e) => setDegree(e.target.value)}
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
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value )}
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
                                        value={totalSemester}
                                        onChange={(e) => setTotalSemester(e.target.value )}
                                        style={{ borderColor: '#E5E7EB' }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select semesters</option>
                                        <option value="2">2</option>
                                        <option value="4">4</option>
                                        <option value="6">6</option>
                                        <option value="8">8</option>
                                        <option value="10">10</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ color: '#111827' }} className="block text-sm font-medium mb-1">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value )}
                                    style={{ borderColor: '#E5E7EB' }}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Artificial Intelligence (optional)"
                                />
                            </div>

                            <div className="space-y-4">
                                {semesters.map((sem, semIndex) => (
                                    <div key={sem.semesterNumber} className="p-4 border rounded-lg bg-gray-50">
                                        <h4 className="font-medium mb-2">Semester {sem.semesterNumber}</h4>
                                        <select
                                            onChange={(e) => handleSubjectChange(semIndex, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                                        >
                                            <option value="">-- Select Subject --</option>
                                            {allSubjects.map((sub) => (
                                                <option key={sub._id} value={sub._id}>
                                                    {sub.name} ({sub.code})
                                                </option>
                                            ))}
                                        </select>

                                        <div className="mt-2 text-sm text-gray-700">
                                            <strong>Selected Subjects:</strong>{" "}
                                            {sem.subjects.map((subId) => {
                                                const subject = allSubjects.find((s) => s._id === subId);
                                                return (
                                                    <span
                                                        key={subId}
                                                        className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                                                    >
                                                        {subject ? subject.name : subId}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </>
                    ) : (
                        // Subject Form
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

                <div className="p-6 border-t h-[100px] flex justify-end space-x-3" style={{ borderColor: '#E5E7EB' }}>
                    <button
                        onClick={() => setShowAddModal(false)}
                        style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={activeTab === 'courses' ? handleAddCourse : handleAddSubject}
                        disabled={loading}
                        style={{ backgroundColor: '#2563EB' }}
                        className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : `Add ${activeTab === 'courses' ? 'Course' : 'Subject'}`}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddCourse