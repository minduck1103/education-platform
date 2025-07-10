import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaHome } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 shadow-lg sticky top-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center text-white text-xl md:text-2xl font-bold transition-transform duration-300 hover:scale-105">
          <FaGraduationCap className="text-2xl md:text-3xl mr-2 text-cyan-300" />
          <span className="font-sans tracking-tight hidden sm:block">EduPlatform</span>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-4 md:gap-8">
          <Link 
            to="/" 
            className={`flex items-center text-white/90 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 font-medium hover:bg-white/20 hover:text-white hover:-translate-y-0.5 ${location.pathname === '/' ? 'bg-white/25 text-white shadow-lg' : ''}`}
          >
            <FaHome className="mr-0 md:mr-2 text-lg md:text-lg" />
            <span className="hidden md:block">Trang chủ</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 