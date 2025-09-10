import React, { useState, useEffect } from 'react';
import { Book, Search, User, Clock, AlertCircle, CheckCircle, BookOpen, Filter, Bookmark, Loader2, RefreshCw, CreditCard, ArrowDown, ArrowUp } from 'lucide-react';

// --- Helper Components ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-xl bg-${color}-50 border border-${color}-200`}>
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
    <div className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex justify-end items-center mt-4">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
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
    const [actionMessage, setActionMessage] = useState(null);
    const [actionLoadingBookId, setActionLoadingBookId] = useState(null);

    // --- Data Fetching ---
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
                    const catalogRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/library/student-catalog`, { credentials: 'include' });
                    if (!catalogRes.ok) { const err = await catalogRes.json(); throw new Error(err.message || 'Failed to fetch catalog.'); }
                    const catalogData = await catalogRes.json();
                    if (catalogData.success) setLibraryCatalog(catalogData.books || []);
                }
            } else { throw new Error(profileData.message); }
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };
    
    useEffect(() => { fetchDashboardData(); }, []);

    // --- API Handlers ---
    const handleIssueBook = async (bookId, copyId) => {
        setActionLoadingBookId(bookId); setActionMessage(null);
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/student-library/issue-book`, {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, copyId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setActionMessage({ type: 'success', text: data.message });
            await fetchDashboardData(); // Refresh all data
        } catch (err) { setActionMessage({ type: 'error', text: err.message }); }
        finally { setActionLoadingBookId(null); }
    };

    const handleRenewBook = async (bookId, copyId) => {
        setActionLoadingBookId(bookId); setActionMessage(null);
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/student-library/renew-book`, {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, copyId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setActionMessage({ type: 'success', text: data.message });
            await fetchDashboardData();
        } catch (err) { setActionMessage({ type: 'error', text: err.message }); }
        finally { setActionLoadingBookId(null); }
    };

    // --- Utility & Filter Logic ---
    const getDaysRemaining = (dueDate) => { const today = new Date(); const due = new Date(dueDate); return Math.ceil((due - today) / (1000 * 60 * 60 * 24)); };
    const getStatusInfo = (dueDate, renewals) => {
        const daysRemaining = getDaysRemaining(dueDate);
        const MAX_RENEWALS = 2; // Should match backend
        if (daysRemaining < 0) return { text: `Overdue by ${Math.abs(daysRemaining)} days`, color: 'red', canRenew: false };
        if (renewals >= MAX_RENEWALS) return { text: `Due in ${daysRemaining} days`, color: 'gray', canRenew: false };
        if (daysRemaining <= 3) return { text: `Due in ${daysRemaining} days`, color: 'yellow', canRenew: true };
        return { text: `Due in ${daysRemaining} days`, color: 'green', canRenew: true };
    };
    const filteredCatalog = libraryCatalog.filter(b => (b.title.toLowerCase().includes(searchQuery.toLowerCase()) || (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()))) && (filterCategory === 'all' || b.category === filterCategory));
    const totalFine = libraryHistory.reduce((acc, item) => (!item.returnedAt && item.fine) ? acc + item.fine : acc, 0);
    const memberSinceYear = studentProfile ? new Date(studentProfile.createdAt).getFullYear() : '...';

    // --- Main Render Function ---
    const renderContent = () => {
        if (isLoading) return <div className="space-y-4"><BookCardSkeleton /><BookCardSkeleton /></div>;
        if (error) return <div className="p-6 text-center bg-red-50 rounded-lg"><AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2"/><p className="font-semibold text-red-700">An Error Occurred</p><p className="text-sm text-red-600">{error}</p></div>;
        
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
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
                <div className="space-y-3">{libraryHistory.length > 0 ? libraryHistory.slice(0, 3).map((item, index) => (<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center gap-3">{item.returnedAt ? <div className="w-8 h-8 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center"><ArrowUp className="w-5 h-5 text-green-600" /></div> : <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center"><ArrowDown className="w-5 h-5 text-blue-600" /></div>}<div><p className="font-medium text-gray-900">{item.bookName}</p><p className="text-sm text-gray-500">{item.returnedAt ? 'Returned on' : 'Issued on'} {new Date(item.returnedAt || item.issuedAt).toLocaleDateString()}</p></div></div>{item.fine > 0 && (<span className="text-sm text-red-600 font-medium">Fine: ₹{item.fine}</span>)}</div>)) : <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>}</div>
            </div>
        </div>
    );
    
    const renderBorrowedBooks = () => (
        <div className="space-y-4">
            {actionMessage && <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${actionMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{actionMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}{actionMessage.text}</div>}
            {borrowedBooks.length > 0 ? borrowedBooks.map((book) => {
                const dueDate = new Date(new Date(book.issuedAt).setDate(new Date(book.issuedAt).getDate() + 15 * (book.renewals + 1)));
                const status = getStatusInfo(dueDate, book.renewals);
                return (
                    <div key={book.copyId} className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex justify-between items-start mb-4"><div className="flex-1"><h4 className="text-lg font-semibold text-gray-900">{book.title}</h4><p className="text-gray-600 text-sm">by {book.author}</p><p className="text-xs text-gray-500 mt-2">ISBN: {book.isbn}</p></div><span className={`px-3 py-1 rounded-full text-sm font-medium bg-${status.color}-50 text-${status.color}-700`}>{status.text}</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4"><div className={`h-1.5 rounded-full bg-${status.color}-500`} style={{width: `100%`}}></div></div>
                        <div className="flex justify-between items-center"><p className="text-sm text-gray-500">Issued: {new Date(book.issuedAt).toLocaleDateString()}</p><button onClick={() => handleRenewBook(book.bookId, book.copyId)} disabled={!status.canRenew || actionLoadingBookId === book.bookId} className="px-4 py-2 rounded-lg text-sm font-semibold disabled:bg-gray-200 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">{actionLoadingBookId === book.bookId ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>}{!status.canRenew && book.renewals >= 2 ? 'Limit Reached' : 'Renew'}</button></div>
                    </div>
                );
            }) : <div className="text-center p-12 bg-gray-50 rounded-xl"><BookOpen size={40} className="mx-auto text-gray-400 mb-3"/><p className="font-semibold text-lg">No Books Borrowed</p><p className="text-gray-500">Your currently borrowed list is empty.</p></div>}
        </div>
    );

    const renderSearchCatalog = () => (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="flex flex-col md:flex-row gap-4"><div className="flex-1"><div className="relative"><Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search by title or author..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div></div><div className="md:w-56"><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white"><option value="all">All Categories</option><option value="Computer Science">Computer Science</option><option value="Electronics">Electronics</option></select></div></div></div>
             {actionMessage && <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${actionMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{actionMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}{actionMessage.text}</div>}
            <div className="space-y-4">
                {filteredCatalog.length > 0 ? filteredCatalog.map((book) => {
                    const availableCopies = book.copies.filter(c => !c.occupiedBy);
                    return (
                        <div key={book._id} className="bg-white p-6 rounded-xl shadow-sm border">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4"><div className="flex-1"><h4 className="text-lg font-semibold text-gray-900">{book.title}</h4><p className="text-gray-600 text-sm">by {book.author}</p><p className="text-xs text-gray-500 mt-2">ISBN: {book.isbn}</p></div><div className="text-left sm:text-right flex-shrink-0"><span className={`px-3 py-1 rounded-full text-sm font-medium ${availableCopies.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{availableCopies.length > 0 ? 'Available' : 'Unavailable'}</span><p className="text-sm text-gray-500 mt-1">{availableCopies.length} of {book.totalCopies} copies</p></div></div>
                            <div className="mt-4 pt-4 border-t flex justify-end"><button disabled={availableCopies.length === 0 || borrowedBooks.length >= 5 || actionLoadingBookId === book._id} onClick={() => handleIssueBook(book._id, availableCopies[0].copyId)} className="px-5 py-2 rounded-lg text-sm font-semibold disabled:bg-gray-200 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">{actionLoadingBookId === book._id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Bookmark className="w-4 h-4" />}{borrowedBooks.length >= 5 ? 'Limit Reached' : (availableCopies.length === 0 ? 'Unavailable' : 'Borrow Copy')}</button></div>
                        </div>
                    )
                }) : <div className="text-center p-12 bg-gray-50 rounded-xl"><Search size={40} className="mx-auto text-gray-400 mb-3"/><p className="font-semibold text-lg">No Books Found</p><p className="text-gray-500">Try a different search or filter.</p></div>}
            </div>
        </div>
    );
    
    const renderHistory = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="space-y-4">{libraryHistory.length > 0 ? libraryHistory.map((item, index) => (<div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0"><div className="flex items-center gap-3">{item.returnedAt ? <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><ArrowUp className="w-5 h-5 text-green-600" /></div> : <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><ArrowDown className="w-5 h-5 text-blue-600" /></div>}<div><p className="font-medium text-gray-900">{item.bookName}</p><p className="text-sm text-gray-500">{item.returnedAt ? `Returned on ${new Date(item.returnedAt).toLocaleDateString()}` : `Issued on ${new Date(item.issuedAt).toLocaleDateString()}`}</p></div></div>{item.fine > 0 && (<span className="text-sm text-red-600 font-semibold">Fine Paid: ₹{item.fine}</span>)}</div>)) : <div className="text-center p-12"><Clock size={40} className="mx-auto text-gray-400 mb-3"/><p className="font-semibold text-lg">No History</p><p className="text-gray-500">Your borrowing history is empty.</p></div>}</div></div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    {isLoading ? <div className="h-20 animate-pulse bg-gray-100 rounded-lg"></div> : <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1><p className="text-gray-600">{studentProfile?.name} • {studentProfile?.registrationNumber}</p></div><Book className="w-12 h-12 text-blue-600" /></div>}
                </div>
                <div className="bg-white rounded-xl shadow-sm mb-6"><div className="flex border-b border-gray-200 overflow-x-auto"><button onClick={() => setActiveTab('dashboard')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><User className="w-4 h-4 mr-2" />Dashboard</button><button onClick={() => setActiveTab('borrowed')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'borrowed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><BookOpen className="w-4 h-4 mr-2" />My Books ({borrowedBooks.length})</button><button onClick={() => setActiveTab('search')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Search className="w-4 h-4 mr-2" />Search Catalog</button><button onClick={() => setActiveTab('history')} className={`flex-shrink-0 flex items-center px-6 py-3 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Clock className="w-4 h-4 mr-2" />History</button></div></div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default LibraryDashboard;