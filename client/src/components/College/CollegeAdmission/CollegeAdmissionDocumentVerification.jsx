import React, { useState } from 'react';
import { Loader2, Search, X, Check, Eye, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

// --- SKELETON LOADER ---
const SkeletonLoader = () => (
    <div className="animate-pulse mt-8">
        <div className="bg-white rounded-xl border p-6">
            <div className="h-6 w-1/3 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
            <div className="mt-6 border-t pt-6 space-y-4">
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const CollegeAdmissionDocumentVerification = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError('');
        setStudentData(null);

        // Simulate API call
        setTimeout(() => {
            if (searchTerm === '2024CSE001') {
                setStudentData({
                    name: 'Anjali Sharma',
                    regNo: '2024CSE001',
                    course: 'B.Tech CSE'
                });
                setDocuments([
                    { id: 1, name: '10th Marksheet', status: 'Verified', url: '#' },
                    { id: 2, name: '12th Marksheet', status: 'Pending', url: '#' },
                    { id: 3, name: 'Aadhar Card', status: 'Pending', url: '#' },
                    { id: 4, name: 'Transfer Certificate (TC)', status: 'Rejected', reason: 'Illegible scan', url: '#' },
                    { id: 5, name: 'Caste Certificate', status: 'Verified', url: '#' },
                ]);
            } else {
                setError('No student found with that registration number.');
            }
            setLoading(false);
        }, 1500);
    };

    const handleUpdateStatus = (docId, newStatus) => {
        setDocuments(docs => docs.map(doc => 
            doc.id === docId ? { ...doc, status: newStatus } : doc
        ));
    };
    
    const clearSearch = () => {
        setSearchTerm('');
        setStudentData(null);
        setError('');
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Verified': return { color: 'text-green-600 bg-green-50', icon: CheckCircle };
            case 'Rejected': return { color: 'text-red-600 bg-red-50', icon: X };
            default: return { color: 'text-amber-600 bg-amber-50', icon: AlertTriangle };
        }
    };

    return (
        <div className="font-sans">

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:flex-grow">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter Student Registration Number..."
                            className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg"
                        />
                        {searchTerm && <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>}
                    </div>
                    <button type="submit" disabled={loading} className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search Student'}
                    </button>
                </form>
                {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
            </div>

            {loading && <SkeletonLoader />}

            {studentData && !loading && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-slate-800">{studentData.name}</h2>
                        <p className="text-sm text-slate-500">{studentData.regNo} - {studentData.course}</p>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {documents.map(doc => {
                            const statusInfo = getStatusInfo(doc.status);
                            return (
                                <div key={doc.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="font-semibold text-slate-700">{doc.name}</p>
                                            {doc.status === 'Rejected' && <p className="text-xs text-red-500">Reason: {doc.reason}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${statusInfo.color}`}>
                                            <statusInfo.icon size={14} />
                                            {doc.status}
                                        </span>
                                        <div className="flex gap-1">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:bg-slate-200 rounded-md" title="View Document">
                                                <Eye size={16} />
                                            </a>
                                            <button onClick={() => handleUpdateStatus(doc.id, 'Verified')} className="p-2 text-green-500 hover:bg-green-100 rounded-md" title="Approve">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => handleUpdateStatus(doc.id, 'Rejected')} className="p-2 text-red-500 hover:bg-red-100 rounded-md" title="Reject">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollegeAdmissionDocumentVerification;