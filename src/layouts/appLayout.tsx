import React, { useEffect, useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  introScreenShowSelector,
  deviceAuthenticatedSelector,
} from '@services/store/auth/Selectors';
import IntroScreen from '@screens/introScreen';
import LoginScreen from '@screens/loginScreen';
import MainLayout from '@layouts/mainLayout';
import { AppState, AppStateStatus } from 'react-native';
import {
  getEventListLoopStart,
  getEventListLoopStop,
} from '@services/store/events/Slices';

type TAppLayoutProps = {};
const AppLayout: React.FC<TAppLayoutProps> = () => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const showIntroScreen = useSelector(introScreenShowSelector, shallowEqual);
  const isAuthenticated = useSelector(
    deviceAuthenticatedSelector,
    shallowEqual,
  );
  useEffect(() => {
    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isAuthenticated
      ) {
        dispatch(getEventListLoopStart());
      }
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/) &&
        isAuthenticated
      ) {
        dispatch(getEventListLoopStop());
      }
      appState.current = nextAppState;
    };
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [dispatch, isAuthenticated]);
  if (showIntroScreen) {
    return <IntroScreen />;
  }
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  return <MainLayout />;
};

export default AppLayout;
