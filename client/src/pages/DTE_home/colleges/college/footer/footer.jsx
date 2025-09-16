import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import macetData from '../macet.json';
import gpcData from '../gpc.json';

const DynamicCollegeFooter = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  // Get college data based on URL or query parameter
  const getCollegeData = () => {
    const queryId = searchParams.get('id');
    
    if (location.pathname.includes('macet') || id === '0' || queryId === '0') {
      return macetData;
    } else if (location.pathname.includes('gpc') || id === '1' || queryId === '1') {
      return gpcData;
    }
    return macetData; // Default fallback
  };

  const collegeData = getCollegeData();
  const { footer, collegeInfo } = collegeData;
  
  return (
    <footer className="relative bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* College Info */}
            <div className="md:col-span-2 lg:col-span-5">
              <div className="flex items-start gap-4">
                <img 
                  src={collegeInfo.logo || "https://svumshow.com/assets/images/department-logo/pngwing.png"} 
                  alt={`${collegeInfo.name} Logo`} 
                  className="h-16 w-16 object-contain"
                  loading="lazy"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {collegeInfo.name}
                  </h2>
                  <h3 className="text-base font-semibold text-blue-700 dark:text-blue-400 mt-1">
                    {collegeInfo.shortName} - {collegeInfo.type}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                {footer.about.description}
              </p>
              
              {/* Social Media Links */}
              {footer.socialMedia && footer.socialMedia.length > 0 && (
                <div className="flex items-center space-x-4 mt-4">
                  {footer.socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      title={social.platform}
                    >
                      <span className="sr-only">{social.platform}</span>
                      {social.platform === 'Facebook' && <Facebook className="w-5 h-5" />}
                      {social.platform === 'Twitter' && <Twitter className="w-5 h-5" />}
                      {social.platform === 'LinkedIn' && <ExternalLink className="w-5 h-5" />}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1 lg:col-span-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 pb-1.5 border-b border-gray-200 dark:border-gray-800">
                {footer.quickLinks[0]?.title || 'Quick Links'}
              </h3>
              <ul className="space-y-2.5">
                {footer.quickLinks[0]?.links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url} 
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Departments - Removed duplicate section */}
            {/* <div className="md:col-span-1 lg:col-span-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 pb-1.5 border-b border-gray-200 dark:border-gray-800">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {footer.quickLinks?.slice(0, 5).map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url} 
                      className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Contact Info */}
            <div className="md:col-span-1 lg:col-span-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 pb-1.5 border-b border-gray-200 dark:border-gray-800">
                {footer.contact.title}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-blue-700 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{footer.contact.phone}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-blue-700 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">{footer.contact.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-blue-700 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{footer.contact.address.line1}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{footer.contact.address.line2}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{footer.contact.address.line3}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Links Section */}
          {footer.importantLinks && footer.importantLinks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {footer.importantLinks[0].title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {footer.importantLinks[0].links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    {link.text}
                    <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Government Schemes Section (for GPC) */}
          {footer.schemes && footer.schemes.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {footer.schemes[0].title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {footer.schemes[0].links.map((scheme, index) => (
                  <a
                    key={index}
                    href={scheme.url}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    {scheme.text}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
                {footer.copyright.text}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {['Privacy Policy', 'Terms', 'RTI', 'Sitemap'].map((item) => (
                  <a 
                    key={item} 
                    href="#" 
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Developed by <span className="font-medium text-gray-600 dark:text-gray-300">Team ERROR</span>
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

export default DynamicCollegeFooter;