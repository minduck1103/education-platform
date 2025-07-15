import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import ChatWindow from './ChatWindow';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:right-4 md:right-6 z-50 animate-in slide-in-from-bottom-4 duration-300 max-h-[calc(100vh-6rem)] overflow-hidden">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-2 sm:right-4 md:right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-110 ${
          isOpen
            ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
        }`}
        aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
      >
        <FaRobot className={`text-white text-xl transition-all duration-300 ${isOpen ? '' : 'animate-pulse'}`} />
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-4 right-16 sm:right-20 md:right-24 z-40 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 pointer-events-none transition-opacity duration-300 hover:opacity-100">
          Chat với AI Assistant
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 