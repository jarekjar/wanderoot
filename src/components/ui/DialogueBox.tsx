import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useTheme } from '../../theme/ThemeContext';

interface DialogueBoxProps {
  text: string;
  onNext: () => void;
  isPaused?: boolean;
}

export function DialogueBox({ text, onNext, isPaused = false }: DialogueBoxProps) {
  const theme = useTheme();
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
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
      className={`w-[80%] max-w-[800px] pointer-events-auto transition-all duration-200 ${isPaused ? 'blur-sm' : ''}`}
      style={{ zIndex: 100 }}
    >
      <div 
        className="w-full p-6 rounded-lg relative"
        style={{
          background: `${theme.secondary}95`,
          border: `2px solid ${theme.border}`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          opacity: isPaused ? 0.7 : 1
        }}
      >
        <div className="text-sm font-['Press_Start_2P'] text-white/90 mb-4 leading-relaxed">
          {displayedText}
        </div>
        <button
          onClick={handleClick}
          disabled={isPaused}
          className={`absolute bottom-2 right-2 px-4 py-2 rounded cursor-pointer hover:brightness-110 active:brightness-90 transition-all ${isPaused ? 'cursor-not-allowed opacity-50' : ''}`}
          style={{
            background: theme.primary,
            border: `2px solid ${theme.border}`,
            zIndex: 101
          }}
        >
          <span className="text-xs font-['Press_Start_2P'] text-white pointer-events-none">
            {isTyping ? 'Skip' : 'OK'}
          </span>
        </button>
      </div>
    </div>
  );
} 