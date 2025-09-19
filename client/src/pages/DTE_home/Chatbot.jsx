import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, BotMessageSquare, Mic, MicOff } from 'lucide-react'

// Complete DTE Rajasthan Hardcoded Dataset
const dteData = {
  admissions: {
    diploma: {
      firstYear: {
        english: "Diploma First Year (Engineering) 2025-26: Application dates 11-14 August 2025, 11:00 AM onwards. Apply via www.dap2025.in. Counseling through centralized online process.",
        hindi: "डिप्लोमा प्रथम वर्ष (इंजीनियरिंग कोर्स) 2025-26: आवेदन तिथि 11-14 अगस्त 2025, सुबह 11:00 बजे से। www.dap2025.in पर आवेदन करें।"
      },
      lateralEntry: {
        english: "Diploma Lateral Entry (Second Year) 2025-26: Applications open from 20 September 2025. Eligibility: Passed Diploma in relevant branch with minimum 45% marks.",
        hindi: "डिप्लोमा लेटरल एंट्री (द्वितीय वर्ष) 2025-26: आवेदन 20 सितंबर 2025 से खुले। पात्रता: संबंधित शाखा में डिप्लोमा पास न्यूनतम 45% अंकों के साथ।"
      }
    },
    btech: {
      firstYear: {
        english: "B.Tech First Year (Non-Engineering) 2025-26: Applications start from 14 October 2025. Eligibility: 12th pass with PCM, minimum 45% marks. JEE Main score required.",
        hindi: "B.Tech प्रथम वर्ष (गैर-इंजीनियरिंग) 2025-26: आवेदन 14 अक्टूबर 2025 से शुरू। पात्रता: PCM के साथ 12वीं पास, न्यूनतम 45% अंक। JEE Main स्कोर आवश्यक।"
      }
    },
    generalPrompt: {
      english: "Which admission are you asking about? B.Tech or Diploma?",
      hindi: "आप किस प्रकार के प्रवेश के बारे में पूछ रहे हैं? B.Tech या Diploma?"
    }
  },
  results: {
    diploma_1st_sem: {
      english: "Diploma 1st Semester Result released on 12 September 2025.",
      hindi: "डिप्लोमा प्रथम सेमेस्टर का परिणाम 12 सितंबर 2025 को घोषित किया गया।"
    },
    diploma_2nd_sem: {
      english: "Diploma 2nd Semester Result released on 15 September 2025.",
      hindi: "डिप्लोमा द्वितीय सेमेस्टर का परिणाम 15 सितंबर 2025 को घोषित किया गया।"
    },
    btech_1st_sem: {
      english: "B.Tech 1st Semester Result published on 12 September 2025.",
      hindi: "B.Tech प्रथम सेमेस्टर का परिणाम 12 सितंबर 2025 को घोषित किया गया।"
    },
    revaluation_diploma: {
      english: "Diploma Revaluation results announced on 18 September 2025.",
      hindi: "डिप्लोमा पुनर्मूल्यांकन परिणाम 18 सितंबर 2025 को घोषित किया गया।"
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
    btech_first_year: {
      english: "B.Tech First Year: 12th pass with Physics, Chemistry, and Mathematics with minimum 45% marks.",
      hindi: "B.Tech प्रथम वर्ष: 12वीं पास भौतिकी, रसायन विज्ञान, और गणित के साथ न्यूनतम 45% अंकों के साथ।"
    }
  },
  exams: {
    diploma_3rd_sem: {
      english: "Diploma 3rd Semester exam scheduled to begin on 10 October 2025.",
      hindi: "डिप्लोमा तीसरे सेमेस्टर की परीक्षा 10 अक्टूबर 2025 को शुरू होने वाली है।"
    },
    btech_odd_sem: {
      english: "B.Tech Odd Semester Exams commencing from 25 November 2025.",
      hindi: "B.Tech विषम सेमेस्टर की परीक्षाएं 25 नवंबर 2025 से शुरू हो रही हैं।"
    },
    special_exam_form: {
      english: "Special Exam Form Filling: Last date is 5 October 2025.",
      hindi: "विशेष परीक्षा फॉर्म भरना: अंतिम तिथि 5 अक्टूबर 2025 है।"
    }
  },
  notices: {
    latest: {
      english: "Latest notices: Online form invited for College level I year and II year engineering diploma admissions from 11 to 14/08/2025. Provisional Merit List for Lateral Entry Admissions (Second Year Engineering Courses) 2025-26.",
      hindi: "नवीनतम सूचनाएं: कॉलेज स्तर के प्रथम वर्ष और द्वितीय वर्ष इंजीनियरिंग डिप्लोमा प्रवेश के लिए 11 से 14/08/2025 तक ऑनलाइन फॉर्म आमंत्रित।"
    }
  },
  greetings: {
    english: "Hello! I'm Alkama, your DTE Rajasthan student assistant. I can help with admissions, results, eligibility, exams, and notices. What would you like to know?",
    hindi: "नमस्ते! मैं अल्कामा हूं, आपका DTE राजस्थान छात्र सहायक। मैं प्रवेश, परिणाम, पात्रता, परीक्षा और नोटिस में मदद कर सकता हूं। आप क्या जानना चाहते हैं?"
  },
  refusal: {
    english: "I am sorry, this information is not available. Please visit the official DTE Rajasthan website.",
    hindi: "मुझे खेद है, यह जानकारी उपलब्ध नहीं है। कृपया आधिकारिक DTE राजस्थान वेबसाइट पर जाएं।"
  }
}

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

  // Enhanced context-aware intent detection
  const detectIntent = (text) => {
    const lower = text.toLowerCase()
    
    // Handle context follow-ups first
    if (lastIntent === 'awaiting_type') {
      if (/(diploma|polytechnic|डिप्लोमा|पॉलिटेक्निक)/.test(lower)) {
        if (contextType === 'admission') return 'diploma_admission'
        if (contextType === 'eligibility') return 'diploma_eligibility'
      }
      if (/(b\.?tech|engineering|इंजीनियरिंग)/.test(lower)) {
        if (contextType === 'admission') return 'btech_admission'
        if (contextType === 'eligibility') return 'btech_eligibility'
      }
    }
    
    // Regular intent detection
    if (/(hi|hello|hey|namaste|नमस्ते)/.test(lower)) return 'greeting'
    if (/(admission|प्रवेश|दाखिला|form|apply|आवेदन)/.test(lower)) return 'admission'
    if (/(result|marks|score|परिणाम|रिजल्ट)/.test(lower)) return 'result'
    if (/(eligibility|qualify|criteria|पात्रता|योग्यता)/.test(lower)) return 'eligibility'
    if (/(exam|test|परीक्षा)/.test(lower)) return 'exam'
    if (/(notice|notification|announcement|सूचना|नोटिस)/.test(lower)) return 'notice'
    return 'unknown'
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

      case 'diploma_admission':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.admissions.diploma.firstYear[lang], language: lang }

      case 'btech_admission':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.admissions.btech.firstYear[lang], language: lang }

      case 'eligibility':
        // Check if specific type mentioned
        if (/(diploma|polytechnic|डिप्लोमा|पॉलिटेक्निक)/.test(lower)) {
          setLastIntent(null)
          setContextType(null)
          if (/(lateral|लेटरल)/.test(lower)) {
            return { text: dteData.eligibility.diploma_lateral_entry[lang], language: lang }
          }
          return { text: dteData.eligibility.diploma_first_year[lang], language: lang }
        }
        if (/(b\.?tech|engineering|इंजीनियरिंग)/.test(lower)) {
          setLastIntent(null)
          setContextType(null)
          return { text: dteData.eligibility.btech_first_year[lang], language: lang }
        }
        // General eligibility - ask for clarification
        setLastIntent('awaiting_type')
        setContextType('eligibility')
        return { text: dteData.admissions.generalPrompt[lang], language: lang }

      case 'diploma_eligibility':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.eligibility.diploma_first_year[lang], language: lang }

      case 'btech_eligibility':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.eligibility.btech_first_year[lang], language: lang }

      case 'result':
        setLastIntent(null)
        setContextType(null)
        if (/(diploma.*1)/.test(lower)) return { text: dteData.results.diploma_1st_sem[lang], language: lang }
        if (/(diploma.*2)/.test(lower)) return { text: dteData.results.diploma_2nd_sem[lang], language: lang }
        if (/(b\.?tech.*1)/.test(lower)) return { text: dteData.results.btech_1st_sem[lang], language: lang }
        if (/(revaluation|पुनर्मूल्यांकन)/.test(lower)) return { text: dteData.results.revaluation_diploma[lang], language: lang }
        // General result query - show all
        return { 
          text: `${dteData.results.diploma_1st_sem[lang]}\n${dteData.results.diploma_2nd_sem[lang]}\n${dteData.results.btech_1st_sem[lang]}\n${dteData.results.revaluation_diploma[lang]}`, 
          language: lang 
        }

      case 'exam':
        setLastIntent(null)
        setContextType(null)
        return { 
          text: `${dteData.exams.diploma_3rd_sem[lang]}\n${dteData.exams.btech_odd_sem[lang]}\n${dteData.exams.special_exam_form[lang]}`, 
          language: lang 
        }

      case 'notice':
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.notices.latest[lang], language: lang }

      default:
        setLastIntent(null)
        setContextType(null)
        return { text: dteData.refusal[lang], language: lang }
    }
  }

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }
      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
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
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: botResponse.text, 
        sender: 'bot', 
        timestamp: new Date(), 
        language: botResponse.language 
      }])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return
    if (isListening) recognitionRef.current.stop()
    else recognitionRef.current.start()
    setIsListening(!isListening)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96" style={{ zIndex: 1000 }}>
      {isOpen ? (
        <div className="bg-white shadow-2xl rounded-xl p-4 flex flex-col h-[500px] border border-gray-200" style={{ zIndex: 1000 }}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-gray-800">Alkama - DTE Assistant</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto mb-2 bg-gray-50 rounded-lg p-2">
            {messages.map(msg => (
              <div key={msg.id} className={`my-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[75%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm border'}`}>
                  <div className="whitespace-pre-line text-sm">{msg.text}</div>
                </div>
              </div>
            ))}
            {isTyping && <div className="p-2 text-gray-500 text-sm">Alkama is typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              ref={inputRef}
              placeholder="Ask about admissions, results, eligibility..."
            />
            {speechSupported && (
              <button 
                onClick={toggleListening} 
                className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            <button 
              onClick={handleSend} 
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-400"
          style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 1000 }}
        >
          <BotMessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

export default Chatbot
