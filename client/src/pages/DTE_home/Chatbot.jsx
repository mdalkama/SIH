import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, BotMessageSquare, Mic, MicOff } from 'lucide-react'

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyD78-OYYQV2sDpA4XGwCw0vr2poByHvM8E'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

// Enhanced Saarthi System Prompt
const systemPrompt = `
You are Saarthi – the official student assistant for DTE Rajasthan.

Guidelines:
1. Always reply naturally and professionally in the same language as the user (English, Hindi, Hinglish, Rajasthani).
2. Maintain a human-like assistant tone. Do not add any prefixes like "KB" or "FB". Do not use emojis or unnecessary tags.
3. Coverage:
   - Admissions (eligibility, dates, counseling, process).
   - Exams (ask "Which semester?" → give dates).
   - Results (ask "Which semester?" → give release info).
   - Notices & News (latest updates + official site link).
   - Eligibility criteria (factual, clear).
   - All data should be accurate: hardcoded + API factual (from DTE site if available).
4. General questions (outside DTE Rajasthan): 
   - Answer professionally using Gemini's general knowledge.
   - Example: If user says "Ka haal hai?" → Reply politely in same language: 
     - Hindi: "मैं ठीक हूं, धन्यवाद। आप कैसे हैं?"  
     - Rajasthani: "म्हैं बधिया हूं, थारा हाल चाल?"  
     - Hinglish: "Main theek hoon, batao tum kaise ho?"  
     - English: "I am doing well, thank you. How are you?"
5. Greetings:
   - Respond politely in same style without repeating the full intro every time.
   - Example: 
     - First greeting: "Hello, I am Saarthi, the official DTE Rajasthan Assistant. How may I assist you today?"
     - Next greetings: Short version like "Hello! How are you?".
6. Fallback:
   - Never say "not available".
   - Instead guide: "For more details, kindly check official DTE Rajasthan website: https://dte.rajasthan.gov.in".
7. Your answers must be clear, fast, factual, professional, and free from KB/FB/extra tokens.

Goal: A realistic, friendly, professional chatbot that covers DTE Rajasthan data but also handles casual conversation gracefully.
`

// Complete DTE Rajasthan Hardcoded Dataset (Fallback)
const dteData = {
  admissions: {
    diploma_first_year: {
      english: "Diploma First Year (Engineering) Admission 2025-26: Application Dates: 11–14 August 2025 (11:00 AM onwards). Apply via official portal: www.dap2025.in. Counseling: Centralized online counseling after registration. Document verification: Online upload + original verification at institute reporting.",
      hindi: "डिप्लोमा प्रथम वर्ष (इंजीनियरिंग) प्रवेश 2025-26: आवेदन तिथियां: 11-14 अगस्त 2025 (सुबह 11:00 बजे से)। आधिकारिक पोर्टल के माध्यम से आवेदन करें: www.dap2025.in। काउंसलिंग: पंजीकरण के बाद केंद्रीयकृत ऑनलाइन काउंसलिंग। दस्तावेज़ सत्यापन: ऑनलाइन अपलोड + संस्थान रिपोर्टिंग पर मूल सत्यापन।",
      rajasthani: "डिप्लोमा पहलो साल (इंजीनियरिंग) दाखिलो 2025-26: आवेदन की तारीख: 11-14 अगस्त 2025 (सुबह 11:00 बजे सूं)। official portal सूं आवेदन करो: www.dap2025.in। काउंसलिंग: रजिस्ट्रेशन को बाद केंद्रीयकृत ऑनलाइन काउंसलिंग। कागजात की जांच: ऑनलाइन अपलोड + संस्थान में रिपोर्टिंग पर असली कागजात की जांच।"
    },
    diploma_lateral_entry: {
      english: "Diploma Lateral Entry (Direct 2nd Year) Admission 2025: Application Dates: 20–25 August 2025. Eligibility: 12th Science (PCM) OR ITI (2 years). Counseling: Online centralized.",
      hindi: "डिप्लोमा लेटरल एंट्री (प्रत्यक्ष द्वितीय वर्ष) प्रवेश 2025: आवेदन तिथियां: 20-25 अगस्त 2025। पात्रता: 12वीं विज्ञान (PCM) या ITI (2 वर्ष)। काउंसलिंग: ऑनलाइन केंद्रीयकृत।",
      rajasthani: "डिप्लोमा लेटरल एंट्री (सीधो दूसरो साल) दाखिलो 2025: आवेदन की तारीख: 20-25 अगस्त 2025। योग्यता: 12वीं साइंस (PCM) या ITI (2 साल)। काउंसलिंग: ऑनलाइन केंद्रीयकृत।"
    },
  },
  results: {
    diploma: {
      "1": {
        english: "Diploma 1st Semester Result: Released 12 September 2025.",
        hindi: "डिप्लोमा प्रथम सेमेस्टर परिणाम: 12 सितंबर 2025 को जारी किया गया।"
      },
      "2": {
        english: "Diploma 2nd Semester Result: Released 15 September 2025.",
        hindi: "डिप्लोमा द्वितीय सेमेस्टर परिणाम: 15 सितंबर 2025 को जारी किया गया।"
      },
      "3": {
        english: "Diploma 3rd Semester Result: Released 18 September 2025.",
        hindi: "डिप्लोमा तृतीय सेमेस्टर परिणाम: 18 सितंबर 2025 को जारी किया गया।"
      },
      "4": {
        english: "Diploma 4th Semester Result: Released 22 September 2025.",
        hindi: "डिप्लोमा चतुर्थ सेमेस्टर परिणाम: 22 सितंबर 2025 को जारी किया गया।"
      },
      "5": {
        english: "Diploma 5th Semester Result: Released 25 September 2025.",
        hindi: "डिप्लोमा पंचम सेमेस्टर परिणाम: 25 सितंबर 2025 को जारी किया गया।"
      },
      "6": {
        english: "Diploma 6th Semester Result: Released 28 September 2025.",
        hindi: "डिप्लोमा षष्ठ सेमेस्टर परिणाम: 28 सितंबर 2025 को जारी किया गया।"
      },
      revaluation: {
        english: "Diploma Revaluation Result: Announced 30 September 2025.",
        hindi: "डिप्लोमा पुनर्मूल्यांकन परिणाम: 30 सितंबर 2025 को घोषित किया गया।"
      }
    },
    semesterPrompt: {
      english: "Which semester result are you asking about?",
      hindi: "आप किस सेमेस्टर के परिणाम के बारे में पूछ रहे हैं?"
    }
  },
  eligibility: {
    diploma_first_year: {
      english: "Diploma First Year: Must have passed Class 10th with Science & Math. Minimum marks: 35% in qualifying exam.",
      hindi: "डिप्लोमा प्रथम वर्ष: 10वीं विज्ञान और गणित के साथ उत्तीर्ण होना चाहिए। न्यूनतम अंक: योग्यता परीक्षा में 35%।",
      rajasthani: "डिप्लोमा पहलो साल: 10वीं साइंस अर मैथ्स को साथ पास होणो चाहिए। कम सूं कम अंक: योग्यता परीक्षा में 35%।"
    },
    diploma_lateral_entry: {
      english: "Diploma Lateral Entry: Must have passed Class 12th (PCM) OR ITI (2 years). Minimum marks: 35% in qualifying exam.",
      hindi: "डिप्लोमा लेटरल एंट्री: 12वीं (PCM) या ITI (2 वर्ष) उत्तीर्ण होना चाहिए। न्यूनतम अंक: योग्यता परीक्षा में 35%।",
      rajasthani: "डिप्लोमा लेटरल एंट्री: 12वीं (PCM) या ITI (2 साल) पास होणो चाहिए। कम सूं कम अंक: योग्यता परीक्षा में 35%।"
    },
  },
  exams: {
    diploma: {
      "1": {
        english: "Diploma 1st Semester Exam: Starts 1 October 2025.",
        hindi: "डिप्लोमा प्रथम सेमेस्टर परीक्षा: 1 अक्टूबर 2025 को शुरू होती है।"
      },
      "2": {
        english: "Diploma 2nd Semester Exam: Starts 5 October 2025.",
        hindi: "डिप्लोमा द्वितीय सेमेस्टर परीक्षा: 5 अक्टूबर 2025 को शुरू होती है।"
      },
      "3": {
        english: "Diploma 3rd Semester Exam: Starts 10 October 2025.",
        hindi: "डिप्लोमा तृतीय सेमेस्टर परीक्षा: 10 अक्टूबर 2025 को शुरू होती है।"
      },
      "4": {
        english: "Diploma 4th Semester Exam: Starts 15 October 2025.",
        hindi: "डिप्लोमा चतुर्थ सेमेस्टर परीक्षा: 15 अक्टूबर 2025 को शुरू होती है।"
      },
      "5": {
        english: "Diploma 5th Semester Exam: Starts 20 October 2025.",
        hindi: "डिप्लोमा पंचम सेमेस्टर परीक्षा: 20 अक्टूबर 2025 को शुरू होती है।"
      },
      "6": {
        english: "Diploma 6th Semester Exam: Starts 25 October 2025.",
        hindi: "डिप्लोमा षष्ठ सेमेस्टर परीक्षा: 25 अक्टूबर 2025 को शुरू होती है।"
      },
      special: {
        english: "Special Exam Form Filling: Last date 5 October 2025.",
        hindi: "विशेष परीक्षा फॉर्म भरना: अंतिम तिथि 5 अक्टूबर 2025।"
      }
    },
    semesterPrompt: {
      english: "Which semester exam are you asking about?",
      hindi: "आप किस सेमेस्टर की परीक्षा के बारे में पूछ रहे हैं?"
    }
  },
  notices: {
    latest: {
      english: "Latest Notice (10 Sept 2025): Diploma 1st & 2nd semester results released. Latest Notice (15 Sept 2025): Diploma revaluation forms open till 22 Sept 2025. Latest Notice (20 Sept 2025): Exam timetable for all Diploma semesters published. Latest Notice (25 Sept 2025): Counseling round 2 starts on 27 Sept 2025.",
      hindi: "नवीनतम सूचना (10 सितंबर 2025): डिप्लोमा प्रथम और द्वितीय सेमेस्टर परिणाम जारी किए गए। नवीनतम सूचना (15 सितंबर 2025): डिप्लोमा पुनर्मूल्यांकन फॉर्म 22 सितंबर 2025 तक खुले हैं। नवीनतम सूचना (20 सितंबर 2025): सभी डिप्लोमा सेमेस्टरों के लिए परीक्षा समय सारणी प्रकाशित। नवीनतम सूचना (25 सितंबर 2025): काउंसलिंग दौर 2, 27 सितंबर 2025 को शुरू होगी।"
    }
  },
  greetings: {
    english: "Hello! I am Saarthi - your DTE Rajasthan student assistant. I can help you with admissions, results, exams, notices, and eligibility.",
    hindi: "नमस्ते! मैं सारथी हूं - आपका DTE राजस्थान छात्र सहायक। मैं आपको प्रवेश, परिणाम, परीक्षा, सूचनाएं और पात्रता में मदद कर सकता हूं।",
    rajasthani: "राम राम जी! म्हैं सारथी हूं - थारो DTE राजस्थान को छात्र सहायक। म्हैं थानै admission, result, exam, notice अर eligibility में मदद कर सकूं हूं।"
  },
  howAreYou: {
    english: "I am fine, thank you! How can I assist you today?",
    hindi: "मैं ठीक हूं, धन्यवाद! आज मैं आपकी कैसे मदद कर सकता हूं?",
    rajasthani: "म्हैं ठीक हूं, घणो धन्यवाद! आज म्हैं थारी कांई मदद कर सकूं हूं?"
  },
  refusal: {
    english: "I can only help with DTE Rajasthan Diploma admissions, results, exams, eligibility, and notices. Please visit the official DTE Rajasthan website for more.",
    hindi: "मैं केवल DTE राजस्थान डिप्लोमा प्रवेश, परिणाम, परीक्षा, पात्रता और सूचनाओं में मदद कर सकता हूं। कृपया अधिक जानकारी के लिए आधिकारिक DTE राजस्थान वेबसाइट पर जाएं।",
    rajasthani: "म्हैं सिर्फ DTE राजस्थान डिप्लोमा admission, result, exam, eligibility अर notice में मदद कर सकूं हूं। और जाणकारी खातर official DTE राजस्थान website देखो।"
  },
  semesterNotFound: {
    english: "Sorry, this semester information is not available. Please check the official DTE Rajasthan website.",
    hindi: "खेद है, इस सेमेस्टर की जानकारी उपलब्ध नहीं है। कृपया आधिकारिक DTE राजस्थान वेबसाइट देखें।",
    rajasthani: "माफ करो, इस semester की जाणकारी उपलब्ध कोनी है। कृपया official DTE राजस्थान website देखो।"
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
  const [persistentLanguage, setPersistentLanguage] = useState(null) // Persistent language preference
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Check for explicit language switching requests
  const checkLanguageSwitch = (text) => {
    const lower = text.toLowerCase()
    
    // English language requests
    if (/(reply in english|english me|english mein|speak in english|talk in english|english me bolo|english me reply|english me jawab)/.test(lower)) {
      return 'english'
    }
    
    // Hindi language requests
    if (/(reply in hindi|hindi me|hindi mein|speak in hindi|talk in hindi|hindi me bolo|hindi me reply|hindi me jawab|हिंदी में|हिन्दी में)/.test(lower)) {
      return 'hindi'
    }
    
    // Rajasthani language requests
    if (/(reply in rajasthani|rajasthani me|rajasthani mein|speak in rajasthani|talk in rajasthani|rajasthani me bolo|rajasthani me reply|rajasthani me jawab|राजस्थानी में)/.test(lower)) {
      return 'rajasthani'
    }
    
    // Hinglish language requests
    if (/(reply in hinglish|hinglish me|hinglish mein|speak in hinglish|talk in hinglish|hinglish me bolo|hinglish me reply|hinglish me jawab)/.test(lower)) {
      return 'hinglish'
    }
    
    return null
  }

  // Enhanced language detection with persistent language support
  const detectLanguage = (text) => {
    // First check if user wants to switch language
    const languageSwitch = checkLanguageSwitch(text)
    if (languageSwitch) {
      setPersistentLanguage(languageSwitch)
      return languageSwitch
    }
    
    // If persistent language is set, use it
    if (persistentLanguage) {
      return persistentLanguage
    }
    
    // Otherwise, auto-detect language
    const lower = text.toLowerCase()
    
    // Rajasthani specific patterns and words
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
    const hinglishWords = /\b(kya|hai|hoon|kaise|kab|kahan|kyun|main|aap|tum|kar|karo|chahiye|batao|dekho|samjha|theek|accha|nahi|haan|ji|bhai)\b/
    if (hinglishWords.test(lower)) {
      return 'hinglish'
    }
    
    // Default to English
    return 'english'
  }


  // Simplified intent detection for Diploma only
  const detectIntent = (text) => {
    const lower = text.toLowerCase()
    
    // Check for language switching requests first
    const languageSwitch = checkLanguageSwitch(text)
    if (languageSwitch) {
      return 'language_switch'
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
    
    // Enhanced greeting detection - only simple greetings
    if (/^(hi|hello|hey|hii|helo|namaste|नमस्ते|ram ram|राम राम|हाय|हैलो)$/.test(lower.trim())) return 'greeting'
    
    // Enhanced casual conversation detection
    if (/(how are you|कैसे हो|how are you doing|कैसे हो तुम|कांई हाल|kaai haal|kya haal|क्या हाल|थारो हाल|tharo haal|kaise ho|कैसे हैं|kya haal hai|क्या हाल है)/.test(lower)) return 'how_are_you'
    
    // Goodbye detection
    if (/(bye|goodbye|alvida|अलविदा|tata|टाटा|see you|मिलते हैं)/.test(lower)) return 'goodbye'
    
    // DTE-specific queries - prioritize hardcoded data for exam/result
    if (/(admission|प्रवेश|दाखिला|form|apply|आवेदन)/.test(lower)) {
      if (/(kab start|when start|कब शुरू|start date|शुरुआत)/.test(lower)) return 'admission_timing'
      return 'admission'
    }
    if (/(result|marks|score|परिणाम|रिजल्ट)/.test(lower)) return 'result'
    if (/(exam|test|परीक्षा)/.test(lower)) return 'exam'
    if (/(eligibility|qualify|criteria|पात्रता|योग्यता)/.test(lower)) return 'eligibility'
    if (/(notice|notification|announcement|सूचना|नोटिस)/.test(lower)) return 'notice'
    if (/(news|koi news|कोई news|समाचार)/.test(lower)) return 'news'
    
    // Check for B.Tech mentions and restrict
    if (/(b\.?tech|engineering|इंजीनियरिंग)/.test(lower) && /(admission|प्रवेश|दाखिला)/.test(lower)) {
      return 'btech_restriction'
    }
    
    // Everything else goes to API for general knowledge
    return 'general_query'
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

  // Gemini API call function with enhanced error handling
  const callGemini = async (userMessage) => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser: ${userMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Gemini API Error: ${response.status}`, errorData)
        
        // Handle specific error cases
        if (response.status === 429) {
          console.log('Rate limit exceeded, falling back to hardcoded responses')
        } else if (response.status === 401) {
          console.log('API key invalid, falling back to hardcoded responses')
        } else if (response.status >= 500) {
          console.log('Gemini server error, falling back to hardcoded responses')
        }
        
        return null // Trigger fallback
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text.trim()
      } else {
        console.error('Unexpected API response format:', data)
        return null
      }
    } catch (error) {
      console.error('Gemini API Network Error:', error)
      return null // Return null to trigger fallback
    }
  }

  // Enhanced response generation with smart routing: DTE queries → Dataset, General queries → API
  const generateResponse = async (message) => {
    const lang = detectLanguage(message)
    const intent = detectIntent(message)
    const lower = message.toLowerCase()

    // Check if this is a DTE-related query - ALWAYS use hardcoded data for exam/result
    const isDTERelated = [
      'greeting', 'how_are_you', 'goodbye', 'admission', 'admission_timing', 
      'eligibility', 'result', 'exam', 'notice', 'news', 'language_switch',
      'diploma_result_1', 'diploma_result_2', 'diploma_result_3', 'diploma_result_4', 'diploma_result_5', 'diploma_result_6',
      'diploma_exam_1', 'diploma_exam_2', 'diploma_exam_3', 'diploma_exam_4', 'diploma_exam_5', 'diploma_exam_6',
      'diploma_result_revaluation', 'btech_restriction'
    ].includes(intent)

    // FIRST: For DTE-related queries, ALWAYS use hardcoded dataset (especially exam/result)
    if (isDTERelated) {
      const datasetResponse = getDatasetResponse(intent, lang, lower)
      if (datasetResponse) {
        return { text: datasetResponse.text, language: lang, source: 'dataset' }
      }
    }

    // SECOND: For general queries, use Gemini API
    if (intent === 'general_query') {
      try {
        const apiResponse = await callGemini(message)
        if (apiResponse) {
          return { text: apiResponse, language: lang, source: 'api' }
        }
      } catch (error) {
        console.log('API failed, using fallback')
      }
    }

    // THIRD: Final fallback message
    const fallbackMsg = lang === 'hindi' 
      ? "मुझे खेद है, मैं समझ नहीं पाया। कृपया Diploma प्रवेश, परीक्षा, परिणाम, सूचनाएं, या पात्रता के बारे में पूछें।"
      : lang === 'rajasthani'
      ? "माफ करो, म्हैं समझ नहीं पायो। कृपया Diploma प्रवेश, परीक्षा, परिणाम, सूचनाएं, या पात्रता के बारे में पूछो।"
      : "I am sorry, I did not understand. Please ask about Diploma Admissions, Exams, Results, Notices, or Eligibility."
    
    return { text: fallbackMsg, language: lang, source: 'fallback' }
  }

  // Function to get response from hardcoded dataset
  const getDatasetResponse = (intent, lang, lower) => {

    switch(intent) {
      case 'language_switch': {
        setLastIntent(null)
        setContextType(null)
        const switchText = lang === 'english'
          ? "Great! I'll continue in English. How can I help you with DTE Rajasthan information?"
          : lang === 'hindi'
          ? "बहुत अच्छा! अब मैं हिंदी में बात करूंगा। DTE राजस्थान की जानकारी में मैं आपकी कैसे मदद कर सकता हूं?"
          : lang === 'hinglish'
          ? "Thik hai! Ab main Hinglish me baat karunga. DTE Rajasthan ke Admission, Exams, Results ya Notices – kis topic pe help chahiye?"
          : "राम राम! अब म्हैं राजस्थानी में बात करूंगा। DTE राजस्थान रो आधिकारिक सहायक हूं। थारी मदद खातर हाजिर हूं।"
        return { text: switchText }
      }
      case 'greeting': {
        setLastIntent(null)
        setContextType(null)
        const greetingText = lang === 'english' 
          ? "Hello! I am Saarthi, the official DTE Rajasthan student assistant. I can help you with Admissions, Exams, Results, Notices, and Eligibility. How may I assist you today?"
          : lang === 'hindi'
          ? "नमस्ते! मैं सारथी हूँ, DTE राजस्थान का आधिकारिक छात्र सहायक। मैं आपको प्रवेश, परीक्षा, परिणाम, सूचनाएँ और पात्रता के बारे में मदद कर सकता हूँ। आप किसमें सहायता चाहते हैं?"
          : lang === 'hinglish'
          ? "Hello! Main Saarthi hoon, DTE Rajasthan ka official student assistant. Main aapko Admissions, Exams, Results, Notices aur Eligibility mein help kar sakta hoon. Aap kya jaanna chahte hain?"
          : "राम राम! म्हैं सारथी हूं, DTE राजस्थान रो आधिकारिक सहायक। थारी मदद खातर हाजिर हूं। थानै कांई जाणकारी चाहिए?"
        return { text: greetingText }
      }

      case 'how_are_you': {
        setLastIntent(null)
        setContextType(null)
        const howAreYouText = lang === 'english'
          ? "I am functioning well, thank you. How can I assist you today?"
          : lang === 'hindi'
          ? "मैं ठीक हूँ, धन्यवाद। आज मैं आपकी कैसे मदद कर सकता हूं?"
          : lang === 'hinglish'
          ? "Main theek hoon, thank you! Aap batao main aapki kaise help kar sakta hoon?"
          : "म्हैं ठीक हूं, घणो धन्यवाद। आज म्हैं थारी कैसे मदद कर सकूं हूं?"
        return { text: howAreYouText }
      }

      case 'goodbye': {
        setLastIntent(null)
        setContextType(null)
        const goodbyeText = lang === 'english'
          ? "Thank you for using DTE Rajasthan services. Have a great day!"
          : lang === 'hindi'
          ? "DTE राजस्थान सेवाओं का उपयोग करने के लिए धन्यवाद। आपका दिन शुभ हो!"
          : "DTE राजस्थान सेवाओं का उपयोग करने के लिए धन्यवाद। थारो दिन शुभ हो!"
        return { text: goodbyeText }
      }

      case 'admission': {
        setLastIntent('awaiting_admission_type')
        setContextType('admission')
        const admissionPrompt = lang === 'english'
          ? "Diploma First Year Admission 2025-26: Application Dates: 11–14 August 2025. Apply via www.dap2025.in. Counseling through centralized online process. Document verification online + at institute reporting."
          : lang === 'hindi'
          ? "डिप्लोमा प्रथम वर्ष प्रवेश 2025-26: आवेदन तिथियां: 11-14 अगस्त 2025। www.dap2025.in के माध्यम से आवेदन करें। केंद्रीयकृत ऑनलाइन प्रक्रिया के माध्यम से काउंसलिंग। दस्तावेज़ सत्यापन ऑनलाइन + संस्थान रिपोर्टिंग पर।"
          : lang === 'hinglish'
          ? "Diploma First Year Admission 2025-26: Application dates 11-14 August 2025. www.dap2025.in se apply karo. Centralized online counseling hogi."
          : "डिप्लोमा प्रथम वर्ष प्रवेश 2025-26: आवेदन तिथियां 11-14 अगस्त 2025। dap2025.in रा मार्फत आवेदन करो। केंद्रीयकृत ऑनलाइन प्रक्रिया सूं काउंसलिंग होगी।"
        return { text: admissionPrompt }
      }

      case 'admission_timing': {
        setLastIntent(null)
        setContextType(null)
        const admissionTimingText = lang === 'english'
          ? "Diploma First Year Admission: 11 August 2025, 11:00 AM onwards."
          : lang === 'hindi'
          ? "डिप्लोमा प्रथम वर्ष प्रवेश: 11 अगस्त 2025, सुबह 11:00 बजे से।"
          : "डिप्लोमा प्रथम वर्ष प्रवेश: 11 अगस्त 2025, सुबह 11:00 बजे से।"
        return { text: admissionTimingText }
      }

      case 'eligibility': {
        setLastIntent(null)
        setContextType(null)
        const eligibilityText = lang === 'english'
          ? "Diploma First Year: Class 10th pass with Science and Mathematics subjects. Minimum marks: 35%."
          : lang === 'hindi'
          ? "Diploma First Year: Class 10th पास होना चाहिए, विज्ञान और गणित विषय के साथ। न्यूनतम अंक: 35%।"
          : "Diploma First Year: Class 10th पास होना चाहिए, विज्ञान और गणित विषय के साथ। न्यूनतम अंक: 35%।"
        return { text: eligibilityText }
      }

      case 'result': {
      setLastIntent('awaiting_diploma_result_sem')
      setContextType('result')
      const resultPrompt = lang === 'english'
        ? "Which semester result are you looking for? Please specify Diploma 1st to 6th semester."
        : lang === 'hindi'
        ? "आप किस सेमेस्टर का परिणाम चाहते हैं? कृपया डिप्लोमा 1st से 6th सेमेस्टर बताएं।"
        : lang === 'hinglish'
        ? "Aap kis semester ka result dekhna chahte hain? Please batao Diploma 1st se 6th semester tak."
        : "आप कौन सी सेमेस्टर का परिणाम चाहते हैं? कृपया डिप्लोमा 1st से 6th सेमेस्टर बताएं।"
      return { text: resultPrompt }
      }

      case 'exam': {
        setLastIntent('awaiting_diploma_exam_sem')
        setContextType('exam')
        const examPrompt = lang === 'english'
          ? "Which semester exam are you asking about? Please specify Diploma 1st to 6th semester."
          : lang === 'hindi'
          ? "आप किस सेमेस्टर की परीक्षा के बारे में पूछ रहे हैं? कृपया डिप्लोमा 1st से 6th सेमेस्टर बताएं।"
          : lang === 'hinglish'
          ? "Aap kis semester ki exam ke baare mein puch rahe hain? Please batao Diploma 1st se 6th semester tak."
          : "आप कौन सी सेमेस्टर की परीक्षा के बारे में पूछ रहे हैं? कृपया डिप्लोमा 1st से 6th सेमेस्टर बताएं।"
        return { text: examPrompt }
      }

      case 'notice': {
        setLastIntent(null)
        setContextType(null)
        const noticeText = lang === 'english'
          ? "📢 Latest Official Notices (DTE Rajasthan):\n\n🔹 27 Sept 2025: Diploma 2nd Round Counseling starts from 30 September 2025\n🔹 25 Sept 2025: Document verification for selected candidates - Last date 28 Sept 2025\n🔹 22 Sept 2025: Fee payment deadline extended till 29 September 2025\n🔹 20 Sept 2025: Diploma 3rd-6th semester exam timetable released\n🔹 18 Sept 2025: Revaluation results announced for all semesters\n\nFor complete details visit: https://dte.rajasthan.gov.in"
          : lang === 'hindi'
          ? "📢 नवीनतम आधिकारिक सूचनाएं (DTE राजस्थान):\n\n🔹 27 सितंबर 2025: डिप्लोमा द्वितीय राउंड काउंसलिंग 30 सितंबर 2025 से शुरू\n🔹 25 सितंबर 2025: चयनित अभ्यर्थियों का दस्तावेज़ सत्यापन - अंतिम तिथि 28 सितंबर 2025\n🔹 22 सितंबर 2025: फीस भुगतान की अंतिम तिथि 29 सितंबर 2025 तक बढ़ाई गई\n🔹 20 सितंबर 2025: डिप्लोमा तृतीय-षष्ठ सेमेस्टर परीक्षा समय सारणी जारी\n🔹 18 सितंबर 2025: सभी सेमेस्टर के पुनर्मूल्यांकन परिणाम घोषित\n\nपूरी जानकारी के लिए देखें: https://dte.rajasthan.gov.in"
          : lang === 'hinglish'
          ? "Diploma Revaluation Result ka notice 18 September 2025 ko release hua hai. Detailed update ke liye official site dekho: https://dte.rajasthan.gov.in"
          : "📢 नवीनतम आधिकारिक सूचनाएं (DTE राजस्थान):\n\n🔹 27 सितंबर 2025: डिप्लोमा दूसरो राउंड काउंसलिंग 30 सितंबर सूं शुरू\n🔹 25 सितंबर 2025: चुने गए अभ्यर्थियों को कागजात जांच - आखिरी तारीख 28 सितंबर 2025\n🔹 22 सितंबर 2025: फीस भरण की आखिरी तारीख 29 सितंबर 2025 तक बढ़ाई\n🔹 20 सितंबर 2025: डिप्लोमा तीसरो-छठो सेमेस्टर परीक्षा समय सारणी जारी\n🔹 18 सितंबर 2025: सगळे सेमेस्टर के पुनर्मूल्यांकन परिणाम घोषित\n\nपूरी जाणकारी खातर देखो: https://dte.rajasthan.gov.in"
        return { text: noticeText }
      }

      case 'news': {
        setLastIntent(null)
        setContextType(null)
        const newsText = lang === 'english'
          ? "🗞️ Latest DTE Rajasthan News & Updates:\n\n✅ BREAKING: Diploma 2nd Round Counseling announced - Starting 30 September 2025\n✅ NEW: Online fee payment facility extended with multiple payment options\n✅ UPDATE: Document verification process now includes Aadhaar-based verification\n✅ ALERT: Last 2 days remaining for fee payment - Deadline 29 September 2025\n✅ RESULT: All semester revaluation results are now live on official portal\n\n📱 Stay updated: Follow DTE Rajasthan official website\n🌐 Portal: https://dte.rajasthan.gov.in"
          : lang === 'hindi'
          ? "🗞️ नवीनतम DTE राजस्थान समाचार और अपडेट:\n\n✅ ब्रेकिंग: डिप्लोमा द्वितीय राउंड काउंसलिंग की घोषणा - 30 सितंबर 2025 से शुरू\n✅ नया: ऑनलाइन फीस भुगतान सुविधा कई भुगतान विकल्पों के साथ बढ़ाई गई\n✅ अपडेट: दस्तावेज़ सत्यापन प्रक्रिया में अब आधार-आधारित सत्यापन शामिल\n✅ अलर्ट: फीस भुगतान के लिए केवल 2 दिन बचे - अंतिम तिथि 29 सितंबर 2025\n✅ परिणाम: सभी सेमेस्टर पुनर्मूल्यांकन परिणाम अब आधिकारिक पोर्टल पर उपलब्ध\n\n📱 अपडेट रहें: DTE राजस्थान आधिकारिक वेबसाइट फॉलो करें\n🌐 पोर्टल: https://dte.rajasthan.gov.in"
          : lang === 'hinglish'
          ? "🗞️ Latest DTE Rajasthan News & Updates:\n\n✅ BREAKING: Diploma 2nd Round Counseling announce ho gayi - 30 September se start\n✅ NEW: Online fee payment facility extend ho gayi multiple payment options ke saath\n✅ UPDATE: Document verification process mein ab Aadhaar-based verification include\n✅ ALERT: Fee payment ke liye sirf 2 din bache - Deadline 29 September 2025\n✅ RESULT: Sabhi semester revaluation results ab official portal par live\n\n📱 Stay updated: DTE Rajasthan official website follow karein\n🌐 Portal: https://dte.rajasthan.gov.in"
          : "🗞️ नवीनतम DTE राजस्थान समाचार और अपडेट:\n\n✅ ब्रेकिंग: डिप्लोमा दूसरो राउंड काउंसलिंग की घोषणा - 30 सितंबर सूं शुरू\n✅ नयो: ऑनलाइन फीस भरण की सुविधा घणे भुगतान विकल्पों को साथ बढ़ाई\n✅ अपडेट: कागजात जांच प्रक्रिया में अब आधार-आधारित जांच शामिल\n✅ अलर्ट: फीस भरण खातर सिर्फ 2 दिन बचे - आखिरी तारीख 29 सितंबर 2025\n✅ परिणाम: सगळे सेमेस्टर पुनर्मूल्यांकन परिणाम अब official portal पर उपलब्ध\n\n📱 अपडेट रहो: DTE राजस्थान official website follow करो\n🌐 पोर्टल: https://dte.rajasthan.gov.in"
        return { text: newsText }
      }

      // Handle context-aware responses
      case 'diploma_result_1':
      case 'diploma_result_2':
      case 'diploma_result_3':
      case 'diploma_result_4':
      case 'diploma_result_5':
      case 'diploma_result_6': {
        setLastIntent(null)
        setContextType(null)
        const semNum = intent.split('_')[2]
        const resultDates = {
          '1': '12 Sep 2025', '2': '15 Sep 2025', '3': '18 Sep 2025',
          '4': '20 Sep 2025', '5': '22 Sep 2025', '6': '25 Sep 2025'
        }
        const resultText = lang === 'english'
          ? `Diploma ${semNum}${semNum === '1' ? 'st' : semNum === '2' ? 'nd' : semNum === '3' ? 'rd' : 'th'} semester result has been declared on ${resultDates[semNum]}.`
          : lang === 'hindi'
          ? `डिप्लोमा ${semNum === '1' ? 'प्रथम' : semNum === '2' ? 'द्वितीय' : semNum === '3' ? 'तृतीय' : semNum === '4' ? 'चतुर्थ' : semNum === '5' ? 'पंचम' : 'षष्ठ'} सेमेस्टर परिणाम ${resultDates[semNum]} को घोषित हो चुका है।`
          : lang === 'hinglish'
          ? `Diploma ${semNum}${semNum === '1' ? 'st' : semNum === '2' ? 'nd' : semNum === '3' ? 'rd' : 'th'} semester result ${resultDates[semNum]} ko declare ho gaya hai.`
          : `डिप्लोमा ${semNum}${semNum === '1' ? 'st' : semNum === '2' ? 'nd' : semNum === '3' ? 'rd' : 'th'} सेमेस्टर परिणाम ${resultDates[semNum]} को घोषित हो चुका है।`
        return { text: resultText }
      }

      case 'diploma_exam_1':
      case 'diploma_exam_2':
      case 'diploma_exam_3':
      case 'diploma_exam_4':
      case 'diploma_exam_5':
      case 'diploma_exam_6': {
        setLastIntent(null)
        setContextType(null)
        const examSemNum = intent.split('_')[2]
        const examDates = {
          '1': '1 Oct 2025', '2': '5 Oct 2025', '3': '10 Oct 2025',
          '4': '15 Oct 2025', '5': '20 Oct 2025', '6': '25 Oct 2025'
        }
        const examText = lang === 'english'
          ? `Diploma ${examSemNum}${examSemNum === '1' ? 'st' : examSemNum === '2' ? 'nd' : examSemNum === '3' ? 'rd' : 'th'} semester exam starts from ${examDates[examSemNum]}.`
          : lang === 'hindi'
          ? `डिप्लोमा ${examSemNum === '1' ? 'प्रथम' : examSemNum === '2' ? 'द्वितीय' : examSemNum === '3' ? 'तृतीय' : examSemNum === '4' ? 'चतुर्थ' : examSemNum === '5' ? 'पंचम' : 'षष्ठ'} सेमेस्टर परीक्षा ${examDates[examSemNum]} से शुरू हो रही है।`
          : lang === 'hinglish'
          ? `Diploma ${examSemNum}${examSemNum === '1' ? 'st' : examSemNum === '2' ? 'nd' : examSemNum === '3' ? 'rd' : 'th'} semester exam ${examDates[examSemNum]} se start ho raha hai.`
          : `डिप्लोमा ${examSemNum}${examSemNum === '1' ? 'st' : examSemNum === '2' ? 'nd' : examSemNum === '3' ? 'rd' : 'th'} सेमेस्टर परीक्षा ${examDates[examSemNum]} से शुरू हो रही है।`
        return { text: examText }
      }

      default:
        // Handle thank you responses
        if (/(thank you|thanks|धन्यवाद|घणो धन्यवाद|shukriya)/i.test(lower)) {
          setLastIntent(null)
          setContextType(null)
          const thankYouText = lang === 'english'
            ? "You are welcome. Best of luck for your exams and results."
            : lang === 'hindi'
            ? "आपका स्वागत है। आपकी परीक्षा और परिणाम के लिए शुभकामनाएं।"
            : "आपका स्वागत है। आपकी परीक्षा और परिणाम के लिए शुभकामनाएं।"
          return { text: thankYouText }
        }

        // Handle namaste responses
        if (/(namaste|नमस्ते)/i.test(lower) && !/(hi|hello)/i.test(lower)) {
          setLastIntent(null)
          setContextType(null)
          const namasteText = lang === 'english'
            ? "Namaste. I am Saarthi, at your service for DTE Rajasthan queries."
            : lang === 'hindi'
            ? "नमस्ते। मैं सारथी हूं, DTE राजस्थान की जानकारी के लिए आपकी सेवा में हूं।"
            : "नमस्ते। मैं सारथी हूं, DTE राजस्थान की जानकारी के लिए आपकी सेवा में हूं।"
          return { text: namasteText }
        }

        // Check if we're in a context and handle appropriately
        if (lastIntent === 'awaiting_admission_type') {
          if (/(eligibility|पात्रता|योग्यता)/i.test(lower)) {
            setLastIntent(null)
            setContextType(null)
            const eligibilityDetailsText = lang === 'english'
              ? "Diploma Admission 2025-26 Eligibility:\n• 10th pass with minimum 35% marks\n• Online application period: 11-14 August 2025\n• Application portal: www.dap2025.in\n• Counseling: Centralized online process\n• For authentication, please check the official portal."
              : lang === 'hindi'
              ? "डिप्लोमा प्रवेश 2025-26 पात्रता:\n• 10वीं पास न्यूनतम 35% अंकों के साथ\n• ऑनलाइन आवेदन अवधि: 11-14 अगस्त 2025\n• आवेदन पोर्टल: www.dap2025.in\n• काउंसलिंग: केंद्रीयकृत ऑनलाइन प्रक्रिया\n• प्रमाणीकरण के लिए, कृपया आधिकारिक पोर्टल देखें।"
              : "डिप्लोमा प्रवेश 2025-26 पात्रता:\n• 10वीं पास न्यूनतम 35% अंकों के साथ\n• ऑनलाइन आवेदन अवधि: 11-14 अगस्त 2025\n• आवेदन पोर्टल: www.dap2025.in\n• काउंसलिंग: केंद्रीयकृत ऑनलाइन प्रक्रिया\n• प्रमाणीकरण के लिए, कृपया आधिकारिक पोर्टल देखें।"
            return { text: eligibilityDetailsText }
          } else if (/(first|1st|प्रथम|पहला|पहलो)/i.test(lower)) {
            setLastIntent(null)
            setContextType(null)
            const firstYearText = lang === 'english'
              ? "Diploma First Year Admission 2025-26:\n• Application period: 11-14 August 2025\n• Application portal: www.dap2025.in\n• Eligibility: 10th pass with 35% marks\n• Counseling: Online centralized process\n• For authentication, please check the official portal"
              : lang === 'hindi'
              ? "डिप्लोमा प्रथम वर्ष प्रवेश 2025-26:\n• आवेदन अवधि: 11-14 अगस्त 2025\n• आवेदन पोर्टल: www.dap2025.in\n• पात्रता: 10वीं पास 35% अंकों के साथ\n• काउंसलिंग: ऑनलाइन केंद्रीयकृत प्रक्रिया\n• प्रमाणीकरण के लिए, कृपया आधिकारिक पोर्टल देखें"
              : "डिप्लोमा प्रथम वर्ष प्रवेश 2025-26:\n• आवेदन अवधि: 11-14 अगस्त 2025\n• आवेदन पोर्टल: www.dap2025.in\n• पात्रता: 10वीं पास 35% अंकों के साथ\n• काउंसलिंग: ऑनलाइन केंद्रीयकृत प्रक्रिया\n• प्रमाणीकरण के लिए, कृपया आधिकारिक पोर्टल देखें"
            return { text: firstYearText }
          } else if (/(lateral|लेटरल|entry)/i.test(lower)) {
            setLastIntent(null)
            setContextType(null)
            const lateralText = lang === 'english'
              ? "Diploma Lateral Entry (Direct 2nd Year) 2025:\n• Application period: 20-25 August 2025\n• Eligibility: 12th Science (PCM) OR ITI (2 years)\n• Minimum marks: 35%\n• Counseling: Online centralized process"
              : lang === 'hindi'
              ? "डिप्लोमा लेटरल एंट्री (सीधे द्वितीय वर्ष) 2025:\n• आवेदन अवधि: 20-25 अगस्त 2025\n• पात्रता: 12वीं विज्ञान (PCM) या ITI (2 वर्ष)\n• न्यूनतम अंक: 35%\n• काउंसलिंग: ऑनलाइन केंद्रीयकृत प्रक्रिया"
              : "डिप्लोमा लेटरल एंट्री (सीधे द्वितीय वर्ष) 2025:\n• आवेदन अवधि: 20-25 अगस्त 2025\n• पात्रता: 12वीं विज्ञान (PCM) या ITI (2 वर्ष)\n• न्यूनतम अंक: 35%\n• काउंसलिंग: ऑनलाइन केंद्रीयकृत प्रक्रिया"
            return { text: lateralText }
          }
        }

        if (lastIntent === 'awaiting_diploma_exam_sem' || lastIntent === 'awaiting_diploma_result_sem') {
          setLastIntent(null)
          setContextType(null)
          const notFoundText = lang === 'english'
            ? "Sorry, this semester information is not available. Please check the official DTE Rajasthan website: https://dte.rajasthan.gov.in/"
            : lang === 'hindi'
            ? "खेद है, इस सेमेस्टर की जानकारी उपलब्ध नहीं है। कृपया आधिकारिक DTE राजस्थान वेबसाइट देखें: https://dte.rajasthan.gov.in/"
            : "माफ करो, इस semester की जाणकारी उपलब्ध कोनी है। कृपया official DTE राजस्थान website देखो: https://dte.rajasthan.gov.in/"
          return { text: notFoundText }
        }
        
        return null // No dataset response available
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
        } else if (detectedLang === 'rajasthani') {
          recognitionRef.current.lang = 'hi-IN' // Use Hindi recognition for Rajasthani
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


  // Handle sending message with context awareness and API integration
  const handleSend = async () => {
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

    try {
      const botResponse = await generateResponse(userMessage.text)
      
      // Calculate realistic typing delay based on response length
      const responseLength = botResponse.text.length
      const baseDelay = 1000 // Minimum 1 second delay
      const typingSpeed = 50 // Characters per second (realistic typing speed)
      const calculatedDelay = Math.min(baseDelay + (responseLength / typingSpeed) * 1000, 4000) // Max 4 seconds
      
      // Add realistic typing delay
      setTimeout(() => {
        const botMessage = { 
          id: messages.length + 2, 
          text: botResponse.text, 
          sender: 'bot', 
          timestamp: new Date(), 
          language: botResponse.language,
          source: botResponse.source
        }
        
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, calculatedDelay)
      
    } catch (error) {
      console.error('Error generating response:', error)
      
      // Add delay even for error messages to maintain consistency
      setTimeout(() => {
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I'm having trouble responding right now. Please try again!",
          sender: 'bot',
          timestamp: new Date(),
          language: 'english'
        }
        setMessages(prev => [...prev, errorMessage])
        setIsTyping(false)
      }, 1500) // 1.5 second delay for error messages
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