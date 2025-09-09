import React, { useEffect, useMemo, useState } from 'react';
import {
    Book,
    Briefcase,
    CreditCard,
    ClipboardList,
    Clock,
    Download,
    Eye,
    Loader2,
    CornerDownLeft,
    X,
    ClipboardCheck,
    AlertCircle,
    FlaskConical
} from 'lucide-react';

// This is a placeholder for your actual API base URL
const BASE_API_URL = "https://your-api-base-url.com/api/v1";

// --- Mock API Data (for demonstration) ---
// This data would be fetched from your backend in a real application
const mockSubjects = [
    { id: 'cs101', name: 'Introduction to Computer Science', department: 'Computer Science', credits: 4, class: 'B.Tech - 1st Year (CS)' },
    { id: 'math202', name: 'Linear Algebra', department: 'Mathematics', credits: 3, class: 'B.Sc - 2nd Year (Math)' },
    { id: 'phy301', name: 'Quantum Mechanics', department: 'Physics', credits: 5, class: 'M.Sc - 1st Year (Physics)' },
    { id: 'eng101', name: 'English Composition', department: 'Humanities', credits: 2, class: 'B.A. - 1st Year (English)' },
    { id: 'cs201', name: 'Web Development', department: 'Computer Science', credits: 4, class: 'B.Tech - 2nd Year (CS)' },
];

const mockCourseDetails = {
    'cs101': {
        syllabus: [
            { id: 1, topic: 'Introduction to C++ and Programming Environments', classesToComplete: 2 },
            { id: 2, topic: 'Basic Data Types and Operators', classesToComplete: 3 },
            { id: 3, topic: 'Control Flow (if, else, switch)', classesToComplete: 3 },
            { id: 4, topic: 'Functions and Modularity', classesToComplete: 4 },
            { id: 5, topic: 'Arrays and Pointers', classesToComplete: 4 },
            { id: 6, topic: 'Introduction to OOP Concepts', classesToComplete: 5 },
            { id: 7, topic: 'Inheritance and Polymorphism', classesToComplete: 5 },
        ],
        schedule: [
            { day: 'Wednesday', time: '10:00 AM - 11:00 AM', venue: 'Room 101', type: 'Theory', topic: 'Course Introduction & C++ Setup' },
            { day: 'Friday', time: '11:00 AM - 12:00 PM', venue: 'Lab 205', type: 'Lab', topic: 'Lab 1: First C++ Program' },
            { day: 'Monday', time: '10:00 AM - 11:00 AM', venue: 'Room 101', type: 'Theory', topic: 'Variables & Basic Operators' },
            { day: 'Wednesday', time: '10:00 AM - 11:00 AM', venue: 'Room 101', type: 'Theory', topic: 'Data Types and Conversions' },
            { day: 'Friday', time: '11:00 AM - 12:00 PM', venue: 'Lab 205', type: 'Lab', topic: 'Lab 2: Simple Calculator Program' },
        ],
        syllabus_download_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    'math202': {
        syllabus: [
            { id: 1, topic: 'Systems of Linear Equations and Matrices', classesToComplete: 4 },
            { id: 2, topic: 'Determinants and Their Properties', classesToComplete: 3 },
            { id: 3, topic: 'Vector Spaces and Subspaces', classesToComplete: 5 },
            { id: 4, topic: 'Linear Transformations', classesToComplete: 5 },
        ],
        schedule: [
            { day: 'Tuesday', time: '09:00 AM - 10:00 AM', venue: 'Room 202', type: 'Theory', topic: 'Introduction to Systems of Equations' },
            { day: 'Thursday', time: '09:00 AM - 10:00 AM', venue: 'Room 202', type: 'Theory', topic: 'Gaussian Elimination Method' },
            { day: 'Tuesday', time: '09:00 AM - 10:00 AM', venue: 'Room 202', type: 'Theory', topic: 'Matrix Operations and Inverse Matrix' },
            { day: 'Thursday', time: '09:00 AM - 10:00 AM', venue: 'Room 202', type: 'Theory', topic: 'Rank of a Matrix' },
        ],
        syllabus_download_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    'phy301': {
        syllabus: [
            { id: 1, topic: 'The Schrödinger Equation', classesToComplete: 6 },
            { id: 2, topic: 'Quantum States and Operators', classesToComplete: 5 },
            { id: 3, topic: 'Particle in a Box Model', classesToComplete: 4 },
        ],
        schedule: [
            { day: 'Monday', time: '02:00 PM - 03:30 PM', venue: 'Lecture Hall A', type: 'Theory', topic: 'Origins of Quantum Theory' },
            { day: 'Wednesday', time: '02:00 PM - 03:30 PM', venue: 'Lecture Hall A', type: 'Theory', topic: 'The Time-Independent Schrödinger Equation' },
            { day: 'Monday', time: '02:00 PM - 03:30 PM', venue: 'Lecture Hall A', type: 'Theory', topic: 'Introduction to Operators' },
        ],
        syllabus_download_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    'eng101': {
        syllabus: [
            { id: 1, topic: 'Academic Essay Structure', classesToComplete: 3 },
            { id: 2, topic: 'Thesis Statements and Topic Sentences', classesToComplete: 3 },
            { id: 3, topic: 'Research and Citation Methods (MLA/APA)', classesToComplete: 4 },
        ],
        schedule: [
            { day: 'Tuesday', time: '11:00 AM - 12:00 PM', venue: 'Room 301', type: 'Theory', topic: 'Introduction to Academic Writing' },
            { day: 'Friday', time: '09:00 AM - 10:00 AM', venue: 'Room 301', type: 'Theory', topic: 'Crafting Strong Thesis Statements' },
            { day: 'Tuesday', time: '11:00 AM - 12:00 PM', venue: 'Room 301', type: 'Theory', topic: 'Using Transition Words' },
        ],
        syllabus_download_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    'cs201': {
        syllabus: [
            { id: 1, topic: 'HTML5 Fundamentals and Semantic Markup', classesToComplete: 4 },
            { id: 2, topic: 'CSS3 Layouts (Flexbox & Grid)', classesToComplete: 5 },
            { id: 3, topic: 'Introduction to JavaScript and DOM Manipulation', classesToComplete: 6 },
            { id: 4, topic: 'Working with APIs and Asynchronous JS', classesToComplete: 5 },
        ],
        schedule: [
            { day: 'Tuesday', time: '10:00 AM - 11:00 AM', venue: 'Room 105', type: 'Theory', topic: 'Intro to HTML5 & Basic Tags' },
            { day: 'Tuesday', time: '11:00 AM - 12:30 PM', venue: 'CS Lab 105', type: 'Lab', topic: 'Lab 1: Building a Static Page' },
            { day: 'Thursday', time: '10:00 AM - 11:00 AM', venue: 'Room 105', type: 'Theory', topic: 'Basic CSS Styling' },
            { day: 'Thursday', time: '11:00 AM - 12:30 PM', venue: 'CS Lab 105', type: 'Lab', topic: 'Lab 2: Flexbox Layouts' },
        ],
        syllabus_download_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
};

function CollegeFacultyCourses() {
    const [notification, setNotification] = useState(null);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [subjects, setSubjects] = useState([]);

    function showNotification(message, type = "success") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }

    // --- Data Fetching Logic (Simulated) ---
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoadingSubjects(true);
            try {
                // In a real app, this would be an API call to get all assigned subjects
                setTimeout(() => {
                    setSubjects(mockSubjects);
                    setLoadingSubjects(false);
                }, 1000);
            } catch (error) {
                setLoadingSubjects(false);
                showNotification("Failed to load subjects. Please refresh.", "error");
            }
        };
        fetchSubjects();
    }, []);

    const selectedSubject = useMemo(() => {
        return subjects.find(s => s.id === selectedSubjectId);
    }, [subjects, selectedSubjectId]);

    const selectedCourseDetails = useMemo(() => {
        return mockCourseDetails[selectedSubjectId] || { syllabus: [], schedule: [] };
    }, [selectedSubjectId]);

    return (
        <div className="min-h-screen p-6 bg-slate-50 font-sans">
            {notification && (
                <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {notification.type === "success" ? <ClipboardCheck size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/10"><X size={16} /></button>
                </div>
            )}

            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Briefcase size={28} className="text-blue-600" />
                Manage Courses
            </h1>

            {/* Subject Selection Grid */}
            {!selectedSubjectId ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Book size={20} className="text-slate-500" />
                            My Subjects
                        </h2>
                    </div>
                    <div className="p-6">
                        {loadingSubjects ? (
                            <div className="flex items-center gap-2 text-slate-500">
                                <Loader2 size={16} className="animate-spin" /> Loading subjects...
                            </div>
                        ) : subjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subjects.map(subject => (
                                    <button
                                        key={subject.id}
                                        onClick={() => setSelectedSubjectId(subject.id)}
                                        className="p-4 rounded-lg border-2 bg-white border-slate-200 hover:border-blue-300 transition-all text-left"
                                    >
                                        <h3 className="font-semibold text-base mb-1 text-slate-700">{subject.name}</h3>
                                        <p className="text-sm text-slate-500">{subject.department} | {subject.credits} Credits</p>
                                        <p className="text-xs text-slate-400 mt-2">Class: {subject.class}</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <Book size={32} className="mx-auto mb-2" />
                                No subjects assigned to you.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Detailed Course View */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <button onClick={() => setSelectedSubjectId(null)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100"><CornerDownLeft size={20} /></button>
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Book size={20} className="text-slate-500" />
                            {selectedSubject.name}
                        </h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Course Info & Download Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <h4 className="font-semibold text-blue-700">Department</h4>
                                    <p className="text-sm text-blue-900">{selectedSubject.department}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <h4 className="font-semibold text-blue-700">Credits</h4>
                                    <p className="text-sm text-blue-900">{selectedSubject.credits}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <h4 className="font-semibold text-blue-700">Class/Batch</h4>
                                    <p className="text-sm text-blue-900">{selectedSubject.class}</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <a href={selectedCourseDetails.syllabus_download_url} target="_blank" rel="noopener noreferrer" download
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors hover:bg-blue-700"
                                >
                                    <Download size={16} /> Download Syllabus
                                </a>
                            </div>
                        </div>

                        {/* Class Schedule Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-slate-500" />
                                Class Schedule
                            </h3>
                            <div className="bg-white rounded-md border border-slate-200 divide-y divide-slate-200 shadow-sm">
                                {selectedCourseDetails.schedule.length > 0 ? (
                                    selectedCourseDetails.schedule.map((slot, index) => {
                                        const isLab = slot.type === 'Lab';
                                        return (
                                            <div key={index} className={`flex items-start justify-between p-4 ${isLab ? 'bg-blue-50' : 'bg-white'}`}>
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-full ${isLab ? 'bg-blue-200' : 'bg-slate-200'}`}>
                                                        {isLab ? <FlaskConical size={16} className="text-blue-600" /> : <Clock size={16} className="text-slate-600" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-800">{slot.day}, {slot.time}</p>
                                                        <p className="text-xs text-slate-600 mt-1">{slot.venue}</p>
                                                        <p className="text-sm text-slate-700 mt-2">Topic: {slot.topic}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-slate-500 p-4 text-center">Class schedule not available.</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Syllabus & Pacing Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <ClipboardList size={20} className="text-slate-500" />
                                Syllabus & Pacing
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-md space-y-2">
                                {selectedCourseDetails.syllabus.length > 0 ? (
                                    selectedCourseDetails.syllabus.map((unit, index) => (
                                        <div key={unit.id} className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                                            <p className="text-sm text-slate-700">
                                                <span className="font-semibold">{unit.topic}</span>
                                                <span className="text-slate-500 block"> ({unit.classesToComplete} classes)</span>
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">Syllabus details not available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollegeFacultyCourses;