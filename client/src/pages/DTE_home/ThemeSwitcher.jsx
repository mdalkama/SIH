import React, { useState, useEffect } from 'react'
import { Sun, Moon, Palette } from 'lucide-react'

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [isOpen, setIsOpen] = useState(false)

  // Theme configurations
  const themes = {
    light: {
      name: 'Light Theme',
      icon: Sun,
      primary: '#3b82f6', // blue-500
      background: '#ffffff',
      surface: '#f8fafc', // slate-50
      text: '#1f2937', // gray-800
      textSecondary: '#6b7280', // gray-500
      glassBackground: 'rgba(255, 255, 255, 0.25)',
      glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.15))',
      glassBorder: 'rgba(255, 255, 255, 0.4)',
      navbarBackground: 'rgba(255, 255, 255, 0.04)',
      carouselOverlay: 'rgba(0, 0, 0, 0.3)',
      logoFilter: 'none'
    },
    dark: {
      name: 'Dark Theme',
      icon: Moon,
      primary: '#ffffff', // white in dark mode
      background: '#000000', // pure black
      surface: '#111111', // dark gray
      text: '#f1f5f9', // slate-100
      textSecondary: '#94a3b8', // slate-400
      glassBackground: 'rgba(0, 0, 0, 0.85)',
      glassGradient: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8))',
      glassBorder: 'rgba(255, 255, 255, 0.2)',
      navbarBackground: 'rgba(0, 0, 0, 0.95)',
      carouselOverlay: 'rgba(0, 0, 0, 0.5)',
      logoFilter: 'brightness(0) invert(1)'
    }
  }

  // Apply theme to CSS variables
  const applyTheme = (themeName) => {
    const theme = themes[themeName]
    const root = document.documentElement
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-background', theme.background)
    root.style.setProperty('--theme-surface', theme.surface)
    root.style.setProperty('--theme-text', theme.text)
    root.style.setProperty('--theme-text-secondary', theme.textSecondary)
    root.style.setProperty('--theme-glass-background', theme.glassBackground)
    root.style.setProperty('--theme-glass-gradient', theme.glassGradient)
    root.style.setProperty('--theme-glass-border', theme.glassBorder)
    root.style.setProperty('--theme-navbar-background', theme.navbarBackground)
    root.style.setProperty('--theme-carousel-overlay', theme.carouselOverlay)
    root.style.setProperty('--theme-logo-filter', theme.logoFilter)
    
    // Add theme class to body
    document.body.className = `theme-${themeName}`
    
    // Store in localStorage
    localStorage.setItem('dte-theme', themeName)
  }

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('dte-theme') || 'light'
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [applyTheme])

  // Handle theme change
  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
    setIsOpen(false)
  }

  const CurrentThemeIcon = themes[currentTheme].icon

  return (
    <>
      {/* Theme Switcher Button - Fixed Position */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <div className="relative">
          {/* Main Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full backdrop-blur-xl border transition-all duration-300 hover:scale-110 shadow-lg flex items-center justify-center group"
            style={{
              background: `var(--theme-glass-gradient)`,
              borderColor: `var(--theme-glass-border)`,
              color: `var(--theme-text)`
            }}
          >
            <CurrentThemeIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          </button>

          {/* Theme Options Popup */}
          {isOpen && (
            <div 
              className="absolute bottom-16 left-0 w-64 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden animate-fade-in-up"
              style={{
                background: `var(--theme-glass-gradient)`,
                borderColor: `var(--theme-glass-border)`
              }}
            >
              <div className="p-4">
                <h3 
                  className="text-sm font-semibold mb-3 flex items-center"
                  style={{ color: `var(--theme-text)` }}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Choose Theme
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(themes).map(([themeKey, theme]) => {
                    const ThemeIcon = theme.icon
                    const isActive = currentTheme === themeKey
                    
                    return (
                      <button
                        key={themeKey}
                        onClick={() => handleThemeChange(themeKey)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 border ${
                          isActive 
                            ? 'border-blue-400 shadow-md' 
                            : 'border-transparent hover:border-blue-300'
                        }`}
                        style={{
                          background: isActive 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          color: `var(--theme-text)`
                        }}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ 
                            background: theme.background,
                            border: `1px solid ${theme.glassBorder}`
                          }}
                        >
                          <ThemeIcon 
                            className="w-4 h-4" 
                            style={{ color: theme.text }}
                          />
                        </div>
                        <span className="font-medium text-sm">{theme.name}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Global CSS for theme variables */}
      <style jsx global>{`
        :root {
          --theme-primary: #3b82f6;
          --theme-background: #ffffff;
          --theme-surface: #f8fafc;
          --theme-text: #1f2937;
          --theme-text-secondary: #6b7280;
          --theme-glass-background: rgba(255, 255, 255, 0.25);
          --theme-glass-gradient: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
          --theme-glass-border: rgba(255, 255, 255, 0.4);
          --theme-navbar-background: rgba(0, 0, 0, 0.13);
          --theme-carousel-overlay: rgba(0, 0, 0, 0.3);
          --theme-logo-filter: none;
        }

        .theme-light {
          background-color: var(--theme-background);
          color: var(--theme-text);
        }

        .theme-dark {
          background-color: var(--theme-background);
          color: var(--theme-text);
        }

        /* Apply theme to common elements */
        .theme-bg {
          background-color: var(--theme-background) !important;
        }

        .theme-surface {
          background-color: var(--theme-surface) !important;
        }

        .theme-text {
          color: var(--theme-text) !important;
        }

        .theme-text-secondary {
          color: var(--theme-text-secondary) !important;
        }

        .theme-glass {
          background: var(--theme-glass-gradient) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid var(--theme-glass-border) !important;
        }

        .theme-logo {
          filter: var(--theme-logo-filter) !important;
        }

        /* Enhanced glass morphism effects for dropdowns - good blur */
        .glass-dropdown {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
        }

        /* Theme-specific dropdown styling - reduced glass morphism for dark mode */
        .theme-dark .glass-dropdown {
          background: rgba(0, 0, 0, 0.48) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        }

        .theme-light .glass-dropdown {
          background: rgba(255, 255, 255, 0.88) !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
          backdrop-filter: blur(30px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(30px) saturate(200%) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
        }

        .theme-dark .glass-dropdown h3,
        .theme-dark .glass-dropdown h4 {
          color: #ffffff !important;
        }

        .theme-dark .glass-dropdown a {
          color: #f1f5f9 !important;
        }

        .theme-dark .glass-dropdown a:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* Dark mode dropdown - only change greyish elements to blue */
        .theme-dark .glass-dropdown .bg-blue-400 {
          background-color: #1d4ed8 !important;
        }

        .theme-dark .glass-dropdown .bg-blue-500 {
          background-color: #2563eb !important;
        }

        /* Top utility bar theme support */
        .theme-dark .bg-white {
          background-color: #111111 !important;
        }

        .theme-dark .border-gray-200 {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .theme-dark .border-gray-300 {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .theme-dark .bg-gray-300 {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }

        .theme-dark .text-gray-700 {
          color: #f1f5f9 !important;
        }

        .theme-dark .hover\:text-blue-600:hover {
          color: #60a5fa !important;
        }

        /* Notice section theme support */
        .theme-dark .bg-gray-50 {
          background-color: #0f172a !important;
        }

        .theme-dark .border-gray-100 {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .theme-dark .text-gray-500 {
          color: #94a3b8 !important;
        }

        .theme-dark .text-gray-600 {
          color: #64748b !important;
        }

        .theme-dark .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15) !important;
        }

        /* Notice component theme support */
        .theme-dark .text-gray-500 {
          color: #94a3b8 !important;
        }

        .theme-dark .text-gray-600 {
          color: #cbd5e1 !important;
        }

        .theme-dark .border-gray-100 {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .theme-dark .hover\\:text-blue-800:hover {
          color: #60a5fa !important;
        }

        .theme-dark .hover\\:text-red-700:hover {
          color: #f87171 !important;
        }

        .theme-dark .hover\\:text-purple-700:hover {
          color: #c084fc !important;
        }

        /* Notice section styling - enhanced box shadow and borders */
        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }

        /* Notice section specific dark mode styling - only for notice components */
        .theme-dark .notice-card.shadow-lg {
          border: 1px solid #3b82f6 !important;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1) !important;
        }

        .theme-light .glass-dropdown h3,
        .theme-light .glass-dropdown h4 {
          color: #1f2937 !important;
        }

        .theme-light .glass-dropdown a {
          color: #374151 !important;
        }

        .theme-light .glass-dropdown a:hover {
          color: #111827 !important;
          background-color: rgba(0, 0, 0, 0.1) !important;
        }

        /* Blue text becomes white in dark mode */
        .theme-dark .text-blue-800,
        .theme-dark .text-blue-600,
        .theme-dark .text-blue-500,
        .theme-dark .text-blue-400 {
          color: #ffffff !important;
        }

        .theme-dark .hover\\:text-blue-600:hover,
        .theme-dark .hover\\:text-blue-500:hover {
          color: #f1f5f9 !important;
        }

        /* Theme-specific blue text classes */
        .theme-blue-text {
          color: #1e40af !important; /* blue-800 for light mode */
        }

        .theme-dark .theme-blue-text {
          color: #ffffff !important; /* white for dark mode */
        }

        .theme-blue-text-hover {
          color: #1e40af !important; /* blue-800 for light mode */
        }

        .theme-blue-text-hover:hover {
          color: #2563eb !important; /* blue-600 for light mode hover */
        }

        .theme-dark .theme-blue-text-hover {
          color: #ffffff !important; /* white for dark mode */
        }

        .theme-dark .theme-blue-text-hover:hover {
          color: #3b82f6 !important; /* blue-500 for dark mode hover - stays blue */
        }

        /* Keep hover effects blue in dark mode */
        .theme-dark .hover\\:bg-blue-500\\/20:hover {
          background-color: rgba(59, 130, 246, 0.2) !important; /* blue hover background */
        }

        .theme-dark .hover\\:border-blue-400:hover,
        .theme-dark .hover\\:border-blue-200:hover {
          border-color: #3b82f6 !important; /* blue hover border */
        }

        /* Border colors in dark mode */
        .theme-dark .border-blue-200,
        .theme-dark .border-blue-400 {
          border-color: rgba(148, 163, 184, 0.3) !important;
        }

        .theme-dark .hover\\:border-blue-400:hover,
        .theme-dark .hover\\:border-blue-200:hover {
          border-color: rgba(148, 163, 184, 0.6) !important;
        }

        /* Background colors in dark mode */
        .theme-dark .bg-blue-500,
        .theme-dark .bg-blue-400 {
          background-color: rgba(148, 163, 184, 0.8) !important;
        }

        .theme-dark .hover\\:bg-blue-500\\/20:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* Enhanced dropdown animations and glass morphism visual hierarchy */
        .glass-dropdown {
          transform: translateY(-8px);
          animation: superGlassDropdownFadeIn 0.4s ease-out;
          border-radius: 16px !important;
        }

        .glass-dropdown .backdrop-blur-xl {
          border-radius: 20px;
          backdrop-filter: blur(30px) saturate(200%) brightness(110%) !important;
          -webkit-backdrop-filter: blur(30px) saturate(200%) brightness(110%) !important;
        }

        /* Enhanced glassmorphism multi-level dropdown enhancements */
        .glass-dropdown .group\\/sub:hover > div {
          transform: translateX(0) scale(1.02);
          opacity: 1;
          visibility: visible;
          backdrop-filter: blur(30px) saturate(200%) brightness(110%) !important;
          -webkit-backdrop-filter: blur(30px) saturate(200%) brightness(110%) !important;
        }

        /* Ultra-smooth hover transitions with enhanced glass effects */
        .glass-dropdown a,
        .glass-dropdown button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          backdrop-filter: blur(30px) !important;
          -webkit-backdrop-filter: blur(30px) !important;
          border-radius: 8px;
        }

        .glass-dropdown a:hover {
          transform: translateX(3px) scale(1.02);
          backdrop-filter: blur(30px) saturate(180%) brightness(105%) !important;
          -webkit-backdrop-filter: blur(30px) saturate(180%) brightness(105%) !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .theme-dark .glass-dropdown a:hover {
          background: rgba(0, 0, 0, 0.1) !important;
        }

        @keyframes superGlassDropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
            backdrop-filter: blur(5px) !important;
          }
          to {
            opacity: 1;
            transform: translateY(-8px) scale(1);
            backdrop-filter: blur(30px) saturate(200%) brightness(110%) !important;
          }
        }

        /* No background when not sticky - completely transparent */
        nav:not(.fixed) {
          background: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        nav:not(.fixed)::before,
        nav:not(.fixed)::after {
          display: none !important;
        }

        /* Sticky navbar styling - pure blur effects only */
        nav.fixed {
          background: transparent !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border-bottom: none !important;
          box-shadow: none !important;
        }

        .theme-dark nav.fixed {
          background: rgba(0, 0, 0, 0.1) !important;
          backdrop-filter: blur(30px) !important;
          -webkit-backdrop-filter: blur(30px) !important;
        }

        .theme-light nav.fixed {
          background: rgba(255, 255, 255, 0.11) !important;
          backdrop-filter: blur(30px) !important;
          -webkit-backdrop-filter: blur(30px) !important;
        }



        /* Enhanced sticky navbar text colors - pure colors only */
        .theme-light nav.fixed button {
          color:rgb(31, 41, 55) !important; /* dark text in light mode */
          position: relative;
          z-index: 10;
        }

        .theme-light nav.fixed button:hover {
          color: #3b82f6 !important; /* blue on hover in light mode */
        }

        .theme-dark nav.fixed button {
          color: #ffffff !important; /* white text in dark mode */
          position: relative;
          z-index: 10;
        }

        .theme-dark nav.fixed button:hover {
          color: #3b82f6 !important; /* blue on hover in dark mode */
        }

        /* Smooth transitions for theme changes */
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, filter 0.3s ease !important;
        }

        /* Enhanced navbar transition effects */
        nav {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        nav button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default ThemeSwitcher