export const settingsTitle = 'SETTINGS';

export type TSettingsSection = {
  key: string;
  navMenuItemTitle: string;
  ContentComponent: React.FC<any>;
};

export const settingsSectionsConfig: {
  [key: string]: TSettingsSection;
} = {
  account: {
    key: 'account',
    navMenuItemTitle: 'ACCOUNT',
    ContentComponent: () => null,
  },
  signOut: {
    key: 'signOut',
    navMenuItemTitle: 'SIGN OUT',
    ContentComponent: () => null,
  },
};

const collectionOfSettingsSections: Array<TSettingsSection> = Object.values(
  settingsSectionsConfig,
);

export default collectionOfSettingsSections;
