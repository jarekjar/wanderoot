import { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';

interface AlertProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
  duration?: number;
}

export function Alert({ message, onClose, type = 'success', duration = 2000 }: AlertProps) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation immediately
    setIsVisible(true);

    // Start exit animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before closing
      setTimeout(onClose, 500);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    if (type === 'success') {
      return (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  return (
    <div 
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg
        flex items-center gap-3 transition-all duration-500 ease-in-out
        ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}
      `}
      style={{
        background: type === 'success' ? theme.primary : '#ff4444',
        border: `2px solid ${theme.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)'
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      {/* Message */}
      <div className="text-sm font-['Press_Start_2P'] text-white">
        {message}
      </div>
    </div>
  );
} 