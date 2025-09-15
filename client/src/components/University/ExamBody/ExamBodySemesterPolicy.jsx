import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, PlusCircle, Eye, Edit, Trash2, ArrowLeft, BookOpen, Info, CheckCircle, AlertTriangle, X, ChevronRight, ChevronLeft } from 'lucide-react';
import ExamForm from './components/ExamForm'; // <-- IMPORT THE SEPARATE FORM COMPONENT

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';
const COURSES_API_URL = 'https://sih-4ptm.onrender.com/api/v1/course';

// Status Constants
const STATUSES = ['CREATED', 'OPEN_FOR_REGISTRATION', 'CLOSED', 'RESULT_PROCESSING', 'PUBLISHED'];

// --- Main Component ---
const UniversityExamManager = () => {
    const [view, setView] = useState('list');
    const [allCourses, setAllCourses] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [editingExam, setEditingExam] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
    }, []);

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await fetch(COURSES_API_URL, { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch courses list');
                const data = await response.json();
                setAllCourses(Array.isArray(data) ? data : []);
            } catch (err) {
                addToast('error', err.message);
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchAllCourses();
    }, [addToast]);

    const refreshExamList = () => setView('list');

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
            setView('list');
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
        return <div className="flex justify-center items-center h-screen bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    }

    return (
        <div className="min-h-screen font-sans">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <main className="">
                {view === 'details' && <ExamDetailView exam={selectedExam} onBack={handleBackToList} />}
                {view === 'form' && <ExamForm exam={editingExam} onBack={handleBackToList} addToast={addToast} onSaveSuccess={refreshExamList} allCourses={allCourses} />}
                {view === 'list' && <ExamListView onShowForm={handleShowForm} addToast={addToast} onViewDetails={handleViewDetails} />}
            </main>
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
                setExams([]);
            } finally {
                setIsLoading(false);
            }
        };
        const timer = setTimeout(() => fetchExams(), 300); // Debounce search
        return () => clearTimeout(timer);
    }, [pagination.currentPage, rowsPerPage, searchTerm, addToast]);

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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <DataTableToolbar onSearchChange={setSearchTerm} onAddClick={() => onShowForm(null)} />
            <div className="overflow-x-auto">
                {isLoading ? <div className="p-10 text-center flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div> :
                    (exams.length > 0 ?
                        <ExamsTable exams={exams} onEdit={onShowForm} onDelete={setDeletingExam} onStatusUpdate={handleStatusUpdate} onViewDetails={onViewDetails} currentPage={pagination.currentPage} pageSize={rowsPerPage} />
                        :
                        <div className="text-center p-16 text-slate-500">
                            <h3 className="text-lg font-semibold">No Exams Found</h3>
                            <p className="mt-1">Try adjusting your search or add a new exam.</p>
                        </div>
                    )
                }
            </div>
            <Pagination currentPage={pagination.currentPage} totalCount={pagination.totalDocs} pageSize={rowsPerPage} onPageChange={(page) => setPagination(p => ({ ...p, currentPage: page }))} onPageSizeChange={setRowsPerPage} />
            {deletingExam && <ConfirmationModal isOpen={!!deletingExam} onClose={() => setDeletingExam(null)} onConfirm={handleDelete} title="Confirm Deletion" message={`Are you sure you want to delete ${deletingExam.examName}? This action cannot be undone.`} confirmText="Delete" confirmColor="red" processing={isLoading} />}
        </div>
    );
};


// --- Detail View ---
const ExamDetailView = ({ exam, onBack }) => (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-6 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Exam List
        </button>
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{exam.examName}</h1>
                    <p className="text-slate-500 mt-2 font-mono text-sm">{exam.examId} | Semester {exam.semester}, {exam.year}</p>
                </div>
                <StatusBadge status={exam.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-sm border-t border-slate-200 pt-6">
                <div><p className="text-slate-500 mb-1">Type</p><p className="font-semibold text-slate-700">{exam.examType}</p></div>
                <div><p className="text-slate-500 mb-1">Starts</p><p className="font-semibold text-slate-700">{new Date(exam.startDate).toLocaleDateString('en-GB')}</p></div>
                <div><p className="text-slate-500 mb-1">Ends</p><p className="font-semibold text-slate-700">{new Date(exam.endDate).toLocaleDateString('en-GB')}</p></div>
                <div><p className="text-slate-500 mb-1">Registrations</p><p className="font-semibold text-slate-700">{exam.registeredStudents || 0}</p></div>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Course Timetables</h2>
        <div className="space-y-6">
            {exam.courses && exam.courses.length > 0 ? exam.courses.map(course => (
                <div key={course.courseCode || course._id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b flex items-center gap-3">
                        <BookOpen size={20} className="text-indigo-600" />
                        <h3 className="font-semibold text-slate-800">{course.courseCode}</h3>
                    </div>
                    <Timetable course={course} />
                </div>
            )) : <div className="text-slate-500 bg-white p-8 rounded-xl border text-center">No courses or timetables available for this exam.</div>}
        </div>
    </div>
);


// --- Form View ---
// const ExamForm = ({ exam, onBack, addToast, onSaveSuccess, allCourses }) => {
//     const [formData, setFormData] = useState({
//         examId: exam?.examId || '', examName: exam?.examName || '', examType: exam?.examType || 'ENDSEM',
//         semester: exam?.semester || '', year: exam?.year || new Date().getFullYear(),
//         startDate: exam?.startDate?.split('T')[0] || '', endDate: exam?.endDate?.split('T')[0] || '',
//         status: exam?.status || 'CREATED', courses: exam?.courses || []
//     });
//     const [isLoading, setIsLoading] = useState(false);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     useEffect(() => {
//         if (formData.courses.length > 0 && formData.semester && allCourses.length > 0) {
//             const updatedCourses = formData.courses.map(course => {
//                 if (!course.courseCode) return course;
//                 const selectedCourseData = allCourses.find(c => c.courseId === course.courseCode);
//                 const semesterData = selectedCourseData?.semesters.find(s => s.semesterNumber == formData.semester);
//                 let newTimetable = course.timetable || [];
//                 if (semesterData) {
//                     const existingSubjects = new Set(newTimetable.map(t => t.subjectCode));
//                     const subjectsFromCourse = semesterData.subjects
//                         .filter(sub => !existingSubjects.has(sub.code))
//                         .map(subject => ({ subjectCode: subject.code, subjectName: subject.name, examDate: '', session: 'FN' }));
//                     newTimetable = [...newTimetable, ...subjectsFromCourse];
//                 }
//                 return { ...course, timetable: newTimetable };
//             });
//             setFormData(prev => ({ ...prev, courses: updatedCourses }));
//         }
//     }, [formData.semester, allCourses, formData.courses.length]);

//     const handleCourseChange = (index, courseId) => { /* ... (logic unchanged) */ };
//     const handleTimetableChange = (courseIndex, ttIndex, field, value) => { /* ... (logic unchanged) */ };
//     const addCourse = () => setFormData({ ...formData, courses: [...formData.courses, { courseCode: '', timetable: [] }] });
//     const removeCourse = (index) => setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== index) });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             const url = exam ? `${API_BASE_URL}/${exam._id}` : API_BASE_URL;
//             const method = exam ? 'PUT' : 'POST';
//             const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), credentials: 'include' });
//             if (!response.ok) {
//                 const errData = await response.json();
//                 throw new Error(errData.message || `Failed to ${exam ? 'update' : 'create'} exam.`);
//             }
//             addToast('success', `Exam ${exam ? 'updated' : 'created'} successfully!`);
//             onSaveSuccess();
//         } catch (err) {
//             addToast('error', err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const FormInput = ({ label, name, ...props }) => (
//         <div>
//             <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
//             <input name={name} id={name} {...props} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
//         </div>
//     );
//     const FormSelect = ({ label, name, children, ...props }) => (
//         <div>
//             <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
//             <select name={name} id={name} {...props} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
//                 {children}
//             </select>
//         </div>
//     );

//     return (
//         <div className="animate-fade-in">
//             <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-6 font-medium transition-colors"><ArrowLeft size={16} /> Back</button>
//             <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
//                 <div className="pb-6 border-b border-slate-200">
//                     <h1 className="text-2xl font-bold text-slate-800">{exam ? 'Edit Exam' : 'Create New Exam'}</h1>
//                     <p className="text-slate-500 mt-1">Fill in the examination details below.</p>
//                 </div>

//                 <fieldset className="mt-6">
//                     <legend className="text-lg font-semibold text-slate-700 mb-4">Core Details</legend>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         <div className="lg:col-span-2"><FormInput label="Exam Name" name="examName" value={formData.examName} onChange={handleChange} placeholder="e.g., B.Tech End Semester" required /></div>
//                         <div><FormInput label="Exam ID" name="examId" value={formData.examId} onChange={handleChange} placeholder="e.g., ENDSEM-MAY-24" required /></div>
//                         <div><FormSelect label="Exam Type" name="examType" value={formData.examType} onChange={handleChange}><option>MIDSEM</option><option>ENDSEM</option><option>INTERNAL</option><option>PRACTICAL</option></FormSelect></div>
//                         <div><FormInput label="Semester" name="semester" type="number" value={formData.semester} onChange={handleChange} placeholder="e.g., 4" required /></div>
//                         <div><FormInput label="Year" name="year" type="number" value={formData.year} onChange={handleChange} placeholder="e.g., 2024" required /></div>
//                         <div><FormInput label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} /></div>
//                         <div><FormInput label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} /></div>
//                         {exam && <div className="lg:col-span-4"><FormSelect label="Status" name="status" value={formData.status} onChange={handleChange}>{STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</FormSelect></div>}
//                     </div>
//                 </fieldset>

//                 <fieldset className="mt-8 border-t border-slate-200 pt-6">
//                     <legend className="text-lg font-semibold text-slate-700 mb-4">Course Timetables</legend>
//                     <div className="space-y-4">
//                         {formData.courses.map((course, cIdx) => (
//                             <div key={cIdx} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
//                                 <div className="flex justify-between items-center mb-4">
//                                     <FormSelect label={`Course ${cIdx + 1}`} name="courseCode" value={course.courseCode} onChange={(e) => handleCourseChange(cIdx, e.target.value)}>
//                                         <option value="">-- Select Course --</option>
//                                         {allCourses.map(c => <option key={c.courseId} value={c.courseId}>{c.branch} ({c.degree})</option>)}
//                                     </FormSelect>
//                                     <button type="button" onClick={() => removeCourse(cIdx)} className="mt-6 ml-4 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
//                                 </div>
//                                 {course.timetable && course.timetable.length > 0 && (
//                                     <div className="space-y-2 mt-2">
//                                         <div className="hidden md:grid grid-cols-10 gap-2 text-xs font-medium text-slate-500 px-2">
//                                             <div className="col-span-6">Subject</div><div className="col-span-3">Exam Date</div><div className="col-span-1">Session</div>
//                                         </div>
//                                         {course.timetable.map((tt, tIdx) => (
//                                             <div key={tIdx} className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center">
//                                                 <div className="md:col-span-6 p-2 border border-slate-200 rounded-md bg-white text-sm">{tt.subjectName} <span className="text-slate-400 font-mono">({tt.subjectCode})</span></div>
//                                                 <input type="date" value={tt.examDate?.split('T')[0] || ''} onChange={e => handleTimetableChange(cIdx, tIdx, 'examDate', e.target.value)} className="md:col-span-3 p-2 border border-slate-300 rounded-lg" />
//                                                 <select value={tt.session} onChange={e => handleTimetableChange(cIdx, tIdx, 'session', e.target.value)} className="md:col-span-1 p-2 border border-slate-300 rounded-lg bg-white"><option value="FN">FN</option><option value="AN">AN</option></select>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                     <button type="button" onClick={addCourse} className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
//                         <PlusCircle size={16} /> Add Course Timetable
//                     </button>
//                 </fieldset>

//                 <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
//                     <button type="button" onClick={onBack} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors">Cancel</button>
//                     <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg disabled:bg-indigo-300 flex items-center font-semibold transition-colors hover:bg-indigo-700">
//                         {isLoading ? <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</> : (exam ? 'Update Exam' : 'Create Exam')}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };


// --- Child & Helper Components (Restyled) ---
const DataTableToolbar = ({ onSearchChange, onAddClick }) => (
    <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200">
        
        <div className="flex items-center justify-between  gap-4 w-full ">
            <div className="relative flex-grow md:flex-grow-0">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" onChange={e => onSearchChange(e.target.value)} placeholder="Search by name or ID..." className="pl-10 pr-4 py-2 w-full md:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
            </div>
            <button onClick={onAddClick} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-sm">
                <PlusCircle size={18} /> Add New Exam
            </button>
        </div>
    </div>
);

const ExamsTable = ({ exams, onEdit, onDelete, onStatusUpdate, currentPage, pageSize, onViewDetails }) => (
    <table className="w-full text-sm">
        <thead className="text-left text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
                <th className="px-6 py-4 font-semibold">#</th>
                <th className="px-6 py-4 font-semibold">Exam Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Semester/Year</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {exams.map((exam, index) => (
                <tr key={exam._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{String((currentPage - 1) * pageSize + index + 1).padStart(2, '0')}</td>
                    <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{exam.examName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-1">{exam.examId}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{exam.examType}</td>
                    <td className="px-6 py-4 text-slate-600">Sem {exam.semester}, {exam.year}</td>
                    <td className="px-6 py-4 text-center"><StatusSelector exam={exam} onUpdate={onStatusUpdate} /></td>
                    <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={() => onViewDetails(exam._id)} className="text-slate-400 hover:text-green-600 transition-colors" title="View Details"><Eye size={18} /></button>
                            <button onClick={() => onEdit(exam)} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Edit"><Edit size={18} /></button>
                            <button onClick={() => onDelete(exam)} className="text-slate-400 hover:text-rose-600 transition-colors" title="Delete"><Trash2 size={18} /></button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const StatusSelector = ({ exam, onUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [nextStatus, setNextStatus] = useState('');
    const styles = { 'CREATED': 'bg-slate-100 text-slate-700', 'OPEN_FOR_REGISTRATION': 'bg-sky-100 text-sky-700', 'CLOSED': 'bg-rose-100 text-rose-700', 'RESULT_PROCESSING': 'bg-amber-100 text-amber-700', 'PUBLISHED': 'bg-emerald-100 text-emerald-700' };
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
    if (isUpdating) return <div className="flex justify-center items-center"><Loader2 size={16} className="animate-spin text-indigo-600" /></div>;
    return (
        <>
            <select value={exam.status} onChange={handleChange} className={`px-3 py-1 text-xs font-semibold rounded-full border-none outline-none appearance-none cursor-pointer ${styles[exam.status]}`} style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <ConfirmationModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleConfirm} title="Confirm Status Change" message={`Change status to "${nextStatus.replace(/_/g, ' ')}"?`} confirmText="Confirm" />
        </>
    );
};

const Timetable = ({ course }) => (
    <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="text-left text-xs text-slate-500 uppercase bg-slate-100">
            <tr><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Session</th><th className="px-4 py-3 font-semibold">Subject</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {course.timetable && course.timetable.length > 0 ? course.timetable.map(slot => (
                <tr key={slot.subjectCode || slot._id}><td className="px-4 py-3 w-48 font-medium text-slate-600">{slot.examDate ? new Date(slot.examDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : <span className="text-slate-400">Not set</span>}</td><td className="px-4 py-3 w-32 text-slate-600">{slot.session === 'FN' ? 'Forenoon' : 'Afternoon'}</td><td className="px-4 py-3"><p className="font-semibold text-slate-800">{slot.subjectName}</p><p className="text-xs text-slate-500 font-mono">{slot.subjectCode}</p></td></tr>
            )) : (<tr><td colSpan="3" className="text-center p-6 text-slate-500">No timetable entries found.</td></tr>)}
        </tbody>
    </table></div>
);

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange }) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (totalCount === 0) return null;
    return (
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 border-t border-slate-200">
            <div className="flex items-center gap-2"><span>Rows per page:</span><select value={pageSize} onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }} className="p-1.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-indigo-500 outline-none"><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></div>
            <p className="font-medium">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"><ChevronLeft size={16} /></button>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"><ChevronRight size={16} /></button>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = { 'CREATED': 'bg-slate-100 text-slate-700', 'OPEN_FOR_REGISTRATION': 'bg-sky-100 text-sky-700', 'CLOSED': 'bg-rose-100 text-rose-700', 'RESULT_PROCESSING': 'bg-amber-100 text-amber-700', 'PUBLISHED': 'bg-emerald-100 text-emerald-700' };
    return <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${styles[status] || 'bg-slate-100'}`}>{status ? status.replace(/_/g, ' ') : 'UNKNOWN'}</span>;
};

const Toast = ({ message, type, onClose }) => {
    const icons = { success: <CheckCircle className="text-emerald-500" />, error: <AlertTriangle className="text-rose-500" />, info: <Info className="text-sky-500" /> };
    return (<div className="bg-white shadow-lg rounded-lg p-4 flex items-start gap-4 w-96 animate-fade-in-right border-l-4 border-emerald-500" style={{borderColor: type === 'error' ? '#f43f5e' : type === 'info' ? '#0ea5e9' : '#10b981'}}><div className="flex-shrink-0">{icons[type]}</div><p className="flex-1 text-sm text-slate-700 font-medium">{message}</p><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button></div>);
};

const ToastContainer = ({ toasts, setToasts }) => {
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return (<div className="fixed top-6 right-6 z-[100] space-y-3"> {toasts.map(toast => (<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />))} </div>);
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'indigo', processing }) => {
    if (!isOpen) return null;
    const colors = { red: 'bg-rose-600 hover:bg-rose-700', indigo: 'bg-indigo-600 hover:bg-indigo-700' };
    const iconColors = { red: 'bg-rose-100 text-rose-600', indigo: 'bg-indigo-100 text-indigo-600'};
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconColors[confirmColor]}`}><AlertTriangle size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                            <p className="text-sm text-slate-500 mt-2">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} disabled={processing} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 font-semibold">Cancel</button>
                    <button onClick={onConfirm} disabled={processing} className={`px-4 py-2 text-white rounded-lg ${colors[confirmColor]} disabled:opacity-50 flex items-center justify-center min-w-[100px] font-semibold`}>
                        {processing ? <Loader2 size={18} className="animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UniversityExamManager;