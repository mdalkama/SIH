import React from 'react';
import { motion } from 'framer-motion';

const DepartmentsSection = ({ departments }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Departments</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of engineering departments offering quality education and research opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl mb-4">{dept.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{dept.name}</h3>
              <p className="text-gray-600 mb-4">{dept.description}</p>
              <div className="flex items-center text-sm text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{dept.students} students</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
