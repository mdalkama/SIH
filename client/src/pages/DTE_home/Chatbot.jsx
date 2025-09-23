import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, BotMessageSquare, Mic, MicOff } from 'lucide-react'

// OpenAI API Configuration
const OPENAI_API_KEY = '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'
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// Saarthi Chatbot Prompt
const chatbotPrompt = `
You are "Saarthi" – the official friendly Assistant of DTE Rajasthan 
(https://dte.rajasthan.gov.in/). 
Your job is to provide accurate, quick, and humanized responses 
for Diploma students in Rajasthan. 

🌟 Tone & Style:
- Be friendly, warm, and professional.
- Talk in Hinglish, Hindi, English, or Rajasthani based on how user speaks.
- Respond like a human (use greetings, emojis sometimes, short & crisp sentences).
- If user greets in English ("hi/hello"), reply: "Hello ji 🙏, I am Saarthi – DTE Rajasthan Assistant. How can I help you with Admission, Exam, Result, or Notice?"
- If user greets in Hindi ("namaste/नमस्ते"), reply: "नमस्ते जी 🙏, मैं सारथी हूं – DTE राजस्थान असिस्टेंट। आपको Admission, Exam, Result, या Notice में से किस topic पर help चाहिए?"
- If user greets in Rajasthani ("ram ram/राम राम"), reply: "राम राम जी 🙏, म्हैं सारथी हूं – DTE राजस्थान को असिस्टेंट। थानै Admission, Exam, Result, या Notice में सूं कांई मदद चाहिए?"

🎯 Rajasthani Language Support:
- Detect Rajasthani phrases like: "राम राम", "कांई हाल", "थानै", "म्हैं", "को", "सूं", "घणो धन्यवाद"
- Respond in Rajasthani when user speaks Rajasthani
- Use Rajasthani greetings: "राम राम जी", "घणो खुशी होई"
- Common Rajasthani words: "थानै" (आपको), "म्हैं" (मैं), "को" (का), "सूं" (से), "कांई" (क्या), "घणो" (बहुत)

🟢 Core Features:
1. **Admission**  
   - Only Diploma admissions available under DTE Rajasthan.  
   - Eligibility: Class 10th pass with minimum 35% marks.  
   - Admission Process: Online application via DTE website + Counseling.  
   - Dummy OTP flow: User must enter "7780" to proceed for counseling.  
   - If wrong OTP → deny access.  
   - Routes: \`/new-admission\` , \`/status\` , \`/counseling\` .  

2. **Exams**  
   - If user asks about exam → First ask: "Which semester exam info chahiye? (1st to 6th)"  
   - Provide hardcoded dates (example):  
     - 1st Sem: Jan 10, 2025  
     - 2nd Sem: Jan 12, 2025  
     - 3rd Sem: Jan 15, 2025  
     - 4th Sem: Jan 18, 2025  
     - 5th Sem: Jan 22, 2025  
     - 6th Sem: Jan 25, 2025  

3. **Results**  
   - If user asks result → Ask "Which semester ka result dekhna hai?"  
   - Provide dummy info (example):  
     - 1st Sem: Declared (link)  
     - 2nd Sem: Declared (link)  
     - 3rd Sem: Declared (link)  
     - 4th Sem: Coming Soon  
     - 5th Sem: Coming Soon  
     - 6th Sem: Coming Soon  

4. **Notices & News**  
   - Always give recent dummy data or API-fetched info.  
   - Example:  
     - "📢 Latest Notice: Diploma 6th Sem Practical Exam from Dec 20, 2025."  
     - "📰 News: Online counseling round-2 starts from Oct 15, 2025."  

🟢 General Conversation:
- If user says "how are you" in English → "I am fine, thank you! How can I assist you today?"
- If user says "कैसे हो" in Hindi → "Main bilkul theek hu ji 😃, aap batayein kaise hain?"  
- If user says "कांई हाल" in Rajasthani → "म्हैं ठीक हूं जी 😃, थानै कांई मदद चाहिए?"
- If user asks your name → Respond in their language:
  - English: "I am Saarthi – DTE Rajasthan Assistant."
  - Hindi: "Mera naam Saarthi hai – DTE Rajasthan ka friendly Assistant."
  - Rajasthani: "म्हारो नाम सारथी है – DTE राजस्थान को friendly Assistant."
- If user asks irrelevant question → reply politely in their language:
  - English: "This topic is not related to DTE Rajasthan, but I can help with Admission, Exam, Result and Notice info."
  - Hindi: "Ye topic DTE Rajasthan se related nahi hai ji, par main Admission, Exam, Result aur Notice ki info de sakta hu."
  - Rajasthani: "यो topic DTE राजस्थान सूं related कोनी है जी, पर म्हैं Admission, Exam, Result अर Notice की जाणकारी दे सकूं हूं।"

🎯 Rajasthani Response Examples:
- "घणो धन्यवाद" (Thank you very much)
- "कांई मदद चाहिए?" (What help do you need?)
- "थानै कोई problem है?" (Do you have any problem?)
- "म्हैं थारी मदद कर सकूं हूं" (I can help you)
- "official website देखो" (Check official website)

⚡ Rules:
- Always be fast, professional & bug-free.  
- Give factual answers only (Diploma-related).  
- Never say B.Tech is available under DTE Rajasthan.  
- Keep responses concise and helpful.
- Use emojis appropriately to make responses friendly.
- Match the user's language (English/Hindi/Rajasthani) in your response.
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
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Enhanced language detection with Rajasthani support
  const detectLanguage = (text) => {
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
    
    // Check for Hindi (Devanagari script)
    const hindiPattern = /[\u0900-\u097F]/
    if (hindiPattern.test(text)) {
      return 'hindi'
    }
    
    // Default to English
    return 'english'
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
    
    // Enhanced greeting detection
    if (/(hi|hello|hey|hii|helo|namaste|नमस्ते|ram ram|राम राम|हाय|हैलो)/.test(lower)) return 'greeting'
    
    // Enhanced casual conversation detection
    if (/(how are you|कैसे हो|how are you doing|कैसे हो तुम|कांई हाल|kaai haal|kya haal|क्या हाल|थारो हाल|tharo haal|kaise ho|कैसे हैं|kya haal hai|क्या हाल है)/.test(lower)) return 'how_are_you'
    
    // Goodbye detection
    if (/(bye|goodbye|alvida|अलविदा|tata|टाटा|see you|मिलते हैं)/.test(lower)) return 'goodbye'
    if (/(admission|प्रवेश|दाखिला|form|apply|आवेदन)/.test(lower)) {
      // Check for specific admission timing queries
      if (/(kab start|when start|कब शुरू|start date|शुरुआत)/.test(lower)) return 'admission_timing'
      return 'admission'
    }
    if (/(result|marks|score|परिणाम|रिजल्ट)/.test(lower)) return 'result'
    if (/(exam|test|परीक्षा)/.test(lower)) return 'exam'
    if (/(eligibility|qualify|criteria|पात्रता|योग्यता)/.test(lower)) return 'eligibility'
    if (/(notice|notification|announcement|सूचना|नोटिस)/.test(lower)) return 'notice'
    if (/(news|koi news|कोई news|समाचार)/.test(lower)) return 'news'
    if (/(special|विशेष)/.test(lower) && /(exam|test|परीक्षा|form|फॉर्म)/.test(lower)) return 'special_exam'
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

  // OpenAI API call function with enhanced error handling
  const callOpenAI = async (userMessage) => {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: chatbotPrompt
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
          frequency_penalty: 0.3,
          presence_penalty: 0.3
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`OpenAI API Error: ${response.status}`, errorData)
        
        // Handle specific error cases
        if (response.status === 429) {
          console.log('Rate limit exceeded, falling back to hardcoded responses')
        } else if (response.status === 401) {
          console.log('API key invalid, falling back to hardcoded responses')
        } else if (response.status >= 500) {
          console.log('OpenAI server error, falling back to hardcoded responses')
        }
        
        return null // Trigger fallback
      }

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim()
      } else {
        console.error('Unexpected API response format:', data)
        return null
      }
    } catch (error) {
      console.error('OpenAI API Network Error:', error)
      return null // Return null to trigger fallback
    }
  }

  // Enhanced response generation with proper hierarchy: Dataset → API → Fallback
  const generateResponse = async (message) => {
    const lang = detectLanguage(message)
    const intent = detectIntent(message)
    const lower = message.toLowerCase()

    // FIRST: Check if hardcoded dataset has the answer
    const datasetResponse = getDatasetResponse(intent, lang, lower)
    if (datasetResponse) {
      return { text: datasetResponse.text, language: lang, source: 'dataset' }
    }

    // SECOND: Try OpenAI API if dataset doesn't have answer
    try {
      const apiResponse = await callOpenAI(message)
      if (apiResponse) {
        return { text: apiResponse, language: lang, source: 'api' }
      }
    } catch (error) {
      console.log('API failed, using fallback')
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
      case 'greeting': {
        setLastIntent(null)
        setContextType(null)
        const greetingText = lang === 'english' 
          ? "Hello, I am Saarthi, the official DTE Rajasthan student assistant. I can help you with Admissions, Exams, Results, Notices, and Eligibility. How may I assist you today?"
          : lang === 'hindi'
          ? "नमस्ते, मैं सारथी हूँ, DTE राजस्थान का आधिकारिक छात्र सहायक। मैं आपको प्रवेश, परीक्षा, परिणाम, सूचनाएँ और पात्रता के बारे में मदद कर सकता हूँ। आप किसमें सहायता चाहते हैं?"
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
          ? `Diploma ${semNum}${semNum === '1' ? 'st' : semNum === '2' ? 'nd' : semNum === '3' ? 'rd' : 'th'} Semester Result ${resultDates[semNum]} ko declare ho chuka hai.`
          : lang === 'hindi'
          ? `डिप्लोमा ${semNum === '1' ? 'प्रथम' : semNum === '2' ? 'द्वितीय' : semNum === '3' ? 'तृतीय' : semNum === '4' ? 'चतुर्थ' : semNum === '5' ? 'पंचम' : 'षष्ठ'} सेमेस्टर परिणाम ${resultDates[semNum]} को घोषित हो चुका है।`
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
          ? `Diploma ${examSemNum}${examSemNum === '1' ? 'st' : examSemNum === '2' ? 'nd' : examSemNum === '3' ? 'rd' : 'th'} Semester Exam ${examDates[examSemNum]} se start ho raha hai.`
          : lang === 'hindi'
          ? `डिप्लोमा ${examSemNum === '1' ? 'प्रथम' : examSemNum === '2' ? 'द्वितीय' : examSemNum === '3' ? 'तृतीय' : examSemNum === '4' ? 'चतुर्थ' : examSemNum === '5' ? 'पंचम' : 'षष्ठ'} सेमेस्टर परीक्षा ${examDates[examSemNum]} से शुरू हो रही है।`
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
          id: prev => prev.length + 1, 
          text: botResponse.text, 
          sender: 'bot', 
          timestamp: new Date(), 
          language: botResponse.language,
          source: botResponse.source
        }
        
        setMessages(prev => [...prev, {
          ...botMessage,
          id: prev.length + 1
        }])
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
                            <p className="text-xs opacity-60">
                              {formatTime(message.timestamp)}
                            </p>
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