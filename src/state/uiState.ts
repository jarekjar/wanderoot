import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  activeMenu: 'none' | 'main' | 'characterCreator' | 'saveSlot' | 'inventory' | 'settings' | 'loadGame' | 'multiplayer';
  isPaused: boolean;
  showDialog: boolean;
  dialogText: string;
}

const initialState: UIState = {
  activeMenu: 'main',
  isPaused: false,
  showDialog: false,
  dialogText: '',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveMenu: (state, action: PayloadAction<UIState['activeMenu']>) => {
      state.activeMenu = action.payload;
      state.isPaused = action.payload !== 'none';
    },
    setDialog: (state, action: PayloadAction<{ show: boolean; text?: string }>) => {
      state.showDialog = action.payload.show;
      if (action.payload.text) {
        state.dialogText = action.payload.text;
      }
    },
  },
});

export const { setActiveMenu, setDialog } = uiSlice.actions;
export default uiSlice.reducer; 