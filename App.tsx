import React from 'react';
import * as Sentry from '@sentry/react-native';
import { SentryDNS } from '@configs/globalConfig';
import { Provider } from 'react-redux';
import { store } from '@services/store';
import AppLayout from '@layouts/appLayout';
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
      <AppLayout />
    </Provider>
  );
};

export default App;
