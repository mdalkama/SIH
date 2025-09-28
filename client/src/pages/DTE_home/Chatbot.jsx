import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, BotMessageSquare, Mic, MicOff } from 'lucide-react'

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyChXdRBgbrUAIBByXPIqbAThZ5E-t0-gv4'
const GEMINI_MODEL = 'gemini-2.0-flash-exp'
// Enhanced Saarthi System Prompt
const systemPrompt = `
You are "Saarthi", the official DTE Rajasthan Assistant.

Rules:
1. Always answer politely and directly using the official data provided.
2. Detect the language of the user's last message and reply in the same language.
3. If the user explicitly says "hindi me baat karo", "rajasthani me baat karo", or "english me baat karo", then switch to that language and continue until told otherwise.
4. Do not use emojis.
5. If the required data is not available, say: "Iske baare mein abhi jankari uplabdh nahi hai." (in the same language). Do not apologize or give fallback messages.

Data:
{
  "Admissions": {
    "Diploma": {
      "eligibility": "10th pass",
      "process": "Online application, merit or entrance based, followed by counseling",
      "start_date": "1st July 2025",
      "end_date": "31st July 2025"
    },
    "BTech": {
      "eligibility": "12th pass with PCM",
      "process": "Online application, merit or entrance based, followed by counseling",
      "start_date": "1st June 2025",
      "end_date": "30th June 2025"
    },
    "LateralEntry": {
      "eligibility": "Diploma or ITI pass",
      "process": "Direct 2nd-year admission after counseling",
      "start_date": "5th July 2025",
      "end_date": "20th July 2025"
    }
  },
  "Exams": {
    "Diploma": {
      "1stSem": "10th March 2025",
      "2ndSem": "5th April 2025",
      "3rdSem": "15th March 2025",
      "4thSem": "25th April 2025"
    }
  },
  "Results": {
    "Diploma": {
      "1stSem": "10th December 2025",
      "2ndSem": "20th December 2025",
      "3rdSem": "5th January 2026",
      "4thSem": "15th January 2026"
    }
  },
  "Notices": {
    "Latest": "Diploma 2nd semester exams will start from 5th April 2025."
  },
  "Officials": {
    "PM": "Narendra Modi",
    "ViceChancellor": "Prof. Rajeev Jain"
  }
}

Examples:

User: bhai diploma admission ka process batao
Bot: Diploma ke liye 10वीं पास होना ज़रूरी है. Admission ka process hai: Online application, merit ya entrance ke basis par, aur counseling ke baad confirm hota hai. Forms 1st July 2025 se 31st July 2025 tak bhare ja sakte hain.

User: mera 3rd semester ka exam kab hai
Bot: Diploma 3rd semester ka exam 15th March 2025 se hoga.

User: rajasthani me baat karo
Bot: Theek hai, ab main Rajasthani mein jawab dunga.

User: mharo 2nd semester ro result kab aavego
Bot: Diploma 2nd semester ro result 20th December 2025 ne aavego.

⚠️ IMPORTANT GUIDELINES:
- NEVER attempt to execute code or fetch live data
- NEVER use tool_code or any programming functions
- Use the provided data to answer queries directly
- Be helpful and professional while maintaining accuracy
- Answer in the user's preferred language
- Do not use emojis in responses
`

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! Hope you are doing well  I am Saarthi, the official DTE Rajasthan Assistant. I can communicate with you in Hindi, English, Rajasthani,and other regional languages.How may i assist you?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [conversationLanguage, setConversationLanguage] = useState(null) // Track conversation language
  const [conversationHistory, setConversationHistory] = useState([]) // Store conversation context
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Enhanced language detection with comprehensive Indian languages
  const detectLanguage = (text) => {
    const lower = text.toLowerCase()
    
    // Language switch commands
    if (/(hindi mein|hindi me|हिंदी में|talk in hindi)/i.test(lower)) return 'hindi'
    if (/(english mein|english me|अंग्रेजी में|talk in english)/i.test(lower)) return 'english'
    if (/(rajasthani mein|rajasthani me|राजस्थानी में|talk in rajasthani)/i.test(lower)) return 'rajasthani'
    if (/(hinglish mein|hinglish me|हिंग्लिश में|talk in hinglish)/i.test(lower)) return 'hinglish'
    if (/(punjabi mein|punjabi me|पंजाबी में|talk in punjabi)/i.test(lower)) return 'punjabi'
    if (/(gujarati mein|gujarati me|गुजराती में|talk in gujarati)/i.test(lower)) return 'gujarati'
    if (/(bengali mein|bengali me|बंगाली में|talk in bengali)/i.test(lower)) return 'bengali'
    if (/(tamil mein|tamil me|तमिल में|talk in tamil)/i.test(lower)) return 'tamil'
    if (/(telugu mein|telugu me|तेलुगु में|talk in telugu)/i.test(lower)) return 'telugu'
    if (/(marathi mein|marathi me|मराठी में|talk in marathi)/i.test(lower)) return 'marathi'
    if (/(kannada mein|kannada me|कन्नड़ में|talk in kannada)/i.test(lower)) return 'kannada'
    if (/(urdu mein|urdu me|उर्दू में|talk in urdu)/i.test(lower)) return 'urdu'
    
    // Rajasthani specific patterns
    const rajasthaniPatterns = [
      /राम राम/, /कांई/, /थानै/, /म्हैं/, /घणो/, /को/, /सूं/, /होई/, /हाल/, /धन्यवाद/,
      /ram ram/, /kaai/, /thane/, /mhain/, /ghano/, /hoi/, /dhanyawad/
    ]
    
    // Check for Rajasthani patterns
    for (const pattern of rajasthaniPatterns) {
      if (pattern.test(lower)) {
        return 'rajasthani'
      }
    }
    
    // Punjabi patterns
    const punjabiPatterns = [/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/, /ਕਿਵੇਂ/, /ਹਾਲ/, /sat sri akal/, /kiven/, /tussi/, /ki haal/, /changa/]
    for (const pattern of punjabiPatterns) {
      if (pattern.test(lower)) return 'punjabi'
    }
    
    // Gujarati patterns
    const gujaratiPatterns = [/નમસ્તે/, /કેમ છો/, /kem cho/, /maja ma/, /su che/]
    for (const pattern of gujaratiPatterns) {
      if (pattern.test(lower)) return 'gujarati'
    }
    
    // Bengali patterns
    const bengaliPatterns = [/নমস্কার/, /কেমন আছেন/, /namaskar/, /kemon acho/, /bhalo/]
    for (const pattern of bengaliPatterns) {
      if (pattern.test(lower)) return 'bengali'
    }
    
    // Tamil patterns
    const tamilPatterns = [/வணக்கம்/, /எப்படி இருக்கீங்க/, /vanakkam/, /eppadi irukinga/, /nalla/]
    for (const pattern of tamilPatterns) {
      if (pattern.test(lower)) return 'tamil'
    }
    
    // Telugu patterns
    const teluguPatterns = [/నమస్కారం/, /ఎలా ఉన్నారు/, /namaskaram/, /ela unnaru/, /bagundi/]
    for (const pattern of teluguPatterns) {
      if (pattern.test(lower)) return 'telugu'
    }
    
    // Marathi patterns
    const marathiPatterns = [/नमस्कार/, /कसे आहात/, /namaskar/, /kase ahat/, /bara/]
    for (const pattern of marathiPatterns) {
      if (pattern.test(lower)) return 'marathi'
    }
    
    // Kannada patterns
    const kannadaPatterns = [/ನಮಸ್ಕಾರ/, /ಹೇಗಿದ್ದೀರಿ/, /namaskara/, /hegiddiri/, /chennagirutte/]
    for (const pattern of kannadaPatterns) {
      if (pattern.test(lower)) return 'kannada'
    }
    
    // Urdu patterns
    const urduPatterns = [/السلام علیکم/, /آپ کیسے ہیں/, /assalam alaikum/, /aap kaise hain/, /theek/]
    for (const pattern of urduPatterns) {
      if (pattern.test(lower)) return 'urdu'
    }
    
    // Check for pure Hindi (mostly Devanagari script)
    const hindiPattern = /[\u0900-\u097F]/
    const englishPattern = /[a-zA-Z]/
    
    if (hindiPattern.test(text) && !englishPattern.test(text)) {
      return 'hindi'
    }
    
    // Check for Hinglish (mix of Hindi and English)
    if (hindiPattern.test(text) && englishPattern.test(text)) {
      return 'hinglish'
    }
    
    // Check for common Hinglish words in Roman script
    const hinglishWords = /\b(kya|hai|hoon|kaise|kab|kahan|kyun|main|aap|tum|kar|karo|chahiye|batao|dekho|samjha|theek|accha|nahi|haan|ji|bhai|yaar|dost|bro|arre|acha|sahi|bilkul)\b/
    if (hinglishWords.test(lower)) {
      return 'hinglish'
    }
    
    // Default to English
    return 'english'
  }

  // Gemini API call function with conversation context and retry logic
  const callGemini = async (userMessage, retryCount = 0) => {
    try {
      // Build conversation context
      const recentHistory = conversationHistory.slice(-6) // Last 6 messages for context
      const contextString = recentHistory.length > 0 
        ? `\n\nPrevious conversation context:\n${recentHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}\n\n`
        : '\n\n'
      
      // Add language persistence instruction
      const languageInstruction = conversationLanguage 
        ? `\n\nIMPORTANT: Continue this conversation in ${conversationLanguage} language only. The user has chosen ${conversationLanguage} as their preferred language.\n\n`
        : '\n\n'

      // Build the complete prompt
      const fullPrompt = `${systemPrompt}${languageInstruction}${contextString}Current User Message: ${userMessage}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: fullPrompt }]
            }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 600
            }
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error("Gemini API Error:", error)
        
        // Handle rate limiting (429) with retry
        if (response.status === 429 && retryCount < 2) {
          console.log(`Rate limited, retrying in ${(retryCount + 1) * 2} seconds...`)
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000))
          return callGemini(userMessage, retryCount + 1)
        }
        
        // Handle different error types
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a few moments.")
        } else if (response.status === 401) {
          throw new Error("API key is invalid or expired.")
        } else if (response.status === 403) {
          throw new Error("Access forbidden. Please check your API permissions.")
        } else if (response.status === 404) {
          throw new Error("Model not found. Please check the model name.")
        } else {
          throw new Error(`API Error: ${response.status}`)
        }
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
    } catch (err) {
      console.error("Gemini API failed:", err)
      throw err
    }
  }

  // Generate response using Gemini API with language persistence
  const generateResponse = async (message) => {
    const detectedLang = detectLanguage(message)
    
    // Set conversation language if not set or if user explicitly requests language change
    if (!conversationLanguage || /(hindi mein|english mein|rajasthani mein|hinglish mein|talk in)/i.test(message.toLowerCase())) {
      setConversationLanguage(detectedLang)
    }
    
    const apiResponse = await callGemini(message)
    return { text: apiResponse, language: conversationLanguage || detectedLang, source: 'api' }
  }

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-IN'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        const detectedLang = detectLanguage(transcript)
        
        // Set conversation language if not set
        if (!conversationLanguage) {
          setConversationLanguage(detectedLang)
        }
        
        // Auto-switch language for next recognition based on conversation language
        const currentLang = conversationLanguage || detectedLang
        if (currentLang === 'english') {
          recognitionRef.current.lang = 'en-IN'
        } else if (currentLang === 'hindi' || currentLang === 'hinglish' || currentLang === 'rajasthani' || currentLang === 'urdu') {
          recognitionRef.current.lang = 'hi-IN'
        } else if (currentLang === 'punjabi') {
          recognitionRef.current.lang = 'hi-IN' // Use Hindi recognition for Punjabi
        } else if (currentLang === 'gujarati') {
          recognitionRef.current.lang = 'gu-IN' // Gujarati recognition
        } else if (currentLang === 'bengali') {
          recognitionRef.current.lang = 'bn-IN' // Bengali recognition
        } else if (currentLang === 'tamil') {
          recognitionRef.current.lang = 'ta-IN' // Tamil recognition
        } else if (currentLang === 'telugu') {
          recognitionRef.current.lang = 'te-IN' // Telugu recognition
        } else if (currentLang === 'marathi') {
          recognitionRef.current.lang = 'mr-IN' // Marathi recognition
        } else if (currentLang === 'kannada') {
          recognitionRef.current.lang = 'kn-IN' // Kannada recognition
        } else {
          recognitionRef.current.lang = 'en-IN'
        }
        
        setInputMessage(prev => prev + transcript)
        setIsListening(false)
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error)
        setIsListening(false)
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
    }
  }, [])

  // Handle sending message with conversation history
  const handleSend = async () => {
    if (!inputMessage.trim()) return
    
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      language: detectLanguage(inputMessage)
    }
    
    // Update conversation history
    setConversationHistory(prev => [...prev, { sender: 'user', text: inputMessage }])
    
    setMessages([...messages, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const botResponse = await generateResponse(userMessage.text)
      
      // Calculate realistic typing delay (more human-like)
      const responseLength = botResponse.text.length
      const baseDelay = 1200 // Slightly longer base delay
      const typingSpeed = 40 // Slower typing for more natural feel
      const calculatedDelay = Math.min(baseDelay + (responseLength / typingSpeed) * 1000, 5000) // Max 5 seconds
      
      setTimeout(() => {
        const botMessage = { 
          id: messages.length + 2, 
          text: botResponse.text, 
          sender: 'bot', 
          timestamp: new Date(), 
          language: botResponse.language,
          source: botResponse.source
        }
        
        // Update conversation history with bot response
        setConversationHistory(prev => [...prev, { sender: 'bot', text: botResponse.text }])
        
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, calculatedDelay)
      
    } catch (error) {
      console.error('Error generating response:', error)
      
      setTimeout(() => {
        const currentLang = conversationLanguage || 'english'
        
        // Get user-friendly error message
        let errorText = error.message
        
        // Handle specific error types with multilingual messages
        if (error.message.includes("Rate limit exceeded")) {
          errorText = currentLang === 'hindi' 
            ? "API की दर सीमा पार हो गई है। कृपया कुछ देर बाद पुनः प्रयास करें।"
            : currentLang === 'hinglish'
            ? "Rate limit exceed ho gaya hai. Thoda wait karke try karo."
            : currentLang === 'rajasthani'
            ? "API की limit पूरी हो गई है। थोड़ी देर बाद try करो।"
            : "Rate limit exceeded. Please try again in a few moments."
        } else if (error.message.includes("API key is invalid")) {
          errorText = currentLang === 'hindi' 
            ? "API key अमान्य है। कृपया व्यवस्थापक से संपर्क करें।"
            : currentLang === 'hinglish'
            ? "API key invalid hai. Admin se contact karo."
            : currentLang === 'rajasthani'
            ? "API key गलत है। Admin सूं संपर्क करो।"
            : "API key is invalid. Please contact administrator."
        } else {
          errorText = currentLang === 'hindi' 
            ? "मुझे खेद है, कुछ तकनीकी समस्या आ गई है। कृपया पुनः प्रयास करें।"
            : currentLang === 'hinglish'
            ? "Sorry, kuch technical issue aa gaya hai. Please try again."
            : currentLang === 'rajasthani'
            ? "माफ करजो, कुछ technical problem आ गई है। कृपया फिर से try करो।"
            : "I apologize for the inconvenience. Please try again."
        }
          
        const errorMessage = {
          id: messages.length + 2,
          text: errorText,
          sender: 'bot',
          timestamp: new Date(),
          language: currentLang
        }
        setMessages(prev => [...prev, errorMessage])
        setIsTyping(false)
      }, 1800) // Slightly longer delay for error messages
    }
  }

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await handleSend()
    }
  }

  const handleSendMessage = async () => {
    await handleSend()
  }

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return
    
    try {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      } else {
        recognitionRef.current.start()
        setIsListening(true)
      }
    } catch (error) {
      console.log('Speech recognition toggle error:', error)
      setIsListening(false)
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 300)
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
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-xs opacity-60">
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
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
      <style>{`
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