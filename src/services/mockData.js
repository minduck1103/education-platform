// Mock data cho các khóa học giáo dục
export const mockCourses = [
  {
    id: "course_001",
    name: "React từ cơ bản đến nâng cao",
    price: 599000,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    description: "Học React hiệu quả với dự án thực tế, từ component cơ bản đến hooks nâng cao",
    longDescription: "Khóa học React toàn diện với 40+ video bài giảng, bao gồm: JSX, Components, Props, State, Hooks, Context API, React Router, và nhiều dự án thực tế. Phù hợp cho người mới bắt đầu và muốn nâng cao kỹ năng React.",
    instructor: "Nguyễn Văn Minh",
    rating: 4.8,
    category: "Lập trình Frontend",
    level: "Trung cấp",
    duration: "40 giờ",
    students: 1250
  },
  {
    id: "course_002", 
    name: "JavaScript ES6+ và Modern Development",
    price: 450000,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    description: "Làm chủ JavaScript hiện đại với ES6+, async/await, modules và best practices",
    longDescription: "Khóa học JavaScript nâng cao tập trung vào các tính năng ES6+: Arrow functions, Destructuring, Modules, Promises, Async/Await, Classes và nhiều concept quan trọng khác.",
    instructor: "Trần Thị Lan",
    rating: 4.7,
    category: "Lập trình Frontend", 
    level: "Trung cấp",
    duration: "35 giờ",
    students: 980
  },
  {
    id: "course_003",
    name: "Node.js và Backend Development",
    price: 750000,
    image: "https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=400&h=250&fit=crop",
    description: "Xây dựng API và ứng dụng backend với Node.js, Express và MongoDB",
    longDescription: "Khóa học backend toàn diện với Node.js: HTTP Server, Express.js, RESTful API, Authentication, Database Integration với MongoDB, Deployment và Security best practices.",
    instructor: "Lê Văn Hùng", 
    rating: 4.9,
    category: "Lập trình Backend",
    level: "Nâng cao",
    duration: "50 giờ",
    students: 750
  },
  {
    id: "course_004",
    name: "Python cho người mới bắt đầu",
    price: 399000,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    description: "Khóa học Python cơ bản với các dự án thực tế và bài tập phong phú",
    longDescription: "Học Python từ zero đến hero: Syntax cơ bản, Data structures, Functions, OOP, File handling, Libraries phổ biến như NumPy, Pandas và các mini projects thực tế.",
    instructor: "Phạm Thị Mai",
    rating: 4.6,
    category: "Lập trình Python",
    level: "Cơ bản", 
    duration: "30 giờ",
    students: 1500
  },
  {
    id: "course_005",
    name: "UI/UX Design với Figma", 
    price: 550000,
    image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=250&fit=crop",
    description: "Thiết kế giao diện chuyên nghiệp với Figma từ wireframe đến prototype",
    longDescription: "Khóa học UI/UX Design toàn diện: Design principles, User research, Wireframing, Prototyping với Figma, Design systems và thực hành với các dự án thực tế.",
    instructor: "Ngô Văn Đức",
    rating: 4.5,
    category: "Thiết kế UI/UX",
    level: "Trung cấp",
    duration: "25 giờ", 
    students: 620
  },
  {
    id: "course_006",
    name: "Digital Marketing từ A-Z",
    price: 650000,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    description: "Học Digital Marketing hiệu quả: SEO, Google Ads, Facebook Ads, Content Marketing",
    longDescription: "Khóa học Digital Marketing toàn diện: Strategy planning, SEO/SEM, Social media marketing, Content creation, Analytics, Email marketing và campaign optimization.",
    instructor: "Vũ Thị Hương",
    rating: 4.4,
    category: "Digital Marketing",
    level: "Trung cấp",
    duration: "45 giờ",
    students: 890
  },
  {
    id: "course_007", 
    name: "Data Science với Python",
    price: 850000,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    description: "Phân tích dữ liệu và Machine Learning với Python, Pandas, Matplotlib",
    longDescription: "Khóa học Data Science chuyên sâu: Data cleaning, Analysis với Pandas, Visualization với Matplotlib/Seaborn, Machine Learning cơ bản với Scikit-learn và thực hành với datasets thực tế.",
    instructor: "Hoàng Văn Sơn",
    rating: 4.7,
    category: "Data Science", 
    level: "Nâng cao",
    duration: "60 giờ",
    students: 420
  },
  {
    id: "course_008",
    name: "Mobile App Development với React Native",
    price: 720000,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop", 
    description: "Xây dựng ứng dụng mobile đa nền tảng với React Native",
    longDescription: "Học React Native để phát triển app mobile: Setup environment, Navigation, State management, API integration, Native modules và publish app lên App Store/Google Play.",
    instructor: "Đặng Thị Linh",
    rating: 4.6,
    category: "Mobile Development",
    level: "Nâng cao", 
    duration: "55 giờ",
    students: 340
  },
  {
    id: "course_009",
    name: "Tiếng Anh giao tiếp cho IT",
    price: 450000,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
    description: "Nâng cao kỹ năng tiếng Anh chuyên ngành IT và giao tiếp công việc",
    longDescription: "Khóa học tiếng Anh chuyên biệt cho ngành IT: Technical vocabulary, Presentation skills, Meeting discussions, Email writing và Interview preparation với các tình huống thực tế.",
    instructor: "Sarah Johnson", 
    rating: 4.8,
    category: "Ngoại ngữ",
    level: "Trung cấp",
    duration: "30 giờ",
    students: 780
  },
  {
    id: "course_010",
    name: "AWS Cloud Fundamentals",
    price: 950000,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    description: "Học AWS từ cơ bản: EC2, S3, RDS và triển khai ứng dụng trên cloud",
    longDescription: "Khóa học AWS toàn diện: Cloud concepts, Core services (EC2, S3, RDS, Lambda), Security, Networking, Cost optimization và hands-on labs để chuẩn bị cho AWS certification.",
    instructor: "Nguyễn Minh Tâm",
    rating: 4.9,
    category: "Cloud Computing",
    level: "Nâng cao",
    duration: "40 giờ", 
    students: 290
  }
];

// Mock user data cho testing
export const mockUser = {
  id: "user_123", 
  name: "Nguyễn Văn An",
  favorites: ["course_001", "course_003", "course_009"],
  viewHistory: ["course_001", "course_002", "course_004", "course_007", "course_009"]
};

// Categories cho filter
export const categories = [
  "Tất cả",
  "Lập trình Frontend", 
  "Lập trình Backend",
  "Lập trình Python",
  "Thiết kế UI/UX",
  "Digital Marketing",
  "Data Science",
  "Mobile Development", 
  "Ngoại ngữ",
  "Cloud Computing"
];

// Price ranges cho filter
export const priceRanges = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 500K", min: 0, max: 500000 },
  { label: "500K - 1 triệu", min: 500000, max: 1000000 },
  { label: "Trên 1 triệu", min: 1000000, max: Infinity }
]; 