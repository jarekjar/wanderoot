import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setActiveMenu } from '../state/uiState';
import { setOverwriteMode } from '../state/saveState';

export const SaveSlotManager = () => {
  const dispatch = useDispatch();
  const saveSlots = useSelector((state: RootState) => state.save.slots);
  const overwriteMode = useSelector((state: RootState) => state.save.overwriteMode);

  const handleSlotSelect = (slotId: number) => {
    if (overwriteMode) {
      // If in overwrite mode, confirm before proceeding
      if (saveSlots[slotId] && !window.confirm('This will overwrite the existing save. Are you sure?')) {
        return;
      }
      dispatch(setOverwriteMode(false));
      dispatch(setActiveMenu('characterCreator'));
    } else {
      // Normal load game flow
      if (saveSlots[slotId]) {
        dispatch(setActiveMenu('none')); // Start the game
      } else {
        alert('No save data found in this slot.');
      }
    }
  };

  const buttonClass = `
    bg-[#4A2510] 
    box-border
    w-full h-[52px]
    border-t-2 border-l-2 border-r-3 border-b-3
    border-t-[#5A3520] border-l-[#5A3520] 
    border-r-[#2A1810] border-b-[#2A1810] 
    text-[#E8D4B5]
    font-['Press_Start_2P'] text-lg 
    hover:bg-[#5A3520] 
    active:bg-[#3A1500]
    active:border-t-3 active:border-l-3 
    active:border-r-2 active:border-b-2
    active:border-t-[#2A1810] active:border-l-[#2A1810]
    active:border-r-[#5A3520] active:border-b-[#5A3520]
    active:translate-y-[1px]
    transition-all duration-50
    shadow-[inset_-1px_-1px_0px_0px_rgba(0,0,0,0.2)]
    hover:shadow-[inset_-1px_-1px_0px_0px_rgba(0,0,0,0.3)]
    active:shadow-[inset_1px_1px_1px_0px_rgba(0,0,0,0.3)]
    flex flex-col items-center justify-center
    p-2
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-[#8B4513]/85 p-6 rounded-lg border-4 border-[#2A1810] shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-[400px]">
        <h2 className="font-['Press_Start_2P'] text-[#E8D4B5] text-xl mb-6 text-center">
          {overwriteMode ? 'Select Slot to Overwrite' : 'Select Save Slot'}
        </h2>
        
        <div className="flex flex-col gap-4">
          {Object.entries(saveSlots).map(([id, slot]) => (
            <button
              key={id}
              onClick={() => handleSlotSelect(Number(id))}
              className={buttonClass}
            >
              {slot ? (
                <>
                  <div>{slot.farmName} Farm</div>
                  <div className="text-sm mt-1">{slot.playerName} - {slot.playTime}h</div>
                </>
              ) : (
                <div>Empty Slot {id}</div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            dispatch(setOverwriteMode(false));
            dispatch(setActiveMenu('main'));
          }}
          className={`${buttonClass} mt-6`}
        >
          Back
        </button>
      </div>
    </div>
  );
}; 