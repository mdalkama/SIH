import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, BotMessageSquare, Mic, MicOff } from 'lucide-react'

// Complete DTE Rajasthan Hardcoded Dataset
const dteData = {
  admissions: {
    diploma_first_year: {
      english: "Diploma First Year 2025-26: Applications start from 11 August 2025. Eligibility: 10th pass with minimum 35% marks. Online application available on DTE Rajasthan website.",
      hindi: "डिप्लोमा प्रथम वर्ष 2025-26: आवेदन 11 अगस्त 2025 से शुरू। पात्रता: 10वीं पास न्यूनतम 35% अंकों के साथ। DTE राजस्थान वेबसाइट पर ऑनलाइन आवेदन उपलब्ध।"
    },
    diploma_lateral_entry: {
      english: "Diploma Lateral Entry (Second Year) 2025-26: Applications from 14 August 2025. Eligibility: Passed relevant Diploma/ITI with minimum 45% marks.",
      hindi: "डिप्लोमा लेटरल एंट्री (द्वितीय वर्ष) 2025-26: 14 अगस्त 2025 से आवेदन। पात्रता: संबंधित डिप्लोमा/ITI पास न्यूनतम 45% अंकों के साथ।"
    },
  },
  results: {
    diploma: {
      "1": {
        english: "Diploma 1st Semester Result released on 12 September 2025.",
        hindi: "डिप्लोमा प्रथम सेमेस्टर का परिणाम 12 सितंबर 2025 को घोषित किया गया।"
      },
      "2": {
        english: "Diploma 2nd Semester Result released on 15 September 2025.",
        hindi: "डिप्लोमा द्वितीय सेमेस्टर का परिणाम 15 सितंबर 2025 को घोषित किया गया।"
      },
      "3": {
        english: "Diploma 3rd Semester Result published on 18 September 2025.",
        hindi: "डिप्लोमा तृतीय सेमेस्टर का परिणाम 18 सितंबर 2025 को घोषित किया गया।"
      },
      "4": {
        english: "Diploma 4th Semester Result declared on 20 September 2025.",
        hindi: "डिप्लोमा चतुर्थ सेमेस्टर का परिणाम 20 सितंबर 2025 को घोषित किया गया।"
      },
      "5": {
        english: "Diploma 5th Semester Result declared on 22 September 2025.",
        hindi: "डिप्लोमा पंचम सेमेस्टर का परिणाम 22 सितंबर 2025 को घोषित किया गया।"
      },
      "6": {
        english: "Diploma 6th Semester Result published on 25 September 2025.",
        hindi: "डिप्लोमा षष्ठ सेमेस्टर का परिणाम 25 सितंबर 2025 को घोषित किया गया।"
      },
      revaluation: {
        english: "Diploma Revaluation Result announced on 28 September 2025.",
        hindi: "डिप्लोमा पुनर्मूल्यांकन परिणाम 28 सितंबर 2025 को घोषित किया गया।"
      }
    },
    semesterPrompt: {
      english: "Which Diploma semester result are you asking about?",
      hindi: "आप किस डिप्लोमा सेमेस्टर के परिणाम के बारे में पूछ रहे हैं?"
    }
  },
  eligibility: {
    diploma_first_year: {
      english: "Diploma First Year: 10th pass with minimum 35% marks.",
      hindi: "डिप्लोमा प्रथम वर्ष: 10वीं पास न्यूनतम 35% अंकों के साथ।"
    },
    diploma_lateral_entry: {
      english: "Diploma Lateral Entry: Passed Diploma in relevant branch with minimum 45% marks.",
      hindi: "डिप्लोमा लेटरल एंट्री: संबंधित शाखा में डिप्लोमा पास न्यूनतम 45% अंकों के साथ।"
    },
  },
  exams: {
    diploma: {
      "1": {
        english: "Diploma 1st Semester exam starts on 1 October 2025.",
        hindi: "डिप्लोमा प्रथम सेमेस्टर की परीक्षा 1 अक्टूबर 2025 को शुरू होती है।"
      },
      "2": {
        english: "Diploma 2nd Semester exam starts on 15 October 2025.",
        hindi: "डिप्लोमा द्वितीय सेमेस्टर की परीक्षा 15 अक्टूबर 2025 को शुरू होती है।"
      },
      "3": {
        english: "Diploma 3rd Semester exam starts on 10 October 2025.",
        hindi: "डिप्लोमा तृतीय सेमेस्टर की परीक्षा 10 अक्टूबर 2025 को शुरू होती है।"
      },
      "4": {
        english: "Diploma 4th Semester exam starts on 20 October 2025.",
        hindi: "डिप्लोमा चतुर्थ सेमेस्टर की परीक्षा 20 अक्टूबर 2025 को शुरू होती है।"
      },
      "5": {
        english: "Diploma 5th Semester exam starts on 25 October 2025.",
        hindi: "डिप्लोमा पंचम सेमेस्टर की परीक्षा 25 अक्टूबर 2025 को शुरू होती है।"
      },
      "6": {
        english: "Diploma 6th Semester exam starts on 30 October 2025.",
        hindi: "डिप्लोमा षष्ठ सेमेस्टर की परीक्षा 30 अक्टूबर 2025 को शुरू होती है।"
      }
    },
    semesterPrompt: {
      english: "Which Diploma semester exam are you asking about?",
      hindi: "आप किस डिप्लोमा सेमेस्टर की परीक्षा के बारे में पूछ रहे हैं?"
    }
  },
  notices: {
    latest: {
      english: "Latest notices: Online form invited for College level I year and II year engineering diploma admissions from 11 to 14/08/2025. Provisional Merit List for Lateral Entry Admissions (Second Year Engineering Courses) 2025-26.",
      hindi: "नवीनतम सूचनाएं: कॉलेज स्तर के प्रथम वर्ष और द्वितीय वर्ष इंजीनियरिंग डिप्लोमा प्रवेश के लिए 11 से 14/08/2025 तक ऑनलाइन फॉर्म आमंत्रित।"
    }
  },
  greetings: {
    english: "Hello! I'm Saarthi, your DTE Rajasthan student assistant. I can help with admissions, results, eligibility, exams, and notices. What would you like to know?",
    hindi: "नमस्ते! मैं सारथी हूं, आपका DTE राजस्थान छात्र सहायक। मैं प्रवेश, परिणाम, पात्रता, परीक्षा और नोटिस में मदद कर सकता हूं। आप क्या जानना चाहते हैं?"
  },
  refusal: {
    english: "I am sorry, this information is not available. Please visit the official DTE Rajasthan website.",
    hindi: "मुझे खेद है, यह जानकारी उपलब्ध नहीं है। कृपया आधिकारिक DTE राजस्थान वेबसाइट पर जाएं।"
  },
  semesterNotFound: {
    english: "Sorry, this semester information is not available. Please check the official DTE Rajasthan website.",
    hindi: "खेद है, इस सेमेस्टर की जानकारी उपलब्ध नहीं है। कृपया आधिकारिक DTE राजस्थान वेबसाइट देखें।"
  },
  btechRestriction: {
    english: "DTE Rajasthan provides information only for Diploma courses. Please visit the official website for other courses.",
    hindi: "DTE राजस्थान केवल डिप्लोमा पाठ्यक्रमों की जानकारी प्रदान करता है। अन्य पाठ्यक्रमों के लिए कृपया आधिकारिक वेबसाइट पर जाएं।"
  },
  noInfo: {
    english: "I'm sorry, I don't have that information. Please check the official DTE Rajasthan website.",
    hindi: "मुझे खेद है, मेरे पास यह जानकारी नहीं है। कृपया आधिकारिक DTE राजस्थान वेबसाइट देखें।"
  }
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Saarthi, your DTE Rajasthan assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lastIntent, setLastIntent] = useState(null) // Context state for follow-ups
  const [contextType, setContextType] = useState(null) // Track if follow-up is for admission or eligibility
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Language detection
  const detectLanguage = (text) => {
    const hindiPattern = /[\u0900-\u097F]/
    return hindiPattern.test(text) ? 'hindi' : 'english'
  }


  // Simplified intent detection for Diploma only
  const detectIntent = (text) => {
    const lower = text.toLowerCase()
    
    // Check for B.Tech mentions and restrict
    if (/(b\.?tech|engineering|इंजीनियरिंग)/.test(lower)) {
      return 'btech_restriction'
    }
    
    // Handle diploma semester selection for exams
    if (lastIntent === 'awaiting_diploma_exam_sem') {
      const semMatch = lower.match(/(1st|first|प्रथम|पहला|1|2nd|second|द्वितीय|दूसरा|2|3rd|third|तृतीय|तीसरा|3|4th|fourth|चतुर्थ|चौथा|4|5th|fifth|पंचम|पांचवा|5|6th|sixth|षष्ठ|छठा|6)/)
      if (semMatch) return `diploma_exam_${extractSemesterNumber(semMatch[0])}`
    }
    
    // Handle diploma semester selection for results
    if (lastIntent === 'awaiting_diploma_result_sem') {
      const semMatch = lower.match(/(1st|first|प्रथम|पहला|1|2nd|second|द्वितीय|दूसरा|2|3rd|third|तृतीय|तीसरा|3|4th|fourth|चतुर्थ|चौथा|4|5th|fifth|पंचम|पांचवा|5|6th|sixth|षष्ठ|छठा|6|revaluation|पुनर्मूल्यांकन)/)
      if (semMatch) {
        if (/(revaluation|पुनर्मूल्यांकन)/.test(semMatch[0])) return 'diploma_result_revaluation'
        return `diploma_result_${extractSemesterNumber(semMatch[0])}`
      }
    }
    
    // Regular intent detection
    if (/(hi|hello|hey|namaste|नमस्ते)/.test(lower)) return 'greeting'
    if (/(admission|प्रवेश|दाखिला|form|apply|आवेदन)/.test(lower)) return 'admission'
    if (/(result|marks|score|परिणाम|रिजल्ट)/.test(lower)) return 'result'
    if (/(exam|test|परीक्षा)/.test(lower)) return 'exam'
    if (/(eligibility|qualify|criteria|पात्रता|योग्यता)/.test(lower)) return 'eligibility'
    if (/(notice|notification|announcement|सूचना|नोटिस)/.test(lower)) return 'notice'
    return 'unknown'
  }

  // Helper function to extract semester number
  const extractSemesterNumber = (text) => {
    const lower = text.toLowerCase()
    if (/(1st|first|प्रथम|पहला|1)/.test(lower)) return '1'
    if (/(2nd|second|द्वितीय|दूसरा|2)/.test(lower)) return '2'
    if (/(3rd|third|तृतीय|तीसरा|3)/.test(lower)) return '3'
    if (/(4th|fourth|चतुर्थ|चौथा|4)/.test(lower)) return '4'
    if (/(5th|fifth|पंचम|पांचवा|5)/.test(lower)) return '5'
    if (/(6th|sixth|षष्ठ|छठा|6)/.test(lower)) return '6'
    return null
  }

  // Enhanced context-aware response generation
  const generateResponse = (message) => {
    const lang = detectLanguage(message)
    const intent = detectIntent(message)
    const lower = message.toLowerCase()

    switch(intent) {
      case 'greeting':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.greetings[lang], language: lang }

      case 'admission':
        // Check if specific type mentioned
        if (/(diploma|polytechnic|डिप्लोमा|पॉलिटेक्निक)/.test(lower)) {
          setLastIntent(null)
          setContextType(null)
          return { text: dteData.admissions.diploma.firstYear[lang], language: lang }
        }
        if (/(b\.?tech|engineering|इंजीनियरिंग)/.test(lower)) {
          setLastIntent(null)
          setContextType(null)
          return { text: dteData.admissions.btech.firstYear[lang], language: lang }
        }
        // General admission - ask for clarification
        setLastIntent('awaiting_type')
        setContextType('admission')
        return { text: dteData.admissions.generalPrompt[lang], language: lang }


      case 'btech_restriction':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.btechRestriction[lang], language: lang }

      case 'admission':
        setLastIntent(null)
        setContextType(null)
        if (/(lateral|लेटरल)/.test(lower)) {
          return { text: dteData.admissions.diploma_lateral_entry[lang], language: lang }
        }
        return { text: dteData.admissions.diploma_first_year[lang], language: lang }

      case 'eligibility':
        setLastIntent(null)
        setContextType(null)
        if (/(lateral|लेटरल)/.test(lower)) {
          return { text: dteData.eligibility.diploma_lateral_entry[lang], language: lang }
        }
        return { text: dteData.eligibility.diploma_first_year[lang], language: lang }

      case 'result':
        // General result query - ask for semester directly
        setLastIntent('awaiting_diploma_result_sem')
        setContextType('result')
        return { text: dteData.results.semesterPrompt[lang], language: lang }

      case 'diploma_result_1':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.results.diploma['1'][lang], language: lang }

      case 'diploma_result_2':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.results.diploma['2'][lang], language: lang }

      case 'diploma_result_3':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.results.diploma['3'][lang], language: lang }

      case 'diploma_result_4':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.results.diploma['4'][lang], language: lang }

      case 'diploma_result_5':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.results.diploma['5'][lang], language: lang }

      case 'diploma_result_6':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.results.diploma['6'][lang], language: lang }

      case 'diploma_result_revaluation':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.results.diploma.revaluation[lang], language: lang }


      case 'exam':
        // General exam query - ask for semester directly
        setLastIntent('awaiting_diploma_exam_sem')
        setContextType('exam')
        return { text: dteData.exams.semesterPrompt[lang], language: lang }

      case 'diploma_exam_1':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.exams.diploma['1'][lang], language: lang }

      case 'diploma_exam_2':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.exams.diploma['2'][lang], language: lang }

      case 'diploma_exam_3':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.exams.diploma['3'][lang], language: lang }

      case 'diploma_exam_4':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.exams.diploma['4'][lang], language: lang }

      case 'diploma_exam_5':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.exams.diploma['5'][lang], language: lang }

      case 'diploma_exam_6':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.exams.diploma['6'][lang], language: lang }


      case 'notice':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.notices.latest[lang], language: lang }

      default:
        // Check if we're in a semester context and semester not found
        if (lastIntent === 'awaiting_diploma_exam_sem' || lastIntent === 'awaiting_diploma_result_sem') {
          setLastIntent(null)
          setContextType(null)
          return { text: dteData.semesterNotFound[lang], language: lang }
        }
        
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.refusal[lang], language: lang }
    }
  }

  // Initialize Speech Recognition and Synthesis with multi-language support
  useEffect(() => {
    // Check Speech Recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-IN' // Start with English, will auto-detect
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        const detectedLang = detectLanguage(transcript)
        
        // Auto-switch language for next recognition based on detected language
        if (detectedLang === 'english') {
          recognitionRef.current.lang = 'en-IN'
        } else {
          recognitionRef.current.lang = 'hi-IN'
        }
        
        // Only set text, no audio playback of user's voice
        setInputMessage(prev => prev + transcript)
        setIsListening(false)
        
        // Focus input field after speech recognition completes
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error)
        setIsListening(false)
        // Focus input field on error
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
      recognitionRef.current.onend = () => {
        setIsListening(false)
        // Focus input field when recognition ends
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
    }

  }, [])


  // Handle sending message with context awareness
  const handleSend = () => {
    if (!inputMessage.trim()) return
    
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      language: detectLanguage(inputMessage)
    }
    
    setMessages([...messages, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = generateResponse(userMessage.text)
      const botMessage = { 
        id: prev => prev.length + 1, 
        text: botResponse.text, 
        sender: 'bot', 
        timestamp: new Date(), 
        language: botResponse.language 
      }
      
      setMessages(prev => [...prev, {
        ...botMessage,
        id: prev.length + 1
      }])
      setIsTyping(false)
      
      // No audio playback - only text response
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSendMessage = () => {
    handleSend()
  }

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return
    
    try {
      if (isListening) {
        // Stop speech recognition - no audio playback of user voice
        recognitionRef.current.stop()
        setIsListening(false)
        // Focus input field after stopping mic so user can type and press Enter
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      } else {
        // Start speech recognition - convert speech to text only
        recognitionRef.current.start()
        setIsListening(true)
      }
    } catch (error) {
      console.log('Speech recognition toggle error:', error)
      setIsListening(false)
      // Focus input field on error too
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input field when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 300) // Wait for animation to complete
    }
  }, [isOpen])

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
              borderColor: 'var(--theme-glass-border)',
              color: 'var(--theme-text)' 
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
                borderColor: 'var(--theme-glass-border)' 
              }}
            >
              {/* Chat Header */}
              <div 
                className="p-3 sm:p-4 border-b flex items-center space-x-3"
                style={{ borderColor: 'var(--theme-glass-border)' }}
              >
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'transparent',
                    color: 'var(--theme-text)' 
                  }}
                >
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1">
                  <h3 
                    className="font-semibold text-sm sm:text-base"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Saarthi - DTE Assistant
                  </h3>
                  <p 
                    className="text-xs opacity-70"
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    Online • Ready to help
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg transition-colors hover:bg-white/10 dark:hover:bg-black/20"
                  style={{ color: 'var(--theme-text)' }}
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
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
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
                        color: 'var(--theme-text)' 
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
                style={{ borderColor: 'var(--theme-glass-border)' }}
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
                        color: 'var(--theme-text)',
                        '::placeholder': { color: 'var(--theme-text-secondary)' }
                      }}
                    />
                  </div>
                  {speechSupported && (
                    <button
                      onClick={toggleListening}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}
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