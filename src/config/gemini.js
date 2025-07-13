// Gemini AI Configuration
// API key được lưu trong file .env
// Ví dụ: VITE_GEMINI_API_KEY trong file .env

export const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
};

// Kiểm tra API key có hợp lệ không
export const validateApiKey = (apiKey) => {
  return apiKey && apiKey.startsWith('AIza') && apiKey.length > 30;
}; 