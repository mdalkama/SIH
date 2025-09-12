import React from 'react';
import Header from '../../header_dte';
import Footer from '../../footer';

const DiplomaNonEngineeringAdmission = () => {
  return (
    <div className="min-h-screen flex flex-col theme-bg">
      {/* Header - Only the top part without carousel but with full navbar */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 theme-bg py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold theme-text mb-2">
              Diploma First Year Admissions (Non-Engineering Courses)
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="theme-surface rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
            <p className="theme-text mb-6">
              Welcome to the admission portal for Diploma First Year Non-Engineering Courses. 
              Please fill out the application form below to begin your admission process.
            </p>
            
            {/* Admission Form will be added here */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center theme-text">
              <p>Admission Form for Non-Engineering Courses will be available here</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DiplomaNonEngineeringAdmission;