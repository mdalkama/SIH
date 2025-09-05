import React, { useState, useEffect } from "react";

const CourseForm = () => {
    const [degree, setDegree] = useState("");
    const [branch, setBranch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [totalSemester, setTotalSemester] = useState(8);
    const [semesters, setSemesters] = useState([]);

    const [allSubjects] = useState([
        { _id: "sub1", name: "Data Structures", code: "CS101" },
        { _id: "sub2", name: "Algorithms", code: "CS102" },
        { _id: "sub3", name: "Database Systems", code: "CS103" },
        { _id: "sub4", name: "Operating Systems", code: "CS104" },
        { _id: "sub5", name: "Computer Networks", code: "CS105" },
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

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4">Create Course</h2>

            {/* Degree */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                    Degree
                </label>
                <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g., B.Tech"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                />
            </div>

            {/* Branch */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                    Branch
                </label>
                <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g., Computer Science Engineering"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                />
            </div>

            {/* Specialization */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                    Specialization
                </label>
                <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g., Artificial Intelligence"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                />
            </div>

            {/* Total Semester */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                    Total Semesters
                </label>
                <input
                    type="number"
                    value={totalSemester}
                    onChange={(e) => setTotalSemester(Number(e.target.value))}
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                />
            </div>

            {/* Semesters */}
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

            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Save Course
            </button>
        </form>
    );
};

export default CourseForm;
