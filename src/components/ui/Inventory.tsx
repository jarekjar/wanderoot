import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useTheme } from '../../theme/ThemeContext';
import { useState, useRef } from 'react';

export function Inventory() {
  const theme = useTheme();
  const inventory = useSelector((state: RootState) => state.game.inventory);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScrolling(true);
    startXRef.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftRef.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startXRef.current) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  // Create array of 12 slots, fill with inventory items where they exist
  const slots = Array(12).fill(null).map((_, index) => inventory[index] || null);

  return (
    <div 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={scrollRef}
        className="flex gap-2 p-2 rounded-lg overflow-x-auto scrollbar-hide"
        style={{
          background: `${theme.secondary}95`,
          border: `2px solid ${theme.border}`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {slots.map((item, index) => (
          <div
            key={index}
            className="w-12 h-12 flex-shrink-0 rounded relative cursor-pointer hover:brightness-110"
            style={{
              background: `${theme.primary}95`,
              border: `2px solid ${theme.border}`
            }}
          >
            {item && (
              <>
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
                {item.quantity > 1 && (
                  <span 
                    className="absolute bottom-0 right-0 text-xs font-['Press_Start_2P'] text-white bg-black/50 px-1 rounded-tl"
                  >
                    {item.quantity}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 