import { GameState } from '../state/gameSlice';

export const CURRENT_SAVE_VERSION = '0.1.0';

export interface SaveGame extends GameState {
  // Player info
  playerName: string;
  playerSprite: number;
  playerClass: string;
  
  // Game progress
  currentDialogue: number;
  
  // Game state
  lastSaveDate: string;
  version: string;
  
  // TODO: Add more state as needed:
  // inventory: InventoryItem[];
  // questProgress: Record<string, boolean>;
  // playerStats: PlayerStats;
  // etc.
}

export const createNewSave = (
  playerName: string,
  playerSprite: number,
  playerClass: string
): SaveGame => {
  return {
    version: CURRENT_SAVE_VERSION,
    playerName,
    playerSprite,
    playerClass,
    location: 'cave',
    currentDialogue: 0,
    lastSaveDate: new Date().toISOString()
  };
}; 