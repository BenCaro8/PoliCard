import { themeColors, ThemeColor } from './types';

export type ColorState = {
  [color in `--${ThemeColor}`]: string;
};

export const applyColors = (colors: Partial<ColorState>) => {
  Object.keys(colors).map((colorKey) =>
    document.documentElement.style.setProperty(
      colorKey,
      colors[colorKey as keyof ColorState] || null,
    ),
  );
};

export const getDefaultColors = () => {
  const defaultColors: Partial<ColorState> = {};

  themeColors.map((themeColor) => {
    defaultColors[themeColor] = getComputedStyle(
      document.documentElement,
    ).getPropertyValue(themeColor);
  });

  return defaultColors;
};

export const getInitialColors = (defaultColors: Partial<ColorState>) => {
  const initialColors: Partial<ColorState> = {};

  themeColors.map((themeColor) => {
    const colorValue =
      localStorage.getItem(themeColor) || defaultColors[themeColor];
    initialColors[themeColor] = colorValue;
  });

  applyColors(initialColors);

  return initialColors;
};

export const getInitialNumShapes = (): number => {
  return Number(localStorage.getItem('numShapes')) || 15;
};

export const writeNumShapesToLocalStorage = (num: number) => {
  localStorage.setItem('numShapes', num.toString());
};

export const writeColorsToLocalStorage = (colors: Partial<ColorState>) => {
  themeColors.map((themeColor) => {
    if (colors[themeColor]) {
      localStorage.setItem(themeColor, colors[themeColor]);
    }
  });
};
