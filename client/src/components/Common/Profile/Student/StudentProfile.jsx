import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, GraduationCap,
  Edit3, Save, Book, AlertCircle, Award, UserCheck, Clock,
  CheckCircle, X, Loader2, FileText, Building,
  Users
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const ToastNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => { onClose(); }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
    const textColor = isError ? 'text-red-800' : 'text-green-800';
    const Icon = isError ? AlertCircle : CheckCircle;
    return (
        <div className={`fixed top-5 right-5 z-[100] flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg ${bgColor} ${textColor}`} role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"><Icon className="w-5 h-5" /></div>
            <div className="ml-3 text-sm font-medium">{message}</div>
            <button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-white/20" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
    );
};

const InfoField = ({ label, value, icon: Icon, isEditing, onChange, type = 'text', className = '' }) => (
    <div>
        <label className="flex items-center text-sm font-semibold text-slate-600 mb-2">
            <Icon className="w-4 h-4 mr-2 text-slate-400" />
            {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition"
            />
        ) : (
            <p className={`p-3 bg-slate-100 rounded-lg text-slate-800 capitalize ${className}`}>
                {type === 'date' && value ? new Date(value).toLocaleDateString('en-GB') : value || 'N/A'}
            </p>
        )}
    </div>
);

const ProfileSkeleton = () => (
    <div className="min-h-screen animate-pulse">
        <div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-24 h-24 rounded-full bg-slate-200"></div>
                        <div>
                            <div className="h-8 w-48 bg-slate-200 rounded-md mb-2"></div>
                            <div className="h-5 w-32 bg-slate-200 rounded-md mb-2"></div>
                            <div className="h-4 w-40 bg-slate-200 rounded-md"></div>
                        </div>
                    </div>
                    <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6">
                <div className="flex space-x-2">
                    <div className="h-9 w-32 bg-slate-200 rounded-lg"></div>
                    <div className="h-9 w-32 bg-slate-100 rounded-lg"></div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="h-6 w-40 bg-slate-200 rounded-md mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                    <div className="h-16 bg-slate-100 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const StudentProfile = () => {
    const [activeTab, setActiveTab] = useState('basic-info');
    const [studentData, setStudentData] = useState(null);
    const [academicInfo, setAcademicInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [profileRes, academicsRes] = await Promise.all([
                    fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', { credentials: 'include' }),
                    fetch('https://sih-4ptm.onrender.com/api/v1/student/my-academics', { credentials: 'include' })
                ]);
                
                if (!profileRes.ok) {
                    const errorData = await profileRes.json();
                    throw new Error(errorData.message || "Failed to fetch student profile.");
                }
                const profileResult = await profileRes.json();
                if (profileResult.user) {
                    setStudentData(profileResult.user);
                    setEditedData(profileResult.user);
                } else {
                    throw new Error("No student data found in the API response.");
                }

                if (academicsRes.ok) {
                    const academicsResult = await academicsRes.json();
                    setAcademicInfo(academicsResult.academics);
                }

            } catch (error) {
                setStudentData(null);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedData(JSON.parse(JSON.stringify(studentData)));
    };

    const handleSave = async () => {
        setIsEditing(false);
        setLoading(true);
        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editedData)
            });
            
            const result = await response.json();
            if (result.success) {
                setStudentData(result.user);
                showToast('Profile updated successfully!');
            } else {
                setEditedData(studentData); 
                showToast(`Failed to update profile: ${result.message}`, 'error');
            }
        } catch (error) {
            setEditedData(studentData);
            showToast('An error occurred while saving.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (error || !studentData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h2 className="mt-4 text-xl font-semibold text-red-700">Failed to Load Profile</h2>
                <p className="mt-2 text-slate-600">{error || "Could not fetch student data."}</p>
            </div>
        );
    }

    const tabs = [
        { id: 'basic-info', label: 'Basic Info', icon: User },
        { id: 'academic', label: 'Academic', icon: GraduationCap },
    ];

    const renderBasicInfo = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Personal & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoField label="Phone" value={isEditing ? editedData.phone : studentData.phone} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange('phone', e.target.value)} />
                    <InfoField label="Alternate Phone" value={isEditing ? editedData.alternatePhone : studentData.alternatePhone} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange('alternatePhone', e.target.value)} />
                    <InfoField label="Email" value={studentData.email} icon={Mail} isEditing={false} />
                    <InfoField label="Date of Birth" value={studentData.dob} icon={Calendar} isEditing={false} type="date"/>
                    <InfoField label="Gender" value={studentData.gender} icon={Users} isEditing={false} />
                    <InfoField label="Blood Group" value={studentData.bloodGroup} icon={AlertCircle} isEditing={false} />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Family Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Father's Name" value={studentData.fatherName} icon={User} isEditing={false} />
                    <InfoField label="Mother's Name" value={studentData.motherName} icon={User} isEditing={false} />
                    <InfoField label="Parent's Contact" value={isEditing ? editedData.parentsNumber : studentData.parentsNumber} icon={Phone} isEditing={isEditing} onChange={(e) => handleInputChange('parentsNumber', e.target.value)} />
                    <InfoField label="Guardian Name" value={isEditing ? editedData.guardianName : studentData.guardianName} icon={User} isEditing={isEditing} onChange={(e) => handleInputChange('guardianName', e.target.value)} />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Address Information</h3>
                <InfoField label="Address" value={isEditing ? editedData.address : studentData.address} icon={MapPin} isEditing={isEditing} onChange={(e) => handleInputChange('address', e.target.value)} />
            </div>
        </div>
    );

    const renderAcademic = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Course & Batch Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoField label="Course ID" value={studentData.courseId} icon={Book} />
                    <InfoField label="Batch" value={studentData.batch} icon={Users} />
                    <InfoField label="Current Semester" value={studentData.semester} icon={Clock} />
                    <InfoField label="College Code" value={studentData.collegeCode} icon={Building} />
                    <InfoField label="Registration Number" value={studentData.registrationNumber} icon={FileText} className="normal-case"/>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 p-6">Semester-wise Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-600">Semester</th>
                                <th className="px-6 py-3 font-semibold text-slate-600">Exam Name</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 text-center">SGPA</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 text-center">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {academicInfo?.previousResults && academicInfo.previousResults.length > 0 ? (
                                academicInfo.previousResults.map((result) => (
                                    <tr key={result.examId}>
                                        <td className="px-6 py-4 font-bold text-slate-800">{result.semester}</td>
                                        <td className="px-6 py-4 text-slate-700">{result.examName}</td>
                                        <td className="px-6 py-4 text-center font-bold text-blue-600">{result.sgpa.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${result.overallResult === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {result.overallResult}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center py-10 text-slate-500">No past results found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic-info': return renderBasicInfo();
            case 'academic': return renderAcademic();
            default: return null;
        }
    };

    return (
        <div className="min-h-screen">
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <img src={studentData.profilePictureLink || `https://ui-avatars.com/api/?name=${studentData.name}&background=random`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">{studentData.name}</h1>
                                <p className="text-slate-600">{studentData.courseId || 'Course Not Assigned'}</p>
                                <p className="text-sm text-blue-600 font-mono mt-1">{studentData.registrationNumber}</p>
                            </div>
                        </div>
                        {!isEditing ? (<button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Edit3 size={16} /> Edit Profile</button>) : (<div className="flex gap-2"><button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button><button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save size={16} /> Save Changes</button></div>)}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6">
                    <nav className="flex space-x-2">
                        {tabs.map((tab) => { const Icon = tab.icon; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}><Icon size={18} /> {tab.label}</button>); })}
                    </nav>
                </div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default StudentProfile;