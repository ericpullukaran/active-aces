export const vibrate = (pattern: number[]) => {
  if (!navigator?.vibrate) return false;

  return navigator.vibrate(pattern);
};
