import { useTheme } from '../../theme/ThemeContext';

interface MenuButtonProps {
  onClick: () => void;
}

export function MenuButton({ onClick }: MenuButtonProps) {
  const theme = useTheme();
  
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-[60] p-3 rounded-lg hover:brightness-110 transition-all duration-75"
      style={{
        background: `${theme.secondary}95`,
        border: `2px solid ${theme.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="flex flex-col gap-1.5 w-5 h-5 justify-center">
        <div className="w-5 h-0.5 bg-white rounded-full"></div>
        <div className="w-5 h-0.5 bg-white rounded-full"></div>
        <div className="w-5 h-0.5 bg-white rounded-full"></div>
      </div>
    </button>
  );
} 