import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import gameReducer from './gameSlice';
import { GameState } from './gameSlice';
import { SettingsState } from './settingsSlice';

// Define the shape of our root state
interface RootStateShape {
  settings: SettingsState;
  game: GameState;
}

// Create the store
export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    game: gameReducer
  }
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 