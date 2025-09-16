import React from 'react';
import { motion } from 'framer-motion';

const FacilitiesSection = ({ facilities }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Facilities</h2>
          <p className="text-lg text-gray-600">World-class infrastructure to support learning and innovation</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 ${facility.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <facility.icon className={`w-8 h-8 ${facility.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">{facility.name}</h3>
              <p className="text-gray-600 text-center">{facility.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
