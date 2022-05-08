import {
  SignOut,
  Account,
  AppVersion,
  SwitchingBetweenEnvironments,
} from '@components/SettingsComponents';
import { store } from '@services/store';
export const settingsTitle = 'SETTINGS';

export type TSettingsSection = {
  key: string;
  navMenuItemTitle: string;
  ContentComponent: React.FC<{ listItemGetNode?: () => number }>;
};

export const getSettingsSectionsConfig: () => {
  [key: string]: TSettingsSection;
} = () => {
  const settingsSections: {
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
  if (store.getState().auth.userEmail.includes('roh.org.uk')) {
    settingsSections.switchingBetweenEnv = {
      key: 'switchingBetweenEnv',
      navMenuItemTitle: 'ENVIRONMENT SWITCHING',
      ContentComponent: SwitchingBetweenEnvironments,
    };
  }
  return settingsSections;
};

export default () => Object.values(getSettingsSectionsConfig());
