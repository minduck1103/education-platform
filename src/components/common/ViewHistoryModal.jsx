import { useState, useEffect } from 'react';
import { FaClock, FaEye, FaTrash, FaGraduationCap, FaStar, FaUser } from 'react-icons/fa';
import { mockCourses } from '../../services/mockData';
import { formatPrice } from '../../services/api';
import Modal from './Modal';

const ViewHistoryModal = ({ isOpen, onClose, onCourseClick }) => {
  const [viewHistory, setViewHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load view history from localStorage
  useEffect(() => {
    if (isOpen) {
      loadViewHistory();
    }
  }, [isOpen]);

  const loadViewHistory = () => {
    try {
      setLoading(true);
      const historyIds = JSON.parse(localStorage.getItem('viewHistory') || '[]');

      // Map IDs to course objects
      const historyCourses = historyIds
        .map(id => mockCourses.find(course => course.id === id))
        .filter(course => course !== undefined); // Remove undefined courses

      setViewHistory(historyCourses);
    } catch (error) {
      console.error('Error loading view history:', error);
      setViewHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    onCourseClick(course);
    onClose();
  };

  const handleClearHistory = () => {
    localStorage.removeItem('viewHistory');
    setViewHistory([]);
  };

  const handleRemoveItem = (courseId) => {
    try {
      const historyIds = JSON.parse(localStorage.getItem('viewHistory') || '[]');
      const updatedIds = historyIds.filter(id => id !== courseId);
      localStorage.setItem('viewHistory', JSON.stringify(updatedIds));

      setViewHistory(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error removing item from history:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" noPadding={true}>
      <div className="bg-gradient-to-b from-ocean-50 to-white h-full flex flex-col rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 px-8 py-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <FaClock className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Lịch sử xem</h2>
                <p className="text-white/80 text-sm">
                  {viewHistory.length > 0 ? `${viewHistory.length} khóa học đã xem` : 'Chưa có khóa học nào'}
                </p>
              </div>
            </div>

            {viewHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
              >
                <FaTrash className="text-sm" />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-hidden flex flex-col min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean-600 border-t-transparent mx-auto mb-4"></div>
                <span className="text-gray-600 text-lg">Đang tải lịch sử...</span>
              </div>
            </div>
          ) : viewHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-ocean-100 to-cyan-100 p-8 rounded-2xl mx-auto max-w-md">
                <FaEye className="text-6xl text-ocean-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Chưa có lịch sử xem
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Hãy khám phá các khóa học thú vị!<br/>
                  Lịch sử xem sẽ hiển thị tại đây
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 view-history-scroll min-h-0">
              <div className="space-y-4 pb-4">
                {viewHistory.map((course, index) => (
                  <div
                    key={course.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-ocean-200 group transform hover:scale-[1.02]`}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: `fadeIn 0.5s ease-out forwards`
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Course Image */}
                        <div className="relative flex-shrink-0 group">
                          <img
                            src={course.image}
                            alt={course.name}
                            className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-ocean-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <FaEye className="text-white text-xl" />
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-ocean-600 transition-colors duration-200" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {course.name}
                          </h3>
                          <p className="text-gray-600 mt-1 flex items-center gap-1">
                            <FaUser className="text-xs" />
                            {course.instructor}
                          </p>
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="text-sm text-gray-500 flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <FaStar className="text-yellow-500" />
                              {course.rating}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                              <FaGraduationCap className="text-blue-500" />
                              {course.students} học viên
                            </span>
                            <span className="text-sm text-gray-500 bg-green-50 px-2 py-1 rounded-full">
                              {course.level}
                            </span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col items-end gap-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-ocean-600">
                              {formatPrice(course.price)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.duration}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCourseClick(course)}
                              className="px-4 py-2 bg-gradient-to-r from-ocean-600 to-ocean-700 text-white font-medium rounded-lg hover:from-ocean-700 hover:to-ocean-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                            >
                              <FaEye className="text-sm" />
                              Xem chi tiết
                            </button>
                            <button
                              onClick={() => handleRemoveItem(course.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Xóa khỏi lịch sử"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom Animation Styles */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Custom scrollbar */
          .view-history-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }

          .view-history-scroll::-webkit-scrollbar {
            width: 8px;
            -webkit-appearance: none;
          }

          .view-history-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
            margin: 8px 0;
          }

          .view-history-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }

          .view-history-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .view-history-scroll::-webkit-scrollbar-thumb:active {
            background: #64748b;
          }
        `}</style>
      </div>
    </Modal>
  );
};

export default ViewHistoryModal; 