import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen, 
  FileText, Edit3, Eye, Award, Clock, Users, Building,
  Save, Upload, CheckCircle, AlertCircle, Camera, Book, UserCheck
} from 'lucide-react';
import profileData from '../profileData.json';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [studentData, setStudentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('https://sih-4ptm.onrender.com/api/v1/my-profile', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          // Ensure all required fields have values, fallback to dummy data if missing
          const completeData = {
            ...profileData.student,
            ...data.user,
            _id: data.user._id || profileData.student._id || 'STU001',
            name: data.user.name || profileData.student.name || 'Student Name',
            email: data.user.email || profileData.student.email || 'student@university.edu',
            phone: data.user.phone || profileData.student.phone || '+91 9876543210',
            alternatePhone: data.user.alternatePhone || profileData.student.alternatePhone || '+91 9876543210',
            registrationNumber: data.user.registrationNumber || profileData.student.registrationNumber || 'STU-24-XXXX',
            rollNumber: data.user.rollNumber || profileData.student.rollNumber || '2024XXXXX',
            collegeCode: data.user.collegeCode || profileData.student.collegeCode || 'COLL001',
            semester: data.user.semester || profileData.student.semester || 1,
            yearOfAdmission: data.user.yearOfAdmission || profileData.student.yearOfAdmission || '2024',
            yearOfPassing: data.user.yearOfPassing || profileData.student.yearOfPassing || '2028',
            profilePictureLink: data.user.profilePictureLink || profileData.student.profilePictureLink || '/api/placeholder/150/150',
            personalDetails: {
              ...profileData.student.personalDetails,
              ...data.user.personalDetails,
              fatherName: data.user.personalDetails?.fatherName || profileData.student.personalDetails?.fatherName || 'Father Name',
              motherName: data.user.personalDetails?.motherName || profileData.student.personalDetails?.motherName || 'Mother Name',
              guardianName: data.user.personalDetails?.guardianName || profileData.student.personalDetails?.guardianName || 'Guardian Name',
              parentsNumber: data.user.personalDetails?.parentsNumber || profileData.student.personalDetails?.parentsNumber || '+91 9876543210',
              dob: data.user.personalDetails?.dob || profileData.student.personalDetails?.dob || '2005-01-01',
              gender: data.user.personalDetails?.gender || profileData.student.personalDetails?.gender || 'male',
              aadharNumber: data.user.personalDetails?.aadharNumber || profileData.student.personalDetails?.aadharNumber || '1234 5678 9012',
              abcNumber: data.user.personalDetails?.abcNumber || profileData.student.personalDetails?.abcNumber || 'ABC123456789',
              caste: data.user.personalDetails?.caste || profileData.student.personalDetails?.caste || 'General',
              religion: data.user.personalDetails?.religion || profileData.student.personalDetails?.religion || 'Hindu',
              category: data.user.personalDetails?.category || profileData.student.personalDetails?.category || 'General',
              bloodGroup: data.user.personalDetails?.bloodGroup || profileData.student.personalDetails?.bloodGroup || 'B+',
              nationality: data.user.personalDetails?.nationality || profileData.student.personalDetails?.nationality || 'Indian'
            },
            academicDetails: {
              ...profileData.student.academicDetails,
              ...data.user.academicDetails,
              course: data.user.academicDetails?.course || profileData.student.academicDetails?.course || 'B.Tech Computer Science',
              department: data.user.academicDetails?.department || profileData.student.academicDetails?.department || 'Computer Science & Engineering',
              section: data.user.academicDetails?.section || profileData.student.academicDetails?.section || 'A',
              currentCGPA: data.user.academicDetails?.currentCGPA || profileData.student.academicDetails?.currentCGPA || '8.5',
              attendance: data.user.academicDetails?.attendance || profileData.student.academicDetails?.attendance || '85%',
              currentSubjects: data.user.academicDetails?.currentSubjects || profileData.student.academicDetails?.currentSubjects || [],
              previousSemesterResults: data.user.academicDetails?.previousSemesterResults || profileData.student.academicDetails?.previousSemesterResults || []
            },
            address: {
              ...profileData.student.address,
              ...data.user.address,
              street: data.user.address?.street || profileData.student.address?.street || 'Student Address',
              city: data.user.address?.city || profileData.student.address?.city || 'City Name',
              state: data.user.address?.state || profileData.student.address?.state || 'State',
              zipCode: data.user.address?.zipCode || profileData.student.address?.zipCode || '000000',
              country: data.user.address?.country || profileData.student.address?.country || 'India'
            },
            emergencyContact: {
              ...profileData.student.emergencyContact,
              ...data.user.emergencyContact,
              name: data.user.emergencyContact?.name || profileData.student.emergencyContact?.name || 'Emergency Contact',
              phone: data.user.emergencyContact?.phone || profileData.student.emergencyContact?.phone || '+91 9876543210',
              relation: data.user.emergencyContact?.relation || profileData.student.emergencyContact?.relation || 'Relation'
            },
            hostelDetails: {
              ...profileData.student.hostelDetails,
              ...data.user.hostelDetails,
              allocated: data.user.hostelDetails?.allocated !== undefined ? data.user.hostelDetails.allocated : (profileData.student.hostelDetails?.allocated || false),
              hostelName: data.user.hostelDetails?.hostelName || profileData.student.hostelDetails?.hostelName || '',
              roomNumber: data.user.hostelDetails?.roomNumber || profileData.student.hostelDetails?.roomNumber || '',
              floor: data.user.hostelDetails?.floor || profileData.student.hostelDetails?.floor || 0
            },
            libraryDetails: {
              ...profileData.student.libraryDetails,
              ...data.user.libraryDetails,
              booksIssued: data.user.libraryDetails?.booksIssued || profileData.student.libraryDetails?.booksIssued || 0,
              maxBooks: data.user.libraryDetails?.maxBooks || profileData.student.libraryDetails?.maxBooks || 5,
              fine: data.user.libraryDetails?.fine || profileData.student.libraryDetails?.fine || 0
            },
            status: data.user.status || profileData.student.status || 'active'
          };
          setStudentData(completeData);
          console.log('Real student data with fallbacks:', completeData);
        } else {
          // Fallback to dummy data with placeholders
          const dummyData = {
            ...profileData.student,
            name: profileData.student.name || 'Student Name',
            email: profileData.student.email || 'student@university.edu',
            phone: profileData.student.phone || '+91 9876543210',
            registrationNumber: profileData.student.registrationNumber || 'STU-24-XXXX',
            rollNumber: profileData.student.rollNumber || '2024XXXXX',
            personalDetails: {
              ...profileData.student.personalDetails,
              fatherName: profileData.student.personalDetails?.fatherName || 'Father Name',
              motherName: profileData.student.personalDetails?.motherName || 'Mother Name',
              dob: profileData.student.personalDetails?.dob || '2005-01-01',
              gender: profileData.student.personalDetails?.gender || 'male',
              bloodGroup: profileData.student.personalDetails?.bloodGroup || 'B+'
            },
            academicDetails: {
              ...profileData.student.academicDetails,
              course: profileData.student.academicDetails?.course || 'B.Tech Computer Science',
              department: profileData.student.academicDetails?.department || 'Computer Science & Engineering',
              currentCGPA: profileData.student.academicDetails?.currentCGPA || '8.5',
              attendance: profileData.student.academicDetails?.attendance || '85%'
            },
            address: {
              ...profileData.student.address,
              street: profileData.student.address?.street || 'Student Address',
              city: profileData.student.address?.city || 'City Name',
              state: profileData.student.address?.state || 'State',
              zipCode: profileData.student.address?.zipCode || '000000'
            }
          };
          setStudentData(dummyData);
          console.log('Using dummy student data with placeholders');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        // Fallback to dummy data with placeholders
        const dummyData = {
          ...profileData.student,
          _id: profileData.student._id || 'STU001',
          name: profileData.student.name || 'Student Name',
          email: profileData.student.email || 'student@university.edu',
          phone: profileData.student.phone || '+91 9876543210',
          alternatePhone: profileData.student.alternatePhone || '+91 9876543210',
          registrationNumber: profileData.student.registrationNumber || 'STU-24-XXXX',
          rollNumber: profileData.student.rollNumber || '2024XXXXX',
          collegeCode: profileData.student.collegeCode || 'COLL001',
          semester: profileData.student.semester || 1,
          yearOfAdmission: profileData.student.yearOfAdmission || '2024',
          yearOfPassing: profileData.student.yearOfPassing || '2028',
          profilePictureLink: profileData.student.profilePictureLink || '/api/placeholder/150/150',
          personalDetails: {
            ...profileData.student.personalDetails,
            fatherName: profileData.student.personalDetails?.fatherName || 'Father Name',
            motherName: profileData.student.personalDetails?.motherName || 'Mother Name',
            guardianName: profileData.student.personalDetails?.guardianName || 'Guardian Name',
            parentsNumber: profileData.student.personalDetails?.parentsNumber || '+91 9876543210',
            dob: profileData.student.personalDetails?.dob || '2005-01-01',
            gender: profileData.student.personalDetails?.gender || 'male',
            aadharNumber: profileData.student.personalDetails?.aadharNumber || '1234 5678 9012',
            abcNumber: profileData.student.personalDetails?.abcNumber || 'ABC123456789',
            caste: profileData.student.personalDetails?.caste || 'General',
            religion: profileData.student.personalDetails?.religion || 'Hindu',
            category: profileData.student.personalDetails?.category || 'General',
            bloodGroup: profileData.student.personalDetails?.bloodGroup || 'B+',
            nationality: profileData.student.personalDetails?.nationality || 'Indian'
          },
          academicDetails: {
            ...profileData.student.academicDetails,
            course: profileData.student.academicDetails?.course || 'B.Tech Computer Science',
            department: profileData.student.academicDetails?.department || 'Computer Science & Engineering',
            section: profileData.student.academicDetails?.section || 'A',
            currentCGPA: profileData.student.academicDetails?.currentCGPA || '8.5',
            attendance: profileData.student.academicDetails?.attendance || '85%',
            currentSubjects: profileData.student.academicDetails?.currentSubjects || [],
            previousSemesterResults: profileData.student.academicDetails?.previousSemesterResults || []
          },
          address: {
            ...profileData.student.address,
            street: profileData.student.address?.street || 'Student Address',
            city: profileData.student.address?.city || 'City Name',
            state: profileData.student.address?.state || 'State',
            zipCode: profileData.student.address?.zipCode || '000000',
            country: profileData.student.address?.country || 'India'
          },
          emergencyContact: {
            ...profileData.student.emergencyContact,
            name: profileData.student.emergencyContact?.name || 'Emergency Contact',
            phone: profileData.student.emergencyContact?.phone || '+91 9876543210',
            relation: profileData.student.emergencyContact?.relation || 'Relation'
          },
          hostelDetails: {
            ...profileData.student.hostelDetails,
            allocated: profileData.student.hostelDetails?.allocated || false,
            hostelName: profileData.student.hostelDetails?.hostelName || '',
            roomNumber: profileData.student.hostelDetails?.roomNumber || '',
            floor: profileData.student.hostelDetails?.floor || 0
          },
          libraryDetails: {
            ...profileData.student.libraryDetails,
            booksIssued: profileData.student.libraryDetails?.booksIssued || 0,
            maxBooks: profileData.student.libraryDetails?.maxBooks || 5,
            fine: profileData.student.libraryDetails?.fine || 0
          },
          status: profileData.student.status || 'active'
        };
        setStudentData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(studentData);
  };

  const handleSave = async () => {
    try {
      console.log('Saving student data:', editedData);
      
      // Update local state immediately
      setStudentData(editedData);
      
      // Try to save to backend
      const response = await fetch('https://sih-4ptm.onrender.com/api/v1/student/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedData)
      });
      
      if (response.ok) {
        console.log('Profile saved to backend successfully');
        alert('Profile updated successfully!');
      } else {
        console.log('Backend save failed, but local changes saved');
        alert('Profile updated locally (backend connection failed)');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Profile updated locally (backend connection failed)');
    }
    
    setIsEditing(false);
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setEditedData(prev => ({
        ...prev,
        [nested]: { ...prev[nested], [field]: value }
      }));
    } else {
      setEditedData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = (fieldName, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setStudentData(prev => ({
          ...prev,
          profilePictureLink: imageUrl
        }));
        console.log('Profile picture uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'notifications', label: 'Notifications', icon: AlertCircle }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1e40af]">Personal Information</h3>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-xl hover:bg-[#1d4ed8] transition-colors"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#10b981] text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative">
              <img
                src={studentData.profilePictureLink || '/api/placeholder/150/150'}
                alt="Profile"
                className="w-32 h-32 rounded-xl object-cover border-4 border-[#3b82f6]"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#1e40af] text-white p-2 rounded-xl cursor-pointer hover:bg-[#1d4ed8]">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('profilePicture', e.target.files[0])}
                  />
                </label>
              )}
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium text-sm">Active Student</span>
              </div>
            </div>
          </div>

          {/* Basic Info Fields */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', editable: false }, // Only admin can edit
              { key: 'registrationNumber', label: 'Registration Number', editable: false, className: 'text-blue-600 font-medium' },
              { key: 'rollNumber', label: 'Roll Number', editable: false },
              { key: 'email', label: 'Email ID', editable: false, type: 'email' }, // Only admin can edit
              { key: 'phone', label: 'Phone Number', editable: true, type: 'tel' },
              { key: 'personalDetails.dob', label: 'Date of Birth', editable: false, type: 'date', nested: 'personalDetails' }, // Only admin can edit
              { key: 'personalDetails.gender', label: 'Gender', editable: false, nested: 'personalDetails', className: 'capitalize' },
              { key: 'personalDetails.bloodGroup', label: 'Blood Group', editable: false, nested: 'personalDetails' }
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-[#1e40af] mb-2">{field.label}</label>
                {isEditing && field.editable ? (
                  <input
                    type={field.type || 'text'}
                    value={field.nested ? 
                      (editedData[field.nested]?.[field.key.split('.')[1]] || studentData[field.nested]?.[field.key.split('.')[1]]) :
                      (editedData[field.key] || studentData[field.key])
                    }
                    onChange={(e) => field.nested ? 
                      handleInputChange(field.key.split('.')[1], e.target.value, field.nested) :
                      handleInputChange(field.key, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl bg-[#f8fafc] focus:border-[#3b82f6] focus:outline-none"
                  />
                ) : (
                  <p className={`p-3 bg-gray-50 rounded-xl ${field.className || ''}`}>
                    {field.nested ? 
                      (field.type === 'date' ? 
                        new Date(studentData[field.nested]?.[field.key.split('.')[1]]).toLocaleDateString() :
                        studentData[field.nested]?.[field.key.split('.')[1]]
                      ) :
                      studentData[field.key]
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'academicDetails.course', label: 'Course' },
            { key: 'academicDetails.department', label: 'Department' },
            { key: 'semester', label: 'Semester' },
            { key: 'academicDetails.currentCGPA', label: 'Current CGPA', className: 'font-bold text-green-600' },
            { key: 'academicDetails.attendance', label: 'Attendance', className: 'font-bold text-blue-600' },
            { key: 'yearOfAdmission', label: 'Year of Admission' }
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[#1e40af] mb-2">{field.label}</label>
              <p className={`p-3 bg-gray-50 rounded-xl ${field.className || ''}`}>
                {field.key.includes('.') ? 
                  studentData[field.key.split('.')[0]]?.[field.key.split('.')[1]] :
                  studentData[field.key]
                }
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Parent/Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'fatherName', label: "Father's Name", editable: true },
            { key: 'motherName', label: "Mother's Name", editable: true },
            { key: 'parentsNumber', label: 'Guardian Contact', editable: true, type: 'tel' },
            { key: 'emergencyContact.phone', label: 'Emergency Contact', editable: false }
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[#1e40af] mb-2">{field.label}</label>
              {isEditing && field.editable ? (
                <input
                  type={field.type || 'text'}
                  value={editedData.personalDetails?.[field.key] || studentData.personalDetails?.[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value, 'personalDetails')}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-[#f8fafc] focus:border-[#3b82f6] focus:outline-none"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-xl">
                  {field.key.includes('.') ? 
                    studentData[field.key.split('.')[0]]?.[field.key.split('.')[1]] :
                    studentData.personalDetails?.[field.key]
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'street', label: 'Street Address', editable: true },
            { key: 'city', label: 'City', editable: true },
            { key: 'state', label: 'State', editable: false },
            { key: 'zipCode', label: 'PIN Code', editable: false }
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[#1e40af] mb-2">{field.label}</label>
              {isEditing && field.editable ? (
                <input
                  type="text"
                  value={editedData.address?.[field.key] || studentData.address?.[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value, 'address')}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-[#f8fafc] focus:border-[#3b82f6] focus:outline-none"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-xl">{studentData.address?.[field.key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hostel Information */}
    </div>
  );

  const renderAcademic = () => (
    <div className="space-y-6">
      {/* Current Semester Subjects */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Current Semester Subjects</h3>
        <div className="grid gap-4">
          {studentData.academicDetails?.currentSubjects?.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Book className="text-[#3b82f6]" size={20} />
                <div>
                  <p className="font-semibold">{subject.name}</p>
                  <p className="text-sm text-gray-600">Code: {subject.code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#1e40af]">{subject.credits} Credits</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Summary */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Academic Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Award className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-2xl font-bold text-blue-600">{studentData.academicDetails?.currentCGPA}</p>
            <p className="text-sm text-gray-600">Current CGPA</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <UserCheck className="mx-auto mb-2 text-green-600" size={24} />
            <p className="text-2xl font-bold text-green-600">{studentData.academicDetails?.attendance}</p>
            <p className="text-sm text-gray-600">Attendance</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <Clock className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-2xl font-bold text-purple-600">{studentData.semester}</p>
            <p className="text-sm text-gray-600">Current Semester</p>
          </div>
        </div>
      </div>

      {/* Past Results */}
      <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Past Academic Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-[#1e40af]">Semester</th>
                <th className="text-left py-3 px-4 font-semibold text-[#1e40af]">CGPA</th>
                <th className="text-left py-3 px-4 font-semibold text-[#1e40af]">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentData.academicDetails?.pastResults?.map((result, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{result.semester}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">{result.cgpa}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {result.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-[#1e40af] mb-6">Notifications & Announcements</h3>
      <div className="space-y-4">
        {[
          { type: 'info', title: 'Assignment Submission Reminder', desc: 'CS301 Assignment due on 25th January 2024', time: '2 days ago' },
          { type: 'success', title: 'Fee Payment Successful', desc: 'Your semester fee payment has been processed successfully', time: '1 week ago' },
          { type: 'warning', title: 'Library Book Return Reminder', desc: 'Please return "Data Structures & Algorithms" by 28th January 2024', time: '3 days ago' }
        ].map((notif, index) => (
          <div key={index} className={`p-4 rounded-xl border-l-4 ${
            notif.type === 'info' ? 'bg-blue-50 border-blue-500' :
            notif.type === 'success' ? 'bg-green-50 border-green-500' :
            'bg-yellow-50 border-yellow-500'
          }`}>
            <h4 className={`font-semibold ${
              notif.type === 'info' ? 'text-blue-800' :
              notif.type === 'success' ? 'text-green-800' :
              'text-yellow-800'
            }`}>{notif.title}</h4>
            <p className={`text-sm mt-1 ${
              notif.type === 'info' ? 'text-blue-700' :
              notif.type === 'success' ? 'text-green-700' :
              'text-yellow-700'
            }`}>{notif.desc}</p>
            <p className={`text-xs mt-2 ${
              notif.type === 'info' ? 'text-blue-600' :
              notif.type === 'success' ? 'text-green-600' :
              'text-yellow-600'
            }`}>{notif.time}</p>
          </div>
        ))}
      </div>
    </div>
  );


  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info': return renderBasicInfo();
      case 'academic': return renderAcademic();
      case 'notifications': return renderNotifications();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={studentData.profilePictureLink || '/api/placeholder/80/80'}
                alt="Profile"
                className="w-20 h-20 rounded-xl object-cover border-4 border-[#3b82f6]"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#1e40af]">{studentData.name}</h1>
                <p className="text-gray-600">{studentData.academicDetails?.course}</p>
                <p className="text-sm text-blue-600 font-medium">{studentData.registrationNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium text-sm">Student</span>
              </div>
              <p className="text-sm text-gray-600">Semester: {studentData.semester}</p>
              <p className="text-sm text-gray-600">CGPA: {studentData.academicDetails?.currentCGPA}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.08)] border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#1e40af] text-[#1e40af] bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StudentProfile;