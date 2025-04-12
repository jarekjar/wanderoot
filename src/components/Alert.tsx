import React, { useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface AlertProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
  duration?: number;
}

export function Alert({ message, onClose, type = 'success', duration = 2000 }: AlertProps) {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg"
      style={{
        background: type === 'success' ? theme.primary : '#ff4444',
        border: `2px solid ${theme.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="text-sm font-['Press_Start_2P'] text-white">
        {message}
      </div>
    </div>
  );
} 