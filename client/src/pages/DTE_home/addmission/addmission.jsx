import React from 'react';
import Header from '../header_dte';
import Footer from '../footer';

const Admission = ({ admissionType }) => {
  // Determine content based on admission type
  const getTitle = () => {
    if (admissionType === 'engineering') {
      return 'Diploma First Year Admissions (Engineering Courses)';
    } else if (admissionType === 'non-engineering') {
      return 'Diploma First Year Admissions (Non-Engineering Courses)';
    }
    return 'Select Admission Type';
  };

  const getDescription = () => {
    if (admissionType === 'engineering') {
      return 'Welcome to the admission portal for Diploma First Year Engineering Courses. Please fill out the application form below to begin your admission process.';
    } else if (admissionType === 'non-engineering') {
      return 'Welcome to the admission portal for Diploma First Year Non-Engineering Courses. Please fill out the application form below to begin your admission process.';
    }
    return 'Please select the type of admission you are interested in.';
  };

  const getFormText = () => {
    if (admissionType === 'engineering') {
      return 'Admission Form for Engineering Courses will be available here';
    } else if (admissionType === 'non-engineering') {
      return 'Admission Form for Non-Engineering Courses will be available here';
    }
    return 'Admission Form will be available here';
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