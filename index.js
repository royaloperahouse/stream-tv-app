/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

if (!__DEV__) {
  console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
}
// console.log('reg: ', AppRegistry.getAppKeys());
AppRegistry.registerComponent(appName, () => App);
