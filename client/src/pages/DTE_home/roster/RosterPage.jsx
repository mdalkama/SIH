import React from 'react';
import { motion } from 'framer-motion';
import Header from '../header_dte';
import Footer from '../footer';
import { ChevronRight, Users, FileText, UserCheck, UserPlus, UserCog, UserX, Users as TeamIcon } from 'lucide-react';

const RosterPage = () => {
  // State for active tab (commented out for now as it's not used)
  // const [activeTab, setActiveTab] = useState('all');
  
  const rosterCategories = [
    {
      title: "Establishment Officer",
      items: [
        "As on 01-04-2024",
        "After Cadre Restructuring"
      ],
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      title: "Administrative Officer",
      items: [
        "As on 01-04-2024",
        "After Cadre Restructuring"
      ],
      icon: <UserCog className="w-5 h-5" />
    },
    {
      title: "Support Staff",
      items: [
        "Private Secretary",
        "Additional Private Secretary",
        "Personal Assistant Grade-I"
      ],
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Full Roster",
      items: ["View Complete Roster"],
      icon: <TeamIcon className="w-5 h-5" />
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 :from-gray-900 :to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 :from-slate-800 :to-slate-900 text-gray-800 :text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Vision
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 :text-gray-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              To enhance the competitiveness of State's technical manpower to global standards by imparting high quality & state of art Technical Education and Training to all sections of the society.
            </motion.p>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {rosterCategories.map((category, index) => (
            <motion.div 
              key={index}
              className="bg-white :bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 :border-gray-700"
              variants={item}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-blue-100 :bg-blue-900/50 text-blue-600 :text-blue-300 mr-3">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 :text-white">
                    {category.title}
                  </h3>
                </div>
                <ul className="space-y-3 mt-4">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        href="#"
                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 :hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <span className="text-gray-700 :text-gray-300 group-hover:text-blue-600 :group-hover:text-blue-400 transition-colors">
                          {item}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Information */}
        <motion.div 
          className="mt-12 bg-white :bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 :border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-blue-100 :bg-blue-900/50 text-blue-600 :text-blue-300 mr-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 :text-white">
              Additional Information
            </h3>
          </div>
          <p className="text-gray-600 :text-gray-400 mb-4">
            For any queries or updates regarding the roster, please contact the administration office.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Download Roster (PDF)
            </button>
            <button className="px-4 py-2 border border-gray-300 :border-gray-600 text-gray-700 :text-gray-300 hover:bg-gray-50 :hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
              Contact HR Department
            </button>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RosterPage;
