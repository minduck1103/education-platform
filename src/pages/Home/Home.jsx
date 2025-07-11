import { FaRobot } from 'react-icons/fa';
import { useSearch } from '../../contexts/SearchContext';
import bannerImage from '../../assets/banner.png';

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

        {/* AI Suggestions Button Section */}
        <section className="text-center mb-12">
          <button 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:from-ocean-500 hover:via-ocean-600 hover:to-ocean-700"
            onClick={handleGetSuggestions}
            disabled={loadingSuggestions}
          >
            <FaRobot className="text-xl" />
            {loadingSuggestions ? 'Đang phân tích...' : 'Gợi ý sản phẩm phù hợp'}
          </button>
        </section>

        {/* AI Suggestions Section */}
        {suggestions.length > 0 && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 rounded-xl p-6 border border-ocean-200">
              <h2 className="text-2xl font-bold text-ocean-800 mb-6 flex items-center gap-2">
                🤖 Gợi ý dành cho bạn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {suggestions.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-ocean-100">
                    <img src={course.image} alt={course.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{course.name}</h3>
                      <p className="text-xl font-bold text-ocean-600 mb-3">{course.price.toLocaleString('vi-VN')}đ</p>
                      <button className="w-full bg-gradient-to-r from-ocean-600 to-ocean-700 text-white py-2 px-4 rounded-md hover:from-ocean-500 hover:to-ocean-600 transition-all">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Courses Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {searchTerm || selectedCategory !== 'Tất cả' || selectedPriceRange.label !== 'Tất cả' 
              ? 'Kết quả tìm kiếm' 
              : 'Tất cả khóa học'
            } ({courses.length})
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
              <span className="ml-3 text-gray-600">Đang tải...</span>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                  <img src={course.image} alt={course.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-2 group-hover:text-ocean-600 transition-colors">{course.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-ocean-600">{course.price.toLocaleString('vi-VN')}đ</span>
                      <button className="bg-gradient-to-r from-ocean-600 to-ocean-700 text-white px-4 py-2 rounded-md hover:from-ocean-500 hover:to-ocean-600 transition-all shadow-md hover:shadow-lg">
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
    </div>
  );
};

export default Home; 