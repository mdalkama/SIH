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

  // Multiple Gemini API Keys for fallback
  const GEMINI_API_KEYS = [
    'AIzaSyDfkIgTmdjJw4ExbmiMYoBsgchRm0xH4UE',
    'AIzaSyAXRmo56mnT6Qf92xg2YNWWzYWLzWyEHX0',
    'AIzaSyAJ3oF8lVYDf7W-hmzUlsF5xcE4io0Yg4U',
    'AIzaSyBWFS7XBomt6OJaI0MfbuVbcC9H6K-zUPw'
  ]
  
  let currentApiKeyIndex = 0
  const getCurrentApiUrl = () => {
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEYS[currentApiKeyIndex]}`
  }
  
  const rotateApiKey = () => {
    currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length
    console.log(`Switched to API key index: ${currentApiKeyIndex}`)
  }

  // DTE Rajasthan Knowledge Base with Exam Details
  const DTE_CONTEXT = `You are Alkama, an AI assistant for DTE Rajasthan. Your primary role is to provide accurate information about DTE Rajasthan's academic calendar, exams, results, and important dates.

CORE PERSONALITY:
- Warm, knowledgeable, and professional
- Friendly yet formal when needed
- Bilingual (English/Hindi) based on user's preference
- Honest about information limitations

EXAMINATION INFORMATION (2024-25):

1. B.TECH EXAMINATIONS:
   - Odd Semester Exams: November-December 2024
   - Even Semester Exams: April-May 2025
   - Practical Exams: 1 week before theory exams
   - Back Paper Exams: July 2025

2. DIPLOMA EXAMINATIONS:
   - 1st/3rd/5th Semester: December 2024
   - 2nd/4th/6th Semester: May 2025
   - Back Paper Exams: July 2025

3. IMPORTANT DATES:
   - Exam Form Submission Start: 15th October 2024 (for Nov-Dec exams)
   - Last Date for Exam Form: 5th November 2024
   - Date Sheet Release: 15 days before exams
   - Practical Schedule: 1 week before theory exams
   - Result Declaration: Within 45 days of last exam

4. RESULT DECLARATION (Last Academic Year 2023-24):
   - Odd Semester Results: January 2024
   - Even Semester Results: July 2024
   - Re-evaluation Results: Within 30 days of application

5. NOTICES & UPDATES:
   - Exam form submission extended till 10th November 2024
   - Practical exam schedule for B.Tech 3rd/5th/7th sem released
   - Last date for re-evaluation application: 15th August 2024
   - Special exam schedule for backlogs: August-September 2024

6. IMPORTANT LINKS:
   - Exam Form: exam.dte.rajasthan.gov.in
   - Results: result.dte.rajasthan.gov.in
   - Date Sheet: dte.rajasthan.gov.in/exam-schedule
   - Syllabus: dte.rajasthan.gov.in/syllabus

7. HELPDESK CONTACTS:
   - Exam Department: 0141-2221021 (Ext. 221)
   - Result Helpline: 0141-2221021 (Ext. 225)
   - Email: exam.dte.rajasthan@rajasthan.gov.in
   - Office Hours: 10:00 AM - 5:00 PM (Mon-Sat)

RESPONSE GUIDELINES:
1. Always provide the most current exam information
2. If dates have passed, direct to official website for updates
3. For result queries, ask for specific semester/year
4. Include relevant links when available
5. If unsure, direct to official contacts

EXAMPLE RESPONSES:
- "The B.Tech 3rd semester exams are scheduled from 15th November 2024. The detailed date sheet is available at dte.rajasthan.gov.in/exam-schedule"
- "For re-evaluation of your May 2024 exams, you can apply online at result.dte.rajasthan.gov.in until 15th August 2024."
- "The last date for exam form submission is 5th November 2024. Late fees may apply after this date."
  `

  // Enhanced exam and result data
  const EXAM_DATA = {
    currentAcademicYear: '2024-25',
    semesters: {
      odd: {
        name: 'Odd Semester (July-December)',
        exams: 'November-December 2024',
        results: 'January 2025',
        backPaperExam: 'July 2025',
        forms: {
          start: '15th October 2024',
          end: '5th November 2024',
          lateEnd: '10th November 2024 (with late fee)'
        }
      },
      even: {
        name: 'Even Semester (January-May)',
        exams: 'April-May 2025',
        results: 'June 2025',
        backPaperExam: 'July 2025',
        forms: {
          start: '15th February 2025',
          end: '5th March 2025',
          lateEnd: '10th March 2025 (with late fee)'
        }
      }
    },
    importantDates: [
      { date: '15th October 2024', event: 'Odd Semester Exam Forms Start' },
      { date: '5th November 2024', event: 'Last date for exam form submission' },
      { date: '15th November 2024', event: 'Odd Semester Theory Exams Begin' },
      { date: '15th January 2025', event: 'Expected Odd Semester Results' },
      { date: '15th February 2025', event: 'Even Semester Exam Forms Start' },
      { date: '5th March 2025', event: 'Last date for exam form submission' },
      { date: '1st April 2025', event: 'Even Semester Theory Exams Begin' },
      { date: '15th June 2025', event: 'Expected Even Semester Results' },
      { date: '1st July 2025', event: 'Back Paper Exams Begin' }
    ],
    notices: [
      'Exam form submission extended till 10th November 2024 with late fee of ₹500',
      'Practical exam schedule for B.Tech 3rd/5th/7th sem released',
      'Last date for re-evaluation application: 15th August 2024',
      'Special exam schedule for backlogs: August-September 2024',
      'Online verification of marks available for all semesters',
      'New exam pattern details updated on the website',
      'Guidelines for project submission and viva-voce published'
    ]
  };

  // Fetch real-time data from multiple official websites with better error handling
  const fetchRealTimeData = async (query) => {
    try {
      // First return the static exam data
      if (query.toLowerCase().includes('exam') || 
          query.toLowerCase().includes('result') || 
          query.toLowerCase().includes('date') ||
          query.toLowerCase().includes('form') ||
          query.toLowerCase().includes('schedule')) {
        return {
          examData: EXAM_DATA,
          lastUpdated: new Date().toISOString(),
          source: 'DTE Rajasthan Exam Department'
        };
      }
      
      // For other queries, try to fetch from official sources
      const sources = [
        {
          url: 'https://dte.rajasthan.gov.in',
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

  // Common exam-related queries and responses
  const handleExamQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    // Determine current semester (Odd: July-Dec, Even: Jan-June)
    const currentSemester = (currentMonth >= 7) ? 'odd' : 'even';
    const nextSemester = (currentMonth >= 7) ? 'even' : 'odd';
    const semData = EXAM_DATA.semesters[currentSemester];
    
    // Common exam queries
    if (lowerQuery.includes('exam date') || lowerQuery.includes('exam schedule')) {
      return `The ${semData.name} exams are scheduled for ${semData.exams}. ` +
             `Exam forms are accepted from ${semData.forms.start} to ${semData.forms.end}. ` +
             `Late submissions with fee are accepted until ${semData.forms.lateEnd}.`;
    }
    
    if (lowerQuery.includes('result') || lowerQuery.includes('marks')) {
      return `The ${semData.name} results are expected by ${semData.results}. ` +
             `You can check results at result.dte.rajasthan.gov.in. ` +
             `For re-evaluation, applications are usually accepted within 15 days of result declaration.`;
    }
    
    if (lowerQuery.includes('form') || lowerQuery.includes('apply') || lowerQuery.includes('submission')) {
      return `For ${semData.name} exams:
- Forms available from: ${semData.forms.start}
- Last date: ${semData.forms.end}
- With late fee: ${semData.forms.lateEnd}
Apply at: exam.dte.rajasthan.gov.in`;
    }
    
    if (lowerQuery.includes('back paper') || lowerQuery.includes('reattempt')) {
      return `Back paper exams are typically held in ${EXAM_DATA.semesters.odd.backPaperExam}. ` +
             `The schedule is usually announced one month before the exams. ` +
             `Please check the official website for the latest updates.`;
    }
    
    if (lowerQuery.includes('practical') || lowerQuery.includes('viva')) {
      return `Practical exams are usually conducted 1-2 weeks before the theory exams. ` +
             `The schedule is announced by your college. ` +
             `Please check with your college administration for exact dates.`;
    }
    
    if (lowerQuery.includes('date sheet') || lowerQuery.includes('timetable')) {
      return `The date sheet for ${semData.name} exams will be available at dte.rajasthan.gov.in/exam-schedule ` +
             `approximately 15 days before the exams begin. ` +
             `Colleges usually display it on their notice boards as well.`;
    }
    
    return null;
  };

  // Generate AI response using Gemini API with real data and multiple API keys
  const generateAIResponse = async (userMessage, retryCount = 0) => {
    // First try to handle with predefined responses
    const predefinedResponse = handleExamQuery(userMessage);
    if (predefinedResponse) {
      return {
        id: Date.now(),
        text: predefinedResponse,
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (retryCount >= GEMINI_API_KEYS.length) {
      console.error('All API keys exhausted');
      return {
        id: Date.now(),
        text: "I'm having trouble connecting to our services right now. Here are some quick links you might find helpful:\n\n" +
              "• Exam Schedule: dte.rajasthan.gov.in/exam-schedule\n" +
              "• Results: result.dte.rajasthan.gov.in\n" +
              "• Exam Forms: exam.dte.rajasthan.gov.in\n\n" +
              "Please try again later or visit our official website for the latest updates.",
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

      const apiUrl = getCurrentApiUrl()
      console.log(`Using API key index: ${currentApiKeyIndex}`)
      
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
        console.error(`API Error (key ${currentApiKeyIndex}): ${response.status}`)
        rotateApiKey()
        return generateAIResponse(userMessage, retryCount + 1)
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
      
      // Try with next API key if available
      if (retryCount < GEMINI_API_KEYS.length - 1) {
        console.log(`Retrying with next API key... (attempt ${retryCount + 1})`)
        rotateApiKey()
        return generateAIResponse(userMessage, retryCount + 1)
      }
      
      return {
        id: Date.now(),
        text: "I'm having some trouble connecting right now. Please try again in a few minutes or visit our official websites directly:\n\n1. DTE Rajasthan: https://dte.rajasthan.gov.in\n2. Tech Edu Rajasthan: https://techedu.rajasthan.gov.in\n3. HTE Rajasthan: https://hte.rajasthan.gov.in/",
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