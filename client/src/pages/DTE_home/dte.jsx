import React from 'react'
import Header from './header_dte'
import Footer from './footer'
import Content from './content/content'
import ThemeSwitcher from './ThemeSwitcher'
import Chatbot from './Chatbot'

const DTE = ({ showChatbot = false }) => {
  return (
    <div className="min-h-screen flex flex-col theme-bg">
      {/* Header at the top */}
      <Header />
      
      {/* Main content in the middle */}
      <main className="flex-1 theme-bg">
        <Content />
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
      
      {/* Theme Switcher - Fixed Position */}
      <ThemeSwitcher />
      
      {/* Chatbot - Only on home page */}
      {showChatbot && <Chatbot />}
    </div>
  )
}

export default DTE