import { Provider } from 'react-redux';
import { store } from './state/store';
import { useGameLoop } from './hooks/useGameLoop';
import { useInput } from './hooks/useInput';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './state/store';
import { CharacterCreator } from './components/CharacterCreator';
import { SaveSlotManager } from './components/SaveSlotManager';
import { MainMenu } from './components/MainMenu';
import { Settings } from './components/Settings';
import { useEffect, useRef } from 'react';
import './styles/pixel-ui.css';
import { ThemeProvider } from './theme/ThemeContext';
import { clearMenuTransition } from './state/uiState';

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
  const menuTransition = useSelector((state: RootState) => state.ui.menuTransition);
  const playerName = useSelector((state: RootState) => state.game.player.name);
  const currentSaveSlot = useSelector((state: RootState) => state.game.currentSaveSlot);
  const { soundEnabled, musicVolume } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

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
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteractedRef.current && audioRef.current && soundEnabled) {
        hasInteractedRef.current = true;
        audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [soundEnabled]);

  // Handle animation end
  const handleAnimationEnd = () => {
    dispatch(clearMenuTransition());
  };

  const getMenuClasses = (menuName: string) => {
    if (activeMenu === menuName) {
      return `menu-content-wrapper ${menuTransition === 'forward' ? 'slide-in-right' : menuTransition === 'backward' ? 'slide-in-left' : ''}`;
    }
    return `menu-content-wrapper ${menuTransition === 'forward' ? 'slide-out-left' : menuTransition === 'backward' ? 'slide-out-right' : 'hidden'}`;
  };

  const isGameActive = currentSaveSlot !== null && playerName !== '';

  return (
    <div className="relative w-screen h-screen bg-gray-900 pixel-container">
      {/* Permanent Background */}
      <div className="fixed inset-0 main-menu-bg" />

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

      {/* Version Number */}
      <div className="fixed bottom-4 left-4 font-['Press_Start_2P'] text-[#F5E6D3] text-sm version-shadow z-50">
        v0.0.1
      </div>

      {/* Menus */}
      {activeMenu === 'main' && (
        <div className={getMenuClasses('main')} onAnimationEnd={handleAnimationEnd}>
          <MainMenu />
        </div>
      )}
      {activeMenu === 'characterCreator' && (
        <div className={getMenuClasses('characterCreator')} onAnimationEnd={handleAnimationEnd}>
          <CharacterCreator />
        </div>
      )}
      {activeMenu === 'saveSlot' && (
        <div className={getMenuClasses('saveSlot')} onAnimationEnd={handleAnimationEnd}>
          <SaveSlotManager />
        </div>
      )}
      {activeMenu === 'settings' && (
        <div className={getMenuClasses('settings')} onAnimationEnd={handleAnimationEnd}>
          <Settings />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    </Provider>
  );
}

export default App; 