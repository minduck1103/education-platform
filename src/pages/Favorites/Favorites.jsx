import { useState, useEffect } from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getFavorites } from '../../services/api';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavorites('user_123');
      setFavorites(response.data.favorites);
    } catch (error) {
      toast.error('Không thể tải danh sách yêu thích');
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="favorites">
      <div className="container-standard">
        <div className="favorites-header">
          <h1>
            <FaHeart className="header-icon" />
            Khóa học yêu thích
          </h1>
          <p>Danh sách các khóa học bạn đã đánh dấu yêu thích</p>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map(course => (
              <div key={course.id} className="favorite-card">
                <img src={course.image} alt={course.name} />
                <div className="card-content">
                  <h3>{course.name}</h3>
                  <p className="description">{course.description}</p>
                  <div className="card-info">
                    <span className="instructor">👨‍🏫 {course.instructor}</span>
                    <span className="rating">⭐ {course.rating}</span>
                  </div>
                  <div className="card-footer">
                    <span className="price">{course.price.toLocaleString('vi-VN')}đ</span>
                    <button className="details-btn">Xem chi tiết</button>
                  </div>
                </div>
                <div className="favorite-badge">
                  <FaHeart />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <FaHeartBroken className="empty-icon" />
            <h2>Chưa có khóa học yêu thích</h2>
            <p>Hãy khám phá và thêm những khóa học bạn quan tâm vào danh sách yêu thích!</p>
            <a href="/" className="browse-btn">Khám phá khóa học</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 