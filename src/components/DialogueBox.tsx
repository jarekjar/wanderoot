import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { useTheme } from '../theme/ThemeContext';

interface DialogueBoxProps {
  text: string;
  onNext: () => void;
}

export function DialogueBox({ text, onNext }: DialogueBoxProps) {
  const theme = useTheme();
  const isPaused = useSelector((state: RootState) => state.game.isPaused);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear any existing interval when component unmounts or text changes
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text]);

  // Handle typing animation
  useEffect(() => {
    if (!text) return;  // Don't process if text is empty/undefined
    
    if (isPaused) {
      // Pause the animation
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Resume or start the animation
      if (!intervalRef.current) {
        setIsTyping(true);
        currentIndexRef.current = 0;  // Reset index when starting new text
        setDisplayedText('');  // Clear displayed text when starting new text
        
        intervalRef.current = setInterval(() => {
          if (currentIndexRef.current < text.length) {
            const nextChar = text[currentIndexRef.current];
            setDisplayedText(current => current + nextChar);
            currentIndexRef.current++;
            
            if (currentIndexRef.current >= text.length) {
              setIsTyping(false);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          }
        }, 50);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, isPaused]);

  const handleClick = () => {
    if (!text || isPaused) return;  // Don't handle clicks if text is empty/undefined or game is paused
    
    if (isTyping) {
      setDisplayedText(text || '');
      setIsTyping(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      currentIndexRef.current = text.length;
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