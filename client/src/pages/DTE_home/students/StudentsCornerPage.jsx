import React, { useState } from 'react';
import Header from '../header_dte';
import Footer from '../footer';
import { Search, FileText, ExternalLink, Award, GraduationCap, FileCheck, FileArchive, FileSpreadsheet, FileSignature, FileQuestion, File, FileType } from 'lucide-react';

// Import PDFs
import studentTransferPdf from '../../../assets/9339.pdf';
import branchChangePdf from '../../../assets/8126.pdf';
import equivalencyPdf from '../../../assets/12th Equivalency-1.pdf';
import kcsyDateExtendPdf from '../../../assets/Date extend for Kalpana CSVY.pdf';
import kcsyPdf from '../../../assets/KCSVY.pdf';
import kcsyManualPdf from '../../../assets/kalpana chawla scooty vitran yojana G2C.pdf';
import womenReservationPdf from '../../../assets/Reservation of Women.pdf';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter students data based on search term and active filter
  const filteredStudentsData = studentsData.filter(item => {
    const matchesSearch = item.orderParticulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.orderNoAndDate && item.orderNoAndDate.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'new') {
      return matchesSearch && item.isNew;
    }
    return matchesSearch;
  });

  // Get icon based on order particulars
  const getIcon = (orderParticulars) => {
    if (orderParticulars.toLowerCase().includes('transfer')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (orderParticulars.toLowerCase().includes('branch')) return <FileType className="h-5 w-5 text-green-500" />;
    if (orderParticulars.toLowerCase().includes('scholarship')) return <Award className="h-5 w-5 text-yellow-500" />;
    if (orderParticulars.toLowerCase().includes('kalpana') || orderParticulars.toLowerCase().includes('kcsy')) return <GraduationCap className="h-5 w-5 text-purple-500" />;
    if (orderParticulars.toLowerCase().includes('attendance')) return <FileCheck className="h-5 w-5 text-indigo-500" />;
    if (orderParticulars.toLowerCase().includes('fee')) return <FileSpreadsheet className="h-5 w-5 text-red-500" />;
    if (orderParticulars.toLowerCase().includes('policy')) return <FileSignature className="h-5 w-5 text-pink-500" />;
    if (orderParticulars.toLowerCase().includes('grievance')) return <FileQuestion className="h-5 w-5 text-orange-500" />;
    if (orderParticulars.toLowerCase().includes('placement')) return <FileArchive className="h-5 w-5 text-teal-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 :from-gray-900 :to-gray-800">
      <Header />
      
      {/* Hero Section */}
      {/* <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 :from-slate-800 :to-slate-900 text-gray-800 :text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 :bg-blue-900/30 text-blue-700 :text-blue-300 text-sm font-medium mb-6">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Our Vision
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Our Vision
            </h1>
            <p className="text-lg text-gray-600 :text-gray-300 max-w-3xl mx-auto">
              To enhance the competitiveness of State's technical manpower to global standards by imparting high quality & state of art Technical Education and Training to all sections of the society.
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white :bg-gray-700 text-gray-700 :text-gray-200 hover:bg-gray-50 :hover:bg-gray-600'
              }`}
            >
              All Documents
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeFilter === 'new' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white :bg-gray-700 text-gray-700 :text-gray-200 hover:bg-gray-50 :hover:bg-gray-600'
              }`}
            >
              New Updates
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="bg-white :bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 :border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 :divide-gray-700">
              <thead className="bg-gray-50 :bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 :text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white :bg-gray-800 divide-y divide-gray-200 :divide-gray-700">
                {filteredStudentsData.length > 0 ? (
                  filteredStudentsData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 :hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getIcon(item.orderParticulars)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 :text-white">
                              <button
                                onClick={() => handleItemClick(item)}
                                className="text-left hover:text-blue-600 :hover:text-blue-400 focus:outline-none flex items-center"
                              >
                                {item.orderParticulars}
                                {item.isExternal && <ExternalLink className="ml-2 h-4 w-4" />}
                              </button>
                            </div>
                            {item.orderNoAndDate && (
                              <div className="text-sm text-gray-500 :text-gray-400">
                                {item.orderNoAndDate}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isNew && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 :bg-red-900/30 :text-red-300">
                            New
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleItemClick(item)}
                          className="text-blue-600 hover:text-blue-900 :text-blue-400 :hover:text-blue-300"
                        >
                          {item.isExternal ? 'Visit Link' : 'View Document'}
                          <ExternalLink className="inline-block h-4 w-4 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 :text-gray-400">
                      No documents found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentsCornerPage;
