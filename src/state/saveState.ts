import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SaveSlot {
  id: number;
  playerName: string;
  farmName: string;
  dateCreated: string;
  lastPlayed: string;
  playTime: number;
}

interface SaveState {
  slots: { [key: number]: SaveSlot | null };
  overwriteMode: boolean;
}

const initialState: SaveState = {
  slots: {
    1: null,
    2: null,
    3: null
  },
  overwriteMode: false
};

const saveSlice = createSlice({
  name: 'save',
  initialState,
  reducers: {
    setSaveSlot: (state, action: PayloadAction<{ slotId: number; data: SaveSlot | null }>) => {
      const { slotId, data } = action.payload;
      state.slots[slotId] = data;
    },
    setOverwriteMode: (state, action: PayloadAction<boolean>) => {
      state.overwriteMode = action.payload;
    }
  }
});

export const { setSaveSlot, setOverwriteMode } = saveSlice.actions;
export default saveSlice.reducer; 