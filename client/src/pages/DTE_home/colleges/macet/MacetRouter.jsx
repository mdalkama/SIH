import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MacetHeader from './MacetHeader';
import MacetFooter from './MacetFooter';
import MacetContent from './MacetContent';
import Contact from './pages/Contact';
import Departments from './pages/Departments';
import Admissions from './pages/Admissions';
import Facilities from './pages/Facilities';
import Placements from './pages/Placements';

const MacetRouter = () => {
  return (
    <div className="min-h-screen bg-white">
      <MacetHeader />
      <main>
        <Routes>
          <Route path="/" element={<MacetContent />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/research" element={
            <div className="py-16 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Research</h1>
              <p className="text-gray-600 mt-4">Coming Soon...</p>
            </div>
          } />
          <Route path="/student-life" element={
            <div className="py-16 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Student Life</h1>
              <p className="text-gray-600 mt-4">Coming Soon...</p>
            </div>
          } />
          {/* Fallback route */}
          <Route path="*" element={<MacetContent />} />
        </Routes>
      </main>
      <MacetFooter />
    </div>
  );
};

export default MacetRouter;
