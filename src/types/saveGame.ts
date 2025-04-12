import { getVersion } from '../utils/version';

export const CURRENT_SAVE_VERSION = getVersion();

export interface SaveGame {
  version: string;
  playerName: string;
  playerSprite: number;
  playerClass: string;
  playerPet: string;
  location: 'cave';
  currentDialogue: number;
  dialogueText: string;
  isPaused: boolean;
  lastSaveDate: string;
  
  // TODO: Add more state as needed:
  // inventory: InventoryItem[];
  // questProgress: Record<string, boolean>;
  // playerStats: PlayerStats;
  // etc.
}

export const createNewSave = (
  playerName: string,
  playerSprite: number,
  playerClass: string,
  playerPet: string = 'cat'
): SaveGame => {
  return {
    version,
    playerName,
    playerSprite,
    playerClass,
    playerPet,
    location: 'cave',
    currentDialogue: 0,
    dialogueText: '',
    isPaused: false,
    lastSaveDate: new Date().toISOString()
  };
}; 