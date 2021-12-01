import React, { createRef, useCallback, useEffect } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  CommonActions,
  StackActions,
  DefaultTheme,
  Route,
} from '@react-navigation/native';

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
    navigationRef.current.navigate(name, params);
  }
}

export function push(name: string, params: { [key: string]: any } = {}) {
  if (isReady && navigationRef.current?.dispatch) {
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

export function getCurrentRoute():
  | Route<string, object | undefined>
  | undefined {
  if (isReady && navigationRef.current?.getCurrentRoute) {
    return navigationRef.current.getCurrentRoute();
  }
}

export default ROHNavigationContainer;
