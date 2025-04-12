import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MenuScreen = 'main' | 'settings' | 'characterCreator' | 'saveSlot' | 'loadGame' | 'multiplayer' | 'inventory' | 'none' | 'game';

interface UIState {
  activeMenu: MenuScreen;
  soundEnabled: boolean;
  volume: number;
  screenMode: 'windowed' | 'fullscreen';
  menuOpen: boolean;
}

const initialState: UIState = {
  activeMenu: 'main',
  soundEnabled: true,
  volume: 0.5,
  screenMode: 'windowed',
  menuOpen: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveMenu: (state, action: PayloadAction<MenuScreen>) => {
      state.activeMenu = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setScreenMode: (state, action: PayloadAction<'windowed' | 'fullscreen'>) => {
      state.screenMode = action.payload;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.menuOpen = action.payload;
    }
  }
});

export const { setActiveMenu, toggleSound, setVolume, setScreenMode, setMenuOpen } = uiSlice.actions;
export default uiSlice.reducer; 