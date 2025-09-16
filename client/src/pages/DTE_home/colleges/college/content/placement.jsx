import React, { useEffect, useRef, useState } from 'react';
import macetData from '../macet.json';

const Placement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle scroll events for manual scrolling
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    setIsManualScrolling(true);
    setIsPaused(true);
    
    // After 1 second of no scrolling, resume auto-scroll
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
      setIsPaused(false);
    }, 1000);
  };

  // Add CSS for scroll animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(-100% / 3)); }
      }
      
      .auto-scroll {
        animation: scroll 30s linear infinite;
      }
      
      .auto-scroll.paused {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleCompanyHover = (isHovering) => {
    if (!isManualScrolling) {
      setIsPaused(isHovering);
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  // Don't render if no placement data
  if (!macetData.placements) {
    console.log('No placement data available');
    return null;
  }

  const { placements } = macetData;

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: '#1d293d'}}>
            {placements.title}
          </h2>
          <div className="w-24 h-1 bg-[#1d293d] mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {placements.description}
          </p>
        </div>

        {/* Companies Carousel */}
        <div className="relative overflow-hidden w-full">
          {!placements.companies || placements.companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No placement data available at the moment.</p>
            </div>
          ) : (
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className={`flex gap-8 py-12 transition-all duration-1000 delay-300 auto-scroll ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isPaused || isManualScrolling ? 'paused' : ''}`}
            style={{
              width: '300%', // 3 copies for seamless loop
              whiteSpace: 'nowrap',
              cursor: 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              msUserSelect: 'none',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
            onMouseDown={() => document.body.style.cursor = 'grabbing'}
            onMouseUp={() => document.body.style.cursor = 'default'}
            onMouseLeave={() => document.body.style.cursor = 'default'}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => {
              setIsPaused(false);
              document.body.style.cursor = 'default';
            }}
          >
          {/* Three copies for seamless infinite loop */}
          {[...placements.companies, ...placements.companies, ...placements.companies].map((company, index) => (
            <div
              key={`${company.id}-${index}`}
              className="flex-shrink-0 w-48 h-32 bg-white rounded-xl shadow-lg border border-slate-200 flex items-center justify-center p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 grayscale hover:grayscale-0"
              onMouseEnter={() => handleCompanyHover(true)}
              onMouseLeave={() => handleCompanyHover(false)}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'><rect width='200' height='100' fill='#f1f5f9'/><text x='50%' y='50%' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='#64748b'>${company.name}</text></svg>`)}`;
                }}
              />
            </div>
          ))}
          </div>
          )}
        </div>

        {/* Instructions */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* <p className="text-slate-500 text-sm">
            {isManualScrolling ? 'Drag to scroll • Scroll to resume auto-scroll' : 'Hover to pause • Auto-scrolling carousel'}
          </p> */}
        </div>
      </div>
    </section>
  );
};

export default Placement;
