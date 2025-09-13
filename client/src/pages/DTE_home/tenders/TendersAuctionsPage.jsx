import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

const TendersAuctionsPage = () => {
  const tendersData = [
    {
      tenderReferenceNo: "Fashion and Apparel Design Equipment (Gem Through Bid-Document 1755164015)",
      date: "29-08-2025"
    },
    {
      tenderReferenceNo: "Petroleum Branch Related Items (Gem Through Bid-Document 1755163956)",
      date: "21-07-2025"
    },
    {
      tenderReferenceNo: "MECHANICAL LAB ITEMS (GeM-Bidding-78416770 ME)",
      date: "14-07-2025"
    },
    {
      tenderReferenceNo: "Petroleum Branch Related Items (Gem Through Bid-Document 1755163956)",
      date: "20-06-2025"
    },
    {
      tenderReferenceNo: "Tender for Stationary Items (Tender ID : 2025_TED2526GSLB00006)",
      date: "20-06-2025"
    },
    {
      tenderReferenceNo: "Tender for Electronics Lab Items (Tender ID : 2025_TERJD_449570_1)",
      date: "23-02-2025"
    },
    {
      tenderReferenceNo: "Tender for Civil Lab Items(Tender ID : 2025_TERJD_441341_1)",
      date: "01-01-2025"
    },
    {
      tenderReferenceNo: "Tender for Electrical Lab Items ( Tender ID : 2024_TERJD_440823_1)",
      date: "28-12-2024"
    },
    {
      tenderReferenceNo: "Evaluation Summary For the Tender of Mechanical Lab Item (UBN No.TED2425GLOB00010)",
      date: "17-10-2024"
    },
    {
      tenderReferenceNo: "Corrigendum (Cancel Tender) for Electrical Lab Items(URNNo.TED2426GLOB00011) (Tender ID : 2024_TERJD_440823_1)",
      date: "30-09-2024"
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
        {/* Tender and Auction Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Tender and Auction
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Tender Reference No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {tendersData.map((item, index) => (
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
                        {item.tenderReferenceNo}
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

export default TendersAuctionsPage
