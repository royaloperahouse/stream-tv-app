import React from 'react';
import * as Sentry from '@sentry/react-native';
import { SentryDSN } from '@configs/globalConfig';
import { Provider } from 'react-redux';
import { store } from '@services/store';
import AppLayout from '@layouts/appLayout';
import { FlagsProvider } from 'flagged';
import { decode, encode } from 'base-64';

// Pronlem with allSettled in RN 0.63, 0.64; use promise.allsettled as polyfill
if (typeof Promise.allSettled !== 'function') {
  Promise.allSettled = require('promise.allsettled');
}

if (typeof global.btoa !== 'function') {
  global.btoa = encode;
}

if (typeof global.atob !== 'function') {
  global.atob = decode;
}

// Enable screens
import { enableScreens } from 'react-native-screens';
Sentry.init({
  dsn: SentryDSN,
});
enableScreens();

type TAppProps = {};

const App: React.FC<TAppProps> = () => {
  return (
    <Provider store={store}>
      <FlagsProvider
        features={{ hasOpera: false, canExit: true, showLiveStream: false }}>
        <AppLayout />
      </FlagsProvider>
    </Provider>
  );
};

export default App;
