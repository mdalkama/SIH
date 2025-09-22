import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-white  text-gray-700  border-t border-gray-200 ">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Department Info */}
            <div className="md:col-span-2 lg:col-span-5">
              <div className="flex items-start gap-4">
                <img 
                  src="https://svumshow.com/assets/images/department-logo/pngwing.png" 
                  alt="Government of Rajasthan Logo" 
                  className="h-16 w-16 object-contain"
                  loading="lazy"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900  leading-tight">
                    राजस्थान सरकार - तकनीकी शिक्षा निदेशालय
                  </h2>
                  <h3 className="text-base font-semibold text-blue-700  mt-1">
                    Government of Rajasthan - Department of Technical Education
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600  mt-3">
                Empowering technical education across Rajasthan through innovative learning, 
                industry partnerships, and skill development programs.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1 lg:col-span-2">
              <h3 className="text-base font-semibold text-gray-900  mb-3 pb-1.5 border-b border-gray-200 dark:border-gray-800">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a 
                    href="#about-dte-section" 
                    className="flex items-center text-sm text-gray-600  hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('about-dte-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    About DTE
                  </a>
                </li>
                <li>
                  <a 
                    href="/admission/diploma-engineering-first-year" 
                    className="flex items-center text-sm text-gray-600  hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Admissions
                  </a>
                </li>
                <li>
                  <a 
                    href="/colleges" 
                    className="flex items-center text-sm text-gray-600  hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Colleges
                  </a>
                </li>
                <li>
                  <a 
                    href="https://dteapp.hte.rajasthan.gov.in/eng_sem_result/appMay24/pages/search_result_rwh_end_term" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600  hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Results
                    <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />
                  </a>
                </li>
                <li>
                  <a 
                    href="/tenders-auctions" 
                    className="flex items-center text-sm text-gray-600  hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Tenders
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-1 lg:col-span-5">
              <h3 className="text-base font-semibold text-gray-900  mb-3 pb-1.5 border-b border-gray-200 dark:border-gray-800">
                Contact Us
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-start mb-3">
                    <Phone className="w-4 h-4 text-blue-700  mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 ">+91-291-2434395</p>
                      <p className="text-xs text-gray-500 ">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-blue-700  mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 ">+91-291-2430398</p>
                      <p className="text-xs text-gray-500 ">Fax</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-3">
                    <Mail className="w-4 h-4 text-blue-700  mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900  break-all">dte_raj@rajasthan.gov.in</p>
                      <p className="text-xs text-gray-500 ">Email</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-blue-700  mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 ">Nodal Officer</p>
                      <p className="text-xs text-gray-500 ">Ajay Agarwal, ADTE</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 ">
                Address: W-6, Gaurav Path, Residency Road, Jodhpur, Rajasthan - 342032
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500  text-center sm:text-left">
                © {currentYear} Directorate Of Technical Education, Rajasthan
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {['Privacy Policy', 'Terms', 'RTI', 'Sitemap'].map((item) => (
                  <a 
                    key={item} 
                    href="#" 
                    className="text-xs text-gray-500  hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Developed by <span className="font-medium text-gray-600 ">Team ERROR</span>
                <span className="mx-2">•</span>
                Last Updated: {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;