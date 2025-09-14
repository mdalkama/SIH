import React, { useEffect, useMemo, useState } from 'react';
import {
    Book,
    UploadCloud,
    FileText,
    File,
    Download,
    Eye, // New Icon for Viewing
    Pencil,
    Trash2,
    Plus,
    X,
    ClipboardCheck,
    AlertCircle,
    Loader2,
    CornerDownLeft
} from 'lucide-react';

// This is a placeholder for your actual API base URL
const BASE_API_URL = "https://your-api-base-url.com/api/v1";

// --- Mock API Data (for demonstration) ---
const mockSubjects = [
    { id: 'cs101', name: 'Introduction to Computer Science', class: 'B.Tech - 1st Year (CS)' },
    { id: 'math202', name: 'Linear Algebra', class: 'B.Sc - 2nd Year (Math)' },
    { id: 'phy301', name: 'Quantum Mechanics', class: 'M.Sc - 1st Year (Physics)' },
    { id: 'cs201', name: 'Web Development', class: 'B.Tech - 2nd Year (CS)' },
];

const mockResources = {
    'cs101': {
        assignments: [
            { id: 'ass1', title: 'OOPs Concepts', description: 'Covers classes, objects, inheritance, and polymorphism.', dueDate: '2025-10-15', filename: 'assignment1.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            { id: 'ass2', title: 'Data Structures', description: 'Implement stacks and queues using arrays.', dueDate: '2025-11-20', filename: 'assignment2.docx', url: 'https://file-examples.com/wp-content/storage/2017/10/file-example_word_1MB.docx' },
            { id: 'ass3', title: 'Algorithm Analysis', description: 'Analyze the time complexity of sorting algorithms.', dueDate: '2025-12-05', filename: 'algo_assign.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
        materials: [
            { id: 'mat1', title: 'Unit 1 Lecture Notes', description: 'Notes on fundamental programming concepts.', filename: 'unit1_notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            { id: 'mat2', title: 'Advanced C++ E-book', description: 'A reference book for advanced topics in C++.', filename: 'adv_cpp.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            { id: 'mat3', title: 'Data Structures Slides', description: 'PowerPoint slides for the Data Structures module.', filename: 'ds_slides.pptx', url: 'https://file-examples.com/wp-content/storage/2017/10/file_example_PPT_1MB.ppt' },
        ]
    },
    'math202': {
        assignments: [
            { id: 'ass4', title: 'Vectors and Matrices', description: 'Problems on vector spaces and matrix transformations.', dueDate: '2025-10-30', filename: 'math_assign1.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            { id: 'ass5', title: 'Eigenvalues and Eigenvectors', description: 'Solve problems involving eigenvalues and eigenvectors.', dueDate: '25-11-25', filename: 'eigen_assign.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
        materials: [
            { id: 'mat4', title: 'Calculus Review Slides', description: 'A quick refresher on calculus topics.', filename: 'calculus_slides.pptx', url: 'https://file-examples.com/wp-content/storage/2017/10/file_example_PPT_1MB.ppt' },
            { id: 'mat5', title: 'Linear Algebra Textbook', description: 'PDF of the recommended textbook.', filename: 'lin_alg_book.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ]
    },
    'phy301': {
        assignments: [
            { id: 'ass6', title: 'Wave-Particle Duality', description: 'A short essay on the concept of wave-particle duality.', dueDate: '2025-10-20', filename: 'physics_assign1.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
        materials: [
            { id: 'mat6', title: 'Lecture Notes Unit 1-3', description: 'Comprehensive notes for the first three units.', filename: 'unit1-3_notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ]
    },
    'cs201': {
        assignments: [
            { id: 'ass7', title: 'HTML & CSS Layouts', description: 'Create a responsive web page using flexbox and grid.', dueDate: '2025-11-10', filename: 'web_dev_assign1.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            { id: 'ass8', title: 'JavaScript DOM Manipulation', description: 'Build a simple to-do list application with JavaScript.', dueDate: '2025-12-01', filename: 'js_assign.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
        materials: [
            { id: 'mat7', title: 'Web Dev Basics Slides', description: 'Introductory slides covering HTML, CSS, and JS.', filename: 'web_dev_basics.pptx', url: 'https://file-examples.com/wp-content/storage/2017/10/file_example_PPT_1MB.ppt' },
            { id: 'mat8', title: 'React.js Documentation Links', description: 'A list of essential links for learning React.', filename: 'react_links.txt', url: 'https://file-examples.com/wp-content/storage/2017/10/file-example_txt_1MB.txt' },
        ]
    }
};

function CollegeFacultyAssignments() {
    const [notification, setNotification] = useState(null);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' or 'materials'

    const [assignments, setAssignments] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [form, setForm] = useState({ title: '', description: '', dueDate: '', file: null });

    function showNotification(message, type = "success") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }

    // --- Data Fetching Logic (Simulated) ---
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoadingSubjects(true);
            try {
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

    useEffect(() => {
        if (selectedSubjectId) {
            const subjectResources = mockResources[selectedSubjectId] || { assignments: [], materials: [] };
            setAssignments(subjectResources.assignments);
            setMaterials(subjectResources.materials);
        } else {
            setAssignments([]);
            setMaterials([]);
        }
    }, [selectedSubjectId]);

    // --- Handlers ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, file: file }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!form.title || !form.file) {
            showNotification("Title and file are required.", "error");
            return;
        }

        setUploading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newResource = {
                id: Date.now().toString(),
                title: form.title,
                description: form.description,
                dueDate: form.dueDate,
                filename: form.file.name,
                url: URL.createObjectURL(form.file), // A real-time temporary URL for preview
            };

            if (activeTab === 'assignments') {
                setAssignments(prev => [...prev, newResource]);
            } else {
                setMaterials(prev => [...prev, newResource]);
            }

            setForm({ title: '', description: '', dueDate: '', file: null });
            showNotification(`New ${activeTab === 'assignments' ? 'assignment' : 'material'} uploaded!`);
        } catch (error) {
            showNotification(`Failed to upload.`, "error");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (resourceId, type) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            if (type === 'assignments') {
                setAssignments(prev => prev.filter(a => a.id !== resourceId));
            } else {
                setMaterials(prev => prev.filter(m => m.id !== resourceId));
            }
            showNotification("File deleted successfully.");
        }
    };

    const currentSubject = useMemo(() => subjects.find(s => s.id === selectedSubjectId), [subjects, selectedSubjectId]);

    const getStatusBadge = (dueDate) => {
        if (!dueDate) return null;
        const now = new Date();
        const due = new Date(dueDate);
        const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) return <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs font-medium">Overdue</span>;
        if (diffDays <= 7) return <span className="text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full text-xs font-medium">Due Soon</span>;
        return <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-full text-xs font-medium">Open</span>;
    };

    return (
        <div className="min-h-screen font-sans">
            {notification && (
                <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {notification.type === "success" ? <ClipboardCheck size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/10"><X size={16} /></button>
                </div>
            )}

            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <FileText size={28} className="text-blue-600" />
                Assignment & Study Material
            </h1>

            {/* Step 1: Subject Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Book size={20} className="text-slate-500" />
                        Select Subject
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
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${selectedSubjectId === subject.id ? "bg-blue-50 border-blue-600 ring-4 ring-blue-100" : "bg-white border-slate-200 hover:border-blue-300"}`}
                                >
                                    <h3 className={`font-semibold text-base mb-1 ${selectedSubjectId === subject.id ? "text-blue-800" : "text-slate-700"}`}>{subject.name}</h3>
                                    <p className="text-sm text-slate-500">{subject.class}</p>
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

            {/* Content Manager */}
            {selectedSubjectId && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedSubjectId(null)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100"><CornerDownLeft size={20} /></button>
                            <h2 className="text-lg font-semibold text-slate-800">
                                {currentSubject.name}
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('assignments')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'assignments' ? 'bg-blue-600 text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
                            >
                                Assignments
                            </button>
                            <button
                                onClick={() => setActiveTab('materials')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'materials' ? 'bg-blue-600 text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
                            >
                                Study Materials
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Upload Form */}
                        <div className="border border-dashed border-slate-300 rounded-lg p-6 mb-6">
                            <form onSubmit={handleUpload} className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <Plus size={18} className="text-slate-500" />
                                    Upload New {activeTab === 'assignments' ? 'Assignment' : 'Study Material'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Title</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                            placeholder="Enter title"
                                            required
                                        />
                                    </div>
                                    {activeTab === 'assignments' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Due Date</label>
                                            <input
                                                type="date"
                                                value={form.dueDate}
                                                onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                        rows="3"
                                        placeholder="Add a brief description or instructions"
                                    ></textarea>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center p-3 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
                                        <FileText size={20} className="mr-2 text-slate-500" />
                                        <span className="text-sm text-slate-600">
                                            {form.file ? form.file.name : "Choose File"}
                                        </span>
                                        <input type="file" className="hidden" onChange={handleFileChange} required />
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className={`px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors ${uploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                                    >
                                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                                        {uploading ? "Uploading..." : "Upload"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Resources List */}
                        <div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                {activeTab === 'assignments' ? 'Uploaded Assignments' : 'Uploaded Study Materials'}
                            </h3>
                            <div className="grid gap-4">
                                {activeTab === 'assignments' && (assignments.length > 0 ? assignments.map(resource => (
                                    <div key={resource.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <File size={24} className="text-slate-500 mt-1" />
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{resource.title}</h4>
                                                <p className="text-sm text-slate-600">{resource.description}</p>
                                                {resource.dueDate && (
                                                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                                                        <span>Due: {new Date(resource.dueDate).toLocaleDateString()}</span>
                                                        {getStatusBadge(resource.dueDate)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-slate-500 hover:bg-slate-100" title="View"><Eye size={18} /></a>
                                            <a href={resource.url} download className="p-2 rounded-md text-slate-500 hover:bg-slate-100" title="Download"><Download size={18} /></a>
                                            <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100" title="Edit"><Pencil size={18} /></button>
                                            <button onClick={() => handleDelete(resource.id, 'assignments')} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-red-600" title="Delete"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                )) : <div className="text-center text-slate-500 py-12">No assignments uploaded yet.</div>)}

                                {activeTab === 'materials' && (materials.length > 0 ? materials.map(resource => (
                                    <div key={resource.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <File size={24} className="text-slate-500 mt-1" />
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{resource.title}</h4>
                                                <p className="text-sm text-slate-600">{resource.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-slate-500 hover:bg-slate-100" title="View"><Eye size={18} /></a>
                                            <a href={resource.url} download className="p-2 rounded-md text-slate-500 hover:bg-slate-100" title="Download"><Download size={18} /></a>
                                            <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100" title="Edit"><Pencil size={18} /></button>
                                            <button onClick={() => handleDelete(resource.id, 'materials')} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-red-600" title="Delete"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                )) : <div className="text-center text-slate-500 py-12">No study materials uploaded yet.</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollegeFacultyAssignments;