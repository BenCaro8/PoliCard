export const PRIMARY_ACCENT_COLOR = '#3952a3';

export const PRIMARY_BG_COLOR = '#25292e';
export const SECONDARY_BG_COLOR = '#121417';

export const PRIMARY_FONT_COLOR = '#FFFFFF';
export const SECONDARY_FONT_COLOR = '#FFFFFF';

export const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '');

  let r, g, b;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return 'rgba(0, 0, 0, 0)';
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha === undefined ? 1 : alpha})`;
};
