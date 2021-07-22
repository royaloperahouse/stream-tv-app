export const introScreenShowSelector = (store: { [key: string]: any }) =>
  store.auth.showIntroScreen;

export const deviceAuthenticatedSelector = (store: { [key: string]: any }) =>
  store.auth.isAuthenticated;

export const devicePinSelector = (store: { [key: string]: any }) =>
  store.auth.devicePin;
