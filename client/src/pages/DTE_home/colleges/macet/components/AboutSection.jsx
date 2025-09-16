import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about-macet-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About MACET</h2>
            <p className="text-lg text-gray-600 mb-6">
              Maulana Azad College of Engineering & Technology (MACET) was established in 1985 
              with a vision to provide quality technical education in Bihar. Over the years, 
              we have grown to become one of the premier engineering institutions in the state.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Established</h4>
                <p className="text-blue-600">1985</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Affiliation</h4>
                <p className="text-green-600">Bihar Engineering University</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img 
              src="https://macet.ac.in/AdminPanel/Admin/Slider_Photo/164851987.jpg" 
              alt="MACET Campus" 
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
