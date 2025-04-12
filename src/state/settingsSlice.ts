import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  soundEnabled: boolean;
  musicVolume: number;
  screenMode: 'fullscreen' | 'windowed';
  uiTheme: string;
}

const initialState: SettingsState = {
  soundEnabled: true,
  musicVolume: 0.5,
  screenMode: 'windowed',
  uiTheme: 'default'
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.musicVolume = action.payload;
    },
    setScreenMode: (state, action: PayloadAction<'fullscreen' | 'windowed'>) => {
      state.screenMode = action.payload;
    },
    setUiTheme: (state, action: PayloadAction<string>) => {
      state.uiTheme = action.payload;
    }
  }
});

export const {
  setSoundEnabled,
  setMusicVolume,
  setScreenMode,
  setUiTheme
} = settingsSlice.actions;

export default settingsSlice.reducer; 