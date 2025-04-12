import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { setSoundEnabled, setMusicVolume, setScreenMode, setUITheme, type ScreenMode, type UITheme } from '../../state/settingsState';
import { playClickSound } from '../../utils/audio';
import { useCallback, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useTheme } from '../../theme/ThemeContext';
import '../../styles/background.css';
import '../../styles/menu.css';
import '../../styles/range.css';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const musicVolume = useSelector((state: RootState) => state.settings.musicVolume);
  const screenMode = useSelector((state: RootState) => state.settings.screenMode);
  const uiTheme = useSelector((state: RootState) => state.settings.uiTheme);
  const [localVolume, setLocalVolume] = useState(musicVolume);

  // Sync local volume when redux state changes from outside
  useEffect(() => {
    setLocalVolume(musicVolume);
  }, [musicVolume]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement !== null;
      dispatch(setScreenMode(isFullscreen ? 'fullscreen' : 'windowed'));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [dispatch]);

  // Create a debounced dispatch function for actual volume changes
  const debouncedDispatch = useCallback(
    debounce((volume: number) => {
      dispatch(setMusicVolume(volume));
    }, 50),
    [dispatch]
  );

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value) / 100;
    setLocalVolume(newVolume); // Update visual state immediately
    debouncedDispatch(newVolume); // Debounce the actual volume change
  };

  const handleScreenModeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as ScreenMode;
    playClickSound(soundEnabled);
    
    try {
      if (newMode === 'fullscreen') {
        await document.documentElement.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error changing screen mode:', error);
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as UITheme;
    playClickSound(soundEnabled);
    dispatch(setUITheme(newTheme));
  };

  const settingRowClass = `
    settings-row-bg
    box-border
    w-full h-[52px]
    rounded-lg
    px-4
    flex items-center justify-between
  `.replace(/\s+/g, ' ').trim();

  const selectClass = `
    menu-button-bg
    text-white 
    font-['Press_Start_2P'] 
    text-xs sm:text-sm
    px-2 sm:px-3 py-2 pr-6 sm:pr-7
    rounded-lg 
    border-2 
    min-w-[100px] sm:min-w-[120px]
    w-fit 
    appearance-none 
    -webkit-appearance-none
    -moz-appearance-none
    cursor-pointer
    [&>option]:bg-[#8B4513]
    [&>option]:text-white
    [&>option]:cursor-pointer
    [&>option]:font-['Press_Start_2P']
    [&>option]:text-xs
    [&>option]:py-2
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Title */}
        <div className="mb-8">
          <h1 
            className="text-4xl font-['Press_Start_2P'] text-white entrance-animation"
            style={{
              textShadow: `4px 4px 0px ${theme.primary}, 4px 4px 4px rgba(0, 0, 0, 0.8)`
            }}
          >
            Settings
          </h1>
        </div>

        {/* Settings Container */}
        <div 
          className="p-4 rounded-lg border-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-full max-w-[500px] menu-slide-up"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
          }}
        >
          <div className="flex flex-col gap-4">
            {/* Sound Toggle */}
            <div className={settingRowClass}>
              <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
                Sound
              </span>
              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  dispatch(setSoundEnabled(!soundEnabled));
                }}
                className="text-xl sm:text-2xl cursor-pointer hover:opacity-80 transition-opacity mb-[6px]"
              >
                <span className="brightness-[1.2] contrast-[1.1]">
                  {soundEnabled ? '🔊' : '🔇'}
                </span>
              </button>
            </div>

            {/* Music Volume */}
            <div className={settingRowClass}>
              <div className="flex items-center gap-8">
                <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white whitespace-nowrap">
                  Music Volume
                </span>
                <div className="flex items-center gap-4">
                  <div className="relative w-[120px] sm:w-[160px] flex items-center">
                    <div 
                      className="absolute w-full h-[24px] menu-button-bg rounded-lg pointer-events-none border-2 overflow-hidden"
                      style={{ borderColor: theme.border }}
                    >
                      <div 
                        className="h-full rounded-none transition-all duration-75 pointer-events-none"
                        style={{ 
                          width: `${Math.round(localVolume * 100)}%`,
                          background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.primary} 100%)`
                        }}
                      />
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={Math.round(localVolume * 100)}
                      onChange={handleVolumeChange}
                      onMouseDown={() => playClickSound(soundEnabled)}
                      className="w-full appearance-none bg-transparent cursor-pointer relative z-10"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white w-[40px] sm:w-[48px]">
                    {Math.round(localVolume * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Screen Mode */}
            <div className={settingRowClass}>
              <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
                Screen Mode
              </span>
              <div className="relative cursor-pointer">
                <select 
                  className={selectClass}
                  value={screenMode}
                  onChange={handleScreenModeChange}
                  style={{ 
                    cursor: 'pointer',
                    borderColor: theme.border,
                    background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`,
                  }}
                >
                  <option value="windowed" style={{ backgroundColor: theme.secondary }}>Windowed</option>
                  <option value="fullscreen" style={{ backgroundColor: theme.secondary }}>Fullscreen</option>
                </select>
                <span className="absolute right-2 sm:right-2.5 top-[45%] -translate-y-1/2 text-white pointer-events-none text-[8px] sm:text-[10px]">▼</span>
              </div>
            </div>

            {/* UI Theme */}
            <div className={settingRowClass}>
              <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
                UI Theme
              </span>
              <div className="relative cursor-pointer">
                <select 
                  className={selectClass}
                  value={uiTheme}
                  onChange={handleThemeChange}
                  style={{ 
                    cursor: 'pointer',
                    borderColor: theme.border,
                    background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`,
                  }}
                >
                  <option value="default" style={{ backgroundColor: theme.secondary }}>Default</option>
                  <option value="brown" style={{ backgroundColor: theme.secondary }}>Brown</option>
                  <option value="grey" style={{ backgroundColor: theme.secondary }}>Grey</option>
                  <option value="yellow" style={{ backgroundColor: theme.secondary }}>Yellow</option>
                  <option value="blue" style={{ backgroundColor: theme.secondary }}>Blue</option>
                </select>
                <span className="absolute right-2 sm:right-2.5 top-[45%] -translate-y-1/2 text-white pointer-events-none text-[8px] sm:text-[10px]">▼</span>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  onBack();
                }}
                className="menu-button-bg px-8 py-3 rounded-lg font-['Press_Start_2P'] text-white text-sm hover:brightness-110 transition-all duration-75"
                style={{
                  borderColor: theme.border,
                  background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 