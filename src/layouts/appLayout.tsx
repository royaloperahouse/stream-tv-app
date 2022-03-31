import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  introScreenShowSelector,
  deviceAuthenticatedSelector,
  deviceAuthenticatedInfoLoadedSelector,
} from '@services/store/auth/Selectors';
import {
  checkDeviceSuccess,
  checkDeviceError,
} from '@services/store/auth/Slices';
import IntroScreen from '@screens/introScreen';
import LoginScreen from '@screens/loginScreen';
import MainLayout from '@layouts/mainLayout';
import { AppState, AppStateStatus, Platform } from 'react-native';
import {
  getEventListLoopStart,
  getEventListLoopStop,
} from '@services/store/events/Slices';
import RNBootSplash from 'react-native-bootsplash';
import { verifyDevice } from '@services/apiClient';
import { useFeature } from "flagged";
import LoginWithoutQRCodeScreen from '@screens/LoginWithoutQRCodeScreen';

type TAppLayoutProps = {};
const AppLayout: React.FC<TAppLayoutProps> = () => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const showIntroScreen = useSelector(introScreenShowSelector, shallowEqual);
  const isAuthenticated = useSelector(
    deviceAuthenticatedSelector,
    shallowEqual,
  );
  const deviceAuthInfoLoaded = useSelector(
    deviceAuthenticatedInfoLoadedSelector,
    shallowEqual,
  );
  const hasQRCode = useFeature('hasQRCode');
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

  useEffect(() => {
    if (!deviceAuthInfoLoaded) {
      verifyDevice().then(response => {
        if (response?.data?.data?.attributes?.customerId) {
          dispatch(getEventListLoopStart());
          dispatch(checkDeviceSuccess(response.data));
        } else if (response?.data?.errors?.length) {
          const errObj = response.data.errors[0];
          dispatch(checkDeviceError(errObj));
        }
      });
    }
  }, [deviceAuthInfoLoaded]);

  if (
    !deviceAuthInfoLoaded ||
    (deviceAuthInfoLoaded && !isAuthenticated && showIntroScreen)
  ) {
    return <IntroScreen />;
  }
  if (!isAuthenticated) {
    return hasQRCode ? <LoginScreen /> : <LoginWithoutQRCodeScreen />;
  }
  return <MainLayout />;
};

export default AppLayout;
