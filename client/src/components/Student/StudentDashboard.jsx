import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    BookOpen,
    FileText,
    Edit3,
    Download,
    Eye,
    Award,
    Clock,
    Users,
    Building
} from 'lucide-react';

import roleUtils from '../../utils/roleUtils'
import { checkStaffOrStudent } from '../../utils/checkStaffOrStudentUtils';
import { ordinalIndicators } from '../../utils/ordinalIndicators';
import Loading from '../Loading'

const StudentDashboard = () => {

    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    "https://sih-4ptm.onrender.com/api/v1/my-profile",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (data) {
                    setUser(data.user);
                    setCourses(data.course);
                    console.log(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching logged-in user:", err);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const [activeTab, setActiveTab] = useState('overview');
    console.log(user?.course)

    // Academic Performance Data
    const academicData = {
        currentSGPA: 8.45,
        overallCGPA: 8.12,
        completedCredits: 95,
        totalCredits: 160,
        currentSubjects: [
            { code: "CS501", name: "Machine Learning", credits: 4, grade: "A" },
            { code: "CS502", name: "Database Management", credits: 3, grade: "A-" },
            { code: "CS503", name: "Software Engineering", credits: 4, grade: "B+" },
            { code: "CS504", name: "Computer Networks", credits: 3, grade: "A" },
            { code: "CS505", name: "Web Development", credits: 3, grade: "A-" }
        ],
        attendance: 87.5
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if(loading) return <Loading />

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {user?.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                {checkStaffOrStudent(user?.role) === 'staff' && (user?.role && <p className="text-gray-600">{roleUtils(user?.role)}</p>)}
                                {checkStaffOrStudent(user?.role) === 'student' && (user?.course && (<p className="text-gray-600">{user?.course?.degree + " in " + user?.course?.branch}</p>))}
                                {user?.staffId && <p className="text-sm text-blue-600 font-medium">{user?.staffId}</p>}
                                {user?.registrationNumber && <p className="text-sm text-blue-600 font-medium">{user?.registrationNumber}</p>}
                            </div>
                        </div>
                        {
                            checkStaffOrStudent(user?.role) === 'student' &&
                            <div className="text-right">
                                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Active Student</span>
                                </div>
                                <p className="text-sm text-gray-600">Semester: {user?.semester + ordinalIndicators(user?.semester)}</p>
                                <p className="text-sm text-gray-600">CGPA: {academicData.overallCGPA}</p>
                            </div>
                        }
                        {
                            checkStaffOrStudent(user?.role) === 'staff' &&
                            <div className="text-right">
                                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Active Employee</span>
                                </div>
                                <p className="text-sm text-gray-600">{user.employmentType}</p>
                            </div>
                        }

                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: User },
                                { id: 'academic', label: 'Academic', icon: GraduationCap },
                                { id: 'personal', label: 'Personal Info', icon: FileText },
                                { id: 'documents', label: 'Documents', icon: Download }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                            ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                                {/* Current CGPA */}
                                {
                                    checkStaffOrStudent(user?.role) === 'student' &&
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Award className="h-5 w-5 text-green-600" />
                                            <span className="text-sm text-gray-600">CGPA</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{academicData.overallCGPA}</p>
                                    </div>
                                }


                                {/* Current Semester */}
                                {
                                    checkStaffOrStudent(user?.role) === 'student' &&
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm text-gray-600">Semester</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{user?.semester + ordinalIndicators(user?.semester)}</p>
                                    </div>
                                }


                                {/* Attendance */}
                                {
                                    checkStaffOrStudent(user?.role) === 'student' &&
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                            <span className="text-sm text-gray-600">Attendance</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{academicData.attendance}%</p>
                                    </div>
                                }


                                {/* Credits */}
                                {
                                    checkStaffOrStudent(user?.role) === 'student' &&
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-5 w-5 text-purple-600" />
                                            <span className="text-sm text-gray-600">Credits</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{academicData.completedCredits}/{academicData.totalCredits}</p>
                                    </div>
                                }



                            </div>

                            {/* Current Subjects */}
                            {courses &&
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Current Subjects</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {console.log(courses)}
                                            {courses?.semesters[user?.semester - 1]?.subjects?.map((data, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{data.name}</h4>
                                                        <p className="text-sm text-gray-600">{data.code} • {data.credits} Credits</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        {/* Profile Summary */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Profile Summary</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* email  */}
                                    {
                                        user?.email &&
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{user?.email}</span>
                                        </div>
                                    }
                                    {/* phone */}
                                    {
                                        user?.phone &&
                                        <div className="flex items-center space-x-3">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{user?.phone}</span>
                                        </div>
                                    }

                                    {
                                        user?.address &&
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{user.address}</span>
                                        </div>
                                    }

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{formatDate(user?.dob)}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Building className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{user?.collegeCode}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                        <Download className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm text-gray-700">Download Transcript</span>
                                    </button>
                                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                        <Eye className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-gray-700">View Timetable</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'academic' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {
                                    user?.registrationNumber &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Registration Number</label>
                                        <p className="mt-1 text-gray-900">{user?.registrationNumber}</p>
                                    </div>
                                }
                                {
                                    user?.rollNumber &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Roll Number</label>
                                        <p className="mt-1 text-gray-900">{user?.rollNumber}</p>
                                    </div>
                                }
                                {
                                    user?.collegeCode &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">College Code</label>
                                        <p className="mt-1 text-gray-900">{user?.collegeCode}</p>
                                    </div>
                                }
                                {
                                    user?.course?.degree &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Degree</label>
                                        <p className="mt-1 text-gray-900">{user?.course?.degree}</p>
                                    </div>
                                }
                            </div>

                            <div className="space-y-4">
                                {
                                    user?.course?.branch &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Branch</label>
                                        <p className="mt-1 text-gray-900">{user?.course?.branch}</p>
                                    </div>
                                }
                                {
                                    user?.course?.specialization &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Specialization</label>
                                        <p className="mt-1 text-gray-900">{user?.course?.specialization}</p>
                                    </div>
                                }
                                {
                                    user?.yearOfAdmission &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Year of Admission</label>
                                        <p className="mt-1 text-gray-900">{user?.yearOfAdmission}</p>
                                    </div>
                                }
                                {
                                    user?.yearOfPassing &&
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Expected Year of Passing</label>
                                        <p className="mt-1 text-gray-900">{user?.yearOfPassing}</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'personal' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    {
                                        user?.name &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                                            <p className="mt-1 text-gray-900">{user?.name}</p>
                                        </div>
                                    }
                                    {
                                        user?.fatherName &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Father's Name</label>
                                            <p className="mt-1 text-gray-900">{user?.fatherName}</p>
                                        </div>
                                    }
                                    {
                                        user?.motherName &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Mother's Name</label>
                                            <p className="mt-1 text-gray-900">{user?.motherName}</p>
                                        </div>
                                    }
                                    {
                                        user?.dob &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                                            <p className="mt-1 text-gray-900">{formatDate(user?.dob)}</p>
                                        </div>
                                    }
                                    {
                                        user?.gender &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Gender</label>
                                            <p className="mt-1 text-gray-900 capitalize">{user?.gender}</p>
                                        </div>
                                    }
                                </div>
                                <div className="space-y-4">
                                    {
                                        user?.aadharNumber &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Aadhar Number</label>
                                            <p className="mt-1 text-gray-900">{user?.aadharNumber}</p>
                                        </div>
                                    }
                                    {
                                        user?.abcNumber &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">ABC Number</label>
                                            <p className="mt-1 text-gray-900">{user?.abcNumber}</p>
                                        </div>
                                    }
                                    {
                                        user?.caste &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Cast</label>
                                            <p className="mt-1 text-gray-900">{user?.cast}</p>
                                        </div>
                                    }
                                    {
                                        user?.religion &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Religion</label>
                                            <p className="mt-1 text-gray-900">{user?.religion}</p>
                                        </div>
                                    }
                                    {
                                        user?.category &&
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Category</label>
                                            <p className="mt-1 text-gray-900">{user?.category}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Phone</label>
                                        <p className="mt-1 text-gray-900">{user?.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Address</label>
                                        <p className="mt-1 text-gray-900">
                                            {user?.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Documents</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Resume</p>
                                        <p className="text-sm text-gray-600">PDF Document</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                                        View
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100">
                                        Download
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <User className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Profile Picture</p>
                                        <p className="text-sm text-gray-600">Image File</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                                        View
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100">
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;