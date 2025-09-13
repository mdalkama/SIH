import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

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
        {/* NOC Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              NOC Information
            </h1>
          </div>

          {/* NOC Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order Particulars
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order No. and Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {nocData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${
                      index % 2 === 0 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                      {item.orderParticulars}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
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
