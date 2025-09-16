import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, ArrowRight } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const EstablishmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const establishmentData = [
    {
      id: 1,
      title: "New Policy 2024 for Pursuing Higher Study",
      category: "Policy",
      date: "01-01-2024",
      status: "Active"
    },
    {
      id: 2,
      title: "CAS (Non-Engg.) VI Pay Scale Order",
      category: "Order",
      date: "15-12-2023",
      status: "Active"
    },
    {
      id: 3,
      title: "Roster of Personnel",
      category: "Roster",
      date: "01-12-2023",
      status: "Active"
    },
    {
      id: 4,
      title: "Order Regarding CAS [12 Dec. 2017]",
      category: "Order",
      date: "12-12-2017",
      status: "Active"
    },
    {
      id: 5,
      title: "CAS for the Lecturers, Librarians & PTI Polytechnic Colleges (Engg.) under VI Pay Scales (Dtd. 05.12.2017)",
      category: "Order",
      date: "05-12-2017",
      status: "Active"
    },
    {
      id: 6,
      title: "Department Manual for Polytechnics",
      category: "Manual",
      date: "01-01-2017",
      status: "Active"
    }
  ];

  const filteredEstablishment = establishmentData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  const getCategoryBadge = (category) => {
    const categoryClasses = {
      'Policy': 'bg-blue-100 text-blue-800',
      'Order': 'bg-purple-100 text-purple-800',
      'Roster': 'bg-green-100 text-green-800',
      'Manual': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryClasses[category] || 'bg-gray-100'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 text-gray-800 dark:text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Establishment
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Establishment
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access important establishment documents and information
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 bg-white/90 dark:bg-gray-800/95 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg 
                         transition-all duration-200 ease-in-out border border-gray-200 dark:border-gray-700
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                         hover:border-gray-300 dark:hover:border-gray-600"
              placeholder="Search establishment documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="w-full">
            <div className="w-full overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/5">
                      Document Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEstablishment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                          <span className="text-gray-900 dark:text-white font-medium break-words max-w-xs">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24">
                          {getCategoryBadge(item.category)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                          {item.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <a 
                          href={`/documents/establishment/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Details
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default EstablishmentPage;
