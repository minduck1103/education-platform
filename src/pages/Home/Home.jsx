import { useState } from 'react';
import { FaRobot, FaMagic } from 'react-icons/fa';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContext';
import bannerImage from '../../assets/banner.png';
import Modal from '../../components/common/Modal';
import CourseDetailModal from '../../components/Course/CourseDetailModal';
import LoginRequiredModal from '../../components/common/LoginRequiredModal';
import AuthModal from '../../components/Auth/AuthModal';

const Home = () => {
  const { 
    courses, 
    loading, 
    searchTerm, 
    selectedCategory, 
    selectedPriceRange, 
    suggestions, 
    loadingSuggestions,
    handleGetSuggestions
  } = useSearch();

  const { isAuthenticated } = useAuth();

  // Modal state
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Handle course detail modal
  const handleCourseClick = (course) => {
    // Track view history
    try {
      const existingHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
      const updatedHistory = [course.id, ...existingHistory.filter(id => id !== course.id)].slice(0, 10);
      localStorage.setItem('viewHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error updating view history:', error);
    }
    
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const closeCourseDetail = () => {
    setShowCourseDetail(false);
    setSelectedCourse(null);
  };

  // Handle suggestions with authentication check
  const handleSuggestionsClick = () => {
    if (!isAuthenticated) {
      setShowLoginRequired(true);
      return;
    }
    handleGetSuggestions();
  };

  // Handle login required modal
  const handleLoginClick = () => {
    setShowLoginRequired(false);
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setShowLoginRequired(false);
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleCloseLoginRequired = () => {
    setShowLoginRequired(false);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  // Format filters cho hiển thị
  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm) filters.push(`"${searchTerm}"`);
    if (selectedCategory !== 'Tất cả') filters.push(selectedCategory);
    if (selectedPriceRange.label !== 'Tất cả') filters.push(selectedPriceRange.label);
    return filters.join(', ') || 'Tất cả khóa học';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner Section */}
        <section className="mb-8">
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <img 
              src={bannerImage} 
              alt="Banner Loomly" 
              className="w-full h-64 md:h-80 lg:h-96 xl:h-[28rem] object-contain bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50"
            />
          </div>
        </section>
        {/* AI Suggestions Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaRobot className="text-3xl text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                Gợi ý thông minh dành cho bạn
              </h2>
              <FaMagic className="text-3xl text-yellow-500" />
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hệ thống AI phân tích sở thích và đưa ra gợi ý khóa học phù hợp nhất
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleSuggestionsClick}
              disabled={loadingSuggestions}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              <FaRobot className="text-xl" />
              {loadingSuggestions ? 'AI đang phân tích...' : 'Gợi ý sản phẩm phù hợp'}
              {loadingSuggestions && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
            </button>
          </div>



          {/* Suggestions Grid */}
          {suggestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suggestions.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1 border border-purple-100">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.name} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      AI Gợi ý
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">{course.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{course.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">{course.price.toLocaleString('vi-VN')}đ</span>
                      <button 
                        onClick={() => handleCourseClick(course)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:from-purple-500 hover:to-pink-500 transition-all shadow-md hover:shadow-lg"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Main Courses Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Khóa học ({getActiveFilters()})
            </h2>
            <div className="text-sm text-gray-600">
              {courses.length} khóa học được tìm thấy
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.name} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-2 group-hover:text-ocean-600 transition-colors">{course.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-ocean-600">{course.price.toLocaleString('vi-VN')}đ</span>
                      <button 
                        onClick={() => handleCourseClick(course)}
                        className="bg-gradient-to-r from-ocean-600 to-ocean-700 text-white px-4 py-2 rounded-md hover:from-ocean-500 hover:to-ocean-600 transition-all shadow-md hover:shadow-lg"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-500 text-lg mb-2">🔍</div>
              <p className="text-gray-600">Không tìm thấy khóa học phù hợp</p>
            </div>
          )}
        </section>
      </div>

      {/* Course Detail Modal */}
      <Modal
        isOpen={showCourseDetail}
        onClose={closeCourseDetail}
        size="3xl"
        showCloseButton={true}
      >
        <CourseDetailModal course={selectedCourse} />
      </Modal>

      {/* Login Required Modal */}
      <LoginRequiredModal 
        isOpen={showLoginRequired}
        onClose={handleCloseLoginRequired}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        message="Bạn cần đăng nhập để có thể sử dụng tính năng gợi ý khóa học thông minh."
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={handleCloseAuth}
          initialMode={authMode}
        />
      )}
    </div>
  );
};

export default Home; 