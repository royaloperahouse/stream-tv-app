import React from 'react';
import * as Sentry from '@sentry/react-native';
import { SentryDNS } from '@configs/globalConfig';
import { Provider } from 'react-redux';
import { store } from '@services/store';
import AppLayout from '@layouts/appLayout';
import { FlagsProvider } from 'flagged';

// Pronlem with allSettled in RN 0.63, 0.64; use promise.allsettled as polyfill
if (typeof Promise.allSettled !== 'function') {
  Promise.allSettled = require('promise.allsettled');
}

// Enable screens
import { enableScreens } from 'react-native-screens';
Sentry.init({
  dsn: SentryDNS,
});
enableScreens();

type TAppProps = {};

const App: React.FC<TAppProps> = () => {
  return (
    <Provider store={store}>
      <FlagsProvider features={{ hasOpera: false }}>
        <AppLayout />
      </FlagsProvider>
    </Provider>
  );
};

export default App;
