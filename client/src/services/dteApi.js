// API Base URLs
const API_BASE_URLS = {
  DTE: 'https://dte.rajasthan.gov.in/api',
  HTE: 'https://hte.rajasthan.gov.in/api',
  TECH_EDU: 'https://techedu.rajasthan.gov.in/api',
  RESULTS: 'https://dteapp.hte.rajasthan.gov.in/api'
};

// Helper function to handle API calls
const fetchFromApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// DTE Rajasthan API endpoints
export const DteApi = {
  // Get admission details
  getAdmissionDetails: async (program, year) => {
    return fetchFromApi(`${API_BASE_URLS.DTE}/admissions?program=${program}&year=${year}`);
  },
  
  // Get exam schedule
  getExamSchedule: async (program, semester) => {
    return fetchFromApi(`${API_BASE_URLS.DTE}/exams?program=${program}&semester=${semester}`);
  },
  
  // Get results
  getResults: async (program, semester, rollNumber) => {
    return fetchFromApi(`${API_BASE_URLS.RESULTS}/results?program=${program}&semester=${semester}&rollNumber=${rollNumber}`);
  },
  
  // Get notices
  getNotices: async (category = 'all', limit = 5) => {
    return fetchFromApi(`${API_BASE_URLS.DTE}/notices?category=${category}&limit=${limit}`);
  },
  
  // Get eligibility criteria
  getEligibility: async (program) => {
    return fetchFromApi(`${API_BASE_URLS.DTE}/eligibility?program=${program}`);
  }
};

// Translation service
export const translateText = async (text, targetLang) => {
  // In a real implementation, this would call a translation API
  // For now, we'll return the text as is and handle translation in the UI
  return { translatedText: text, detectedSourceLanguage: 'en' };
};
