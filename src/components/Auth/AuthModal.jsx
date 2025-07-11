import { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaUserPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = ({ onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = mode === 'login' ? validateLoginForm() : validateRegisterForm();
    if (!isValid) return;

    setLoading(true);
    
    let result;
    if (mode === 'login') {
      result = login(formData.email, formData.password);
    } else {
      result = register({
        fullName: formData.fullName.trim(),
        email: formData.email,
        password: formData.password
      });
    }
    
    if (result.success) {
      onClose();
    }
    
    setLoading(false);
  };

  const fillDemoData = () => {
    setFormData({
      ...formData,
      email: 'demo@eduplatform.com',
      password: 'demo123'
    });
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden w-full min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 px-8 py-6 relative">
        <h2 className="text-white text-xl font-bold">
          {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </h2>
        <p className="text-white/80 text-sm mt-1">
          {mode === 'login' 
            ? 'Chào mừng bạn quay trở lại!' 
            : 'Tạo tài khoản mới để bắt đầu học tập!'
          }
        </p>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-8 flex-1">

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name - Only for Register */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email {mode === 'register' && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập email của bạn"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu {mode === 'register' && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={mode === 'register' ? 'Nhập mật khẩu (ít nhất 6 ký tự)' : 'Nhập mật khẩu'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password - Only for Register */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Terms for Register */}
          {mode === 'register' && (
            <div className="text-sm text-gray-600">
              <p>
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-ocean-600 hover:text-ocean-800 font-semibold">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="#" className="text-ocean-600 hover:text-ocean-800 font-semibold">
                  Chính sách bảo mật
                </a>{' '}
                của chúng tôi.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 text-white py-3 px-4 rounded-lg font-semibold hover:from-ocean-500 hover:via-ocean-600 hover:to-ocean-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {mode === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
              </div>
            ) : (
              mode === 'login' ? 'Đăng nhập' : 'Đăng ký'
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
            <button
              onClick={switchMode}
              className="text-ocean-600 hover:text-ocean-800 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 