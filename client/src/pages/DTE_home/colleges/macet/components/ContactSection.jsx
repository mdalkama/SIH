import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-16 bg-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Have questions or need more information? Reach out to us through any of these channels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="text-center p-6 bg-blue-800 rounded-xl hover:bg-blue-900 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-blue-200">+91-612-2254569</p>
            <p className="text-blue-200">+91-9431049755</p>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-blue-800 rounded-xl hover:bg-blue-900 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-blue-200">contact@macet.ac.in</p>
            <p className="text-blue-200">info@macet.ac.in</p>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-blue-800 rounded-xl hover:bg-blue-900 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-blue-200">Neora, Patna - 801113</p>
            <p className="text-blue-200">Bihar, India</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
