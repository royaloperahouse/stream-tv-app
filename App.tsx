import React from 'react';
import * as Sentry from '@sentry/react-native';
import { SentryDSN } from '@configs/globalConfig';
import { Provider } from 'react-redux';
import { store } from '@services/store';
import AppLayout from '@layouts/appLayout';
import { FlagsProvider } from 'flagged';
import analytics from '@react-native-firebase/analytics';


// Pronlem with allSettled in RN 0.63, 0.64; use promise.allsettled as polyfill
if (typeof Promise.allSettled !== 'function') {
  Promise.allSettled = require('promise.allsettled');
}

const defaultAppAnalytics = analytics();

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
      <FlagsProvider features={{ hasOpera: false, canExit: false }}>
        <AppLayout />
      </FlagsProvider>
    </Provider>
  );
};

export default App;
