import { useState, useEffect } from 'react';
import { FaRobot, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getProducts, getSuggestions } from '../../services/api';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState({ label: 'Tất cả', min: 0, max: Infinity });
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        search: searchTerm,
        category: selectedCategory,
        priceRange: selectedPriceRange
      });
      setCourses(response.data.courses);
    } catch (error) {
      toast.error('Không thể tải danh sách khóa học');
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await getSuggestions('user_123');
      setSuggestions(response.data.suggestions);
      toast.success(`Tìm thấy ${response.data.suggestions.length} khóa học phù hợp!`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Update courses when filters change
  useEffect(() => {
    loadCourses();
  }, [searchTerm, selectedCategory, selectedPriceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            Khám phá khóa học phù hợp với bạn
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Nền tảng học tập thông minh với gợi ý AI cá nhân hóa
          </p>
          
          {/* AI Suggestions Button */}
          <button 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:from-ocean-500 hover:via-ocean-600 hover:to-ocean-700"
            onClick={handleGetSuggestions}
            disabled={loadingSuggestions}
          >
            <FaRobot className="text-xl" />
            {loadingSuggestions ? 'Đang phân tích...' : 'Gợi ý sản phẩm phù hợp'}
          </button>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white min-w-48"
              >
                <option value="Tất cả">Tất cả danh mục</option>
                <option value="Lập trình Frontend">Lập trình Frontend</option>
                <option value="Lập trình Backend">Lập trình Backend</option>
                <option value="Lập trình Python">Lập trình Python</option>
                <option value="Thiết kế UI/UX">Thiết kế UI/UX</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Data Science">Data Science</option>
              </select>

              <select 
                value={selectedPriceRange.label}
                onChange={(e) => {
                  const ranges = [
                    { label: 'Tất cả', min: 0, max: Infinity },
                    { label: 'Dưới 500K', min: 0, max: 500000 },
                    { label: '500K - 1 triệu', min: 500000, max: 1000000 },
                    { label: 'Trên 1 triệu', min: 1000000, max: Infinity }
                  ];
                  const range = ranges.find(r => r.label === e.target.value);
                  setSelectedPriceRange(range);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white min-w-48"
              >
                <option value="Tất cả">Tất cả mức giá</option>
                <option value="Dưới 500K">Dưới 500K</option>
                <option value="500K - 1 triệu">500K - 1 triệu</option>
                <option value="Trên 1 triệu">Trên 1 triệu</option>
              </select>
            </div>
          </div>
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