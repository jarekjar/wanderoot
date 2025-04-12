import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface DialogueBoxProps {
  text: string;
  onNext: () => void;
}

export function DialogueBox({ text, onNext }: DialogueBoxProps) {
  const theme = useTheme();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    if (!text) return;  // Don't process if text is empty/undefined
    
    setIsTyping(true);
    setDisplayedText('');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        const nextChar = text[currentIndex];
        setDisplayedText(current => current + nextChar);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [text]);

  const handleClick = () => {
    if (!text) return;  // Don't handle clicks if text is empty/undefined
    
    if (isTyping) {
      setDisplayedText(text || '');
      setIsTyping(false);
    } else {
      onNext();
    }
  };
  
  return (
    <div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px]"
    >
      <div 
        className="w-full p-6 rounded-lg relative"
        style={{
          background: `${theme.secondary}95`,
          border: `2px solid ${theme.border}`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="text-sm font-['Press_Start_2P'] text-white/90 mb-4 leading-relaxed">
          {displayedText}
        </div>
        <button
          onClick={handleClick}
          className="absolute bottom-2 right-2 px-4 py-2 rounded"
          style={{
            background: theme.primary,
            border: `2px solid ${theme.border}`,
          }}
        >
          <span className="text-xs font-['Press_Start_2P'] text-white">
            {isTyping ? 'Skip' : 'OK'}
          </span>
        </button>
      </div>
    </div>
  );
} 