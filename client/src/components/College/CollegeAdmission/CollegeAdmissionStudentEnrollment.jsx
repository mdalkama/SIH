import React, { useState, useEffect } from 'react';
import {
  User, Users, Mail, Phone, Calendar, MapPin, BookUser, GraduationCap,
  Building2, Hash, University, Banknote, ShieldCheck, HeartHandshake, ScrollText, KeySquare, KeyRound, Eye, EyeOff,
  BadgeCheck
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Main Component to be used in a router outlet
export default function AdmissionForm() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]); // NEW: State to store fetched courses
  const [loadingCourses, setLoadingCourses] = useState(true); // NEW: Loading state for courses
  
  const [formData, setFormData] = useState({
    admissionDate: getTodayDate(),
    name: '',
    fatherName: '',
    motherName: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    aadharNumber: '',
    maritalStatus: '',
    religion: '',
    rajasthanDomicile: 'No',
    category: 'General',
    familyIncome: '',
    kashmiriMigrant: 'No',
    specialCategory: 'None',
    identityProof: '',
    identityProofNumber: '',
    tenthBoard: '',
    tenthYear: '',
    tenthPercentage: '',
    twelfthBoard: '',
    twelfthYear: '',
    twelfthPercentage: '',
    course: '', // UPDATED: Will now store the course's MongoDB _id
    batch: '',
  });

  // State to manage password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // NEW: Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch('https://sih-4ptm.onrender.com/api/v1/college-course/courses', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch the list of available courses.');
        }
        const data = await response.json();
        setCourses(data || []); // Handle cases where API might return null
      } catch (error) {
        console.error("Course fetch error:", error);
        alert(`Error fetching courses: ${error.message}`);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Handles the final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.course || !formData.batch) {
        alert('Course and Batch are required');
        return;
      }

      const year = String(formData.batch).slice(2, 4);
      const collegeCode = user?.collegeCode;
      
      // Find the full course object from the fetched list based on the selected _id
      const selectedCourse = courses.find(c => c._id === formData.course);
      if (!selectedCourse) {
        throw new Error("The selected course is invalid. Please refresh and try again.");
      }
      
      // Use the human-readable courseId (e.g., "105") from the selected course object
      const courseIdentifier = selectedCourse.courseId;

      const serialRes = await fetch(
        `https://sih-4ptm.onrender.com/api/v1/student/getserial/${formData.batch}/${courseIdentifier}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!serialRes.ok) {
        throw new Error(`Failed to fetch the next serial number for the course.`);
      }
      
      const sl = await serialRes.json();
      const currentSerial = sl?.student || 0;
      const newSerial = currentSerial + 1;
      const formattedSerial = String(newSerial).padStart(3, '0');

      const registrationNo = `${year}${collegeCode}${courseIdentifier}${formattedSerial}`;

      // Prepare the final payload, ensuring `courseId` is the string identifier and `course` is the ObjectId
      const finalData = {
        ...formData,
        courseId: courseIdentifier, // The human-readable ID your backend might need
        course: formData.course, // The MongoDB ObjectId reference for the Student model
        registrationNumber: registrationNo,
      };

      const response = await fetch(
        'https://sih-4ptm.onrender.com/api/v1/admit-student-college',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(finalData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit student data');
      }

      const result = await response.json();
      alert(`Student admitted successfully!\nRegistration No: ${result.student?.registrationNumber || registrationNo}`);
      // Optionally, you can reset the form here
      // setFormData({ ...initialState, admissionDate: getTodayDate() });

    } catch (error) {
      console.error('Error submitting student admission:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-3"><BookUser className="h-6 w-6 text-blue-700" />1. Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative"><label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><User className="h-5 w-5 text-slate-400" /></span><input id="name" name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Student's full name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="fatherName" className="block text-sm font-medium text-slate-700 mb-1">Father's Name</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Users className="h-5 w-5 text-slate-400" /></span><input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} type="text" placeholder="Father's full name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="motherName" className="block text-sm font-medium text-slate-700 mb-1">Mother's Name</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Users className="h-5 w-5 text-slate-400" /></span><input id="motherName" name="motherName" value={formData.motherName} onChange={handleChange} type="text" placeholder="Mother's full name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><input id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              </div>
              <div className="relative"><label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">Gender</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><User className="h-5 w-5 text-slate-400" /></span><select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div></div>
              <div className="relative"><label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Mail className="h-5 w-5 text-slate-400" /></span><input id="email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="student.email@example.com" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              <div className="relative"><label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><KeyRound className="h-5 w-5 text-slate-400" /></span><input id="password" name="password" value={formData.password} onChange={handleChange} type={isPasswordVisible ? "text" : "password"} placeholder="Create a password" required className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /><button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">{isPasswordVisible ? <EyeOff className="h-5 w-5 text-slate-500" /> : <Eye className="h-5 w-5 text-slate-500" />}</button></div></div>
              <div className="relative"><label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Phone className="h-5 w-5 text-slate-400" /></span><input id="phone" name="phone" value={formData.phone} onChange={handleChange} type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              <div className="relative"><label htmlFor="maritalStatus" className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><HeartHandshake className="h-5 w-5 text-slate-400" /></span><select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="">Select</option><option value="Single">Single</option><option value="Married">Married</option></select></div></div>
              <div className="relative"><label htmlFor="religion" className="block text-sm font-medium text-slate-700 mb-1">Religion</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><ScrollText className="h-5 w-5 text-slate-400" /></span><select id="religion" name="religion" value={formData.religion} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="">Select</option><option value="Hinduism">Hinduism</option><option value="Islam">Islam</option><option value="Sikhism">Sikhism</option><option value="Christianity">Christianity</option><option value="Jainism">Jainism</option><option value="Buddhism">Buddhism</option><option value="Other">Other</option></select></div></div>
              <div className="relative"><label htmlFor="aadharNumber" className="block text-sm font-medium text-slate-700 mb-1">Aadhar Number</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Hash className="h-5 w-5 text-slate-400" /></span><input id="aadharNumber" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} type="text" pattern="[0-9]{12}" placeholder="12-digit Aadhar number" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              <div className="md:col-span-2 lg:col-span-4"><div className="relative"><label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Permanent Address</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><MapPin className="h-5 w-5 text-slate-400" /></span><textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Complete residential address" rows="2" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"></textarea></div></div></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-3"><BadgeCheck className="h-6 w-6 text-blue-700" />2. Reservation & Domicile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative"><label htmlFor="rajasthanDomicile" className="block text-sm font-medium text-slate-700 mb-1">Rajasthan Domicile</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><MapPin className="h-5 w-5 text-slate-400" /></span><select id="rajasthanDomicile" name="rajasthanDomicile" value={formData.rajasthanDomicile} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="No">No</option><option value="Yes">Yes</option></select></div></div>
              <div className="relative"><label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Users className="h-5 w-5 text-slate-400" /></span><select id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option><option value="EWS">EWS</option><option value="MBC">MBC</option></select></div></div>
              <div className="relative"><label htmlFor="familyIncome" className="block text-sm font-medium text-slate-700 mb-1">Annual Family Income</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Banknote className="h-5 w-5 text-slate-400" /></span><input id="familyIncome" name="familyIncome" value={formData.familyIncome} onChange={handleChange} type="number" placeholder="e.g., 250000" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              <div className="relative"><label htmlFor="kashmiriMigrant" className="block text-sm font-medium text-slate-700 mb-1">Kashmiri Migrant</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><MapPin className="h-5 w-5 text-slate-400" /></span><select id="kashmiriMigrant" name="kashmiriMigrant" value={formData.kashmiriMigrant} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="No">No</option><option value="Yes">Yes</option></select></div></div>
              <div className="relative"><label htmlFor="specialCategory" className="block text-sm font-medium text-slate-700 mb-1">Special Category (if any)</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><ShieldCheck className="h-5 w-5 text-slate-400" /></span><select id="specialCategory" name="specialCategory" value={formData.specialCategory} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="None">None</option><option value="PwD">Person with Disability (PwD)</option><option value="ExServiceman">Ex-Serviceman</option></select></div></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-3"><KeySquare className="h-6 w-6 text-blue-700" />3. Identity Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative"><label htmlFor="identityProof" className="block text-sm font-medium text-slate-700 mb-1">Identity Proof Type</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><KeySquare className="h-5 w-5 text-slate-400" /></span><select id="identityProof" name="identityProof" value={formData.identityProof} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="">Select Proof</option><option value="Aadhar Card">Aadhar Card</option><option value="Voter ID">Voter ID</option><option value="Driving License">Driving License</option><option value="Passport">Passport</option></select></div></div>
              <div className="relative"><label htmlFor="identityProofNumber" className="block text-sm font-medium text-slate-700 mb-1">Identity Proof Number</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Hash className="h-5 w-5 text-slate-400" /></span><input id="identityProofNumber" name="identityProofNumber" value={formData.identityProofNumber} onChange={handleChange} type="text" placeholder="Enter ID number" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-3"><GraduationCap className="h-6 w-6 text-blue-700" />4. Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-slate-700">Class 10th Details</h3>
                <div className="relative"><label htmlFor="tenthBoard" className="block text-sm font-medium text-slate-700 mb-1">Board</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Building2 className="h-5 w-5 text-slate-400" /></span><input id="tenthBoard" name="tenthBoard" value={formData.tenthBoard} onChange={handleChange} type="text" placeholder="e.g., RBSE / CBSE" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="tenthYear" className="block text-sm font-medium text-slate-700 mb-1">Passing Year</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><input id="tenthYear" name="tenthYear" value={formData.tenthYear} onChange={handleChange} type="text" pattern="[0-9]{4}" placeholder="e.g., 2021" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="tenthPercentage" className="block text-sm font-medium text-slate-700 mb-1">Percentage (%)</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Hash className="h-5 w-5 text-slate-400" /></span><input id="tenthPercentage" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleChange} type="text" placeholder="e.g., 88.5" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              </div>
              <div className="space-y-4 p-4 border rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-slate-700">Class 12th Details</h3>
                <div className="relative"><label htmlFor="twelfthBoard" className="block text-sm font-medium text-slate-700 mb-1">Board</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Building2 className="h-5 w-5 text-slate-400" /></span><input id="twelfthBoard" name="twelfthBoard" value={formData.twelfthBoard} onChange={handleChange} type="text" placeholder="e.g., RBSE / CBSE" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="twelfthYear" className="block text-sm font-medium text-slate-700 mb-1">Passing Year</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><input id="twelfthYear" name="twelfthYear" value={formData.twelfthYear} onChange={handleChange} type="text" pattern="[0-9]{4}" placeholder="e.g., 2023" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="twelfthPercentage" className="block text-sm font-medium text-slate-700 mb-1">Percentage (%)</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Hash className="h-5 w-5 text-slate-400" /></span><input id="twelfthPercentage" name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleChange} type="text" placeholder="e.g., 85.2" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-3"><University className="h-6 w-6 text-blue-700" />5. Course & Admission Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <label htmlFor="batch" className="block text-sm font-medium text-slate-700 mb-1">Select Batch</label>
                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><select id="batch" name="batch" value={formData.batch} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="">-- Select Batch --</option>{Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 1).map(year => (<option key={year} value={year}>{year}</option>))}</select></div>
              </div>
              <div className="relative">
                <label htmlFor="course" className="block text-sm font-medium text-slate-700 mb-1">Course Applied For</label>
                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><GraduationCap className="h-5 w-5 text-slate-400" /></span>
                    <select id="course" name="course" value={formData.course} onChange={handleChange} required disabled={loadingCourses} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300 disabled:bg-slate-100">
                        <option value="">{loadingCourses ? 'Loading Courses...' : '-- Select Course --'}</option>
                        {courses.map(course => (<option key={course._id} value={course._id}>{course.branch} ({course.degree})</option>))}
                    </select>
                </div>
              </div>
              <div className="relative">
                <label htmlFor="admissionDate" className="block text-sm font-medium text-slate-700 mb-1">Date of Admission</label>
                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><input id="admissionDate" name="admissionDate" value={formData.admissionDate} onChange={handleChange} type="date" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6 border-t mt-10">
            <button type="submit" className="inline-flex items-center justify-center px-8 py-3 font-bold text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">Save Student Data</button>
          </div>
        </form>
      </div>
    </div>
  );
}