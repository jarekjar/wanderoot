import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useTheme } from '../../theme/ThemeContext';

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

function formatDate(month: number, day: number, year: number): string {
  return `${month}/${day}/${year}`;
}

export function TimeDate() {
  const theme = useTheme();
  const { time, date } = useSelector((state: RootState) => state.game);

  return (
    <div 
      className="fixed top-4 right-4 z-50 p-3 rounded-lg"
      style={{
        background: `${theme.secondary}95`,
        border: `2px solid ${theme.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="text-right">
        <div className="text-sm font-['Press_Start_2P'] text-white mb-1">
          {formatTime(time.hour, time.minute)}
        </div>
        <div className="text-xs font-['Press_Start_2P'] text-white/80">
          {formatDate(date.month, date.day, date.year)}
        </div>
      </div>
    </div>
  );
} 