import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Mail, ExternalLink, Filter, Download } from 'lucide-react';
import Header from '../header_dte';
import Footer from '../footer';

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
      const matchesType = selectedType === 'all' || college.type === selectedType
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 text-gray-800 dark:text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Polytechnic Colleges
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              College Directory
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find and explore government polytechnic colleges in Rajasthan
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 bg-white/90 dark:bg-gray-800/95 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg 
                           transition-all duration-200 ease-in-out border border-gray-200 dark:border-gray-700
                           focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                           hover:border-gray-300 dark:hover:border-gray-600"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-gray-800/95 text-gray-900 dark:text-white px-4 py-3 
                          focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                          hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
              <select
                className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-gray-800/95 text-gray-900 dark:text-white px-4 py-3 
                          focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 focus:outline-none focus:shadow-sm
                          hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="all">All Districts</option>
                {Array.from(new Set(collegeData.map(college => college.district))).map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* College List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="w-full">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                    College Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                    Type & Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/5">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/5">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentColleges.map((college, index) => (
                  <motion.tr 
                    key={college.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white whitespace-normal break-words">{college.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Est. {college.established}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white whitespace-normal">{college.type}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{college.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <MapPin className="flex-shrink-0 h-4 w-4 text-blue-400 mr-2 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{college.district}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 break-words">{college.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-sm text-gray-900 dark:text-white">
                        <Phone className="flex-shrink-0 h-4 w-4 text-blue-400 mr-2 mt-0.5" />
                        <span className="break-words">{college.contact}</span>
                      </div>
                      <div className="flex items-start text-sm text-blue-600 dark:text-blue-400">
                        <Mail className="flex-shrink-0 h-4 w-4 text-blue-400 mr-2 mt-0.5" />
                        <span className="break-words">{college.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Visit
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium text-gray-700 dark:text-gray-200">{indexOfFirstCollege + 1}</span> to {' '}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {Math.min(indexOfLastCollege, filteredColleges.length)}
                </span>{' '}
                of <span className="font-medium text-gray-700 dark:text-gray-200">{filteredColleges.length}</span> colleges
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 
                             bg-white/90 dark:bg-gray-800/95 hover:bg-gray-50 dark:hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 ease-in-out hover:shadow-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredColleges.length / collegesPerPage)))}
                  disabled={indexOfLastCollege >= filteredColleges.length}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-white 
                             bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 ease-in-out hover:shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default CollegeList
