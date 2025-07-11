import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Mock users data
const mockUsers = [
  {
    id: 1,
    email: "demo@eduplatform.com",
    passwordHash: "ZGVtbzEyMw==", // "demo123" in base64
    profile: {
      fullName: "Nguyễn Văn Demo",
      avatar: "https://i.pravatar.cc/150?u=demo",
      bio: "Học viên demo của EduPlatform",
      joinedAt: "2024-01-01T00:00:00Z"
    },
    favorites: [1, 3],
    enrolledCourses: [1, 2],
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    email: "admin@eduplatform.com", 
    passwordHash: "YWRtaW4xMjM=", // "admin123" in base64
    profile: {
      fullName: "Admin EduPlatform",
      avatar: "https://i.pravatar.cc/150?u=admin",
      bio: "Quản trị viên hệ thống",
      joinedAt: "2024-01-01T00:00:00Z"
    },
    favorites: [],
    enrolledCourses: [],
    createdAt: "2024-01-01T00:00:00Z"
  }
];

// Initialize localStorage with mock users if not exists
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(mockUsers));
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        sessionStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Save user to sessionStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        atob(u.passwordHash) === password
      );
      
      if (user) {
        setCurrentUser(user);
        toast.success(`Chào mừng ${user.profile.fullName} !`);
        return { success: true, user };
      } else {
        toast.error('Email hoặc mật khẩu không đúng!');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng nhập!');
      return { success: false, error: error.message };
    }
  };

  const register = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      const existingUser = users.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (existingUser) {
        toast.error('Email đã được sử dụng!');
        return { success: false, error: 'Email already exists' };
      }

      const newUser = {
        id: Date.now(),
        email: userData.email.toLowerCase(),
        passwordHash: btoa(userData.password), // Simple base64 encoding
        profile: {
          fullName: userData.fullName,
          avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
          bio: '',
          joinedAt: new Date().toISOString()
        },
        favorites: [],
        enrolledCourses: [],
        createdAt: new Date().toISOString()
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      setCurrentUser(newUser);
      toast.success(`Đăng ký thành công! Chào mừng ${newUser.profile.fullName}!`);
      return { success: true, user: newUser };
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký!');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info('Đã đăng xuất thành công!');
  };

  const updateProfile = (profileData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => 
        user.id === currentUser.id 
          ? { ...user, profile: { ...user.profile, ...profileData } }
          : user
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      const updatedUser = { ...currentUser, profile: { ...currentUser.profile, ...profileData } };
      setCurrentUser(updatedUser);
      
      toast.success('Cập nhật thông tin thành công!');
      return { success: true };
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật!');
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    login,
    register, 
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 