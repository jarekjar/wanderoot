import { Provider } from 'react-redux';
import { store } from './state/store';
import { useGameLoop } from './hooks/useGameLoop';
import { useInput } from './hooks/useInput';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';
import { CharacterCreator } from './components/CharacterCreator';
import { SaveSlotManager } from './components/SaveSlotManager';
import { MainMenu } from './components/MainMenu';
import { Settings } from './components/Settings';
import { useEffect, useRef } from 'react';
import './styles/pixel-ui.css';

// Temporary sprite colors - these would be replaced with actual sprite assets
const SPRITE_COLORS: { [key: number]: string } = {
  1: '#8B4513', // SaddleBrown
  2: '#556B2F', // DarkOliveGreen
  3: '#6B8E23', // OliveDrab
};

function Game() {
  useGameLoop();
  useInput();

  const time = useSelector((state: RootState) => state.game.world.time);
  const playerPosition = useSelector((state: RootState) => state.game.player.position);
  const playerSpriteId = useSelector((state: RootState) => state.game.player.spriteId);
  const activeMenu = useSelector((state: RootState) => state.ui.activeMenu);
  const playerName = useSelector((state: RootState) => state.game.player.name);
  const currentSaveSlot = useSelector((state: RootState) => state.game.currentSaveSlot);
  const { soundEnabled, musicVolume } = useSelector((state: RootState) => state.settings);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/audio/morning-garden-acoustic-chill.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = soundEnabled ? musicVolume : 0;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle sound toggle
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = soundEnabled ? musicVolume : 0;
      if (soundEnabled && hasInteractedRef.current) {
        audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
      }
    }
  }, [soundEnabled, musicVolume]);

  // Handle user interaction
  const handleInteraction = () => {
    if (!hasInteractedRef.current && audioRef.current && soundEnabled) {
      hasInteractedRef.current = true;
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
    }
  };

  useEffect(() => {
    // Add interaction listeners
    const events = ['click', 'touchstart', 'keydown'];
    const handleGlobalInteraction = () => handleInteraction();
    
    events.forEach(event => {
      document.addEventListener(event, handleGlobalInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleGlobalInteraction);
      });
    };
  }, []);

  const isGameActive = currentSaveSlot !== null && playerName !== '';

  return (
    <div className="relative w-screen h-screen bg-gray-900 pixel-container" onClick={handleInteraction}>
      {/* Game World */}
      {isGameActive && activeMenu === 'none' && (
        <div className="absolute inset-0">
          {/* Player */}
          <div
            className="absolute w-8 h-8 rounded-full pixel-bounce"
            style={{
              left: `${playerPosition.x}px`,
              top: `${playerPosition.y}px`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: SPRITE_COLORS[playerSpriteId] || '#8B4513',
            }}
          />
        </div>
      )}

      {/* HUD */}
      {isGameActive && activeMenu === 'none' && (
        <div className="absolute top-4 left-4 pixel-hud">
          <div>Day {time.day}</div>
          <div>
            {time.hour.toString().padStart(2, '0')}:
            {time.minute.toString().padStart(2, '0')}
          </div>
          {playerName && <div className="mt-1">Player: {playerName}</div>}
        </div>
      )}

      {/* Menus */}
      {activeMenu === 'main' && <MainMenu />}
      {activeMenu === 'characterCreator' && <CharacterCreator />}
      {activeMenu === 'saveSlot' && <SaveSlotManager />}
      {activeMenu === 'settings' && <Settings />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}

export default App; 