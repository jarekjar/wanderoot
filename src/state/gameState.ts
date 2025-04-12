import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: string;
}

export interface NPCSchedule {
  time: number;
  location: { x: number; y: number };
  action: string;
}

export interface NPC {
  position: { x: number; y: number };
  schedule: NPCSchedule[];
  dialogIndex: number;
}

export interface GameState {
  currentSaveSlot: number | null;
  player: {
    name: string;
    spriteId: number;
    position: { x: number; y: number };
    inventory: InventoryItem[];
  };
  world: {
    seed: string;
    time: {
      day: number;
      hour: number;
      minute: number;
    };
  };
  npcs: {
    [id: string]: NPC;
  };
  playerName: string;
  playerSprite: number;
  playerClass: string;
  playerPet: string;
}

const initialState: GameState = {
  currentSaveSlot: null,
  player: {
    name: '',
    spriteId: 1,
    position: { x: 0, y: 0 },
    inventory: [],
  },
  world: {
    seed: '',
    time: {
      day: 1,
      hour: 6,
      minute: 0,
    },
  },
  npcs: {},
  playerName: '',
  playerSprite: 1,
  playerClass: 'Fighter',
  playerPet: 'cat'
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setSaveSlot: (state, action: PayloadAction<number>) => {
      state.currentSaveSlot = action.payload;
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.player.name = action.payload;
      state.playerName = action.payload;
    },
    setPlayerSprite: (state, action: PayloadAction<number>) => {
      state.player.spriteId = action.payload;
      state.playerSprite = action.payload;
    },
    setPlayerPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.player.position = action.payload;
    },
    setWorldSeed: (state, action: PayloadAction<string>) => {
      state.world.seed = action.payload;
    },
    advanceTime: (state, action: PayloadAction<number>) => {
      // Advance time by minutes
      const totalMinutes = state.world.time.hour * 60 + state.world.time.minute + action.payload;
      state.world.time.hour = Math.floor(totalMinutes / 60) % 24;
      state.world.time.minute = totalMinutes % 60;
      
      if (totalMinutes >= 1440) { // 24 hours
        state.world.time.day += Math.floor(totalMinutes / 1440);
      }
    },
    setPlayerClass: (state, action: PayloadAction<string>) => {
      state.playerClass = action.payload;
    },
    setPlayerPet: (state, action: PayloadAction<string>) => {
      state.playerPet = action.payload;
    }
  },
});

export const { 
  setSaveSlot, 
  setPlayerName, 
  setPlayerSprite,
  setPlayerPosition, 
  setWorldSeed, 
  advanceTime,
  setPlayerClass,
  setPlayerPet
} = gameSlice.actions;

export default gameSlice.reducer; 