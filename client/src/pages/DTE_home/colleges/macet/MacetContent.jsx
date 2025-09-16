import React from 'react';
import { FaUsers, FaBookOpen, FaAward, FaBuilding, FaMicroscope, FaDesktop, FaDumbbell, FaTheaterMasks, FaHome } from 'react-icons/fa';
import macetData from './data/macetData.json';

// Import components
import NoticeTicker from './components/NoticeTicker';
import NoticeBoard from './components/NoticeBoard';
import StatsSection from './components/StatsSection';
import AboutSection from './components/AboutSection';
import DepartmentsSection from './components/DepartmentsSection';
import NewsSection from './components/NewsSection';
import FacilitiesSection from './components/FacilitiesSection';
import ContactSection from './components/ContactSection';

const MacetContent = () => {
  // Data for components
  const stats = [
    { 
      icon: FaUsers, 
      label: 'Students Enrolled', 
      value: '2500+', 
      color: 'text-blue-600' 
    },
    { 
      icon: FaBookOpen, 
      label: 'Academic Programs', 
      value: '15+', 
      color: 'text-green-600' 
    },
    { 
      icon: FaAward, 
      label: 'Years of Excellence', 
      value: '39+', 
      color: 'text-purple-600' 
    },
    { 
      icon: FaBuilding, 
      label: 'Departments', 
      value: '8', 
      color: 'text-orange-600' 
    }
  ];

  const departments = [
    {
      name: 'Computer Science & Engineering',
      description: 'Advanced computing, AI, and software development',
      icon: '💻',
      students: '450+'
    },
    {
      name: 'Electronics & Communication',
      description: 'Digital systems, telecommunications, and embedded systems',
      icon: '📡',
      students: '380+'
    },
    {
      name: 'Mechanical Engineering',
      description: 'Manufacturing, thermal systems, and design engineering',
      icon: '⚙️',
      students: '420+'
    },
    {
      name: 'Civil Engineering',
      description: 'Infrastructure, construction, and environmental engineering',
      icon: '🏗️',
      students: '350+'
    },
    {
      name: 'Electrical Engineering',
      description: 'Power systems, control engineering, and renewable energy',
      icon: '⚡',
      students: '320+'
    },
    {
      name: 'Information Technology',
      description: 'Software engineering, web development, and data science',
      icon: '🌐',
      students: '280+'
    }
  ];

  const news = [
    {
      title: 'MACET Achieves NAAC A+ Grade Accreditation',
      date: '2024-01-15',
      category: 'Achievement',
      excerpt: 'College receives highest grade in quality assessment...'
    },
    {
      title: 'Annual Tech Fest 2024 - Innovation Summit',
      date: '2024-02-20',
      category: 'Event',
      excerpt: 'Three-day technical festival showcasing student innovations...'
    },
    {
      title: 'New Industry Partnership with TCS',
      date: '2024-01-30',
      category: 'Partnership',
      excerpt: 'Strategic collaboration for student training and placements...'
    },
    {
      title: 'Research Paper Published in IEEE Journal',
      date: '2024-02-05',
      category: 'Research',
      excerpt: 'Faculty and students contribute to international research...'
    }
  ];

  const facilities = [
    {
      name: 'Central Library',
      description: 'Over 50,000 books and digital resources',
      icon: FaBookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Modern Laboratories',
      description: 'State-of-the-art equipment for all departments',
      icon: FaMicroscope,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Computer Center',
      description: '500+ computers with high-speed internet',
      icon: FaDesktop,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Sports Complex',
      description: 'Indoor and outdoor sports facilities',
      icon: FaDumbbell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Auditorium',
      description: '1000-seater air-conditioned auditorium',
      icon: FaTheaterMasks,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'Hostels',
      description: 'Separate hostels for boys and girls',
      icon: FaHome,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notice Ticker */}
      <macetnavbar/>
      <NoticeTicker notices={macetData.notices} />
      
      {/* Main Notice Board */}
      <NoticeBoard notices={macetData.notices} />
      <AboutSection />
      <NewsSection news={news} />
      <FacilitiesSection facilities={facilities} />
     
    </div>
  );
};

export default MacetContent;
