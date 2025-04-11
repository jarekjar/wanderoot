import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameState';
import uiReducer from './uiState';
import settingsReducer from './settingsState';
import saveReducer from './saveState';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
    settings: settingsReducer,
    save: saveReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 