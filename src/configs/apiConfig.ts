import { getUniqueId } from 'react-native-device-info';

const upgradeEnv = 'https://roh-upgrade.global.ssl.fastly.net/api';
const stagingEnv = 'https://roh-stagev2.global.ssl.fastly.net/api';

export const ApiConfig = Object.freeze({
  host: 'https://roh.org.uk/api',
  deviceId: getUniqueId(),
  manifestURL: stagingEnv,
  routes: {
    verifyDevice: '/auth/device',
    videoSource: '/video-source?id=',
  },
});
