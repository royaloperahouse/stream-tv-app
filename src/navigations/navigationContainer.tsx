import React, { createRef, useCallback, useEffect, useRef } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  CommonActions,
  StackActions,
  DefaultTheme,
  Route,
} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

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
  const routeNameRef = useRef('');
  const switchNavigationToReady = useCallback(() => {
    isReady = true;
    const currentRoute = getCurrentRoute();
    if(currentRoute) {
      routeNameRef.current = currentRoute.name;
    }
  }, []);
  useEffect(() => {
    return () => {
      isReady = false;
    };
  }, []);
  const handleStateChange = async() => {
    const previousRouteName = routeNameRef.current;
    const currentRoute = getCurrentRoute();
    const currentRouteName = currentRoute ? currentRoute.name : null;
    
    if(!currentRouteName) {
      return;
    }
  
    if (previousRouteName !== currentRouteName) {
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
  
    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName;  
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={switchNavigationToReady}
      theme={customTheme}
      onStateChange={handleStateChange}
      >
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
