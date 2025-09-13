import React from 'react'
import Header from '../header_dte'
import Footer from '../footer'

// Import PDFs
import studentTransferPdf from '../../../assets/9339.pdf'
import branchChangePdf from '../../../assets/8126.pdf'
import equivalencyPdf from '../../../assets/12th Equivalency-1.pdf'
import kcsyDateExtendPdf from '../../../assets/Date extend for Kalpana CSVY.pdf'
import kcsyPdf from '../../../assets/KCSVY.pdf'
import kcsyManualPdf from '../../../assets/kalpana chawla scooty vitran yojana G2C.pdf'
import womenReservationPdf from '../../../assets/Reservation of Women.pdf'

const StudentsCornerPage = () => {
  const studentsData = [
    {
      orderParticulars: "Student College Transfer Order",
      orderNoAndDate: "F5(Trans)/DTE/E-2/2025-26/9339 dtd 27.08.2025",
      pdfLink: studentTransferPdf
    },
    {
      orderParticulars: "Branch Change Order (First Year Passed Session 2024-25 Students)",
      orderNoAndDate: "F5(3)/DTE/E-2/2025-26/8126 dtd 30.07.2025",
      pdfLink: branchChangePdf
    },
    {
      orderParticulars: "Circular for 12th Equivalency after Diploma",
      orderNoAndDate: "P.3(5) Edu-5/2020 (RAJKAI 00451)",
      pdfLink: equivalencyPdf
    },
    {
      orderParticulars: "Date Extend for Registration in Kalpana Chawla Scooty Vitran Yojana (15-02-2025)",
      orderNoAndDate: "",
      isNew: true,
      pdfLink: kcsyDateExtendPdf
    },
    {
      orderParticulars: "Date Extend for Registration in Kalpana Chawla Scooty Vitran Yojana (7-02-2025)",
      orderNoAndDate: "",
      isNew: true,
      pdfLink: kcsyDateExtendPdf
    },
    {
      orderParticulars: "Registration For Kalpana Chawla Scooty Vitran Yojana",
      orderNoAndDate: "",
      isNew: true,
      isExternal: true,
      externalLink: "https://sso.rajasthan.gov.in/signin?ru=kcsvy"
    },
    {
      orderParticulars: "Manual For The Kalpana Chawla Scooty Vitran Yojana",
      orderNoAndDate: "",
      isNew: true,
      pdfLink: kcsyManualPdf
    },
    {
      orderParticulars: "Placement Portal",
      orderNoAndDate: "",
      isNew: true,
      isExternal: true,
      externalLink: "https://kdhte.rajasthan.gov.in/"
    },
    {
      orderParticulars: "Student Grievances",
      orderNoAndDate: "",
      isNew: true,
      isExternal: true,
      externalLink: "https://sites.google.com/view/studgrievancesdte"
    },
    {
      orderParticulars: "Amendment in Reservation of Women Admission",
      orderNoAndDate: "P.1(1)/TE/2023 Part-1 Dtd 31.01.2024",
      pdfLink: womenReservationPdf
    },
    {
      orderParticulars: "Fee Related Office Order No.215",
      orderNoAndDate: "Order No. 215 Dated 03.08.2023"
    },
    {
      orderParticulars: "Fee Related Office Order No. 158",
      orderNoAndDate: "Order No. 158 Dated 19.06.2023"
    },
    {
      orderParticulars: "Proposal for New Fees Structure - Last Date 15-05-2023",
      orderNoAndDate: "P18(5)/TE/2004, Jaipur Dtd.18.04.2023"
    },
    {
      orderParticulars: "Mahatma Gandhi Jayanti (2022-2023)",
      orderNoAndDate: "F5(Mahatma Gandhi)/DTE/E-2/2022-23/10154 dtd.29.09.2022"
    },
    {
      orderParticulars: "Extension of date for submitting document to fee committee",
      orderNoAndDate: "Order No. 2004-I Dated 16.04.2021"
    },
    {
      orderParticulars: "Fee Related Office Order No. 3626",
      orderNoAndDate: "Order No. 3626 Dated 19.02.2021"
    },
    {
      orderParticulars: "Fee Related Office Order No. 3625",
      orderNoAndDate: "Order No. 3625 Dated 19.02.2021"
    },
    {
      orderParticulars: "Students Transfer Policy",
      orderNoAndDate: "TE-Jaipur, dtd. 28 Jan. 2016"
    },
    {
      orderParticulars: "Circular for 12th Equivalency after Diploma",
      orderNoAndDate: "F3(2)/Edu/F-6/2015 dtd. 12.10.2015 ; 01.01.2016 & 14.03.16"
    },
    {
      orderParticulars: "Circular for Student Attendance",
      orderNoAndDate: "F6(1-B)/DTE/E-2/2012/16111 dtd. 19.12.2012"
    },
    {
      orderParticulars: "Latest Scholarship Format",
      orderNoAndDate: "F9(4)/SJSP/19361-402 dtd. 14.03.2012"
    },
    {
      orderParticulars: "Scholarship for PWD Candidates",
      orderNoAndDate: "F5(209)/DTE/E-2/11561 dtd. 05.08.2011"
    },
    {
      orderParticulars: "Students Insurance Policy",
      orderNoAndDate: "G.I.F/G.I.S/S.S.I/Anu/18-19/11-60 dtd.28.04.2020"
    }
  ]

  const handleItemClick = (item) => {
    if (item.isExternal && item.externalLink) {
      window.open(item.externalLink, '_blank')
    } else if (item.pdfLink) {
      window.open(item.pdfLink, '_blank')
    }
  }

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
        {/* Students Corner Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 dark:bg-blue-700">
            <h1 className="text-2xl font-bold text-white text-center">
              Students Corner
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
                    Order No. and Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {studentsData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${
                      index % 2 === 0 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline"
                          onClick={() => handleItemClick(item)}
                        >
                          {item.orderParticulars}
                        </span>
                        {item.isNew && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            NEW
                          </span>
                        )}
                      </div>
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

export default StudentsCornerPage
