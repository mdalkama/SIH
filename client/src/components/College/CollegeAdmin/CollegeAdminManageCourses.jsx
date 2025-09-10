import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit2, BookOpen, GraduationCap, X } from 'lucide-react';



// --- Main Parent Component ---

const CollegeAdminManageCourses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true); // Initially true for data loading
    const [courses, setCourses] = useState([]);

    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Simulate API call - Replace with actual API integration
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    'https://sih-4ptm.onrender.com/api/v1/college-course/courses',
                    {
                        method: "GET",
                        credentials: "include", // ✅ cookies/session bhejega
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }

                const data = await response.json();

                setCourses(data.college.courses || []);

            } catch (error) {
                console.error('Error fetching courses:', error);
                showAlert('error', 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);



    const processedData = useMemo(() => {
        const filtered = courses.filter(item => {
            if (!item) return false;
            const query = searchTerm.toLowerCase();
            return (item.courseId?.toLowerCase() || '').includes(query) ||
                (item.degree?.toLowerCase() || '').includes(query) ||
                (item.branch?.toLowerCase() || '').includes(query);
        });

        const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

        return { paginatedData: paginated, totalCount: filtered.length, filteredData: filtered };

    }, [courses, searchTerm, currentPage, rowsPerPage]);

    const { paginatedData, totalCount, filteredData } = processedData;

    const showAlert = (type, message) => setAlert({ show: true, type, message });
    const hideAlert = () => setAlert({ show: false, type: 'info', message: '' });

    const handleEdit = (item) => {
        setEditingItem(item);
        console.log(item);
        setShowEditModal(true);
    };

    const stats = useMemo(() => {
        return {
            total: courses.length,
            btech: courses.filter(c => c.degree === 'B.Tech').length,
            mtech: courses.filter(c => c.degree === 'M.Tech').length,
            mba: courses.filter(c => c.degree === 'MBA').length
        };
    }, [courses]);

    return (
        <div className="min-h-screen font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="max-w-7xl mx-auto">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<GraduationCap size={20} className="text-blue-600" />}
                        title="Total Courses"
                        value={stats.total}
                    />
                    <StatCard title="B.Tech Programs" value={stats.btech} />
                    <StatCard title="M.Tech Programs" value={stats.mtech} />
                    <StatCard title="MBA Programs" value={stats.mba} />
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">

                    {/* Table Content */}
                    <TableView
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    >
                        <CourseTable
                            courses={paginatedData}
                            onEdit={handleEdit}
                            currentPage={currentPage}
                            rowsPerPage={rowsPerPage}
                        />

                        {loading && <div className="text-center py-12">Loading...</div>}
                        {!loading && paginatedData.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-lg text-gray-500">No courses found</p>
                                {searchTerm && <p className="text-sm text-gray-400">Try adjusting your search.</p>}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalCount={totalCount}
                            pageSize={rowsPerPage}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => { setRowsPerPage(size); setCurrentPage(1); }}
                            filteredData={filteredData}
                        />
                    </TableView>
                </div>
            </div>

            {/* Modals */}
            {showEditModal && (
                <EditFeesModal
                    setShowModal={setShowEditModal}
                    initialData={editingItem}
                    onUpdateSuccess={(updatedFeesArray) => {
                        const updatedCourse = {
                            ...editingItem,
                            semesterFees: updatedFeesArray.reduce((acc, f) => ({ ...acc, [f.semester]: f.fees }), {})
                        };

                        setCourses(prev => prev.map(c => c._id === updatedCourse._id ? updatedCourse : c));
                        showAlert('success', 'Course fees updated successfully!');
                    }}

                    onUpdateError={(error) => showAlert('error', `Failed to update fees. ${error.message || ''}`)}
                />
            )}

            {/* Alert Notification */}
            <AlertNotification
                show={alert.show}
                type={alert.type}
                message={alert.message}
                onClose={hideAlert}
            />
        </div>
    );
};

// --- Child Components ---

const StatCard = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)' }}>
        {icon}
        <div>
            <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</p>
            <p className="text-2xl font-bold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
        </div>
    </div>
);

const TableView = ({ searchTerm, onSearchChange, children }) => (
    <div>
        <div className="p-6 border-b border-gray-200">
            <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                />
            </div>
        </div>
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">{children}</div>
        </div>
    </div>
);

const CourseTable = ({ courses, onEdit, currentPage, rowsPerPage }) => (
    <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12" style={{ fontFamily: 'Poppins, sans-serif' }}>#</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Course ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Program</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Semesters</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Total Fees</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
            {courses.map((course, index) => {
                const itemNumber = (currentPage - 1) * rowsPerPage + index + 1;

                const totalFees = course.semesterFees ?
                    Object.values(course.semesterFees).reduce((sum, fee) => sum + (fee || 0), 0) : 0;

                return (
                    <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-center text-sm text-gray-500 font-mono">{String(itemNumber).padStart(2, '0')}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">{course.courseId}</td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{course.degree} - {course.branch}</div>
                            {course.specialization && <div className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>{course.specialization}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{course.totalSemester}</td>
                        <td className="px-6 py-4">
                            <div className="text-lg font-bold text-blue-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                ₹{totalFees.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                ({course.totalSemester} semesters)
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => onEdit(course)}
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                title="Edit Semester Fees"
                            >
                                <Edit2 size={16} />
                            </button>
                        </td>
                    </tr>
                )
            })}
        </tbody>
    </table>
);



const Pagination = ({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange, filteredData }) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(startItem + pageSize - 1, totalCount);

    const summaryStats = useMemo(() => {
        if (!filteredData) return {};
        return {
            btech: filteredData.filter(c => c.degree === 'B.Tech').length,
            mtech: filteredData.filter(c => c.degree === 'M.Tech').length,
            mba: filteredData.filter(c => c.degree === 'MBA').length,
        }
    }, [filteredData]);

    return (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>Show:</span>
                    <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-md bg-white">
                        {[5, 10, 20].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                </div>
                <span>Showing {startItem}-{endItem} of {totalCount} records</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="font-semibold flex gap-4">
                    <span>B.Tech: <span className="text-blue-600">{summaryStats.btech}</span></span>
                    <span>M.Tech: <span className="text-green-600">{summaryStats.mtech}</span></span>
                    <span>MBA: <span className="text-orange-600">{summaryStats.mba}</span></span>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50">Previous</button>
                        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AlertNotification = ({ show, type, message, onClose }) => {
    const colors = {
        success: 'bg-green-100 border-green-300 text-green-800',
        error: 'bg-red-100 border-red-300 text-red-800',
        info: 'bg-blue-100 border-blue-300 text-blue-800',
    };
    // Auto-close the alert after 4 seconds
    useEffect(() => {
        if (!show) return;
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className={`fixed top-5 right-5 p-4 rounded-lg border shadow-lg z-50 transition-transform transform ${show ? 'translate-x-0' : 'translate-x-full'} ${colors[type] || colors.info}`}>
            <div className="flex items-center justify-between">
                <p>{message}</p>
                <button onClick={onClose} className="ml-4"><X size={18} /></button>
            </div>
        </div>
    );
};



// --- CORRECTED COMPONENT ---
const EditFeesModal = ({ setShowModal, initialData = null, onUpdateSuccess, onUpdateError }) => {
    const [loading, setLoading] = useState(false);
    const [semesterFees, setSemesterFees] = useState({});

    useEffect(() => {
        if (initialData?.semesterFees) {
            setSemesterFees(initialData.semesterFees);
        } else {
            setSemesterFees({});
        }
    }, [initialData]);

    const handleSemesterFeeChange = (semester, value) => {
        setSemesterFees(prev => ({
            ...prev,
            [semester]: parseInt(value, 10) || 0
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert semesterFees object -> array of { semester, fees }
            const feesArray = Object.entries(semesterFees).map(([semester, fee]) => ({
                semester: Number(semester),
                fees: Number(fee),
            }));

            const response = await fetch(
                `https://sih-4ptm.onrender.com/api/v1/college-course/courses/${initialData._id}/fees`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ fees: feesArray }), // ✅ correct format
                }
            );
console.log({ fees: feesArray })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update fees");
            }

            const result = await response.json();
            console.log(result);
            // Update parent with latest course
            onUpdateSuccess(result.course.fees);
            setShowModal(false);

        } catch (error) {
            console.error("Error updating fees:", error);
            onUpdateError(error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Semester Fees</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Course Details (Read-only) */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Course Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Course ID</label>
                                <input
                                    type="text"
                                    value={initialData?.courseId || ''}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Degree</label>
                                <input
                                    type="text"
                                    value={initialData?.degree || ''}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Branch</label>
                                <input
                                    type="text"
                                    value={initialData?.branch || ''}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>
                            {initialData?.specialization && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Specialization</label>
                                    <input
                                        type="text"
                                        value={initialData.specialization}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Semester-wise Fees Input (Editable) */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Semester-wise Fees (₹)</h3>
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(initialData?.totalSemester || 0, 4)}, 1fr)` }}>
                            {Array.from({ length: initialData?.totalSemester || 0 }, (_, i) => i + 1).map(semester => (
                                <div key={semester} className="bg-blue-50 p-4 rounded-lg">
                                    <label className="block text-sm font-semibold text-blue-700 mb-2 text-center">
                                        Semester {semester}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={semesterFees[semester] || ''}
                                            onChange={(e) => handleSemesterFeeChange(semester, e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-medium"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">Enter the fees amount for each semester of this course</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? 'Updating...' : 'Update Semester Fees'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollegeAdminManageCourses;