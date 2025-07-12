import axios from 'axios';
import { mockCourses, mockUser } from './mockData';
import { getAICourseSuggestions } from './openaiService';

// Base URL cho API (giả lập)
const API_BASE_URL = 'http://localhost:3001/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Mock API responses - thay thế cho backend thật
const mockApiDelay = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ data }), delay);
  });
};

// API Functions

// GET /api/products - Lấy danh sách khóa học
export const getProducts = async (params = {}) => {
  try {
    // Simulate API call với filtering
    const { search, category, priceRange } = params;
    
    let filteredCourses = [...mockCourses];
    
    // Filter by search term
    if (search) {
      filteredCourses = filteredCourses.filter(course =>
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by category
    if (category && category !== 'Tất cả') {
      filteredCourses = filteredCourses.filter(course =>
        course.category === category
      );
    }
    
    // Filter by price range
    if (priceRange && priceRange.label !== 'Tất cả') {
      filteredCourses = filteredCourses.filter(course =>
        course.price >= priceRange.min && course.price < priceRange.max
      );
    }
    
    return await mockApiDelay({
      courses: filteredCourses,
      total: filteredCourses.length,
      success: true
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Không thể tải danh sách khóa học');
  }
};

// GET /api/suggestions?userId=xxx - Gợi ý AI với OpenAI
export const getSuggestions = async (userId) => {
  try {
    // Lấy thông tin user từ mock data
    const user = mockUser;
    
    // Lấy các khóa học đã xem và yêu thích
    const viewedCourses = mockCourses.filter(course => 
      user.viewHistory.includes(course.id)
    );
    
    const favoriteCourses = mockCourses.filter(course => 
      user.favorites.includes(course.id)
    );
    
    // Lấy danh mục quan tâm
    const interestedCategories = [...new Set([
      ...viewedCourses.map(c => c.category),
      ...favoriteCourses.map(c => c.category)
    ])];
    
    // Tạo user profile cho OpenAI
    const userProfile = {
      userId,
      viewHistory: viewedCourses,
      favorites: favoriteCourses,
      categories: interestedCategories
    };
    
    // Lấy các khóa học có thể gợi ý (chưa xem/yêu thích)
    const availableCourses = mockCourses.filter(course => 
      !user.viewHistory.includes(course.id) && 
      !user.favorites.includes(course.id)
    );
    
    // Gọi OpenAI API để lấy gợi ý
    const aiResponse = await getAICourseSuggestions(userProfile, availableCourses);
    
    // Thêm mock delay để giống API thật
    return await mockApiDelay({
      suggestions: aiResponse.suggestions,
      reason: aiResponse.reason,
      analysis: aiResponse.analysis,
      confidence: aiResponse.confidence,
      success: true,
      usedAI: !aiResponse.usedFallback,
      usedFallback: aiResponse.usedFallback || false
    }, 1500); // Delay lâu hơn vì AI processing
    
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw new Error('Không thể lấy gợi ý lúc này. Vui lòng thử lại sau!');
  }
};

// POST/GET /api/favorites - Quản lý danh sách yêu thích
export const getFavorites = async (userId) => {
  try {
    const favoriteIds = mockUser.favorites;
    const favoriteCourses = mockCourses.filter(course => 
      favoriteIds.includes(course.id)
    );
    
    return await mockApiDelay({
      favorites: favoriteCourses,
      success: true
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw new Error('Không thể tải danh sách yêu thích');
  }
};

export const toggleFavorite = async (userId, courseId) => {
  try {
    // Simulate toggle favorite
    const isFavorite = mockUser.favorites.includes(courseId);
    
    if (isFavorite) {
      // Remove from favorites
      mockUser.favorites = mockUser.favorites.filter(id => id !== courseId);
    } else {
      // Add to favorites  
      mockUser.favorites.push(courseId);
    }
    
    return await mockApiDelay({
      success: true,
      action: isFavorite ? 'removed' : 'added',
      courseId,
      message: isFavorite ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích'
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Không thể cập nhật danh sách yêu thích');
  }
};

// Get course by ID
export const getCourseById = async (courseId) => {
  try {
    const course = mockCourses.find(course => course.id === courseId);
    
    if (!course) {
      throw new Error('Không tìm thấy khóa học');
    }
    
    // Add to view history
    if (!mockUser.viewHistory.includes(courseId)) {
      mockUser.viewHistory.unshift(courseId);
      // Keep only last 10 viewed courses
      mockUser.viewHistory = mockUser.viewHistory.slice(0, 10);
    }
    
    return await mockApiDelay({
      course,
      success: true
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Không thể tải thông tin khóa học');
  }
};

// Get view history
export const getViewHistory = async (userId) => {
  try {
    const historyIds = mockUser.viewHistory;
    const historyCourses = mockCourses.filter(course => 
      historyIds.includes(course.id)
    ).sort((a, b) => {
      // Sort by view order (most recent first)
      return historyIds.indexOf(a.id) - historyIds.indexOf(b.id);
    });
    
    return await mockApiDelay({
      history: historyCourses,
      success: true
    });
  } catch (error) {
    console.error('Error fetching view history:', error);
    throw new Error('Không thể tải lịch sử xem');
  }
};

// Check if course is favorite
export const isFavorite = (courseId) => {
  return mockUser.favorites.includes(courseId);
};

// Format price to VND
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export default api; 