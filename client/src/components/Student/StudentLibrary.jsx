import React, { useState, useEffect } from 'react';
import { Book, Search, User, Clock, AlertCircle, CheckCircle, BookOpen, CreditCard, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

// --- Helper Components ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-xl bg-${color}-50`}>
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-sm font-medium text-${color}-600`}>{title}</p>
                <p className={`text-3xl font-bold text-${color}-800`}>{value}</p>
            </div>
            <Icon className={`w-9 h-9 text-${color}-500`} />
        </div>
    </div>
);

const BookCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full w-full my-4"></div>
        <div className="flex justify-between items-center mt-4">
             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);

const LibraryDashboard = () => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    
    const [studentProfile, setStudentProfile] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [libraryHistory, setLibraryHistory] = useState([]);
    const [libraryCatalog, setLibraryCatalog] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true); setError(null);
            try {
                const profileRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/student-library/my-profile`, { credentials: 'include' });
                if (!profileRes.ok) { const err = await profileRes.json(); throw new Error(err.message || 'Failed to fetch profile.'); }
                const profileData = await profileRes.json();
                
                if (profileData.success) {
                    setStudentProfile(profileData.data.profile);
                    setBorrowedBooks(profileData.data.issuedBooks);
                    setLibraryHistory(profileData.data.activity);
                    const collegeCode = profileData.data.profile.collegeCode;
                    if (collegeCode) {
                        const catalogRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/student-library/student-catalog`, { credentials: 'include' });
                        if (!catalogRes.ok) { const err = await catalogRes.json(); throw new Error(err.message || 'Failed to fetch catalog.'); }
                        const catalogData = await catalogRes.json();
                        if (catalogData.success) setLibraryCatalog(catalogData.books || []);
                    }
                    console.log("studentProfile", profileData.data.profile);
                    console.log("borrowedBooks", profileData.data.issuedBooks);
                    console.log("libraryHistory", profileData.data.activity);
                    console.log("libraryCatalog", libraryCatalog);
                } else { throw new Error(profileData.message); }
            } catch (err) { setError(err.message); }
            finally { setIsLoading(false); }
        };
        fetchDashboardData();
    }, []);

    // --- Utility & Filter Logic ---
    const getDaysRemaining = (dueDate) => { const today = new Date(); const due = new Date(dueDate); return Math.ceil((due - today) / (1000 * 60 * 60 * 24)); };
    const getStatusInfo = (dueDate) => {
        const daysRemaining = getDaysRemaining(dueDate);
        if (daysRemaining < 0) return { text: `Overdue by ${Math.abs(daysRemaining)} days`, color: 'red' };
        if (daysRemaining <= 3) return { text: `Due in ${daysRemaining} days`, color: 'yellow' };
        return { text: `Due in ${daysRemaining} days`, color: 'green' };
    };
    const filteredCatalog = libraryCatalog.filter(b => (b.title.toLowerCase().includes(searchQuery.toLowerCase()) || (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()))) && (filterCategory === 'all' || b.category === filterCategory));
    const totalFine = libraryHistory.reduce((acc, item) => (!item.returnedAt && item.fine) ? acc + item.fine : acc, 0);
    const memberSinceYear = studentProfile ? new Date(studentProfile.createdAt).getFullYear() : '...';

    // --- Render Functions ---
    const renderContent = () => {
        if (isLoading) return <div className="space-y-4"><BookCardSkeleton /><BookCardSkeleton /></div>;
        if (error) return <div className="p-6 text-center bg-red-50 rounded-xl"><AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-3"/><h3 className="font-semibold text-lg text-red-800">An Error Occurred</h3><p className="text-sm text-red-600 mt-1">{error}</p></div>;
        
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'borrowed': return renderBorrowedBooks();
            case 'search': return renderSearchCatalog();
            case 'history': return renderHistory();
            default: return null;
        }
    };

    const renderDashboard = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Books Borrowed" value={`${borrowedBooks.length} / 5`} icon={BookOpen} color="blue" />
                <StatCard title="Total Fine Due" value={`₹${totalFine}`} icon={CreditCard} color="red" />
                <StatCard title="Member Since" value={memberSinceYear} icon={User} color="purple" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
                <div className="space-y-3">{libraryHistory.length > 0 ? libraryHistory.slice(0, 3).map((item, index) => (<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center gap-3">{item.returnedAt ? <div className="w-8 h-8 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center"><ArrowUp className="w-5 h-5 text-green-600" /></div> : <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center"><ArrowDown className="w-5 h-5 text-blue-600" /></div>}<div><p className="font-medium text-gray-900">{item.bookName}</p><p className="text-sm text-gray-500">{item.returnedAt ? 'Returned on' : 'Issued on'} {new Date(item.returnedAt || item.issuedAt).toLocaleDateString()}</p></div></div>{item.fine > 0 && (<span className="text-sm text-red-600 font-medium">Fine: ₹{item.fine}</span>)}</div>)) : <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>}</div>
            </div>
        </div>
    );
    
    const renderBorrowedBooks = () => (
        <div className="space-y-4">
            {borrowedBooks.length > 0 ? borrowedBooks.map((book,index) => {
                const dueDate = new Date(new Date(book.issuedAt).setDate(new Date(book.issuedAt).getDate() + 15 * (book.renewals + 1)));
                const status = getStatusInfo(dueDate);
                return (
                    <div key={book.copyId+index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        {console.log("Rendering book:", book, "Due Date:", dueDate, "Status:", status)}
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                            <div className="flex-1 mb-3 sm:mb-0">
                                <h4 className="text-lg font-semibold text-gray-900">{book.title}</h4>
                                <p className="text-gray-600 text-sm">by {book.author}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}-100 text-${status.color}-800`}>{status.text}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                            <div className={`h-1.5 rounded-full bg-${status.color}-500`} style={{width: '100%'}}></div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <p>Issued: <span className="font-medium text-gray-700">{new Date(book.issuedAt).toLocaleDateString()}</span></p>
                            <p>Due Date: <span className="font-medium text-gray-700">{dueDate.toLocaleDateString()}</span></p>
                        </div>
                    </div>
                );
            }) : <div className="text-center p-12 bg-gray-50 rounded-xl"><BookOpen size={40} className="mx-auto text-gray-400 mb-3"/><p className="font-semibold text-lg">No Books Borrowed</p><p className="text-gray-500">Your currently borrowed list is empty.</p></div>}
        </div>
    );

    const renderSearchCatalog = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1"><div className="relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search by title or author..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div></div>
                    <div className="md:w-56"><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"><option value="all">All Categories</option><option value="Computer Science">Computer Science</option><option value="Electronics">Electronics</option></select></div>
                </div>
            </div>
            <div className="space-y-4">
                {filteredCatalog.length > 0 ? filteredCatalog.map((book, index) => {
                    const availableCopies = book.copies.filter(c => !c.occupiedBy).length;
                    return (
                        <div key={book._id+index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">{book.title}</h4>
                                    <p className="text-gray-600 text-sm">by {book.author}</p>
                                    <p className="text-xs text-gray-500 mt-2">ISBN: {book.isbn}</p>
                                </div>
                                <div className="text-left sm:text-right flex-shrink-0">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {availableCopies > 0 ? 'Available' : 'Unavailable'}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">{availableCopies} of {book.totalCopies} copies</p>
                                </div>
                            </div>
                        </div>
                    )
                }) : <div className="text-center p-12 bg-gray-50 rounded-xl"><Search size={40} className="mx-auto text-gray-400 mb-3"/><p className="font-semibold text-lg">No Books Found</p><p className="text-gray-500">Try a different search or filter.</p></div>}
            </div>
        </div>
    );
    
    const renderHistory = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="space-y-2">
                {libraryHistory.length > 0 ? libraryHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 -mx-6 px-6">
                        <div className="flex items-center gap-4">
                            {item.returnedAt ? 
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><ArrowUp className="w-5 h-5 text-green-600" /></div> : 
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><ArrowDown className="w-5 h-5 text-blue-600" /></div>
                            }
                            <div>
                                <p className="font-medium text-gray-900">{item.bookName}</p>
                                <p className="text-sm text-gray-500">{item.returnedAt ? `Returned on ${new Date(item.returnedAt).toLocaleDateString()}` : `Issued on ${new Date(item.issuedAt).toLocaleDateString()}`}</p>
                            </div>
                        </div>
                        {item.fine > 0 && (<span className="text-sm text-red-600 font-semibold">Fine Paid: ₹{item.fine}</span>)}
                    </div>
                )) : <div className="text-center p-12"><Clock size={40} className="mx-auto text-gray-400 mb-3"/><p className="font-semibold text-lg">No History</p><p className="text-gray-500">Your borrowing history is empty.</p></div>}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    {isLoading ? <div className="h-20 animate-pulse bg-gray-100 rounded-lg"></div> : 
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
                            <p className="text-gray-600">{studentProfile?.name} • {studentProfile?.registrationNumber}</p>
                        </div>
                        <Book className="w-12 h-12 text-blue-600" />
                    </div>
                    }
                </div>
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        <button onClick={() => setActiveTab('dashboard')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><User className="w-4 h-4 mr-2" />Dashboard</button>
                        <button onClick={() => setActiveTab('borrowed')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'borrowed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><BookOpen className="w-4 h-4 mr-2" />My Books ({borrowedBooks.length})</button>
                        <button onClick={() => setActiveTab('search')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Search className="w-4 h-4 mr-2" />Search Catalog</button>
                        <button onClick={() => setActiveTab('history')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Clock className="w-4 h-4 mr-2" />History</button>
                    </div>
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default LibraryDashboard;