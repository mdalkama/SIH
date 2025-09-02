import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Building } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Government Header */}
      <div className="bg-white shadow-sm border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Department of Technical Education
                </h1>
                <p className="text-sm text-gray-600">Government of Rajasthan</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-12 w-12 bg-green-600 rounded"></div>
              <div className="h-12 w-12 bg-white border-2 border-gray-300 rounded"></div>
              <div className="h-12 w-12 bg-orange-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Management ERP System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive solution for educational institutions
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Login to Portal
            </Link>
            <Link
              to="/api-test"
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Test API Connection
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Student Management</h3>
            <p className="text-gray-600">Complete student lifecycle management</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Academic Records</h3>
            <p className="text-gray-600">Maintain comprehensive academic data</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hostel Management</h3>
            <p className="text-gray-600">Efficient hostel allocation and management</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <GraduationCap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fee Management</h3>
            <p className="text-gray-600">Streamlined fee collection and tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
