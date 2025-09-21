import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, Eye, UserX } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="h-12 bg-slate-200 rounded-lg mb-4"></div>
        <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 space-y-3">
                {[...Array(10)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg"></div>)}
            </div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const StudentDatabase = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            
            // API call with search parameter
            const params = new URLSearchParams({ search: searchTerm });
            
            try {
                const response = await fetch(`${API_BASE_URL}/students/placement-list?${params.toString()}`, { credentials: 'include' });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || "Failed to fetch student data.");
                }
                const data = await response.json();
                setStudents(data.students || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        // Debounce search to avoid API calls on every keystroke
        const timer = setTimeout(() => {
            fetchStudents();
        }, 500);

        return () => clearTimeout(timer);

    }, [searchTerm]);

    return (
        <div className="font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Student Database</h1>
                <p className="mt-1 text-slate-600">Search for students by name or registration number.</p>
            </header>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search students..."
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
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
                                    <th className="p-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {students.length > 0 ? students.map(student => (
                                    <tr key={student._id} className="hover:bg-slate-50">
                                        <td className="p-3 font-semibold text-slate-700">{student.name}</td>
                                        <td className="p-3 font-mono text-slate-600">{student.registrationNumber}</td>
                                        <td className="p-3 text-slate-600">{student.branch || 'N/A'}</td>
                                        <td className="p-3 text-center">
                                            <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md" title="View Full Profile">
                                                <Eye size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-8 text-slate-500">
                                            <UserX size={32} className="mx-auto text-slate-300 mb-2"/>
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDatabase;