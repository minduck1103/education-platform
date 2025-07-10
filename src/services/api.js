import axios from 'axios';
import { mockCourses, mockUser } from './mockData';

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

// GET /api/suggestions?userId=xxx - Gợi ý AI
export const getSuggestions = async (userId) => {
  try {
    // Mock AI logic based on user behavior
    const user = mockUser;
    const viewedCourses = user.viewHistory;
    const favoriteCourses = user.favorites;
    
    // Simple recommendation logic:
    // 1. Courses in similar categories as viewed/favorited
    // 2. Courses not yet viewed
    // 3. Higher rated courses
    
    const viewedCategories = mockCourses
      .filter(course => viewedCourses.includes(course.id))
      .map(course => course.category);
    
    const suggestions = mockCourses
      .filter(course => 
        !viewedCourses.includes(course.id) && // Not viewed yet
        !favoriteCourses.includes(course.id) && // Not in favorites
        (viewedCategories.includes(course.category) || course.rating >= 4.6) // Similar category or high rating
      )
      .sort((a, b) => b.rating - a.rating) // Sort by rating
      .slice(0, 4); // Top 4 suggestions
    
    return await mockApiDelay({
      suggestions,
      reason: "Dựa trên lịch sử xem và sở thích của bạn",
      confidence: 0.85,
      success: true
    }, 1000); // Longer delay to simulate AI processing
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