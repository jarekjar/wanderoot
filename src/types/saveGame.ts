export interface SaveGame {
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

export const CURRENT_SAVE_VERSION = '0.1.0';

export function createNewSave(
  playerName: string,
  playerSprite: number,
  playerClass: string
): SaveGame {
  return {
    playerName,
    playerSprite,
    playerClass,
    currentDialogue: 0,
    lastSaveDate: new Date().toISOString(),
    version: CURRENT_SAVE_VERSION
  };
} 