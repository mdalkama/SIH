import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

const DepartmentRulesPage = () => {
  const departmentRulesData = [
    {
      title: "Rajasthan Technical Education (Engineering) Rules, 2010"
    },
    {
      title: "Rajasthan Technical Education (Non-Engineering) Rules, 2010"
    },
    {
      title: "Rajasthan Technical Education Subordinate Service Rules, 1973"
    },
    {
      title: "Rules for Implementation & Management of Self Finance Courses in Govt. Polytechnics"
    },
    {
      title: "Scheme for Providing Facility of Space in Govt. Polytechnics to Pvt. Sector for Educational/Trg. Purpose"
    },
    {
      title: "Rules for Providing Play Grounds & Buildings of Govt. Polytechnics to Pvt. Sector for Educational & Social Activities"
    },
    {
      title: "IDF Rules - 2011"
    },
    {
      title: "NGF Rules - 2011"
    },
    {
      title: "AICTE Public Notice for Fee and Document Refund"
    },
    {
      title: "Inspection Performa for Sampark Portal"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Component */}
      <Header />
      
      {/* Vision Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vision :
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              "To enhance the competitiveness of State's technical manpower to global standards by imparting high quality & state of art Technical Education and Training to all sections of the society."
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Rules Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Department Rules
            </h1>
          </div>

          {/* Department Rules List */}
          <div className="p-6">
            <div className="space-y-4">
              {departmentRulesData.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg px-3"
                >
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-grow">
                    <a 
                      href="#" 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer text-sm"
                    >
                      {item.title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default DepartmentRulesPage
