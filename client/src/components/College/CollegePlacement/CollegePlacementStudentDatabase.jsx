import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, User, Eye } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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

// --- HELPER COMPONENTS ---
const FilterInput = ({ value, onChange, name, placeholder, icon: Icon, ...props }) => (
    <div className="relative">
        <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
            type="text" 
            name={name} // <-- FIX: Added name attribute
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
            {...props}
        />
    </div>
);
const FilterSelect = ({ value, onChange, name, children }) => (
    <select 
        name={name} // <-- FIX: Added name attribute
        value={value} 
        onChange={onChange} 
        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
    >
        {children}
    </select>
);
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="p-4 flex justify-end items-center gap-2 text-sm text-slate-600 border-t">
            <p className="font-medium mr-4">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-1">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const StudentDatabase = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalDocs: 0 });
    const [filters, setFilters] = useState({ search: '', courseId: 'all', minCgpa: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/course`, { credentials: 'include' });
                if (!response.ok) throw new Error("Failed to load courses.");
                const data = await response.json();
                setCourses(data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);
    
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({
                page: pagination.currentPage,
                limit: 10,
                search: filters.search,
                courseId: filters.courseId,
                minCgpa: filters.minCgpa || 0,
            });
            try {
                const response = await fetch(`${API_BASE_URL}/student/placement-list?${params.toString()}`, { credentials: 'include' });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || "Failed to fetch student data.");
                }
                const data = await response.json();
                setStudents(data.students || []);
                setPagination(prev => ({ ...prev, totalPages: data.totalPages, totalDocs: data.totalDocs }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        const timer = setTimeout(fetchStudents, 500);
        return () => clearTimeout(timer);

    }, [filters, pagination.currentPage]);
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const clearFilters = () => {
        setFilters({ search: '', courseId: 'all', minCgpa: '' });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };
    
    // --- FIX: Added navigation handler ---
    const handleViewProfile = (studentId) => {
        // In a real app, you would navigate to the student's detailed profile page
        alert(`Navigating to profile for student ID: ${studentId}`);
        // Example with react-router: navigate(`/student-profile/${studentId}`);
    };

    return (
        <div className="font-sans">

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <FilterInput value={filters.search} onChange={handleFilterChange} name="search" placeholder="Search by name/reg. no..." icon={Search} />
                    <FilterSelect value={filters.courseId} onChange={handleFilterChange} name="courseId">
                        <option value="all">All Courses</option>
                        {courses.map(course => (
                            <option key={course.courseId} value={course.courseId}>{course.branch}</option>
                        ))}
                    </FilterSelect>
                    <FilterInput value={filters.minCgpa} onChange={handleFilterChange} name="minCgpa" type="number" step="0.1" placeholder="Min. CGPA (e.g., 7.5)" icon={SlidersHorizontal} />
                    <button onClick={clearFilters} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold">Clear Filters</button>
                </div>
            </div>

            {loading ? <SkeletonLoader /> : error ? <div className="p-10 text-center text-red-600 bg-red-50 rounded-lg">{error}</div> : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                <tr>
                                    <th className="p-3 font-semibold text-left">Student Name</th>
                                    <th className="p-3 font-semibold text-left">Registration Number</th>
                                    <th className="p-3 font-semibold text-left">Branch</th>
                                    <th className="p-3 font-semibold text-center">CGPA</th>
                                    <th className="p-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {students.length > 0 ? students.map(student => (
                                    <tr key={student._id} className="hover:bg-slate-50">
                                        <td className="p-3 font-semibold text-slate-700">{student.name}</td>
                                        <td className="p-3 font-mono text-slate-600">{student.registrationNumber}</td>
                                        <td className="p-3 text-slate-600">{student.branch || 'N/A'}</td>
                                        <td className="p-3 text-center font-bold text-indigo-600">{student.cgpa ? student.cgpa.toFixed(2) : '0'}</td>
                                        <td className="p-3 text-center">
                                            {/* --- FIX: Added onClick handler --- */}
                                            <button onClick={() => handleViewProfile(student._id)} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md" title="View Full Profile">
                                                <Eye size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center p-8 text-slate-500">No students found matching your criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={(page) => setPagination(p => ({...p, currentPage: page}))}/>
                </div>
            )}
        </div>
    );
};

export default StudentDatabase;