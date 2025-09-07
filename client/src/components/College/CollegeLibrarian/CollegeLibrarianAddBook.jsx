import React, { useState } from 'react';
import { Book, Plus, Minus, Copy, AlertCircle, CheckCircle, X, Filter, Download, Search,Trash2 } from 'lucide-react';

const CollegeLibrarianAddBook = () => {
    const [activeTab, setActiveTab] = useState('addBook');
    const [books, setBooks] = useState([
        {
            _id: '1',
            title: 'Introduction to Computer Science',
            author: 'John Smith',
            isbn: '978-0123456789',
            category: 'Computer Science',
            totalCopies: 5,
            copies: [
                { copyId: 'C1', occupiedBy: null },
                { copyId: 'C2', occupiedBy: 'student1' },
                { copyId: 'C3', occupiedBy: null },
                { copyId: 'C4', occupiedBy: null },
                { copyId: 'C5', occupiedBy: 'student2' }
            ]
        },
        {
            _id: '2',
            title: 'Mathematics for Engineers',
            author: 'Jane Doe',
            isbn: '978-0987654321',
            category: 'Mathematics',
            totalCopies: 3,
            copies: [
                { copyId: 'C1', occupiedBy: null },
                { copyId: 'C2', occupiedBy: null },
                { copyId: 'C3', occupiedBy: 'student3' }
            ]
        }
    ]);

    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        totalCopies: 1
    });

    const [selectedBook, setSelectedBook] = useState('');
    const [copyOperation, setCopyOperation] = useState('add');
    const [copyCount, setCopyCount] = useState(1);
    const [selectedCopies, setSelectedCopies] = useState([]);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddBook = (e) => {
        e.preventDefault();
        if (!newBook.title || !newBook.totalCopies) {
            showNotification('Title and total copies are required', 'error');
            return;
        }

        if (newBook.isbn && books.some(book => book.isbn === newBook.isbn)) {
            showNotification('Book with this ISBN already exists', 'error');
            return;
        }

        const copies = Array.from({ length: parseInt(newBook.totalCopies) }, (_, i) => ({
            copyId: `C${i + 1}`,
            occupiedBy: null
        }));

        const bookToAdd = {
            _id: Date.now().toString(),
            ...newBook,
            totalCopies: parseInt(newBook.totalCopies),
            copies
        };

        setBooks([...books, bookToAdd]);
        setNewBook({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });
        showNotification('Book added successfully!');
    };

    const handleCopyOperation = (e) => {
        e.preventDefault();
        const book = books.find(b => b._id === selectedBook);
        if (!book) {
            showNotification('Please select a book', 'error');
            return;
        }

        if (copyOperation === 'add') {
            const currentCount = book.copies.length;
            const newCopies = Array.from({ length: parseInt(copyCount) }, (_, i) => ({
                copyId: `C${currentCount + i + 1}`,
                occupiedBy: null
            }));

            const updatedBooks = books.map(b =>
                b._id === selectedBook
                    ? {
                        ...b,
                        copies: [...b.copies, ...newCopies],
                        totalCopies: b.totalCopies + parseInt(copyCount)
                    }
                    : b
            );
            setBooks(updatedBooks);
            showNotification(`${copyCount} copies added successfully!`);
        } else {
            if (selectedCopies.length === 0) {
                showNotification('Please select copies to delete', 'error');
                return;
            }

            const updatedBooks = books.map(b =>
                b._id === selectedBook
                    ? {
                        ...b,
                        copies: b.copies.filter(copy => !selectedCopies.includes(copy.copyId)),
                        totalCopies: b.copies.length - selectedCopies.length
                    }
                    : b
            );
            setBooks(updatedBooks);
            setSelectedCopies([]);
            showNotification(`${selectedCopies.length} copies deleted successfully!`);
        }

        setCopyCount(1);
        setSelectedBook('');
    };

    const handleCopySelection = (copyId) => {
        setSelectedCopies(prev =>
            prev.includes(copyId)
                ? prev.filter(id => id !== copyId)
                : [...prev, copyId]
        );
    };

    const selectedBookData = books.find(b => b._id === selectedBook);

    return (
        <div className="min-h-screen">


            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('addBook')}
                        className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'addBook'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Book size={20} />
                            Add New Book
                        </div>
                    </button>
                          <button
                        onClick={() => setActiveTab('deleteBook')}
                        className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'deleteBook'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Book size={20} />
                            Delete Book
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('manageCopies')}
                        className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'manageCopies'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Copy size={20} />
                            Manage Copies
                        </div>
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'addBook' && (
                        <form onSubmit={handleAddBook} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Book Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newBook.title}
                                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter book title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        value={newBook.author}
                                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter author name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        ISBN
                                    </label>
                                    <input
                                        type="text"
                                        value={newBook.isbn}
                                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter ISBN (optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={newBook.category}
                                        onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter category"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Total Copies *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newBook.totalCopies}
                                        onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Add Book
                            </button>
                        </form>
                    )}

                    {activeTab === 'deleteBook' && (
                        <form onSubmit={() =>{console.log(deleted);
                        }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Select Book
                                </label>
                                <select
                                    value={selectedBook}
                                    onChange={(e) => {
                                        setSelectedBook(e.target.value);
                                        setSelectedCopies([]);
                                    }}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Choose a book...</option>
                                    {books.map(book => (
                                        <option key={book._id} value={book._id}>
                                            {book.title} - {book.author} (Total: {book.totalCopies})
                                        </option>
                                    ))}
                                </select>
                            </div>

                             
                            </div>

                            <button
                                type="submit"
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={20} />
                                Delete Book
                            </button>
                        </form>
                    )}


                    {activeTab === 'manageCopies' && (
                        <div className="space-y-6">
                            {/* Book Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Select Book
                                </label>
                                <select
                                    value={selectedBook}
                                    onChange={(e) => {
                                        setSelectedBook(e.target.value);
                                        setSelectedCopies([]);
                                    }}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Choose a book...</option>
                                    {books.map(book => (
                                        <option key={book._id} value={book._id}>
                                            {book.title} - {book.author} (Total: {book.totalCopies})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Operation Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Operation
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCopyOperation('add');
                                            setSelectedCopies([]);
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${copyOperation === 'add'
                                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                                : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
                                            }`}
                                    >
                                        <Plus size={16} />
                                        Add Copies
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCopyOperation('delete');
                                            setSelectedCopies([]);
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${copyOperation === 'delete'
                                                ? 'bg-red-100 text-red-800 border-2 border-red-300'
                                                : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
                                            }`}
                                    >
                                        <Minus size={16} />
                                        Delete Copies
                                    </button>
                                </div>
                            </div>

                            {copyOperation === 'add' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Number of Copies to Add
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={copyCount}
                                        onChange={(e) => setCopyCount(e.target.value)}
                                        className="w-full max-w-xs px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            )}

                            {copyOperation === 'delete' && selectedBookData && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Select Copies to Delete
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {selectedBookData.copies.map((copy) => (
                                            <button
                                                key={copy.copyId}
                                                type="button"
                                                onClick={() => handleCopySelection(copy.copyId)}
                                                disabled={copy.occupiedBy}
                                                className={`p-3 rounded-lg border-2 transition-colors font-semibold text-sm ${copy.occupiedBy
                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                        : selectedCopies.includes(copy.copyId)
                                                            ? 'bg-red-100 text-red-800 border-red-300'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50'
                                                    }`}
                                            >
                                                {copy.copyId}
                                                {copy.occupiedBy && <div className="text-xs mt-1">Occupied</div>}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedCopies.length > 0 && (
                                        <p className="mt-2 text-sm text-slate-600">
                                            {selectedCopies.length} copy(ies) selected for deletion
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleCopyOperation}
                                disabled={!selectedBook}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${!selectedBook
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : copyOperation === 'add'
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                            >
                                {copyOperation === 'add' ? <Plus size={20} /> : <Minus size={20} />}
                                {copyOperation === 'add' ? 'Add Copies' : 'Delete Selected Copies'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Books Summary */}
            <div className="bg-white">
                {/* Excel-style header */}
                <div className="bg-gray-50 border-b border-gray-300 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold text-gray-800">Library Collection</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Book size={16} />
                                <span>{books.length} books</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                <Filter size={14} />
                                Filter
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                <Download size={14} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                <div className="bg-white border-b border-gray-300 px-4 py-2">
                    <div className="relative max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Excel-style table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        {/* Table header */}
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="text-left p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm">#</th>
                                <th className="text-left p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm min-w-[200px]">Title</th>
                                <th className="text-left p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm min-w-[150px]">Author</th>
                                <th className="text-left p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm">Category</th>
                                <th className="text-center p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm">Total</th>
                                <th className="text-center p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm">Available</th>
                                <th className="text-center p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm">Occupied</th>
                                <th className="text-center p-3 font-semibold text-gray-700 border-r border-gray-300 text-sm">Occupancy %</th>
                                <th className="text-left p-3 font-semibold text-gray-700 text-sm min-w-[120px]">Status</th>
                            </tr>
                        </thead>

                        {/* Table body */}
                        <tbody>
                            {books.map((book, index) => {
                                const availableCopies = book.copies.filter(copy => !copy.occupiedBy).length;
                                const occupiedCopies = book.copies.filter(copy => copy.occupiedBy).length;
                                const occupancyRate = (occupiedCopies / book.totalCopies) * 100;

                                return (
                                    <tr
                                        key={book._id}
                                        className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                                    >
                                        <td className="p-3 text-sm text-gray-600 border-r border-gray-200 font-mono">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="p-3 text-sm font-medium text-gray-800 border-r border-gray-200">
                                            {book.title}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 border-r border-gray-200">
                                            {book.author}
                                        </td>
                                        <td className="p-3 text-sm border-r border-gray-200">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${book.category === 'Fiction' ? 'bg-green-100 text-green-800' :
                                                    book.category === 'Classic' ? 'bg-purple-100 text-purple-800' :
                                                        book.category === 'Technical' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-center font-mono border-r border-gray-200">
                                            {book.totalCopies}
                                        </td>
                                        <td className="p-3 text-sm text-center font-mono font-semibold text-green-600 border-r border-gray-200">
                                            {availableCopies}
                                        </td>
                                        <td className="p-3 text-sm text-center font-mono font-semibold text-red-600 border-r border-gray-200">
                                            {occupiedCopies}
                                        </td>
                                        <td className="p-3 text-sm text-center font-mono border-r border-gray-200">
                                            {occupancyRate.toFixed(1)}%
                                        </td>
                                        <td className="p-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${occupancyRate > 80 ? 'bg-red-500' :
                                                                occupancyRate > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${occupancyRate}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-medium ${occupancyRate > 80 ? 'text-red-600' :
                                                        occupancyRate > 50 ? 'text-yellow-600' : 'text-green-600'
                                                    }`}>
                                                    {occupancyRate > 80 ? 'High' : occupancyRate > 50 ? 'Medium' : 'Low'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {books.length === 0 && (
                    <div className="text-center py-16 bg-gray-50">
                        <Book size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No books in library</h3>
                        <p className="text-gray-500">Import your first book collection to get started</p>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Import Books
                        </button>
                    </div>
                )}

                {/* Footer with summary */}
                <div className="bg-gray-100 border-t border-gray-300 px-4 py-2">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Showing {books.length} of {books.length} books</span>
                        <div className="flex gap-4">
                            <span>Total Books: {books.reduce((sum, book) => sum + book.totalCopies, 0)}</span>
                            <span>Available: {books.reduce((sum, book) => sum + book.copies.filter(copy => !copy.occupiedBy).length, 0)}</span>
                            <span>Occupied: {books.reduce((sum, book) => sum + book.copies.filter(copy => copy.occupiedBy).length, 0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeLibrarianAddBook;
