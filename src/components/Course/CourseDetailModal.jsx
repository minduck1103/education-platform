import { FaStar, FaStarHalfAlt, FaRegStar, FaClock, FaUsers, FaTag, FaGraduationCap } from 'react-icons/fa';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { useFavorites } from '../../contexts/FavoritesContext';

const CourseDetailModal = ({ course }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  
  if (!course) return null;

  const isCourseFavorited = isFavorite(course.id);

  // Mock additional course details
  const courseDetails = {
    duration: '8 tuần',
    students: '1,234',
    level: 'Trung bình',
    instructor: 'Nguyễn Văn An',
    rating: 4.8,
    totalReviews: 156,
    curriculum: [
      'Giới thiệu và cài đặt môi trường',
      'Cú pháp cơ bản và biến',
      'Vòng lặp và điều kiện',
      'Hàm và module',
      'Xử lý lỗi và debugging',
      'Dự án thực tế'
    ],
    features: [
      'Video HD chất lượng cao',
      'Tài liệu học tập PDF',
      'Bài tập thực hành',
      'Hỗ trợ 24/7',
      'Chứng chỉ hoàn thành'
    ],
    ...course
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(course);
  };

  return (
    <div className="max-w-none w-full">
      {/* Header với ảnh */}
      <div className="relative mb-6">
        <img 
          src={course.image} 
          alt={course.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute top-4 right-4 bg-ocean-600 text-white px-3 py-1 rounded-full font-semibold">
          {course.price.toLocaleString('vi-VN')}đ
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính - Thông tin khóa học */}
        <div className="lg:col-span-2">
          {/* Tiêu đề và rating */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{course.name}</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(courseDetails.rating)}</div>
                <span className="font-semibold text-gray-700">{courseDetails.rating}</span>
                <span className="text-gray-500">({courseDetails.totalReviews} đánh giá)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FaClock className="text-ocean-600" />
                <span>{courseDetails.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUsers className="text-ocean-600" />
                <span>{courseDetails.students} học viên</span>
              </div>
              <div className="flex items-center gap-1">
                <FaTag className="text-ocean-600" />
                <span>{courseDetails.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaGraduationCap className="text-ocean-600" />
                <span>{courseDetails.instructor}</span>
              </div>
            </div>
          </div>

          {/* Mô tả khóa học */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả khóa học</h3>
            <p className="text-gray-600 leading-relaxed">
              {course.description || 'Khóa học này sẽ cung cấp cho bạn kiến thức toàn diện và kỹ năng thực tế cần thiết. Với phương pháp giảng dạy hiện đại và bài tập thực hành phong phú, bạn sẽ nhanh chóng nắm vững các khái niệm cơ bản đến nâng cao.'}
            </p>
          </div>

          {/* Chương trình học */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Chương trình học</h3>
            <div className="space-y-3">
              {courseDetails.curriculum.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-ocean-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phụ - Thông tin mua */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-ocean-600 mb-2">
                  {course.price.toLocaleString('vi-VN')}đ
                </div>
                <p className="text-gray-500">Một lần thanh toán</p>
              </div>

              <button className="w-full bg-gradient-to-r from-ocean-600 to-ocean-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-ocean-500 hover:to-ocean-600 transition-all shadow-lg hover:shadow-xl mb-4">
                Đăng ký ngay
              </button>

              <button 
                onClick={handleFavoriteToggle}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all mb-6 flex items-center justify-center gap-2 whitespace-nowrap ${
                  isCourseFavorited 
                    ? 'bg-gradient-to-r from-ocean-600 to-ocean-700 text-white hover:bg-ocean-800' 
                    : 'border-2 border-ocean-600 text-ocean-600 hover:bg-ocean-50'
                }`}
              >
                {isCourseFavorited ? (
                  <HeartIcon className="w-5 h-5 text-white" />
                ) : (
                  <HeartOutlineIcon className="w-5 h-5 text-ocean-600" />
                )}
                <span className={isCourseFavorited ? 'text-white' : 'text-ocean-600'}>
                  {isCourseFavorited ? 'Đã yêu thích' : 'Yêu thích'}
                </span>
              </button>

              {/* Tính năng khóa học */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Khóa học bao gồm:</h4>
                <div className="space-y-2">
                  {courseDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-ocean-600 rounded-full"></div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Hoàn tiền 30 ngày</span>
                  <span>Học tập trọn đời</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal; 