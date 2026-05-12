/**
 * Navigation Store - Tracks navigation context when moving between different stacks
 * Particularly useful for handling back navigation from cross-stack navigation
 */

type NavigationState = {
  returnPath: string | null;
};

export const navigationStore: NavigationState = {
  returnPath: null,
};

export const setReturnPath = (path: string | null) => {
  navigationStore.returnPath = path;
};

export const getReturnPath = () => {
  return navigationStore.returnPath;
};

export const clearReturnPath = () => {
  navigationStore.returnPath = null;
};
