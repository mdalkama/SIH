import React, { useState } from 'react';
import {
  User,
  Home,
  BookOpen,
  CreditCard,
  Award,
  LogOut,
  Edit3,
  Save,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Building,
  FileText,
  DollarSign,
  Trophy,
  Bed
} from 'lucide-react';

const Student = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);

  // Mock student data based on schema
  const [studentData, setStudentData] = useState({
    name: "Rahul Kumar Singh",
    fatherName: "Ram Kumar Singh",
    motherName: "Sita Devi",
    guardianName: "",
    parentsNumber: "+91 9876543210",
    dob: "2002-05-15",
    gender: "male",
    aadharNumber: "1234-5678-9012",
    abcNumber: "ABC123456789",
    caste: "General",
    religion: "Hindu",
    category: "General",
    email: "rahul.singh@student.college.edu",
    phone: "+91 8765432109",
    alternatePhone: "+91 9876543211",
    address: {
      street: "123 MG Road",
      city: "Patna",
      state: "Bihar",
      zipCode: "800001",
      country: "India"
    },
    registrationNumber: "REG2023001",
    rollNumber: "CSE2023001",
    college: "Government Engineering College",
    degree: "B.Tech",
    branch: "Computer Science",
    specialization: "Artificial Intelligence",
    semester: 6,
    yearOfAdmission: 2021,
    yearOfPassing: 2025,
    status: "active",
    role: "student"
  });

  // Mock data for other sections
  const [hostelData] = useState({
    roomNumber: "A-201",
    hostelName: "Aryabhata Hostel",
    roommate: "Amit Sharma",
    fees: "₹15,000/semester",
    warden: "Dr. P.K. Verma",
    checkIn: "2021-08-15",
    facilities: ["WiFi", "Laundry", "Mess", "Study Hall", "Gym"]
  });

  const [libraryData] = useState({
    membershipId: "LIB2021001",
    booksIssued: [
      { title: "Data Structures and Algorithms", author: "Thomas Cormen", issueDate: "2024-08-15", returnDate: "2024-09-15" },
      { title: "Computer Networks", author: "Andrew Tanenbaum", issueDate: "2024-08-20", returnDate: "2024-09-20" }
    ],
    finesDue: "₹50",
    maxBooks: 5,
    currentBooks: 2
  });

  const [feesData] = useState({
    totalFees: "₹80,000",
    paidFees: "₹60,000",
    pendingFees: "₹20,000",
    installments: [
      { semester: "5th", amount: "₹20,000", status: "Paid", date: "2024-01-15" },
      { semester: "6th", amount: "₹20,000", status: "Pending", dueDate: "2024-08-15" }
    ],
    scholarships: ["Merit Scholarship - ₹10,000", "State Scholarship - ₹5,000"]
  });

  const [resultData] = useState({
    cgpa: "8.4",
    sgpa: "8.6",
    semesters: [
      { sem: 1, sgpa: "7.8", status: "Pass" },
      { sem: 2, sgpa: "8.1", status: "Pass" },
      { sem: 3, sgpa: "8.3", status: "Pass" },
      { sem: 4, sgpa: "8.5", status: "Pass" },
      { sem: 5, sgpa: "8.7", status: "Pass" }
    ],
    subjects: [
      { name: "Machine Learning", credits: 4, grade: "A", points: 9 },
      { name: "Database Systems", credits: 4, grade: "A+", points: 10 },
      { name: "Software Engineering", credits: 3, grade: "B+", points: 8 }
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving student data:', studentData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateStudentData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setStudentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setStudentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'hostel', label: 'Hostel', icon: Bed },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'result', label: 'Results', icon: Award }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CGPA</p>
              <p className="text-2xl font-bold text-gray-900">{resultData.cgpa}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Room</p>
              <p className="text-2xl font-bold text-gray-900">{hostelData.roomNumber}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Books Issued</p>
              <p className="text-2xl font-bold text-gray-900">{libraryData.currentBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Fees</p>
              <p className="text-2xl font-bold text-gray-900">{feesData.pendingFees}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Trophy className="h-4 w-4 text-green-600 mr-2" />
              <span>5th Semester results published - SGPA: 8.7</span>
            </div>
            <div className="flex items-center text-sm">
              <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
              <span>Book issued: Computer Networks</span>
            </div>
            <div className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 text-orange-600 mr-2" />
              <span>6th Semester fees due on Aug 15, 2024</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab('fees')}
              className="p-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Pay Fees
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className="p-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Check Books
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className="p-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View Results
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="p-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Student Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={studentData.name}
                onChange={(e) => updateStudentData('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
              <input
                type="text"
                value={studentData.fatherName}
                onChange={(e) => updateStudentData('fatherName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
              <input
                type="text"
                value={studentData.motherName}
                onChange={(e) => updateStudentData('motherName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={studentData.dob}
                onChange={(e) => updateStudentData('dob', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={studentData.email}
                onChange={(e) => updateStudentData('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={studentData.phone}
                onChange={(e) => updateStudentData('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={`${studentData.address.street}, ${studentData.address.city}, ${studentData.address.state} - ${studentData.address.zipCode}`}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input
                type="text"
                value={studentData.registrationNumber}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={studentData.rollNumber}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                value={studentData.degree}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
              <input
                type="number"
                value={studentData.semester}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHostel = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Hostel Information</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Room Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Number:</span>
                <span className="font-medium">{hostelData.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hostel Name:</span>
                <span className="font-medium">{hostelData.hostelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Roommate:</span>
                <span className="font-medium">{hostelData.roommate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warden:</span>
                <span className="font-medium">{hostelData.warden}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fees & Duration</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Fees:</span>
                <span className="font-medium text-green-600">{hostelData.fees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in Date:</span>
                <span className="font-medium">{hostelData.checkIn}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {hostelData.facilities.map((facility, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">{facility}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Library Management</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{libraryData.currentBooks}/{libraryData.maxBooks}</div>
            <div className="text-sm text-gray-600">Books Issued</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{libraryData.membershipId}</div>
            <div className="text-sm text-gray-600">Membership ID</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{libraryData.finesDue}</div>
            <div className="text-sm text-gray-600">Fines Due</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Currently Issued Books</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {libraryData.booksIssued.map((book, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.issueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.returnDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFees = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Fee Management</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{feesData.totalFees}</div>
            <div className="text-sm text-gray-600">Total Fees</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{feesData.paidFees}</div>
            <div className="text-sm text-gray-600">Paid Amount</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{feesData.pendingFees}</div>
            <div className="text-sm text-gray-600">Pending Amount</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Installments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feesData.installments.map((installment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{installment.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{installment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${installment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {installment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {installment.status === 'Paid' ? installment.date : installment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {installment.status === 'Pending' && (
                        <button className="text-blue-600 hover:text-blue-900">Pay Now</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Scholarships & Benefits</h3>
          <div className="space-y-2">
            {feesData.scholarships.map((scholarship, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">{scholarship}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Academic Results</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{resultData.cgpa}</div>
            <div className="text-sm text-gray-600">Cumulative GPA</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{resultData.sgpa}</div>
            <div className="text-sm text-gray-600">Current Semester GPA</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Semester-wise Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SGPA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resultData.semesters.map((semester, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{semester.sem}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{semester.sgpa}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {semester.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Semester Subjects</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resultData.subjects.map((subject, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'hostel':
        return renderHostel();
      case 'library':
        return renderLibrary();
      case 'fees':
        return renderFees();
      case 'result':
        return renderResults();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student ERP Portal</h1>
                <p className="text-sm text-gray-500">{studentData.college}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{studentData.name}</p>
                <p className="text-xs text-gray-500">{studentData.rollNumber}</p>
              </div>
              <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Navigation</h2>
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;