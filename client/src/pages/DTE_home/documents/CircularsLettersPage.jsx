import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

const CircularsLettersPage = () => {
  const circularsData = [
    {
      particulars: "Date Extend For State Level Fee Assessment Committee Order",
      orderNoAndDate: "Order No. 395 Dated 14.05.2025"
    },
    {
      particulars: "State Level Fee Assessment Committee Order",
      orderNoAndDate: "Order No. 388 Dated 17.04.2025"
    },
    {
      particulars: "State Govt. NOC Policy 2023-24",
      orderNoAndDate: "23(2)(55)/TE/2015 Part-2/Vol-2 Jaipur 02.02.2023"
    },
    {
      particulars: "NOC Process for Year 2020-21 Online Application Fillup",
      orderNoAndDate: "---"
    },
    {
      particulars: "Bond for Permanent Govt. Servants Proceeding for Study Leave [M.Tech. & Ph.D.]",
      orderNoAndDate: "---"
    },
    {
      particulars: "State Govt. NOC Policy",
      orderNoAndDate: "F23(2)TE/2011-II Jaipur 11.07.2016"
    },
    {
      particulars: "1% Reservation for MBC",
      orderNoAndDate: "F7(2)/DOP/Ka-2/2015Part / Dtd. 01.07.2018"
    },
    {
      particulars: "5% Reservation for Benchmark Disabilities",
      orderNoAndDate: "F1(26)/TE/2007 dtd. 29.01.2018"
    },
    {
      particulars: "Proposed Fee Structure 2017-18, 2018-19 & 2019-2020",
      orderNoAndDate: "21.12.2017"
    },
    {
      particulars: "Concession for the ward of Kashmiri Migrates for admission",
      orderNoAndDate: "GOI/ New Delhi 22nd July 2016"
    },
    {
      particulars: "Circular for Reservation in Polytechnics for TSP Area candidates",
      orderNoAndDate: "F1(6)/TE/99 Jaipur dtd. 04.07.2016"
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
        {/* Circulars, Orders & Letters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Circulars, Orders & Letters
            </h1>
          </div>

          {/* Circulars Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Circulars, Orders & Letters
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order No. and Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {circularsData.map((item, index) => (
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
                        {item.particulars}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {item.orderNoAndDate}
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

export default CircularsLettersPage
