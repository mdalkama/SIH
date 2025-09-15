// FILE: ExamForm.jsx

import React, { useState, useCallback } from 'react';
import { PlusCircle, X, Loader2, Trash2, ArrowLeft } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/semester-exam';
const STATUSES = ['CREATED', 'OPEN_FOR_REGISTRATION', 'CLOSED', 'RESULT_PROCESSING', 'PUBLISHED'];

const FormInput = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input
            id={name} name={name} value={value ?? ""} onChange={onChange} {...props}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
    </div>
);
const FormSelect = ({ label, name, value, onChange, children, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select
            id={name} name={name} value={value ?? ""} onChange={onChange} {...props}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        >
            {children}
        </select>
    </div>
);


const ExamForm = ({ exam, onBack, addToast, onSaveSuccess, allCourses }) => {
    const [formData, setFormData] = useState({
        examId: exam?.examId || '',
        examName: exam?.examName || '',
        examType: exam?.examType || 'ENDSEM',
        semester: exam?.semester || '',
        year: exam?.year || new Date().getFullYear(),
        startDate: exam?.startDate?.split('T')[0] || '',
        endDate: exam?.endDate?.split('T')[0] || '',
        status: exam?.status || 'CREATED',
    });
    const [examCourses, setExamCourses] = useState(exam?.courses || []);
    const [isLoading, setIsLoading] = useState(false);

    const repopulateAllTimetables = useCallback((semester, currentCourses) => {
        if (!semester || !Array.isArray(allCourses) || allCourses.length === 0) return currentCourses;
        return currentCourses.map(course => {
            if (!course.courseCode) return course;
            const selectedCourseData = allCourses.find(c => c.courseId === course.courseCode);
            const semesterData = selectedCourseData?.semesters.find(s => String(s.semesterNumber) === String(semester));
            let newTimetable = [];
            if (semesterData) {
                newTimetable = semesterData.subjects.map(subject => ({
                    subjectCode: subject.code,
                    subjectName: subject.name,
                    examDate: '',
                    session: 'FN'
                }));
            }
            return { ...course, timetable: newTimetable };
        });
    }, [allCourses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'semester') {
            const newCourses = repopulateAllTimetables(value, examCourses);
            setExamCourses(newCourses);
        }
    };
    
    const handleCourseChange = (index, courseId) => {
        const newCourses = [...examCourses];
        const selectedCourseData = allCourses.find(c => c.courseId === courseId);
        let newTimetable = [];
        if (selectedCourseData && formData.semester) {
            const semesterData = selectedCourseData.semesters.find(s => String(s.semesterNumber) === String(formData.semester));
            if (semesterData) {
                newTimetable = semesterData.subjects.map(subject => ({
                    subjectCode: subject.code, subjectName: subject.name, examDate: '', session: 'FN'
                }));
            }
        }
        newCourses[index] = { courseCode: courseId, timetable: newTimetable };
        setExamCourses(newCourses);
    };

    const handleTimetableChange = (courseIndex, ttIndex, field, value) => {
        const newCourses = [...examCourses];
        newCourses[courseIndex].timetable[ttIndex][field] = value;
        setExamCourses(newCourses);
    };

    const addCourse = () => setExamCourses(prev => [...prev, { courseCode: '', timetable: [] }]);
    const removeCourse = (index) => setExamCourses(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const finalPayload = { ...formData, courses: examCourses };
        try {
            const url = exam ? `${API_BASE_URL}/${exam._id}` : API_BASE_URL;
            const method = exam ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(finalPayload), credentials: 'include' });
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
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-6 font-medium transition-colors"><ArrowLeft size={16} /> Back</button>
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="pb-6 border-b border-slate-200">
                    <h1 className="text-2xl font-bold text-slate-800">{exam ? 'Edit Exam' : 'Create New Exam'}</h1>
                    <p className="text-slate-500 mt-1">Fill in the examination details below.</p>
                </div>
                <fieldset className="mt-6">
                    <legend className="text-lg font-semibold text-slate-700 mb-4">Core Details</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2"><FormInput label="Exam Name" name="examName" value={formData.examName} onChange={handleChange} placeholder="e.g., B.Tech End Semester" required /></div>
                        <div><FormInput label="Exam ID" name="examId" value={formData.examId} onChange={handleChange} placeholder="e.g., ENDSEM-MAY-24" required /></div>
                        <div><FormSelect label="Exam Type" name="examType" value={formData.examType} onChange={handleChange}><option value="MIDSEM">MIDSEM</option><option value="ENDSEM">ENDSEM</option><option value="INTERNAL">INTERNAL</option><option value="PRACTICAL">PRACTICAL</option></FormSelect></div>
                        <div><FormInput label="Semester" name="semester" type="number" value={formData.semester} onChange={handleChange} placeholder="e.g., 4" required /></div>
                        <div><FormInput label="Year" name="year" type="number" value={formData.year} onChange={handleChange} placeholder="e.g., 2024" required /></div>
                        <div><FormInput label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} /></div>
                        <div><FormInput label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} /></div>
                        {exam && <div className="lg:col-span-4"><FormSelect label="Status" name="status" value={formData.status} onChange={handleChange}>{STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</FormSelect></div>}
                    </div>
                </fieldset>
                <fieldset className="mt-8 border-t border-slate-200 pt-6">
                    <legend className="text-lg font-semibold text-slate-700 mb-4">Course Timetables</legend>
                    <div className="space-y-4">
                        {examCourses.map((course, cIdx) => (
                            <div key={cIdx} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                                <div className="flex justify-between items-center mb-4">
                                    <FormSelect label={`Course ${cIdx + 1}`} name="courseCode" value={course.courseCode} onChange={(e) => handleCourseChange(cIdx, e.target.value)}>
                                        <option value="">-- Select Course --</option>
                                        {allCourses.map(c => <option key={c.courseId} value={c.courseId}>{c.branch} ({c.degree})</option>)}
                                    </FormSelect>
                                    <button type="button" onClick={() => removeCourse(cIdx)} className="mt-6 ml-4 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                                </div>
                                {course.timetable && course.timetable.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        <div className="hidden md:grid grid-cols-10 gap-2 text-xs font-medium text-slate-500 px-2">
                                            <div className="col-span-6">Subject</div><div className="col-span-3">Exam Date</div><div className="col-span-1">Session</div>
                                        </div>
                                        {course.timetable.map((tt, tIdx) => (
                                            <div key={tIdx} className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center">
                                                <div className="md:col-span-6 p-2 border border-slate-200 rounded-md bg-white text-sm">{tt.subjectName} <span className="text-slate-400 font-mono">({tt.subjectCode})</span></div>
                                                <input type="date" value={tt.examDate?.split('T')[0] || ''} onChange={e => handleTimetableChange(cIdx, tIdx, 'examDate', e.target.value)} className="md:col-span-3 p-2 border border-slate-300 rounded-lg" />
                                                <select value={tt.session} onChange={e => handleTimetableChange(cIdx, tIdx, 'session', e.target.value)} className="md:col-span-1 p-2 border border-slate-300 rounded-lg bg-white"><option value="FN">FN</option><option value="AN">AN</option></select>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addCourse} className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"><PlusCircle size={16} /> Add Course Timetable</button>
                </fieldset>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                    <button type="button" onClick={onBack} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg disabled:bg-indigo-300 flex items-center font-semibold transition-colors hover:bg-indigo-700">{isLoading ? <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</> : (exam ? 'Update Exam' : 'Create Exam')}</button>
                </div>
            </form>
        </div>
    );
};

export default ExamForm;