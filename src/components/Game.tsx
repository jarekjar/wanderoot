import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { useTheme } from '../theme/ThemeContext';
import { playClickSound, playBackgroundMusic, updateMusicVolume } from '../utils/audio';
import { InGameMenu } from './InGameMenu';
import { Settings } from './Settings';
import { DialogueBox } from './DialogueBox';
import { Alert } from './Alert';
import { SaveSlotManager } from './SaveSlotManager';
import { saveGame, loadGame } from '../utils/saveLoad';
import { createNewSave } from '../types/saveGame';
import { setPlayerName, setPlayerSprite, setPlayerClass, setPaused, setCurrentDialogue, setDialogueText } from '../state/gameSlice';
import { useNavigate } from 'react-router-dom';
import KnightSprite from '../assets/sprites/character1.svg';
import RangerSprite from '../assets/sprites/character2.svg';
import MageSprite from '../assets/sprites/character3.svg';
import { getVersionWithV } from '../utils/version';

const CHARACTER_SPRITES = {
  1: KnightSprite,
  2: RangerSprite,
  3: MageSprite
} as const;

export function Game() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const musicVolume = useSelector((state: RootState) => state.settings.musicVolume);
  const playerName = useSelector((state: RootState) => state.game.playerName);
  const playerSprite = useSelector((state: RootState) => state.game.playerSprite);
  const playerClass = useSelector((state: RootState) => state.game.playerClass);
  const isPaused = useSelector((state: RootState) => state.game.isPaused);
  const currentDialogue = useSelector((state: RootState) => state.game.currentDialogue);
  const dialogueText = useSelector((state: RootState) => state.game.dialogueText);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [saveSlotMode, setSaveSlotMode] = useState<'save' | 'load'>('save');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const dialogueLines = [
    'You wake up in a mysterious cave...',
    'With no items or memory of how you got here.'
  ];

  // Get the current sprite based on playerSprite ID
  const currentSprite = CHARACTER_SPRITES[playerSprite as keyof typeof CHARACTER_SPRITES] || CHARACTER_SPRITES[1];

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showSettings) {
          handleCloseSettings();
        } else if (showSaveSlots) {
          handleSaveSlotsBack();
        } else {
          setShowMenu(!showMenu);
          playClickSound(soundEnabled);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMenu, showSettings, showSaveSlots, soundEnabled]);

  // Update pause state when menu visibility changes
  useEffect(() => {
    dispatch(setPaused(showMenu || showSettings || showSaveSlots));
  }, [showMenu, showSettings, showSaveSlots, dispatch]);

  useEffect(() => {
    // Start first dialogue after a short delay
    const timer = setTimeout(() => {
      dispatch(setCurrentDialogue(0));
      dispatch(setDialogueText(dialogueLines[0]));
    }, 500);

    // Set initial location and play appropriate music
    playBackgroundMusic(musicVolume, soundEnabled, 'cave');
    
    return () => {
      clearTimeout(timer);
      // Switch back to menu music when component unmounts
      playBackgroundMusic(musicVolume, soundEnabled, 'menu');
    };
  }, []); // Only run on mount

  // Handle music volume changes
  useEffect(() => {
    if (soundEnabled) {
      updateMusicVolume(musicVolume);
    } else {
      updateMusicVolume(0);
    }
  }, [musicVolume, soundEnabled]);

  const handleNextDialogue = () => {
    if (isPaused) return; // Don't advance dialogue if game is paused
    
    playClickSound(soundEnabled);
    const nextDialogue = currentDialogue + 1;
    
    if (nextDialogue < dialogueLines.length) {
      dispatch(setCurrentDialogue(nextDialogue));
      dispatch(setDialogueText(dialogueLines[nextDialogue]));
    } else {
      dispatch(setCurrentDialogue(0));
      dispatch(setDialogueText(''));  // Clear dialogue when finished
    }
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

  const handleSaveSlotSelect = async (slotId: number) => {
    if (saveSlotMode === 'save') {
      try {
        const saveData = createNewSave(
          playerName,
          playerSprite,
          playerClass
        );
        
        // Add current game progress
        saveData.currentDialogue = currentDialogue;
        
        // Save to storage
        await saveGame(saveData, slotId);
        
        setAlert({ message: 'Game saved successfully!', type: 'success' });
        playClickSound(soundEnabled);
        setShowSaveSlots(false);
      } catch (error) {
        console.error('Failed to save game:', error);
        setAlert({ message: 'Failed to save game', type: 'error' });
      }
    } else {
      try {
        const saveData = await loadGame(slotId);
        if (!saveData) {
          setAlert({ message: 'No save data found', type: 'error' });
          return;
        }
        
        // Load game state
        dispatch(setPlayerName(saveData.playerName));
        dispatch(setPlayerSprite(saveData.playerSprite));
        dispatch(setPlayerClass(saveData.playerClass));
        
        // Set dialogue progress
        dispatch(setCurrentDialogue(saveData.currentDialogue));
        if (saveData.currentDialogue < dialogueLines.length) {
          dispatch(setDialogueText(dialogueLines[saveData.currentDialogue]));
        } else {
          dispatch(setDialogueText(''));
        }
        
        // Play appropriate music based on location
        playBackgroundMusic(musicVolume, soundEnabled, 'cave');
        
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

  const handleOpenMenu = () => {
    playClickSound(soundEnabled);
    setShowMenu(true);
  };

  const handleExitGame = () => {
    playClickSound(soundEnabled);
    navigate('/');
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
      <div className="w-full max-w-[1200px] flex items-center justify-between mb-8 p-4 settings-row-bg rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenMenu}
            className="text-white hover:opacity-80 transition-opacity px-4 py-2 rounded-lg bg-[#8B4513] hover:bg-[#A0522D]"
          >
            Menu
          </button>
          <div className="w-[48px] h-[48px] bg-[#2A1810] rounded-lg border-2 border-[#8B4513] flex items-center justify-center">
            <img 
              src={currentSprite}
              alt={`${playerClass} character`}
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src={currentSprite} 
            alt={`${playerClass} character`}
            className="w-32 h-32"
          />
        </div>

        {/* Dialogue Box */}
        {dialogueText && (
          <DialogueBox
            text={dialogueText}
            onNext={handleNextDialogue}
            isPaused={isPaused}
          />
        )}
      </div>

      {/* Menus */}
      {showMenu && (
        <InGameMenu
          onClose={handleCloseMenu}
          onSettings={handleSettings}
          onSave={handleSave}
          onLoad={handleLoad}
          onExit={handleExitGame}
        />
      )}

      {showSettings && (
        <Settings onBack={handleCloseSettings} />
      )}

      {showSaveSlots && (
        <SaveSlotManager
          mode={saveSlotMode}
          onSelectSlot={handleSaveSlotSelect}
          onBack={handleSaveSlotsBack}
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
        {getVersionWithV()}
      </div>
    </div>
  );
} 