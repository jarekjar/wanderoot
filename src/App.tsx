import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import MainMenu from './components/MainMenu';
import { Settings } from './components/Settings';
import { Game } from './components/Game';
import { CharacterCreator } from './components/CharacterCreator';
import { SaveSlotManager } from './components/SaveSlotManager';
import { VolumeButton } from './components/VolumeButton';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { playBackgroundMusic } from './utils/audio';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';
import './styles/background.css';
import './styles/menu.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'settings' | 'game' | 'character' | 'saveSlot'>('menu');
  const theme = useTheme();
  const musicVolume = useSelector((state: RootState) => state.settings.musicVolume);
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();

  // Start music after user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);

  // Play music once user has interacted
  useEffect(() => {
    if (hasInteracted) {
      playBackgroundMusic(musicVolume, soundEnabled);
    }
  }, [hasInteracted, musicVolume, soundEnabled]);

  const handleNewGame = () => {
    setCurrentScreen('character');
  };

  const handleLoadGame = () => {
    setCurrentScreen('saveSlot');
  };

  const handleCreateCharacter = () => {
    navigate('/game');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <>
      <div className="main-menu-bg" />
      <div className="min-h-screen flex items-center justify-center relative">
        <VolumeButton />
        {currentScreen === 'menu' && (
          <MainMenu 
            onNewGame={handleNewGame} 
            onLoadGame={handleLoadGame}
            onSettings={handleOpenSettings} 
          />
        )}
        {currentScreen === 'character' && (
          <CharacterCreator onBack={handleBackToMenu} onCreateCharacter={handleCreateCharacter} />
        )}
        {currentScreen === 'saveSlot' && (
          <SaveSlotManager onBack={handleBackToMenu} />
        )}
        {currentScreen === 'settings' && (
          <Settings onBack={handleBackToMenu} />
        )}
        {currentScreen === 'game' && (
          <Game onBack={handleBackToMenu} />
        )}
        
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

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/settings" element={
              <Settings onBack={() => window.history.back()} />
            } />
            <Route path="/character-creator" element={
              <CharacterCreator 
                onBack={() => window.history.back()}
                onCreateCharacter={() => {
                  window.history.back();
                }}
              />
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 