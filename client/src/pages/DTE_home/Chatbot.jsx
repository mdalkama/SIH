import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, BotMessageSquare, Mic, MicOff } from 'lucide-react'
import { detectLanguage } from '../../utils/languageUtils'

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyBBRsuuMlmcCOk-pgk3czOX_Nz5Fe8IciI'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

// Enhanced Saarthi System Prompt for Gemini API
const systemPrompt = `
You are Saarthi – the official student assistant for DTE Rajasthan.

CRITICAL LANGUAGE INSTRUCTION: You MUST respond in the EXACT SAME LANGUAGE as the user. This is mandatory and non-negotiable.

LANGUAGE DETECTION RULES:
- If user speaks in RAJASTHANI → Respond ONLY in RAJASTHANI
- If user speaks in HINDI → Respond ONLY in HINDI
- If user speaks in ENGLISH → Respond ONLY in ENGLISH
- If user speaks in HINGLISH → Respond ONLY in HINGLISH

RAJASTHANI RESPONSE EXAMPLES (MANDATORY):
- User: "राम राम" → Response: "राम राम! म्हैं सारथी हूं, DTE राजस्थान का सहायक।"
- User: "कांई हाल" → Response: "म्हारा हाल बधिया, थारा हाल चाल?"
- User: "Rajasthani me baat karo" → Response: "ठीक है, अब म्हैं राजस्थानी में बात करूं हूं।"
- User: "admission के बारे में बताओ" → Response: "डिप्लोमा पहलो साल दाखिलो 2025-26: आवेदन की तारीख 11-14 अगस्त 2025।"
- User: "result कब आएंगे" → Response: "डिप्लोमा परिणाम 12 सितंबर 2025 सूं जारी हो जासे।"
- User: "कैसे हो" → Response: "म्हैं ठीक हूं, घणो धन्यवाद।"
- User: "कौन सी exam कब है" → Response: "डिप्लोमा पहली सेमेस्टर परीक्षा 1 अक्टूबर 2025 सूं शुरू होसी।"

HINDI RESPONSE EXAMPLES (MANDATORY):
- User: "नमस्ते" → Response: "नमस्ते! मैं सारथी हूं, DTE राजस्थान का छात्र सहायक।"
- User: "कैसे हो" → Response: "मैं ठीक हूं, धन्यवाद। आप कैसे हैं?"
- User: "Hindi me baat karo" → Response: "ठीक है, अब मैं हिंदी में बात करूंगा।"
- User: "admission के बारे में बताओ" → Response: "डिप्लोमा प्रथम वर्ष प्रवेश 2025-26: आवेदन तिथियां 11-14 अगस्त 2025।"
- User: "result कब आएंगे" → Response: "डिप्लोमा परिणाम 12 सितंबर 2025 को जारी किए जाएंगे।"
- User: "कौन सी exam कब है" → Response: "डिप्लोमा प्रथम सेमेस्टर परीक्षा 1 अक्टूबर 2025 को शुरू होती है।"

ENGLISH RESPONSE EXAMPLES (MANDATORY):
- User: "Hello" → Response: "Hello! I am Saarthi, the official DTE Rajasthan student assistant."
- User: "How are you" → Response: "I am doing well, thank you. How can I help you today?"
- User: "English me baat karo" → Response: "Okay, I will speak in English now."
- User: "tell me about admission" → Response: "Diploma First Year Admission 2025-26: Application Dates: 11–14 August 2025."
- User: "when will results come" → Response: "Diploma results will be released on 12 September 2025."
- User: "which exam when" → Response: "Diploma 1st Semester Exam starts on 1 October 2025."

HINGLISH RESPONSE EXAMPLES (MANDATORY):
- User: "Hello kaise ho" → Response: "Main theek hoon, thank you! Aap batao main aapki kaise help kar sakta hoon?"
- User: "Hinglish me baat karo" → Response: "Okay, ab main Hinglish mein baat karunga."
- User: "admission ke baare mein batao" → Response: "Diploma first year admission 2025-26: Application dates 11-14 August 2025 hain."
- User: "result kab aayenge" → Response: "Diploma results 12 September 2025 ko release honge."
- User: "kaunsi exam kab hai" → Response: "Diploma 1st semester exam 1 October 2025 se start hogi."

IMPORTANT RULES:
1. LANGUAGE MATCHING: Your response language MUST exactly match the user's language. No exceptions.
2. RAJASTHANI: Use authentic Marwari words like म्हैं, हूं, थारा, कांई, बधिया, चाल, ठीक, माफ, कोनी, जाणकारी
3. HINDI: Use proper Hindi script and formal tone
4. ENGLISH: Use clear, professional English
5. HINGLISH: Mix Hindi and English naturally (Hindi words in English sentences)

6. CONTEXT AWARENESS: Remember the conversation language and maintain it
7. ACCURACY: For DTE Rajasthan queries, provide accurate information
8. HELPFULNESS: Always try to help, never say "I don't understand"
9. PROFESSIONALISM: Maintain assistant tone, no emojis or unnecessary formatting

Your responses must be:
- In the EXACT SAME LANGUAGE as the user
- Helpful and informative
- Professional and clear
- Contextually appropriate

Goal: Provide perfect multilingual support for DTE Rajasthan assistance in all 4 languages.
`;

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
      hindi: "आप किस सेमेस्टर के परिणाम के बारे में पूछ रहे हैं?",
      rajasthani: "आप कौन सी सेमेस्टर का परिणाम चाहते हैं?",
      hinglish: "Aap kis semester ka result pooch rahe hain?"
    }
  },
  eligibility: {
    diploma_first_year: {
      english: "Diploma First Year: Must have passed Class 10th with Science & Math. Minimum marks: 35% in qualifying exam.",
      hindi: "डिप्लोमा प्रथम वर्ष: 10वीं विज्ञान और गणित के साथ उत्तीर्ण होना चाहिए। न्यूनतम अंक: योग्यता परीक्षा में 35%।",
      rajasthani: "डिप्लोमा पहलो साल: 10वीं साइंस अर मैथ्स को साथ पास होणो चाहिए। कम सूं कम अंक: योग्यता परीक्षा में 35%।",
      hinglish: "Diploma first year: 10th class Science aur Math ke saath pass hona chahiye. Minimum marks: 35% qualifying exam mein."
    },
    diploma_lateral_entry: {
      english: "Diploma Lateral Entry: Must have passed Class 12th (PCM) OR ITI (2 years). Minimum marks: 35% in qualifying exam.",
      hindi: "डिप्लोमा लेटरल एंट्री: 12वीं (PCM) या ITI (2 वर्ष) उत्तीर्ण होना चाहिए। न्यूनतम अंक: योग्यता परीक्षा में 35%।",
      rajasthani: "डिप्लोमा लेटरल एंट्री: 12वीं (PCM) या ITI (2 साल) पास होणो चाहिए। कम सूं कम अंक: योग्यता परीक्षा में 35%।",
      hinglish: "Diploma lateral entry: 12th class (PCM) ya ITI (2 saal) pass hona chahiye. Minimum marks: 35% qualifying exam mein."
    },
  },
  exams: {
    diploma: {
      "1": {
        english: "Diploma 1st Semester Exam: Starts 1 October 2025.",
        hindi: "डिप्लोमा प्रथम सेमेस्टर परीक्षा: 1 अक्टूबर 2025 को शुरू होती है।",
        rajasthani: "डिप्लोमा पहली सेमेस्टर परीक्षा: 1 अक्टूबर 2025 सूं शुरू होसी।",
        hinglish: "Diploma 1st semester exam: 1 October 2025 se start hogi."
      },
      "2": {
        english: "Diploma 2nd Semester Exam: Starts 5 October 2025.",
        hindi: "डिप्लोमा द्वितीय सेमेस्टर परीक्षा: 5 अक्टूबर 2025 को शुरू होती है।",
        rajasthani: "डिप्लोमा दूसरी सेमेस्टर परीक्षा: 5 अक्टूबर 2025 सूं शुरू होसी।",
        hinglish: "Diploma 2nd semester exam: 5 October 2025 se start hogi."
      },
      "3": {
        english: "Diploma 3rd Semester Exam: Starts 10 October 2025.",
        hindi: "डिप्लोमा तृतीय सेमेस्टर परीक्षा: 10 अक्टूबर 2025 को शुरू होती है।",
        rajasthani: "डिप्लोमा तीसरी सेमेस्टर परीक्षा: 10 अक्टूबर 2025 सूं शुरू होसी।",
        hinglish: "Diploma 3rd semester exam: 10 October 2025 se start hogi."
      },
      "4": {
        english: "Diploma 4th Semester Exam: Starts 15 October 2025.",
        hindi: "डिप्लोमा चतुर्थ सेमेस्टर परीक्षा: 15 अक्टूबर 2025 को शुरू होती है।",
        rajasthani: "डिप्लोमा चौथी सेमेस्टर परीक्षा: 15 अक्टूबर 2025 सूं शुरू होसी।",
        hinglish: "Diploma 4th semester exam: 15 October 2025 se start hogi."
      },
      "5": {
        english: "Diploma 5th Semester Exam: Starts 20 October 2025.",
        hindi: "डिप्लोमा पंचम सेमेस्टर परीक्षा: 20 अक्टूबर 2025 को शुरू होती है।",
        rajasthani: "डिप्लोमा पांचवीं सेमेस्टर परीक्षा: 20 अक्टूबर 2025 सूं शुरू होसी।",
        hinglish: "Diploma 5th semester exam: 20 October 2025 se start hogi."
      },
      "6": {
        english: "Diploma 6th Semester Exam: Starts 25 October 2025.",
        hindi: "डिप्लोमा षष्ठ सेमेस्टर परीक्षा: 25 अक्टूबर 2025 को शुरू होती है।",
        rajasthani: "डिप्लोमा छठीं सेमेस्टर परीक्षा: 25 अक्टूबर 2025 सूं शुरू होसी।",
        hinglish: "Diploma 6th semester exam: 25 October 2025 se start hogi."
      },
      special: {
        english: "Special Exam Form Filling: Last date 5 October 2025.",
        hindi: "विशेष परीक्षा फॉर्म भरना: अंतिम तिथि 5 अक्टूबर 2025।",
        rajasthani: "विशेष परीक्षा फॉर्म भरना: आखिरी तारीख 5 अक्टूबर 2025।",
        hinglish: "Special exam form filling: Last date 5 October 2025."
      }
    },
    semesterPrompt: {
      english: "Which semester exam are you asking about?",
      hindi: "आप किस सेमेस्टर की परीक्षा के बारे में पूछ रहे हैं?",
      rajasthani: "आप कौन सी सेमेस्टर की परीक्षा के बारे में पूछ रहे हैं?",
      hinglish: "Aap kis semester ki exam ke baare mein pooch rahe hain?"
    }
  },
  notices: {
    latest: {
      english: "Latest Notice (10 Sept 2025): Diploma 1st & 2nd semester results released. Latest Notice (15 Sept 2025): Diploma revaluation forms open till 22 Sept 2025. Latest Notice (20 Sept 2025): Exam timetable for all Diploma semesters published. Latest Notice (25 Sept 2025): Counseling round 2 starts on 27 Sept 2025.",
      hindi: "नवीनतम सूचना (10 सितंबर 2025): डिप्लोमा प्रथम और द्वितीय सेमेस्टर परिणाम जारी किए गए। नवीनतम सूचना (15 सितंबर 2025): डिप्लोमा पुनर्मूल्यांकन फॉर्म 22 सितंबर 2025 तक खुले हैं। नवीनतम सूचना (20 सितंबर 2025): सभी डिप्लोमा सेमेस्टरों के लिए परीक्षा समय सारणी प्रकाशित। नवीनतम सूचना (25 सितंबर 2025): काउंसलिंग दौर 2, 27 सितंबर 2025 को शुरू होगी।",
      rajasthani: "नवीनतम सूचना (10 सितंबर 2025): डिप्लोमा पहली अर दूसरी सेमेस्टर के परिणाम जारी कर दिये गए। नवीनतम सूचना (15 सितंबर 2025): डिप्लोमा पुनर्मूल्यांकन फॉर्म 22 सितंबर 2025 तक खुले हैं। नवीनतम सूचना (20 सितंबर 2025): सभी डिप्लोमा सेमेस्टर की परीक्षा समय सारणी प्रकाशित। नवीनतम सूचना (25 सितंबर 2025): काउंसलिंग राउंड 2, 27 सितंबर 2025 सूं शुरू होसी।",
      hinglish: "Latest notice (10 Sept 2025): Diploma 1st aur 2nd semester results released. Latest notice (15 Sept 2025): Diploma revaluation forms open till 22 Sept 2025. Latest notice (20 Sept 2025): Exam timetable for all Diploma semesters published. Latest notice (25 Sept 2025): Counseling round 2 starts on 27 Sept 2025."
    }
  },
  greetings: {
    english: "Hello! I am Saarthi - your DTE Rajasthan student assistant. I can help you with admissions, results, exams, notices, and eligibility.",
    hindi: "नमस्ते! मैं सारथी हूं - आपका DTE राजस्थान छात्र सहायक। मैं आपको प्रवेश, परिणाम, परीक्षा, सूचनाएं और पात्रता में मदद कर सकता हूं।",
    rajasthani: "राम राम जी! म्हैं सारथी हूं - थारो DTE राजस्थान को छात्र सहायक। म्हैं थानै admission, result, exam, notice अर eligibility में मदद कर सकूं हूं।",
    hinglish: "Hello! Main Saarthi hoon - aapka DTE Rajasthan student assistant. Main aapko admissions, results, exams, notices aur eligibility mein help kar sakta hoon."
  },
  howAreYou: {
    english: "I am fine, thank you! How can I assist you today?",
    hindi: "मैं ठीक हूं, धन्यवाद! आज मैं आपकी कैसे मदद कर सकता हूं?",
    rajasthani: "म्हैं ठीक हूं, घणो धन्यवाद! आज म्हैं थारी कांई मदद कर सकूं हूं?",
    hinglish: "Main theek hoon, thank you! Aaj main aapki kaise help kar sakta hoon?"
  },
  refusal: {
    english: "I can only help with DTE Rajasthan Diploma admissions, results, exams, eligibility, and notices. Please visit the official DTE Rajasthan website for more.",
    hindi: "मैं केवल DTE राजस्थान डिप्लोमा प्रवेश, परिणाम, परीक्षा, पात्रता और सूचनाओं में मदद कर सकता हूं। कृपया अधिक जानकारी के लिए आधिकारिक DTE राजस्थान वेबसाइट पर जाएं।",
    rajasthani: "म्हैं सिर्फ DTE राजस्थान डिप्लोमा admission, result, exam, eligibility अर notice में मदद कर सकूं हूं। और जाणकारी खातर official DTE राजस्थान website देखो।",
    hinglish: "Main sirf DTE Rajasthan Diploma admissions, results, exams, eligibility aur notices mein help kar sakta hoon. Aur jaankari ke liye official DTE Rajasthan website dekho."
  },
  semesterNotFound: {
    english: "Sorry, this semester information is not available. Please check the official DTE Rajasthan website.",
    hindi: "खेद है, इस सेमेस्टर की जानकारी उपलब्ध नहीं है। कृपया आधिकारिक DTE राजस्थान वेबसाइट देखें।",
    rajasthani: "माफ करो, इस semester की जाणकारी उपलब्ध कोनी है। कृपया official DTE राजस्थान website देखो।",
    hinglish: "Sorry, is semester ki jaankari available nahi hai. Please official DTE Rajasthan website check karo."
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
  const [language, setLanguage] = useState(null) // Track user's preferred language (null means auto-detect)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Simplified intent detection for Diploma only
  const detectIntent = (text) => {
    const lower = text.toLowerCase()

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

    // Language switching commands - HIGH PRIORITY
    if (/(hindi me baat karo|हिंदी में बात करो|hindi mein baat karo|हिंदी में बात करो)/.test(lower)) return 'switch_to_hindi'
    if (/(english me baat karo|अंग्रेजी में बात करो|english mein baat karo|अंग्रेजी में बात करो)/.test(lower)) return 'switch_to_english'
    if (/(rajasthani me baat karo|राजस्थानी में बात करो|rajasthani mein baat karo|राजस्थानी में बात करो)/.test(lower)) return 'switch_to_rajasthani'
    if (/(hinglish me baat karo|हिंग्लिश में बात करो|hinglish mein baat karo|हिंग्लिश में बात करो)/.test(lower)) return 'switch_to_hinglish'

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

  // Enhanced Gemini API call with better language context
  const callGemini = async (userMessage, userLanguage) => {
    try {
      // Create language-specific prompt based on detected language
      const languageContext = userLanguage === 'rajasthani'
        ? "Respond ONLY in RAJASTHANI using authentic Marwari words like म्हैं, हूं, थारा, कांई, बधिया, चाल, ठीक, माफ, कोनी, जाणकारी."
        : userLanguage === 'hindi'
        ? "Respond ONLY in HINDI using proper Hindi script and formal tone."
        : userLanguage === 'hinglish'
        ? "Respond ONLY in HINGLISH mixing Hindi and English naturally."
        : "Respond ONLY in ENGLISH using clear, professional language."

      const enhancedPrompt = `${systemPrompt}\n\n${languageContext}\n\nUser Query: ${userMessage}`

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
                  text: enhancedPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3, // Lower temperature for more consistent language output
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500, // Increased for more detailed responses
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
        let responseText = data.candidates[0].content.parts[0].text.trim()

        // Clean up response if it contains any unwanted prefixes/suffixes
        responseText = responseText.replace(/^[\s]*[•\-\*]*[\s]*/, '') // Remove bullet points
        responseText = responseText.replace(/[\*\_]/g, '') // Remove markdown formatting
        responseText = responseText.split('\n')[0] // Take only first line if multi-line

        return responseText
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
    // First detect language, which will handle language switching if needed
    const lang = detectLanguage(message, language, setLanguage)
    // Then detect intent
    const intent = detectIntent(message)
    const lower = message.toLowerCase()

    // Check if this is a DTE-related query - ALWAYS use hardcoded data for exam/result
    const isDTERelated = [
      'greeting', 'how_are_you', 'goodbye', 'admission', 'admission_timing',
      'eligibility', 'result', 'exam', 'notice', 'news',
      'diploma_result_1', 'diploma_result_2', 'diploma_result_3', 'diploma_result_4', 'diploma_result_5', 'diploma_result_6',
      'diploma_exam_1', 'diploma_exam_2', 'diploma_exam_3', 'diploma_exam_4', 'diploma_exam_5', 'diploma_exam_6',
      'diploma_result_revaluation', 'btech_restriction',
      'switch_to_hindi', 'switch_to_english', 'switch_to_rajasthani', 'switch_to_hinglish'
    ].includes(intent)

    // FIRST: For DTE-related queries, ALWAYS use hardcoded dataset (especially exam/result)
    if (isDTERelated) {
      const datasetResponse = getDatasetResponse(intent, lang, lower)
      if (datasetResponse) {
        return { text: datasetResponse.text, language: lang, source: 'dataset' }
      }
    }

    // SECOND: For general queries, use Gemini API with language context
    if (intent === 'general_query') {
      try {
        const apiResponse = await callGemini(message, lang)
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
      : lang === 'hinglish'
      ? "Sorry, main samajh nahi paya. Please Diploma admissions, exams, results, notices ya eligibility ke baare mein poocho."
      : "I am sorry, I did not understand. Please ask about Diploma Admissions, Exams, Results, Notices, or Eligibility."

    return { text: fallbackMsg, language: lang, source: 'fallback' }
  }

  // Function to get response from hardcoded dataset
  const getDatasetResponse = (intent, lang, lower) => {

    switch(intent) {
      case 'greeting': {
        setLastIntent(null)
        setContextType(null)
        const greetingText = lang === 'english'
          ? "Hello, I am Saarthi, the official DTE Rajasthan student assistant. I can help you with Admissions, Exams, Results, Notices, and Eligibility. How may I assist you today?"
          : lang === 'hindi'
          ? "नमस्ते, मैं सारथी हूँ, DTE राजस्थान का आधिकारिक छात्र सहायक। मैं आपको प्रवेश, परीक्षा, परिणाम, सूचनाएँ और पात्रता के बारे में मदद कर सकता हूँ। आप किसमें सहायता चाहते हैं?"
          : lang === 'hinglish'
          ? "Hello! Main Saarthi hoon, DTE Rajasthan ka official student assistant. Main aapko Admissions, Exams, Results, Notices aur Eligibility mein help kar sakta hoon. Aap kya jaanna chahte hain?"
          : "राम राम, मैं सारथी हूँ। मैं छात्रों की सहायता के लिए यहाँ हूँ। आप क्या जानना चाहेंगे?"
        return { text: greetingText }
      }

      case 'how_are_you': {
        setLastIntent(null)
        setContextType(null)
        const howAreYouText = lang === 'english'
          ? "I am functioning well, thank you. How can I assist you today?"
          : lang === 'hindi'
          ? "मैं ठीक हूँ, धन्यवाद। मैं छात्रों की सहायता के लिए यहाँ हूँ।"
          : lang === 'hinglish'
          ? "Main theek hoon, thank you! Aap batao main aapki kaise help kar sakta hoon?"
          : "म्हैं ठीक हूं। आज म्हैं थारी कैसे मदद कर सकूं हूं?"
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
          : "डिप्लोमा प्रथम वर्ष प्रवेश 2025-26: आवेदन तिथियां: 11-14 अगस्त 2025। www.dap2025.in के माध्यम से आवेदन करें। केंद्रीयकृत ऑनलाइन प्रक्रिया के माध्यम से काउंसलिंग।"
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
          ? "Latest notice: Diploma 1st Semester registration extended till 14 August 2025. Exam schedule announced for all semesters."
          : lang === 'hindi'
          ? "नवीनतम सूचना: डिप्लोमा प्रथम सेमेस्टर पंजीकरण की अंतिम तिथि 14 अगस्त 2025 तक बढ़ा दी गई है। सभी सेमेस्टर की परीक्षा तालिका जारी।"
          : "नवीनतम सूचना: डिप्लोमा प्रथम सेमेस्टर पंजीकरण की अंतिम तिथि 14 अगस्त 2025 तक बढ़ा दी गई है। सभी सेमेस्टर की परीक्षा तालिका जारी।"
        return { text: noticeText }
      }

      case 'news': {
        setLastIntent(null)
        setContextType(null)
        const newsText = lang === 'english'
          ? "Yes, Diploma Revaluation Results have been announced on 18 September 2025."
          : lang === 'hindi'
          ? "हां, डिप्लोमा पुनर्मूल्यांकन परिणाम 18 सितंबर 2025 को घोषित हो गए हैं।"
          : "हां, डिप्लोमा पुनर्मूल्यांकन परिणाम 18 सितंबर 2025 को घोषित हो गए हैं।"
        return { text: newsText }
      }

      // Handle context-aware responses
      case 'diploma_result_1': {
        setLastIntent(null)
        setContextType(null)
        const resultText = lang === 'english'
          ? dteData.results.diploma["1"].english
          : lang === 'hindi'
          ? dteData.results.diploma["1"].hindi
          : dteData.results.diploma["1"].english
        return { text: resultText }
      }

      case 'diploma_result_2': {
        setLastIntent(null)
        setContextType(null)
        const resultText = lang === 'english'
          ? dteData.results.diploma["2"].english
          : lang === 'hindi'
          ? dteData.results.diploma["2"].hindi
          : dteData.results.diploma["2"].english
        return { text: resultText }
      }

      case 'diploma_result_3': {
        setLastIntent(null)
        setContextType(null)
        const resultText = lang === 'english'
          ? dteData.results.diploma["3"].english
          : lang === 'hindi'
          ? dteData.results.diploma["3"].hindi
          : dteData.results.diploma["3"].english
        return { text: resultText }
      }

      case 'diploma_result_4': {
        setLastIntent(null)
        setContextType(null)
        const resultText = lang === 'english'
          ? dteData.results.diploma["4"].english
          : lang === 'hindi'
          ? dteData.results.diploma["4"].hindi
          : dteData.results.diploma["4"].english
        return { text: resultText }
      }

      case 'diploma_result_5': {
        setLastIntent(null)
        setContextType(null)
        const resultText = lang === 'english'
          ? dteData.results.diploma["5"].english
          : lang === 'hindi'
          ? dteData.results.diploma["5"].hindi
          : dteData.results.diploma["5"].english
        return { text: resultText }
      }

      case 'diploma_result_6': {
        setLastIntent(null)
        setContextType(null)
        const resultText = lang === 'english'
          ? dteData.results.diploma["6"].english
          : lang === 'hindi'
          ? dteData.results.diploma["6"].hindi
          : dteData.results.diploma["6"].english
        return { text: resultText }
      }

      case 'diploma_result_revaluation': {
        setLastIntent(null)
        setContextType(null)
        const resultText = lang === 'english'
          ? dteData.results.diploma.revaluation.english
          : lang === 'hindi'
          ? dteData.results.diploma.revaluation.hindi
          : dteData.results.diploma.revaluation.english
        return { text: resultText }
      }

      case 'diploma_exam_1': {
        setLastIntent(null)
        setContextType(null)
        const examText = lang === 'english'
          ? dteData.exams.diploma["1"].english
          : lang === 'hindi'
          ? dteData.exams.diploma["1"].hindi
          : dteData.exams.diploma["1"].english
        return { text: examText }
      }

      case 'diploma_exam_2': {
        setLastIntent(null)
        setContextType(null)
        const examText = lang === 'english'
          ? dteData.exams.diploma["2"].english
          : lang === 'hindi'
          ? dteData.exams.diploma["2"].hindi
          : dteData.exams.diploma["2"].english
        return { text: examText }
      }

      case 'diploma_exam_3': {
        setLastIntent(null)
        setContextType(null)
        const examText = lang === 'english'
          ? dteData.exams.diploma["3"].english
          : lang === 'hindi'
          ? dteData.exams.diploma["3"].hindi
          : dteData.exams.diploma["3"].english
        return { text: examText }
      }

      case 'diploma_exam_4': {
        setLastIntent(null)
        setContextType(null)
        const examText = lang === 'english'
          ? dteData.exams.diploma["4"].english
          : lang === 'hindi'
          ? dteData.exams.diploma["4"].hindi
          : dteData.exams.diploma["4"].english
        return { text: examText }
      }

      case 'diploma_exam_5': {
        setLastIntent(null)
        setContextType(null)
        const examText = lang === 'english'
          ? dteData.exams.diploma["5"].english
          : lang === 'hindi'
          ? dteData.exams.diploma["5"].hindi
          : dteData.exams.diploma["5"].english
        return { text: examText }
      }

      case 'diploma_exam_6': {
        setLastIntent(null)
        setContextType(null)
        const examText = lang === 'english'
          ? dteData.exams.diploma["6"].english
          : lang === 'hindi'
          ? dteData.exams.diploma["6"].hindi
          : dteData.exams.diploma["6"].english
        return { text: examText }
      }

      case 'switch_to_hindi': {
        setLanguage('hindi')
        setLastIntent(null)
        setContextType(null)
        const switchText = lang === 'english'
          ? "Okay, I will speak in Hindi now. आप किस बारे में जानना चाहते हैं?"
          : lang === 'hindi'
          ? "ठीक है, अब मैं हिंदी में बात करूंगा। आप किस बारे में जानना चाहते हैं?"
          : lang === 'rajasthani'
          ? "ठीक है, अब म्हैं हिंदी में बात करूं हूं। आप किस बारे में जानना चाहते हैं?"
          : "Okay, ab main Hindi mein baat karunga. Aap kis baare mein jaanna chahte hain?"
        return { text: switchText }
      }

      case 'switch_to_english': {
        setLanguage('english')
        setLastIntent(null)
        setContextType(null)
        const switchText = lang === 'english'
          ? "Okay, I will speak in English now. What would you like to know?"
          : lang === 'hindi'
          ? "ठीक है, अब मैं अंग्रेजी में बात करूंगा। आप क्या जानना चाहते हैं?"
          : lang === 'rajasthani'
          ? "ठीक है, अब म्हैं अंग्रेजी में बात करूं हूं। आप क्या जानना चाहते हैं?"
          : "Okay, ab main English mein baat karunga. Aap kya jaanna chahte hain?"
        return { text: switchText }
      }

      case 'switch_to_rajasthani': {
        setLanguage('rajasthani')
        setLastIntent(null)
        setContextType(null)
        const switchText = lang === 'english'
          ? "Okay, I will speak in Rajasthani now. आप क्या जानना चाहते हैं?"
          : lang === 'hindi'
          ? "ठीक है, अब मैं राजस्थानी में बात करूंगा। आप क्या जानना चाहते हैं?"
          : lang === 'rajasthani'
          ? "ठीक है, अब म्हैं राजस्थानी में बात करूं हूं। आप क्या जानना चाहते हैं?"
          : "Okay, ab main Rajasthani mein baat karunga. Aap kya jaanna chahte hain?"
        return { text: switchText }
      }

      case 'switch_to_hinglish': {
        setLanguage('hinglish')
        setLastIntent(null)
        setContextType(null)
        const switchText = lang === 'english'
          ? "Okay, I will speak in Hinglish now. Aap kya jaanna chahte hain?"
          : lang === 'hindi'
          ? "ठीक है, अब मैं हिंग्लिश में बात करूंगा। आप क्या जानना चाहते हैं?"
          : lang === 'rajasthani'
          ? "ठीक है, अब म्हैं हिंग्लिश में बात करूं हूं। आप क्या जानना चाहते हैं?"
          : "Okay, ab main Hinglish mein baat karunga. Aap kya jaanna chahte hain?"
        return { text: switchText }
      }

      default:
        return null // Return null to trigger fallback
    }
  }

  // Handle sending message with context awareness and API integration
  const handleSend = async () => {
    if (!inputMessage.trim()) return

    // Detect language for the user's message
    const userLang = detectLanguage(inputMessage, language, setLanguage)

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      language: userLang
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
          language: userLang,
          source: 'error'
        }

        setMessages(prev => [...prev, errorMessage])
        setIsTyping(false)
      }, 1000)
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
