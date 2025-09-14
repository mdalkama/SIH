import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header_dte';
import Footer from '../footer';

const Admission = ({ admissionType }) => {
  const navigate = useNavigate();

  // Redirect to new OTP verification flow with course ID
  useEffect(() => {
    navigate(`/admission/otp-verification?role=student&courseId=${admissionType}`);
  }, [navigate, admissionType]);

  // Determine content based on admission type
  const getTitle = () => {
    switch (admissionType) {
      case 'engineering':
        return 'Diploma First Year Admissions (Engineering Courses)';
      case 'non-engineering':
        return 'Diploma First Year Admissions (Non-Engineering Courses)';
      case 'diploma-engineering-first-year':
        return 'First Year Diploma Engineering Admissions';
      case 'diploma-engineering-lateral-entry':
        return 'Lateral Entry Diploma Engineering Admissions';
      case 'diploma-non-engineering-first-year':
        return 'First Year Diploma Non-Engineering Admissions';
      case 'diploma-non-engineering-second-year-graduate':
        return 'Second Year Graduate Non-Engineering Courses Admissions';
      case 'diploma-non-engineering-first-year-degree':
        return 'First Year Degree Non-Engineering Admissions';
      default:
        return 'Select Admission Type';
    }
  };

  const getDescription = () => {
    switch (admissionType) {
      case 'engineering':
        return 'Welcome to the admission portal for Diploma First Year Engineering Courses. Please fill out the application form below to begin your admission process.';
      case 'non-engineering':
        return 'Welcome to the admission portal for Diploma First Year Non-Engineering Courses. Please fill out the application form below to begin your admission process.';
      case 'diploma-engineering-first-year':
        return 'Welcome to the admission portal for First Year Diploma Engineering Courses. Please fill out the application form below to begin your admission process.';
      case 'diploma-engineering-lateral-entry':
        return 'Welcome to the admission portal for Lateral Entry Diploma Engineering Courses. Please fill out the application form below to begin your admission process.';
      case 'diploma-non-engineering-first-year':
        return 'Welcome to the admission portal for First Year Diploma Non-Engineering Courses. Please fill out the application form below to begin your admission process.';
      case 'diploma-non-engineering-second-year-graduate':
        return 'Welcome to the admission portal for Second Year Graduate Non-Engineering Courses. Please fill out the application form below to begin your admission process.';
      case 'diploma-non-engineering-first-year-degree':
        return 'Welcome to the admission portal for First Year Degree Non-Engineering Courses. Please fill out the application form below to begin your admission process.';
      default:
        return 'Please select the type of admission you are interested in.';
    }
  };

  const getFormText = () => {
    switch (admissionType) {
      case 'engineering':
        return 'Admission Form for Engineering Courses will be available here';
      case 'non-engineering':
        return 'Admission Form for Non-Engineering Courses will be available here';
      case 'diploma-engineering-first-year':
        return 'Admission Form for First Year Diploma Engineering will be available here';
      case 'diploma-engineering-lateral-entry':
        return 'Admission Form for Lateral Entry Diploma Engineering will be available here';
      case 'diploma-non-engineering-first-year':
        return 'Admission Form for First Year Diploma Non-Engineering will be available here';
      case 'diploma-non-engineering-second-year-graduate':
        return 'Admission Form for Second Year Graduate Non-Engineering will be available here';
      case 'diploma-non-engineering-first-year-degree':
        return 'Admission Form for First Year Degree Non-Engineering will be available here';
      default:
        return 'Admission Form will be available here';
    }
  };

  return (
    <div className="min-h-screen flex flex-col theme-bg">
      {/* Header - Only the top part without carousel but with full navbar */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 theme-bg py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold theme-text mb-2">
              {getTitle()}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="theme-surface rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
            <p className="theme-text mb-6">
              {getDescription()}
            </p>
            
            {/* Admission Form will be added here */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center theme-text">
              <p>{getFormText()}</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Admission;