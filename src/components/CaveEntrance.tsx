import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { playClickSound } from '../utils/audio';

interface CaveEntranceProps {
  onEnter: () => void;
  position: { x: number; y: number };
}

export function CaveEntrance({ onEnter, position }: CaveEntranceProps) {
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

  const handleEnterCave = () => {
    playClickSound(soundEnabled);
    onEnter();
  };

  return (
    <div 
      className="absolute cursor-pointer hover:brightness-110 transition-all"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: '64px',
        height: '64px',
        background: `linear-gradient(180deg, ${theme.secondary} 0%, rgba(0,0,0,0.8) 100%)`,
        borderRadius: '8px',
        border: `2px solid ${theme.border}`,
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
      }}
      onClick={handleEnterCave}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-2xl">⛰️</span>
      </div>
      <div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 font-['Press_Start_2P'] text-white"
      >
        Enter Cave
      </div>
    </div>
  );
} 