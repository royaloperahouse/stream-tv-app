import { SignOut, Account, AppVersion } from '@components/SettingsComponents';

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
  appVersion: {
    key: 'appVersion',
    navMenuItemTitle: 'APP VERSION',
    ContentComponent: AppVersion,
  },
};

const collectionOfSettingsSections: Array<TSettingsSection> = Object.values(
  settingsSectionsConfig,
);

export default collectionOfSettingsSections;
