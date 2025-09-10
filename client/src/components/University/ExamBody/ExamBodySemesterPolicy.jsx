import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Edit, X, Loader2, Search, ChevronLeft, ChevronRight, Trash2, AlertTriangle, CheckCircle, Info, ArrowLeft, Eye } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';
const COURSES_API_URL = 'https://sih-4ptm.onrender.com/api/v1/course';

// Status Constants
const STATUSES = ['CREATED', 'OPEN_FOR_REGISTRATION', 'CLOSED', 'RESULT_PROCESSING', 'PUBLISHED'];

// --- Main Component ---
const UniversityExamManager = () => {
    const [view, setView] = useState('list'); // 'list', 'details', 'form', 'loading'
    const [allCourses, setAllCourses] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [editingExam, setEditingExam] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true); // Start with loading true
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await fetch(COURSES_API_URL, { credentials: 'include' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch courses list');
                }
                const data = await response.json();
                setAllCourses(Array.isArray(data) ? data : []);
            } catch (err) {
                addToast('error', err.message);
            } finally {
                setIsPageLoading(false); // Stop loading after fetch attempt
            }
        };
        fetchAllCourses();
    }, []);

    const refreshExamList = () => {
        setView('list');
    };

    const handleViewDetails = async (examId) => {
        setIsPageLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${examId}`, { credentials: 'include' });
            if (!response.ok) throw new Error("Failed to fetch exam details.");
            const data = await response.json();
            setSelectedExam(data);
            setView('details');
        } catch (err) {
            addToast('error', err.message);
            setView('list'); // Go back to list on error
        } finally {
            setIsPageLoading(false);
        }
    };

    const handleShowForm = (exam = null) => {
        setEditingExam(exam);
        setView('form');
    };

    const handleBackToList = () => {
        setSelectedExam(null);
        setEditingExam(null);
        setView('list');
    };

    if (isPageLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
    }

    return (
        <div className="min-h-screen font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="max-w-7xl mx-auto">
                {view === 'details' ? (
                    <ExamDetailView exam={selectedExam} onBack={handleBackToList} />
                ) : view === 'form' ? (
                    <ExamForm exam={editingExam} onBack={handleBackToList} addToast={addToast} onSaveSuccess={refreshExamList} allCourses={allCourses} />
                ) : (
                    <div className="bg-white rounded-lg border shadow-sm">
                        <div className="p-4 border-b">
                            <h1 className="text-lg font-semibold text-blue-600 border-b-2 border-blue-600 pb-2 inline-block">Manage Exams</h1>
                        </div>
                        <ExamListView onShowForm={handleShowForm} addToast={addToast} onViewDetails={handleViewDetails} />
                    </div>
                )}
            </div>
        </div>
    );
};

// --- List View ---
const ExamListView = ({ onShowForm, addToast, onViewDetails }) => {
    const [exams, setExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalDocs: 0 });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deletingExam, setDeletingExam] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            setIsLoading(true);
            const params = new URLSearchParams({ page: pagination.currentPage, limit: rowsPerPage, search: searchTerm });
            try {
                const response = await fetch(`${API_BASE_URL}?${params.toString()}`, { credentials: 'include' });
                if (!response.ok) throw new Error("Failed to fetch exams.");
                const data = await response.json();
                setExams(data.exams || []);
                setPagination({ currentPage: data.currentPage, totalPages: data.totalPages, totalDocs: data.totalDocs });
            } catch (err) {
                addToast('error', err.message);
                setExams([]); // Clear exams on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchExams();
    }, [pagination.currentPage, rowsPerPage, searchTerm, addToast]);

    const aggregateCounts = useMemo(() => {
        if (!exams || exams.length === 0) return {};
        return exams.reduce((acc, exam) => {
            const key = exam.examType;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }, [exams]);

    const handleStatusUpdate = async (examToUpdate, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${examToUpdate._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...examToUpdate, status: newStatus }),
                credentials: 'include'
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to update status.");
            }
            const updatedExam = await response.json();
            setExams(prevExams => prevExams.map(e => (e._id === updatedExam._id ? updatedExam : e)));
            addToast('success', `Status for ${updatedExam.examName} updated.`);
        } catch (err) {
            addToast('error', err.message);
        }
    };

    const handleDelete = async () => {
        if (!deletingExam) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${deletingExam._id}`, { method: 'DELETE', credentials: 'include' });
            if (!response.ok) throw new Error("Failed to delete exam.");
            addToast('info', `${deletingExam.examName} has been deleted.`);
            setExams(prev => prev.filter(e => e._id !== deletingExam._id));
            setPagination(p => ({ ...p, totalDocs: p.totalDocs - 1 }));
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsLoading(false);
            setDeletingExam(null);
        }
    };

    return (
        <div>
            <DataTableToolbar onSearchChange={setSearchTerm} onAddClick={() => onShowForm(null)} />
            {isLoading ? <div className="p-10 text-center"><Loader2 className="animate-spin text-blue-600" /></div> :
                (exams.length > 0 ?
                    <ExamsTable
                        exams={exams}
                        onEdit={onShowForm}
                        onDelete={setDeletingExam}
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={onViewDetails}
                        currentPage={pagination.currentPage}
                        pageSize={rowsPerPage}
                    /> :
                    <div className="text-center p-16 text-gray-500">
                        No exams found.
                    </div>
                )
            }
            <Pagination
                currentPage={pagination.currentPage}
                totalCount={pagination.totalDocs}
                pageSize={rowsPerPage}
                onPageChange={(page) => setPagination(p => ({ ...p, currentPage: page }))}
                onPageSizeChange={setRowsPerPage}
                aggregateData={aggregateCounts}
            />
            {deletingExam && <ConfirmationModal isOpen={!!deletingExam} onClose={() => setDeletingExam(null)} onConfirm={handleDelete} title="Confirm Deletion" message={`Are you sure you want to delete ${deletingExam.examName}?`} confirmText="Delete" confirmColor="red" processing={isLoading} />}
        </div>
    );
};

// --- Detail View ---
const ExamDetailView = ({ exam, onBack }) => (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Exam List
        </button>
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{exam.examName}</h1>
                    <p className="text-gray-500 mt-1">{exam.examId} | Semester {exam.semester}, {exam.year}</p>
                </div>
                <StatusBadge status={exam.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm border-t pt-4">
                <p><strong>Type:</strong> {exam.examType}</p>
                <p><strong>Starts:</strong> {new Date(exam.startDate).toLocaleDateString('en-GB')}</p>
                <p><strong>Ends:</strong> {new Date(exam.endDate).toLocaleDateString('en-GB')}</p>
                <p><strong>Registrations:</strong> {exam.registeredStudents || 0}</p>
            </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Course Timetables</h2>
        <div className="space-y-4">
            {exam.courses && exam.courses.length > 0 ? exam.courses.map(course => (
                <div key={course.courseCode || course._id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-semibold text-gray-700">Course: {course.courseCode}</h3>
                    </div>
                    <Timetable course={course} />
                </div>
            )) : <p className="text-gray-500 bg-white p-4 rounded-lg border">No courses or timetables available for this exam.</p>}
        </div>
    </div>
);

// --- Form View ---
const ExamForm = ({ exam, onBack, addToast, onSaveSuccess, allCourses }) => {
    const [formData, setFormData] = useState({
        examId: exam?.examId || '', examName: exam?.examName || '', examType: exam?.examType || 'ENDSEM',
        semester: exam?.semester || '', year: exam?.year || new Date().getFullYear(),
        startDate: exam?.startDate?.split('T')[0] || '', endDate: exam?.endDate?.split('T')[0] || '',
        status: exam?.status || 'CREATED', courses: exam?.courses || []
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        if (formData.courses.length > 0 && formData.semester && allCourses.length > 0) {
            const updatedCourses = formData.courses.map(course => {
                if (!course.courseCode) return course;
                const selectedCourseData = allCourses.find(c => c.courseId === course.courseCode);
                const semesterData = selectedCourseData?.semesters.find(s => s.semesterNumber == formData.semester);
                let newTimetable = course.timetable || [];
                if (semesterData) {
                    const existingSubjects = new Set(newTimetable.map(t => t.subjectCode));
                    const subjectsFromCourse = semesterData.subjects
                        .filter(sub => !existingSubjects.has(sub.code))
                        .map(subject => ({ subjectCode: subject.code, subjectName: subject.name, examDate: '', session: 'FN' }));
                    newTimetable = [...newTimetable, ...subjectsFromCourse];
                }
                return { ...course, timetable: newTimetable };
            });
            setFormData(prev => ({ ...prev, courses: updatedCourses }));
        }
    }, [formData.semester, allCourses, formData.courses.length]);

    const handleCourseChange = (index, courseId) => {
        const newCourses = [...formData.courses];
        if (!formData.semester) {
            addToast('info', "Please select a semester first.");
            return;
        }
        const selectedCourse = allCourses.find(c => c.courseId === courseId);
        const semesterData = selectedCourse?.semesters.find(s => s.semesterNumber == formData.semester);
        let newTimetable = [];
        if (semesterData) {
            newTimetable = semesterData.subjects.map(subject => ({ subjectCode: subject.code, subjectName: subject.name, examDate: '', session: 'FN' }));
        } else if (courseId) {
            addToast('info', `No subjects for semester ${formData.semester} in ${selectedCourse?.branch}.`);
        }
        newCourses[index] = { courseCode: courseId, timetable: newTimetable };
        setFormData({ ...formData, courses: newCourses });
    };

    const handleTimetableChange = (courseIndex, ttIndex, field, value) => {
        const newCourses = [...formData.courses];
        newCourses[courseIndex].timetable[ttIndex][field] = value;
        setFormData({ ...formData, courses: newCourses });
    };

    const addCourse = () => setFormData({ ...formData, courses: [...formData.courses, { courseCode: '', timetable: [] }] });
    const removeCourse = (index) => setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== index) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = exam ? `${API_BASE_URL}/${exam._id}` : API_BASE_URL;
            const method = exam ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), credentials: 'include' });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `Failed to ${exam ? 'update' : 'create'} exam.`);
            }
            addToast('success', `Exam ${exam ? 'updated' : 'created'} successfully!`);
            onSaveSuccess();
        } catch (err) {
            addToast('error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4"><ArrowLeft size={16} /> Back</button>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">{exam ? 'Edit Exam' : 'Create New Exam'}</h1>
                <p className="text-gray-500 mt-1 mb-6">Fill in the details below.</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input name="examName" value={formData.examName} onChange={handleChange} placeholder="Exam Name" className="md:col-span-2 p-2 border rounded" required />
                    <input name="examId" value={formData.examId} onChange={handleChange} placeholder="Exam ID" className="p-2 border rounded" required />
                    <select name="examType" value={formData.examType} onChange={handleChange} className="p-2 border rounded bg-white"><option>MIDSEM</option><option>ENDSEM</option><option>INTERNAL</option><option>PRACTICAL</option></select>
                    <input name="semester" type="number" value={formData.semester} onChange={handleChange} placeholder="Semester" className="p-2 border rounded" required />
                    <input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="Year" className="p-2 border rounded" required />
                    <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="p-2 border rounded" />
                    <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="p-2 border rounded" />
                    <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded bg-white">
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                </div>
                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Timetable Details</h3>
                    {formData.courses.map((course, cIdx) => (
                        <div key={cIdx} className="p-4 border rounded-lg bg-gray-50 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <select value={course.courseCode} onChange={(e) => handleCourseChange(cIdx, e.target.value)} className="p-2 border rounded bg-white font-semibold">
                                    <option value="">-- Select Course --</option>
                                    {allCourses.map(c => <option key={c.courseId} value={c.courseId}>{c.branch} ({c.degree})</option>)}
                                </select>
                                <button type="button" onClick={() => removeCourse(cIdx)}><Trash2 size={16} className="text-red-500" /></button>
                            </div>
                            {course.timetable && course.timetable.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {course.timetable.map((tt, tIdx) => (
                                        <div key={tIdx} className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center">
                                            <div className="md:col-span-6 p-2 border rounded bg-white text-sm">{tt.subjectName} ({tt.subjectCode})</div>
                                            <input type="date" value={tt.examDate?.split('T')[0] || ''} onChange={e => handleTimetableChange(cIdx, tIdx, 'examDate', e.target.value)} className="md:col-span-3 p-2 border rounded" />
                                            <select value={tt.session} onChange={e => handleTimetableChange(cIdx, tIdx, 'session', e.target.value)} className="md:col-span-1 p-2 border rounded bg-white"><option value="FN">FN</option><option value="AN">AN</option></select>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addCourse} className="text-sm font-semibold text-green-600 hover:text-green-700">+ Add Another Course</button>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center">{isLoading ? <><Loader2 size={16} className="animate-spin" />&nbsp;Saving...</> : 'Save Exam'}</button>
                </div>
            </form>
        </div>
    );
};

// --- Child & Helper Components ---
const DataTableToolbar = ({ onSearchChange, onAddClick }) => (
    <div className="p-4 flex justify-between items-center border-b">
        <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" onChange={e => onSearchChange(e.target.value)} placeholder="Search exams..." className="pl-10 pr-4 py-2 w-80 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <button onClick={onAddClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle size={18} /> Add Exam
        </button>
    </div>
);

const ExamsTable = ({ exams, onEdit, onDelete, onStatusUpdate, currentPage, pageSize, onViewDetails }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500 uppercase">
                <tr className="border-b">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Exam Name</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Semester/Year</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {exams.map((exam, index) => (
                    <tr key={exam._id} className="border-b">
                        <td className="px-6 py-4 text-gray-500">{String((currentPage - 1) * pageSize + index + 1).padStart(2, '0')}</td>
                        <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{exam.examName}</div>
                            <div className="text-xs text-gray-500">{exam.examId}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{exam.examType}</td>
                        <td className="px-6 py-4 text-gray-600">Sem {exam.semester}, {exam.year}</td>
                        <td className="px-6 py-4 text-center"><StatusSelector exam={exam} onUpdate={onStatusUpdate} /></td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-4">
                                <button onClick={() => onViewDetails(exam._id)} className="text-gray-400 hover:text-green-600" title="View Details">
                                    <Eye size={18} />
                                </button>
                                <button onClick={() => onEdit(exam)} className="text-gray-400 hover:text-blue-600" title="Edit"><Edit size={18} /></button>
                                <button onClick={() => onDelete(exam)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 size={18} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const StatusSelector = ({ exam, onUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [nextStatus, setNextStatus] = useState('');
    const styles = { 'CREATED': 'bg-gray-100 text-gray-800', 'OPEN_FOR_REGISTRATION': 'bg-blue-100 text-blue-800', 'CLOSED': 'bg-red-100 text-red-800', 'RESULT_PROCESSING': 'bg-yellow-100 text-yellow-800', 'PUBLISHED': 'bg-green-100 text-green-800' };
    const handleChange = (e) => {
        const newStatus = e.target.value;
        if (newStatus !== exam.status) {
            setNextStatus(newStatus);
            setShowConfirm(true);
        }
    };
    const handleConfirm = async () => {
        setShowConfirm(false);
        setIsUpdating(true);
        await onUpdate(exam, nextStatus);
        setIsUpdating(false);
    };
    if (isUpdating) return <div className="flex justify-center items-center"><Loader2 size={16} className="animate-spin" /></div>;
    return (
        <>
            <select value={exam.status} onChange={handleChange} className={`px-2.5 py-1 text-xs font-semibold rounded-full border-none outline-none appearance-none cursor-pointer ${styles[exam.status]}`} style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <ConfirmationModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleConfirm} title="Confirm Status Change" message={`Change status to "${nextStatus.replace(/_/g, ' ')}"?`} confirmText="Confirm" />
        </>
    );
};

const Timetable = ({ course }) => (
    <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="text-left text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Session</th>
                <th className="px-4 py-2 font-medium">Subject</th>
            </tr>
        </thead>
        <tbody className="divide-y">
            {course.timetable && course.timetable.length > 0 ? course.timetable.map(slot => (
                <tr key={slot.subjectCode || slot._id}>
                    <td className="px-4 py-3 w-48">{slot.examDate ? new Date(slot.examDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : <span className="text-gray-400">Not set</span>}</td>
                    <td className="px-4 py-3 w-32">{slot.session === 'FN' ? 'Forenoon' : 'Afternoon'}</td>
                    <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{slot.subjectName}</p>
                        <p className="text-xs text-gray-500 font-mono">{slot.subjectCode}</p>
                    </td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500">No timetable entries for this course.</td>
                </tr>
            )}
        </tbody>
    </table></div>
);

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange, aggregateData }) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (totalCount === 0) return <div className="p-4 border-t text-sm text-gray-500">Showing 0-0 of 0 records</div>;
    return (
        <div className="p-4 flex flex-wrap justify-between items-center gap-4 text-sm text-gray-700 border-t">
            <div className="flex items-center gap-2">
                <span>Show:</span>
                <select value={pageSize} onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }} className="p-1 border rounded-md bg-white">
                    {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                </select>
            </div>
            <p>Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} of {totalCount} records</p>
            <div className="flex items-center gap-6">
                {aggregateData && Object.keys(aggregateData).length > 0 && (
                    <div className="flex items-center gap-4">
                        {Object.entries(aggregateData).map(([key, value]) => <span key={key}>{key}: <b className="text-blue-600">{value}</b></span>)}
                    </div>
                )}
                <div className="flex gap-2">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded disabled:opacity-50"><ChevronLeft size={16} /></button>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded disabled:opacity-50"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = { 'CREATED': 'bg-gray-100 text-gray-800', 'OPEN_FOR_REGISTRATION': 'bg-blue-100 text-blue-800', 'CLOSED': 'bg-red-100 text-red-800', 'RESULT_PROCESSING': 'bg-yellow-100 text-yellow-800', 'PUBLISHED': 'bg-green-100 text-green-800' };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100'}`}>{status ? status.replace(/_/g, ' ') : 'UNKNOWN'}</span>;
};

const Toast = ({ message, type, onClose }) => {
    const icons = { success: <CheckCircle className="text-green-500" />, error: <AlertTriangle className="text-red-500" />, info: <Info className="text-blue-500" /> };
    return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-3 w-80 animate-fade-in-right"> <div className="flex-shrink-0">{icons[type]}</div> <p className="flex-1 text-sm text-gray-700">{message}</p> <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button> </div>);
};

const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return (<div className="fixed top-5 right-5 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'blue', processing }) => {
    if (!isOpen) return null;
    const colors = { red: 'bg-red-600 hover:bg-red-700', blue: 'bg-blue-600 hover:bg-blue-700' };
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="p-6"><div className="flex items-start gap-4"><div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${confirmColor === 'red' ? 'bg-red-100' : 'bg-blue-100'}`}><AlertTriangle className={`${confirmColor === 'red' ? 'text-red-600' : 'text-blue-600'}`} size={24} /></div><div><h3 className="text-lg font-bold text-gray-800">{title}</h3><p className="text-sm text-gray-500 mt-1">{message}</p></div></div></div><div className="p-4 bg-gray-50 border-t flex justify-end gap-3"><button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancel</button><button onClick={onConfirm} disabled={processing} className={`px-4 py-2 text-white rounded-lg ${colors[confirmColor]} disabled:opacity-50 flex items-center justify-center min-w-[100px]`}>{processing ? <Loader2 size={16} className="animate-spin" /> : confirmText}</button></div></div>
        </div>
    );
};

export default UniversityExamManager;

