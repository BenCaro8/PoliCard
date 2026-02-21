import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  audioPlaybackRate: number;
  trackPlayerInitialized: boolean;
};

const initialState: State = {
  audioPlaybackRate: 1,
  trackPlayerInitialized: false,
};

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    adjustAudioPlaybackRate: (state) => {
      const newPlaybackRate = state.audioPlaybackRate + 1;
      state.audioPlaybackRate = newPlaybackRate <= 5 ? newPlaybackRate : 1;
      return state;
    },
    setTrackPlayerInitialized: (state, action: PayloadAction<boolean>) => {
      state.trackPlayerInitialized = action.payload;
      return state;
    },
  },
});

export const { adjustAudioPlaybackRate, setTrackPlayerInitialized } =
  audioSlice.actions;

export default audioSlice.reducer;
