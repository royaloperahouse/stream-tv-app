export const isProductionEvironmentSelector = (store: { [key: string]: any }) =>
  store.settings.isProductionEnv;
