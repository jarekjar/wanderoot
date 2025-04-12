import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  playerName: string;
  playerSprite: number;
  playerClass: string;
}

const initialState: GameState = {
  playerName: '',
  playerSprite: 1,
  playerClass: 'Wanderer'
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
    }
  }
});

export const { setPlayerName, setPlayerSprite, setPlayerClass } = gameSlice.actions;
export default gameSlice.reducer; 