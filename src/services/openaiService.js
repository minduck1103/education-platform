import OpenAI from 'openai';
import { OPENAI_CONFIG, validateApiKey } from '../config/openai';

// Khởi tạo OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_CONFIG.apiKey,
  dangerouslyAllowBrowser: true // Chỉ cho development/demo
});

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

// Gọi OpenAI API để lấy gợi ý
export const getAICourseSuggestions = async (userProfile, availableCourses) => {
  try {
    // Kiểm tra API key
    if (!validateApiKey(OPENAI_CONFIG.apiKey)) {
      throw new Error('OpenAI API key không hợp lệ');
    }

    // Tạo prompt
    const prompt = createSuggestionPrompt(userProfile, availableCourses);

    // Gọi OpenAI API
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'Bạn là một AI chuyên gia về giáo dục, chuyên gợi ý khóa học phù hợp cho học viên dựa trên sở thích và hành vi học tập.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.maxTokens,
      response_format: { type: 'json_object' }
    });

    // Parse phản hồi
    const response = JSON.parse(completion.choices[0].message.content);
    
    // Validate response structure
    if (!response.suggestions || !Array.isArray(response.suggestions)) {
      throw new Error('Phản hồi từ AI không hợp lệ');
    }

    // Map courseId về course objects
    const suggestedCourses = response.suggestions.map(suggestion => {
      const course = availableCourses.find(c => c.id === suggestion.courseId);
      return {
        ...course,
        aiReason: suggestion.reason,
        aiConfidence: suggestion.confidence
      };
    }).filter(course => course.id); // Remove invalid courses

    return {
      suggestions: suggestedCourses,
      analysis: response.analysis,
      reason: response.overallReason,
      confidence: response.suggestions.reduce((acc, s) => acc + s.confidence, 0) / response.suggestions.length,
      success: true
    };

  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    
    // Fallback to simple logic if OpenAI fails
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

// Fallback logic khi OpenAI không khả dụng
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

// Test connection với OpenAI
export const testOpenAIConnection = async () => {
  try {
    if (!validateApiKey(OPENAI_CONFIG.apiKey)) {
      return { success: false, error: 'API key không hợp lệ' };
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5
    });

    return { 
      success: true, 
      message: 'Kết nối OpenAI thành công!',
      usage: completion.usage
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
  testOpenAIConnection
}; 