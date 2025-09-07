import React, { useState } from 'react';
import { Book, Download, GraduationCap, Calendar, FileText, Trophy, ChevronDown, ChevronUp, Star, Clock, CheckCircle } from 'lucide-react';

const AcademicDashboard = () => {
    const [selectedSemester, setSelectedSemester] = useState(5);
    const [expandedSemesters, setExpandedSemesters] = useState([5]);
    const [activeTab, setActiveTab] = useState('current');

    // Mock student academic data
    const studentAcademicData = {
        courseId: "BTCSE2029",
        degree: "B.Tech",
        branch: "Computer Science",
        specialization: "Artificial Intelligence",
        currentSemester: 5,
        totalSemesters: 8,
        studentName: "Rahul Kumar",
        rollNumber: "2021CS001",
        cgpa: 8.65,
        completedCredits: 120,
        totalCredits: 160
    };

    // Mock semester data with subjects
    const semesterData = {
        1: {
            subjects: [
                { code: "MA101", name: "Engineering Mathematics I", credits: 4, type: "Theory", grade: "A", marks: 85 },
                { code: "PH101", name: "Engineering Physics", credits: 3, type: "Theory", grade: "A-", marks: 82 },
                { code: "CH101", name: "Engineering Chemistry", credits: 3, type: "Theory", grade: "B+", marks: 78 },
                { code: "CS101", name: "Programming Fundamentals", credits: 4, type: "Theory + Lab", grade: "A+", marks: 92 },
                { code: "EG101", name: "Engineering Graphics", credits: 2, type: "Practical", grade: "A", marks: 88 }
            ],
            sgpa: 8.4,
            totalCredits: 16,
            status: "Completed"
        },
        2: {
            subjects: [
                { code: "MA102", name: "Engineering Mathematics II", credits: 4, type: "Theory", grade: "A-", marks: 83 },
                { code: "PH102", name: "Applied Physics", credits: 3, type: "Theory", grade: "B+", marks: 79 },
                { code: "CS102", name: "Data Structures", credits: 4, type: "Theory + Lab", grade: "A+", marks: 94 },
                { code: "CS103", name: "Digital Logic Design", credits: 3, type: "Theory", grade: "A", marks: 86 },
                { code: "ME101", name: "Engineering Mechanics", credits: 3, type: "Theory", grade: "B+", marks: 77 }
            ],
            sgpa: 8.6,
            totalCredits: 17,
            status: "Completed"
        },
        3: {
            subjects: [
                { code: "MA201", name: "Discrete Mathematics", credits: 4, type: "Theory", grade: "A", marks: 87 },
                { code: "CS201", name: "Computer Organization", credits: 4, type: "Theory + Lab", grade: "A+", marks: 93 },
                { code: "CS202", name: "Object Oriented Programming", credits: 4, type: "Theory + Lab", grade: "A", marks: 89 },
                { code: "CS203", name: "Database Management Systems", credits: 3, type: "Theory", grade: "A-", marks: 84 },
                { code: "EC201", name: "Analog Electronics", credits: 3, type: "Theory", grade: "B+", marks: 76 }
            ],
            sgpa: 8.7,
            totalCredits: 18,
            status: "Completed"
        },
        4: {
            subjects: [
                { code: "CS301", name: "Analysis of Algorithms", credits: 4, type: "Theory", grade: "A+", marks: 91 },
                { code: "CS302", name: "Operating Systems", credits: 4, type: "Theory + Lab", grade: "A", marks: 88 },
                { code: "CS303", name: "Computer Networks", credits: 3, type: "Theory", grade: "A-", marks: 85 },
                { code: "CS304", name: "Software Engineering", credits: 3, type: "Theory", grade: "A", marks: 86 },
                { code: "MA301", name: "Probability and Statistics", credits: 3, type: "Theory", grade: "B+", marks: 78 }
            ],
            sgpa: 8.8,
            totalCredits: 17,
            status: "Completed"
        },
        5: {
            subjects: [
                { code: "CS401", name: "Machine Learning", credits: 4, type: "Theory + Lab", status: "Ongoing", attendance: 92 },
                { code: "CS402", name: "Artificial Intelligence", credits: 4, type: "Theory + Lab", status: "Ongoing", attendance: 89 },
                { code: "CS403", name: "Deep Learning", credits: 3, type: "Theory", status: "Ongoing", attendance: 95 },
                { code: "CS404", name: "Natural Language Processing", credits: 3, type: "Theory + Lab", status: "Ongoing", attendance: 88 },
                { code: "CS405", name: "Computer Vision", credits: 3, type: "Theory + Lab", status: "Ongoing", attendance: 91 },
                { code: "HS401", name: "Technical Communication", credits: 2, type: "Theory", status: "Ongoing", attendance: 85 }
            ],
            totalCredits: 19,
            status: "Current",
            upcomingAssignments: [
                { subject: "Machine Learning", title: "Linear Regression Assignment", dueDate: "2024-09-15" },
                { subject: "Deep Learning", title: "CNN Project", dueDate: "2024-09-20" }
            ]
        },
        6: {
            subjects: [
                { code: "CS501", name: "Distributed Systems", credits: 4, type: "Theory + Lab", status: "Not Started" },
                { code: "CS502", name: "Information Security", credits: 3, type: "Theory", status: "Not Started" },
                { code: "CS503", name: "Big Data Analytics", credits: 4, type: "Theory + Lab", status: "Not Started" },
                { code: "CS504", name: "Blockchain Technology", credits: 3, type: "Theory", status: "Not Started" },
                { code: "CS505", name: "Project Work I", credits: 4, type: "Project", status: "Not Started" }
            ],
            totalCredits: 18,
            status: "Upcoming"
        },
        7: {
            subjects: [
                { code: "CS601", name: "Advanced AI Techniques", credits: 4, type: "Theory + Lab", status: "Not Started" },
                { code: "CS602", name: "Robotics", credits: 3, type: "Theory + Lab", status: "Not Started" },
                { code: "CS603", name: "Cloud Computing", credits: 3, type: "Theory", status: "Not Started" },
                { code: "CS604", name: "Elective I", credits: 3, type: "Theory", status: "Not Started" },
                { code: "CS605", name: "Project Work II", credits: 4, type: "Project", status: "Not Started" }
            ],
            totalCredits: 17,
            status: "Upcoming"
        },
        8: {
            subjects: [
                { code: "CS701", name: "Industry Internship", credits: 8, type: "Internship", status: "Not Started" },
                { code: "CS702", name: "Major Project", credits: 8, type: "Project", status: "Not Started" },
                { code: "CS703", name: "Seminar", credits: 2, type: "Theory", status: "Not Started" }
            ],
            totalCredits: 18,
            status: "Upcoming"
        }
    };

    const toggleSemesterExpansion = (semester) => {
        setExpandedSemesters(prev =>
            prev.includes(semester)
                ? prev.filter(s => s !== semester)
                : [...prev, semester]
        );
    };

    const getGradeColor = (grade) => {
        const gradeColors = {
            'A+': 'text-green-700 bg-green-100',
            'A': 'text-green-600 bg-green-50',
            'A-': 'text-blue-600 bg-blue-50',
            'B+': 'text-yellow-600 bg-yellow-50',
            'B': 'text-orange-600 bg-orange-50',
            'B-': 'text-red-600 bg-red-50'
        };
        return gradeColors[grade] || 'text-gray-600 bg-gray-50';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Current': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'Ongoing': return <Clock className="w-4 h-4 text-blue-500" />;
            default: return <Calendar className="w-4 h-4 text-gray-400" />;
        }
    };

    const downloadSyllabus = (subjectCode, subjectName) => {
        // Mock download functionality
        alert(`Downloading syllabus for ${subjectName} (${subjectCode})`);
    };

    const renderCurrentSemester = () => {
        const currentSem = semesterData[studentAcademicData.currentSemester];

        return (
            <div className="space-y-6">
                {/* Current Semester Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Semester {studentAcademicData.currentSemester} - Current
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{currentSem.subjects.length}</p>
                            <p className="text-sm text-gray-600">Subjects</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{currentSem.totalCredits}</p>
                            <p className="text-sm text-gray-600">Credits</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {Math.round(currentSem.subjects.reduce((acc, sub) => acc + (sub.attendance || 0), 0) / currentSem.subjects.length)}%
                            </p>
                            <p className="text-sm text-gray-600">Avg Attendance</p>
                        </div>
                    </div>
                </div>

                {/* Current Subjects */}
                <div className="grid gap-4">
                    {currentSem.subjects.map((subject) => (
                        <div key={subject.code} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                                    <p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits • {subject.type}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-blue-600 font-medium">
                                        {subject.attendance}% Attendance
                                    </span>
                                    <button
                                        onClick={() => downloadSyllabus(subject.code, subject.name)}
                                        className="flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Download className="w-3 h-3 mr-1" />
                                        Syllabus
                                    </button>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${subject.attendance}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Upcoming Assignments */}
                {currentSem.upcomingAssignments && currentSem.upcomingAssignments.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                            Upcoming Assignments
                        </h4>
                        <div className="space-y-2">
                            {currentSem.upcomingAssignments.map((assignment, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{assignment.title}</p>
                                        <p className="text-sm text-gray-600">{assignment.subject}</p>
                                    </div>
                                    <p className="text-sm text-yellow-600 font-medium">Due: {assignment.dueDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderAllSemesters = () => {
        return (
            <div className="space-y-4">
                {Array.from({ length: studentAcademicData.totalSemesters }, (_, i) => i + 1).map((semester) => {
                    const semData = semesterData[semester];
                    const isExpanded = expandedSemesters.includes(semester);
                    const isCurrent = semester === studentAcademicData.currentSemester;

                    return (
                        <div key={semester} className={`border rounded-lg ${isCurrent ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleSemesterExpansion(semester)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon(semData.status)}
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Semester {semester}
                                                {isCurrent && <span className="text-blue-600 ml-2">(Current)</span>}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {semData.subjects.length} subjects • {semData.totalCredits} credits
                                                {semData.sgpa && <span> • SGPA: {semData.sgpa}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${semData.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                semData.status === 'Current' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {semData.status}
                                        </span>
                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-4 pb-4 border-t border-gray-200">
                                    <div className="mt-4 space-y-3">
                                        {semData.subjects.map((subject) => (
                                            <div key={subject.code} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{subject.name}</h4>
                                                    <p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits • {subject.type}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {subject.grade && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}>
                                                            {subject.grade}
                                                        </span>
                                                    )}
                                                    {subject.marks && (
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {subject.marks}/100
                                                        </span>
                                                    )}
                                                    {subject.attendance && (
                                                        <span className="text-sm text-blue-600">
                                                            {subject.attendance}%
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => downloadSyllabus(subject.code, subject.name)}
                                                        className="flex items-center px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                                                    >
                                                        <Download className="w-3 h-3 mr-1" />
                                                        Syllabus
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderResults = () => {
        const completedSemesters = Object.entries(semesterData).filter(([_, data]) => data.status === 'Completed');

        return (
            <div className="space-y-6">
                {/* Overall Performance */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Overall Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{studentAcademicData.cgpa}</p>
                            <p className="text-sm text-gray-600">CGPA</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{studentAcademicData.completedCredits}</p>
                            <p className="text-sm text-gray-600">Completed Credits</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{completedSemesters.length}</p>
                            <p className="text-sm text-gray-600">Semesters Completed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-orange-600">
                                {Math.round((studentAcademicData.completedCredits / studentAcademicData.totalCredits) * 100)}%
                            </p>
                            <p className="text-sm text-gray-600">Course Progress</p>
                        </div>
                    </div>
                </div>

                {/* Semester-wise Results */}
                <div className="space-y-4">
                    {completedSemesters.map(([semester, data]) => (
                        <div key={semester} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Semester {semester}</h4>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">SGPA: <strong>{data.sgpa}</strong></span>
                                    <span className="text-sm text-gray-600">Credits: <strong>{data.totalCredits}</strong></span>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {data.subjects.map((subject) => (
                                    <div key={subject.code} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{subject.name}</p>
                                            <p className="text-sm text-gray-600">{subject.code}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-700">{subject.marks}/100</span>
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.grade)}`}>
                                                {subject.grade}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Dashboard</h1>
                            <p className="text-gray-600">
                                {studentAcademicData.studentName} • {studentAcademicData.rollNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                                {studentAcademicData.degree} - {studentAcademicData.branch} ({studentAcademicData.specialization})
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center text-2xl font-bold text-blue-600 mb-1">
                                <Trophy className="w-6 h-6 mr-2" />
                                {studentAcademicData.cgpa}
                            </div>
                            <p className="text-sm text-gray-600">Current CGPA</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'current'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Current Semester
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'all'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Book className="w-4 h-4 mr-2" />
                            All Semesters
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'results'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Results & Performance
                        </button>
                    </div>
                </div>

                {/* Content based on active tab */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {activeTab === 'current' && renderCurrentSemester()}
                    {activeTab === 'all' && renderAllSemesters()}
                    {activeTab === 'results' && renderResults()}
                </div>
            </div>
        </div>
    );
};

export default AcademicDashboard;