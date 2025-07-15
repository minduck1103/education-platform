import { getChatbotResponse } from './geminiService';

export const ChatbotService = {
  async sendMessage(message, _conversationHistory = []) {
    try {
      // Tạo prompt đơn giản hơn để test
      const simplePrompt = `Bạn là AI assistant của Loomly Education. Trả lời ngắn gọn bằng tiếng Việt: ${message}`;

      const response = await getChatbotResponse(simplePrompt);
      
      return {
        success: true,
        message: response
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      
      // Intelligent fallback based on user intent
      const intent = this.analyzeIntent(message);
      const fallbackMessage = this.getFallbackResponse(intent, message);
      
      return {
        success: false,
        message: fallbackMessage,
        error: error.message
      };
    }
  },

  // Tạo gợi ý câu hỏi nhanh cho người dùng
  getQuickSuggestions() {
    return [
      "Giá các khóa học tại Loomly như thế nào?",
      "Tôi muốn học lập trình web, bắt đầu từ đâu?",
      "Có chứng chỉ sau khi hoàn thành khóa học không?",
      "Chính sách hoàn tiền như thế nào?",
      "Lộ trình học Data Science như thế nào?",
      "Các khóa học có những gì?",
      "Tôi cần hỗ trợ kỹ thuật",
      "Thông tin liên hệ support"
    ];
  },

  // Phân tích intent của tin nhắn để đưa ra phản hồi phù hợp hơn
  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('giá') || lowerMessage.includes('phí') || lowerMessage.includes('tiền')) {
      return 'pricing';
    }
    if (lowerMessage.includes('học') || lowerMessage.includes('khóa học') || lowerMessage.includes('course')) {
      return 'course_inquiry';
    }
    if (lowerMessage.includes('chứng chỉ') || lowerMessage.includes('certificate')) {
      return 'certificate';
    }
    if (lowerMessage.includes('hoàn tiền') || lowerMessage.includes('refund')) {
      return 'refund';
    }
    if (lowerMessage.includes('lộ trình') || lowerMessage.includes('roadmap')) {
      return 'learning_path';
    }
    if (lowerMessage.includes('hỗ trợ') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return 'support';
    }
    
    return 'general';
  },

  // Tạo fallback response thông minh dựa trên intent
  getFallbackResponse(intent, message) {
    const responses = {
      pricing: "Về giá cả các khóa học:\n\n📚 **Giá khóa học tại Loomly Education:**\n• JavaScript ES6+: 450.000đ\n• React từ cơ bản: 599.000đ\n• Node.js Backend: 750.000đ\n• Python cho người mới: 399.000đ\n• UI/UX Design: 550.000đ\n• Data Science: 850.000đ\n• Digital Marketing: 650.000đ\n• Mobile App Development: 720.000đ\n\n💰 **Chính sách:**\n• Hoàn tiền 100% trong 30 ngày\n• Học tập trọn đời\n• Không phí ẩn\n\nBạn quan tâm khóa học nào cụ thể?",
      
      course_inquiry: "🎓 **Các khóa học tại Loomly Education:**\n\n**💻 Lập trình:**\n• JavaScript ES6+ và Modern Development\n• React từ cơ bản đến nâng cao\n• Node.js và Backend Development\n• Python cho người mới bắt đầu\n• Mobile App Development với React Native\n\n**🎨 Thiết kế:**\n• UI/UX Design với Figma\n\n**📊 Phân tích dữ liệu:**\n• Data Science với Python\n\n**📱 Marketing:**\n• Digital Marketing từ A-Z\n\nTất cả khóa học đều có:\n✅ Video HD chất lượng cao\n✅ Tài liệu PDF\n✅ Bài tập thực hành\n✅ Hỗ trợ 24/7\n✅ Chứng chỉ hoàn thành\n\nBạn muốn tìm hiểu khóa học nào?",
      
      certificate: "🏆 **Chứng chỉ tại Loomly Education:**\n\n✅ **Có chứng chỉ hoàn thành** cho tất cả khóa học\n✅ Chứng chỉ được cấp khi hoàn thành 100% bài học\n✅ Định dạng PDF có thể tải về\n✅ Có thể chia sẻ trên LinkedIn và CV\n✅ Được công nhận trong ngành\n\n📋 **Yêu cầu nhận chứng chỉ:**\n• Hoàn thành tất cả video bài học\n• Nộp đầy đủ bài tập\n• Đạt điểm tối thiểu trong bài kiểm tra cuối khóa\n\nBạn đang quan tâm chứng chỉ của khóa học nào?",
      
      refund: "💰 **Chính sách hoàn tiền:**\n\n✅ **Hoàn tiền 100%** trong vòng 30 ngày\n✅ Không cần lý do cụ thể\n✅ Xử lý nhanh chóng trong 3-5 ngày làm việc\n✅ Hoàn về tài khoản thanh toán gốc\n\n📝 **Cách yêu cầu hoàn tiền:**\n1. Gửi email đến support@loomly.edu.vn\n2. Cung cấp mã đơn hàng\n3. Nêu lý do (tuỳ chọn)\n4. Chờ xác nhận từ đội ngũ support\n\n⏰ **Lưu ý:** Chỉ áp dụng trong 30 ngày đầu từ ngày mua khóa học.",
      
      learning_path: "🗺️ **Lộ trình học tập được đề xuất:**\n\n**👨‍💻 Lập trình Web Full-stack:**\n1️⃣ JavaScript ES6+ (4-6 tuần)\n2️⃣ React Frontend (6-8 tuần)\n3️⃣ Node.js Backend (6-8 tuần)\n\n**🎨 Thiết kế UI/UX:**\n1️⃣ UI/UX Design cơ bản (8 tuần)\n2️⃣ Advanced Design Systems\n\n**📊 Data Science:**\n1️⃣ Python cơ bản (4 tuần)\n2️⃣ Data Science với Python (10 tuần)\n\n**📱 Mobile Development:**\n1️⃣ JavaScript ES6+ (4 tuần)\n2️⃣ React (6 tuần)\n3️⃣ React Native (8 tuần)\n\n**📈 Digital Marketing:**\n1️⃣ Digital Marketing A-Z (8 tuần)\n\nBạn muốn theo lộ trình nào?",
      
      support: "🤝 **Hỗ trợ học viên:**\n\n📧 **Email:** support@loomly.edu.vn\n📞 **Hotline:** 1900-xxxx (8h-22h hàng ngày)\n💬 **Live Chat:** Qua website (8h-18h)\n🎯 **Forum:** Cộng đồng học viên\n\n⚡ **Hỗ trợ 24/7 cho:**\n• Vấn đề kỹ thuật\n• Câu hỏi về bài học\n• Hướng dẫn sử dụng platform\n• Tư vấn lộ trình học tập\n\n🔧 **Các vấn đề thường gặp:**\n• Không vào được bài học\n• Lỗi video không phát\n• Quên mật khẩu\n• Cập nhật thông tin tài khoản\n\nBạn cần hỗ trợ về vấn đề gì?",
      
      general: "Xin chào! Tôi là AI Assistant của Loomly Education. 🤖\n\n📚 **Tôi có thể giúp bạn:**\n• Tư vấn khóa học phù hợp\n• Thông tin giá cả và chính sách\n• Hướng dẫn lộ trình học tập\n• Giải đáp thắc mắc về chứng chỉ\n• Hỗ trợ kỹ thuật cơ bản\n\n💡 **Gợi ý câu hỏi:**\n• \"Tôi muốn học lập trình web, bắt đầu từ đâu?\"\n• \"Giá khóa học JavaScript là bao nhiêu?\"\n• \"Có chứng chỉ sau khi hoàn thành không?\"\n• \"Lộ trình học Data Science như thế nào?\"\n\nBạn có câu hỏi gì khác không? 😊"
    };

    return responses[intent] || responses.general;
  }
};

export default ChatbotService; 