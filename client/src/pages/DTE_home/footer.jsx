import React from 'react'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative">
      {/* Background Image with Theme-aware Overlays */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://hte.rajasthan.gov.in/css_index/images/s1old.jpg')`
        }}
      >
        {/* Light Mode Overlay - Whitish from top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/50 theme-light-only"></div>
        
        {/* Dark Mode Overlay - Darkish */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60 theme-dark-only"></div>
        
        {/* Footer Content */}
        <div className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content - Department Info Full Width */}
            <div className="mb-12">
              {/* Department Info */}
              <div className="">
                <div className="mb-6">
                  <img 
                    src="https://svumshow.com/assets/images/department-logo/pngwing.png" 
                    alt="Government of Rajasthan Logo" 
                    className="h-24 w-24 object-contain mb-4 theme-logo"
                  />
                  <h3 className="text-2xl font-bold theme-text mb-2">
                    राजस्थान सरकार - तकनीकी शिक्षा निदेशालय
                  </h3>
                  <h4 className="text-lg font-semibold theme-blue-text mb-4">
                    Government of Rajasthan - Department of Technical Education
                  </h4>
                  <p className="mix-blend-color leading-relaxed">
                    Empowering technical education across Rajasthan through innovative learning, 
                    industry partnerships, and skill development programs for a brighter future.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bottom Section - Professional Government Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
              
              {/* Contact Info - Column 1-2 */}
              <div className="md:col-span-1 lg:col-span-2">
                <h5 className="text-lg font-semibold theme-text mb-4">Contact No. & Email :</h5>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="mix-blend-color text-sm">0291-2434395</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <span className="mix-blend-color text-sm">Fax : 0291-2430398</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="mix-blend-color text-sm">dte_raj@rajasthan.gov.in</span>
                  </li>
                  <li className="mix-blend-color text-sm mt-3">
                    <strong>Nodal Officer :</strong> Ajay Agarwal, ADTE
                  </li>
                </ul>
              </div>
              
              {/* Address - Column 3-4 */}
              <div className="md:col-span-1 lg:col-span-2">
                <h5 className="text-lg font-semibold theme-text mb-4">Address</h5>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <span className="mix-blend-color text-sm leading-relaxed">
                    Directorate of Technical Education<br />
                    W-6, Gaurav Path, Residency Road,<br />
                    Jodhpur (Rajasthan) - 342032
                  </span>
                </div>
              </div>
              
              {/* Quick Links - Far Right Column 5-6 */}
              <div className="md:col-span-1 lg:col-span-2">
                <h5 className="text-lg font-semibold theme-text mb-4">Quick Links</h5>
                <ul className="space-y-2">
                  <li><a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">About DTE</a></li>
                  <li><a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Admissions</a></li>
                  <li><a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Colleges</a></li>
                  <li><a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Results</a></li>
                  <li><a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Tenders</a></li>
                </ul>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
              <div className="flex flex-col space-y-4">
                {/* Website Design & Updated by */}
                <div className="text-center">
                  <p className="mix-blend-color text-sm">
                    <strong>Website Design & Updated by :</strong> Team X ERROR
                  </p>
                  <p className="mix-blend-color text-sm">
                    Directorate of Technical Education, Jodhpur
                  </p>
                </div>
                
                {/* Copyright and Last Updated */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                  <p className="mix-blend-color text-sm">
                    Copyright ©2019 Directorate Of Technical Education, Rajasthan
                  </p>
                  <p className="mix-blend-color text-sm">
                    <strong>Last Updated :</strong> 12/9/2025, 1:59:45 am
                  </p>
                </div>
                
                {/* Links */}
                <div className="flex flex-wrap justify-center space-x-6">
                  <a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Privacy Policy</a>
                  <a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Terms of Service</a>
                  <a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">RTI</a>
                  <a href="#" className="mix-blend-color hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Sitemap</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for theme-specific overlays */}
      <style jsx>{`
        .theme-light-only {
          display: block;
        }
        
        .theme-dark-only {
          display: none;
        }
        
        .theme-dark .theme-light-only {
          display: none;
        }
        
        .theme-dark .theme-dark-only {
          display: block;
        }
      `}</style>
    </footer>
  )
}

export default Footer