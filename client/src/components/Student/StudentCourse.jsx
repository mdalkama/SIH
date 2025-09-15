import React, { useState, useEffect, useCallback } from 'react';
import { Book, Download, GraduationCap, Calendar, Trophy, ChevronDown, ChevronUp, Clock, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

// --- HELPER COMPONENTS ---
const getGradeColor = (grade) => {
    const gradeColors = { 'A+': 'text-green-700 bg-green-100', 'A': 'text-green-600 bg-green-50', 'A-': 'text-blue-600 bg-blue-50', 'B+': 'text-yellow-600 bg-yellow-50', 'B': 'text-orange-600 bg-orange-50', 'B-': 'text-red-600 bg-red-50' };
    return gradeColors[grade] || 'text-gray-600 bg-gray-50';
};
const getStatusIcon = (status) => {
    switch (status) {
        case 'Completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'Current': return <Clock className="w-4 h-4 text-blue-500" />;
        default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
};
const downloadSyllabus = (subjectCode, subjectName) => {
    alert(`Downloading syllabus for ${subjectName} (${subjectCode})`);
};

// --- NEW SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
    <div className="min-h-screen animate-pulse">
        <div className="max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-64 bg-gray-200 rounded mb-3"></div>
                        <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-56 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-right">
                        <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="flex border-b border-gray-200">
                    <div className="h-12 w-48 bg-gray-200 border-b-2 border-blue-600"></div>
                    <div className="h-12 w-48 bg-gray-100 ml-4"></div>
                    <div className="h-12 w-56 bg-gray-100 ml-4"></div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-24 bg-gray-100 rounded-lg"></div>
                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                    <div className="h-16 bg-gray-100 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


// --- MAIN ACADEMIC DASHBOARD COMPONENT ---
const AcademicDashboard = () => {
    const [activeTab, setActiveTab] = useState('current');
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSemesters, setExpandedSemesters] = useState([]);

    const fetchAcademicData = useCallback(async () => {
        setLoading(true);
        try {
            const profileRes = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', { credentials: 'include' });
            if (!profileRes.ok) throw new Error("Could not fetch your profile. Please log in again.");
            
            const profileData = await profileRes.json();
            
            if (!profileData.user || !profileData.course) {
                throw new Error("Complete academic information (user and course) not found in your profile.");
            }
            
            const combinedProfile = {
                ...profileData.user,
                course: profileData.course
            };

            setStudentProfile(combinedProfile);
            setExpandedSemesters([combinedProfile.semester]); // Use semester from user object
            setError(null);

        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAcademicData();
    }, [fetchAcademicData]);

    const toggleSemesterExpansion = (semesterNumber) => {
        setExpandedSemesters(prev =>
            prev.includes(semesterNumber)
                ? prev.filter(s => s !== semesterNumber)
                : [...prev, semesterNumber]
        );
    };

    if (loading) return <DashboardSkeleton />;
    
    if (error) return <div className="max-w-6xl mx-auto p-4"><div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertTriangle className="mx-auto w-12 h-12 text-red-500" /><h3 className="mt-4 text-lg font-semibold text-red-800">An Error Occurred</h3><p className="text-red-600 mt-1">{error}</p></div></div>;

    const renderCurrentSemester = () => {
        const currentSemData = studentProfile?.course?.semesters.find(s => s.semesterNumber === studentProfile.semester);
        if (!currentSemData) return <div className="text-center text-gray-500 py-8">Current semester data is not available for your course.</div>;

        const totalCredits = currentSemData.subjects.reduce((acc, s) => acc + (s.credits || 0), 0);
        const avgAttendance = 91; // Mock data

        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Semester {studentProfile.semester} - Current</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center"><p className="text-2xl font-bold text-blue-600">{currentSemData.subjects.length}</p><p className="text-sm text-gray-600">Subjects</p></div>
                        <div className="text-center"><p className="text-2xl font-bold text-green-600">{totalCredits}</p><p className="text-sm text-gray-600">Total Credits</p></div>
                        <div className="text-center"><p className="text-2xl font-bold text-purple-600">{avgAttendance}%</p><p className="text-sm text-gray-600">Avg Attendance</p></div>
                    </div>
                </div>
                <div className="grid gap-4">
                    {currentSemData.subjects.map((subject) => (
                        <div key={subject._id || subject.code} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                                    <p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits • {subject.type}</p>
                                </div>
                                <button onClick={() => downloadSyllabus(subject.code, subject.name)} className="flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Download className="w-3 h-3 mr-1" />Syllabus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAllSemesters = () => {
        const course = studentProfile?.course;
        if (!course || !course.semesters) return null;

        return (
            <div className="space-y-4">
                {course.semesters.map((semData) => {
                    const semesterNumber = semData.semesterNumber;
                    const isExpanded = expandedSemesters.includes(semesterNumber);
                    const isCurrent = semesterNumber === studentProfile.semester;
                    const isCompleted = semesterNumber < studentProfile.semester;
                    const status = isCurrent ? 'Current' : isCompleted ? 'Completed' : 'Upcoming';
                    const totalCredits = semData.subjects.reduce((acc, s) => acc + (s.credits || 0), 0);

                    return (
                        <div key={semesterNumber} className={`border rounded-lg ${isCurrent ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                            <div className="p-4 cursor-pointer" onClick={() => toggleSemesterExpansion(semesterNumber)}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">{getStatusIcon(status)}<div><h3 className="font-semibold text-gray-900">Semester {semesterNumber}{isCurrent && <span className="text-blue-600 ml-2">(Current)</span>}</h3><p className="text-sm text-gray-600">{semData.subjects.length} subjects • {totalCredits} credits</p></div></div>
                                    <div className="flex items-center space-x-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Completed' ? 'bg-green-100 text-green-800' : status === 'Current' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{status}</span>{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="px-4 pb-4 border-t border-gray-200">
                                    <div className="mt-4 space-y-3">
                                        {semData.subjects.map((subject) => (
                                            <div key={subject._id || subject.code} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                                <div className="flex-1"><h4 className="font-medium text-gray-900">{subject.name}</h4><p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits • {subject.type}</p></div>
                                                <button onClick={() => downloadSyllabus(subject.code, subject.name)} className="flex items-center px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"><Download className="w-3 h-3 mr-1" />Syllabus</button>
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
        return (
            <div className="text-center text-gray-500 py-12">
                <GraduationCap className="mx-auto w-16 h-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-semibold">Results & Performance</h3>
                <p>This section will show SGPA/CGPA and subject grades once result data is available.</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {studentProfile && studentProfile.course && (
                    <>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Dashboard</h1>
                                    <p className="text-gray-600 font-semibold">{studentProfile.name} • {studentProfile.registrationNumber}</p>
                                    <p className="text-sm text-gray-500">{studentProfile.course.degree} - {studentProfile.course.branch} {studentProfile.course.specialization && `(${studentProfile.course.specialization})`}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center text-2xl font-bold text-blue-600 mb-1"><Trophy className="w-6 h-6 mr-2" />{studentProfile.cgpa || 'N/A'}</div>
                                    <p className="text-sm text-gray-600">Current CGPA</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm mb-6">
                            <div className="flex border-b border-gray-200">
                                <button onClick={() => setActiveTab('current')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><Clock className="w-4 h-4 mr-2" />Current Semester</button>
                                <button onClick={() => setActiveTab('all')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><Book className="w-4 h-4 mr-2" />All Semesters</button>
                                <button onClick={() => setActiveTab('results')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><GraduationCap className="w-4 h-4 mr-2" />Results & Performance</button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            {activeTab === 'current' && renderCurrentSemester()}
                            {activeTab === 'all' && renderAllSemesters()}
                            {activeTab === 'results' && renderResults()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AcademicDashboard;