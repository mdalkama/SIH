import React, { useState } from 'react';
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

import roleUtils from '../../../utils/roleUtils'
import { checkStaffOrStudent } from '../../../utils/checkStaffOrStudentUtils';

const StudentDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('overview');
    console.log(user)
    // Dummy student data based on schema
    const studentData = {
        // Personal Details
        name: "Rajesh Kumar Sharma",
        fatherName: "Suresh Kumar Sharma",
        motherName: "Sunita Sharma",
        guardianName: "",
        parentsNumber: "+91-9876543210",
        dob: new Date("2002-05-15"),
        gender: "male",
        aadharNumber: "1234-5678-9012",
        abcNumber: "ABC123456789",
        caste: "General",
        religion: "Hindu",
        category: "General",

        // Contact Details
        email: "rajesh.sharma@student.edu.in",
        phone: "+91-8765432109",
        alternatePhone: "+91-7654321098",
        address: {
            street: "123, MG Road",
            city: "Jaipur",
            state: "Rajasthan",
            zipCode: "302001",
            country: "India"
        },

        // Academic Details
        registrationNumber: "REG2022001234",
        rollNumber: "22CSE001",
        collegeCode: "RJCET001",
        degree: "Bachelor of Technology",
        branch: "Computer Science Engineering",
        specialization: "Artificial Intelligence",
        semester: 5,
        yearOfAdmission: 2022,
        yearOfPassing: 2026,

        // Documents
        resumeLink: "https://example.com/resume.pdf",
        profilePictureLink: "https://example.com/profile.jpg",

        // Status
        status: "active",
        role: "student"
    };

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

    const getGradeColor = (grade) => {
        const colors = {
            'A': 'text-green-600 bg-green-50',
            'A-': 'text-green-600 bg-green-50',
            'B+': 'text-blue-600 bg-blue-50',
            'B': 'text-blue-600 bg-blue-50',
            'C': 'text-yellow-600 bg-yellow-50'
        };
        return colors[grade] || 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {studentData.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                { user?.branch && <p className="text-gray-600">{user?.branch}</p> }
                                { checkStaffOrStudent(user?.role) === 'staff' && ( user?.role && <p className="text-gray-600">{roleUtils(user?.role)}</p> ) }
                                {checkStaffOrStudent(user?.role) === 'student' && (user?.branch && <p className="text-gray-600">{roleUtils(user?.branch)}</p>)}

                                { user?.staffId && <p className="text-sm text-blue-600 font-medium">{user?.staffId}</p> }
                                { user?.registrationNumber && <p className="text-sm text-blue-600 font-medium">{user?.registrationNumber}</p> }
                            </div>
                        </div>
                        {
                            checkStaffOrStudent(user?.role) === 'student' && 
                            <div className="text-right">
                                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Active Student</span>
                                </div>
                                <p className="text-sm text-gray-600">Semester {studentData.semester}</p>
                                <p className="text-sm text-gray-600">CGPA: {academicData.overallCGPA}</p>
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
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <Award className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-gray-600">CGPA</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{academicData.overallCGPA}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">Semester</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{studentData.semester}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                        <span className="text-sm text-gray-600">Attendance</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{academicData.attendance}%</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-5 w-5 text-purple-600" />
                                        <span className="text-sm text-gray-600">Credits</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{academicData.completedCredits}/{academicData.totalCredits}</p>
                                </div>
                            </div>

                            {/* Current Subjects */}
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Current Subjects</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {academicData.currentSubjects.map((subject, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{subject.name}</h4>
                                                    <p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.grade)}`}>
                                                    {subject.grade}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Summary */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Profile Summary</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{studentData.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{studentData.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{studentData.address.city}, {studentData.address.state}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{formatDate(studentData.dob)}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Building className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{studentData.collegeCode}</span>
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
                                    <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                        <Edit3 className="h-4 w-4 text-orange-600" />
                                        <span className="text-sm text-gray-700">Update Profile</span>
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
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Registration Number</label>
                                    <p className="mt-1 text-gray-900">{studentData.registrationNumber}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Roll Number</label>
                                    <p className="mt-1 text-gray-900">{studentData.rollNumber}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">College Code</label>
                                    <p className="mt-1 text-gray-900">{studentData.collegeCode}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Degree</label>
                                    <p className="mt-1 text-gray-900">{studentData.degree}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Branch</label>
                                    <p className="mt-1 text-gray-900">{studentData.branch}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Specialization</label>
                                    <p className="mt-1 text-gray-900">{studentData.specialization}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Year of Admission</label>
                                    <p className="mt-1 text-gray-900">{studentData.yearOfAdmission}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Expected Year of Passing</label>
                                    <p className="mt-1 text-gray-900">{studentData.yearOfPassing}</p>
                                </div>
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
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <p className="mt-1 text-gray-900">{studentData.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Father's Name</label>
                                        <p className="mt-1 text-gray-900">{studentData.fatherName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Mother's Name</label>
                                        <p className="mt-1 text-gray-900">{studentData.motherName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                                        <p className="mt-1 text-gray-900">{formatDate(studentData.dob)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Gender</label>
                                        <p className="mt-1 text-gray-900 capitalize">{studentData.gender}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Aadhar Number</label>
                                        <p className="mt-1 text-gray-900">{studentData.aadharNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">ABC Number</label>
                                        <p className="mt-1 text-gray-900">{studentData.abcNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Caste</label>
                                        <p className="mt-1 text-gray-900">{studentData.caste}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Religion</label>
                                        <p className="mt-1 text-gray-900">{studentData.religion}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <p className="mt-1 text-gray-900">{studentData.category}</p>
                                    </div>
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
                                        <p className="mt-1 text-gray-900">{studentData.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Phone</label>
                                        <p className="mt-1 text-gray-900">{studentData.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Alternate Phone</label>
                                        <p className="mt-1 text-gray-900">{studentData.alternatePhone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Parents Number</label>
                                        <p className="mt-1 text-gray-900">{studentData.parentsNumber}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Address</label>
                                        <p className="mt-1 text-gray-900">
                                            {studentData.address.street}<br />
                                            {studentData.address.city}, {studentData.address.state}<br />
                                            {studentData.address.zipCode}, {studentData.address.country}
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