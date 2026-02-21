import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ColorState,
  applyColors,
  getDefaultColors,
  getInitialColors,
  getInitialNumShapes,
  writeNumShapesToLocalStorage,
  writeColorsToLocalStorage,
} from '../utils/helpers';

type State = {
  isMobile: boolean;
  defaultColors: Partial<ColorState>;
  colors: Partial<ColorState>;
  numShapes: number;
};

const initialState: State = {
  isMobile: window.innerWidth <= 959,
  defaultColors: {},
  colors: {},
  numShapes: 15,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setInitialTheme: (state) => {
      state.colors = getInitialColors(state.defaultColors);
      state.numShapes = getInitialNumShapes();
    },
    setColors: (state, action: PayloadAction<Partial<ColorState>>) => {
      writeColorsToLocalStorage(action.payload);
      applyColors({ ...state.colors, ...action.payload });
      state.colors = { ...state.colors, ...action.payload };
    },
    setDefaultColors: (state) => {
      state.defaultColors = getDefaultColors();
    },
    resetToDefaultTheme: (state) => {
      writeColorsToLocalStorage(state.defaultColors);
      writeNumShapesToLocalStorage(initialState.numShapes);
      applyColors(state.defaultColors);
      state.numShapes = initialState.numShapes;
      state.colors = state.defaultColors;
    },
    setNumShapes: (state, action: PayloadAction<number>) => {
      writeNumShapesToLocalStorage(action.payload);
      state.numShapes = action.payload;
    },
  },
});

export const {
  setIsMobile,
  setInitialTheme,
  setColors,
  setDefaultColors,
  resetToDefaultTheme,
  setNumShapes,
} = settingsSlice.actions;

export default settingsSlice.reducer;
