import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, Download, ArrowRight } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';
import handbookPdf from '../../../assets/Handbook RTI.pdf';

const RtiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const rtiData = [
    {
      id: 1, 
      orderParticulars: "Information Handbook",
      date: "16-06-2022",
      status: "Active"
    }
  ];

  const filteredRti = rtiData.filter(rti => 
    rti.orderParticulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rti.date.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'bg-green-100 text-green-800 :bg-green-900/30 :text-green-300',
      'Upcoming': 'bg-blue-100 text-blue-800 :bg-blue-900/30 :text-blue-300',
      'Closed': 'bg-gray-100 text-gray-800 :bg-gray-700 :text-gray-300',
      'Cancelled': 'bg-red-100 text-red-800 :bg-red-900/30 :text-red-300'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100'}`}>
        {status}
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
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Our Vision
            </h1>
            <p className="text-lg text-gray-600 :text-gray-300 max-w-3xl mx-auto">
              To enhance the competitiveness of State's technical manpower to global standards by imparting high quality & state of art Technical Education and Training to all sections of the society.
            </p>
          </motion.div>
        </div>
      </div> */}

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
                className="block w-full pl-10 pr-3 py-3 bg-white/90 :bg-gray-800/95 text-gray-900 :text-white placeholder-gray-400 :placeholder-gray-400 rounded-lg 
                           transition-all duration-200 ease-in-out border border-gray-200 :border-gray-700
                           focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                           hover:border-gray-300 :hover:border-gray-600"
                placeholder="Search RTI documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
        </div>

        {/* RTI Documents Table */}
        <div className="bg-white :bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 :border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 :divide-gray-700">
              <thead className="bg-gray-50 :bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Order Particulars
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white :bg-gray-800 divide-y divide-gray-200 :divide-gray-700">
                {filteredRti.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 :hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                        <a 
                          href={handbookPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 :text-blue-400 hover:underline font-medium"
                        >
                          {item.orderParticulars}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 :text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a 
                        href={handbookPdf}
                        download
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 :text-blue-400 :hover:text-blue-300"
                      >
                        Download
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
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default RtiPage
