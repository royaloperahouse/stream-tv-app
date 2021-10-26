/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

if (!__DEV__) {
  console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
}

// TODO - remove when persistent storage issues is solved on tvOS!
LogBox.ignoreLogs([
  'Persistent storage is not supported on tvOS, your data may be removed at any point.',
]);
AppRegistry.registerComponent(appName, () => App);
