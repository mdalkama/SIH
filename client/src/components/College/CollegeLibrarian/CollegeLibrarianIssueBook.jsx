import React, { useState } from 'react';
import { Search, User, Book, Calendar, Clock, CheckCircle, AlertCircle, BookOpen, UserCheck } from 'lucide-react';

const CollegeLibrarianIssueBook = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [issueComplete, setIssueComplete] = useState(false);

  // Mock data for demonstration
  const mockStudents = {
    'REG001': {
      name: 'Rahul Kumar',
      regNo: 'REG001',
      course: 'B.Tech Computer Science',
      branch: 'Computer Science & Engineering',
      year: '3rd Year',
      email: 'rahul.kumar@college.edu',
      phone: '+91 9876543210',
      booksIssued: 3,
      maxBooks: 5
    },
    'REG002': {
      name: 'Priya Sharma',
      regNo: 'REG002',
      course: 'B.Tech Electronics',
      branch: 'Electronics & Communication',
      year: '2nd Year',
      email: 'priya.sharma@college.edu',
      phone: '+91 9876543211',
      booksIssued: 2,
      maxBooks: 5
    }
  };

  const mockBooks = [
    {
      id: 1,
      title: 'Data Structures and Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      category: 'Computer Science',
      totalCopies: 5,
      availableCopies: [
        { copyId: 'DSA001', status: 'available', condition: 'good' },
        { copyId: 'DSA002', status: 'available', condition: 'excellent' },
        { copyId: 'DSA003', status: 'issued', condition: 'good' }
      ]
    },
    {
      id: 2,
      title: 'Digital Signal Processing',
      author: 'Alan V. Oppenheim',
      isbn: '978-0131988422',
      category: 'Electronics',
      totalCopies: 3,
      availableCopies: [
        { copyId: 'DSP001', status: 'available', condition: 'good' },
        { copyId: 'DSP002', status: 'available', condition: 'fair' }
      ]
    }
  ];

  const handleStudentSearch = () => {
    const student = mockStudents[registrationNumber.toUpperCase()];
    setStudentDetails(student || null);
  };

  const handleBookSearch = (query) => {
    return mockBooks.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleIssueBook = () => {
    if (studentDetails && selectedBook && selectedCopy) {
      setIssueComplete(true);
      setTimeout(() => {
        setIssueComplete(false);
        setStudentDetails(null);
        setSelectedBook(null);
        setSelectedCopy(null);
        setRegistrationNumber('');
        setSearchQuery('');
      }, 3000);
    }
  };

  const currentDateTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  if (issueComplete) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Issued Successfully!</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Student:</strong> {studentDetails?.name}</p>
              <p><strong>Book:</strong> {selectedBook?.title}</p>
              <p><strong>Copy ID:</strong> {selectedCopy?.copyId}</p>
              <p><strong>Issue Date:</strong> {currentDateTime}</p>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Redirecting to main form in a few seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Student Search Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Student Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="Enter registration number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleStudentSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {studentDetails && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Student Found</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {studentDetails.name}</div>
                    <div><strong>Course:</strong> {studentDetails.course}</div>
                    <div><strong>Branch:</strong> {studentDetails.branch}</div>
                    <div><strong>Year:</strong> {studentDetails.year}</div>
                    <div><strong>Email:</strong> {studentDetails.email}</div>
                    <div><strong>Books Issued:</strong> {studentDetails.booksIssued}/{studentDetails.maxBooks}</div>
                  </div>
                  
                  {studentDetails.booksIssued >= studentDetails.maxBooks && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Maximum book limit reached</span>
                    </div>
                  )}
                </div>
              )}

              {registrationNumber && !studentDetails && (
                <div className="text-red-600 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Student not found</span>
                </div>
              )}
            </div>
          </div>

          {/* Book Search Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Book className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Select Book</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Books
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {handleBookSearch(searchQuery).map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedBook?.id === book.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{book.title}</div>
                    <div className="text-sm text-gray-600">by {book.author}</div>
                    <div className="text-sm text-gray-500">
                      Available: {book.availableCopies.filter(c => c.status === 'available').length} of {book.totalCopies}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Selection */}
            {selectedBook && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Select Copy</h3>
                <div className="space-y-2">
                  {selectedBook.availableCopies
                    .filter(copy => copy.status === 'available')
                    .map((copy) => (
                      <div
                        key={copy.copyId}
                        onClick={() => setSelectedCopy(copy)}
                        className={`p-2 rounded border cursor-pointer transition-colors ${
                          selectedCopy?.copyId === copy.copyId
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{copy.copyId}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            copy.condition === 'excellent' ? 'bg-green-100 text-green-700' :
                            copy.condition === 'good' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {copy.condition}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Issue Summary Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Issue Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Issue Date & Time</span>
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {currentDateTime}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Issuing Librarian</div>
                  <div className="font-medium text-gray-800">Smt. Kavita Gupta</div>
                  <div className="text-sm text-gray-500">Head Librarian</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Student</div>
                  <div className="font-medium text-gray-800">
                    {studentDetails ? studentDetails.name : 'Not selected'}
                  </div>
                  {studentDetails && (
                    <div className="text-sm text-gray-500">{studentDetails.regNo}</div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Book</div>
                  <div className="font-medium text-gray-800">
                    {selectedBook ? selectedBook.title : 'Not selected'}
                  </div>
                  {selectedBook && (
                    <div className="text-sm text-gray-500">by {selectedBook.author}</div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Copy ID</div>
                  <div className="font-medium text-gray-800">
                    {selectedCopy ? selectedCopy.copyId : 'Not selected'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Due Date</div>
                  <div className="font-medium text-gray-800">
                    {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-500">14 days from issue date</div>
                </div>
              </div>

              <button
                onClick={handleIssueBook}
                disabled={!studentDetails || !selectedBook || !selectedCopy || (studentDetails?.booksIssued >= studentDetails?.maxBooks)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Issue Book
              </button>

              {studentDetails?.booksIssued >= studentDetails?.maxBooks && (
                <div className="text-red-600 text-sm text-center">
                  Cannot issue: Maximum book limit reached
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CollegeLibrarianIssueBook;