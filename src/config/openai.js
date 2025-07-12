// OpenAI Configuration
// Trong thực tế, API key nên được lưu trong file .env
// Ví dụ: VITE_OPENAI_API_KEY trong file .env

export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
  baseURL: 'https://api.openai.com/v1'
};

// Kiểm tra API key có hợp lệ không
export const validateApiKey = (apiKey) => {
  return apiKey && apiKey.startsWith('sk-') && apiKey.length > 20;
};

 