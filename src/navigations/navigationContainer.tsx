import React, { createRef, useCallback, useEffect } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  CommonActions,
  StackActions,
  DefaultTheme,
} from '@react-navigation/native';
import { TVMenuControl } from 'react-native';
 import 'react-native/tvos-types.d';

const navigationRef = createRef<NavigationContainerRef>();
let isReady: boolean = false;
const customTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};
type TROHNavigationContainerProps = {};
const ROHNavigationContainer: React.FC<TROHNavigationContainerProps> = ({
  children,
}) => {
  const switchNavigationToReady = useCallback(() => {
    isReady = true;
  }, []);
  useEffect(() => {
    return () => {
      isReady = false;
    };
  }, []);
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={switchNavigationToReady}
      theme={customTheme}>
      {children}
    </NavigationContainer>
  );
};

export function navigate(name: string, params: { [key: string]: any } = {}) {
  if (isReady && navigationRef.current?.navigate) {
    TVMenuControl.enableTVMenuKey();
    navigationRef.current.navigate(name, params);
  }
}

export function push(name: string, params: { [key: string]: any } = {}) {
  if (isReady && navigationRef.current?.dispatch) {
    TVMenuControl.enableTVMenuKey();
    navigationRef.current.dispatch(StackActions.push(name, params));
  }
}

export function goBack() {
  if (
    isReady &&
    navigationRef.current?.goBack &&
    navigationRef.current?.canGoBack()
  ) {
    navigationRef.current.goBack();
  } else {
    TVMenuControl.disableTVMenuKey();
  }
}

export function resetStackCacheAndNavigate(
  routesProps: Array<{ name: string; params?: { [key: string]: any } }>,
  stateIndex: number = 0,
) {
  if (isReady && navigationRef.current?.dispatch) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        routes: routesProps,
        index: stateIndex,
      }),
    );
  }
}

export default ROHNavigationContainer;
