import { FaExclamationTriangle, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Modal from './Modal';

const LoginRequiredModal = ({ isOpen, onClose, onLoginClick, onRegisterClick, message = "Bạn cần đăng nhập để có thể thêm khóa học vào danh sách yêu thích của mình." }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-6">
        <div className="text-6xl text-red-500 mb-4">
          <FaExclamationTriangle className="mx-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Yêu cầu đăng nhập
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 bg-gradient-to-r from-ocean-600 to-ocean-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-ocean-500 hover:to-ocean-600 transition-all shadow-lg hover:shadow-xl"
          >
            <FaSignInAlt className="text-sm" />
            Đăng nhập
          </button>
          
          <button
            onClick={onRegisterClick}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
          >
            <FaUserPlus className="text-sm" />
            Đăng ký
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 underline"
        >
          Để sau
        </button>
      </div>
    </Modal>
  );
};

export default LoginRequiredModal; 