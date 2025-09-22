import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, ArrowRight } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

const DepartmentRulesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const departmentRulesData = [
    {
      id: 1,
      title: "Rajasthan Technical Education (Engineering) Rules, 2010",
      category: "Engineering",
      date: "01-01-2010",
      status: "Active"
    },
    {
      id: 2,
      title: "Rajasthan Technical Education (Non-Engineering) Rules, 2010",
      category: "Non-Engineering",
      date: "01-01-2010",
      status: "Active"
    },
    {
      id: 3,
      title: "Rajasthan Technical Education Subordinate Service Rules, 1973",
      category: "Service Rules",
      date: "01-01-1973",
      status: "Active"
    },
    {
      id: 4,
      title: "Rules for Implementation & Management of Self Finance Courses in Govt. Polytechnics",
      category: "Finance",
      date: "15-06-2015",
      status: "Active"
    },
    {
      id: 5,
      title: "Scheme for Providing Facility of Space in Govt. Polytechnics to Pvt. Sector for Educational/Trg. Purpose",
      category: "Infrastructure",
      date: "22-03-2018",
      status: "Active"
    },
    {
      id: 6,
      title: "Rules for Providing Play Grounds & Buildings of Govt. Polytechnics to Pvt. Sector for Educational & Social Activities",
      category: "Infrastructure",
      date: "10-11-2017",
      status: "Active"
    },
    {
      id: 7,
      title: "IDF Rules - 2011",
      category: "Finance",
      date: "05-05-2011",
      status: "Active"
    },
    {
      id: 8,
      title: "NGF Rules - 2011",
      category: "Finance",
      date: "12-12-2011",
      status: "Active"
    },
    {
      id: 9,
      title: "AICTE Public Notice for Fee and Document Refund",
      category: "Notice",
      date: "08-09-2020",
      status: "Active"
    },
    {
      id: 10,
      title: "Inspection Performa for Sampark Portal",
      category: "Guidelines",
      date: "14-07-2021",
      status: "Active"
    }
  ];

  const filteredRules = departmentRulesData.filter(rule => 
    rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.date.includes(searchTerm)
  );

  const getCategoryBadge = (category) => {
    const categoryClasses = {
      'Engineering': 'bg-blue-100 text-blue-800 :bg-blue-900/30 :text-blue-300',
      'Non-Engineering': 'bg-purple-100 text-purple-800 :bg-purple-900/30 :text-purple-300',
      'Service Rules': 'bg-green-100 text-green-800 :bg-green-900/30 :text-green-300',
      'Finance': 'bg-yellow-100 text-yellow-800 :bg-yellow-900/30 :text-yellow-300',
      'Infrastructure': 'bg-indigo-100 text-indigo-800 :bg-indigo-900/30 :text-indigo-300',
      'Notice': 'bg-red-100 text-red-800 :bg-red-900/30 :text-red-300',
      'Guidelines': 'bg-pink-100 text-pink-800 :bg-pink-900/30 :text-pink-300'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryClasses[category] || 'bg-gray-100'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 :from-gray-900 :to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 :from-slate-800 :to-slate-900 text-gray-800 :text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 :bg-blue-900/30 text-blue-700 :text-blue-300 text-sm font-medium mb-6">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Department Rules
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Department Rules & Regulations
            </h1>
            <p className="text-lg text-gray-600 :text-gray-300 max-w-3xl mx-auto">
              Access important department rules, regulations, and guidelines
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
              className="block w-full pl-10 pr-3 py-3 bg-white/90 :bg-gray-800/95 text-gray-900 :text-white placeholder-gray-400 :placeholder-gray-400 rounded-lg 
                         transition-all duration-200 ease-in-out border border-gray-200 :border-gray-700
                         focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                         hover:border-gray-300 :hover:border-gray-600"
              placeholder="Search department rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* Rules List */}
        <div className="bg-white :bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 :border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 :divide-gray-700">
              <thead className="bg-gray-50 :bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Rule / Regulation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white :bg-gray-800 divide-y divide-gray-200 :divide-gray-700">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50 :hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="flex items-center">
                        <FileText className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                        <span className="text-gray-900 :text-white font-medium">
                          {rule.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(rule.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 :text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                        {rule.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a 
                        href={`/documents/department-rules/${rule.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 :text-blue-400 :hover:text-blue-300"
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
      
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default DepartmentRulesPage;
