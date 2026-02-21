import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

export type State = {
  theme: Theme;
  development: boolean;
  replayAllNodes: boolean;
};

const initialState: State = {
  theme: 'dark',
  development: process.env.EXPO_PUBLIC_NODE_ENV === 'development',
  replayAllNodes: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      return state;
    },
    setReplayAllNodes: (state, action: PayloadAction<boolean>) => {
      state.replayAllNodes = action.payload;
      return state;
    },
  },
});

export const { setTheme, setReplayAllNodes } = settingsSlice.actions;

export default settingsSlice.reducer;
