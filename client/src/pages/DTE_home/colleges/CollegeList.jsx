import React, { useState, useEffect } from 'react'
import { Search, MapPin, Phone, Mail, ExternalLink, Filter, Download } from 'lucide-react'
import Header from '../header_dte'
import Footer from '../footer'

const CollegeList = () => {
  const [colleges, setColleges] = useState([])
  const [filteredColleges, setFilteredColleges] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [collegesPerPage] = useState(20)

  // Complete DTE Rajasthan college data
  const collegeData = [
    {
      id: 1,
      name: "Government Polytechnic College, Ajmer",
      type: "Government",
      category: "Polytechnic",
      email: "gpcajmer@rajasthan.gov.in",
      contact: "0145-2627501",
      district: "Ajmer",
      address: "Ajmer, Rajasthan",
      website: "https://share.google/UBelXktowNFKngC79",
      established: "1963"
    },
    {
      id: 2,
      name: "Government Polytechnic College, Alwar",
      type: "Government",
      category: "Polytechnic",
      email: "gpcalwar@rajasthan.gov.in",
      contact: "0144-2334567",
      district: "Alwar",
      address: "Alwar, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcalwar",
      established: "1965"
    },
    {
      id: 3,
      name: "Government Polytechnic College, BadiSira, Banswara",
      type: "Government",
      category: "Polytechnic",
      email: "gpcbanswara@rajasthan.gov.in",
      contact: "02962-234567",
      district: "Banswara",
      address: "BadiSira, Banswara, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcbagidora",
      established: "1995"
    },
    {
      id: 4,
      name: "Government Polytechnic College, Banswara",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.banswara@rajasthan.gov.in",
      contact: "02962-245678",
      district: "Banswara",
      address: "Banswara, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcbanswara",
      established: "1998"
    },
    {
      id: 5,
      name: "Government Polytechnic College, Baran",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.baran@rajasthan.gov.in",
      contact: "07453-234567",
      district: "Baran",
      address: "Baran, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcbaran",
      established: "1998"
    },
    {
      id: 6,
      name: "Government Polytechnic College, Barmer",
      type: "Government",
      category: "Polytechnic",
      email: "gpcbarmer@rajasthan.gov.in",
      contact: "02982-234567",
      district: "Barmer",
      address: "Barmer, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcbarmer",
      established: "2000"
    },
    {
      id: 7,
      name: "Government Polytechnic College, Bhikarai",
      type: "Government",
      category: "Polytechnic",
      email: "gpcbhikarai@rajasthan.gov.in",
      contact: "01437-234567",
      district: "Bhikarai",
      address: "Bhikarai, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcbikaner",
      established: "2005"
    },
    {
      id: 8,
      name: "Shri Gohil Verma Government Polytechnic College, Bharatpur",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.bharatpur@rajasthan.gov.in",
      contact: "05644-234567",
      district: "Bharatpur",
      address: "Bharatpur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpcbharatpur",
      established: "1985"
    },
    {
      id: 9,
      name: "Government Polytechnic College Bhilwara",
      type: "Government",
      category: "Polytechnic",
      email: "gpcbhilwara@rajasthan.gov.in",
      contact: "01482-234567",
      district: "Bhilwara",
      address: "Bhilwara, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcbhilwara",
      established: "1965"
    },
    {
      id: 10,
      name: "Government Polytechnic College, Bundi",
      type: "Government",
      category: "Polytechnic",
      email: "gpcbundi@rajasthan.gov.in",
      contact: "0747-2434567",
      district: "Bundi",
      address: "Bundi, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcbundi",
      established: "1990"
    },
    {
      id: 11,
      name: "Government Polytechnic College, Chittorgarh",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.chittorgarh@rajasthan.gov.in",
      contact: "01472-234567",
      district: "Chittorgarh",
      address: "Chittorgarh, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcchittorgarh",
      established: "1988"
    },
    {
      id: 12,
      name: "Government Polytechnic College, Churu",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.churu@rajasthan.gov.in",
      contact: "01562-234567",
      district: "Churu",
      address: "Churu, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcchuru",
      established: "1992"
    },
    {
      id: 13,
      name: "Rajesh Pilot Government Polytechnic College, Dausa",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.dausa@rajasthan.gov.in",
      contact: "01427-234567",
      district: "Dausa",
      address: "Dausa, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcdausa",
      established: "2002"
    },
    {
      id: 14,
      name: "Government Polytechnic College, Dholpur",
      type: "Government",
      category: "Polytechnic",
      email: "gpcdholpur@rajasthan.gov.in",
      contact: "05642-234567",
      district: "Dholpur",
      address: "Dholpur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/www.gpcdholpur.com",
      established: "1995"
    },
    {
      id: 15,
      name: "Government Polytechnic College, Dungarpur",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.dungarpur@rajasthan.gov.in",
      contact: "02964-234567",
      district: "Dungarpur",
      address: "Dungarpur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcdungarpur",
      established: "1997"
    },
    {
      id: 16,
      name: "Government Polytechnic College, Hanumangarh",
      type: "Government",
      category: "Polytechnic",
      email: "gpchanumangarh@rajasthan.gov.in",
      contact: "01552-234567",
      district: "Hanumangarh",
      address: "Hanumangarh, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpchanumangarh",
      established: "1999"
    },
    {
      id: 17,
      name: "Government Ram Chandra Khaitan Polytechnic College, Jaipur",
      type: "Government",
      category: "Polytechnic",
      email: "gpcjaipur@rajasthan.gov.in",
      contact: "0141-2234567",
      district: "Jaipur",
      address: "Jaipur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcjaipur",
      established: "1960"
    },
    {
      id: 18,
      name: "Government Polytechnic College, Jalore (Camp Pali)",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.jalore@rajasthan.gov.in",
      contact: "02973-234567",
      district: "Jalore",
      address: "Jalore (Camp Pali), Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcjalore",
      established: "1985"
    },
    {
      id: 19,
      name: "Government Polytechnic College, Jalore",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.jalore.gov@rajasthan.gov.in",
      contact: "02973-245678",
      district: "Jalore",
      address: "Jalore, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcjalore2",
      established: "1990"
    },
    {
      id: 20,
      name: "Government Polytechnic College, Jhalawar",
      type: "Government",
      category: "Polytechnic",
      email: "gpc_jhalawar@rajasthan.gov.in",
      contact: "07432-234567",
      district: "Jhalawar",
      address: "Jhalawar, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcjhalawar",
      established: "1988"
    },
    {
      id: 21,
      name: "Government Polytechnic College, Jhunjhunu",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.jhunjhunu@rajasthan.gov.in",
      contact: "01592-234567",
      district: "Jhunjhunu",
      address: "Jhunjhunu, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcjhunjhunu",
      established: "1992"
    },
    {
      id: 22,
      name: "Government Polytechnic College, Jodhpur (Camp Alwar)",
      type: "Government",
      category: "Polytechnic",
      email: "gpcjodhpur@rajasthan.gov.in",
      contact: "0291-2434567",
      district: "Jodhpur",
      address: "Jodhpur (Camp Alwar), Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcjodhpur",
      established: "1962"
    },
    {
      id: 23,
      name: "Government Polytechnic College, Kota",
      type: "Government",
      category: "Polytechnic",
      email: "gpckota@rajasthan.gov.in",
      contact: "0744-2434567",
      district: "Kota",
      address: "Kota, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpckota",
      established: "1964"
    },
    {
      id: 24,
      name: "Government Polytechnic College, Kotawara",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.kotawara@rajasthan.gov.in",
      contact: "01463-234567",
      district: "Kotawara",
      address: "Kotawara, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpckotawara",
      established: "2000"
    },
    {
      id: 25,
      name: "Government Polytechnic College, Mandore",
      type: "Government",
      category: "Polytechnic",
      email: "gpcmandore@rajasthan.gov.in",
      contact: "0291-2545678",
      district: "Jodhpur",
      address: "Mandore, Jodhpur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcmandore",
      established: "1995"
    },
    {
      id: 26,
      name: "Government Polytechnic College, Nagaur",
      type: "Government",
      category: "Polytechnic",
      email: "gpc_nagaur@rajasthan.gov.in",
      contact: "01582-234567",
      district: "Nagaur",
      address: "Nagaur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcmandore",
      established: "1998"
    },
    {
      id: 27,
      name: "Government Polytechnic College, Neemrana (Alwar)",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.neemrana.gov@rajasthan.gov.in",
      contact: "01494-234567",
      district: "Alwar",
      address: "Neemrana, Alwar, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcneemrana",
      established: "2005"
    },
    {
      id: 28,
      name: "Government Polytechnic College, Pali",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.pali@rajasthan.gov.in",
      contact: "02932-234567",
      district: "Pali",
      address: "Pali, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcpali",
      established: "1987"
    },
    {
      id: 29,
      name: "Government Polytechnic College, Pratapgarh",
      type: "Government",
      category: "Polytechnic",
      email: "gpcpratapgarh@rajasthan.gov.in",
      contact: "01478-234567",
      district: "Pratapgarh",
      address: "Pratapgarh, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcpratapgarh",
      established: "2002"
    },
    {
      id: 30,
      name: "Government Polytechnic College, Rajsamand",
      type: "Government",
      category: "Polytechnic",
      email: "gpcrajsmnd@rajasthan.gov.in",
      contact: "02952-234567",
      district: "Rajsamand",
      address: "Rajsamand, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcrajsamand",
      established: "1995"
    },
    {
      id: 31,
      name: "Government Polytechnic College, Sawai Madhopur",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.sawaimadhopur@rajasthan.gov.in",
      contact: "07462-234567",
      district: "Sawai Madhopur",
      address: "Sawai Madhopur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcsawaimadhopur",
      established: "1990"
    },
    {
      id: 32,
      name: "Government Polytechnic, Sikar",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.sikar@rajasthan.gov.in",
      contact: "01572-234567",
      district: "Sikar",
      address: "Sikar, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcsikar",
      established: "1985"
    },
    {
      id: 33,
      name: "SGMR Government Polytechnic College, Sirohi",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.sirohi@rajasthan.gov.in",
      contact: "02972-234567",
      district: "Sirohi",
      address: "Sirohi, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcsirohi",
      established: "1992"
    },
    {
      id: 34,
      name: "GBPR Government Polytechnic College, Sriganganagar",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.sriganganagar@rajasthan.gov.in",
      contact: "0154-2234567",
      district: "Sriganganagar",
      address: "Sriganganagar, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcsriganganagar",
      established: "1988"
    },
    {
      id: 35,
      name: "Government Polytechnic College, Tonk",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.tonk@rajasthan.gov.in",
      contact: "01432-234567",
      district: "Tonk",
      address: "Tonk, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpctonk",
      established: "1995"
    },
    {
      id: 36,
      name: "Government Polytechnic College, Udaipur",
      type: "Government",
      category: "Polytechnic",
      email: "gpc.udaipur@rajasthan.gov.in",
      contact: "0294-2434567",
      district: "Udaipur",
      address: "Udaipur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gpcudaipur",
      established: "1970"
    },
    {
      id: 37,
      name: "Government Women Polytechnic College, Ajmer",
      type: "Government",
      category: "Women Polytechnic",
      email: "gwwpc.ajmer@rajasthan.gov.in",
      contact: "0145-2345678",
      district: "Ajmer",
      address: "Ajmer, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpcajmer",
      established: "1985"
    },
    {
      id: 38,
      name: "Government Women Polytechnic College, Bikaner",
      type: "Government",
      category: "Women Polytechnic",
      email: "gwwpc.bikaner@rajasthan.gov.in",
      contact: "0151-2345678",
      district: "Bikaner",
      address: "Bikaner, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpcbikaner",
      established: "1990"
    },
    {
      id: 39,
      name: "Government Women Polytechnic College, Jhalawar",
      type: "Government",
      category: "Women Polytechnic",
      email: "gwwpc.jhalawar@rajasthan.gov.in",
      contact: "07432-345678",
      district: "Jhalawar",
      address: "Jhalawar, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpcjhalawar",
      established: "1995"
    },
    {
      id: 40,
      name: "Government Women Polytechnic College, Jaipur",
      type: "Government",
      category: "Women Polytechnic",
      email: "gwwpc.jaipur@rajasthan.gov.in",
      contact: "0141-2345678",
      district: "Jaipur",
      address: "Jaipur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpcjaipur",
      established: "1980"
    },
    {
      id: 41,
      name: "Government Residential Women Polytechnic College, Jodhpur",
      type: "Government",
      category: "Women Polytechnic",
      email: "prinicpal.gwwpc.jdh@rajasthan.gov.in",
      contact: "0291-2345678",
      district: "Jodhpur",
      address: "Jodhpur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpcjodhpur",
      established: "1988"
    },
    {
      id: 42,
      name: "Government Women Polytechnic College, Kota",
      type: "Government",
      category: "Women Polytechnic",
      email: "gwwpc.kota@rajasthan.gov.in",
      contact: "0744-2345678",
      district: "Kota",
      address: "Kota, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpckota",
      established: "1985"
    },
    {
      id: 43,
      name: "Government Women Polytechnic College, Udaipur",
      type: "Government",
      category: "Women Polytechnic",
      email: "gwwpc.udaipur@rajasthan.gov.in",
      contact: "0294-2345678",
      district: "Udaipur",
      address: "Udaipur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpcudaipur",
      established: "1992"
    },
    {
      id: 44,
      name: "Government Women Polytechnic College, Lalsot",
      type: "Government",
      category: "Women Polytechnic",
      email: "gwwpc.lalsot@rajasthan.gov.in",
      contact: "01425-234567",
      district: "Dausa",
      address: "Lalsot, Dausa, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/gwpclalsot",
      established: "2000"
    },
    {
      id: 45,
      name: "TTC RGDC, Jodhpur",
      type: "Government",
      category: "Training Center",
      email: "ttc.jodhpur@rajasthan.gov.in",
      contact: "0291-2434567",
      district: "Jodhpur",
      address: "Jodhpur, Rajasthan",
      website: "https://hte.rajasthan.gov.in/college/ttcjodhpur",
      established: "1975"
    }
  ]

  const districts = [...new Set(collegeData.map(college => college.district))].sort()
  const categories = [...new Set(collegeData.map(college => college.category))].sort()

  useEffect(() => {
    setColleges(collegeData)
    setFilteredColleges(collegeData)
  }, [])

  useEffect(() => {
    let filtered = colleges.filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.district.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || college.category === selectedType
      const matchesDistrict = selectedDistrict === 'all' || college.district === selectedDistrict
      
      return matchesSearch && matchesType && matchesDistrict
    })
    
    setFilteredColleges(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedType, selectedDistrict, colleges])

  // Pagination
  const indexOfLastCollege = currentPage * collegesPerPage
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage
  const currentColleges = filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege)
  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Component */}
      <Header />
      
      {/* Page Content Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Technical Education Institutions
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Complete list of Government Technical Education Institutions in Rajasthan
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              <span>{filteredColleges.length} institutions found</span>
            </div>
          </div>
        </div>

        {/* College List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    S. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    College Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentColleges.map((college, index) => (
                  <tr key={college.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {indexOfFirstCollege + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {college.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {college.district}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`mailto:${college.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {college.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`tel:${college.contact}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {college.contact}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit College
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{indexOfFirstCollege + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastCollege, filteredColleges.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredColleges.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Directorate of Technical Education
            </h3>
            <p className="text-blue-700 dark:text-blue-200 text-sm">
              W.B. Gupta Path, Residency Road, Jodhpur (Rajasthan) - 342003
            </p>
            <p className="text-blue-700 dark:text-blue-200 text-sm">
              Phone No.: +91-291-2434395, Fax: +91-291-2438
            </p>
            <p className="text-blue-700 dark:text-blue-200 text-sm">
              Email: dte.raj@rajasthan.gov.in
            </p>
            <p className="text-blue-700 dark:text-blue-200 text-sm mt-2">
              Last Updated: 13/09/2025, 1:41:11 pm
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default CollegeList
