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
  `- "${course.name}" (${course.category}) - ${course.price.toLocaleString('vi-VN')}đ - Rating: ${course.rating}/5 - ${course.description}`
).join('\n')}

YÊU CẦU:
1. Phân tích sở thích của học viên dựa trên lịch sử xem và yêu thích
2. Gợi ý 3-4 khóa học phù hợp nhất
3. Ưu tiên các khóa học có liên quan đến sở thích đã thể hiện
4. Không gợi ý các khóa học đã xem hoặc yêu thích
5. Giải thích lý do gợi ý

ĐỊNH DẠNG PHẢN HỒI (JSON):
{
  "suggestions": [
    {
      "courseId": "id_khóa_học",
      "courseName": "tên khóa học",
      "reason": "lý do gợi ý cụ thể",
      "confidence": 0.85
    }
  ],
  "analysis": "phân tích ngắn gọn về sở thích học viên",
  "overallReason": "lý do tổng quan cho việc gợi ý"
}

Chỉ trả về JSON, không thêm text khác.
  `;
};

// Gọi Gemini API để lấy gợi ý
export const getAICourseSuggestions = async (userProfile, availableCourses) => {
  try {
    // Kiểm tra API key
    if (!validateApiKey(GEMINI_CONFIG.apiKey)) {
      throw new Error('Gemini API key không hợp lệ');
    }

    // Tạo prompt
    const prompt = createSuggestionPrompt(userProfile, availableCourses);

    // Khởi tạo model
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: GEMINI_CONFIG.generationConfig,
      safetySettings: GEMINI_CONFIG.safetySettings
    });

    // Gọi Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse phản hồi JSON
    let parsedResponse;
    try {
      // Tìm và extract JSON từ response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Phản hồi từ AI không hợp lệ');
    }
    
    // Validate response structure
    if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions)) {
      throw new Error('Phản hồi từ AI không hợp lệ');
    }

    // Map courseId về course objects
    const suggestedCourses = parsedResponse.suggestions.map(suggestion => {
      const course = availableCourses.find(c => c.id === suggestion.courseId);
      return {
        ...course,
        aiReason: suggestion.reason,
        aiConfidence: suggestion.confidence
      };
    }).filter(course => course.id); // Remove invalid courses

    return {
      suggestions: suggestedCourses,
      analysis: parsedResponse.analysis,
      reason: parsedResponse.overallReason,
      confidence: parsedResponse.suggestions.reduce((acc, s) => acc + s.confidence, 0) / parsedResponse.suggestions.length,
      success: true
    };

  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    
    // Fallback to simple logic if Gemini fails
    const fallbackSuggestions = getFallbackSuggestions(userProfile, availableCourses);
    
    return {
      suggestions: fallbackSuggestions,
      analysis: "Phân tích dựa trên logic cơ bản do AI tạm thời không khả dụng",
      reason: "Gợi ý dựa trên các khóa học có rating cao và danh mục tương tự",
      confidence: 0.6,
      success: true,
      usedFallback: true
    };
  }
};

// Fallback logic khi Gemini không khả dụng
const getFallbackSuggestions = (userProfile, availableCourses) => {
  const { viewHistory, favorites, categories } = userProfile;
  
  // Lấy danh mục từ lịch sử xem và yêu thích
  const interestedCategories = [...new Set([
    ...viewHistory.map(c => c.category),
    ...favorites.map(c => c.category)
  ])];

  // Lọc các khóa học chưa xem/yêu thích
  const viewedIds = viewHistory.map(c => c.id);
  const favoriteIds = favorites.map(c => c.id);
  
  const candidateCourses = availableCourses.filter(course => 
    !viewedIds.includes(course.id) && !favoriteIds.includes(course.id)
  );

  // Ưu tiên các khóa học cùng danh mục và rating cao
  const suggestions = candidateCourses
    .map(course => ({
      ...course,
      priority: interestedCategories.includes(course.category) ? 2 : 1,
      aiReason: interestedCategories.includes(course.category) 
        ? `Cùng danh mục với sở thích của bạn: ${course.category}`
        : `Khóa học có rating cao: ${course.rating}/5`,
      aiConfidence: interestedCategories.includes(course.category) ? 0.8 : 0.6
    }))
    .sort((a, b) => b.priority * b.rating - a.priority * a.rating)
    .slice(0, 4);

  return suggestions;
};

// Test connection với Gemini
export const testGeminiConnection = async () => {
  try {
    if (!validateApiKey(GEMINI_CONFIG.apiKey)) {
      return { success: false, error: 'API key không hợp lệ' };
    }

    const model = genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 10,
      }
    });

    const result = await model.generateContent('Hello');
    const response = await result.response;
    const text = response.text();

    return { 
      success: true, 
      message: 'Kết nối Gemini thành công!',
      response: text
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export default {
  getAICourseSuggestions,
  testGeminiConnection
}; 