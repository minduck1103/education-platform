import { useState } from 'react';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '../../contexts/FavoritesContext';
import Modal from '../../components/common/Modal';
import CourseDetailModal from '../../components/Course/CourseDetailModal';

const Favorites = () => {
  const { favorites, removeFromFavorites, clearAllFavorites, favoritesCount } = useFavorites();
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Handle course detail modal
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const closeCourseDetail = () => {
    setShowCourseDetail(false);
    setSelectedCourse(null);
  };

  const handleRemoveFavorite = (e, courseId) => {
    e.stopPropagation(); // Prevent triggering course detail modal
    removeFromFavorites(courseId);
  };

  if (favoritesCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">✨</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Chưa có khóa học yêu thích
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Hãy khám phá và thêm những khóa học bạn quan tâm vào danh sách yêu thích
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-ocean-600 to-ocean-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-ocean-500 hover:to-ocean-600 transition-all shadow-lg hover:shadow-xl"
            >
              Khám phá khóa học
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              Yêu thích của tôi
            </h1>
            <p className="text-gray-600 mt-2">
              {favoritesCount} khóa học đã lưu
            </p>
          </div>
          
          {favoritesCount > 0 && (
            <button
              onClick={clearAllFavorites}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 border border-red-200 hover:border-red-300 rounded-lg transition-all"
            >
              <TrashIcon className="w-4 h-4" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(course => (
            <div 
              key={course.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                
                {/* Remove from favorites button */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, course.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 hover:text-red-600 p-2.5 rounded-full shadow-lg transition-all hover:scale-110"
                  title="Xóa khỏi yêu thích"
                >
                  <HeartIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-2 group-hover:text-ocean-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-ocean-600">
                    {course.price.toLocaleString('vi-VN')}đ
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                      className="bg-gradient-to-r from-ocean-600 to-ocean-700 text-white px-3 py-2 rounded-md hover:from-ocean-500 hover:to-ocean-600 transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detail Modal */}
        <Modal
          isOpen={showCourseDetail}
          onClose={closeCourseDetail}
          size="3xl"
          showCloseButton={true}
        >
          <CourseDetailModal 
            course={selectedCourse}
            onClose={closeCourseDetail}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Favorites; 