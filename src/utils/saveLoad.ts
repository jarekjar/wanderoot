import { SaveGame, CURRENT_SAVE_VERSION } from '../types/saveGame';

const SAVE_KEY_PREFIX = 'wanderoot_save_slot_';

export function saveGame(saveData: SaveGame, slotId: number): void {
  try {
    const saveString = JSON.stringify(saveData);
    localStorage.setItem(SAVE_KEY_PREFIX + slotId, saveString);
  } catch (error) {
    console.error('Failed to save game:', error);
    throw new Error('Failed to save game');
  }
}

export function loadGame(slotId: number): SaveGame | null {
  try {
    const saveString = localStorage.getItem(SAVE_KEY_PREFIX + slotId);
    if (!saveString) return null;
    
    const saveData = JSON.parse(saveString) as SaveGame;
    
    // Version check for future compatibility
    if (saveData.version !== CURRENT_SAVE_VERSION) {
      console.warn('Save version mismatch. Current:', CURRENT_SAVE_VERSION, 'Save:', saveData.version);
      // TODO: Implement save migration if needed
    }
    
    return saveData;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

export function hasSaveGame(slotId: number): boolean {
  return localStorage.getItem(SAVE_KEY_PREFIX + slotId) !== null;
}

export function getAllSaveSlots(): { [key: number]: SaveGame | null } {
  const slots: { [key: number]: SaveGame | null } = {
    1: null,
    2: null,
    3: null
  };
  
  for (let i = 1; i <= 3; i++) {
    slots[i] = loadGame(i);
  }
  
  return slots;
}

export function deleteSaveGame(slotId: number): void {
  localStorage.removeItem(SAVE_KEY_PREFIX + slotId);
} 