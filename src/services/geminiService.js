import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, validateApiKey } from '../config/gemini';

// Khởi tạo Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);

// Tạo prompt cho gợi ý khóa học
const createSuggestionPrompt = (userProfile, availableCourses) => {
  const { viewHistory, favorites, categories } = userProfile;
  
  return `
Bạn là một AI chuyên gia về giáo dục, nhiệm vụ của bạn là gợi ý khóa học phù hợp cho học viên.

THÔNG TIN HỌC VIÊN:
- Các khóa học đã xem: ${viewHistory.map(course => `"${course.name}" (${course.category})`).join(', ')}
- Các khóa học yêu thích: ${favorites.map(course => `"${course.name}" (${course.category})`).join(', ')}
- Các danh mục quan tâm: ${categories.join(', ')}

CÁC KHÓA HỌC CÓ SẴN:
${availableCourses.map(course => 
  `ID: ${course.id} | "${course.name}" - ${course.category} - ${course.price.toLocaleString('vi-VN')}đ - ${course.level}`
).join('\n')}

YÊU CẦU:
1. Phân tích sở thích của học viên dựa trên lịch sử xem và yêu thích
2. Gợi ý 3-5 khóa học phù hợp nhất (không gợi ý khóa học đã yêu thích)
3. Ưu tiên các khóa học cùng danh mục hoặc liên quan
4. Trả về CHÍNH XÁC theo format JSON sau:

{
  "suggestions": [
    {
      "courseId": "course_001",
      "reason": "Lý do gợi ý ngắn gọn",
      "confidence": 0.95
    }
  ],
  "analysis": "Phân tích ngắn gọn về sở thích học viên"
}

QUAN TRỌNG: Chỉ trả về JSON, không thêm text nào khác.`;
};

// Gợi ý khóa học bằng AI
export const getAICourseSuggestions = async (userProfile, availableCourses) => {
  try {
    // Kiểm tra API key
    if (!validateApiKey(GEMINI_CONFIG.apiKey)) {
      return getFallbackSuggestions(userProfile, availableCourses);
    }

    // Nếu không có dữ liệu người dùng, trả về fallback
    if (!userProfile.viewHistory.length && !userProfile.favorites.length) {
      return getFallbackSuggestions(userProfile, availableCourses);
    }

    // Tạo model
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: GEMINI_CONFIG.generationConfig,
      safetySettings: GEMINI_CONFIG.safetySettings
    });

    // Tạo prompt
    const prompt = createSuggestionPrompt(userProfile, availableCourses);

    // Gọi API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiResponse = JSON.parse(cleanedText);

    // Validate response structure
    if (!aiResponse.suggestions || !Array.isArray(aiResponse.suggestions)) {
      return getFallbackSuggestions(userProfile, availableCourses);
    }

    // Map courseId to actual course objects
    const suggestions = aiResponse.suggestions
      .map(suggestion => {
        const course = availableCourses.find(c => c.id === suggestion.courseId);
        return course ? { ...course, aiReason: suggestion.reason, confidence: suggestion.confidence } : null;
      })
      .filter(Boolean)
      .slice(0, 5);

    return {
      suggestions,
      analysis: aiResponse.analysis,
      reason: 'Gợi ý được tạo bởi AI dựa trên sở thích của bạn',
      confidence: suggestions.length > 0 ? suggestions[0].confidence : 0.5,
      usedAI: true,
      usedFallback: false
    };

  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return getFallbackSuggestions(userProfile, availableCourses);
  }
};

// Fallback suggestions when AI fails
const getFallbackSuggestions = (userProfile, availableCourses) => {
  const { viewHistory, favorites, categories } = userProfile;
  
  // Get favorite course IDs
  const favoriteIds = favorites.map(fav => fav.id);
  
  // Filter out already favorited courses
  const candidateCourses = availableCourses.filter(course => 
    !favoriteIds.includes(course.id)
  );
  
  // Priority 1: Same categories as viewed/favorited courses
  const relatedCourses = candidateCourses.filter(course => 
    categories.includes(course.category)
  );
  
  // Priority 2: Popular courses (high rating)
  const popularCourses = candidateCourses
    .filter(course => course.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating);
  
  // Combine and deduplicate
  const suggestions = [...relatedCourses, ...popularCourses]
    .filter((course, index, self) => self.findIndex(c => c.id === course.id) === index)
    .slice(0, 5);

  return {
    suggestions,
    analysis: categories.length > 0 ? 
      `Dựa trên sở thích về ${categories.join(', ')}, chúng tôi gợi ý những khóa học tương tự.` :
      'Chúng tôi gợi ý những khóa học phổ biến và chất lượng cao.',
    reason: 'Gợi ý dựa trên danh mục quan tâm và độ phổ biến',
    confidence: 0.7,
    usedAI: false,
    usedFallback: true
  };
};

// Chatbot response function cho ChatbotService sử dụng
export const getChatbotResponse = async (prompt) => {
  try {
    // Validate API key first
    if (!validateApiKey(GEMINI_CONFIG.apiKey)) {
      console.warn('⚠️ Gemini API key không hợp lệ hoặc chưa được cấu hình. Chatbot sẽ sử dụng fallback responses.');
      return null;
    }

    // Tạo fresh GoogleGenerativeAI instance
    const currentGenAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
    const model = currentGenAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024, // Giảm để tránh lỗi
      },
      safetySettings: GEMINI_CONFIG.safetySettings
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini API');
    }
    
    return text.trim();
  } catch (error) {
    console.error('Gemini chatbot error:', error);
    throw error;
  }
};

export default {
  getAICourseSuggestions,
  getChatbotResponse
}; 