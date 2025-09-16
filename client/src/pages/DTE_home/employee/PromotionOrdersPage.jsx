import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, ArrowRight, Award, UserCheck } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const PromotionOrdersPage = () => {
  const promotionOrders = [
    {
      civilList: "Provisional Promotion Order of Senior Assistant 2021-22",
      date: "19.09.2022"
    },
    {
      civilList: "Promotion Order of Assistant Administrative 2021-22",
      date: "01.04.2019"
    }
  ]

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPromotionOrders = promotionOrders.filter(item => 
    item.civilList.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPromotionType = (title) => {
    if (title.includes('Provisional')) return 'Provisional';
    if (title.includes('Regular')) return 'Regular';
    return 'General';
  };

  const getPromotionBadge = (type) => {
    const typeClasses = {
      'Provisional': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Regular': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'General': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[type]}`}>
        {type}
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
              Employee Promotions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Promotion Orders
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              View and search through all promotion orders and notifications for employees
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              placeholder="Search promotion orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          
          <div className="inline-flex rounded-md shadow-sm w-full md:w-auto">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                All Promotions
              </span>
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'provisional' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('provisional')}
            >
              <span className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Provisional
              </span>
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'regular' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('regular')}
            >
              <span className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Regular
              </span>
            </button>
          </div>
        </div>

        {/* Promotion Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Promotion Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Effective Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPromotionOrders.length > 0 ? (
                  filteredPromotionOrders.map((item, index) => {
                    const promotionType = getPromotionType(item.civilList);
                    
                    // Apply tab filtering
                    if (activeTab === 'provisional' && promotionType !== 'Provisional') return null;
                    if (activeTab === 'regular' && promotionType !== 'Regular') return null;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-normal">
                          <div className="flex items-center">
                            <FileText className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                            <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                              {item.civilList}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPromotionBadge(promotionType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a 
                            href="#" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View Details
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No matching promotion orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default PromotionOrdersPage
