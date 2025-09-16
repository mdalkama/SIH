import React, { useEffect, useRef, useState } from 'react';

const OurRecruiters = ({ recruitersData }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let animationId;
    
    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.5;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Recruiters
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Leading companies that trust MACET graduates for their talent and expertise
          </p>
        </div>

        {/* Scrolling Companies Container */}
        <div className="relative overflow-hidden bg-gray-50 rounded-lg py-8">
          <div
            ref={scrollRef}
            className="flex space-x-8 overflow-x-hidden"
            style={{ 
              width: 'max-content',
              animation: isPaused ? 'none' : 'scroll 60s linear infinite'
            }}
          >
            {/* Triple the array to create seamless loop */}
            {[...recruitersData, ...recruitersData, ...recruitersData].map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{ minWidth: '180px', height: '100px' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">85%</h3>
            <p className="text-gray-700">Placement Rate</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-3xl font-bold text-green-600 mb-2">₹12 LPA</h3>
            <p className="text-gray-700">Highest Package</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-3xl font-bold text-purple-600 mb-2">22+</h3>
            <p className="text-gray-700">Partner Companies</p>
          </div>
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default OurRecruiters;
