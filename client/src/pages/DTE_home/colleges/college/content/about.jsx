import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { GraduationCap, Users, Award, MapPin, Calendar, Star, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import gpcData from '../gpc.json';
import gpcAlwerData from '../gpcAlwer.json';

const About = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  // Get college data based on URL or query parameter
  const getCollegeData = () => {
    const queryId = searchParams.get('id');

    if (location.pathname.includes('gpc') || queryId === '1') {
      return gpcData;
    } else if (queryId === '2') {
      return gpcAlwerData;
    }
    return gpcData; // Default fallback
  };

  const collegeData = getCollegeData();
  const { aboutUs, collegeInfo } = collegeData;

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: '#1d293d'}}>
            About <span className="text-[#1d293d]">{collegeInfo.shortName}</span>
          </h2>
          <div className="w-24 h-1 bg-[#1d293d] mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Excellence in technical education since {collegeInfo.established}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Hero Image & Info */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img 
                src={aboutUs.heroImage} 
                alt={`${collegeInfo.shortName} Campus`}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-3">{collegeInfo.name}</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 bg-white/25 backdrop-blur-md rounded-lg px-3 py-1.5 text-sm">
                    <Calendar className="w-4 h-4" />
                    Est. {collegeInfo.established}
                  </span>
                  <span className="flex items-center gap-2 bg-white/25 backdrop-blur-md rounded-lg px-3 py-1.5 text-sm">
                    <MapPin className="w-4 h-4" />
                    {collegeInfo.location}
                  </span>
                </div>
              </div>
            </div>

            {/* College Description */}
            <div className="bg-slate-50 rounded-2xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Our Institution</h3>
                  <p className="text-slate-600">{collegeInfo.type}</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg mb-6">
                {aboutUs.shortDescription}
              </p>
              
              {/* Non-functional Read More Button */}
              <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 cursor-pointer">
                Read More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content - Stats & Features */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Key Statistics */}
            <div className="grid grid-cols-2 gap-6">
              <div className={`bg-white rounded-2xl shadow-lg p-6 text-center border border-slate-200 hover:shadow-xl transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-2">
                  {new Date().getFullYear() - parseInt(collegeInfo.established)}+
                </h4>
                <p className="text-slate-600 font-medium">Years of Excellence</p>
              </div>

              <div className={`bg-white rounded-2xl shadow-lg p-6 text-center border border-slate-200 hover:shadow-xl transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-2">2000+</h4>
                <p className="text-slate-600 font-medium">Students</p>
              </div>

              <div className={`bg-white rounded-2xl shadow-lg p-6 text-center border border-slate-200 hover:shadow-xl transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">8+</h4>
                <p className="text-slate-600 font-medium">Departments</p>
              </div>
            </div>

            {/* Key Features */}
            <div className={`bg-white rounded-2xl shadow-lg p-8 border border-slate-200 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Why Choose {collegeInfo.shortName}?</h3>
              </div>
              
              <div className="grid gap-6">
                <div className={`flex items-start gap-4 transition-all duration-700 delay-1100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900">Industry-Ready Curriculum</h4>
                    <p className="text-slate-600 leading-relaxed">Cutting-edge programs designed with industry experts to meet current market demands</p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 transition-all duration-700 delay-1200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900">World-Class Infrastructure</h4>
                    <p className="text-slate-600 leading-relaxed">State-of-the-art laboratories, modern classrooms, and comprehensive library facilities</p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 transition-all duration-700 delay-1300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900">Expert Faculty</h4>
                    <p className="text-slate-600 leading-relaxed">Highly qualified professors with extensive academic and industry experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;