import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [onLoginRequired, setOnLoginRequired] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load favorites from localStorage on init
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('loomly_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('loomly_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const addToFavorites = (course) => {
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }
    
    if (!isFavorite(course.id)) {
      setFavorites(prev => [...prev, course]);
      toast.success(`Đã thêm "${course.name}" vào yêu thích`);
    }
  };

  const removeFromFavorites = (courseId) => {
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }
    
    const course = favorites.find(fav => fav.id === courseId);
    setFavorites(prev => prev.filter(fav => fav.id !== courseId));
    if (course) {
      toast.success(`Đã xóa "${course.name}" khỏi yêu thích`);
    }
  };

  const toggleFavorite = (course) => {
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }
    
    if (isFavorite(course.id)) {
      removeFromFavorites(course.id);
    } else {
      addToFavorites(course);
    }
  };

  const isFavorite = (courseId) => {
    return favorites.some(fav => fav.id === courseId);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    toast.success('Đã xóa tất cả khóa học yêu thích');
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length,
    setOnLoginRequired
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 