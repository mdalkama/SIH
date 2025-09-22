import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, Search, ArrowRight, Shield, Clock, FileText } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const AdmissionPortal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  
  // Course display names
  const courseNames = {
    'diploma-engineering-first-year': 'Diploma Engineering (First Year)',
    'diploma-engineering-lateral-entry': 'Diploma Engineering (Lateral Entry)',
    'diploma-non-engineering-first-year': 'Diploma Non-Engineering (First Year)',
    'diploma-non-engineering-second-year-graduate': 'Diploma Non-Engineering (Second Year Graduate)',
    'diploma-non-engineering-first-year-degree': 'Diploma Non-Engineering (First Year Degree)'
  };
  
  const courseName = courseId ? courseNames[courseId] || 'General Admission' : 'General Admission';

  const handleNewAdmission = () => {
    // Redirect to OTP verification for new admission with course ID
    if (courseId) {
      navigate(`/admission/otp-verification?courseId=${courseId}`);
    } else {
      navigate('/admission/otp-verification');
    }
  };

  const handleCheckStatus = () => {
    // Redirect to status OTP page
    navigate('/status/check');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://hte.rajasthan.gov.in/css_index/images/s1old.jpg)',
          opacity: '0.3'
        }}
      ></div>
      
      <Header />
      
      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              {courseName} Portal
            </h1>
            <p className="text-xl text-gray-600 mb-6">Choose your admission process for {courseName}</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
            <div className="flex items-center">
              <Shield className="text-blue-500 mr-3" size={24} />
              <div>
                <h3 className="text-blue-900 font-semibold">Secure Access</h3>
                <p className="text-blue-700 text-sm">
                  All services require OTP verification for your security.
                </p>
              </div>
            </div>
          </div>

          {/* Main Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* New Admission Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <div className="flex items-center text-white">
                  <UserPlus size={32} className="mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold">Apply for New Admission</h2>
                    <p className="text-green-100">Start your admission process</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Clock size={16} className="mr-3 text-green-500" />
                    <span>Quick OTP verification</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FileText size={16} className="mr-3 text-green-500" />
                    <span>Complete application form</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Shield size={16} className="mr-3 text-green-500" />
                    <span>Secure session management</span>
                  </div>
                </div>
                
                <button
                  onClick={handleNewAdmission}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center font-semibold cursor-pointer"
                >
                  Apply for New Admission
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>

            {/* Check Status Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center text-white">
                  <Search size={32} className="mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold">Check Application Status</h2>
                    <p className="text-blue-100">Track your application progress</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Clock size={16} className="mr-3 text-blue-500" />
                    <span>Real-time status updates</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FileText size={16} className="mr-3 text-blue-500" />
                    <span>Application ID required</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Shield size={16} className="mr-3 text-blue-500" />
                    <span>OTP protected access</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckStatus}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold cursor-pointer"
                >
                  Check Application Status
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Important Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-green-900 mb-3">For New Admissions:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Provide phone number or email for OTP verification
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Complete application form after verification
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Session remains active until completion
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-3">For Status Check:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Application ID and email address required
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    OTP verification for secure access
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Access counselling portal after verification
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdmissionPortal;