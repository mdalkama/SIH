import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, ArrowRight, UserPlus, Users } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const PostingOrdersPage = () => {
  const compassionatePostingOrders = [
    {
      orderParticulars: "Posting Order",
      orderDate: "26/11/2024"
    },
    {
      orderParticulars: "Posting Order",
      orderDate: "11/01/2024"
    }
  ]

  const employeePostingOrders = [
    {
      orderParticulars: "Posting Order of Lect. (Maths)",
      orderDate: "16.02.2023"
    },
    {
      orderParticulars: "Posting Order of Lect. Civil Engg.",
      orderDate: "23.01.2023"
    },
    {
      orderParticulars: "Posting Order of Lect. Mechanical Engg. against non joiners",
      orderDate: "30.11.2022"
    },
    {
      orderParticulars: "Posting Order of Lect. Electrical Engg. against non joiners",
      orderDate: "30.11.2022"
    },
    {
      orderParticulars: "Posting Order of Senior Assistant",
      orderDate: "01.10.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Mathematics)",
      orderDate: "29.09.2022"
    },
    {
      orderParticulars: "Posting Order of Assistant Administrative Officer (2021-22)",
      orderDate: "12.08.2022 (Amendment)"
    },
    {
      orderParticulars: "Posting Order of Assistant Administrative Officer (2021-22)",
      orderDate: "26.07.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Civil)",
      orderDate: "29.07.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Mechanical)",
      orderDate: "28.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Chemistry)",
      orderDate: "14.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Electrical)",
      orderDate: "14.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Mechanical)",
      orderDate: "14.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Civil)",
      orderDate: "06.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Physics)",
      orderDate: "03.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (English)",
      orderDate: "03.06.2022"
    },
    {
      orderParticulars: "Electrical Engg. Lecturer Posting Order",
      orderDate: "10.01.2020"
    },
    {
      orderParticulars: "Lecturer Mech. Engg. Posting Order",
      orderDate: "27.11.2019"
    },
    {
      orderParticulars: "Cancelation of Posting Order Lecturer Mech. Engg.",
      orderDate: "30.09.2019"
    },
    {
      orderParticulars: "Posting Order of Ms. Jyoti Jeengar",
      orderDate: "24.09.2019"
    }
  ]

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('employee');

  const filteredCompassionateOrders = compassionatePostingOrders.filter(item => 
    item.orderParticulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.orderDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmployeeOrders = employeePostingOrders.filter(item => 
    item.orderParticulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.orderDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrderType = (title) => {
    if (title.includes('Lecturer') || title.includes('Lect.')) {
      return 'Teaching';
    } else if (title.includes('Assistant') || title.includes('Officer')) {
      return 'Administrative';
    }
    return 'Other';
  };

  const getOrderTypeBadge = (type) => {
    const typeClasses = {
      'Teaching': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Administrative': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
              Employee Posting Orders
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Posting Orders & Notifications
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              View and search through all posting orders and notifications for employees
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
              placeholder="Search posting orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          
          <div className="inline-flex rounded-md shadow-sm w-full md:w-auto">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'compassionate' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveTab('compassionate')}
            >
              <span className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Compassionate Posting
              </span>
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'employee' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveTab('employee')}
            >
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Employee Posting
              </span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order Particulars
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {activeTab === 'compassionate' ? (
                  filteredCompassionateOrders.length > 0 ? (
                    filteredCompassionateOrders.map((item, index) => (
                      <tr key={`compassionate-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-normal">
                          <div className="flex items-center">
                            <FileText className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                            <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                              {item.orderParticulars}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getOrderTypeBadge('Compassionate')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                            {item.orderDate}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No matching compassionate posting orders found.
                      </td>
                    </tr>
                  )
                ) : (
                  filteredEmployeeOrders.length > 0 ? (
                    filteredEmployeeOrders.map((item, index) => {
                      const orderType = getOrderType(item.orderParticulars);
                      return (
                        <tr key={`employee-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-normal">
                            <div className="flex items-center">
                              <FileText className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                              <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                {item.orderParticulars}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getOrderTypeBadge(orderType)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                              {item.orderDate}
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
                        No matching employee posting orders found.
                      </td>
                    </tr>
                  )
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

export default PostingOrdersPage
