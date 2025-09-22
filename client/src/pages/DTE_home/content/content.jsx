import React from 'react'
import Notice from './notice'
import AboutDte from './aboutDte'
import News from './news'

const home = () => {
  return (
    <>
      {/* Leadership Section */}
      <div className="container mx-auto px-6 py-12 theme-bg">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold theme-text mb-4">
            राजस्थान सरकार - तकनीकी शिक्षा निदेशालय
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">
            Government of Rajasthan - Department of Technical Education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
        </div>
        
        {/* Leadership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[95%] mx-auto">
          
          {/* Hon'ble Chief Minister */}
          <div className="theme-surface rounded-lg shadow-xl p-4 text-center w-full min-w-0">
            <div className="mb-4">
              <img 
                src="https://dte.rajasthan.gov.in/assets/img/shri%20Bhajan%20Lal%20Sharma.png" 
                alt="Hon'ble Chief Minister" 
                className="w-full h-32 object-contain rounded-lg mx-auto"
              />
            </div>
            <h3 className="text-xs font-bold text-gray-800 :text-gray-200 mb-1 leading-snug h-8 flex items-center justify-center">
              Hon'ble Chief Minister
            </h3>
            <p className="text-sm font-semibold text-blue-600 :text-blue-400 whitespace-nowrap overflow-hidden text-ellipsis">
              Shri Bhajan Lal Sharma
            </p>
          </div>

          {/* Hon'ble Deputy Chief Minister */}
          <div className="theme-surface rounded-lg shadow-xl p-4 text-center w-full min-w-0">
            <div className="mb-4">
              <img 
                src="https://dte.rajasthan.gov.in/assets/img/Deputy%20CM.jpg" 
                alt="Hon'ble Deputy Chief Minister" 
                className="w-full h-32 object-contain rounded-lg mx-auto"
              />
            </div>
            <h3 className="text-xs font-bold text-gray-800 :text-gray-200 mb-1 leading-snug h-8 flex items-center justify-center">
              Hon'ble Dy. CM & Minister of Technical Education
            </h3>
            <p className="text-sm font-semibold text-green-600 :text-green-400 whitespace-nowrap overflow-hidden text-ellipsis">
              Dr. Prem Chand Bairwa
            </p>
          </div>

          {/* Additional Chief Secretary */}
          <div className="theme-surface rounded-lg shadow-xl p-4 text-center w-full min-w-0">
            <div className="mb-4">
              <img 
                src="https://dte.rajasthan.gov.in/assets/img/Kuldeep%20Sir%20.png" 
                alt="Additional Chief Secretary" 
                className="w-full h-32 object-contain rounded-lg mx-auto"
              />
            </div>
            <h3 className="text-xs font-bold text-gray-800 :text-gray-200 mb-1 leading-snug h-8 flex items-center justify-center">
              Additional Chief Secretary, Higher & Tech. Education
            </h3>
            <p className="text-sm font-semibold text-purple-600 :text-purple-400 whitespace-nowrap overflow-hidden text-ellipsis">
              Shri Kuldeep Ranka
            </p>
          </div>

          {/* Director */}
          <div className="theme-surface rounded-lg shadow-xl p-4 text-center w-full min-w-0">
            <div className="mb-4">
              <img 
                src="https://dte.rajasthan.gov.in/assets/img/Mr.%20Rajesh%20Kumar%20Sharma%20.png" 
                alt="Director" 
                className="w-full h-32 object-contain rounded-lg mx-auto"
              />
            </div>
            <h3 className="text-xs font-bold text-gray-800 :text-gray-200 mb-1 leading-snug h-8 flex items-center justify-center">
              Director, Technical Education (Polytechnic)
            </h3>
            <p className="text-sm font-semibold text-orange-600 :text-orange-400 whitespace-nowrap overflow-hidden text-ellipsis">
              Shri Rajesh Kumar Sharma
            </p>
          </div>
        </div>
      </div>

      
      {/* Notice, Events, and Academic Notices Section */}
      <Notice />
      
      {/* News Section */}
      <News />
      
      {/* About DTE Section */}
      <AboutDte />
    </>
  )
}

export default home