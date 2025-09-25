// Language detection and persistence utilities

export const detectLanguage = (text, currentLanguage = null, setLanguage = null) => {
  const lower = text.toLowerCase()

  // Check for language switch commands - more flexible patterns
  // Hindi switching patterns
  if (/(hindi|हिंदी|हिन्दी)/.test(lower) && /(me|mein|में|मैं|se|से)/.test(lower) && /(baat|बात|karo|करो|karte|करते|hain|हैं|talk|speak|bol|बोल)/.test(lower)) {
    const lang = 'hindi'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // English switching patterns
  if (/(english|अंग्रेजी|इंग्लिश|angrezi)/.test(lower) && /(me|mein|में|मैं|se|से)/.test(lower) && /(baat|बात|karo|करो|karte|करते|hain|हैं|talk|speak|bol|बोल)/.test(lower)) {
    const lang = 'english'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // Rajasthani switching patterns - multiple variations
  if (/(rajasthani|marwari|राजस्थानी|मारवाड़ी)/.test(lower) && /(me|mein|में|मैं|se|से)/.test(lower) && /(baat|बात|karo|करो|karte|करते|hain|हैं|talk|speak|bol|बोल)/.test(lower)) {
    const lang = 'rajasthani'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // Hinglish switching patterns
  if (/(hinglish|हिंग्लिश|mix|मिक्स)/.test(lower) && /(me|mein|में|मैं|se|से)/.test(lower) && /(baat|बात|karo|करो|karte|करते|hain|हैं|talk|speak|bol|बोल)/.test(lower)) {
    const lang = 'hinglish'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // Simple language switch commands without "baat karo"
  if (/(^|\s)(hindi|हिंदी|हिन्दी)(\s|$)/.test(lower) && /(karo|करो|please|plz|kar|कर)/.test(lower)) {
    const lang = 'hindi'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  if (/(^|\s)(english|अंग्रेजी|इंग्लिश)(\s|$)/.test(lower) && /(karo|करो|please|plz|kar|कर)/.test(lower)) {
    const lang = 'english'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // More natural language switching phrases
  if (/(^|\s)(hindi|हिंदी|हिन्दी)(\s|$)/.test(lower) && /(switch|change|badal|बदल|use| इस्तेमाल)/.test(lower)) {
    const lang = 'hindi'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  if (/(^|\s)(english|अंग्रेजी|इंग्लिश)(\s|$)/.test(lower) && /(switch|change|badal|बदल|use| इस्तेमाल)/.test(lower)) {
    const lang = 'english'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // Direct language commands
  if (/^(hindi|हिंदी|हिन्दी)$/.test(lower.trim())) {
    const lang = 'hindi'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  if (/^(english|अंग्रेजी|इंग्लिश)$/.test(lower.trim())) {
    const lang = 'english'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  if (/^(rajasthani|marwari|राजस्थानी|मारवाड़ी)$/.test(lower.trim())) {
    const lang = 'rajasthani'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  if (/^(hinglish|हिंग्लिश|mix|मिक्स)$/.test(lower.trim())) {
    const lang = 'hinglish'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // If we have a set language, use it
  if (currentLanguage) {
    return currentLanguage
  }

  // Rajasthani specific patterns and words - CHECK FIRST
  const rajasthaniPatterns = [
    /राम राम/, /कांई/, /थानै/, /म्हैं/, /घणो/, /को/, /सूं/, /होई/, /हाल/, /धन्यवाद/,
    /ram ram/, /kaai/, /thane/, /mhain/, /ghano/, /hoi/, /dhanyawad/,
    /राम/, /रामजी/, /जी/, /हूं/, /है/, /करूं/, /करो/, /कर/, /थारा/, /थारी/, /थारो/,
    /ram/, /ji/, /hoon/, /hai/, /karun/, /karo/, /kar/, /thara/, /thari/, /tharo/,
    /कांई हाल/, /थारो हाल/, /म्हारा हाल/, /बधिया/, /चाल/, /ठीक/, /माफ करो/,
    /kaai haal/, /tharo haal/, /mhara haal/, /badhiya/, /chaal/, /theek/, /maaf karo/
  ]

  // Check for Rajasthani patterns FIRST
  for (const pattern of rajasthaniPatterns) {
    if (pattern.test(lower)) {
      const lang = 'rajasthani'
      if (setLanguage) setLanguage(lang)
      return lang
    }
  }

  // Check for pure Hindi (mostly Devanagari script) - AFTER Rajasthani check
  const hindiPattern = /[\u0900-\u097F]/
  const englishPattern = /[a-zA-Z]/

  if (hindiPattern.test(text) && !englishPattern.test(text)) {
    const lang = 'hindi'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // Check for Hinglish (mix of Hindi and English)
  if (hindiPattern.test(text) && englishPattern.test(text)) {
    const lang = 'hinglish'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // Check for common Hinglish words in Roman script
  const hinglishWords = /\b(kya|hai|hoon|kaise|kab|kahan|kyun|main|aap|tum|kar|karo|chahiye|batao|dekho|samjha|theek|accha|nahi|haan|ji|bhai)\b/
  if (hinglishWords.test(lower)) {
    const lang = 'hinglish'
    if (setLanguage) setLanguage(lang)
    return lang
  }

  // Default to English if no language is set
  return 'english'
}
