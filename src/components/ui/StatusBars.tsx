import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useTheme } from '../../theme/ThemeContext';
import HeartIcon from '../../assets/icons/heart.svg';
import LightningIcon from '../../assets/icons/lightning.svg';

interface BarProps {
  current: number;
  max: number;
  color: string;
  label: string;
  icon: string;
}

function Bar({ current, max, color, label, icon }: BarProps) {
  const percentage = (current / max) * 100;
  
  return (
    <div className="flex flex-col items-center gap-2 mb-4 last:mb-0">
      <img 
        src={icon} 
        alt={label}
        className="w-5 h-5"
      />
      <div className="h-32 w-4 bg-black/50 rounded-full overflow-hidden">
        <div
          className="w-full rounded-full transition-all duration-300"
          style={{
            height: `${percentage}%`,
            background: color,
            marginTop: `${100 - percentage}%`
          }}
        />
      </div>
      <span className="text-xs font-['Press_Start_2P'] text-white text-center -mt-1">
        {current}
      </span>
    </div>
  );
}

export function StatusBars() {
  const theme = useTheme();
  const { health, maxHealth, stamina, maxStamina } = useSelector((state: RootState) => state.game);

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 py-2 px-3 rounded-lg flex gap-4"
      style={{
        background: `${theme.secondary}95`,
        border: `2px solid ${theme.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Bar
        current={health}
        max={maxHealth}
        color="#ef4444"
        label="health"
        icon={HeartIcon}
      />
      <Bar
        current={stamina}
        max={maxStamina}
        color="#22c55e"
        label="stamina"
        icon={LightningIcon}
      />
    </div>
  );
}