export const introScreenShowSelector = (store: { [key: string]: any }) =>
  store.auth.showIntroScreen;

export const deviceAuthenticatedSelector = (store: { [key: string]: any }) =>
  store.auth.isAuthenticated;

export const devicePinSelector = (store: { [key: string]: any }) =>
  store.auth.devicePin;

export const deviceAuthenticatedErrorSelector = (store: {
  [key: string]: any;
}) => store.auth.errorString;

export const subscribedModeSelector = (store: { [key: string]: any }) =>
  store.auth.fullSubscription;

export const userEmailSelector = (store: { [key: string]: any }) =>
  store.auth.userEmail;

export const deviceAuthenticatedInfoLoadedSelector = (store: {
  [key: string]: any;
}) => store.auth.isLoaded;
