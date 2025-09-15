import React, { useState, useEffect, useMemo } from 'react';
import {
    User, Mail, Phone, MapPin, Calendar, GraduationCap,
    BookOpen, FileText, Eye, Award, Clock,
    Users, Building, MessageSquare, AlertTriangle, CheckCircle
} from 'lucide-react';

import { useUser } from '../../context/UserContext';
import roleUtils from '../../utils/roleUtils';
import { checkStaffOrStudent } from '../../utils/checkStaffOrStudentUtils';
import { ordinalIndicators } from '../../utils/ordinalIndicators';
import Loading from '../Loading';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State for complaints and feedback
    const [complaints, setComplaints] = useState([]);
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel for a faster load time
                const [profileRes, complaintsRes, feedbackRes] = await Promise.all([
                    fetch("https://sih-4ptm.onrender.com/api/v1/my-profile", { credentials: "include" }),
                    fetch("https://sih-4ptm.onrender.com/api/v1/complaints/my-complaints", { credentials: "include" }),
                    fetch("https://sih-4ptm.onrender.com/api/v1/feedback/my-feedback", { credentials: "include" })
                ]);
                
                // Process Profile Data
                const profileData = await profileRes.json();
                if (profileData.user) {
                    setUser(profileData.user);
                    setCourses(profileData.course);
                }

                // Process Complaints Data
                if (complaintsRes.ok) {
                    const complaintsData = await complaintsRes.json();
                    setComplaints(complaintsData.complaints || []);
                }
                
                // Process Feedback Data
                if (feedbackRes.ok) {
                    const feedbackData = await feedbackRes.json();
                    setFeedback(feedbackData.feedback || []);
                }
                
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const [activeTab, setActiveTab] = useState('overview');

    // Hardcoded academic data as requested
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

    // Combine and sort the 3 most recent activities
    const recentActivity = useMemo(() => {
        const combined = [
            ...complaints.map(c => ({ ...c, type: 'complaint' })),
            ...feedback.map(f => ({ ...f, type: 'feedback' }))
        ];
        return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
    }, [complaints, feedback]);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen">
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
                                {checkStaffOrStudent(user?.role) === 'student' && (courses && (<p className="text-gray-600">{courses.degree} in {courses.branch}</p>))}
                                {user?.registrationNumber && <p className="text-sm text-blue-600 font-medium">{user?.registrationNumber}</p>}
                            </div>
                        </div>
                        {checkStaffOrStudent(user?.role) === 'student' &&
                            <div className="text-right">
                                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Active Student</span>
                                </div>
                                <p className="text-sm text-gray-600">Semester: {user?.semester}{ordinalIndicators(user?.semester)}</p>
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
                                { id: 'personal', label: 'Personal Info', icon: FileText }
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
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-gray-200"><div className="flex items-center space-x-2"><Award className="h-5 w-5 text-green-600" /><span className="text-sm text-gray-600">CGPA</span></div><p className="text-2xl font-bold text-gray-900">{academicData.overallCGPA}</p></div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200"><div className="flex items-center space-x-2"><BookOpen className="h-5 w-5 text-blue-600" /><span className="text-sm text-gray-600">Semester</span></div><p className="text-2xl font-bold text-gray-900">{user?.semester}{ordinalIndicators(user?.semester)}</p></div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200"><div className="flex items-center space-x-2"><Clock className="h-5 w-5 text-orange-600" /><span className="text-sm text-gray-600">Attendance</span></div><p className="text-2xl font-bold text-gray-900">{academicData.attendance}%</p></div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200"><div className="flex items-center space-x-2"><Users className="h-5 w-5 text-purple-600" /><span className="text-sm text-gray-600">Credits</span></div><p className="text-2xl font-bold text-gray-900">{academicData.completedCredits}/{academicData.totalCredits}</p></div>
                            </div>

                            {courses &&
                                <div className="bg-white rounded-lg border border-gray-200 max-h-[450px]">
                                    <div className="p-6 border-b border-gray-200 h-[70px]"><h3 className="text-lg font-semibold text-gray-900">Current Subjects</h3></div>
                                    <div className="p-6 overflow-y-auto max-h-[380px]">
                                        <div className="space-y-4">
                                            {courses?.semesters[user?.semester - 1]?.subjects?.map((data, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div><h4 className="font-medium text-gray-900">{data.name}</h4><p className="text-sm text-gray-600">{data.code} • {data.credits} Credits</p></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">Profile Summary</h3></div>
                                <div className="p-6 space-y-4">
                                    {user?.email && <div className="flex items-center space-x-3"><Mail className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{user.email}</span></div>}
                                    {user?.phone && <div className="flex items-center space-x-3"><Phone className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{user.phone}</span></div>}
                                    {user?.address && <div className="flex items-center space-x-3"><MapPin className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{user.address}</span></div>}
                                    {user?.dob && <div className="flex items-center space-x-3"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{formatDate(user.dob)}</span></div>}
                                    {user?.collegeCode && <div className="flex items-center space-x-3"><Building className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{user.collegeCode}</span></div>}
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-6 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3></div>
                                <div className="p-6 space-y-4">
                                    {recentActivity.length > 0 ? (
                                        recentActivity.map(item => (
                                            <div key={item._id} className="flex items-start space-x-3">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'complaint' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                                    {item.type === 'complaint' ? <AlertTriangle className="h-4 w-4 text-blue-600" /> : <MessageSquare className="h-4 w-4 text-green-600" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-800">{item.title || item.subject}</p>
                                                    <p className="text-xs text-gray-500">{item.type === 'complaint' ? `Complaint: ${item.status}` : 'Feedback Submitted'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-center text-gray-500 py-4">No recent complaints or feedback.</p>
                                    )}
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
                                <div><label className="text-sm font-medium text-gray-700">Registration Number</label><p className="mt-1 text-gray-900">{user?.registrationNumber || 'N/A'}</p></div>
                                <div><label className="text-sm font-medium text-gray-700">Roll Number</label><p className="mt-1 text-gray-900">{user?.rollNumber || 'N/A'}</p></div>
                                <div><label className="text-sm font-medium text-gray-700">College Code</label><p className="mt-1 text-gray-900">{user?.collegeCode || 'N/A'}</p></div>
                                <div><label className="text-sm font-medium text-gray-700">Degree</label><p className="mt-1 text-gray-900">{courses?.degree || 'N/A'}</p></div>
                            </div>
                            <div className="space-y-4">
                                <div><label className="text-sm font-medium text-gray-700">Branch</label><p className="mt-1 text-gray-900">{courses?.branch || 'N/A'}</p></div>
                                <div><label className="text-sm font-medium text-gray-700">Specialization</label><p className="mt-1 text-gray-900">{courses?.specialization || 'None'}</p></div>
                                <div><label className="text-sm font-medium text-gray-700">Year of Admission</label><p className="mt-1 text-gray-900">{user?.yearOfAdmission || 'N/A'}</p></div>
                                <div><label className="text-sm font-medium text-gray-700">Expected Year of Passing</label><p className="mt-1 text-gray-900">{user?.yearOfPassing || 'N/A'}</p></div>
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
                                    <div><label className="text-sm font-medium text-gray-700">Full Name</label><p className="mt-1 text-gray-900">{user?.name || 'N/A'}</p></div>
                                    <div><label className="text-sm font-medium text-gray-700">Father's Name</label><p className="mt-1 text-gray-900">{user?.fatherName || 'N/A'}</p></div>
                                    <div><label className="text-sm font-medium text-gray-700">Mother's Name</label><p className="mt-1 text-gray-900">{user?.motherName || 'N/A'}</p></div>
                                    <div><label className="text-sm font-medium text-gray-700">Date of Birth</label><p className="mt-1 text-gray-900">{formatDate(user?.dob)}</p></div>
                                    <div><label className="text-sm font-medium text-gray-700">Gender</label><p className="mt-1 text-gray-900 capitalize">{user?.gender || 'N/A'}</p></div>
                                </div>
                                <div className="space-y-4">
                                    <div><label className="text-sm font-medium text-gray-700">Aadhar Number</label><p className="mt-1 text-gray-900">{user?.aadharNumber || 'N/A'}</p></div>
                                    <div><label className="text-sm font-medium text-gray-700">Religion</label><p className="mt-1 text-gray-900">{user?.religion || 'N/A'}</p></div>
                                    <div><label className="text-sm font-medium text-gray-700">Category</label><p className="mt-1 text-gray-900">{user?.category || 'N/A'}</p></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div><label className="text-sm font-medium text-gray-700">Email</label><p className="mt-1 text-gray-900">{user?.email || 'N/A'}</p></div>
                                    <div><label className="text-sm font-medium text-gray-700">Phone</label><p className="mt-1 text-gray-900">{user?.phone || 'N/A'}</p></div>
                                </div>
                                <div className="space-y-4">
                                    <div><label className="text-sm font-medium text-gray-700">Address</label><p className="mt-1 text-gray-900">{user?.address || 'N/A'}</p></div>
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