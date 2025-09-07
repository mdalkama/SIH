import React, { useState } from 'react';
import { Search, User, Book, Calendar, Clock, CheckCircle, AlertCircle, BookOpen, ArrowLeft, AlertTriangle, FileText, Eye } from 'lucide-react';

const CollegeLibrarianTrackReturn = () => {
  const [searchType, setSearchType] = useState('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnCondition, setReturnCondition] = useState('good');
  const [returnNotes, setReturnNotes] = useState('');
  const [fine, setFine] = useState(0);
  const [returnComplete, setReturnComplete] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Mock data for issued books
  const mockIssuedBooks = [
    {
      issueId: 'ISS001',
      student: {
        name: 'Rahul Kumar',
        regNo: 'REG001',
        course: 'B.Tech Computer Science',
        branch: 'Computer Science & Engineering',
        email: 'rahul.kumar@college.edu',
        phone: '+91 9876543210'
      },
      book: {
        title: 'Data Structures and Algorithms',
        author: 'Thomas H. Cormen',
        isbn: '978-0262033848',
        copyId: 'DSA001'
      },
      issueDate: new Date('2024-08-15'),
      dueDate: new Date('2024-08-29'),
      issuedBy: 'Smt. Kavita Gupta',
      status: 'issued',
      isOverdue: true,
      daysOverdue: 9
    },
    {
      issueId: 'ISS002',
      student: {
        name: 'Priya Sharma',
        regNo: 'REG002',
        course: 'B.Tech Electronics',
        branch: 'Electronics & Communication',
        email: 'priya.sharma@college.edu',
        phone: '+91 9876543211'
      },
      book: {
        title: 'Digital Signal Processing',
        author: 'Alan V. Oppenheim',
        isbn: '978-0131988422',
        copyId: 'DSP001'
      },
      issueDate: new Date('2024-08-25'),
      dueDate: new Date('2024-09-08'),
      issuedBy: 'Smt. Kavita Gupta',
      status: 'issued',
      isOverdue: false,
      daysOverdue: 0
    },
    {
      issueId: 'ISS003',
      student: {
        name: 'Rahul Kumar',
        regNo: 'REG001',
        course: 'B.Tech Computer Science',
        branch: 'Computer Science & Engineering',
        email: 'rahul.kumar@college.edu',
        phone: '+91 9876543210'
      },
      book: {
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        isbn: '978-0073523323',
        copyId: 'DBS001'
      },
      issueDate: new Date('2024-08-20'),
      dueDate: new Date('2024-09-03'),
      issuedBy: 'Smt. Kavita Gupta',
      status: 'issued',
      isOverdue: true,
      daysOverdue: 4
    }
  ];

  const handleSearch = () => {
    let results = [];
    
    if (searchType === 'student') {
      results = mockIssuedBooks.filter(issue => 
        issue.student.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === 'book') {
      results = mockIssuedBooks.filter(issue => 
        issue.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.book.copyId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === 'issueId') {
      results = mockIssuedBooks.filter(issue => 
        issue.issueId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setSearchResults(results);
  };

  const calculateFine = (daysOverdue) => {
    return daysOverdue * 2; // ₹2 per day
  };

  const handleReturnProcess = (issue) => {
    setSelectedIssue(issue);
    setShowReturnForm(true);
    if (issue.isOverdue) {
      setFine(calculateFine(issue.daysOverdue));
    } else {
      setFine(0);
    }
  };

  const handleReturnBook = () => {
    setReturnComplete(true);
    setTimeout(() => {
      setReturnComplete(false);
      setShowReturnForm(false);
      setSelectedIssue(null);
      setSearchQuery('');
      setSearchResults([]);
      setReturnCondition('good');
      setReturnNotes('');
      setFine(0);
    }, 3000);
  };

  const currentDateTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  if (returnComplete) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Returned Successfully!</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Student:</strong> {selectedIssue?.student?.name}</p>
              <p><strong>Book:</strong> {selectedIssue?.book?.title}</p>
              <p><strong>Copy ID:</strong> {selectedIssue?.book?.copyId}</p>
              <p><strong>Return Date:</strong> {currentDateTime}</p>
              {fine > 0 && <p><strong>Fine Collected:</strong> ₹{fine}</p>}
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Redirecting to main form in a few seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showReturnForm && selectedIssue) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowReturnForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Return Book</h1>
                  <p className="text-sm text-gray-600">Process book return</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div className="font-medium">Return Date</div>
                <div>{currentDateTime}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Issue Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Issue Details</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Student Information</div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-800">{selectedIssue.student.name}</div>
                    <div className="text-sm text-gray-600">{selectedIssue.student.regNo}</div>
                    <div className="text-sm text-gray-600">{selectedIssue.student.course}</div>
                    <div className="text-sm text-gray-600">{selectedIssue.student.email}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Book Information</div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-800">{selectedIssue.book.title}</div>
                    <div className="text-sm text-gray-600">by {selectedIssue.book.author}</div>
                    <div className="text-sm text-gray-600">Copy ID: {selectedIssue.book.copyId}</div>
                    <div className="text-sm text-gray-600">ISBN: {selectedIssue.book.isbn}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600 mb-1">Issue Date</div>
                    <div className="font-medium text-blue-800">
                      {selectedIssue.issueDate.toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 ${selectedIssue.isOverdue ? 'bg-red-50' : 'bg-green-50'}`}>
                    <div className={`text-sm mb-1 ${selectedIssue.isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                      Due Date
                    </div>
                    <div className={`font-medium ${selectedIssue.isOverdue ? 'text-red-800' : 'text-green-800'}`}>
                      {selectedIssue.dueDate.toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>

                {selectedIssue.isOverdue && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-red-700 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Overdue Book</span>
                    </div>
                    <div className="text-sm text-red-600">
                      {selectedIssue.daysOverdue} days overdue
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Return Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Return Processing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Condition on Return
                  </label>
                  <select
                    value={returnCondition}
                    onChange={(e) => setReturnCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="damaged">Damaged</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Notes (Optional)
                  </label>
                  <textarea
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    rows={3}
                    placeholder="Add any notes about the book condition or return process..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {fine > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-yellow-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Fine Applicable</span>
                    </div>
                    <div className="text-sm text-yellow-600 mb-2">
                      Late return fine: ₹2 per day × {selectedIssue.daysOverdue} days
                    </div>
                    <div className="text-lg font-bold text-yellow-800">
                      Total Fine: ₹{fine}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Return Summary</div>
                  <div className="space-y-1 text-sm">
                    <div><strong>Processed by:</strong> Smt. Kavita Gupta</div>
                    <div><strong>Return Date:</strong> {new Date().toLocaleDateString('en-IN')}</div>
                    <div><strong>Return Time:</strong> {new Date().toLocaleTimeString('en-IN')}</div>
                  </div>
                </div>

                <button
                  onClick={handleReturnBook}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Process Return
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
   

      <div className="max-w-7xl mx-auto ">
        
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Search Issued Books</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search By
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="student">Student (Name/Reg No)</option>
                <option value="book">Book (Title/Author/Copy ID)</option>
                <option value="issueId">Issue ID</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Enter ${searchType === 'student' ? 'student name or registration number' : 
                             searchType === 'book' ? 'book title, author or copy ID' : 'issue ID'}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600 mb-3">
                Found {searchResults.length} issued book(s)
              </div>
              
              <div className="space-y-3">
                {searchResults.map((issue) => (
                  <div
                    key={issue.issueId}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      
                      {/* Student Info */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Student</div>
                        <div className="font-medium text-gray-800">{issue.student.name}</div>
                        <div className="text-sm text-gray-600">{issue.student.regNo}</div>
                      </div>

                      {/* Book Info */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Book</div>
                        <div className="font-medium text-gray-800">{issue.book.title}</div>
                        <div className="text-sm text-gray-600">Copy: {issue.book.copyId}</div>
                      </div>

                      {/* Status */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        <div className="flex items-center space-x-2">
                          {issue.isOverdue ? (
                            <>
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                Overdue
                              </span>
                              <span className="text-sm text-red-600">
                                {issue.daysOverdue} days
                              </span>
                            </>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              On Time
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Due: {issue.dueDate.toLocaleDateString('en-IN')}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReturnProcess(issue)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Return</span>
                        </button>
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="border-t border-gray-200 pt-4 text-center text-gray-500">
              No issued books found matching your search criteria.
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {mockIssuedBooks.length}
                </div>
                <div className="text-sm text-gray-600">Total Issued Books</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {mockIssuedBooks.filter(book => book.isOverdue).length}
                </div>
                <div className="text-sm text-gray-600">Overdue Books</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  ₹{mockIssuedBooks.filter(book => book.isOverdue).reduce((sum, book) => sum + calculateFine(book.daysOverdue), 0)}
                </div>
                <div className="text-sm text-gray-600">Pending Fines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed View Modal */}
        {selectedIssue && !showReturnForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Issue Details</h2>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Issue Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Issue ID:</span>
                        <div className="font-medium text-blue-800">{selectedIssue.issueId}</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Issued By:</span>
                        <div className="font-medium text-blue-800">{selectedIssue.issuedBy}</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Issue Date:</span>
                        <div className="font-medium text-blue-800">{selectedIssue.issueDate.toLocaleDateString('en-IN')}</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Due Date:</span>
                        <div className="font-medium text-blue-800">{selectedIssue.dueDate.toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Student Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedIssue.student.name}</div>
                      <div><strong>Registration:</strong> {selectedIssue.student.regNo}</div>
                      <div><strong>Course:</strong> {selectedIssue.student.course}</div>
                      <div><strong>Branch:</strong> {selectedIssue.student.branch}</div>
                      <div><strong>Email:</strong> {selectedIssue.student.email}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Book Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {selectedIssue.book.title}</div>
                      <div><strong>Author:</strong> {selectedIssue.book.author}</div>
                      <div><strong>ISBN:</strong> {selectedIssue.book.isbn}</div>
                      <div><strong>Copy ID:</strong> {selectedIssue.book.copyId}</div>
                    </div>
                  </div>

                  {selectedIssue.isOverdue && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-800 mb-2 flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Overdue Information</span>
                      </h3>
                      <div className="space-y-1 text-sm text-red-700">
                        <div>Days Overdue: {selectedIssue.daysOverdue}</div>
                        <div>Fine Amount: ₹{calculateFine(selectedIssue.daysOverdue)}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handleReturnProcess(selectedIssue)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Process Return
                  </button>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CollegeLibrarianTrackReturn;
