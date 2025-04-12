import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { playClickSound } from '../utils/audio';
import '../styles/background.css';
import '../styles/menu.css';

interface SaveSlotManagerProps {
  onBack: () => void;
}

export function SaveSlotManager({ onBack }: SaveSlotManagerProps) {
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
      {/* Title */}
      <div className="mb-8 sm:mb-12">
        <h1 
          className="text-[2rem] sm:text-[2.5rem] font-['Press_Start_2P'] text-white entrance-animation"
          style={{
            textShadow: `3px 3px 0px ${theme.primary}, 3px 3px 4px rgba(0, 0, 0, 0.8)`
          }}
        >
          Load Game
        </h1>
      </div>

      {/* Save Slots Container */}
      <div 
        className="p-4 sm:p-6 rounded-lg border-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-full max-w-[800px] menu-slide-up"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
        }}
      >
        <div className="flex flex-col gap-4">
          {/* Empty save slot message */}
          <div className="text-center py-8">
            <p className="text-white/70 font-['Press_Start_2P'] text-sm">
              No saved games found
            </p>
          </div>

          {/* Save slots will be added here when implemented */}
          {Array.from({ length: 3 }).map((_, index) => (
            <button
              key={index}
              onClick={() => playClickSound(soundEnabled)}
              className="menu-button-bg w-full h-[80px] rounded-lg text-white font-['Press_Start_2P'] text-sm relative flex items-center justify-center hover:brightness-110 transition-all duration-75 opacity-50 cursor-not-allowed"
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              <span className="text-white/70">Empty Save Slot {index + 1}</span>
            </button>
          ))}

          {/* Back Button */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onBack();
            }}
            className="menu-button-bg w-[240px] h-[52px] rounded-lg text-white font-['Press_Start_2P'] text-lg relative flex items-center justify-center hover:brightness-110 transition-all duration-75 mx-auto mt-4"
            style={{
              borderColor: theme.border,
              background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
            }}
          >
            <span className="text-white brightness-[1.2]">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
} 