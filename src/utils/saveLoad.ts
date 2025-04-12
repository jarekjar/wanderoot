import { SaveGame, CURRENT_SAVE_VERSION } from '../types/saveGame';

const SAVE_KEY = 'wanderoot_save';

export function saveGame(saveData: SaveGame): void {
  try {
    const saveString = JSON.stringify(saveData);
    localStorage.setItem(SAVE_KEY, saveString);
  } catch (error) {
    console.error('Failed to save game:', error);
    throw new Error('Failed to save game');
  }
}

export function loadGame(): SaveGame | null {
  try {
    const saveString = localStorage.getItem(SAVE_KEY);
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

export function hasSaveGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSaveGame(): void {
  localStorage.removeItem(SAVE_KEY);
} 