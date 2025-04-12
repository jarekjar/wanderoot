import { getVersion } from '../utils/version';
import { GameTime, GameDate } from '../state/gameSlice';

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
  time: GameTime;
  date: GameDate;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  
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
  playerPet: string = 'cat',
  time: GameTime = { hour: 23, minute: 30 },
  date: GameDate = { year: 1995, month: 7, day: 4 },
  health: number = 100,
  maxHealth: number = 100,
  stamina: number = 100,
  maxStamina: number = 100
): SaveGame => {
  return {
    version: CURRENT_SAVE_VERSION,
    playerName,
    playerSprite,
    playerClass,
    playerPet,
    location: 'cave',
    currentDialogue: 0,
    dialogueText: '',
    isPaused: false,
    lastSaveDate: new Date().toISOString(),
    time,
    date,
    health,
    maxHealth,
    stamina,
    maxStamina
  };
}; 