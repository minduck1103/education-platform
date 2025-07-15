import { getChatbotResponse } from './geminiService';

export const ChatbotService = {
  async sendMessage(message) {
    try {
      // Thử gọi Gemini API trước
      const aiResponse = await this.tryGeminiAPI(message);
      if (aiResponse) {
        return {
          success: true,
          message: aiResponse,
          usedAI: true
        };
      }
      
      // Nếu AI fail, sử dụng fallback responses
      const fallbackResponse = this.getFallbackResponse(message);
      return {
        success: true,
        message: fallbackResponse,
        usedAI: false
      };
      
    } catch (error) {
      console.error('Chatbot service error:', error);
      
      // Fallback cuối cùng
      return {
        success: true,
        message: this.getErrorFallback(),
        usedAI: false
      };
    }
  },

  async tryGeminiAPI(message) {
    try {
      // Tạo prompt đơn giản để tránh safety issues
      const prompt = `Bạn là AI assistant thân thiện của Loomly Education. Trả lời ngắn gọn bằng tiếng Việt cho câu hỏi: "${message}"`;

      // Gọi getChatbotResponse từ geminiService
      const response = await getChatbotResponse(prompt);
      
      if (response) {
        console.log('✅ Gemini AI response successful');
        return response;
      }
      
      return null; // Fallback sẽ được sử dụng
      
    } catch (error) {
      console.warn('⚠️ Gemini API error:', error.message);
      return null; // Fallback sẽ được sử dụng
    }
  },

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Phân tích intent
    if (lowerMessage.includes('giá') || lowerMessage.includes('phí') || lowerMessage.includes('tiền')) {
      return this.getPricingResponse();
    }
    if (lowerMessage.includes('học') || lowerMessage.includes('khóa học') || lowerMessage.includes('course')) {
      return this.getCourseResponse();
    }
    if (lowerMessage.includes('chứng chỉ') || lowerMessage.includes('certificate')) {
      return this.getCertificateResponse();
    }
    if (lowerMessage.includes('hoàn tiền') || lowerMessage.includes('refund')) {
      return this.getRefundResponse();
    }
    if (lowerMessage.includes('lộ trình') || lowerMessage.includes('roadmap')) {
      return this.getLearningPathResponse();
    }
    if (lowerMessage.includes('hỗ trợ') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return this.getSupportResponse();
    }
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return this.getGreetingResponse();
    }
    
    return this.getGeneralResponse();
  },

  getGreetingResponse() {
    return `Xin chào! Tôi là AI Assistant của Loomly Education 🤖

Tôi có thể giúp bạn:
• 📚 Tư vấn khóa học phù hợp
• 💰 Thông tin giá cả và chính sách
• 🏆 Hướng dẫn về chứng chỉ
• 🗺️ Lộ trình học tập

Bạn muốn tìm hiểu về điều gì? 😊`;
  },

  getPricingResponse() {
    return `💰 **Bảng giá khóa học Loomly Education:**

📚 **Khóa học Lập trình:**
• JavaScript ES6+: 450.000đ
• React từ cơ bản: 599.000đ
• Node.js Backend: 750.000đ
• Python cho người mới: 399.000đ
• Mobile App Development: 720.000đ

🎨 **Thiết kế & Marketing:**
• UI/UX Design: 550.000đ
• Digital Marketing: 650.000đ
• Data Science: 850.000đ

✅ **Bao gồm:**
• Video HD chất lượng cao
• Tài liệu PDF đầy đủ
• Hỗ trợ 24/7
• Chứng chỉ hoàn thành
• Hoàn tiền 100% trong 30 ngày

Bạn quan tâm khóa học nào? 🤔`;
  },
      
  getCourseResponse() {
    return `🎓 **Các khóa học tại Loomly Education:**

💻 **Lập trình Web:**
• JavaScript ES6+ - Nền tảng vững chắc
• React - Xây dựng ứng dụng hiện đại
• Node.js - Backend mạnh mẽ

🐍 **Python & Data:**
• Python cơ bản - Dễ học, dễ hiểu
• Data Science - Phân tích dữ liệu chuyên nghiệp

🎨 **Thiết kế & Marketing:**
• UI/UX Design với Figma
• Digital Marketing từ A-Z

📱 **Mobile Development:**
• React Native - Ứng dụng đa nền tảng

Tất cả khóa học đều có:
✅ Dự án thực tế  ✅ Mentor hỗ trợ
✅ Cộng đồng học tập  ✅ Cập nhật trọn đời

Bạn muốn bắt đầu từ khóa học nào? 🚀`;
  },
      
  getCertificateResponse() {
    return `🏆 **Chứng chỉ Loomly Education:**

✅ **Chứng chỉ hoàn thành** cho mọi khóa học
✅ **Được cấp khi:** hoàn thành 100% bài học + bài tập
✅ **Định dạng:** PDF chất lượng cao
✅ **Có thể:** chia sẻ LinkedIn, đính kèm CV
✅ **Được công nhận** trong ngành IT

📋 **Quy trình nhận chứng chỉ:**
1. Hoàn thành tất cả video bài học
2. Nộp đầy đủ bài tập thực hành
3. Đạt điểm tối thiểu bài kiểm tra cuối khóa
4. Nhận chứng chỉ qua email trong 24h

💡 **Mẹo:** Chứng chỉ Loomly được nhiều doanh nghiệp tin tướng!

Bạn đang quan tâm chứng chỉ của khóa học nào? 🎯`;
  },
      
  getRefundResponse() {
    return `💸 **Chính sách hoàn tiền 30 ngày:**

✅ **100% hoàn tiền** không cần lý do
✅ **Thời hạn:** 30 ngày từ ngày mua
✅ **Xử lý:** 3-5 ngày làm việc
✅ **Hoàn về:** tài khoản thanh toán gốc

📧 **Cách yêu cầu hoàn tiền:**
1. Gửi email: support@loomly.edu.vn
2. Tiêu đề: "Yêu cầu hoàn tiền - [Mã đơn hàng]"
3. Nêu lý do (không bắt buộc)
4. Chờ xác nhận từ team support

⚠️ **Lưu ý:** 
• Chỉ áp dụng trong 30 ngày đầu
• Không áp dụng cho khóa học đã hoàn thành 100%

🤝 **Cam kết:** Quy trình minh bạch, nhanh chóng!

Bạn có thắc mắc gì về chính sách này không? 💭`;
  },

  getLearningPathResponse() {
    return `🗺️ **Lộ trình học tập được đề xuất:**

🌟 **Lập trình Web Full-stack:**
1️⃣ JavaScript ES6+ (4-6 tuần)
2️⃣ React Frontend (6-8 tuần)  
3️⃣ Node.js Backend (6-8 tuần)

🎨 **Thiết kế UI/UX:**
1️⃣ UI/UX Design cơ bản (8 tuần)
2️⃣ Advanced Design Systems (4 tuần)

📊 **Data Science:**
1️⃣ Python cơ bản (4 tuần)
2️⃣ Data Science Python (10 tuần)

📱 **Mobile Development:**
1️⃣ JavaScript ES6+ (4 tuần)
2️⃣ React (6 tuần)
3️⃣ React Native (8 tuần)

📈 **Digital Marketing:**
1️⃣ Digital Marketing A-Z (8 tuần)

💡 **Mẹo học hiệu quả:**
• Học 1-2h mỗi ngày
• Thực hành ngay sau mỗi bài
• Tham gia cộng đồng học tập

Bạn muốn theo lộ trình nào? 🎯`;
  },
      
  getSupportResponse() {
    return `🤝 **Hỗ trợ học viên 24/7:**

📞 **Liên hệ trực tiếp:**
• Email: support@loomly.edu.vn
• Hotline: 1900-xxxx (24/7)
• Live Chat: Website (8h-22h)

💬 **Hỗ trợ qua:**
• Discord community
• Facebook group
• Zoom office hours (T2, T4, T6)

🛠️ **Các vấn đề chúng tôi hỗ trợ:**
✅ Vấn đề kỹ thuật (video, platform)
✅ Câu hỏi về bài học
✅ Hướng dẫn bài tập
✅ Tư vấn lộ trình career
✅ Cập nhật thông tin tài khoản

⚡ **Thời gian phản hồi:**
• Live chat: Ngay lập tức
• Email: Trong 2-4 giờ
• Community: Cộng đồng hỗ trợ 24/7

Bạn cần hỗ trợ về vấn đề gì? 🤔`;
  },
      
  getGeneralResponse() {
    return `Xin chào! Tôi là AI Assistant của Loomly Education 🤖

📚 **Tôi có thể giúp bạn:**
• Tư vấn khóa học phù hợp
• Thông tin giá cả và chính sách  
• Hướng dẫn lộ trình học tập
• Giải đáp về chứng chỉ và hoàn tiền
• Hỗ trợ kỹ thuật cơ bản

💡 **Gợi ý câu hỏi:**
• "Giá khóa học JavaScript là bao nhiều?"
• "Tôi muốn học lập trình web, bắt đầu từ đâu?"
• "Có chứng chỉ sau khi hoàn thành không?"
• "Lộ trình học Data Science như thế nào?"

Bạn muốn tìm hiểu về điều gì? 😊`;
  },

  getErrorFallback() {
    return `Xin lỗi, tôi đang gặp sự cố kỹ thuật nhỏ 😅

Nhưng tôi vẫn có thể giúp bạn! Hãy thử hỏi về:
• Giá khóa học
• Thông tin chứng chỉ  
• Chính sách hoàn tiền
• Lộ trình học tập
• Hỗ trợ kỹ thuật

Hoặc liên hệ trực tiếp: support@loomly.edu.vn 📧`;
  },

  getQuickSuggestions() {
    return [
      "Giá các khóa học như thế nào?",
      "Tôi muốn học lập trình web",
      "Có chứng chỉ sau khi hoàn thành không?",
      "Chính sách hoàn tiền ra sao?",
      "Lộ trình học Data Science",
      "Hỗ trợ kỹ thuật",
      "Thông tin liên hệ"
    ];
  }
};

export default ChatbotService; 