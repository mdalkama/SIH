import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, ExternalLink, Clock, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

// Current date with Indian format
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Quick Links Data
const quickLinks = [
  { name: 'Director Desk', path: '/director-desk' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Holidays', path: '/holidays' },
  { name: 'Fee Structure', path: '/admissions/fee-structure' },
  { name: 'Admin Login', path: '/admin', external: true },
  { name: 'Student Feedback', path: '/student-feedback' },
  { name: 'Faculty Feedback', path: '/faculty-feedback' },
];

// Important Links Data
const importantLinks = [
  { name: 'AICTE', url: 'https://www.aicte-india.org/' },
  { name: 'AKU', url: 'https://www.aku.edu/' },
  { name: 'BEU', url: 'https://www.beu.ac.in/' },
  { name: 'SBTE', url: 'https://www.sbte.bihar.gov.in/' },
  { name: 'NPTEL', url: 'https://nptel.ac.in/' },
  { name: 'Student Credit Card', url: 'https://www.7nishchay-yuvaupmission.bihar.gov.in/' },
  { name: 'MOMA Scholarship', path: '/moma-scholarship' },
  { name: 'Alumni', path: '/alumni' },
];

// Social Media Links
const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
];

// Contact Information
const contactInfo = {
  address: 'Sikandarpur, Kankarbagh, Patna, Bihar 800020',
  phone: ['+91 1234567890', '+91 9876543210'],
  email: 'info@macet.ac.in',
  workingHours: 'Mon - Sat: 9:00 AM - 5:00 PM',
};

const MacetFooter = () => {
  const [currentDate, setCurrentDate] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setCurrentDate(getCurrentDate());
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <footer className="relative bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      {/* Top Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-400"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* College Info */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://macet.ac.in/assets/img/logo.png" 
                    alt="MACET Logo" 
                    className="h-20 w-20 object-contain"
                    loading="lazy"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">
                      मौलाना अज़ाद कॉलेज ऑफ़ इंजीनियरिंग एंड टेक्नोलॉजी
                    </h2>
                    <h3 className="text-base font-semibold text-blue-200 mt-1">
                      Maulana Azad College of Engineering & Technology
                    </h3>
                  </div>
                </div>
                <p className="text-blue-100 text-sm mt-2 mb-4">
                  Empowering engineering education through innovation, excellence, and industry partnerships. 
                  Committed to developing skilled professionals for tomorrow's technological challenges.
                </p>
                
                {/* Social Media */}
                <div className="mt-auto pt-4 border-t border-blue-700">
                  <h4 className="text-sm font-semibold text-white mb-3">Connect With Us</h4>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-800 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-300"
                        aria-label={social.name}
                      >
                        <social.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-bold text-white mb-5 pb-2 border-b border-blue-700">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index} className="group">
                    <a 
                      href={link.path} 
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : ""}
                      className="flex items-center text-blue-100 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3 group-hover:bg-white transition-colors duration-300"></span>
                      {link.name}
                      {link.external && <ExternalLink className="w-3 h-3 ml-2 opacity-70" />}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Important Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-bold text-white mb-5 pb-2 border-b border-blue-700">
                Important Links
              </h3>
              <ul className="space-y-3">
                {importantLinks.map((link, index) => (
                  <li key={index} className="group">
                    <a 
                      href={link.url || link.path} 
                      target={link.url ? "_blank" : "_self"}
                      rel={link.url ? "noopener noreferrer" : ""}
                      className="flex items-center text-blue-100 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3 group-hover:bg-white transition-colors duration-300"></span>
                      {link.name}
                      {link.url && <ExternalLink className="w-3 h-3 ml-2 opacity-70" />}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-bold text-white mb-5 pb-2 border-b border-blue-700">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="bg-blue-800 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-white">Address</h4>
                    <p className="text-sm text-blue-100 mt-1 leading-relaxed">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="bg-blue-800 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-white">Phone</h4>
                    <div className="space-y-1 mt-1">
                      {contactInfo.phone.map((number, index) => (
                        <a 
                          key={index} 
                          href={`tel:${number}`}
                          className="block text-sm text-blue-100 hover:text-white transition-colors duration-200"
                        >
                          {number}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="bg-blue-800 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <Mail className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-white">Email</h4>
                    <a 
                      href={`mailto:${contactInfo.email}`} 
                      className="text-sm text-blue-100 hover:text-white transition-colors duration-200 block mt-1"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="bg-blue-800 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <Clock className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-white">Working Hours</h4>
                    <p className="text-sm text-blue-100 mt-1">
                      {contactInfo.workingHours}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Current Date & Time */}
              <div className="mt-6 pt-4 border-t border-blue-700">
                <div className="text-center bg-blue-800/50 rounded-lg p-3">
                  <p className="text-xs text-blue-200">Today is</p>
                  <p className="text-sm font-medium text-white mt-1">{currentDate}</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-blue-800/30 rounded-xl p-6 lg:col-span-4"
          >
            <h3 className="text-lg font-bold text-white mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-blue-100 text-sm mb-4">
              Stay updated with the latest news, events, and announcements from MACET.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-900/50 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-6 py-2.5 rounded-lg transition-colors duration-300 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-blue-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-blue-300">
                &copy; {currentYear} Maulana Azad College of Engineering & Technology. All rights reserved.
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Designed & Developed by <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">MACET IT Department</a>
              </p>
            </div>
            
            <div className="flex justify-center md:justify-end space-x-6">
              <a 
                href="/privacy-policy" 
                className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a 
                href="/sitemap" 
                className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
              >
                Sitemap
              </a>
              <a 
                href="/disclaimer" 
                className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
              >
                Disclaimer
              </a>
            </div>
          </div>
          
          {/* Scroll to Top Button */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center text-xs text-blue-300 hover:text-white transition-colors duration-200"
              aria-label="Back to top"
            >
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 10l7-7m0 0l7 7m-7-7v18" 
                />
              </svg>
              Back to Top
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-400"></div>
              <h3 className="text-base font-semibold text-gray-900 mb-3 pb-1.5 border-b border-gray-200">
                Committees & Cell
              </h3>
              <ul className="space-y-2.5 mb-6">
                <li>
                  <a 
                    href="/macet/committees/women-cell" 
                    className="flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                    Women Cell
                  </a>
                </li>
                <li>
                  <a 
                    href="/macet/committees/anti-ragging-cell" 
                    className="flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                    Anti-Ragging Cell
                  </a>
                </li>
                <li>
                  <a 
                    href="/macet/committees/proctor-cell" 
                    className="flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                    Proctor Cell
                  </a>
                </li>
                <li>
                  <a 
                    href="/macet/committees/sc-st-cell" 
                    className="flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
                    SC/ST Cell
                  </a>
                </li>
                <li>
    </footer>
  );
};

export default MacetFooter;
