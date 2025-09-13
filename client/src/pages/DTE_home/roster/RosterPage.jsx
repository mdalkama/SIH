import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

const RosterPage = () => {
  const rosterData = [
    "Establishment Officer (As on 01-04-2024)",
    "Establishment Officer (After Cadre Restructuring)",
    "Administrative Officer (As on 01-04-2024)",
    "Administrative Officer(After Cadre Restructuring)",
    "Private Secretary",
    "Additional Private Secretary",
    "Personal Assistant Grade-I",
    "Roster Of Personnel"
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
        {/* Roster Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Roster Of Personnel
            </h1>
          </div>

          {/* Roster List */}
          <div className="px-6 py-8">
            <div className="space-y-4">
              {rosterData.map((item, index) => (
                <div key={index} className="group">
                  <a
                    href="#"
                    className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 text-sm font-medium cursor-pointer hover:underline"
                  >
                    {item}
                  </a>
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

export default RosterPage
