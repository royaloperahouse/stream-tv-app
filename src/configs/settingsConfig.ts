import {
  SignOut,
  SwitchSubscriptionMode,
} from '@components/SettingsComponents';

export const settingsTitle = 'SETTINGS';

export type TSettingsSection = {
  key: string;
  navMenuItemTitle: string;
  ContentComponent: React.FC<{ listItemGetNode?: () => number }>;
};
// TODO: put back in right order before main merge!
export const settingsSectionsConfig: {
  [key: string]: TSettingsSection;
} = {
  switchSubscriptionMode: {
    key: 'switchSubscriptionMode',
    navMenuItemTitle: 'SUBSCRIPTION',
    ContentComponent: SwitchSubscriptionMode,
  },
  account: {
    key: 'account',
    navMenuItemTitle: 'ACCOUNT',
    ContentComponent: () => null,
  },
  signOut: {
    key: 'signOut',
    navMenuItemTitle: 'SIGN OUT',
    ContentComponent: SignOut,
  },
};

const collectionOfSettingsSections: Array<TSettingsSection> = Object.values(
  settingsSectionsConfig,
);

export default collectionOfSettingsSections;
