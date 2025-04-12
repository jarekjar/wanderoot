import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  playerName: string;
  playerSprite: number;
  playerClass: string;
  playerPet: string;
  location: 'menu' | 'cave' | 'forest' | 'town';
  isPaused: boolean;
  currentDialogue: number;
  dialogueText: string;
}

const initialState: GameState = {
  playerName: '',
  playerSprite: 1,
  playerClass: '',
  playerPet: 'cat',
  location: 'menu',
  isPaused: false,
  currentDialogue: 0,
  dialogueText: ''
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
    setLocation: (state, action: PayloadAction<GameState['location']>) => {
      state.location = action.payload;
    },
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    setCurrentDialogue: (state, action: PayloadAction<number>) => {
      state.currentDialogue = action.payload;
    },
    setDialogueText: (state, action: PayloadAction<string>) => {
      state.dialogueText = action.payload;
    }
  }
});

export const { 
  setPlayerName, 
  setPlayerSprite, 
  setPlayerClass, 
  setPlayerPet,
  setLocation, 
  setPaused,
  setCurrentDialogue,
  setDialogueText
} = gameSlice.actions;
export default gameSlice.reducer; 