const interactionKeys = ['Enter', ' ', 'ArrowLeft', 'ArrowRight'] as const;

export type InteractionKey = (typeof interactionKeys)[number];

const navigationKeys = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
] as const;

export type NavigationKey = (typeof navigationKeys)[number];

export const keyboardKeys = [...interactionKeys, ...navigationKeys] as const;

export type KeyboardKey = (typeof keyboardKeys)[number];
