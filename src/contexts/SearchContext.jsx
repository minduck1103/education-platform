import { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, getSuggestions } from '../services/api';
import { toast } from 'react-toastify';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState({ label: 'Tất cả', min: 0, max: Infinity });
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const categories = [
    'Tất cả',
    'Lập trình Frontend',
    'Lập trình Backend', 
    'Lập trình Python',
    'Thiết kế UI/UX',
    'Digital Marketing',
    'Data Science'
  ];

  const priceRanges = [
    { label: 'Tất cả', min: 0, max: Infinity },
    { label: 'Dưới 500K', min: 0, max: 500000 },
    { label: '500K - 1 triệu', min: 500000, max: 1000000 },
    { label: 'Trên 1 triệu', min: 1000000, max: Infinity }
  ];

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

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  const updateCategory = (category) => {
    setSelectedCategory(category);
  };

  const updatePriceRange = (rangeLabel) => {
    const range = priceRanges.find(r => r.label === rangeLabel);
    setSelectedPriceRange(range);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả');
    setSelectedPriceRange({ label: 'Tất cả', min: 0, max: Infinity });
  };

  // Load courses when filters change
  useEffect(() => {
    loadCourses();
  }, [searchTerm, selectedCategory, selectedPriceRange]);

  // Load initial data
  useEffect(() => {
    loadCourses();
  }, []);

  const value = {
    courses,
    loading,
    searchTerm,
    selectedCategory,
    selectedPriceRange,
    suggestions,
    loadingSuggestions,
    categories,
    priceRanges,
    updateSearchTerm,
    updateCategory,
    updatePriceRange,
    handleGetSuggestions,
    clearFilters,
    loadCourses
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 