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

  const buttonClass = `
    group
    bg-[#db6616]
    w-[200px] h-[52px]
    rounded-lg
    text-white
    font-['Press_Start_2P'] text-lg
    relative
    before:absolute before:inset-0
    before:bg-black/10
    before:rounded-lg
    before:transition-opacity
    hover:before:bg-black/20
    after:absolute after:inset-0
    after:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.3)]
    after:rounded-lg
    active:after:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.3)]
    active:translate-y-[1px]
    transition-all duration-75
    flex items-center justify-center
  `.replace(/\s+/g, ' ').trim();

  const settingRowClass = `
    bg-[#b54e0f]
    box-border
    w-full h-[52px]
    rounded-lg
    px-4
    flex items-center justify-between
  `.replace(/\s+/g, ' ').trim();

  const selectClass = `
    bg-[#db6616]
    text-white 
    font-['Press_Start_2P'] 
    text-sm 
    px-3 py-2 pr-7 
    rounded-lg 
    border-2 
    border-[#b54e0f]
    min-w-[120px] 
    w-fit 
    appearance-none 
    cursor-pointer
    hover:bg-[#c45c13]
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="fixed inset-0 main-menu-bg">
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Title */}
        <div className="mb-12">
          <h1 
            className="text-6xl font-['Press_Start_2P'] text-white"
            style={{ textShadow: '4px 4px 0px #8f3e0c' }}
          >
            Settings
          </h1>
        </div>

        {/* Settings Container */}
        <div className="bg-[#db6616] p-6 rounded-lg border-4 border-[#b54e0f] shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-[500px]">
          <div className="flex flex-col gap-4 mb-8">
            {/* Sound Toggle */}
            <div className={settingRowClass}>
              <span className="text-sm font-['Press_Start_2P'] text-white">
                Sound
              </span>
              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  dispatch(setSoundEnabled(!soundEnabled));
                }}
                className="text-2xl cursor-pointer hover:opacity-80 transition-opacity mb-[6px]"
              >
                <span className="brightness-[1.2] contrast-[1.1]">
                  {soundEnabled ? '🔊' : '🔇'}
                </span>
              </button>
            </div>

            {/* Music Volume */}
            <div className={settingRowClass}>
              <span className="text-sm font-['Press_Start_2P'] text-white">
                Music Volume
              </span>
              <div className="flex items-center gap-4">
                <div className="relative w-[160px] flex items-center">
                  <div className="absolute w-full h-[24px] bg-[#db6616] rounded-lg pointer-events-none">
                    <div 
                      className="h-full bg-[#8f3e0c] rounded-lg transition-all duration-75 pointer-events-none"
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
                <span className="text-sm font-['Press_Start_2P'] text-white w-[48px]">
                  {Math.round(localVolume * 100)}%
                </span>
              </div>
            </div>

            {/* Screen Mode */}
            <div className={settingRowClass}>
              <span className="text-sm font-['Press_Start_2P'] text-white">
                Screen Mode
              </span>
              <div className="relative">
                <select 
                  className={selectClass}
                  value={screenMode}
                  onChange={handleScreenModeChange}
                >
                  <option value="windowed">Windowed</option>
                  <option value="fullscreen">Fullscreen</option>
                </select>
                <span className="absolute right-2.5 top-[45%] -translate-y-1/2 text-white pointer-events-none text-[10px]">▼</span>
              </div>
            </div>

            {/* UI Theme */}
            <div className={settingRowClass}>
              <span className="text-sm font-['Press_Start_2P'] text-white">
                UI Theme
              </span>
              <div className="relative">
                <select 
                  className={selectClass}
                  value={uiTheme}
                  onChange={handleThemeChange}
                >
                  <option value="orange">Orange</option>
                  <option value="brown">Brown</option>
                  <option value="grey">Grey</option>
                  <option value="yellow">Yellow</option>
                </select>
                <span className="absolute right-2.5 top-[45%] -translate-y-1/2 text-white pointer-events-none text-[10px]">▼</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('main'));
            }}
            className={buttonClass}
          >
            <span className="text-white brightness-[1.2]">Back</span>
          </button>
        </div>

        {/* Version */}
        <div 
          className="absolute bottom-4 left-4 font-['Press_Start_2P'] text-[#F5E6D3] text-sm"
          style={{ textShadow: '2px 2px 0px #8f3e0c' }}
        >
          v0.0.1
        </div>
      </div>
    </div>
  );
}; 