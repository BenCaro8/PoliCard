export const isTruthy = <T>(value?: T | null): value is T =>
  value !== null && value !== undefined;
