import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import MainMenu from './components/MainMenu';
import { Settings } from './components/Settings';
import { Game } from './components/Game';
import { CharacterCreator } from './components/CharacterCreator';
import { SaveSlotManager } from './components/SaveSlotManager';
import { VolumeButton } from './components/VolumeButton';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { playBackgroundMusic, updateMusicVolume } from './utils/audio';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './state/store';
import { loadGame } from './utils/saveLoad';
import { setPlayerName, setPlayerSprite, setPlayerClass } from './state/gameState';
import './styles/background.css';
import './styles/menu.css';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Redirect component to handle initial navigation
function InitialRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === '/') {
      return;
    }
    navigate('/', { replace: true });
  }, []);

  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const theme = useTheme();
  const musicVolume = useSelector((state: RootState) => state.settings.musicVolume);
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const [musicStarted, setMusicStarted] = useState(false);
  const dispatch = useDispatch();

  // Initialize music once after first interaction
  useEffect(() => {
    if (!musicStarted && soundEnabled) {
      playBackgroundMusic(musicVolume, soundEnabled);
      setMusicStarted(true);
    }
  }, [musicStarted, soundEnabled]);

  // Handle volume changes
  useEffect(() => {
    if (musicStarted) {
      updateMusicVolume(musicVolume);
    }
  }, [musicVolume, musicStarted]);

  // Handle sound enabled/disabled
  useEffect(() => {
    if (musicStarted) {
      if (soundEnabled) {
        playBackgroundMusic(musicVolume, soundEnabled);
      } else {
        updateMusicVolume(0);
      }
    }
  }, [soundEnabled, musicStarted]);

  const handleNewGame = () => {
    navigate('/character');
  };

  const handleLoadGame = () => {
    navigate('/load');
  };

  const handleCreateCharacter = () => {
    navigate('/game');
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  const handleLoadSlotSelect = (slotId: number) => {
    try {
      const saveData = loadGame(slotId);
      if (!saveData) {
        console.warn('No save data found');
        return;
      }
      
      // Load game state
      dispatch(setPlayerName(saveData.playerName));
      dispatch(setPlayerSprite(saveData.playerSprite));
      dispatch(setPlayerClass(saveData.playerClass));
      
      // Switch to game screen
      navigate('/game');
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  };

  return (
    <>
      <InitialRedirect />
      <div className="main-menu-bg" />
      <div className="min-h-screen flex items-center justify-center relative">
        <Routes>
          <Route path="/" element={
            <>
              <VolumeButton />
              <MainMenu 
                onNewGame={handleNewGame} 
                onLoadGame={handleLoadGame}
                onSettings={handleOpenSettings} 
              />
            </>
          } />
          <Route path="/character" element={
            <>
              <VolumeButton />
              <CharacterCreator onBack={handleBackToMenu} onCreateCharacter={handleCreateCharacter} />
            </>
          } />
          <Route path="/load" element={
            <>
              <VolumeButton />
              <SaveSlotManager 
                onBack={handleBackToMenu}
                onSelectSlot={handleLoadSlotSelect}
                mode="load"
                title="Load Game"
              />
            </>
          } />
          <Route path="/settings" element={
            <>
              <VolumeButton />
              <Settings onBack={handleBackToMenu} />
            </>
          } />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Version number - persistent across all screens */}
        <div 
          className="absolute bottom-4 left-4 text-white font-['Press_Start_2P'] text-xs"
          style={{
            textShadow: `2px 2px 0px ${theme.primary}, 2px 2px 4px rgba(0, 0, 0, 0.8)`
          }}
        >
          v0.1.0
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </HashRouter>
    </Provider>
  );
} 