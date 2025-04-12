import { SaveGame, CURRENT_SAVE_VERSION } from '../types/saveGame';
import { 
  initDB, 
  saveToIndexedDB, 
  loadFromIndexedDB, 
  getAllSavesFromIndexedDB, 
  deleteSaveFromIndexedDB 
} from './indexedDB';

const SAVE_KEY_PREFIX = 'wanderoot_save_slot_';

// Initialize IndexedDB when the module loads
initDB().catch(error => {
  console.warn('Failed to initialize IndexedDB, falling back to localStorage:', error);
});

export async function saveGame(saveData: SaveGame, slotId: number): Promise<void> {
  try {
    // Try IndexedDB first
    await saveToIndexedDB(saveData, slotId);
  } catch (error) {
    console.warn('IndexedDB save failed, falling back to localStorage:', error);
    // Fallback to localStorage
    try {
      const saveString = JSON.stringify(saveData);
      localStorage.setItem(SAVE_KEY_PREFIX + slotId, saveString);
    } catch (localError) {
      console.error('Failed to save game:', localError);
      throw new Error('Failed to save game');
    }
  }
}

export async function loadGame(slotId: number): Promise<SaveGame | null> {
  try {
    // Try IndexedDB first
    const saveData = await loadFromIndexedDB(slotId);
    if (saveData) {
      // Version check for future compatibility
      if (saveData.version !== CURRENT_SAVE_VERSION) {
        console.warn('Save version mismatch. Current:', CURRENT_SAVE_VERSION, 'Save:', saveData.version);
        // TODO: Implement save migration if needed
      }
      return saveData;
    }
  } catch (error) {
    console.warn('IndexedDB load failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
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

export async function hasSaveGame(slotId: number): Promise<boolean> {
  try {
    // Check IndexedDB first
    const save = await loadFromIndexedDB(slotId);
    if (save) return true;
  } catch (error) {
    console.warn('IndexedDB check failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  return localStorage.getItem(SAVE_KEY_PREFIX + slotId) !== null;
}

export async function getAllSaveSlots(): Promise<{ [key: number]: SaveGame | null }> {
  const slots: { [key: number]: SaveGame | null } = {
    1: null,
    2: null,
    3: null
  };
  
  try {
    // Try to get all saves from IndexedDB
    const indexedDBSaves = await getAllSavesFromIndexedDB();
    Object.assign(slots, indexedDBSaves);
  } catch (error) {
    console.warn('IndexedDB getAllSaves failed, falling back to localStorage:', error);
    // Fallback to localStorage
    for (let i = 1; i <= 3; i++) {
      try {
        const saveString = localStorage.getItem(SAVE_KEY_PREFIX + i);
        if (saveString) {
          slots[i] = JSON.parse(saveString);
        }
      } catch (localError) {
        console.error(`Error loading slot ${i} from localStorage:`, localError);
      }
    }
  }
  
  return slots;
}

export async function deleteSaveGame(slotId: number): Promise<void> {
  try {
    // Try to delete from IndexedDB
    await deleteSaveFromIndexedDB(slotId);
  } catch (error) {
    console.warn('IndexedDB delete failed, falling back to localStorage:', error);
  }

  // Always try to remove from localStorage as well
  localStorage.removeItem(SAVE_KEY_PREFIX + slotId);
} 