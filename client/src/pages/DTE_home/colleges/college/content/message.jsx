import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import gpcData from '../gpc.json';

const Message = () => {
  const [searchParams] = useSearchParams();
  const [expandedCard, setExpandedCard] = useState(null);

  // Check if this is GPC (id=1)
  const queryId = searchParams.get('id');
  if (queryId !== '1' || !gpcData.leadershipTeam) return null;

  const { title, members } = gpcData.leadershipTeam;

  const toggleReadMore = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100 mb-6">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml;base64,${btoa(
                          `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='#f0f9ff'/><text x='50%' y='50%' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='#0369a1'>${member.name}</text></svg>`
                        )}`;
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.designation}</p>
                  
                  <div className={`text-gray-600 mb-4 transition-all duration-300 ${expandedCard === index ? 'line-clamp-none' : 'line-clamp-3'}`}>
                    {member.message}
                  </div>
                  
                  <button 
                    onClick={() => toggleReadMore(index)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center mt-2"
                  >
                    {expandedCard === index ? 'Read Less' : 'Read More'}
                    <svg 
                      className={`w-4 h-4 ml-1 transition-transform duration-300 ${expandedCard === index ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Message;