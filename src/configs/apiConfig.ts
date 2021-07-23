import { getUniqueId } from 'react-native-device-info';

export const ApiConfig = Object.freeze({
  host: 'https://roh-upgrade.global.ssl.fastly.net/api',
  deviceId: getUniqueId(), //'e7df14305bc4ebd1', //
  routes: {
    verifyDevice: '/auth/device',
  },
});
