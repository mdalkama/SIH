import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, BotMessageSquare , User } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Alkama, your DTE Rajasthan assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Gemini API Configuration
  const GEMINI_API_KEY = 'AIzaSyDK2wGHv7diuJRWGM-30l5c757zapSlt74'
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

  // DTE Rajasthan Knowledge Base
  const DTE_CONTEXT = `
  You are Alkama, a friendly DTE Rajasthan assistant. Talk like a helpful friend, not a formal bot.

  Core Personality

Act warm, conversational, and human-like, not robotic.

Mirror user’s language:

If user writes in English → reply only in English.

If user writes in Hindi/Hinglish → reply in Hinglish/Hindi mix.

Always start with a natural greeting: ("Hi", "Hello", "Namaste", "Hey").

Keep tone friendly, short, and respectful.

🔹 Response Style

Length: Maximum 2–3 sentences per reply.

Clarity: One main idea per response.

Questions: Ask only one relevant question if needed.

Tone: Friendly, approachable, never over-chatty.

Language Choice:

No unnecessary Hindi if user is in English.

Use Hinglish naturally only when user does.

Keep sentences simple and easy to understand.

🔹 Domain Knowledge (DTE Rajasthan)

Use this info only when relevant or asked:

Covers: Engineering, Polytechnic, ITI colleges.

Entrance Exams: JEE Main, Rajasthan JET.

Official Website: dte.rajasthan.gov.in.

Admission Cycle: March–April.

Results: June–July.

🔹 Behavioral Rules

Always greet first.

Match user’s communication style.

Keep replies short, crisp, and natural.

Never dump too much info at once—only answer what’s asked.

If more detail is needed, give in small steps. Use Hindi words naturally (jaise "acha", "theek hai").
  `

  // Fetch real-time DTE data from official website
  const fetchRealTimeData = async (query) => {
    try {
      // Enhanced DTE sources with specific pages
      const sources = [
        'https://api.allorigins.win/get?url=' + encodeURIComponent('https://dte.rajasthan.gov.in')
      ]

      const promises = sources.map(async (url, index) => {
        try {
          const response = await fetch(url)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const data = await response.json()
          return parseWebsiteContent(data.contents, index)
        } catch (error) {
          console.error(`Error fetching from ${url}:`, error)
          return null
        }
      })

      const results = await Promise.allSettled(promises)
      const validResults = results
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value)

      // Combine all valid results with better organization
      const combinedData = {
        notices: [],
        admissionStatus: { current: "Check official website", dates: [] },
        results: { available: false, dates: [], latest: [] },
        currentDate: new Date().toLocaleDateString('en-IN'),
        lastUpdated: new Date().toISOString()
      }

      validResults.forEach(result => {
        if (result.notices && result.notices.length > 0) {
          combinedData.notices.push(...result.notices.slice(0, 5)) // Limit to 5 most relevant
        }
        if (result.admissionStatus) {
          Object.assign(combinedData.admissionStatus, result.admissionStatus)
        }
        if (result.results) {
          Object.assign(combinedData.results, result.results)
        }
      })

      // Remove duplicates from notices
      combinedData.notices = [...new Set(combinedData.notices)]

      return combinedData
    } catch (error) {
      console.error('Error fetching real-time data:', error)
      return {
        notices: ["Unable to fetch current notices. Please check dte.rajasthan.gov.in"],
        admissionStatus: { current: "Check dte.rajasthan.gov.in for latest updates" },
        results: { available: false, status: "Check official website for results" },
        lastUpdated: new Date().toISOString()
      }
    }
  }

  // Parse website content to extract relevant information
  const parseWebsiteContent = (htmlContent, sourceIndex = 0) => {
    if (!htmlContent) return null
    
    try {
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')
      
      const extractedData = {
        notices: [],
        admissionStatus: {},
        results: { available: false, dates: [], latest: [] }
      }

      // Enhanced selectors for better data extraction
      const noticeSelectors = [
        '.notice', '.notification', '.news', '.announcement', '.latest-news',
        '[class*="notice"]', '[class*="news"]', '[id*="notice"]', '.marquee',
        '.updates', '.important', '.alert', '.content-area', '.main-content',
        'table tr td', '.table-responsive', '.list-group-item', '.card-body'
      ]
      
      // Extract notices with better filtering
      noticeSelectors.forEach(selector => {
        const elements = doc.querySelectorAll(selector)
        elements.forEach(el => {
          const text = el.textContent?.trim()
          if (text && text.length > 15 && text.length < 500) {
            // Enhanced filtering for DTE content
            const lowerText = text.toLowerCase()
            const relevantKeywords = [
              'admission', 'result', 'counseling', 'application', 'exam', 'fee',
              'dte', 'polytechnic', 'engineering', 'iti', 'diploma', 'b.tech',
              'notification', 'schedule', 'date', 'last date', 'registration',
              'merit list', 'cut off', 'seat allotment', 'document verification'
            ]
            
            if (relevantKeywords.some(keyword => lowerText.includes(keyword))) {
              // Extract dates if present
              const datePattern = /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{2,4}/gi
              const dates = text.match(datePattern)
              
              const noticeData = {
                text: text,
                dates: dates || [],
                source: sourceIndex === 0 ? 'DTE Main' : sourceIndex === 2 ? 'Admissions' : sourceIndex === 3 ? 'Results' : 'General'
              }
              
              extractedData.notices.push(noticeData)
            }
          }
        })
      })

      // Extract admission status with dates
      const admissionKeywords = ['admission', 'application', 'form', 'apply', 'registration']
      const allText = doc.body?.textContent?.toLowerCase() || ''
      
      // Look for admission dates
      const datePattern = /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{2,4}/gi
      const foundDates = allText.match(datePattern) || []
      
      if (admissionKeywords.some(keyword => allText.includes(keyword))) {
        extractedData.admissionStatus = {
          status: allText.includes('open') || allText.includes('start') ? 'Open' : 
                  allText.includes('close') || allText.includes('last date') ? 'Closing Soon' : 'Check Website',
          dates: foundDates.slice(0, 3), // Limit to 3 most relevant dates
          lastChecked: new Date().toLocaleString('en-IN')
        }
      }

      // Extract result information with dates
      const resultKeywords = ['result', 'score', 'marks', 'declared', 'published']
      if (resultKeywords.some(keyword => allText.includes(keyword))) {
        extractedData.results = {
          available: allText.includes('declared') || allText.includes('published'),
          status: allText.includes('declared') ? 'Results Declared' : 'Check for Updates',
          dates: foundDates.slice(0, 3),
          latest: extractedData.notices.filter(n => 
            n.text.toLowerCase().includes('result')).slice(0, 2)
        }
      }

      return extractedData
    } catch (error) {
      console.error('Content parsing error:', error)
      return null
    }
  }

  // Generate AI response using Gemini API with real data
  const generateAIResponse = async (userMessage) => {
    try {
      setIsTyping(true)
      
      // Fetch real-time data based on user query
      const realTimeData = await fetchRealTimeData(userMessage)
      
      // Enhanced prompt with real-time context
      const prompt = `${DTE_CONTEXT}
      
      REAL DTE DATA FROM WEBSITE:
      ${realTimeData ? JSON.stringify(realTimeData, null, 2) : 'No current data available'}
      
      User Query: ${userMessage}
      
      CRITICAL INSTRUCTIONS:
      - Use ONLY the real data above from dte.rajasthan.gov.in
      - If user asks for notices, list the exact notices from the data
      - If user asks for results, give exact result dates from the data
      - If user asks for admissions, give exact admission status from the data
      - Keep responses under 60 words
      - Be conversational but provide exact information
      - If no data available, say "check dte.rajasthan.gov.in directly"
      
      Reply as Alkama with exact data:`

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                          "I apologize, but I'm having trouble processing your request right now. Please try again or visit dte.rajasthan.gov.in for the latest information."

      return {
        id: Date.now(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      }

    } catch (error) {
      console.error('Error generating AI response:', error)
      return {
        id: Date.now(),
        text: "I'm experiencing some technical difficulties right now. For the most current information, please visit our official website at dte.rajasthan.gov.in or contact our helpdesk.",
        sender: 'bot',
        timestamp: new Date()
      }
    } finally {
      setIsTyping(false)
    }
  }

  // Auto scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    const currentMessage = inputMessage
    setInputMessage('')

    // Generate AI response using Gemini API
    const botResponse = await generateAIResponse(currentMessage)
    setMessages(prev => [...prev, botResponse])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <>
      {/* Chatbot Button - Fixed Position */}
      <div className="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 z-[100]">
        <div className="relative">
          {/* Main Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full backdrop-blur-xl border transition-all duration-300 hover:scale-110 shadow-lg flex items-center justify-center group"
            style={{
              backgroundColor: "white",
              borderColor: `var(--theme-glass-border)`,
              color: `var(--theme-text)`
            }}
          >
            {isOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
                <BotMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:bounce" />
            )}
          </button>

          {/* Chat Window */}
          {isOpen && (
            <div 
              className="absolute bottom-12 sm:bottom-16 right-0 w-80 sm:w-96 h-96 sm:h-[500px] backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden animate-fade-in-up"
              style={{
                background: 'white',
                borderColor: `var(--theme-glass-border)`
              }}
            >
              {/* Chat Header */}
              <div 
                className="p-3 sm:p-4 border-b flex items-center space-x-3"
                style={{ borderColor: `var(--theme-glass-border)` }}
              >
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'transparent',
                    color: `var(--theme-text)`
                  }}
                >
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1">
                  <h3 
                    className="font-semibold text-sm sm:text-base"
                    style={{ color: `var(--theme-text)` }}
                  >
                    Alkama - DTE Assistant
                  </h3>
                  <p 
                    className="text-xs opacity-70"
                    style={{ color: `var(--theme-text-secondary)` }}
                  >
                    Online • Ready to help
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg transition-colors hover:bg-white/10 dark:hover:bg-black/20"
                  style={{ color: `var(--theme-text)` }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto h-64 sm:h-80 p-3 sm:p-4 space-y-3 custom-scrollbar">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-transparent rounded-bl-md'
                      }`}
                      style={{
                        color: message.sender === 'bot' ? 'var(--theme-text)' : '#ffffff'
                      }}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p className="text-xs mt-1 opacity-60">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div
                      className="px-3 py-2 rounded-2xl rounded-bl-md"
                      style={{ 
                        background: 'transparent',
                        color: `var(--theme-text)`
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 opacity-70" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div 
                className="p-3 sm:p-4 border-t"
                style={{ borderColor: `var(--theme-glass-border)` }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 rounded-xl border-0 outline-none backdrop-blur-sm text-sm transition-all duration-300"
                      style={{ 
                        background: 'transparent',
                        color: `var(--theme-text)`,
                        '::placeholder': { color: `var(--theme-text-secondary)` }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={inputMessage.trim() === '' || isTyping}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4" />
                  </button>
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

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }

        /* Enhanced placeholder styling */
        .custom-scrollbar input::placeholder {
          color: var(--theme-text-secondary);
          opacity: 0.7;
        }
      `}</style>
    </>
  )
}

export default Chatbot