import React from 'react';
import MacetHeader from './MacetHeader';
import MacetFooter from './MacetFooter';
import MacetContent from './MacetContent';

const Macet = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header at the top */}
      <MacetHeader />
      
      {/* Main content in the middle */}
      <main className="flex-1">
        <MacetContent />
      </main>
      
      {/* Footer at the bottom */}
      <MacetFooter />
    </div>
  );
};

export default Macet;
