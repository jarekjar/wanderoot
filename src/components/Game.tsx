import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { useTheme } from '../theme/ThemeContext';
import { playClickSound } from '../utils/audio';
import { InGameMenu } from './InGameMenu';
import { Settings } from './Settings';

interface GameProps {
  onBack: () => void;
}

export function Game({ onBack }: GameProps) {
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const playerName = useSelector((state: RootState) => state.game.playerName);
  const playerSprite = useSelector((state: RootState) => state.game.playerSprite);
  const playerClass = useSelector((state: RootState) => state.game.playerClass);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleOpenMenu = () => {
    playClickSound(soundEnabled);
    setShowMenu(true);
    setShowSettings(false);
  };

  const handleCloseMenu = () => {
    playClickSound(soundEnabled);
    setShowMenu(false);
  };

  const handleSettings = () => {
    playClickSound(soundEnabled);
    setShowSettings(true);
    setShowMenu(false);
  };

  const handleCloseSettings = () => {
    playClickSound(soundEnabled);
    setShowSettings(false);
    setShowMenu(true);
  };

  const handleSave = () => {
    // TODO: Implement save
  };

  const handleLoad = () => {
    // TODO: Implement load
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-start min-h-screen h-screen w-full p-2 bg-[#2A1810]">
      {/* Game Header */}
      <div className="w-full max-w-[1200px] flex items-center justify-between mb-2 p-2 settings-row-bg rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenMenu}
            className="text-white hover:opacity-80 transition-opacity"
          >
            Menu
          </button>
          <div 
            className="w-[48px] h-[48px] rounded-lg border-2 flex items-center justify-center"
            style={{
              background: theme.secondary,
              borderColor: theme.border
            }}
          >
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

      {/* Main Game Area - Cave Spawn */}
      <div 
        className="w-full max-w-[1200px] flex-1 settings-container-bg rounded-lg p-4 relative overflow-hidden"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)`,
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
        }}
      >
        {/* Cave Environment */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 10 + 5 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                boxShadow: '0 0 10px rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>

        {/* Player Character */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div 
            className="w-[64px] h-[64px] rounded-lg border-2 flex items-center justify-center"
            style={{
              background: `${theme.secondary}80`,
              borderColor: `${theme.border}80`
            }}
          >
            <img 
              src={`/assets/sprites/character${playerSprite}.svg`} 
              alt="Player"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-sm font-['Press_Start_2P'] text-white/80 mb-2">
            You wake up in a mysterious cave...
          </div>
          <div className="text-xs font-['Press_Start_2P'] text-white/50">
            With no items or memory of how you got here.
          </div>
        </div>
      </div>

      {/* In-Game Menu */}
      {showMenu && (
        <InGameMenu
          onClose={handleCloseMenu}
          onSettings={handleSettings}
          onSave={handleSave}
          onLoad={handleLoad}
          onExit={onBack}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Settings onBack={handleCloseSettings} />
      )}

      {/* Version number */}
      <div 
        className="absolute bottom-4 left-4 text-white font-['Press_Start_2P'] text-xs"
        style={{
          textShadow: `2px 2px 0px ${theme.primary}, 2px 2px 4px rgba(0, 0, 0, 0.8)`
        }}
      >
        v0.1.0
      </div>
    </div>
  );
} 