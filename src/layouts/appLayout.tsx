import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  introScreenShowSelector,
  deviceAuthenticatedSelector,
} from '@services/store/auth/Selectors';
import IntroScreen from '@screens/introScreen';
import LoginScreen from '@screens/loginScreen';
import MainLayout from '@layouts/mainLayout';

type TAppLayoutProps = {};
const AppLayout: React.FC<TAppLayoutProps> = () => {
  const showIntroScreen = useSelector(introScreenShowSelector, shallowEqual);
  const isAuthenticated = useSelector(
    deviceAuthenticatedSelector,
    shallowEqual,
  );
  if (showIntroScreen) {
    return <IntroScreen />;
  }
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  return <MainLayout />;
};

export default AppLayout;
