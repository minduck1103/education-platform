# 🎓 Loomly Education Platform

Sàn giáo dục thương mại điện tử tích hợp AI với gợi ý khóa học thông minh.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Build cho production](#build-cho-production)
- [Cấu trúc dự án](#cấu-trúc-dự-án)

## 🚀 Giới thiệu

Loomly Education Platform là một ứng dụng web hiện đại cho phép người dùng:
- Tìm kiếm và khám phá khóa học
- Nhận gợi ý khóa học thông minh từ AI
- Quản lý danh sách yêu thích
- Theo dõi lịch sử xem
- Tương tác với chatbot AI

## ✨ Tính năng

### 🔍 Tìm kiếm & Lọc
- Tìm kiếm theo từ khóa
- Lọc theo danh mục, giá cả, độ khó
- Hiển thị kết quả động

### 🤖 AI Thông minh
- Gợi ý khóa học dựa trên sở thích
- Chatbot tư vấn 24/7
- Phân tích hành vi học tập

### 💝 Quản lý cá nhân
- Danh sách yêu thích
- Lịch sử xem khóa học
- Thông tin chi tiết khóa học

### 🔐 Xác thực
- Đăng ký/Đăng nhập
- Quản lý phiên làm việc
- Bảo mật thông tin

## 🛠 Công nghệ sử dụng

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool và dev server
- **TailwindCSS** - CSS Framework
- **React Router DOM** - Routing
- **React Icons** - Icon library
- **React Toastify** - Notifications

### AI & APIs
- **Google Gemini AI** - Gợi ý thông minh
- **Axios** - HTTP client

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 hoặc **yarn**: >= 1.22.0
- **Git**: >= 2.30.0

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone <https://github.com/minduck1103/education-platform.git>
cd education-platform-app
```

### 2. Cài đặt dependencies

```bash
npm install
```

## ⚙️ Cấu hình

### 1. Tạo file environment

Tạo file `.env` trong thư mục root:

```bash
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Lấy Gemini API Key

1. Truy cập [Google AI Studio](https://aistudio.google.com/)
2. Đăng nhập bằng tài khoản Google
3. Tạo API key mới
4. Copy API key và paste vào file `.env`

### 3. Cấu hình tùy chọn (Optional)

Bạn có thể tùy chỉnh thêm trong file `src/config/gemini.js`:


## 🚀 Chạy ứng dụng

### Development mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: [http://localhost:5173](http://localhost:5173)


## 📦 Build cho production

### 1. Build ứng dụng

```bash
npm run build
```

### 2. Kiểm tra build

```bash
npm run preview
```

## 📁 Cấu trúc dự án

```
education-platform-app/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── assets/            # Images, fonts
│   ├── components/        # React components
│   │   ├── Auth/          # Authentication components
│   │   ├── common/        # Shared components
│   │   ├── Course/        # Course-related components
│   │   ├── Layout/        # Layout components
│   │   └── Search/        # Search components
│   ├── config/            # Configuration files
│   │   └── gemini.js      # Gemini AI config
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   └── SearchContext.jsx
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   │   ├── Auth/
│   │   ├── Favorites/
│   │   └── Home/
│   ├── services/          # API services
│   │   ├── api.js         # Main API service
│   │   ├── geminiService.js # Gemini AI service
│   │   └── mockData.js    # Mock data
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   ├── index.css          # Global styles
│   └── main.jsx          # Entry point
├── .env                   # Environment variables
├── .gitignore
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies
├── postcss.config.js      # PostCSS config
├── tailwind.config.js     # Tailwind config
└── vite.config.js         # Vite configuration
```

## 🔧 Scripts có sẵn

| Command | Mô tả |
|---------|--------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build cho production |
| `npm run preview` | Preview build locally |
| `npm run lint` | Chạy ESLint |

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **"Module not found"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **"Gemini API Error"**
   - Kiểm tra API key trong file `.env`
   - Đảm bảo API key còn hạn sử dụng

3. **"Build failed"**
   ```bash
   npm run lint
   # Sửa các lỗi ESLint trước khi build
   ```