import React, { useState } from 'react';
import { Book, Search, Calendar, User, Clock, AlertCircle, CheckCircle, BookOpen, Filter, Bookmark, Download, RefreshCw, CreditCard } from 'lucide-react';

const LibraryDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    // Mock student library data
    const studentLibraryData = {
        studentName: "Rahul Kumar",
        rollNumber: "2021CS001",
        libraryId: "LIB2021001",
        membershipType: "Student Premium",
        memberSince: "15 July 2021",
        maxBooks: 10,
        currentBorrowed: 6,
        totalFine: 50,
        renewalsLeft: 3,
        lastVisit: "05 September 2024"
    };

    // Mock borrowed books data
    const [borrowedBooks, setBorrowedBooks] = useState([
        {
            id: "B001",
            title: "Introduction to Machine Learning",
            author: "Ethen Alpaydin",
            isbn: "978-0262028189",
            issueDate: "2024-08-15",
            dueDate: "2024-09-14",
            renewals: 1,
            maxRenewals: 3,
            status: "overdue",
            fine: 20,
            category: "Computer Science",
            location: "CS Section - Shelf A2"
        },
        {
            id: "B002",
            title: "Deep Learning",
            author: "Ian Goodfellow",
            isbn: "978-0262035613",
            issueDate: "2024-08-20",
            dueDate: "2024-09-19",
            renewals: 0,
            maxRenewals: 3,
            status: "due_soon",
            fine: 0,
            category: "Computer Science",
            location: "CS Section - Shelf A3"
        },
        {
            id: "B003",
            title: "Computer Networks",
            author: "Andrew S. Tanenbaum",
            isbn: "978-0132126953",
            issueDate: "2024-08-25",
            dueDate: "2024-09-24",
            renewals: 0,
            maxRenewals: 3,
            status: "active",
            fine: 0,
            category: "Computer Science",
            location: "CS Section - Shelf B1"
        },
        {
            id: "B004",
            title: "Operating System Concepts",
            author: "Abraham Silberschatz",
            isbn: "978-1118063330",
            issueDate: "2024-09-01",
            dueDate: "2024-10-01",
            renewals: 0,
            maxRenewals: 3,
            status: "active",
            fine: 0,
            category: "Computer Science",
            location: "CS Section - Shelf B2"
        },
        {
            id: "B005",
            title: "Data Structures and Algorithms",
            author: "Thomas H. Cormen",
            isbn: "978-0262033848",
            issueDate: "2024-09-03",
            dueDate: "2024-10-03",
            renewals: 1,
            maxRenewals: 3,
            status: "active",
            fine: 0,
            category: "Computer Science",
            location: "CS Section - Shelf A1"
        },
        {
            id: "B006",
            title: "Digital Signal Processing",
            author: "John G. Proakis",
            isbn: "978-0131873742",
            issueDate: "2024-08-10",
            dueDate: "2024-09-09",
            renewals: 2,
            maxRenewals: 3,
            status: "overdue",
            fine: 30,
            category: "Electronics",
            location: "ECE Section - Shelf C1"
        }
    ]);

    // Mock library catalog
    const libraryCatalog = [
        {
            id: "CAT001",
            title: "Artificial Intelligence: A Modern Approach",
            author: "Stuart Russell, Peter Norvig",
            isbn: "978-0134610993",
            category: "Computer Science",
            availability: "Available",
            totalCopies: 5,
            availableCopies: 2,
            location: "CS Section - Shelf A4",
            description: "Comprehensive introduction to AI concepts and applications"
        },
        {
            id: "CAT002",
            title: "Python Machine Learning",
            author: "Sebastian Raschka",
            isbn: "978-1789955750",
            category: "Computer Science",
            availability: "Available",
            totalCopies: 3,
            availableCopies: 1,
            location: "CS Section - Shelf A2",
            description: "Practical guide to machine learning with Python"
        },
        {
            id: "CAT003",
            title: "Database System Concepts",
            author: "Abraham Silberschatz",
            isbn: "978-0078022159",
            category: "Computer Science",
            availability: "Reserved",
            totalCopies: 4,
            availableCopies: 0,
            location: "CS Section - Shelf B3",
            description: "Comprehensive database systems textbook"
        },
        {
            id: "CAT004",
            title: "Computer Graphics: Principles and Practice",
            author: "John F. Hughes",
            isbn: "978-0321399526",
            category: "Computer Science",
            availability: "Available",
            totalCopies: 2,
            availableCopies: 2,
            location: "CS Section - Shelf C2",
            description: "Complete guide to computer graphics programming"
        }
    ];

    // Mock library history
    const libraryHistory = [
        {
            id: "H001",
            title: "Introduction to Algorithms",
            author: "Thomas H. Cormen",
            action: "Returned",
            date: "2024-08-05",
            fine: 0
        },
        {
            id: "H002",
            title: "Computer Vision",
            author: "Richard Szeliski",
            action: "Returned",
            date: "2024-07-28",
            fine: 10
        },
        {
            id: "H003",
            title: "Software Engineering",
            author: "Ian Sommerville",
            action: "Returned",
            date: "2024-07-15",
            fine: 0
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'overdue': return 'text-red-600 bg-red-50';
            case 'due_soon': return 'text-yellow-600 bg-yellow-50';
            case 'active': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'due_soon': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <Book className="w-4 h-4 text-gray-500" />;
        }
    };

    const getDaysRemaining = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleRenewBook = (bookId) => {
        setBorrowedBooks(prevBooks =>
            prevBooks.map(book =>
                book.id === bookId && book.renewals < book.maxRenewals
                    ? {
                        ...book,
                        renewals: book.renewals + 1,
                        dueDate: new Date(new Date(book.dueDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    }
                    : book
            )
        );
        setShowRenewModal(false);
        setSelectedBook(null);
    };

    const handleReserveBook = (bookId) => {
        alert(`Book reserved successfully! You will be notified when it becomes available.`);
    };

    const filteredCatalog = libraryCatalog.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Library Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-between">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Books Borrowed</p>
                            <p className="text-2xl font-bold text-blue-700">
                                {studentLibraryData.currentBorrowed}/{studentLibraryData.maxBooks}
                            </p>
                        </div>
                        <Book className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">Total Fine</p>
                            <p className="text-2xl font-bold text-red-700">₹{studentLibraryData.totalFine}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Member Since</p>
                            <p className="text-lg font-bold text-purple-700">{studentLibraryData.memberSince.split(' ')[2]}</p>
                        </div>
                        <User className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setActiveTab('search')}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Search className="w-5 h-5 text-blue-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Search Catalog</p>
                            <p className="text-sm text-gray-600">Find and reserve books</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('borrowed')}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <BookOpen className="w-5 h-5 text-green-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">My Books</p>
                            <p className="text-sm text-gray-600">View borrowed books</p>
                        </div>
                    </button>

                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-5 h-5 text-purple-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Digital Resources</p>
                            <p className="text-sm text-gray-600">Access e-books & journals</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {libraryHistory.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.author} • {item.action} on {item.date}</p>
                            </div>
                            {item.fine > 0 && (
                                <span className="text-sm text-red-600 font-medium">Fine: ₹{item.fine}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderBorrowedBooks = () => (
        <div className="space-y-4">
            {borrowedBooks.map((book) => {
                const daysRemaining = getDaysRemaining(book.dueDate);
                return (
                    <div key={book.id} className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{book.title}</h4>
                                <p className="text-gray-600 mb-1">by {book.author}</p>
                                <p className="text-sm text-gray-500">ISBN: {book.isbn} • {book.location}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(book.status)}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
                                    {book.status === 'overdue' ? `Overdue (${Math.abs(daysRemaining)} days)` :
                                        book.status === 'due_soon' ? `Due in ${daysRemaining} days` :
                                            `Due in ${daysRemaining} days`}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Issue Date</p>
                                <p className="font-medium">{book.issueDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Due Date</p>
                                <p className="font-medium">{book.dueDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Renewals</p>
                                <p className="font-medium">{book.renewals}/{book.maxRenewals}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                {book.fine > 0 && (
                                    <span className="text-red-600 font-medium">Fine: ₹{book.fine}</span>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setSelectedBook(book);
                                        setShowRenewModal(true);
                                    }}
                                    disabled={book.renewals >= book.maxRenewals}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${book.renewals >= book.maxRenewals
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {book.renewals >= book.maxRenewals ? 'Max Renewals' : 'Renew'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderSearchCatalog = () => (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search books by title, author, or ISBN..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="md:w-48">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
                {filteredCatalog.map((book) => (
                    <div key={book.id} className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{book.title}</h4>
                                <p className="text-gray-600 mb-1">by {book.author}</p>
                                <p className="text-sm text-gray-500 mb-2">{book.description}</p>
                                <p className="text-sm text-gray-500">ISBN: {book.isbn} • {book.location}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${book.availability === 'Available' ? 'bg-green-100 text-green-800' :
                                        book.availability === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {book.availability}
                                </span>
                                <p className="text-sm text-gray-500 mt-1">
                                    {book.availableCopies}/{book.totalCopies} copies
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm text-gray-600">Category: </span>
                                <span className="text-sm font-medium text-blue-600">{book.category}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleReserveBook(book.id)}
                                    disabled={book.availableCopies === 0}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${book.availableCopies === 0
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    <Bookmark className="w-4 h-4 mr-1 inline" />
                                    {book.availableCopies === 0 ? 'Reserve' : 'Issue'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderHistory = () => (
        <div className="space-y-4">
            {libraryHistory.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-gray-600">by {item.author}</p>
                            <p className="text-sm text-gray-500">{item.action} on {item.date}</p>
                        </div>
                        <div className="text-right">
                            {item.fine > 0 ? (
                                <span className="text-red-600 font-medium">Fine: ₹{item.fine}</span>
                            ) : (
                                <span className="text-green-600 font-medium">No Fine</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Library Dashboard</h1>
                            <p className="text-gray-600">
                                {studentLibraryData.studentName} • {studentLibraryData.libraryId}
                            </p>
                            <p className="text-sm text-gray-500">
                                {studentLibraryData.membershipType} • Last visit: {studentLibraryData.lastVisit}
                            </p>
                        </div>
                        <div className="text-center">
                            <Book className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Library Member</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'dashboard'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <User className="w-4 h-4 mr-2" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('borrowed')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'borrowed'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            My Books ({studentLibraryData.currentBorrowed})
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'search'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Search Catalog
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center px-6 py-3 font-medium ${activeTab === 'history'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            History
                        </button>
                    </div>
                </div>

                {/* Content based on active tab */}
                <div>
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'borrowed' && renderBorrowedBooks()}
                    {activeTab === 'search' && renderSearchCatalog()}
                    {activeTab === 'history' && renderHistory()}
                </div>

                {/* Renewal Modal */}
                {showRenewModal && selectedBook && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Renew Book</h3>
                            <div className="mb-4">
                                <p className="font-medium text-gray-900">{selectedBook.title}</p>
                                <p className="text-sm text-gray-600">Current due date: {selectedBook.dueDate}</p>
                                <p className="text-sm text-gray-600">
                                    Renewals used: {selectedBook.renewals}/{selectedBook.maxRenewals}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRenewBook(selectedBook.id)}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Confirm Renewal
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRenewModal(false);
                                        setSelectedBook(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryDashboard;