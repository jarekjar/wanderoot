import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setSoundEnabled } from '../state/settingsState';
import { playClickSound } from '../utils/audio';
import { useTheme } from '../theme/ThemeContext';
import '../styles/menu.css';

export function VolumeButton() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

  return (
    <button
      onClick={() => {
        playClickSound(soundEnabled);
        dispatch(setSoundEnabled(!soundEnabled));
      }}
      className="menu-button-bg fixed top-4 right-4 z-50 p-3 rounded-lg text-xl sm:text-2xl hover:opacity-80 transition-all menu-slide-up"
      style={{
        borderColor: theme.border,
        background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
      }}
    >
      <span className="brightness-[1.2] contrast-[1.1]">
        {soundEnabled ? '🔊' : '🔇'}
      </span>
    </button>
  );
} 