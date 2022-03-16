import moment from 'moment';
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

export const subscribedModeUpdateDateSelector = (store: {
  [key: string]: any;
}) => store.auth.fullSubscriptionUpdateDate;

export const needSubscribedModeInfoUpdateSelector = (store: {
  [key: string]: any;
}) =>
  !store.auth.fullSubscription ||
  !moment(store.auth.fullSubscriptionUpdateDate).isValid() ||
  moment(store.auth.fullSubscriptionUpdateDate).dayOfYear() !==
    moment().dayOfYear() ||
  moment(store.auth.fullSubscriptionUpdateDate).year() !== moment().year();

export const userEmailSelector = (store: { [key: string]: any }) =>
  store.auth.userEmail;

export const deviceAuthenticatedInfoLoadedSelector = (store: {
  [key: string]: any;
}) => store.auth.isLoaded;
