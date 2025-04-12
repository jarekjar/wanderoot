import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { useTheme } from '../theme/ThemeContext';
import { playClickSound } from '../utils/audio';
import { InGameMenu } from './InGameMenu';
import { Settings } from './Settings';
import { DialogueBox } from './DialogueBox';
import { Alert } from './Alert';
import { SaveSlotManager } from './SaveSlotManager';
import { saveGame, loadGame } from '../utils/saveLoad';
import { createNewSave } from '../types/saveGame';
import { setPlayerName, setPlayerSprite, setPlayerClass } from '../state/gameSlice';

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
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [saveSlotMode, setSaveSlotMode] = useState<'save' | 'load'>('save');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Dialogue state
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [dialogueText, setDialogueText] = useState('');
  const dialogueLines = [
    'You wake up in a mysterious cave...',
    'With no items or memory of how you got here.'
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    // Start first dialogue after a short delay
    const timer = setTimeout(() => {
      setDialogueText(dialogueLines[0]);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNextDialogue = () => {
    playClickSound(soundEnabled);
    const nextDialogue = currentDialogue + 1;
    
    if (nextDialogue < dialogueLines.length) {
      setCurrentDialogue(nextDialogue);
      setDialogueText(dialogueLines[nextDialogue]);
    } else {
      setCurrentDialogue(0);
      setDialogueText('');  // Clear dialogue when finished
    }
  };

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
    setSaveSlotMode('save');
    setShowSaveSlots(true);
    setShowMenu(false);
  };

  const handleLoad = () => {
    setSaveSlotMode('load');
    setShowSaveSlots(true);
    setShowMenu(false);
  };

  const handleSaveSlotSelect = (slotId: number) => {
    if (saveSlotMode === 'save') {
      try {
        const saveData = createNewSave(
          playerName,
          playerSprite,
          playerClass
        );
        
        // Add current game progress
        saveData.currentDialogue = currentDialogue;
        
        // Save to localStorage
        saveGame(saveData, slotId);
        
        setAlert({ message: 'Game saved successfully!', type: 'success' });
        playClickSound(soundEnabled);
        setShowSaveSlots(false);
      } catch (error) {
        console.error('Failed to save game:', error);
        setAlert({ message: 'Failed to save game', type: 'error' });
      }
    } else {
      try {
        const saveData = loadGame(slotId);
        if (!saveData) {
          setAlert({ message: 'No save data found', type: 'error' });
          return;
        }
        
        // Load game state
        dispatch(setPlayerName(saveData.playerName));
        dispatch(setPlayerSprite(saveData.playerSprite));
        dispatch(setPlayerClass(saveData.playerClass));
        
        // Set dialogue progress
        setCurrentDialogue(saveData.currentDialogue);
        if (saveData.currentDialogue < dialogueLines.length) {
          setDialogueText(dialogueLines[saveData.currentDialogue]);
        } else {
          setDialogueText('');
        }
        
        setAlert({ message: 'Game loaded successfully!', type: 'success' });
        playClickSound(soundEnabled);
        setShowSaveSlots(false);
      } catch (error) {
        console.error('Failed to load game:', error);
        setAlert({ message: 'Failed to load game', type: 'error' });
      }
    }
  };

  const handleSaveSlotsBack = () => {
    setShowSaveSlots(false);
    setShowMenu(true);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-start min-h-screen h-screen w-full p-2 bg-[#2A1810]">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

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
            className="w-[196px] h-[196px] rounded-lg flex items-center justify-center"
            style={{
              background: `${theme.secondary}40`,
              borderColor: theme.border,
              filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.7))'
            }}
          >
            <img 
              src={`/assets/sprites/character${playerSprite}.svg`} 
              alt="Player"
              className="w-[180px] h-[180px] pixelated"
              style={{
                imageRendering: 'pixelated'
              }}
            />
          </div>
        </div>

        {/* Dialogue Box */}
        {dialogueText && (
          <DialogueBox
            text={dialogueText}
            onNext={handleNextDialogue}
          />
        )}
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

      {showSaveSlots && (
        <SaveSlotManager
          onBack={handleSaveSlotsBack}
          onSelectSlot={handleSaveSlotSelect}
          mode={saveSlotMode}
          title={saveSlotMode === 'save' ? 'Save Game' : 'Load Game'}
        />
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