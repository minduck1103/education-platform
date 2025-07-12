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
  const [suggestionData, setSuggestionData] = useState(null); // Thêm state cho suggestion data
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const categories = [
    'Tất cả',
    'Lập trình Frontend',
    'Lập trình Backend', 
    'Lập trình Python',
    'Thiết kế UI/UX',
    'Digital Marketing',
    'Data Science',
    'Mobile Development',
    'Ngoại ngữ',
    'Cloud Computing'
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
      
      // Lưu suggestions và suggestion data
      setSuggestions(response.data.suggestions);
      setSuggestionData({
        analysis: response.data.analysis,
        reason: response.data.reason,
        confidence: response.data.confidence,
        usedAI: response.data.usedAI,
        usedFallback: response.data.usedFallback
      });
      
      // Hiển thị toast thông báo
      const message = response.data.usedAI 
        ? `AI đã phân tích và tìm thấy ${response.data.suggestions.length} khóa học phù hợp!`
        : `Tìm thấy ${response.data.suggestions.length} khóa học phù hợp!`;
      
      toast.success(message);
      

      
    } catch (error) {
      toast.error(error.message || 'Không thể lấy gợi ý lúc này');
      console.error('Error getting suggestions:', error);
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

  const clearSuggestions = () => {
    setSuggestions([]);
    setSuggestionData(null);
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
    suggestionData, // Thêm vào context value
    loadingSuggestions,
    categories,
    priceRanges,
    updateSearchTerm,
    updateCategory,
    updatePriceRange,
    handleGetSuggestions,
    clearFilters,
    clearSuggestions, // Thêm function clear suggestions
    loadCourses
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 