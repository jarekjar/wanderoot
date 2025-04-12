import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameTime, GameDate } from '../utils/calendar';
import { gameConfig } from '../config/gameConfig';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  icon: string;
}

export interface GameState {
  playerName: string;
  playerSprite: number;
  playerClass: string;
  playerPet: string;
  location: string;
  inventory: InventoryItem[];
  time: GameTime;
  date: GameDate;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  isPaused: boolean;
  currentDialogue: number;
  dialogueText: string;
  playerPosition: {
    x: number;
    y: number;
  };
  playerDirection: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
}

const initialState: GameState = {
  playerName: '',
  playerSprite: 1,
  playerClass: '',
  playerPet: 'cat',
  location: 'cave',
  inventory: [],
  time: gameConfig.time.initialTime,
  date: gameConfig.time.initialDate,
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  isPaused: false,
  currentDialogue: -1,
  dialogueText: '',
  playerPosition: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  },
  playerDirection: 'down',
  isMoving: false
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    setPlayerSprite: (state, action: PayloadAction<number>) => {
      state.playerSprite = action.payload;
    },
    setPlayerClass: (state, action: PayloadAction<string>) => {
      state.playerClass = action.payload;
    },
    setPlayerPet: (state, action: PayloadAction<string>) => {
      state.playerPet = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    addInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const existingItem = state.inventory.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.inventory.push(action.payload);
      }
    },
    removeInventoryItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const existingItem = state.inventory.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity -= action.payload.quantity;
        if (existingItem.quantity <= 0) {
          state.inventory = state.inventory.filter(item => item.id !== action.payload.id);
        }
      }
    },
    setHealth: (state, action: PayloadAction<number>) => {
      state.health = Math.max(0, Math.min(state.maxHealth, action.payload));
    },
    setStamina: (state, action: PayloadAction<number>) => {
      state.stamina = Math.max(0, Math.min(state.maxStamina, action.payload));
    },
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    setCurrentDialogue: (state, action: PayloadAction<number>) => {
      state.currentDialogue = action.payload;
    },
    setDialogueText: (state, action: PayloadAction<string>) => {
      state.dialogueText = action.payload;
    },
    setPlayerPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.playerPosition = action.payload;
    },
    setPlayerDirection: (state, action: PayloadAction<'up' | 'down' | 'left' | 'right'>) => {
      state.playerDirection = action.payload;
    },
    setIsMoving: (state, action: PayloadAction<boolean>) => {
      state.isMoving = action.payload;
    },
    updateTime: (state, action: PayloadAction<GameTime>) => {
      state.time = action.payload;
    },
    updateDate: (state, action: PayloadAction<GameDate>) => {
      state.date = action.payload;
    }
  }
});

export const {
  setPlayerName,
  setPlayerSprite,
  setPlayerClass,
  setPlayerPet,
  setLocation,
  addInventoryItem,
  removeInventoryItem,
  setHealth,
  setStamina,
  setPaused,
  setCurrentDialogue,
  setDialogueText,
  setPlayerPosition,
  setPlayerDirection,
  setIsMoving,
  updateTime,
  updateDate
} = gameSlice.actions;

export default gameSlice.reducer; 