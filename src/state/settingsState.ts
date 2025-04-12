import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ScreenMode = 'windowed' | 'fullscreen';
type UITheme = 'default' | 'brown' | 'grey' | 'yellow' | 'blue';

interface SettingsState {
  soundEnabled: boolean;
  musicVolume: number;
  screenMode: ScreenMode;
  uiTheme: UITheme;
}

// Load initial state from localStorage or use defaults
const loadInitialState = (): SettingsState => {
  const savedSettings = localStorage.getItem('gameSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings) as SettingsState;
  }
  return {
    soundEnabled: true,
    musicVolume: 0.5,
    screenMode: 'windowed',
    uiTheme: 'default'
  };
};

const initialState = loadInitialState();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
      localStorage.setItem('gameSettings', JSON.stringify(state));
    },
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.musicVolume = Math.max(0, Math.min(1, action.payload));
      localStorage.setItem('gameSettings', JSON.stringify(state));
    },
    setScreenMode: (state, action: PayloadAction<ScreenMode>) => {
      state.screenMode = action.payload;
      localStorage.setItem('gameSettings', JSON.stringify(state));
    },
    setUITheme: (state, action: PayloadAction<UITheme>) => {
      state.uiTheme = action.payload;
      localStorage.setItem('gameSettings', JSON.stringify(state));
    }
  }
});

export const { setSoundEnabled, setMusicVolume, setScreenMode, setUITheme } = settingsSlice.actions;
export type { ScreenMode, UITheme };
export default settingsSlice.reducer; 