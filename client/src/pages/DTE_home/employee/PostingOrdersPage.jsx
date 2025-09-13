import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

const PostingOrdersPage = () => {
  const compassionatePostingOrders = [
    {
      orderParticulars: "Posting Order",
      orderDate: "26/11/2024"
    },
    {
      orderParticulars: "Posting Order",
      orderDate: "11/01/2024"
    }
  ]

  const employeePostingOrders = [
    {
      orderParticulars: "Posting Order of Lect. (Maths)",
      orderDate: "16.02.2023"
    },
    {
      orderParticulars: "Posting Order of Lect. Civil Engg.",
      orderDate: "23.01.2023"
    },
    {
      orderParticulars: "Posting Order of Lect. Mechanical Engg. against non joiners",
      orderDate: "30.11.2022"
    },
    {
      orderParticulars: "Posting Order of Lect. Electrical Engg. against non joiners",
      orderDate: "30.11.2022"
    },
    {
      orderParticulars: "Posting Order of Senior Assistant",
      orderDate: "01.10.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Mathematics)",
      orderDate: "29.09.2022"
    },
    {
      orderParticulars: "Posting Order of Assistant Administrative Officer (2021-22)",
      orderDate: "12.08.2022 (Amendment)"
    },
    {
      orderParticulars: "Posting Order of Assistant Administrative Officer (2021-22)",
      orderDate: "26.07.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Civil)",
      orderDate: "29.07.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Mechanical)",
      orderDate: "28.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Chemistry)",
      orderDate: "14.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Electrical)",
      orderDate: "14.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Mechanical)",
      orderDate: "14.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Civil)",
      orderDate: "06.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (Physics)",
      orderDate: "03.06.2022"
    },
    {
      orderParticulars: "Posting Order of Lecturer (English)",
      orderDate: "03.06.2022"
    },
    {
      orderParticulars: "Electrical Engg. Lecturer Posting Order",
      orderDate: "10.01.2020"
    },
    {
      orderParticulars: "Lecturer Mech. Engg. Posting Order",
      orderDate: "27.11.2019"
    },
    {
      orderParticulars: "Cancelation of Posting Order Lecturer Mech. Engg.",
      orderDate: "30.09.2019"
    },
    {
      orderParticulars: "Posting Order of Ms. Jyoti Jeengar",
      orderDate: "24.09.2019"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Compassionate Posting Order Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Compassionate Posting Order
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order Particulars
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {compassionatePostingOrders.map((item, index) => (
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
                        {item.orderParticulars}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {item.orderDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee's Posting Order Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Employee's Posting Order
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order Particulars
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {employeePostingOrders.map((item, index) => (
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
                        {item.orderParticulars}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {item.orderDate}
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

export default PostingOrdersPage
