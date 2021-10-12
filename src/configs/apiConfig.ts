import { getUniqueId } from 'react-native-device-info';

export const ApiConfig = Object.freeze({
  host: 'https://roh.org.uk/api',
  deviceId: getUniqueId(),
  routes: {
    verifyDevice: '/auth/device',
  },
});
