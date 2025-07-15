import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaTimes } from 'react-icons/fa';
import ChatbotService from '../../services/chatbotService';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Xin chào! Tôi là AI Assistant của Loomly Education 🤖\n\nTôi có thể giúp bạn tư vấn khóa học, giá cả, chứng chỉ và nhiều thông tin khác. Bạn có câu hỏi gì không? 😊',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowQuickSuggestions(false);

    try {
      // Gửi tin nhắn tới ChatbotService
      const response = await ChatbotService.sendMessage(inputMessage.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        usedAI: response.usedAI || false
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau ít phút hoặc liên hệ support@loomly.edu.vn 📧',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowQuickSuggestions(false);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessage = (content) => {
    // Convert markdown-like formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="w-[340px] sm:w-[380px] md:w-96 h-[480px] sm:h-[520px] md:h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <FaRobot className="text-sm" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Loomly Education</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                message.type === 'user'
                  ? 'bg-ocean-500 text-white'
                  : 'bg-purple-100 text-purple-600'
              }`}
            >
              {message.type === 'user' ? <FaUser /> : <FaRobot />}
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-ocean-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(message.content)
                }}
              />
              <div
                className={`text-xs mt-1 opacity-70 ${
                  message.type === 'user' ? 'text-right' : ''
                }`}
              >
                {formatTime(message.timestamp)}
                {message.usedAI && (
                  <span className="ml-1 text-green-600">✨ AI</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">
              <FaRobot />
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {showQuickSuggestions && messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Gợi ý câu hỏi:</p>
          <div className="space-y-1">
            {ChatbotService.getQuickSuggestions().slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestionClick(suggestion)}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 