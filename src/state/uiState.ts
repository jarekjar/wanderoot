import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  activeMenu: 'none' | 'main' | 'characterCreator' | 'saveSlot' | 'inventory' | 'settings' | 'loadGame' | 'multiplayer';
  previousMenu: 'none' | 'main' | 'characterCreator' | 'saveSlot' | 'inventory' | 'settings' | 'loadGame' | 'multiplayer';
  menuTransition: 'none' | 'forward' | 'backward';
  isPaused: boolean;
  showDialog: boolean;
  dialogText: string;
}

const initialState: UIState = {
  activeMenu: 'main',
  previousMenu: 'none',
  menuTransition: 'none',
  isPaused: false,
  showDialog: false,
  dialogText: '',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveMenu: (state, action: PayloadAction<UIState['activeMenu']>) => {
      state.previousMenu = state.activeMenu;
      state.activeMenu = action.payload;
      state.menuTransition = action.payload === 'none' ? 'backward' : 'forward';
      state.isPaused = action.payload !== 'none';
    },
    setDialog: (state, action: PayloadAction<{ show: boolean; text?: string }>) => {
      state.showDialog = action.payload.show;
      if (action.payload.text) {
        state.dialogText = action.payload.text;
      }
    },
    clearMenuTransition: (state) => {
      state.menuTransition = 'none';
    },
  },
});

export const { setActiveMenu, setDialog, clearMenuTransition } = uiSlice.actions;
export default uiSlice.reducer; 