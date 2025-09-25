import React, { useState, useEffect } from 'react';
import {
  User, Users, Mail, Phone, Calendar, MapPin, BookUser, GraduationCap,
  Building2, Hash, University, Banknote, ShieldCheck, HeartHandshake, ScrollText, KeySquare, KeyRound, Eye, EyeOff,
  BadgeCheck,
  // ICONS FOR NEW FEATURES
  CheckCircle, AlertCircle, X, Loader2
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-400' : 'border-red-400';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  // Simple fade-in and slide-down animation
  const animationStyles = {
    animation: 'fade-in-down 0.5s ease-out forwards'
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <style>
        {`
          @keyframes fade-in-down {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div style={animationStyles} className={`flex items-start gap-4 p-4 rounded-lg border ${bgColor} ${borderColor} shadow-lg w-full max-w-sm`}>
        <div className="flex-shrink-0 pt-0.5">
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div className="flex-shrink-0">
          <button onClick={onClose} className={`-mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex items-center justify-center ${textColor} hover:bg-opacity-20 hover:bg-current`}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};



// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split('T')[0];

const initialFormData = {
  admissionDate: getTodayDate(),
  name: '',
  fatherName: '',
  motherName: '',
  gender: '',
  dob: '',
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
  course: '',
  batch: '',
};


// Main Component
export default function AdmissionForm() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true); 
  
  // NEW: State for submission loading and notifications
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  const [formData, setFormData] = useState({
    admissionDate: getTodayDate(),
    name: '', fatherName: '', motherName: '', gender: '', dob: '', email: '', password: '', phone: '',
    address: '', aadharNumber: '', maritalStatus: '', religion: '', rajasthanDomicile: 'No',
    category: 'General', familyIncome: '', kashmiriMigrant: 'No', specialCategory: 'None',
    identityProof: '', identityProofNumber: '', tenthBoard: '', tenthYear: '', tenthPercentage: '',
    twelfthBoard: '', twelfthYear: '', twelfthPercentage: '', course: '', batch: '',
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Your original useEffect for fetching courses
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
        setCourses(data?.college?.courses || []);
      } catch (error) {
        console.error("Course fetch error:", error);
        setNotification({ message: `Error fetching courses: ${error.message}`, type: 'error' });
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // NEW: useEffect to auto-hide notification
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000); // Notification will disappear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Your original handleSubmit function with only UI changes
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ message: '', type: '' });

    try {
      if (!formData.course || !formData.batch) {
        setNotification({ message: 'Course and Batch are required', type: 'error' });
        setIsSubmitting(false); 
        return;
      }

      // Your original API logic starts here (unchanged)
      const year = String(formData.batch).slice(2, 4);
      const collegeCode = user?.collegeCode;
      
      const selectedCourse = courses.find(c => c.courseId === formData.course);
      if (!selectedCourse) {
        throw new Error("The selected course is invalid. Please refresh and try again.");
      }
      
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

      const finalData = {
        ...formData,
        courseId: courseIdentifier,
        course: formData.course,
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
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit student data');
      }
      // Your original API logic ends here

      setNotification({ 
        message: `Student admitted successfully! Registration No: ${result.student?.registrationNumber || registrationNo}`,
        type: 'success'
      });
      
      // STEP 3: Reset the form to its initial state on success
      setFormData(initialFormData);

    } catch (error) {
      console.error('Error submitting student admission:', error);
      setNotification({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center ">
      {/* The Notification component will render here when a message is set */}
      <Notification 
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
      <div className=" rounded-lg w-full max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <section>
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-3"><BookUser className="h-6 w-6 text-blue-700" />1. Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative"><label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><User className="h-5 w-5 text-slate-400" /></span><input id="name" name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Student's full name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="fatherName" className="block text-sm font-medium text-slate-700 mb-1">Father's Name</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Users className="h-5 w-5 text-slate-400" /></span><input id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} type="text" placeholder="Father's full name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="motherName" className="block text-sm font-medium text-slate-700 mb-1">Mother's Name</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Users className="h-5 w-5 text-slate-400" /></span><input id="motherName" name="motherName" value={formData.motherName} onChange={handleChange} type="text" placeholder="Mother's full name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><input id="dob" name="dob" value={formData.dob} onChange={handleChange} type="date" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
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
              <div className="space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-slate-700">Class 10th Details</h3>
                <div className="relative"><label htmlFor="tenthBoard" className="block text-sm font-medium text-slate-700 mb-1">Board</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Building2 className="h-5 w-5 text-slate-400" /></span><input id="tenthBoard" name="tenthBoard" value={formData.tenthBoard} onChange={handleChange} type="text" placeholder="e.g., RBSE / CBSE" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="tenthYear" className="block text-sm font-medium text-slate-700 mb-1">Passing Year</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><input id="tenthYear" name="tenthYear" value={formData.tenthYear} onChange={handleChange} type="text" pattern="[0-9]{4}" placeholder="e.g., 2021" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
                <div className="relative"><label htmlFor="tenthPercentage" className="block text-sm font-medium text-slate-700 mb-1">Percentage (%)</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Hash className="h-5 w-5 text-slate-400" /></span><input id="tenthPercentage" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleChange} type="text" placeholder="e.g., 88.5" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div></div>
              </div>
              <div className="space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50/50">
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
                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><select id="batch" name="batch" value={formData.batch} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300"><option value="">-- Select Batch --</option>{Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 1 - i).map(year => (<option key={year} value={year}>{year}</option>))}</select></div>
              </div>
              <div className="relative">
                <label htmlFor="course" className="block text-sm font-medium text-slate-700 mb-1">Course Applied For</label>
                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><GraduationCap className="h-5 w-5 text-slate-400" /></span>
                    <select id="course" name="course" value={formData.course} onChange={handleChange} required disabled={loadingCourses} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300 disabled:bg-slate-100">
                        <option value="">{loadingCourses ? 'Loading Courses...' : '-- Select Course --'}</option>
                        {courses.map(course => (<option key={course.courseId} value={course.courseId}>{course.courseId} - {course.branch} ({course.degree})</option>))}
                    </select>
                </div>
              </div>
              <div className="relative">
                <label htmlFor="admissionDate" className="block text-sm font-medium text-slate-700 mb-1">Date of Admission</label>
                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10"><Calendar className="h-5 w-5 text-slate-400" /></span><input id="admissionDate" name="admissionDate" value={formData.admissionDate} onChange={handleChange} type="date" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300" /></div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6 border-t border-slate-400 mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-8 py-3 font-bold text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Student Data'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}