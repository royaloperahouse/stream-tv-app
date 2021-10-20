import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  introScreenShowSelector,
  deviceAuthenticatedSelector,
} from '@services/store/auth/Selectors';
import IntroScreen from '@screens/introScreen';
import LoginScreen from '@screens/loginScreen';
import MainLayout from '@layouts/mainLayout';
import { AppState, AppStateStatus, Platform } from 'react-native';
import {
  getEventListLoopStart,
  getEventListLoopStop,
} from '@services/store/events/Slices';
import RNBootSplash from 'react-native-bootsplash';
import {
  getVideoListLoopStart,
  getVideoListLoopStop,
} from '@services/store/videos/Slices';

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
        dispatch(getVideoListLoopStart());
      }
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/) &&
        isAuthenticated
      ) {
        dispatch(getEventListLoopStop());
        dispatch(getVideoListLoopStop());
      }
      appState.current = nextAppState;
    };
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [dispatch, isAuthenticated]);

  useLayoutEffect(() => {
    // we need to setup splashscreen for tvOS(iOS)
    if (Platform.OS === 'android') {
      RNBootSplash.getVisibilityStatus().then(status => {
        if (status !== 'hidden') {
          RNBootSplash.hide({ fade: true });
        }
      });
    }
  });
  if (showIntroScreen) {
    return <IntroScreen />;
  }
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  return <MainLayout />;
};

export default AppLayout;
