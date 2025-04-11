import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setActiveMenu } from '../state/uiState';
import { setSoundEnabled, setMusicVolume, setScreenMode, setUITheme, type ScreenMode, type UITheme } from '../state/settingsState';
import { playClickSound } from '../utils/audio';
import { useCallback, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import '../styles/background.css';

export const Settings = () => {
  const dispatch = useDispatch();
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
    settings-select-bg
    text-white 
    font-['Press_Start_2P'] 
    text-xs sm:text-sm
    px-2 sm:px-3 py-2 pr-6 sm:pr-7
    rounded-lg 
    border-2 
    min-w-[100px] sm:min-w-[120px]
    w-fit 
    appearance-none 
    cursor-pointer
    [&>option]:cursor-pointer
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
      {/* Title */}
      <div className="mb-8 sm:mb-12">
        <h1 
          className="text-4xl sm:text-5xl font-['Press_Start_2P'] text-white title-shadow"
        >
          Settings
        </h1>
      </div>

      {/* Settings Container */}
      <div className="settings-container-bg p-4 sm:p-6 rounded-lg border-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-full max-w-[500px]">
        <div className="flex flex-col gap-4 mb-8">
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
                  <div className="absolute w-full h-[24px] settings-slider-bg rounded-lg pointer-events-none border-2 border-[var(--theme-border)] overflow-hidden">
                    <div 
                      className="h-full settings-slider-fill rounded-none transition-all duration-75 pointer-events-none"
                      style={{ width: `${Math.round(localVolume * 100)}%` }}
                    />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={Math.round(localVolume * 100)}
                    onChange={handleVolumeChange}
                    onMouseDown={() => playClickSound(soundEnabled)}
                    className={`
                      w-full
                      appearance-none
                      bg-transparent
                      cursor-pointer
                      relative
                      z-10
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-[16px]
                      [&::-webkit-slider-thumb]:h-[24px]
                      [&::-webkit-slider-thumb]:bg-transparent
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:relative
                      [&::-webkit-slider-thumb]:z-10
                      [&::-moz-range-thumb]:appearance-none
                      [&::-moz-range-thumb]:w-[16px]
                      [&::-moz-range-thumb]:h-[24px]
                      [&::-moz-range-thumb]:bg-transparent
                      [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:relative
                      [&::-moz-range-thumb]:z-10
                      [&::-webkit-slider-runnable-track]:bg-transparent
                      [&::-webkit-slider-runnable-track]:h-[24px]
                      [&::-moz-range-track]:bg-transparent
                      [&::-moz-range-track]:h-[24px]
                    `}
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
                style={{ cursor: 'pointer' }}
              >
                <option value="windowed" style={{ cursor: 'pointer' }}>Windowed</option>
                <option value="fullscreen" style={{ cursor: 'pointer' }}>Fullscreen</option>
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
                style={{ cursor: 'pointer' }}
              >
                <option value="orange" style={{ cursor: 'pointer' }}>Orange</option>
                <option value="brown" style={{ cursor: 'pointer' }}>Brown</option>
                <option value="grey" style={{ cursor: 'pointer' }}>Grey</option>
                <option value="yellow" style={{ cursor: 'pointer' }}>Yellow</option>
              </select>
              <span className="absolute right-2 sm:right-2.5 top-[45%] -translate-y-1/2 text-white pointer-events-none text-[8px] sm:text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('main'));
            }}
            className="group menu-button-bg w-[160px] sm:w-[200px] h-[48px] sm:h-[52px] rounded-lg text-white font-['Press_Start_2P'] text-base sm:text-lg relative flex items-center justify-center transition-all duration-75"
          >
            <span className="text-white brightness-[1.2]">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 