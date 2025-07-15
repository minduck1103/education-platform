// Gemini AI Configuration
// API key được lưu trong file .env
// Ví dụ: VITE_GEMINI_API_KEY trong file .env

export const GEMINI_CONFIG = {
  apiKey: 'AIzaSyDIy1C3AyspMcq3aMcdtc8bZLuXtnfcTX8',
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
};

// Validate API key format
export const validateApiKey = (apiKey) => {
  if (!apiKey) return false;
  return apiKey.startsWith('AIza') && apiKey.length > 30;
}; 