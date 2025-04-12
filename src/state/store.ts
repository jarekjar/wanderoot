import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsState';
import gameReducer from './gameSlice';
import { GameState } from './gameSlice';

export interface RootState {
  settings: {
    soundEnabled: boolean;
    musicVolume: number;
    screenMode: 'fullscreen' | 'windowed';
    uiTheme: string;
  };
  game: GameState;
}

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    game: gameReducer
  }
}); 