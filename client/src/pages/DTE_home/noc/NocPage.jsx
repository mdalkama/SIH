import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, Download, ArrowRight } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const NocPage = () => {
  const nocData = [
    {
      orderParticulars: "Notification For The NOC Reopen",
      orderNoAndDate: "F-5(230)/NOC/DTE/E2/2025-26/4274 Date 28.04.2024"
    },
    {
      orderParticulars: "Amendment in DTE NOC policy 2023-24",
      orderNoAndDate: "P23(2)/55/TE/2015 P2 VOL-2 Date 12.03.2024"
    },
    {
      orderParticulars: "State Govt. NOC Policy 2023-24",
      orderNoAndDate: "23(2)/55)/TE/2015 Part-2/Vo-2 Jaipur 02.02.2023"
    },
    {
      orderParticulars: "NOC Notification",
      orderNoAndDate: "F-5(230)/NOC/DTE/E2/2025-26/10929"
    },
    {
      orderParticulars: "Affidavit",
      orderNoAndDate: "2025-26"
    },
    {
      orderParticulars: "General Instructions",
      orderNoAndDate: "2025-26"
    },
    {
      orderParticulars: "User Manual for New Institute",
      orderNoAndDate: "2025-26"
    },
    {
      orderParticulars: "User Manual for Existing Institute",
      orderNoAndDate: "2025-26"
    },
    {
      orderParticulars: "User Manual for Geo Tagging",
      orderNoAndDate: "2025-26"
    }
  ]

  const [searchTerm, setSearchTerm] = useState('');

  const filteredNocData = nocData.filter(noc => 
    noc.orderParticulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
    noc.orderNoAndDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              NOC Information
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              No Objection Certificate
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access important NOC documents and information
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
              placeholder="Search NOC documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* NOC Documents Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order Particulars
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order No. and Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNocData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.orderParticulars}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {item.orderNoAndDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Apply Button */}
          <div className="px-6 py-6 bg-gray-50 dark:bg-gray-700 text-center">
            <a
              href="https://rajnoc.rajasthan.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Click Here to Apply online for NOC
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default NocPage
