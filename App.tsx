import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@services/store';
import AppLayout from '@layouts/appLayout';
// Enable screens
import { enableScreens } from 'react-native-screens';
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
