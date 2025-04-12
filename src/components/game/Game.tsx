import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { useTheme } from '../../theme/ThemeContext';
import { playClickSound, playBackgroundMusic, updateMusicVolume } from '../../utils/audio';
import { InGameMenu } from './InGameMenu';
import { Settings } from '../menus/Settings';
import { DialogueBox } from '../ui/DialogueBox';
import { Alert } from '../ui/Alert';
import { SaveSlotManager } from '../menus/SaveSlotManager';
import { saveGame, loadGame } from '../../utils/saveLoad';
import { createNewSave } from '../../types/saveGame';
import { 
  setPlayerName, 
  setPlayerSprite, 
  setPlayerClass, 
  setPaused, 
  setCurrentDialogue, 
  setDialogueText,
  setPlayerPet,
  setHealth,
  setStamina,
  updateTime,
  updateDate
} from '../../state/gameSlice';
import { Player } from './Player';
import { getVersionWithV } from '../../utils/version';
import { Inventory } from '../ui/Inventory';
import { TimeDate } from '../ui/TimeDate';
import { MenuButton } from '../ui/MenuButton';
import { StatusBars } from '../ui/StatusBars';
import { useGameLoop } from '../../hooks/useGameLoop';

interface GameProps {
  onExitToMenu: () => void;
}

export function Game({ onExitToMenu }: GameProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const musicVolume = useSelector((state: RootState) => state.settings.musicVolume);
  const { 
    playerName, 
    playerSprite, 
    playerClass,
    playerPet,
    time,
    date,
    health,
    maxHealth,
    stamina,
    maxStamina,
    currentDialogue,
    dialogueText,
    isPaused
  } = useSelector((state: RootState) => state.game);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [saveSlotMode, setSaveSlotMode] = useState<'save' | 'load'>('save');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const dialogueLines = [
    'You wake up in a mysterious cave...',
    'With no items or memory of how you got here.'
  ];

  // Initialize game loop
  const { isPaused: gameLoopPaused, pause, resume } = useGameLoop();

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
          if (!showMenu) {
            pause();
          } else {
            resume();
          }
          playClickSound(soundEnabled);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMenu, showSettings, showSaveSlots, soundEnabled, pause, resume]);

  // Update pause state when menu visibility changes
  useEffect(() => {
    if (showMenu || showSettings || showSaveSlots) {
      pause();
    } else {
      resume();
    }
  }, [showMenu, showSettings, showSaveSlots, pause, resume]);

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
          playerClass,
          playerPet,
          time,
          date,
          health,
          maxHealth,
          stamina,
          maxStamina
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
        dispatch(setPlayerPet(saveData.playerPet));
        
        // Load time and date
        dispatch(updateTime(saveData.time));
        dispatch(updateDate(saveData.date));
        
        // Load health and stamina
        dispatch(setHealth(saveData.health));
        dispatch(setStamina(saveData.stamina));
        
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

  const handleExitGame = () => {
    playClickSound(soundEnabled);
    onExitToMenu();
  };

  const handleMenuClick = () => {
    playClickSound(soundEnabled);
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative w-full h-full">
      {/* Cave Environment */}
      <div 
        className={`fixed inset-0 ${isPaused ? 'blur-sm' : ''}`}
        style={{
          background: `linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)`,
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
        }}
      >
        {/* Cave Details */}
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

        {/* Player */}
        <div className={isPaused ? 'pointer-events-none' : ''}>
          <Player />
        </div>
      </div>

      {/* Menu Button */}
      <div className="fixed top-4 left-4 z-[70] pointer-events-auto">
        <MenuButton onClick={handleMenuClick} />
      </div>

      {/* Time and Date */}
      <div className="fixed top-4 right-4 z-[70] pointer-events-auto">
        <TimeDate />
      </div>

      {/* Inventory */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[70] pointer-events-auto">
        <Inventory />
      </div>

      {/* Status Bars */}
      <div className="fixed bottom-4 right-4 z-[70] pointer-events-auto">
        <StatusBars />
      </div>

      {/* Menu Layer */}
      <div className="fixed inset-0 z-[60]">
        <div className="relative w-full h-full flex items-center justify-center">
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
              onBack={handleSaveSlotsBack}
              onSelectSlot={handleSaveSlotSelect}
              mode={saveSlotMode}
              title={saveSlotMode === 'save' ? 'Save Game' : 'Load Game'}
            />
          )}
        </div>
      </div>

      {/* Alert Layer */}
      {alert && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-auto">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Dialogue Layer */}
      {currentDialogue >= 0 && dialogueText && (
        <div className="fixed inset-x-0 bottom-24 z-[70] flex justify-center items-center pointer-events-auto">
          <DialogueBox
            text={dialogueText}
            onNext={handleNextDialogue}
            isPaused={isPaused}
          />
        </div>
      )}
    </div>
  );
} 