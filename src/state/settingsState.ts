import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ScreenMode = 'windowed' | 'fullscreen';
type UITheme = 'orange' | 'brown' | 'grey' | 'yellow';

interface SettingsState {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  screenMode: ScreenMode;
  uiTheme: UITheme;
}

const initialState: SettingsState = {
  soundEnabled: true,
  musicVolume: 0.5,
  sfxVolume: 1.0,
  screenMode: 'windowed',
  uiTheme: 'orange'
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.musicVolume = Math.max(0, Math.min(1, action.payload));
    },
    setSfxVolume: (state, action: PayloadAction<number>) => {
      state.sfxVolume = Math.max(0, Math.min(1, action.payload));
    },
    setScreenMode: (state, action: PayloadAction<ScreenMode>) => {
      state.screenMode = action.payload;
    },
    setUITheme: (state, action: PayloadAction<UITheme>) => {
      state.uiTheme = action.payload;
    }
  },
});

export const { setSoundEnabled, setMusicVolume, setSfxVolume, setScreenMode, setUITheme } = settingsSlice.actions;
export type { ScreenMode, UITheme };
export default settingsSlice.reducer; 