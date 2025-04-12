import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { useTheme } from '../theme/ThemeContext';
import { playClickSound } from '../utils/audio';

interface GameProps {
  onBack: () => void;
}

export function Game({ onBack }: GameProps) {
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const playerName = useSelector((state: RootState) => state.game.playerName);
  const playerSprite = useSelector((state: RootState) => state.game.playerSprite);
  const playerClass = useSelector((state: RootState) => state.game.playerClass);

  return (
    <div className="relative z-10 flex flex-col items-center justify-start min-h-screen h-screen w-full p-4 bg-[#2A1810]">
      {/* Game Header */}
      <div className="w-full max-w-[1200px] flex items-center justify-between mb-8 p-4 settings-row-bg rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onBack();
            }}
            className="text-white hover:opacity-80 transition-opacity"
          >
            ← Back
          </button>
          <div className="w-[48px] h-[48px] bg-[#2A1810] rounded-lg border-2 border-[#8B4513] flex items-center justify-center">
            <img 
              src={`/assets/sprites/character${playerSprite}.svg`} 
              alt="Player" 
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-['Press_Start_2P'] text-white">
              {playerName}
            </div>
            <div className="text-xs font-['Press_Start_2P'] text-white/70">
              {playerClass}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Add game stats/resources here */}
        </div>
      </div>

      {/* Main Game Area */}
      <div 
        className="w-full max-w-[1200px] flex-1 settings-container-bg rounded-lg p-4"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
        }}
      >
        <div className="text-sm font-['Press_Start_2P'] text-white mb-4">
          Welcome to your new life in Willow Rest!
        </div>
        {/* Add game content here */}
      </div>
    </div>
  );
} 