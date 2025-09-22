import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, Users, ArrowRightLeft } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const TransferOrdersPage = () => {
  const transferOrders2023_24 = [
    {
      transferOrder: "Transfer List (Gazetted)",
      orderDate: "22.02.2024"
    },
    {
      transferOrder: "Transfer List (Gazetted)",
      orderDate: "20.02.2024"
    },
    {
      transferOrder: "Transfer List (Gazetted)",
      orderDate: "20.02.2024"
    },
    {
      transferOrder: "Transfer List (Non-Gazetted)",
      orderDate: "20.02.2024"
    }
  ]

  const transferOrders2022_23 = [
    {
      transferOrder: "Transfer List (TE)",
      orderDate: "13.01.2023"
    },
    {
      transferOrder: "Transfer List (Non-Gazetted)",
      orderDate: "13.01.2023"
    },
    {
      transferOrder: "Transfer List (Non-Gazetted)",
      orderDate: "04.11.2022"
    },
    {
      transferOrder: "Transfer Order Lecturer(Electrical)",
      orderDate: "09.09.2022"
    }
  ]

  const [searchTerm, setSearchTerm] = useState('');
  const [activeYear, setActiveYear] = useState('2023-24');

  // Combine all transfer orders for searching
  const allTransferOrders = [
    ...transferOrders2023_24.map(item => ({ ...item, year: '2023-24' })),
    ...transferOrders2022_23.map(item => ({ ...item, year: '2022-23' }))
  ];

  const filteredTransferOrders = allTransferOrders.filter(item => 
    (item.transferOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.orderDate.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeYear === 'all' || item.year === activeYear)
  );

  const getTransferType = (title) => {
    if (title.includes('Gazetted')) return 'Gazetted';
    if (title.includes('Non-Gazetted')) return 'Non-Gazetted';
    return 'General';
  };

  const getTransferBadge = (type) => {
    const typeClasses = {
      'Gazetted': 'bg-purple-100 text-purple-800 :bg-purple-900/30 :text-purple-300',
      'Non-Gazetted': 'bg-blue-100 text-blue-800 :bg-blue-900/30 :text-blue-300',
      'General': 'bg-gray-100 text-gray-800 :bg-gray-700 :text-gray-300',
      '2022-23': 'bg-amber-100 text-amber-800 :bg-amber-900/30 :text-amber-300',
      '2023-24': 'bg-green-100 text-green-800 :bg-green-900/30 :text-green-300'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 :from-gray-900 :to-gray-800">
      <Header />
      
      {/* Hero Section */}
      {/* <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 :from-slate-800 :to-slate-900 text-gray-800 :text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 :bg-blue-900/30 text-blue-700 :text-blue-300 text-sm font-medium mb-6">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Employee Transfers
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Transfer Orders
            </h1>
            <p className="text-lg text-gray-600 :text-gray-300 max-w-3xl mx-auto">
              View and search through all transfer orders and notifications for employees
            </p>
          </div>
        </div>
      </div> */}

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
              className="block w-full pl-10 pr-3 py-3 bg-white/90 :bg-gray-800/95 text-gray-900 :text-white placeholder-gray-400 :placeholder-gray-400 rounded-lg 
                         transition-all duration-200 ease-in-out border border-gray-200 :border-gray-700
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                         hover:border-gray-300 :hover:border-gray-600"
              placeholder="Search transfer orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          
          <div className="inline-flex rounded-md shadow-sm w-full md:w-auto">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeYear === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white :bg-gray-700 text-gray-700 :text-gray-200 hover:bg-gray-50 :hover:bg-gray-600'
              }`}
              onClick={() => setActiveYear('all')}
            >
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                All Years
              </span>
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeYear === '2023-24' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white :bg-gray-700 text-gray-700 :text-gray-200 hover:bg-gray-50 :hover:bg-gray-600'
              }`}
              onClick={() => setActiveYear('2023-24')}
            >
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                2023-24
              </span>
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeYear === '2022-23' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white :bg-gray-700 text-gray-700 :text-gray-200 hover:bg-gray-50 :hover:bg-gray-600'
              }`}
              onClick={() => setActiveYear('2022-23')}
            >
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                2022-23
              </span>
            </button>
          </div>
        </div>

        {/* Transfer Orders Table */}
        <div className="bg-white :bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 :border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 :divide-gray-700">
              <thead className="bg-gray-50 :bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Transfer Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white :bg-gray-800 divide-y divide-gray-200 :divide-gray-700">
                {filteredTransferOrders.length > 0 ? (
                  filteredTransferOrders.map((item, index) => {
                    const transferType = getTransferType(item.transferOrder);
                    
                    return (
                      <tr key={`${item.year}-${index}`} className="hover:bg-gray-50 :hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-normal">
                          <div className="flex items-center">
                            <ArrowRightLeft className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                            <span className="text-blue-600 :text-blue-400 hover:underline font-medium">
                              {item.transferOrder}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTransferBadge(transferType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTransferBadge(item.year)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 :text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                            {item.orderDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a 
                            href="#" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 :text-blue-400 :hover:text-blue-300"
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
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 :text-gray-400">
                      No matching transfer orders found.
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

export default TransferOrdersPage
