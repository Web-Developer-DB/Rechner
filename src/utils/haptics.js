const supportsVibration = () => typeof navigator !== 'undefined' && 'vibrate' in navigator;

export const triggerHaptic = (kind) => {
  if (!supportsVibration()) {
    return;
  }

  try {
    if (kind === 'tap') {
      navigator.vibrate(10);
      return;
    }

    if (kind === 'ok') {
      navigator.vibrate([15, 40, 15]);
      return;
    }

    if (kind === 'err') {
      navigator.vibrate(80);
    }
  } catch {
    // noop
  }
};
