import { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = ({ onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-ocean-600 via-ocean-700 to-ocean-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-xl font-bold">
                {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </h1>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === 'login' ? (
              <Login 
                onSwitchToRegister={switchToRegister}
                onClose={onClose}
              />
            ) : (
              <Register 
                onSwitchToLogin={switchToLogin}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 