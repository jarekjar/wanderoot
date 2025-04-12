import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  playerName: string;
  playerSprite: number;
  playerClass: string;
  location: 'menu' | 'cave' | 'forest' | 'town';
}

const initialState: GameState = {
  playerName: '',
  playerSprite: 1,
  playerClass: '',
  location: 'menu'
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
    setLocation: (state, action: PayloadAction<GameState['location']>) => {
      state.location = action.payload;
    }
  }
});

export const { setPlayerName, setPlayerSprite, setPlayerClass, setLocation } = gameSlice.actions;
export default gameSlice.reducer; 