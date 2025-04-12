import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { MainMenu, Settings, CharacterCreator, SaveSlotManager } from './components/menus';
import { Game } from './components/game';
import { VolumeButton } from './components/ui';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { playBackgroundMusic, updateMusicVolume } from './utils/audio';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './state/store';
import { loadGame } from './utils/saveLoad';
import { setPlayerName, setPlayerSprite, setPlayerClass } from './state/gameState';
import './styles/background.css';
import './styles/menu.css';
import { getVersionWithV } from './utils/version';

type Screen = 'menu' | 'character' | 'load' | 'settings' | 'game';

function AppContent() {
  const theme = useTheme();
  const musicVolume = useSelector((state: RootState) => state.settings.musicVolume);
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const dispatch = useDispatch();
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  // Initialize music on mount
  useEffect(() => {
    playBackgroundMusic(musicVolume, soundEnabled);
  }, []); // Only run on mount

  // Handle volume changes
  useEffect(() => {
    updateMusicVolume(musicVolume);
  }, [musicVolume]);

  // Handle sound enabled/disabled
  useEffect(() => {
    if (soundEnabled) {
      playBackgroundMusic(musicVolume, soundEnabled);
    } else {
      updateMusicVolume(0);
    }
  }, [soundEnabled]);

  const handleNewGame = () => {
    setCurrentScreen('character');
  };

  const handleLoadGame = () => {
    setCurrentScreen('load');
  };

  const handleCreateCharacter = () => {
    setCurrentScreen('game');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleLoadSlotSelect = async (slotId: number) => {
    try {
      const saveData = await loadGame(slotId);
      if (!saveData) {
        console.warn('No save data found');
        return;
      }
      
      // Load game state
      dispatch(setPlayerName(saveData.playerName));
      dispatch(setPlayerSprite(saveData.playerSprite));
      dispatch(setPlayerClass(saveData.playerClass));
      
      // Switch to game screen
      setCurrentScreen('game');
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <>
            <VolumeButton />
            <MainMenu 
              onNewGame={handleNewGame} 
              onLoadGame={handleLoadGame}
              onSettings={handleOpenSettings} 
            />
          </>
        );
      case 'character':
        return (
          <>
            <VolumeButton />
            <CharacterCreator onBack={handleBackToMenu} onCreateCharacter={handleCreateCharacter} />
          </>
        );
      case 'load':
        return (
          <>
            <VolumeButton />
            <SaveSlotManager 
              onBack={handleBackToMenu}
              onSelectSlot={handleLoadSlotSelect}
              mode="load"
              title="Load Game"
            />
          </>
        );
      case 'settings':
        return (
          <>
            <VolumeButton />
            <Settings onBack={handleBackToMenu} />
          </>
        );
      case 'game':
        return <Game onExitToMenu={handleBackToMenu} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="main-menu-bg" />
      <div className="min-h-screen flex items-center justify-center relative">
        {renderScreen()}
        
        {/* Version number - persistent across all screens */}
        <div 
          className="absolute bottom-4 left-4 text-white font-['Press_Start_2P'] text-xs"
          style={{
            textShadow: `2px 2px 0px ${theme.primary}, 2px 2px 4px rgba(0, 0, 0, 0.8)`
          }}
        >
          {getVersionWithV()}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
} 