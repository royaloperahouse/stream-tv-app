import { getVersion, getBuildNumber } from 'react-native-device-info';
export const SentryDSN =
  'https://1a830de5cb974a1dbd0ed139dd5e6d7d@o936063.ingest.sentry.io/5886190';

export const buildInfo = `Build version: ${getVersion()}; build number: ${getBuildNumber()}. Only for dev mode`;

export const authBreakingTime = 1000 * 60 * 25; // 25 min
