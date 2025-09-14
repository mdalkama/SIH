import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, Download, ArrowRight } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const TendersAuctionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const tendersData = [
    {
      id: 1,
      tenderReferenceNo: "Fashion and Apparel Design Equipment (Gem Through Bid-Document 1755164015)",
      date: "29-08-2025",
      status: "Upcoming"
    },
    {
      id: 2,
      tenderReferenceNo: "Petroleum Branch Related Items (Gem Through Bid-Document 1755163956)",
      date: "21-07-2025",
      status: "Upcoming"
    },
    {
      id: 3,
      tenderReferenceNo: "MECHANICAL LAB ITEMS (GeM-Bidding-78416770 ME)",
      date: "14-07-2025",
      status: "Active"
    },
    {
      id: 4,
      tenderReferenceNo: "Petroleum Branch Related Items (Gem Through Bid-Document 1755163956)",
      date: "20-06-2025",
      status: "Closed"
    },
    {
      id: 5,
      tenderReferenceNo: "Tender for Stationary Items (Tender ID : 2025_TED2526GSLB00006)",
      date: "20-06-2025",
      status: "Closed"
    },
    {
      id: 6,
      tenderReferenceNo: "Tender for Electronics Lab Items (Tender ID : 2025_TERJD_449570_1)",
      date: "23-02-2025",
      status: "Closed"
    },
    {
      id: 7,
      tenderReferenceNo: "Tender for Civil Lab Items(Tender ID : 2025_TERJD_441341_1)",
      date: "01-01-2025",
      status: "Closed"
    },
    {
      id: 8,
      tenderReferenceNo: "Tender for Electrical Lab Items ( Tender ID : 2024_TERJD_440823_1)",
      date: "28-12-2024",
      status: "Closed"
    },
    {
      id: 9,
      tenderReferenceNo: "Evaluation Summary For the Tender of Mechanical Lab Item (UBN No.TED2425GLOB00010)",
      date: "17-10-2024",
      status: "Closed"
    },
    {
      id: 10,
      tenderReferenceNo: "Corrigendum (Cancel Tender) for Electrical Lab Items(URNNo.TED2426GLOB00011) (Tender ID : 2024_TERJD_440823_1)",
      date: "30-09-2024",
      status: "Cancelled"
    }
  ];

  const filteredTenders = tendersData.filter(tender => 
    tender.tenderReferenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.date.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 text-gray-800 dark:text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Tenders & Auctions
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Access current and archived tender documents and auction details
            </motion.p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-lg -mt-8 mx-4 md:mx-8 lg:mx-auto max-w-7xl">
        <div className="p-6 md:p-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Our Vision
            </motion.div>
            <motion.p 
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              "To enhance the competitiveness of State's technical manpower to global standards by imparting high quality & state of art Technical Education and Training to all sections of the society."
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 bg-white/90 dark:bg-gray-800/95 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg 
                           transition-all duration-200 ease-in-out border border-gray-200 dark:border-gray-700
                           focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                           hover:border-gray-300 dark:hover:border-gray-600"
                placeholder="Search tenders by reference or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>
          </div>
        </div>

        {/* Tenders List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-8 py-5 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-800/80 border-b border-blue-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                  Active Tenders <span className="text-blue-600 dark:text-blue-400">&</span> Auctions
                </h2>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors duration-200 shadow-sm">
                {filteredTenders.length} {filteredTenders.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tender Reference No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTenders.map((tender) => (
                  <tr 
                    key={tender.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tender.tenderReferenceNo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tender.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-end">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {tender.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a 
                        href="#" 
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-end"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTenders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tenders found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try a different search term.' : 'There are currently no active tenders.'}
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTenders.length}</span> of{' '}
                <span className="font-medium">{filteredTenders.length}</span> results
              </p>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  disabled
                >
                  Previous
                </button>
                <button 
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  disabled={filteredTenders.length <= 10}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Need Help with Tenders?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            For any queries regarding the tendering process or to submit documents, please contact our procurement department.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Contact Procurement
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
              View Tender Guidelines
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TendersAuctionsPage;
