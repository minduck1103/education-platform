import { useState } from 'react';
import { FaSearch, FaTimes, FaFilter, FaChevronDown } from 'react-icons/fa';
import { useSearch } from '../../contexts/SearchContext';

const SearchBar = () => {
  const { 
    searchTerm, 
    updateSearchTerm,
    selectedCategory, 
    selectedPriceRange, 
    categories, 
    priceRanges, 
    updateCategory, 
    updatePriceRange,
    clearFilters
  } = useSearch();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleClearSearch = () => {
    updateSearchTerm('');
  };

  const hasActiveFilters = selectedCategory !== 'Tất cả' || selectedPriceRange.label !== 'Tất cả';

  const handleClearFilters = () => {
    clearFilters();
    setIsFilterOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Search Input with integrated filter */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-sm" />
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          value={searchTerm}
          onChange={(e) => updateSearchTerm(e.target.value)}
          className="w-full pl-10 pr-20 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all backdrop-blur-sm"
        />
        
        {/* Right side controls */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="p-1 text-white/60 hover:text-white transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
          
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
              hasActiveFilters 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:bg-white/15 hover:text-white'
            }`}
          >
            <FaFilter className="text-sm" />
            {hasActiveFilters && (
              <span className="bg-cyan-300 text-ocean-800 text-xs px-1 py-0.5 rounded-full font-semibold leading-none">
                !
              </span>
            )}
            <FaChevronDown className={`text-xs transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50">
          <div className="px-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  Xóa tất cả
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="px-4 py-3 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => updateCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="px-4 py-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức giá
            </label>
            <select 
              value={selectedPriceRange.label}
              onChange={(e) => updatePriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all"
            >
              {priceRanges.map(range => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* Current Filters Display */}
          {hasActiveFilters && (
            <div className="px-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-2">Bộ lọc hiện tại:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'Tất cả' && (
                  <span className="inline-flex items-center gap-1 bg-ocean-100 text-ocean-800 text-xs px-2 py-1 rounded-full">
                    {selectedCategory}
                  </span>
                )}
                {selectedPriceRange.label !== 'Tất cả' && (
                  <span className="inline-flex items-center gap-1 bg-ocean-100 text-ocean-800 text-xs px-2 py-1 rounded-full">
                    {selectedPriceRange.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar; 