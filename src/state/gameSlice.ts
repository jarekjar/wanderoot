import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  playerName: string;
  playerSprite: number;
  playerClass: string;
  playerPet: string;
  isPaused: boolean;
  currentDialogue: number;
  dialogueText: string;
  location: string;
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
  isPaused: false,
  currentDialogue: -1,
  dialogueText: '',
  location: 'cave',
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
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    setCurrentDialogue: (state, action: PayloadAction<number>) => {
      state.currentDialogue = action.payload;
    },
    setDialogueText: (state, action: PayloadAction<string>) => {
      state.dialogueText = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setPlayerPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.playerPosition = action.payload;
    },
    setPlayerDirection: (state, action: PayloadAction<'up' | 'down' | 'left' | 'right'>) => {
      state.playerDirection = action.payload;
    },
    setIsMoving: (state, action: PayloadAction<boolean>) => {
      state.isMoving = action.payload;
    }
  }
});

export const {
  setPlayerName,
  setPlayerSprite,
  setPlayerClass,
  setPlayerPet,
  setPaused,
  setCurrentDialogue,
  setDialogueText,
  setLocation,
  setPlayerPosition,
  setPlayerDirection,
  setIsMoving
} = gameSlice.actions;

export default gameSlice.reducer; 