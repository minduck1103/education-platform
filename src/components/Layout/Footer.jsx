import { FaGraduationCap, FaHeart, FaCode } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center text-2xl font-bold mb-2">
            <FaGraduationCap className="mr-2 text-yellow-400 text-3xl" />
            <span>EduPlatform</span>
          </div>
          <p className="text-white/80 text-lg">
            Nền tảng giáo dục trực tuyến với gợi ý thông minh
          </p>
        </div>
        
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/70 text-sm flex items-center justify-center gap-1">
            © 2024 EduPlatform. Made with <FaHeart className="text-red-500 animate-heartbeat" /> and <FaCode className="text-blue-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 