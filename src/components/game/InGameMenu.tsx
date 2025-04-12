import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useTheme } from '../../theme/ThemeContext';
import { playClickSound } from '../../utils/audio';
import '../../styles/background.css';
import '../../styles/menu.css';

interface InGameMenuProps {
  onClose: () => void;
  onSettings: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExit: () => void;
}

export function InGameMenu({ onClose, onSettings, onSave, onLoad, onExit }: InGameMenuProps) {
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

  const handleButtonClick = (action: () => void) => {
    playClickSound(soundEnabled);
    action();
  };

  const menuButtonClass = `
    menu-button-bg
    w-full
    h-[64px]
    rounded-lg
    border-2
    font-['Press_Start_2P']
    text-white
    text-sm
    hover:brightness-110
    transition-all
    duration-75
  `.replace(/\s+/g, ' ').trim();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        // Only trigger if clicking the backdrop directly
        if (e.target === e.currentTarget) {
          handleButtonClick(onClose);
        }
      }}
    >
      <div 
        className="relative z-10 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="mb-8">
          <h1 
            className="text-4xl font-['Press_Start_2P'] text-white entrance-animation"
            style={{
              textShadow: `4px 4px 0px ${theme.primary}, 4px 4px 4px rgba(0, 0, 0, 0.8)`
            }}
          >
            Menu
          </h1>
        </div>

        {/* Menu Container */}
        <div 
          className="p-6 rounded-lg border-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-[400px] menu-slide-up"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
          }}
        >
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleButtonClick(onClose)}
              className={`${menuButtonClass} px-8`}
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              Resume Game
            </button>

            <button
              onClick={() => handleButtonClick(onSettings)}
              className={`${menuButtonClass} px-8`}
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              Settings
            </button>

            <button
              onClick={() => handleButtonClick(onSave)}
              className={`${menuButtonClass} px-8`}
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              Save Game
            </button>

            <button
              onClick={() => handleButtonClick(onLoad)}
              className={`${menuButtonClass} px-8`}
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              Load Game
            </button>

            <button
              onClick={() => handleButtonClick(onExit)}
              className={`${menuButtonClass} px-8`}
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 