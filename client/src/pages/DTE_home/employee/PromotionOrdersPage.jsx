import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

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
        {/* Promotion Orders Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Employee's Promotion Order
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Civil List
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {promotionOrders.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${
                      index % 2 === 0 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                      <span className="hover:underline">
                        {item.civilList}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {item.date}
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

export default PromotionOrdersPage
