import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { playClickSound } from '../utils/audio';
import { getAllSaveSlots } from '../utils/saveLoad';
import { SaveGame } from '../types/saveGame';
import '../styles/background.css';
import '../styles/menu.css';

interface SaveSlotManagerProps {
  onBack: () => void;
  onSelectSlot?: (slotId: number) => void;
  mode?: 'save' | 'load';
  title?: string;
}

export function SaveSlotManager({ 
  onBack, 
  onSelectSlot, 
  mode = 'load',
  title = 'Load Game'
}: SaveSlotManagerProps) {
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const [saveSlots, setSaveSlots] = useState<{ [key: number]: SaveGame | null }>({});

  useEffect(() => {
    setSaveSlots(getAllSaveSlots());
  }, []);

  const handleSlotClick = (slotId: number) => {
    playClickSound(soundEnabled);
    if (onSelectSlot) {
      onSelectSlot(slotId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
      {/* Title */}
      <div className="mb-8 sm:mb-12">
        <h1 
          className="text-[2rem] sm:text-[2.5rem] font-['Press_Start_2P'] text-white entrance-animation"
          style={{
            textShadow: `3px 3px 0px ${theme.primary}, 3px 3px 4px rgba(0, 0, 0, 0.8)`
          }}
        >
          {title}
        </h1>
      </div>

      {/* Save Slots Container */}
      <div 
        className="p-4 sm:p-6 rounded-lg border-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-full max-w-[800px] menu-slide-up"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
        }}
      >
        <div className="flex flex-col gap-4">
          {Object.entries(saveSlots).length === 0 && mode === 'load' && (
            <div className="text-center py-8">
              <p className="text-white/70 font-['Press_Start_2P'] text-sm">
                No saved games found
              </p>
            </div>
          )}

          {Array.from({ length: 3 }).map((_, index) => {
            const slotId = index + 1;
            const saveData = saveSlots[slotId];
            const isEmpty = !saveData;

            return (
              <button
                key={index}
                onClick={() => handleSlotClick(slotId)}
                className={`menu-button-bg w-full h-[80px] rounded-lg text-white font-['Press_Start_2P'] text-sm relative flex items-center justify-between px-6 hover:brightness-110 transition-all duration-75 ${isEmpty && mode === 'load' ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  borderColor: theme.border,
                  background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
                }}
                disabled={isEmpty && mode === 'load'}
              >
                <div className="flex flex-col items-start gap-2">
                  <span className="text-white/90">
                    {isEmpty ? `Empty Save Slot ${slotId}` : saveData.playerName}
                  </span>
                  {!isEmpty && (
                    <span className="text-xs text-white/70">
                      {saveData.playerClass} - Saved: {formatDate(saveData.lastSaveDate)}
                    </span>
                  )}
                </div>
                {mode === 'save' && !isEmpty && (
                  <span className="text-xs text-white/50">Click to overwrite</span>
                )}
              </button>
            );
          })}

          {/* Back Button */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onBack();
            }}
            className="menu-button-bg w-[240px] h-[52px] rounded-lg text-white font-['Press_Start_2P'] text-lg relative flex items-center justify-center hover:brightness-110 transition-all duration-75 mx-auto mt-4"
            style={{
              borderColor: theme.border,
              background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
            }}
          >
            <span className="text-white brightness-[1.2]">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
} 