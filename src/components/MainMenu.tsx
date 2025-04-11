import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setActiveMenu } from '../state/uiState';
import { setSoundEnabled } from '../state/settingsState';
import { playClickSound } from '../utils/audio';
import '../styles/background.css';

export const MainMenu = () => {
  const dispatch = useDispatch();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

  const buttonClass = `
    group
    menu-button-bg
    w-[200px] sm:w-[200px] w-[160px]
    h-[52px] sm:h-[52px] h-[48px]
    rounded-lg
    text-white
    font-['Press_Start_2P'] text-lg sm:text-lg text-base
    relative
    flex items-center justify-center
    transition-all duration-75
  `.replace(/\s+/g, ' ').trim();

  const soundButtonClass = `
    sound-button-bg
    w-[48px] h-[48px]
    rounded-lg
    text-white
    text-2xl
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

  return (
    <>
      {/* Sound Toggle */}
      <div className="fixed top-0 right-0 p-4 sm:p-6 z-20">
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            dispatch(setSoundEnabled(!soundEnabled));
          }}
          className={soundButtonClass}
        >
          <span className="mb-[6px] brightness-[1.2] contrast-[1.1]">
            {soundEnabled ? '🔊' : '🔇'}
          </span>
        </button>
      </div>

      {/* Game UI */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Title */}
        <div className="mb-8 sm:mb-12">
          <h1 
            className="text-4xl sm:text-5xl font-['Press_Start_2P'] text-white title-shadow"
          >
            Wanderoot
          </h1>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('characterCreator'));
            }}
            className={buttonClass}
          >
            <span className="text-white brightness-[1.2]">New Game</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('loadGame'));
            }}
            className={buttonClass}
          >
            <span className="text-white brightness-[1.2]">Load Game</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('multiplayer'));
            }}
            className={buttonClass}
          >
            <span className="text-white brightness-[1.2]">Co-op</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('settings'));
            }}
            className={buttonClass}
          >
            <span className="text-white brightness-[1.2]">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}; 