import React from 'react';
import { ChevronRight } from 'lucide-react';

const LeadershipMessages = ({ leadershipData }) => {
  const getGradientClass = (index) => {
    const gradients = [
      'from-cyan-400 to-blue-500',
      'from-green-400 to-emerald-500', 
      'from-blue-400 to-indigo-600'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Leadership Messages
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Inspiring words from our distinguished leadership team guiding MACET towards excellence in engineering education
          </p>
        </div>

        {/* Leadership Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {leadershipData.map((leader, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-br ${getGradientClass(index)} p-6 text-center`}>
                {/* Profile Image */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {leader.title}
                </h3>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Message */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed text-sm mb-3 italic">
                    "{leader.message}"
                  </p>
                  
                  {/* Quote Lines */}
                  {leader.quotes && leader.quotes.map((quote, qIndex) => (
                    <p key={qIndex} className="text-gray-600 text-xs mb-1">
                      {quote}
                    </p>
                  ))}
                </div>

                {/* Name */}
                <p className="text-gray-800 font-semibold text-base mb-4">
                  - {leader.name}
                </p>
                
                {/* Read More Button */}
                <button className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                  <span>Read More</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipMessages;
