import React, { useState, useEffect, useRef } from 'react'

const AboutDte = () => {
  const [counts, setCounts] = useState({ institutions: 0, students: 0, programs: 0, placement: 0 })
  const [hasAnimated, setHasAnimated] = useState(false)
  const statsRef = useRef(null)

  // Target values for animation
  const targetValues = {
    institutions: 150,
    students: 50000,
    programs: 25,
    placement: 75
  }

  // Animation function
  const animateCount = (target, key, duration = 2000) => {
    const startTime = Date.now()
    const startValue = 0

    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart)
      
      setCounts(prev => ({ ...prev, [key]: currentValue }))
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }
    
    requestAnimationFrame(updateCount)
  }

  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            // Start animations with slight delays
            setTimeout(() => animateCount(targetValues.institutions, 'institutions'), 100)
            setTimeout(() => animateCount(targetValues.students, 'students'), 200)
            setTimeout(() => animateCount(targetValues.programs, 'programs'), 300)
            setTimeout(() => animateCount(targetValues.placement, 'placement'), 400)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [hasAnimated])
  return (
    <div id="about-dte-section" className="theme-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About DTE Hero Section */}
        <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.6), rgba(160, 82, 45, 0.7)), url('https://hte.rajasthan.gov.in/dept/dte/board_of_technical_education,_rajasthan/uploads/images/banner/DTE%2001.JPG')`
            }}
          >
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 transform transition-all duration-1000">
                  About DTE
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed">
                  Transforming education through excellence in technical learning and research
                  <br />
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90">
                    Department of Technical Education, Rajasthan
                  </span>
                </p>
                <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    The Directorate of Technical Education (DTE), Rajasthan was established in August 1956 under the recommendation of the All India Council for Technical Education (AICTE). Its headquarters are located in Jodhpur.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-6 left-6 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm"></div>
          <div className="absolute top-6 right-6 w-12 h-12 bg-white/15 rounded-full backdrop-blur-sm"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 bg-white/25 rounded-full backdrop-blur-sm"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"></div>
        </div>

        {/* About Content Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div id="mission-section" className="theme-surface rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold theme-text mb-6">
              Our Mission
            </h2>
            <p className="text-lg theme-text-secondary leading-relaxed mb-6">
              The Department of Technical Education, Rajasthan is committed to providing quality technical education 
              and fostering innovation in engineering and technology fields across the state.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="theme-text">Excellence in technical education and skill development</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="theme-text">Industry-academia collaboration and research initiatives</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="theme-text">Empowering students with modern infrastructure and facilities</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div id="vision-section" className="theme-surface rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold theme-text mb-6">
              Our Vision
            </h2>
            <div className="bg-blue-50  rounded-lg p-6 mb-6 border-l-4 border-blue-500">
              <p className="text-lg font-medium text-blue-800  leading-relaxed italic">
                "To enhance the competitiveness of State's technical manpower to global standards by imparting high quality & state of art Technical Education and Training to all sections of the society."
              </p>
            </div>
            <p className="text-lg theme-text-secondary leading-relaxed mb-6">
              To be a premier institution in technical education, creating skilled professionals who contribute 
              to the technological advancement and economic development of Rajasthan and the nation.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="theme-text">Innovation-driven curriculum and pedagogy</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="theme-text">Global competency and industry readiness</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="theme-text">Sustainable development and social responsibility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16" ref={statsRef}>
          <div className="theme-surface rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold theme-text text-center mb-10">
              DTE at a Glance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stats-card bg-white rounded-3xl p-3 text-center transform hover:scale-95 transition-all duration-300 shadow-xl hover:shadow-inner">
                <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">{counts.institutions}+</div>
                <p className="text-xs font-medium text-gray-600">Institutions</p>
              </div>
              <div className="stats-card bg-white rounded-3xl p-3 text-center transform hover:scale-95 transition-all duration-300 shadow-xl hover:shadow-inner">
                <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">{counts.students.toLocaleString()}+</div>
                <p className="text-xs font-medium text-gray-600">Students</p>
              </div>
              <div className="stats-card bg-white rounded-3xl p-3 text-center transform hover:scale-95 transition-all duration-300 shadow-xl hover:shadow-inner">
                <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">{counts.programs}+</div>
                <p className="text-xs font-medium text-gray-600">Programs</p>
              </div>
              <div className="stats-card bg-white rounded-3xl p-3 text-center transform hover:scale-95 transition-all duration-300 shadow-xl hover:shadow-inner">
                <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1">{counts.placement}%</div>
                <p className="text-xs font-medium text-gray-600">Placement Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for enhanced effects */}
      <style>{`
        .stats-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .theme- .stats-card {
          background: rgba(51, 65, 85, 0.8);
          backdrop-filter: blur(10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        /* Hover effect - inward pressed feeling */
        .stats-card:hover {
          transform: scale(0.95) translateY(2px);
          box-shadow: inset 0 8px 20px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1);
        }

        .theme- .stats-card:hover {
          box-shadow: inset 0 8px 20px rgba(0, 0, 0, 0.6), 0 5px 10px rgba(0, 0, 0, 0.4);
        }

        /* Clean minimal styling like IIT Bombay */
        .stats-card {
          min-height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default AboutDte