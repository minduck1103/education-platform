import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'md', 
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  noPadding = false
}) => {
  const modalRef = useRef(null);

  // Handle ESC key
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, closeOnEsc]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-2xl 
          transform transition-all duration-300 
          ${sizeClasses[size]} w-full mx-4
          max-h-[90vh] overflow-y-auto
        `}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className={noPadding ? '' : 'p-6'}>
          {children}
        </div>
      </div>
    </div>
  );

  // Render in portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};

export default Modal; 