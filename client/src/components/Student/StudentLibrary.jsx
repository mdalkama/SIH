import {React, useState, useEffect } from 'react';
import { Book, Search, Calendar, User, Clock, AlertCircle, CheckCircle, BookOpen, Filter, Bookmark, Download, RefreshCw, CreditCard, Loader2 } from 'lucide-react';

// Helper component for skeleton loading
const BookCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
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
    
    // States for API Data
    const [studentProfile, setStudentProfile] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [libraryHistory, setLibraryHistory] = useState([]);
    const [libraryCatalog, setLibraryCatalog] = useState([]);
    console.log("Library Catalog:", libraryCatalog);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Step 1: Fetch student's personal library data using the separate student library route
                const profileRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/student-library/my-profile`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!profileRes.ok) {
                    const err = await profileRes.json();
                    throw new Error(err.message || 'Failed to fetch your library profile.');
                }
                const profileData = await profileRes.json();
                
                if (profileData.success) {
                    setStudentProfile(profileData.data.profile);
                    setBorrowedBooks(profileData.data.issuedBooks);
                    setLibraryHistory(profileData.data.activity);

                    // Step 2: Fetch the entire library catalog
                    const collegeCode = profileData.data.profile.collegeCode;
                    if (collegeCode) {
                        const catalogRes = await fetch(`https://sih-4ptm.onrender.com/api/v1/library/all/${collegeCode}`, { credentials: 'include' });
                        if (!catalogRes.ok) { 
                            const err = await catalogRes.json(); 
                            throw new Error(err.message || 'Failed to fetch the library catalog.'); 
                        }
                        const catalogData = await catalogRes.json();
                        if (catalogData.success) {
                            setLibraryCatalog(catalogData.books || []);
                        }
                    }
                } else {
                    throw new Error(profileData.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- Utility Functions & Handlers ---
    const getDaysRemaining = (dueDate) => { const today = new Date(); const due = new Date(dueDate); const diffTime = due - today; return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); };
    const getStatusColor = (status) => { switch (status) { case 'overdue': return 'text-red-600 bg-red-50'; case 'due_soon': return 'text-yellow-600 bg-yellow-50'; default: return 'text-green-600 bg-green-50'; } };
    const getStatusIcon = (status) => { switch (status) { case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />; case 'due_soon': return <Clock className="w-4 h-4 text-yellow-500" />; default: return <CheckCircle className="w-4 h-4 text-green-500" />; } };
    const handleReserveBook = (bookId) => { alert(`Issue/Reserve functionality for book ID: ${bookId}`); };
    const filteredCatalog = libraryCatalog.filter(book => (book.title.toLowerCase().includes(searchQuery.toLowerCase()) || (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))) && (filterCategory === 'all' || book.category === filterCategory));
    
    const totalFine = libraryHistory.reduce((acc, item) => {
        if (!item.returnedAt && item.fine) {
            return acc + item.fine;
        }
        return acc;
    }, 0);

    const memberSinceYear = studentProfile ? new Date(studentProfile.createdAt).getFullYear() : '...';

    // --- Render Functions ---
    const renderContent = () => {
        if (isLoading) { return <div className="space-y-4"><BookCardSkeleton /><BookCardSkeleton /></div>; }
        if (error) { return <div className="p-6 text-center bg-red-50 rounded-lg"><AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2"/><p className="font-semibold text-red-700">An Error Occurred</p><p className="text-sm text-red-600">{error}</p></div>; }
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'borrowed': return renderBorrowedBooks();
            case 'search': return renderSearchCatalog();
            case 'history': return renderHistory();
            default: return null;
        }
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Library Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg"><div className="flex items-center justify-between"><div><p className="text-blue-600 text-sm">Books Borrowed</p><p className="text-2xl font-bold">{borrowedBooks.length} / 5</p></div><Book className="w-8 h-8 text-blue-600" /></div></div>
                <div className="bg-red-50 p-6 rounded-lg"><div className="flex items-center justify-between"><div><p className="text-red-600 text-sm">Total Fine Due</p><p className="text-2xl font-bold">₹{totalFine}</p></div><CreditCard className="w-8 h-8 text-red-600" /></div></div>
                <div className="bg-purple-50 p-6 rounded-lg"><div className="flex items-center justify-between"><div><p className="text-purple-600 text-sm">Member Since</p><p className="text-lg font-bold">{memberSinceYear}</p></div><User className="w-8 h-8 text-purple-600" /></div></div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => setActiveTab('search')} className="flex items-center p-4 border rounded-lg hover:bg-gray-50"><Search className="w-5 h-5 text-blue-600 mr-3" /><div className="text-left"><p className="font-medium">Search Catalog</p><p className="text-sm text-gray-600">Find and reserve books</p></div></button>
                    <button onClick={() => setActiveTab('borrowed')} className="flex items-center p-4 border rounded-lg hover:bg-gray-50"><BookOpen className="w-5 h-5 text-green-600 mr-3" /><div className="text-left"><p className="font-medium">My Books</p><p className="text-sm text-gray-600">View borrowed books</p></div></button>
                    <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50"><Download className="w-5 h-5 text-purple-600 mr-3" /><div className="text-left"><p className="font-medium">Digital Resources</p><p className="text-sm text-gray-600">Access e-books & journals</p></div></button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {libraryHistory.length > 0 ? libraryHistory.slice(0, 3).map((item, index) => (
                        <div key={item.copyId + index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">{item.bookName}</p>
                                <p className="text-sm text-gray-600">
                                    {item.returnedAt ? 'Returned' : 'Issued'} on {new Date(item.returnedAt || item.issuedAt).toLocaleDateString()}
                                </p>
                            </div>
                            {item.fine > 0 && (<span className="text-sm text-red-600 font-medium">Fine: ₹{item.fine}</span>)}
                        </div>
                    )) : <p className="text-sm text-gray-500">No recent activity.</p>}
                </div>
            </div>
        </div>
    );
    
    const renderBorrowedBooks = () => (
        <div className="space-y-4">
            {borrowedBooks.length > 0 ? borrowedBooks.map((book) => {
                const dueDate = new Date(new Date(book.issuedAt).setDate(new Date(book.issuedAt).getDate() + 15));
                const daysRemaining = getDaysRemaining(dueDate);
                const status = daysRemaining < 0 ? 'overdue' : daysRemaining <= 3 ? 'due_soon' : 'active';
                return (
                    <div key={book.copyId} className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{book.title}</h4>
                                <p className="text-gray-600 mb-1">by {book.author}</p>
                                <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(status)}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                                    {status === 'overdue' ? `Overdue by ${Math.abs(daysRemaining)} days` : `Due in ${daysRemaining} days`}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><p className="text-sm text-gray-600">Issued On</p><p className="font-medium">{new Date(book.issuedAt).toLocaleDateString()}</p></div>
                            <div><p className="text-sm text-gray-600">Due Date</p><p className="font-medium">{dueDate.toLocaleDateString()}</p></div>
                        </div>
                    </div>
                );
            }) : <div className="text-center p-8 bg-gray-50 rounded-lg"><BookOpen size={32} className="mx-auto text-gray-400 mb-2"/><p className="font-semibold">No Books Borrowed</p><p className="text-sm text-gray-500">You haven't borrowed any books yet.</p></div>}
        </div>
    );

    const renderSearchCatalog = () => (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1"><div className="relative"><Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search by title or author..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div></div>
                    <div className="md:w-48"><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white"><option value="all">All Categories</option><option value="Computer Science">Computer Science</option><option value="Electronics">Electronics</option></select></div>
                </div>
            </div>
            <div className="space-y-4">
                {filteredCatalog.length > 0 ? filteredCatalog.map((book) => {
                    const availableCopies = book.copies.filter(c => !c.occupiedBy).length;
                    return (
                        <div key={book._id} className="bg-white p-6 rounded-lg shadow-sm border">
                            <h4 className="font-semibold">{book.title}</h4>
                            <p>by {book.author}</p>
                            <p>Available: {availableCopies} / {book.totalCopies}</p>
                            <button disabled={availableCopies === 0} onClick={() => handleReserveBook(book._id)}>Issue</button>
                        </div>
                    )
                }) : <div className="text-center p-8 bg-gray-50 rounded-lg"><Search size={32} className="mx-auto text-gray-400 mb-2"/><p className="font-semibold">No Books Found</p><p className="text-sm text-gray-500">Try a different search or filter.</p></div>}
            </div>
        </div>
    );
    
    const renderHistory = () => (
        <div className="space-y-4">
            {libraryHistory.length > 0 ? libraryHistory.map((item, index) => (
                <div key={item.copyId + index} className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="font-semibold">{item.bookName}</h4>
                    <p>Issued by: {item.issuedBy?.name || 'Librarian'}</p>
                    <p>Issued on: {new Date(item.issuedAt).toLocaleDateString()}</p>
                    {item.returnedAt && <p>Returned on: {new Date(item.returnedAt).toLocaleDateString()}</p>}
                    {item.fine > 0 && <p className="text-red-600">Fine Paid: ₹{item.fine}</p>}
                </div>
            )) : <div className="text-center p-8 bg-gray-50 rounded-lg"><Clock size={32} className="mx-auto text-gray-400 mb-2"/><p className="font-semibold">No History</p><p className="text-sm text-gray-500">Your borrowing history is empty.</p></div>}
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    {isLoading ? <div className="h-20 animate-pulse bg-gray-100 rounded-lg"></div> :
                    <div className="flex items-center justify-between">
                        <div><h1 className="text-3xl font-bold text-gray-900 mb-2">Library Dashboard</h1><p className="text-gray-600">{studentProfile?.name} • {studentProfile?.registrationNumber}</p></div>
                        <Book className="w-12 h-12 text-blue-600" />
                    </div>
                    }
                </div>
                <div className="bg-white rounded-lg shadow-sm mb-6">
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