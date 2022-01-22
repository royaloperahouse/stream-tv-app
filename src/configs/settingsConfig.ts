import { SignOut, Account } from '@components/SettingsComponents';

export const settingsTitle = 'SETTINGS';

export type TSettingsSection = {
  key: string;
  navMenuItemTitle: string;
  ContentComponent: React.FC<{ listItemGetNode?: () => number }>;
};

export const settingsSectionsConfig: {
  [key: string]: TSettingsSection;
} = {
  account: {
    key: 'account',
    navMenuItemTitle: 'ACCOUNT',
    ContentComponent: Account,
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
