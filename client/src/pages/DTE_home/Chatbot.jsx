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

  // Local Knowledge Base
  const localKnowledgeBase = {
    greetings: [
      'Hello! I\'m Alkama, your DTE Rajasthan assistant. How can I help you today?',
      'Namaste! Main hu Alkama, DTE Rajasthan ka assistant. Aapki kya madad karu?',
      'Hi there! How can I assist you with DTE Rajasthan today?'
    ],
    admission: {
      'btech': 'B.Tech admissions are through REAP based on JEE Main scores. Visit dte.rajasthan.gov.in for details.',
      'diploma': 'Diploma admissions are based on 10th/12th marks. Check the official website for the latest schedule.',
      'iti': 'ITI admissions are conducted twice a year. Visit the official website for current notices.'
    },
    results: {
      'btech': 'B.Tech results are usually declared within 30 days after exams.',
      'diploma': 'Diploma results are typically announced within 15-20 days after exams.',
      'iti': 'ITI results are generally declared within a month after exams.'
    },
    contact: 'You can contact DTE Rajasthan at:\n- Phone: 0141-2701544\n- Email: dte.rajasthan@rajasthan.gov.in\n- Address: Directorate of Technical Education, J.L.N. Marg, Jaipur - 302017',
    website: 'Official website: https://dte.rajasthan.gov.in\nCheck the website for latest notifications, results, and admission updates.',
    default: 'I can help with information about admissions, results, exams, and more. Please ask specific questions.'
  };

  // API Configuration
  const GEMINI_API_KEY = 'AIzaSyDYZUAU8JWJDjW5jowt5NYrQTYn4JI4agk';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const getApiUrl = () => {
    if (!GEMINI_API_KEY) {
      console.error('No Gemini API key configured.');
      return null;
    }
    return GEMINI_API_URL;
  }

  // DTE Rajasthan Knowledge Base
  const DTE_CONTEXT = `You are Alkama, an AI assistant for DTE Rajasthan. Your primary role is to provide accurate information about DTE Rajasthan while also being helpful with general knowledge questions.

CORE PERSONALITY:
- Warm, knowledgeable, and professional
- Friendly yet formal when needed
- Bilingual (English/Hindi) based on user's preference
- Honest about information limitations

RESPONSE STYLE:
- Keep answers concise (2-3 sentences max)
- Use simple, clear language
- Match user's communication style
- Start with appropriate greeting
- Be direct and to the point

DTE RAJASTHAN KEY INFORMATION:

LEADERSHIP (as of 2024):
- Director (Technical Education): Dr. Subodh Agarwal, IAS
- Additional Director (Colleges): Position may change, check website
- Joint Director (Admissions): Position may change, check website
- Controller of Examinations: Position may change, check website

IMPORTANT FUNCTIONS:
1. Academic Management:
   - Oversees technical education in Rajasthan
   - Manages curriculum and examinations
   - Handles student admissions and results

2. Key Processes:
   - REAP (Rajasthan Engineering Admission Process)
   - JEE Main & Rajasthan JET counseling
   - Polytechnic and ITI admissions

3. Institutions:
   - 33+ Government Engineering Colleges
   - 50+ Government Polytechnic Colleges
   - 200+ Government ITIs

CONTACT INFO:
- Website: dte.rajasthan.gov.in
- Helpline: 0141-2221021
- Email: dte.raj@rajasthan.gov.in

GUIDELINES:
1. For DTE queries:
   - Provide specific, accurate information
   - Reference official sources
   - If unsure, direct to official website

2. For general knowledge:
   - Answer directly when known
   - Keep it brief and factual
   - Don't make up information

3. When unsure:
   - Admit it honestly
   - Suggest where to find the info
   - Never guess or assume

EXAMPLE RESPONSES:
- "The current Director of DTE Rajasthan is Dr. Subodh Agarwal, IAS."
- "For latest admission dates, please visit dte.rajasthan.gov.in"
- "I'm not certain about that, but you can find that information on..."
- "The capital of India is New Delhi."

IMPORTANT NOTES:
- Always verify information from official sources
- Leadership positions may change - check website for updates
- Be helpful but concise in responses
- Maintain professional yet approachable tone
  `

  // Fetch real-time data from multiple official websites
  const fetchRealTimeData = async (query) => {
    try {
      // Multiple DTE related sources
      const sources = [
        {
          url: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://dte.rajasthan.gov.in'),
          name: 'DTE Rajasthan',
          type: 'main'
        },
        {
          url: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://techedu.rajasthan.gov.in/home/dptHome'),
          name: 'Tech Edu Rajasthan',
          type: 'education'
        },
        {
          url: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://hte.rajasthan.gov.in/'),
          name: 'HTE Rajasthan',
          type: 'technical_education'
        }
      ]

      const promises = sources.map(async (source, index) => {
        try {
          console.log(`Fetching data from ${source.name}...`)
          const response = await fetch(source.url)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const data = await response.json()
          const content = data.contents || data.contents || ''
          return {
            ...parseWebsiteContent(content, index, source.type),
            source: source.name,
            type: source.type
          }
        } catch (error) {
          console.error(`Error fetching from ${source.name} (${source.url}):`, error)
          return {
            source: source.name,
            type: source.type,
            error: error.message,
            notices: [`Unable to fetch data from ${source.name}`]
          }
        }
      })

      const results = await Promise.allSettled(promises)
      const validResults = results
        .filter(r => r.status === 'fulfilled' && r.value)

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
  const parseWebsiteContent = (htmlContent, sourceIndex = 0, sourceType = 'main') => {
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

  // Process user message and generate response from local knowledge base
  const getLocalResponse = (message) => {
    const msg = message.toLowerCase();
    
    // Check for greetings
    if (/(hi|hello|hey|namaste|hii|hlo|hlw)/.test(msg)) {
      return localKnowledgeBase.greetings[
        Math.floor(Math.random() * localKnowledgeBase.greetings.length)
      ];
    }
    
    // Check for admission related queries
    if (/(admission|admit|apply|form|registration)/.test(msg)) {
      if (/(b.?tech|b.?e|b.?e.?|engineering)/.test(msg)) return localKnowledgeBase.admission.btech;
      if (/(diploma|polytechnic)/.test(msg)) return localKnowledgeBase.admission.diploma;
      if (/iti/.test(msg)) return localKnowledgeBase.admission.iti;
      return 'For admissions, please specify the course (B.Tech/Diploma/ITI).';
    }
    
    // Check for result related queries
    if (/(result|marks|score|grade)/.test(msg)) {
      if (/(b.?tech|b.?e|b.?e.?|engineering)/.test(msg)) return localKnowledgeBase.results.btech;
      if (/(diploma|polytechnic)/.test(msg)) return localKnowledgeBase.results.diploma;
      if (/iti/.test(msg)) return localKnowledgeBase.results.iti;
      return 'For results, please specify the course (B.Tech/Diploma/ITI).';
    }
    
    // Check for contact information
    if (/(contact|number|email|address|where|location)/.test(msg)) {
      return localKnowledgeBase.contact;
    }
    
    // Check for website information
    if (/(website|site|online|portal|link)/.test(msg)) {
      return localKnowledgeBase.website;
    }
    
    // Default response
    return localKnowledgeBase.default;
  };

  // Generate AI response using Gemini API with real data
  const generateAIResponse = async (userMessage) => {
    // First try to get response from local knowledge base
    const localResponse = getLocalResponse(userMessage);
    
    // If we have a good local response, use it
    if (localResponse && !localResponse.includes('I can help with')) {
      return {
        id: Date.now(),
        text: localResponse,
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // If no good local response, try the API
    const apiUrl = getApiUrl();
    if (!apiUrl) {
      return {
        id: Date.now(),
        text: localResponse, // Fallback to local response
        sender: 'bot',
        timestamp: new Date()
      };
    }

    try {
      setIsTyping(true)
      
      // Fetch real-time data based on user query
      const realTimeData = await fetchRealTimeData(userMessage)
      
      // Enhanced prompt with real-time context
      const prompt = `${DTE_CONTEXT}
      
      CURRENT DATE: ${new Date().toLocaleDateString('en-IN')}
      
      REAL-TIME DATA FROM OFFICIAL WEBSITES:
      ${realTimeData ? JSON.stringify(realTimeData, null, 2) : 'No current data available'}
      
      USER QUERY: ${userMessage}
      
      RESPONSE INSTRUCTIONS:
      1. Start with a friendly greeting in the user's language
      2. Answer concisely (1-2 sentences) based on the data above
      3. If data is available, provide specific details with dates/numbers
      4. If unsure, suggest checking the official websites
      5. Keep tone warm, helpful, and human-like
      6. If user asks about leadership (VC, Director, etc), provide current details:
         - Vice Chancellor: [Check official website for current VC]
         - Director: [Check official website for current Director]
      
      IMPORTANT: If you don't know something, just say you don't know rather than making up information.`

      const response = await fetch(apiUrl, {
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
        console.error(`API Error: ${response.status}`)
        throw new Error(`API request failed with status ${response.status}`)
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
      console.error('Error generating AI response:', error);
      
      // Fallback to local response if API fails
      return {
        id: Date.now(),
        text: getLocalResponse(userMessage),
        sender: 'bot',
        timestamp: new Date()
      };
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