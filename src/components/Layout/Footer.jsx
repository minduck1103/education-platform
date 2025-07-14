import {
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaGraduationCap,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo + Contact */}
        <div>
          <div className="flex items-center text-xl font-bold mb-4">
            <FaGraduationCap className="text-yellow-400 text-2xl mr-2" />
            Loomly
          </div>
          <p className="mb-2">Điện thoại: <span className="text-white/80">0983 173 229</span></p>
          <p className="mb-2">Email: <span className="text-white/80">contact@loomly.vn</span></p>
          <p className="mb-4">Địa chỉ: <span className="text-white/80">Tầng 3, Số 10, Nguyễn Văn Cừ, Q. 5, TP. HCM</span></p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Về chúng tôi</h4>
          <ul className="space-y-2 text-white/80">
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Điều khoản</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Khóa học</h4>
          <ul className="space-y-2 text-white/80">
            <li>JavaScript Cơ Bản</li>
            <li>ReactJS Nâng Cao</li>
            <li>Node.js Backend</li>
            <li>Thiết kế UI/UX</li>
            <li>Khóa học AI</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Công cụ</h4>
          <ul className="space-y-2 text-white/80">
            <li>Trình tạo CV</li>
            <li>Trắc nghiệm lập trình</li>
            <li>Chấm điểm code</li>
            <li>Gợi ý khóa học AI</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 uppercase">CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC loomly</h4>
          <p className="mb-2 text-white/80">Mã số thuế: 0101234567</p>
          <p className="mb-2 text-white/80">Ngày thành lập: 01/01/2023</p>
          <p className="text-white/80">
            Lĩnh vực hoạt động: Giáo dục, công nghệ – lập trình. Loomly tập trung phát triển các sản phẩm học tập trực tuyến áp dụng AI phục vụ cộng đồng học viên Việt Nam.
          </p>
          <div className="flex gap-3 mt-4 text-xl">
            <a href="#" className="hover:text-blue-500"><FaYoutube /></a>
            <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTiktok /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-4 text-center text-white/60">
        © {new Date().getFullYear()} Loomly. Nền tảng giáo dục ứng dụng AI hàng đầu Việt Nam.
      </div>
    </footer>
  );
};

export default Footer;
