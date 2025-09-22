import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, User, FileText, X, Mail, Phone, Calendar, GraduationCap } from 'lucide-react';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-10 bg-slate-200 rounded-lg"></div>
                <div className="h-10 bg-slate-200 rounded-lg"></div>
                <div className="h-10 bg-slate-200 rounded-lg"></div>
                <div className="h-10 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 space-y-3">
                {[...Array(10)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg"></div>)}
            </div>
        </div>
    </div>
);

const ApplicationDetailsModal = ({ isOpen, onClose, application }) => {
    if (!isOpen) return null;

    // Helper to render a detail item
    const DetailItem = ({ icon: Icon, label, value }) => (
        <div>
            <label className="flex items-center text-xs font-semibold text-slate-500 uppercase">
                <Icon size={14} className="mr-2" />
                {label}
            </label>
            <p className="mt-1 text-base text-slate-800 font-medium">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{application.name}</h2>
                        <p className="font-semibold text-indigo-600">{application.regNo}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4 overflow-y-auto space-y-6">
                    {/* Course & Status Card */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                        <div className="p-2 text-center md:text-left"><DetailItem icon={GraduationCap} label="Course" value={application.course} /></div>
                        <div className="p-2 text-center md:text-left"><DetailItem icon={Calendar} label="Application Date" value={new Date(application.date).toLocaleDateString('en-GB')} /></div>
                        <div className="p-2 text-center md:text-left">
                            <label className="flex items-center justify-center md:justify-start text-xs font-semibold text-slate-500 uppercase">
                                <FileText size={14} className="mr-2" />
                                Status
                            </label>
                            <div className="mt-1">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>{application.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Personal & Contact Info Card */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h3 className="text-base font-semibold text-slate-800 mb-4">Personal & Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <DetailItem icon={User} label="Father's Name" value={application.fatherName} />
                            <DetailItem icon={Phone} label="Phone Number" value={application.phone} />
                            <DetailItem icon={Mail} label="Email Address" value={application.email} />
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold text-sm transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CollegeAdmissionManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', course: 'All', status: 'Pending' });
    const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10 });
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const firstNamesMale = ["Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Krishna", "Ishaan", "Rohan", "Vikram"];
            const firstNamesFemale = ["Saanvi", "Aadhya", "Ananya", "Diya", "Pari", "Isha", "Myra", "Kiara", "Anika", "Riya"];
            const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Jain", "Mehta", "Chopra"];
            const courses = ["B.Tech CSE", "B.Tech ECE", "MBA", "B.Pharm", "B.Arch"];

            const dummyData = Array.from({ length: 58 }, (_, i) => {
                const isMale = Math.random() > 0.5;
                const firstName = isMale ? firstNamesMale[i % firstNamesMale.length] : firstNamesFemale[i % firstNamesFemale.length];
                const lastName = lastNames[i % lastNames.length];
                const course = courses[i % courses.length];
                const regNoPrefix = course.split(' ')[1] || 'GEN';

                return {
                    _id: `app${i + 1}`,
                    name: `${firstName} ${lastName}`,
                    regNo: `2024${regNoPrefix}${String(i + 1).padStart(3, '0')}`,
                    course,
                    status: i % 5 === 0 ? 'Approved' : i % 7 === 0 ? 'Rejected' : 'Pending',
                    date: new Date(2024, 8, 20 - i).toISOString(),
                    fatherName: `Mr. Ramesh ${lastName}`,
                    email: `${firstName.toLowerCase()}.${i}@test.com`,
                    phone: `98765432${String(i).padStart(2, '0')}`
                }
            });
            setApplications(dummyData);
            setLoading(false);
        }, 1500);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };
    
    const handleUpdateStatus = (appId, newStatus) => {
        setApplications(prev => prev.map(app => 
            app._id === appId ? { ...app, status: newStatus } : app
        ));
        alert(`Application for ${appId} has been ${newStatus}.`);
    };

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const searchMatch = filters.search ? (app.name.toLowerCase().includes(filters.search.toLowerCase()) || app.regNo.includes(filters.search)) : true;
            const courseMatch = filters.course !== 'All' ? app.course === filters.course : true;
            const statusMatch = filters.status !== 'All' ? app.status === filters.status : true;
            return searchMatch && courseMatch && statusMatch;
        });
    }, [applications, filters]);

    const paginatedApplications = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
        return filteredApplications.slice(startIndex, startIndex + pagination.pageSize);
    }, [filteredApplications, pagination]);

    const totalPages = Math.ceil(filteredApplications.length / pagination.pageSize);

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Manage Admission Applications</h1>
                <p className="mt-1 text-slate-600">Review, approve, or reject student admission applications.</p>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by name or reg. no..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                    </div>
                    <select name="course" value={filters.course} onChange={handleFilterChange} className="px-3 py-2 border rounded-lg bg-white">
                        <option value="All">All Courses</option>
                        <option value="B.Tech CSE">B.Tech CSE</option>
                        <option value="B.Tech ECE">B.Tech ECE</option>
                        <option value="MBA">MBA</option>
                        <option value="B.Pharm">B.Pharm</option>
                        <option value="B.Arch">B.Arch</option>
                    </select>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="px-3 py-2 border rounded-lg bg-white">
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                            <tr><th className="px-4 py-2 font-semibold">Student Name</th><th className="px-4 py-2 font-semibold">Registration No.</th><th className="px-4 py-2 font-semibold">Course</th><th className="px-4 py-2 font-semibold text-center">Status</th><th className="px-4 py-2 font-semibold text-center">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {paginatedApplications.map(app => (
                                <tr key={app._id}>
                                    <td className="px-4 py-2 font-semibold text-slate-700">{app.name}</td>
                                    <td className="px-4 py-2 font-mono text-slate-600">{app.regNo}</td>
                                    <td className="px-4 py-2 text-slate-600">{app.course}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'Approved' ? 'bg-green-100 text-green-800' : app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => setSelectedApp(app)} className="p-1.5 hover:bg-slate-200 rounded-md" title="View Details"><Eye size={16}/></button>
                                            {app.status === 'Pending' && <>
                                                <button onClick={() => handleUpdateStatus(app._id, 'Approved')} className="p-1.5 hover:bg-green-100 text-green-600 rounded-md" title="Approve"><CheckCircle size={16}/></button>
                                                <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} className="p-1.5 hover:bg-red-100 text-red-600 rounded-md" title="Reject"><XCircle size={16}/></button>
                                            </>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 border-t">
                    <select value={pagination.pageSize} onChange={e => setPagination(p => ({...p, pageSize: Number(e.target.value), currentPage: 1}))} className="p-1.5 border rounded-md bg-white">
                        <option value="10">10 per page</option><option value="20">20 per page</option><option value="50">50 per page</option>
                    </select>
                    <p>Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to {Math.min(pagination.currentPage * pagination.pageSize, filteredApplications.length)} of {filteredApplications.length} entries</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPagination(p => ({...p, currentPage: p.currentPage - 1}))} disabled={pagination.currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button>
                        <button onClick={() => setPagination(p => ({...p, currentPage: p.currentPage + 1}))} disabled={pagination.currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
            <ApplicationDetailsModal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} application={selectedApp} />
        </div>
    );
};

export default CollegeAdmissionManageApplications;