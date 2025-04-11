import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setActiveMenu } from '../state/uiState';
import { setSoundEnabled } from '../state/settingsState';
import { playClickSound } from '../utils/audio';
import '../styles/background.css';

const AnimatedText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  return (
    <div className="flex">
      {text.split('').map((char, i) => (
        <div 
          key={i} 
          className={`${char === ' ' ? 'w-4' : ''} transition-transform group-hover:animate-float text-white brightness-[1.2]`}
          style={{
            animationDelay: `${delay + i * 0.1}s`
          }}
        >
          {char}
        </div>
      ))}
    </div>
  );
};

export const MainMenu = () => {
  const dispatch = useDispatch();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

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

  const soundButtonClass = `
    bg-[#db6616]
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
    <div className="fixed inset-0 main-menu-bg">
      {/* Sound Toggle */}
      <div className="fixed top-0 right-0 p-6 z-20">
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Title */}
        <div className="mb-12">
          <h1 
            className="text-7xl font-['Press_Start_2P'] text-white"
            style={{ textShadow: '4px 4px 0px #8f3e0c' }}
          >
            Wanderoot
          </h1>
        </div>

        {/* Menu Container */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('characterCreator'));
            }}
            className={buttonClass}
          >
            <AnimatedText text="NEW GAME" />
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('loadGame'));
            }}
            className={buttonClass}
          >
            <AnimatedText text="LOAD GAME" delay={0.2} />
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              dispatch(setActiveMenu('settings'));
            }}
            className={buttonClass}
          >
            <AnimatedText text="SETTINGS" delay={0.4} />
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