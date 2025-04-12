import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { setSoundEnabled } from '../../state/settingsState';
import { playClickSound } from '../../utils/audio';
import { useTheme } from '../../theme/ThemeContext';
import '../../styles/background.css';
import '../../styles/menu.css';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
}

export function MainMenu({ onNewGame, onLoadGame, onSettings }: MainMenuProps) {
  const dispatch = useDispatch();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const theme = useTheme();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">

      <div className="mb-8 sm:mb-12">
        <h1 
          className="text-[3rem] sm:text-[4rem] font-['Press_Start_2P'] text-white entrance-animation"
          style={{
            textShadow: `4px 4px 0px ${theme.primary}, 4px 4px 4px rgba(0, 0, 0, 0.8)`
          }}
        >
          Wanderoot
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onNewGame();
          }}
          className="group menu-button-bg w-[240px] h-[52px] rounded-lg text-white font-['Press_Start_2P'] text-lg relative flex items-center justify-center hover:brightness-110 transition-all duration-75 entrance-animation entrance-animation-delay-1"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
          }}
        >
          <span className="text-white brightness-[1.2]">New Game</span>
        </button>

        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onLoadGame();
          }}
          className="group menu-button-bg w-[240px] h-[52px] rounded-lg text-white font-['Press_Start_2P'] text-lg relative flex items-center justify-center hover:brightness-110 transition-all duration-75 entrance-animation entrance-animation-delay-2"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
          }}
        >
          <span className="text-white brightness-[1.2]">Load Game</span>
        </button>

        <button
          onClick={() => playClickSound(soundEnabled)}
          className="group menu-button-bg w-[240px] h-[52px] rounded-lg text-white font-['Press_Start_2P'] text-lg relative flex items-center justify-center hover:brightness-110 transition-all duration-75 entrance-animation entrance-animation-delay-3"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
          }}
        >
          <span className="text-white brightness-[1.2]">Co-op</span>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Coming Soon!
          </div>
        </button>

        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onSettings();
          }}
          className="group menu-button-bg w-[240px] h-[52px] rounded-lg text-white font-['Press_Start_2P'] text-lg relative flex items-center justify-center hover:brightness-110 transition-all duration-75 entrance-animation entrance-animation-delay-4"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
          }}
        >
          <span className="text-white brightness-[1.2]">Settings</span>
        </button>
      </div>
    </div>
  );
} 