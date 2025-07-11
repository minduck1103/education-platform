import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaHome, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../common/Modal';
import AuthModal from '../Auth/AuthModal';

const Header = () => {
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const openLoginModal = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  return (
    <header className="bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 shadow-lg sticky top-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center text-white text-xl md:text-2xl font-bold transition-transform duration-300 hover:scale-105">
          <FaGraduationCap className="text-2xl md:text-3xl mr-2 text-cyan-300" />
          <span className="font-sans tracking-tight hidden sm:block">EduPlatform</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="flex gap-4 md:gap-8">
            <Link 
              to="/" 
              className={`flex items-center text-white/90 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 font-medium hover:bg-white/20 hover:text-white hover:-translate-y-0.5 ${location.pathname === '/' ? 'bg-white/25 text-white shadow-lg' : ''}`}
            >
              <FaHome className="mr-0 md:mr-2 text-lg md:text-lg" />
              <span className="hidden md:block">Trang chủ</span>
            </Link>
          </nav>

          {/* Auth Section */}
          {isAuthenticated ? (
            /* User Dropdown */
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <img
                  src={currentUser?.profile?.avatar}
                  alt={currentUser?.profile?.fullName}
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                />
                <span className="hidden md:block font-medium">
                  {currentUser?.profile?.fullName}
                </span>
                <FaChevronDown className="text-sm" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      {currentUser?.profile?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaUser className="text-gray-400" />
                    Thông tin cá nhân
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FaSignOutAlt className="text-red-400" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons */
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1 md:gap-2 text-white/90 hover:text-white px-3 md:px-4 py-2 rounded-lg transition-all duration-300 font-medium hover:bg-white/20"
              >
                <FaSignInAlt className="text-sm md:text-base" />
                <span className="hidden sm:block">Đăng nhập</span>
              </button>
              
              <button
                onClick={openRegisterModal}
                className="flex items-center gap-1 md:gap-2 bg-white/20 text-white px-3 md:px-4 py-2 rounded-lg transition-all duration-300 font-medium hover:bg-white/30 hover:shadow-lg"
              >
                <FaUserPlus className="text-sm md:text-base" />
                <span className="hidden sm:block">Đăng ký</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        size="xl"
        showCloseButton={false}
        noPadding={true}
      >
        <AuthModal
          onClose={closeAuthModal}
          initialMode={authMode}
        />
      </Modal>

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header; 