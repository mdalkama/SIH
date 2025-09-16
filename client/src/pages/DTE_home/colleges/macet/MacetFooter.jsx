import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, ExternalLink, Clock, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

// Current date with Indian format
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Quick Links Data
const quickLinks = [
  { name: 'Director Desk', path: '/director-desk' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Admission', path: '/admission' },
  { name: 'Departments', path: '/departments' },
  { name: 'Academics', path: '/academics' },
  { name: 'Placement', path: '/placement' }
];

// Important Links Data
const importantLinks = [
  { name: 'AICTE', url: 'https://www.aicte-india.org/' },
  { name: 'Bihar Engineering University', url: 'https://www.beu-bih.ac.in/' },
  { name: 'SBTE Bihar', url: 'http://sbtebihar.gov.in/' },
  { name: 'NPTEL', url: 'https://nptel.ac.in/' },
  { name: 'NAAC', url: 'https://naac.gov.in/' },
  { name: 'NIRF', url: 'https://www.nirfindia.org/' }
];

// Social Media Links
const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/macetofficial' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/macetofficial' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/macetofficial' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/macetofficial' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/school/macetofficial' }
];

// Contact Information
const contactInfo = {
  address: 'Marium Manzil, Anisabad, Patna, Bihar - 800002',
  phone: ['+91-612-2254569', '+91-9431049755'],
  email: 'info@macet.ac.in',
  workingHours: 'Mon-Sat: 9:00 AM - 5:00 PM',
  cityOffice: 'Marium Manzil, Anisabad, Patna, Bihar - 800002',
  campus: 'NH-31, Pahleja Ghat, Khagaul, Patna, Bihar - 801105'
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
    <footer className="relative bg-white text-gray-900">
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
                    src="https://1.bp.blogspot.com/-PAhIIGTrAIc/YGQvB1Ode6I/AAAAAAAAOOM/DqjPA77lxYMqjzjWie1jSc2il8avf3m_ACLcBGAsYHQ/s0/download.png" 
                    alt="MACET Logo" 
                    className="h-20 w-20 object-contain"
                    loading="lazy"
                  />
                  <div>
                   
                    <h3 className="text-base font-semibold text-gray-700 mt-1">
                      Maulana Azad College of Engineering & Technology
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 mb-4">
                  Empowering engineering education through innovation, excellence, and industry partnerships. 
                  Committed to developing skilled professionals for tomorrow's technological challenges.
                </p>
                
                {/* Social Media */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Connect With Us</h4>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition-colors duration-300"
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
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index} className="group">
                    <a 
                      href={link.path} 
                      className="flex items-center text-gray-600 hover:text-blue-700 transition-colors duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3 group-hover:bg-blue-700 transition-colors duration-300"></span>
                      {link.name}
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
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">
                Important Links
              </h3>
              <ul className="space-y-3">
                {importantLinks.map((link, index) => (
                  <li key={index} className="group">
                    <a 
                      href={link.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-blue-700 transition-colors duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3 group-hover:bg-blue-700 transition-colors duration-300"></span>
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
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
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="bg-blue-800 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-gray-900">Address</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="bg-blue-800 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-gray-900">Phone</h4>
                    <div className="space-y-1 mt-1">
                      {contactInfo.phone.map((number, index) => (
                        <a 
                          key={index} 
                          href={`tel:${number}`}
                          className="block text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200"
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
                    <h4 className="text-sm font-semibold text-gray-900">Email</h4>
                    <a 
                      href={`mailto:${contactInfo.email}`} 
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 block mt-1"
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
                    <h4 className="text-sm font-semibold text-gray-900">Working Hours</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {contactInfo.workingHours}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Current Date & Time */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center bg-blue-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Today is</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{currentDate}</p>
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
            className="mt-12 bg-gray-100 rounded-xl p-6 lg:col-span-4"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">
              Stay updated with the latest news, events, and announcements from MACET.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-300 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {currentYear} Maulana Azad College of Engineering & Technology. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Designed & Developed by <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">MACET IT Department</a>
              </p>
            </div>
            
            <div className="flex justify-center md:justify-end space-x-6">
              <a 
                href="/privacy-policy" 
                className="text-gray-600 hover:text-blue-700 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-gray-600 hover:text-blue-700 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a 
                href="/sitemap" 
                className="text-gray-600 hover:text-blue-700 transition-colors duration-200"
              >
                Sitemap
              </a>
              <a 
                href="/disclaimer" 
                className="text-gray-600 hover:text-blue-700 transition-colors duration-200"
              >
                Disclaimer
              </a>
            </div>
          </div>
          
          {/* Scroll to Top Button */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center text-xs text-gray-600 hover:text-blue-700 transition-colors duration-200"
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
    </footer>
  );
};

export default MacetFooter;
